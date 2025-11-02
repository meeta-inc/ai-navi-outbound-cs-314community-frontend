'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Square, Send, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Theme = {
  primary: string;
  primaryHover: string;
  gradient: string;
  light: string;
  border: string;
  text: string;
};

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onClose: () => void;
  theme: Theme;
}

export function VoiceInput({ onTranscript, onClose, theme }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [displayTranscript, setDisplayTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const recognitionRef = useRef<any>(null);
  const animationRef = useRef<number>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ja-JP';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          animateTyping(finalTranscript);
        } else if (interimTranscript) {
          setDisplayTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        // Continue with graceful handling
        setIsRecording(false);
        setIsProcessing(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        if (isRecording) {
          setIsRecording(false);
          setIsProcessing(false);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isRecording]);

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

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const startRecording = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    setTranscript('');
    setDisplayTranscript('');
    
    if (recognitionRef.current) {
      try {
        setIsRecording(true);
        recognitionRef.current.start();

        // Enhanced audio level animation
        const animateLevel = () => {
          if (isRecording) {
            animationRef.current = requestAnimationFrame(animateLevel);
          }
        };
        animateLevel();
      } catch (err) {
        console.error('Failed to start recording:', err);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    setIsRecording(false);
    setIsProcessing(true);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const handleSend = () => {
    if (transcript.trim()) {
      setIsSent(true);
      
      // Success animation delay
      setTimeout(() => {
        onTranscript(transcript.trim());
        onClose();
      }, 800);
    }
  };

  const EnhancedWaveForm = () => {
    const bars = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="flex items-center justify-center gap-1 h-20">
        {bars.map((bar) => {
          const centerDistance = Math.abs(bar - 12);
          const heightMultiplier = 1 - (centerDistance * 0.1);
          
          return (
            <motion.div
              key={bar}
              className={`w-1.5 ${theme.primary} rounded-full`}
              style={{
                background: isRecording ? `linear-gradient(to top, ${theme.primary.replace('bg-', '')}, rgba(59, 130, 246, 0.6))` : undefined
              }}
              animate={{
                height: isRecording 
                  ? [
                      8 * heightMultiplier, 
                      (Math.random() * 50 + 15) * heightMultiplier, 
                      8 * heightMultiplier
                    ]
                  : 8 * heightMultiplier,
                scaleY: isRecording ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.3 + Math.random() * 0.4,
                repeat: isRecording ? Infinity : 0,
                delay: bar * 0.03,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    );
  };

  const PulsingCircle = () => {
    return (
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white opacity-30"
        animate={{
          scale: isRecording ? [1, 1.5, 1] : 1,
          opacity: isRecording ? [0.3, 0, 0.3] : 0.3,
        }}
        transition={{
          duration: 1.5,
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    );
  };

  const CuteCharacter = () => {
    return (
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{
          y: isRecording ? [0, -12, 0] : 0,
          rotate: isRecording ? [0, 8, -8, 0] : 0,
        }}
        transition={{
          duration: isRecording ? 1.5 : 0.3,
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Character Face */}
        <motion.div
          className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-2 relative"
          animate={{
            scale: isRecording ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: isRecording ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Eyes */}
          <div className="flex gap-3">
            <motion.div
              className="w-3 h-3 bg-gray-800 rounded-full"
              animate={{
                scaleY: isRecording ? [1, 0.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: isRecording ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="w-3 h-3 bg-gray-800 rounded-full"
              animate={{
                scaleY: isRecording ? [1, 0.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: isRecording ? Infinity : 0,
                ease: "easeInOut",
                delay: 0.1
              }}
            />
          </div>
          
          {/* Mouth */}
          <motion.div
            className="absolute bottom-4 w-5 h-3 border-b-2 border-gray-600 rounded-full"
            animate={{
              scaleX: isRecording ? [1, 0.6, 1.3, 1] : 1,
              y: isRecording ? [0, 2, -2, 0] : 0,
            }}
            transition={{
              duration: 0.8,
              repeat: isRecording ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          {/* Cheeks when recording */}
          {isRecording && (
            <>
              <motion.div
                className="absolute left-2 top-8 w-2 h-2 bg-pink-300 rounded-full opacity-70"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute right-2 top-8 w-2 h-2 bg-pink-300 rounded-full opacity-70"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
            </>
          )}
        </motion.div>
        
        {/* Character Body */}
        <motion.div
          className="w-12 h-12 bg-white rounded-full shadow-md"
          animate={{
            scale: isRecording ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 1.2,
            repeat: isRecording ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        
        {/* Sound waves around character when recording */}
        {isRecording && (
          <>
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-full opacity-60"
              animate={{
                scale: [1, 2.5, 4],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-full opacity-60"
              animate={{
                scale: [1, 2.5, 4],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.7
              }}
            />
            <motion.div
              className="absolute inset-0 border border-white rounded-full opacity-40"
              animate={{
                scale: [1, 3, 5],
                opacity: [0.4, 0.2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1.2
              }}
            />
          </>
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="voice-input"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-medium">音声入力</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Enhanced Waveform */}
        <motion.div 
          className={`${theme.light} rounded-3xl p-8 relative overflow-hidden flex-1 flex items-center justify-center min-h-[120px]`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {isRecording && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
          <EnhancedWaveForm />
        </motion.div>

        {/* Status */}
        <motion.div 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`inline-flex items-center gap-3 px-6 py-3 ${theme.light} ${theme.text} rounded-full`}
              >
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
                <span>処理中...</span>
              </motion.div>
            ) : isSent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-full"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
                送信完了！
              </motion.div>
            ) : isRecording ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`inline-flex items-center gap-3 px-6 py-3 ${theme.light} ${theme.text} rounded-full`}
              >
                <motion.div
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                録音中...
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500"
              >
                マイクボタンを押して話してください
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Transcript Display */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-gray-50 rounded-2xl border">
                <motion.p 
                  className="text-sm text-gray-600 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  認識されたテキスト:
                </motion.p>
                <motion.p 
                  className="text-gray-800 min-h-[28px] text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {displayTranscript}
                  <motion.span
                    className="inline-block w-0.5 h-6 bg-blue-500 ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <motion.div 
          className="space-y-8 flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Character Button */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={isProcessing || isSent}
                  className={`${theme.primary} ${theme.primaryHover} text-white w-32 h-32 rounded-full relative overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center shadow-2xl`}
                >
                  <PulsingCircle />
                  <CuteCharacter />
                  {ripples.map((ripple) => (
                    <motion.div
                      key={ripple.id}
                      className="absolute bg-white rounded-full opacity-30"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                      }}
                      initial={{ width: 0, height: 0 }}
                      animate={{ width: 200, height: 200 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  ))}
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white w-32 h-32 rounded-full relative overflow-hidden transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-2xl"
                >
                  <PulsingCircle />
                  <CuteCharacter />
                  <Square className="w-8 h-8 absolute top-3 right-3 z-20 bg-white text-red-500 rounded p-1.5" />
                  {ripples.map((ripple) => (
                    <motion.div
                      key={ripple.id}
                      className="absolute bg-white rounded-full opacity-30"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                      }}
                      initial={{ width: 0, height: 0 }}
                      animate={{ width: 200, height: 200 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  ))}
                </Button>
              )}
            </div>
          </div>

          {/* Send Button - Shows when transcript is available */}
          <AnimatePresence>
            {transcript && !isSent && !isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleSend}
                  disabled={isProcessing}
                  className={`${theme.primary} ${theme.primaryHover} text-white px-12 h-14 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center gap-3 text-lg shadow-xl`}
                >
                  <Send className="w-6 h-6" />
                  メッセージを送信
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="text-center text-gray-500 space-y-3 mt-auto pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-base"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            • キャラクターボタンを押して録音を開始
          </motion.p>
          <motion.p
            className="text-base"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            • 話し終わったら停止ボタンを押してください
          </motion.p>
          <motion.p
            className="text-base"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            • 認識されたテキストを確認後、送信ボタンでメッセージを送信
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}