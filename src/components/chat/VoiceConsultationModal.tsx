import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, Volume2 } from 'lucide-react';
import { openAISTTService } from '../../services/openai/sttService';
import { openAITTSService } from '../../services/openai/ttsService';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types/chat';
import ChatBubble from './ChatBubble';

interface VoiceConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientType: string;
  accentColor: string;
}

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  currentTranscript: string;
  interimTranscript: string;
  error: string | null;
  silenceTimer: number;
}

export default function VoiceConsultationModal({
  isOpen,
  onClose,
  clientType,
  accentColor
}: VoiceConsultationModalProps) {
  const { messages, sendMessage, isLoading } = useChat();
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    isProcessing: false,
    isPlaying: false,
    currentTranscript: '',
    interimTranscript: '',
    error: null,
    silenceTimer: 0
  });

  // 現在の会話のみを表示（最新のユーザーメッセージとAIレスポンス）
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  
  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceDetectionRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Configuration from environment
  const autoSend = import.meta.env.VITE_VOICE_AUTO_SEND === 'true';
  const silenceDuration = parseInt(import.meta.env.VITE_VOICE_SILENCE_DURATION || '1500');
  const silenceThreshold = parseInt(import.meta.env.VITE_VOICE_SILENCE_THRESHOLD || '30');
  const autoPlayTTS = import.meta.env.VITE_TTS_AUTO_PLAY === 'true';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Auto-play TTS when new AI message arrives
  useEffect(() => {
    if (autoPlayTTS && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.content) {
        const shouldPlay = currentConversation.length === 0 || 
          currentConversation[currentConversation.length - 1]?.id !== lastMessage.id;
        
        if (shouldPlay) {
          playTTS(lastMessage.content);
        }
      }
    }
  }, [messages, autoPlayTTS]);

  // Update current conversation display
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        // Show only the last user message
        setCurrentConversation([lastMessage]);
      } else if (lastMessage.role === 'assistant') {
        // Show last user message and AI response
        const lastUserIndex = messages.slice(0, -1).findLastIndex(m => m.role === 'user');
        if (lastUserIndex >= 0) {
          setCurrentConversation([messages[lastUserIndex], lastMessage]);
        } else {
          setCurrentConversation([lastMessage]);
        }
      }
    }
  }, [messages]);

  // Silence detection for auto-send
  const detectSilence = useCallback(() => {
    if (!analyserRef.current || !autoSend) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    if (average < silenceThreshold) {
      setVoiceState(prev => {
        const newTimer = prev.silenceTimer + 100;
        if (newTimer >= silenceDuration && prev.isRecording && prev.currentTranscript) {
          // Auto-send after silence detected
          stopRecording();
          return { ...prev, silenceTimer: 0 };
        }
        return { ...prev, silenceTimer: newTimer };
      });
    } else {
      setVoiceState(prev => ({ ...prev, silenceTimer: 0 }));
    }

    animationFrameRef.current = requestAnimationFrame(detectSilence);
  }, [autoSend, silenceDuration, silenceThreshold]);

  // Start recording
  const startRecording = async () => {
    try {
      setVoiceState(prev => ({ 
        ...prev, 
        error: null, 
        currentTranscript: '', 
        interimTranscript: '🎤 聞いています...',
        isRecording: true,
        silenceTimer: 0
      }));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio context for silence detection
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Start silence detection
      if (autoSend) {
        detectSilence();
      }

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second

      // Real-time transcription every 2 seconds
      realtimeIntervalRef.current = setInterval(async () => {
        if (audioChunksRef.current.length > 0) {
          const tempBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          try {
            const result = await openAISTTService.transcribeAudio(tempBlob, 'ja');
            if (result) {
              setVoiceState(prev => ({ 
                ...prev, 
                currentTranscript: result,
                interimTranscript: '🎤 聞いています...'
              }));
            }
          } catch (err) {
            console.error('Real-time transcription error:', err);
          }
        }
      }, 2000);

    } catch (err: any) {
      setVoiceState(prev => ({ 
        ...prev, 
        error: `マイクアクセスエラー: ${err.message}`,
        isRecording: false
      }));
    }
  };

  // Stop recording and process
  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !voiceState.isRecording) return;

    setVoiceState(prev => ({ ...prev, isProcessing: true, interimTranscript: '処理中...' }));

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clear intervals
    if (realtimeIntervalRef.current) {
      clearInterval(realtimeIntervalRef.current);
    }
    if (silenceDetectionRef.current) {
      clearTimeout(silenceDetectionRef.current);
    }

    // Stop recording
    mediaRecorderRef.current.stop();

    // Wait for final data and process
    setTimeout(async () => {
      if (audioChunksRef.current.length > 0) {
        const finalBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          const finalTranscript = await openAISTTService.transcribeAudio(finalBlob, 'ja');
          if (finalTranscript) {
            // Send message through chat
            await sendMessage(finalTranscript);
          }
        } catch (err: any) {
          setVoiceState(prev => ({ ...prev, error: `変換エラー: ${err.message}` }));
        }
      }

      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      setVoiceState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isProcessing: false,
        currentTranscript: '',
        interimTranscript: ''
      }));
    }, 500);
  };

  // Play TTS
  const playTTS = async (text: string) => {
    try {
      setVoiceState(prev => ({ ...prev, isPlaying: true }));
      const audioBuffer = await openAITTSService.synthesizeSpeech(text);
      await openAITTSService.playAudio(audioBuffer);
      setVoiceState(prev => ({ ...prev, isPlaying: false }));
    } catch (err: any) {
      console.error('TTS error:', err);
      setVoiceState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    if (voiceState.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">AI音声相談</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Conversation Display */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentConversation.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              clientType={clientType}
              accentColor={accentColor}
              isVoiceMode={true}
            />
          ))}
          
          {/* Show current transcript while recording */}
          {voiceState.currentTranscript && voiceState.isRecording && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">{voiceState.currentTranscript}</p>
              {voiceState.interimTranscript && (
                <p className="text-xs text-blue-600 mt-1">{voiceState.interimTranscript}</p>
              )}
            </div>
          )}

          {/* Processing indicator */}
          {voiceState.isProcessing && (
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">処理中...</p>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-pulse text-gray-400">AIが応答を準備中...</div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {voiceState.error && (
          <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{voiceState.error}</p>
          </div>
        )}

        {/* Recording Controls */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-center space-x-4">
            {/* Record Button */}
            <button
              onClick={toggleRecording}
              disabled={voiceState.isProcessing || isLoading}
              className={`p-4 rounded-full transition-all transform ${
                voiceState.isRecording 
                  ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {voiceState.isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* TTS Status */}
            {voiceState.isPlaying && (
              <div className="flex items-center text-green-600">
                <Volume2 size={20} className="animate-pulse" />
                <span className="ml-1 text-sm">再生中</span>
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center mt-2">
            <p className="text-sm text-gray-600">
              {voiceState.isRecording 
                ? '話してください...' 
                : voiceState.isProcessing
                ? '処理中...'
                : 'マイクボタンを押して話してください'}
            </p>
            {autoSend && voiceState.silenceTimer > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                無音検知: {Math.round((silenceDuration - voiceState.silenceTimer) / 1000)}秒
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}