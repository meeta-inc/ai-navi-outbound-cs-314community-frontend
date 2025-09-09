import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Square, Send, Volume2, Check, User, Bot, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../../../contexts/LocaleContext';
import { SpeechRecognitionService } from '../../../services/speechRecognition';
import { Button } from '../../atoms/Button';
import { getColorClasses } from '../../../shared/config/theme.config';
import { getAccentColor } from '../../../shared/config/app.config';
import { openAITTSService } from '../../../services/openai/ttsService';
import { sendChatMessage } from '../../../services/api/chat';
import { DemoVoiceService, demoVoiceService } from '../../../services/demo/demoVoiceService';
import type { LLMResponse } from '../../../types';

// 데모 모드용 window 확장
declare global {
  interface Window {
    __demoVoiceFile?: string;
  }
}

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (transcript: string) => void;
  onChatUpdate?: (userMessage: string, botResponse: string, llmResponse?: LLMResponse) => void;
  userId?: string;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function VoiceInputModal({ 
  isOpen, 
  onClose, 
  onTranscript, 
  onChatUpdate,
  userId = 'default' 
}: VoiceInputModalProps) {
  const { t } = useLocale();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [displayTranscript, setDisplayTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // 현재 대화 표시용 (1개 사용자 + 1개 AI)
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // 침묵 감지용
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const autoSendEnabled = import.meta.env.VITE_VOICE_AUTO_SEND === 'true';
  const silenceDuration = parseInt(import.meta.env.VITE_VOICE_SILENCE_DURATION || '1500');
  const ttsAutoPlay = import.meta.env.VITE_TTS_AUTO_PLAY === 'true';
  
  // 데모 모드 체크
  const isDemoMode = DemoVoiceService.isDemoMode();
  
  const recognitionService = useRef<SpeechRecognitionService | null>(null);
  const animationRef = useRef<number>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const durationIntervalRef = useRef<NodeJS.Timeout>();
  
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

  // Initialize demo mode
  useEffect(() => {
    if (isDemoMode && isOpen) {
      // 데모 모드일 때 시나리오 프리로드
      demoVoiceService.loadScenarios().catch(error => {
        console.error('[Demo Mode] Failed to load scenarios:', error);
      });
    }
  }, [isDemoMode, isOpen]);

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognitionService.isSupported()) {
      setError('お使いのブラウザは音声認識をサポートしていません');
      return;
    }

    recognitionService.current = new SpeechRecognitionService();
    recognitionService.current.initialize({
      lang: 'ja-JP',
      continuous: true,
      interimResults: true
    });

    recognitionService.current.setCallbacks({
      onResult: (text, isFinal) => {
        if (isFinal) {
          setTranscript(text);
          animateTyping(text);
          
          // 침묵 감지: 최종 텍스트가 있고 자동 전송이 활성화된 경우
          if (autoSendEnabled && text.trim()) {
            // 기존 타이머 클리어
            if (silenceTimer) {
              clearTimeout(silenceTimer);
            }
            
            // 새 타이머 설정 (침묵 기간 후 자동 전송)
            const timer = setTimeout(() => {
              // 녹음 중지 및 전송
              if (recognitionService.current) {
                recognitionService.current.stop();
                setIsRecording(false);
                // handleSend 함수를 직접 호출할 수 없으므로 transcript 상태 업데이트로 트리거
                setTimeout(() => {
                  const sendButton = document.querySelector('[data-send-button]') as HTMLButtonElement;
                  if (sendButton) {
                    sendButton.click();
                  }
                }, 100);
              }
            }, silenceDuration);
            
            setSilenceTimer(timer);
          }
        } else {
          setDisplayTranscript(text);
        }
      },
      onError: (err) => {
        setError(err.message);
        setIsRecording(false);
        setIsProcessing(false);
        setRecordingDuration(0);
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          setSilenceTimer(null);
        }
      },
      onEnd: () => {
        setIsRecording(false);
        setIsProcessing(false);
        setRecordingDuration(0);
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          setSilenceTimer(null);
        }
      }
    });

    return () => {
      recognitionService.current?.destroy();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Recording duration timer
  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
    
    // 침묵 감지 타이머 초기화
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isRecording]);

  // Typing animation
  const animateTyping = (text: string) => {
    setDisplayTranscript('');
    let index = 0;
    
    const typeNext = () => {
      if (index < text.length) {
        setDisplayTranscript(text.slice(0, index + 1));
        index++;
        typingTimeoutRef.current = setTimeout(typeNext, 30);
      }
    };
    
    typeNext();
  };

  // Audio level animation
  useEffect(() => {
    if (isRecording) {
      const animateLevel = () => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
        animationRef.current = requestAnimationFrame(animateLevel);
      };
      animateLevel();
    } else {
      setAudioLevel(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isRecording]);

  // Handle recording start
  const startRecording = async () => {
    if (!recognitionService.current) {
      setError('音声認識サービスが利用できません');
      return;
    }

    setTranscript('');
    setDisplayTranscript('');
    setError(null);
    
    try {
      await recognitionService.current.start();
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '録音の開始に失敗しました');
    }
  };

  // Handle recording stop
  const stopRecording = () => {
    if (recognitionService.current) {
      recognitionService.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  // 음성 대화 처리 함수
  const handleVoiceConversation = async (userInput: string) => {
    try {
      // 1. 현재 대화에 사용자 입력 추가
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: userInput,
        timestamp: new Date()
      };
      setCurrentConversation([userMessage]);
      
      // 2. 대기 상태 표시
      setIsWaitingForResponse(true);
      
      let responseText = '';
      let audioBuffer: ArrayBuffer | undefined;
      
      // 3. 데모 모드 또는 실제 API 호출 분기
      if (isDemoMode) {
        // 데모 모드: 시나리오 기반 응답
        console.log('[Demo Mode] Processing user input:', userInput);
        
        // 데모 모드에서 1초 지연 추가 (로딩 시뮬레이션)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoResponse = await demoVoiceService.processUserInput(userInput);
        responseText = demoResponse.text;
        
        // 데모 모드에서는 직접 재생용 voiceFile 사용
        if (demoResponse.voiceFile && ttsAutoPlay) {
          // 나중에 직접 재생할 voiceFile 저장
          window.__demoVoiceFile = demoResponse.voiceFile;
        }
        
        // 데모 응답을 LLM 형식으로 변환 (채팅 화면 호환성)
        if (onChatUpdate) {
          const mockLLMResponse: LLMResponse = {
            response: [
              {
                type: 'main',
                text: responseText
              }
            ],
            status: 200
          };
          onChatUpdate(userInput, responseText, mockLLMResponse);
        }
      } else {
        // 실제 모드: Chat API 호출
        const response = await sendChatMessage(userInput, userId);
        
        if (response.llmResponse) {
          // main 버블만 추출
          const mainBubble = response.llmResponse.response.find(
            bubble => bubble.type === 'main'
          );
          
          if (mainBubble && mainBubble.text) {
            responseText = mainBubble.text;
            
            // TTS를 위한 음성 생성
            if (ttsAutoPlay && openAITTSService.isConfigured()) {
              try {
                audioBuffer = await openAITTSService.synthesizeSpeech(responseText);
              } catch (ttsError) {
                console.error('TTS Error:', ttsError);
              }
            }
            
            // 채팅 화면에 전체 대화 전달
            if (onChatUpdate) {
              onChatUpdate(userInput, responseText, response.llmResponse);
            }
          }
        }
      }
      
      // 4. AI 응답을 현재 대화에 추가
      if (responseText) {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: responseText,
          timestamp: new Date()
        };
        setCurrentConversation([userMessage, botMessage]);
        
        // 5. 음성 재생 (데모 또는 TTS)
        if (isDemoMode && window.__demoVoiceFile && ttsAutoPlay) {
          // 데모 모드: 직접 재생
          setIsSpeaking(true);
          try {
            await demoVoiceService.playAudioDirect(window.__demoVoiceFile);
            delete window.__demoVoiceFile; // 재생 후 정리
          } catch (playError) {
            console.error('Demo audio playback error:', playError);
          } finally {
            setIsSpeaking(false);
          }
        } else if (audioBuffer && ttsAutoPlay) {
          // 실제 모드: TTS ArrayBuffer 재생
          setIsSpeaking(true);
          try {
            await openAITTSService.playAudio(audioBuffer);
          } catch (playError) {
            console.error('Audio playback error:', playError);
          } finally {
            setIsSpeaking(false);
          }
        }
      }
    } catch (error) {
      console.error('Voice conversation error:', error);
      setError('応答の取得に失敗しました');
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  // Handle send
  const handleSend = async () => {
    if (transcript.trim()) {
      setIsSending(true);
      
      try {
        // 음성 대화 처리
        await handleVoiceConversation(transcript.trim());
        
        // 성공 상태 표시
        setSendSuccess(true);
        
        // 2초 후 다음 대화 준비
        setTimeout(() => {
          // 상태 초기화 (모달은 열어둠)
          setTranscript('');
          setDisplayTranscript('');
          setSendSuccess(false);
          setIsSending(false);
        }, 2000);
        
      } catch (error) {
        setError('メッセージの送信に失敗しました');
        setIsSending(false);
      }
    }
  };

  // Close modal with ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Format recording duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Modern Waveform component inspired by ChatGPT
  const ModernWaveform = () => {
    const bars = Array.from({ length: 40 }, (_, i) => i);
    
    return (
      <div className="flex items-center justify-center gap-1 h-20">
        {bars.map((bar) => {
          const baseHeight = 4;
          const maxHeight = isRecording ? 60 : baseHeight;
          const animatedHeight = isRecording 
            ? baseHeight + (Math.sin((Date.now() / 100) + bar * 0.3) * 0.5 + 0.5) * (maxHeight - baseHeight)
            : baseHeight;
          
          return (
            <motion.div
              key={bar}
              className={`w-1 rounded-full ${
                isRecording 
                  ? colors.background
                  : 'bg-gray-300'
              }`}
              animate={{
                height: animatedHeight,
                opacity: isRecording ? 0.8 + Math.random() * 0.2 : 0.3,
              }}
              transition={{
                duration: 0.1,
                ease: "easeOut"
              }}
            />
          );
        })}
      </div>
    );
  };

  // Pulse animation for recording button
  const PulseRing = () => (
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-red-400"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.8, 0, 0.8],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8 
            }}
            className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md mx-4 z-[9999] overflow-hidden"
            style={{ 
              maxHeight: '85vh',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">AI音声相談</h3>
                {isDemoMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs font-semibold text-white">DEMO</span>
                  </motion.div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="閉じる"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-6 mb-4"
                >
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                      <span className="text-sm text-red-700 font-medium">{error}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main content area */}
            <div className="px-6 pb-6">
              {/* Current conversation display */}
              <AnimatePresence>
                {currentConversation.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 space-y-3"
                  >
                    {currentConversation.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'bot' && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            message.type === 'user'
                              ? `${colors.background} text-white`
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm font-medium">{message.content}</p>
                        </div>
                        {message.type === 'user' && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* AI 응답 대기 중 표시 */}
                    {isWaitingForResponse && !isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2 justify-start"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ 
                                  y: [0, -5, 0],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 1.2, 
                                  repeat: Infinity,
                                  delay: i * 0.2 
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* TTS 재생 중 표시 - 음성 파형 효과 추가 */}
                    {isSpeaking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2 justify-start"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <Volume2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                          <div className="flex items-center gap-2">
                            {/* 음성 파형 애니메이션 */}
                            <div className="flex gap-1 items-center">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                  key={i}
                                  className={`w-1 ${colors.accent} rounded-full`}
                                  animate={{
                                    height: [4, 12, 8, 16, 4],
                                    opacity: [0.6, 1, 0.8, 1, 0.6]
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                  }}
                                  style={{ 
                                    minHeight: '4px',
                                    backgroundColor: colors.accent.includes('blue') ? '#3B82F6' : 
                                                     colors.accent.includes('green') ? '#10B981' :
                                                     colors.accent.includes('purple') ? '#8B5CF6' :
                                                     colors.accent.includes('red') ? '#EF4444' : '#F59E0B'
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              音声再生中...
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Waveform visualization */}
              <div className="bg-gray-50 rounded-3xl p-6 mb-6 relative overflow-hidden">
                {/* Background gradient effect */}
                <div className={`absolute inset-0 opacity-20 ${
                  isRecording 
                    ? `bg-gradient-to-br ${colors.gradient.from} ${colors.gradient.to}`
                    : 'bg-gradient-to-br from-gray-300 to-gray-400'
                }`} />
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm" />
                    <span className="text-sm font-medium text-gray-700">
                      {formatDuration(recordingDuration)}
                    </span>
                  </div>
                )}
                
                <ModernWaveform />
              </div>

              {/* Status message */}
              <div className="text-center mb-6">
                <AnimatePresence mode="wait">
                  {sendSuccess ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <motion.div
                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <motion.div
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        >
                          <Check className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>
                      <motion.span 
                        className="text-lg font-semibold text-green-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        応答完了！
                      </motion.span>
                    </motion.div>
                  ) : isSending ? (
                    <motion.div
                      key="sending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <motion.div
                        className={`w-16 h-16 ${colors.background} rounded-full flex items-center justify-center relative overflow-hidden`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        {isSpeaking ? (
                          <Volume2 className="w-8 h-8 text-white" />
                        ) : (
                          <Send className="w-8 h-8 text-white" />
                        )}
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{ 
                            x: ['-100%', '100%'],
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-700">
                        {isSpeaking ? '音声出力中...' : '送信中...'}
                      </span>
                    </motion.div>
                  ) : isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center justify-center gap-3 ${colors.text}`}
                    >
                      <motion.div
                        className={`w-6 h-6 border-2 ${colors.border} border-t-transparent rounded-full`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="font-medium">音声を処理中...</span>
                    </motion.div>
                  ) : isRecording ? (
                    <motion.div
                      key="recording"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <Volume2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-800">
                        話してください...
                      </span>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-gray-600 font-medium"
                    >
                      マイクボタンを押して話してください
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Transcript display */}
              <AnimatePresence>
                {(transcript || displayTranscript) && !sendSuccess && !isSending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="mb-6"
                  >
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-start gap-3">
                        <motion.div 
                          className={`w-10 h-10 ${colors.background} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}
                          animate={{ 
                            boxShadow: displayTranscript 
                              ? ["0 4px 20px rgba(59, 130, 246, 0.3)", "0 4px 20px rgba(99, 102, 241, 0.4)", "0 4px 20px rgba(59, 130, 246, 0.3)"]
                              : "0 4px 20px rgba(59, 130, 246, 0.2)"
                          }}
                          transition={{ duration: 1.5, repeat: displayTranscript ? Infinity : 0 }}
                        >
                          <span className="text-white text-lg">🎤</span>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                              音声認識
                            </p>
                            {displayTranscript && (
                              <motion.div
                                className="flex gap-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className={`w-1 h-1 ${colors.accent} rounded-full`}
                                    animate={{ 
                                      scale: [1, 1.5, 1],
                                      opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ 
                                      duration: 1, 
                                      repeat: Infinity,
                                      delay: i * 0.2 
                                    }}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </div>
                          <div className="relative">
                            <p className="text-gray-800 leading-relaxed min-h-[24px] text-base font-medium">
                              {displayTranscript || transcript}
                              {displayTranscript && (
                                <motion.span
                                  className={`inline-block w-0.5 h-6 ${colors.accent} ml-1 rounded-full`}
                                  animate={{ opacity: [1, 0, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 min-h-[80px] relative">
                {/* Record/Stop button */}
                <div className="relative flex-shrink-0">
                  {isRecording && <PulseRing />}
                  
                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing || isSending || !SpeechRecognitionService.isSupported()}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isRecording
                        ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-300'
                        : `bg-gradient-to-br ${colors.background} hover:opacity-90 shadow-lg`
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <AnimatePresence mode="wait">
                      {isRecording ? (
                        <motion.div
                          key="stop"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Square className="w-6 h-6 text-white" fill="currentColor" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="mic"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Mic className="w-8 h-8 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Hidden send button for auto-send functionality */}
                {transcript && !isRecording && (
                  <button
                    data-send-button
                    onClick={handleSend}
                    className="hidden"
                    aria-hidden="true"
                  />
                )}
                
                {/* Sending animation - 주석처리됨 (마이크 옆 전송 버튼 제거) */}
                {/* <AnimatePresence>
                  {isSending && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`absolute right-0 w-16 h-16 rounded-full ${colors.background} flex items-center justify-center shadow-xl`}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      <motion.div
                        className={`absolute inset-0 border-2 ${colors.border} rounded-full`}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence> */}
              </div>

              {/* Instructions */}
              <motion.div 
                className="mt-6 text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>録音開始</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>録音停止</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto px-4">
                  {isDemoMode 
                    ? 'デモモード：事前定義された応答を使用しています' 
                    : '音声認識の精度向上のため、静かな環境でご利用ください'}
                </p>
              </motion.div>
            </div>

            {/* Bottom gradient for visual depth */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}