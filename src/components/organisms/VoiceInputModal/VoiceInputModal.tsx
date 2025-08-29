import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Square, Send, Volume2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../../../contexts/LocaleContext';
import { SpeechRecognitionService } from '../../../services/speechRecognition';
import { Button } from '../../atoms/Button';
import { getColorClasses } from '../../../shared/config/theme.config';
import { getAccentColor } from '../../../shared/config/app.config';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (transcript: string) => void;
}

export function VoiceInputModal({ isOpen, onClose, onTranscript }: VoiceInputModalProps) {
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
  
  const recognitionService = useRef<SpeechRecognitionService | null>(null);
  const animationRef = useRef<number>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const durationIntervalRef = useRef<NodeJS.Timeout>();
  
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

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
        } else {
          setDisplayTranscript(text);
        }
      },
      onError: (err) => {
        setError(err.message);
        setIsRecording(false);
        setIsProcessing(false);
        setRecordingDuration(0);
      },
      onEnd: () => {
        setIsRecording(false);
        setIsProcessing(false);
        setRecordingDuration(0);
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

  // Handle send
  const handleSend = async () => {
    if (transcript.trim()) {
      setIsSending(true);
      
      try {
        // 송신 애니메이션 시작
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // LLM으로 메시지 전송
        onTranscript(transcript.trim());
        
        // 성공 상태 표시
        setSendSuccess(true);
        
        // 1.5초 후 모달 닫기
        setTimeout(() => {
          onClose();
          // 상태 초기화
          setTranscript('');
          setDisplayTranscript('');
          setSendSuccess(false);
          setIsSending(false);
        }, 1500);
        
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
                  ? 'bg-gradient-to-t from-green-400 to-green-600' 
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
            className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md mx-4 z-10 overflow-hidden"
            style={{ 
              maxHeight: '85vh',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-xl font-bold text-gray-900">音声入力</h3>
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
              {/* Waveform visualization */}
              <div className="bg-gray-50 rounded-3xl p-6 mb-6 relative overflow-hidden">
                {/* Background gradient effect */}
                <div className={`absolute inset-0 opacity-10 ${
                  isRecording 
                    ? 'bg-gradient-to-br from-green-400 to-blue-500' 
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
                        送信完了！
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
                        <Send className="w-8 h-8 text-white" />
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
                        送信中...
                      </span>
                    </motion.div>
                  ) : isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3 text-blue-600"
                    >
                      <motion.div
                        className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
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
                          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
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
                                    className="w-1 h-1 bg-blue-500 rounded-full"
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
                                  className="inline-block w-0.5 h-6 bg-blue-500 ml-1 rounded-full"
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

                {/* Send button */}
                <AnimatePresence>
                  {transcript && !isRecording && !isProcessing && !isSending && !sendSuccess && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25,
                        mass: 0.8
                      }}
                      onClick={handleSend}
                      className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-xl relative overflow-hidden group"
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          repeatDelay: 1
                        }}
                      />
                      
                      <motion.div
                        animate={{ 
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 0.6, 
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        <Send className="w-6 h-6 relative z-10" />
                      </motion.div>
                      
                      {/* Pulse effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-white/10 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
                
                {/* Sending animation */}
                <AnimatePresence>
                  {isSending && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      {/* Ripple effect */}
                      <motion.div
                        className="absolute inset-0 border-2 border-blue-400 rounded-full"
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
                </AnimatePresence>
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
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>送信</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto px-4">
                  音声認識の精度向上のため、静かな環境でご利用ください
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