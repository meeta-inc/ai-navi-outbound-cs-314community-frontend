import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Square, Send } from 'lucide-react';
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
  const [showSentFeedback, setShowSentFeedback] = useState(false);
  
  const recognitionService = useRef<SpeechRecognitionService | null>(null);
  const animationRef = useRef<number>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
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
      },
      onEnd: () => {
        setIsRecording(false);
        setIsProcessing(false);
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
    };
  }, []);

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
        // Simulate audio level changes
        setAudioLevel(Math.random() * 0.5 + 0.5);
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
      
      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  // Handle send
  const handleSend = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      // 전송 후 transcript 초기화하여 새로운 음성 입력 준비
      setTranscript('');
      setDisplayTranscript('');
      // 전송 완료 피드백 표시
      setShowSentFeedback(true);
      setTimeout(() => {
        setShowSentFeedback(false);
      }, 2000);
      // 모달은 열어둔 상태 유지 (onClose() 호출하지 않음)
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

  if (!isOpen) return null;

  // Waveform component
  const Waveform = () => {
    const bars = Array.from({ length: 20 }, (_, i) => i);
    
    return (
      <div className="flex items-center justify-center gap-1 h-16">
        {bars.map((bar) => {
          const height = isRecording 
            ? Math.random() * 40 + 10 
            : 8;
          
          return (
            <motion.div
              key={bar}
              className={`w-1 ${colors.background} rounded-full`}
              animate={{
                height: isRecording ? [8, height, 8] : 8,
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: isRecording ? Infinity : 0,
                delay: bar * 0.05,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">音声入力</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Waveform */}
            <div className={`${colors.bgLight} rounded-lg p-4 mb-6`}>
              <Waveform />
            </div>

            {/* Status */}
            <div className="text-center mb-6">
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.p
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-600"
                  >
                    処理中...
                  </motion.p>
                ) : isRecording ? (
                  <motion.p
                    key="recording"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 font-medium"
                  >
                    録音中...
                  </motion.p>
                ) : (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-500"
                  >
                    マイクボタンを押して話してください
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Transcript */}
            {(transcript || displayTranscript || showSentFeedback) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {showSentFeedback ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-green-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">メッセージを送信しました</span>
                    </motion.div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">認識されたテキスト:</p>
                      <p className="text-gray-800 min-h-[24px]">
                        {displayTranscript || transcript}
                        {displayTranscript && (
                          <motion.span
                            className="inline-block w-0.5 h-5 bg-blue-500 ml-1"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Record button */}
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={isProcessing || !SpeechRecognitionService.isSupported()}
                  className={`${colors.background} ${colors.textWhite} w-20 h-20 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50`}
                >
                  <Mic className="w-8 h-8" />
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-red-500 text-white w-20 h-20 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Square className="w-6 h-6" />
                </Button>
              )}

              {/* Send button */}
              {transcript && !isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Button
                    onClick={handleSend}
                    disabled={isProcessing}
                    className={`${colors.background} ${colors.textWhite} px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50`}
                  >
                    <Send className="w-5 h-5" />
                    送信
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
              <p>• マイクボタンを押して録音を開始</p>
              <p>• 話し終わったら停止ボタンを押してください</p>
              <p>• 認識されたテキストを確認後、送信してください</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}