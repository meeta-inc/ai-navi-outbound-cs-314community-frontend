import React, { useState, useRef } from 'react';
import { openAISTTService } from '../services/openai/sttService';
import { openAITTSService } from '../services/openai/ttsService';
import { fishSpeechTTSService } from '../services/fishspeech/ttsService';

interface LogEntry {
  timestamp: string;
  type: 'STT' | 'TTS' | 'ERROR' | 'INFO';
  message: string;
  details?: any;
}

export function OpenAITestPage() {
  // 테스트 페이지에서는 스크롤 활성화
  React.useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.documentElement.style.position = 'static';
    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';
    const root = document.getElementById('root');
    if (root) {
      root.style.height = 'auto';
      root.style.overflow = 'visible';
    }
    
    return () => {
      // 페이지 떠날 때 원래대로 복구
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.position = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      if (root) {
        root.style.height = '';
        root.style.overflow = '';
      }
    };
  }, []);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [ttsText, setTtsText] = useState('こんにちは、音声テストです。');
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsProvider, setTtsProvider] = useState<'openai' | 'fish'>('openai');
  const [fishStatus, setFishStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');
  const [networkLogs, setNetworkLogs] = useState<LogEntry[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // ログ追加関数
  const addLog = (type: LogEntry['type'], message: string, details?: any) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + Date.now().toString().slice(-3),
      type,
      message,
      details
    };
    setNetworkLogs(prev => [...prev, newLog]);
    
    // 自動スクロール
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 10);
  };

  // API 키 상태 확인
  React.useEffect(() => {
    const sttConfigured = openAISTTService.isConfigured();
    const ttsConfigured = openAITTSService.isConfigured();
    const fishConfigured = fishSpeechTTSService.isConfigured();
    
    if (sttConfigured && ttsConfigured) {
      setApiStatus('✅ OpenAI API 키가 설정되었습니다');
    } else {
      setApiStatus('⚠️ OpenAI API 키를 .env 파일에 설정해주세요');
    }
    
    // Fish Speech 상태 확인
    if (fishConfigured) {
      fishSpeechTTSService.testConnection().then(connected => {
        if (connected) {
          setFishStatus('✅ Fish Speech 서버 연결됨');
        } else {
          setFishStatus('⚠️ Fish Speech 서버에 연결할 수 없습니다');
        }
      });
    } else {
      setFishStatus('🔴 Fish Speech가 비활성화됨');
    }
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // STT 테스트 - 녹음 시작 (실시간 변환)
  const startRecording = async () => {
    try {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      accumulatedTranscriptRef.current = '';
      
      addLog('INFO', '마이크 접근 요청...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      addLog('INFO', '마이크 접근 성공');
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      audioChunksRef.current = [];
      
      // 실시간 변환을 위한 설정
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          addLog('INFO', `오디오 청크 수집: ${event.data.size} bytes`);
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // 1초마다 데이터 수집
      setIsRecording(true);
      setInterimTranscript('🎤 녹음 중...');
      addLog('INFO', '녹음 시작 (1초 간격 데이터 수집)');
      
      // 2초마다 중간 변환 실행
      intervalRef.current = setInterval(async () => {
        if (audioChunksRef.current.length > 0) {
          const tempBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const blobSize = tempBlob.size;
          
          addLog('STT', `OpenAI Whisper API 호출 중... (${(blobSize / 1024).toFixed(2)} KB)`);
          const startTime = Date.now();
          
          try {
            const result = await openAISTTService.transcribeAudio(tempBlob, 'ja');
            const elapsed = Date.now() - startTime;
            
            if (result && result.trim()) {
              accumulatedTranscriptRef.current = result;
              setTranscript(result);
              setInterimTranscript('🎤 계속 듣는 중...');
              addLog('STT', `변환 성공 (${elapsed}ms)`, { text: result.substring(0, 50) + '...' });
            } else {
              addLog('STT', `변환 결과 없음 (${elapsed}ms)`);
            }
          } catch (err: any) {
            addLog('ERROR', `중간 변환 실패: ${err.message}`);
            console.log('중간 변환 오류:', err);
          }
        }
      }, 2000);
      
    } catch (err: any) {
      addLog('ERROR', `마이크 접근 실패: ${err.message}`);
      setError(`마이크 접근 오류: ${err}`);
    }
  };

  // STT 테스트 - 녹음 중지 및 최종 변환
  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      addLog('INFO', '녹음 중지 처리 중...');
      
      // 인터벌 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setInterimTranscript('변환 완료 중...');
      
      // 녹음 중지
      mediaRecorderRef.current.stop();
      addLog('INFO', '녹음 중지');
      
      // 잠시 대기 후 최종 변환
      setTimeout(async () => {
        if (audioChunksRef.current.length > 0) {
          const finalBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          addLog('STT', `최종 변환 시작 (${(finalBlob.size / 1024).toFixed(2)} KB)`);
          await transcribeAudio(finalBlob);
        }
        
        // 스트림 정리
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
          addLog('INFO', '마이크 스트림 정리 완료');
        }
        
        setInterimTranscript('');
      }, 500);
      
      setIsRecording(false);
    }
  };

  // STT 테스트 - 음성을 텍스트로 변환
  const transcribeAudio = async (audioBlob: Blob) => {
    const startTime = Date.now();
    try {
      const result = await openAISTTService.transcribeAudio(audioBlob, 'ja');
      const elapsed = Date.now() - startTime;
      
      setTranscript(result || '(변환 결과 없음)');
      setError(null);
      addLog('STT', `최종 변환 완료 (${elapsed}ms)`, { fullText: result });
    } catch (err: any) {
      addLog('ERROR', `STT 최종 변환 실패: ${err.message}`);
      setError(`STT 오류: ${err.message}`);
      setTranscript('변환 실패');
    }
  };

  // TTS 테스트 - 텍스트를 음성으로 변환
  const testTTS = async () => {
    try {
      setError(null);
      setIsPlaying(true);
      
      const provider = ttsProvider === 'openai' ? 'OpenAI' : 'Fish Speech';
      const service = ttsProvider === 'openai' ? openAITTSService : fishSpeechTTSService;
      
      addLog('TTS', `${provider} TTS API 호출 중... (${ttsText.length}자)`);
      const startTime = Date.now();
      
      const audioBuffer = await service.synthesizeSpeech(ttsText);
      const elapsed = Date.now() - startTime;
      
      addLog('TTS', `${provider} 음성 생성 완료 (${elapsed}ms, ${(audioBuffer.byteLength / 1024).toFixed(2)} KB)`);
      addLog('INFO', '음성 재생 시작...');
      
      await service.playAudio(audioBuffer);
      
      addLog('INFO', '음성 재생 완료');
      setIsPlaying(false);
      setError(null);
    } catch (err: any) {
      addLog('ERROR', `TTS 실패: ${err.message}`);
      setError(`TTS 오류: ${err.message}`);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OpenAI STT/TTS 테스트 페이지</h1>
        
        {/* API 상태 */}
        <div className="mb-6 space-y-2">
          <div className={`p-4 rounded-lg ${apiStatus.includes('✅') ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <p className="font-medium">{apiStatus}</p>
            <p className="text-sm mt-1">환경변수: VITE_OPENAI_API_KEY</p>
          </div>
          {fishStatus && (
            <div className={`p-4 rounded-lg ${
              fishStatus.includes('✅') ? 'bg-green-100' : 
              fishStatus.includes('⚠️') ? 'bg-yellow-100' : 
              'bg-gray-100'
            }`}>
              <p className="font-medium">{fishStatus}</p>
              <p className="text-sm mt-1">URL: {import.meta.env.VITE_FISH_SPEECH_API_URL || 'http://localhost:8080'}</p>
            </div>
          )}
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* STT 테스트 섹션 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🎤 STT (Speech-to-Text) 테스트</h2>
            <p className="text-sm text-gray-600 mb-4">Whisper API - 일본어 음성 인식</p>
            
            <div className="space-y-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!openAISTTService.isConfigured()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } disabled:bg-gray-300 disabled:cursor-not-allowed`}
              >
                {isRecording ? '⏹ 녹음 중지' : '🎤 녹음 시작'}
              </button>
              
              <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]">
                <p className="text-sm text-gray-500 mb-1">변환 결과:</p>
                <p className="text-lg">{transcript}</p>
                {interimTranscript && (
                  <p className="text-sm text-gray-400 mt-2 italic">{interimTranscript}</p>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                <p>• 일본어로 말씀해주세요</p>
                <p>• 2초마다 실시간으로 변환됩니다</p>
                <p>• 모델: {import.meta.env.VITE_STT_MODEL || 'whisper-1'}</p>
                {isRecording && (
                  <p className="text-orange-500 font-medium mt-1">🔴 녹음 중... (실시간 변환)</p>
                )}
              </div>
            </div>
          </div>

          {/* TTS 테스트 섹션 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">🔊 TTS (Text-to-Speech) 테스트</h2>
            
            {/* TTS Provider 선택 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold mb-2">TTS 프로바이더 선택:</p>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ttsProvider"
                    value="openai"
                    checked={ttsProvider === 'openai'}
                    onChange={(e) => setTtsProvider(e.target.value as 'openai' | 'fish')}
                    disabled={!openAITTSService.isConfigured()}
                    className="mr-2"
                  />
                  <span className={`${!openAITTSService.isConfigured() ? 'text-gray-400' : ''}`}>
                    OpenAI TTS
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ttsProvider"
                    value="fish"
                    checked={ttsProvider === 'fish'}
                    onChange={(e) => setTtsProvider(e.target.value as 'openai' | 'fish')}
                    disabled={!fishSpeechTTSService.isConfigured()}
                    className="mr-2"
                  />
                  <span className={`${!fishSpeechTTSService.isConfigured() ? 'text-gray-400' : ''}`}>
                    Fish Speech
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {ttsProvider === 'openai' ? 'OpenAI TTS API 사용 중' : 'Fish Speech 로컬 서버 사용 중'}
              </p>
            </div>
            
            <div className="space-y-4">
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="변환할 텍스트를 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              
              <button
                onClick={testTTS}
                disabled={(
                  ttsProvider === 'openai' ? !openAITTSService.isConfigured() : !fishSpeechTTSService.isConfigured()
                ) || isPlaying || !ttsText}
                className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isPlaying ? '🔊 재생 중...' : '▶️ 음성 재생'}
              </button>
              
              <div className="text-xs text-gray-500">
                <p>• 일본어 텍스트를 입력하세요</p>
                {ttsProvider === 'openai' ? (
                  <>
                    <p>• 음성 모델: {import.meta.env.VITE_TTS_VOICE_MODEL || 'alloy'}</p>
                    <p>• 속도: {import.meta.env.VITE_TTS_SPEED || '1.0'}x</p>
                  </>
                ) : (
                  <>
                    <p>• Fish Speech 로컬 서버: {import.meta.env.VITE_FISH_SPEECH_API_URL || 'http://localhost:8080'}</p>
                    <p>• 청크 길이: {import.meta.env.VITE_FISH_SPEECH_CHUNK_LENGTH || '200'}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 네트워크 로그 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🔍 네트워크 로그</h2>
            <button
              onClick={() => setNetworkLogs([])}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              로그 클리어
            </button>
          </div>
          
          <div 
            ref={logContainerRef}
            className="bg-black text-green-400 p-4 rounded-lg h-64 overflow-auto font-mono text-xs whitespace-pre-wrap break-all"
          >
            {networkLogs.length === 0 ? (
              <div className="text-gray-500">로그가 없습니다...</div>
            ) : (
              networkLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-400">[{log.timestamp}]</span>
                  <span className={`ml-2 font-semibold ${
                    log.type === 'ERROR' ? 'text-red-400' :
                    log.type === 'STT' ? 'text-blue-400' :
                    log.type === 'TTS' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    [{log.type}]
                  </span>
                  <span className="ml-2">{log.message}</span>
                  {log.details && (
                    <div className="ml-16 text-gray-500 text-xs">
                      {JSON.stringify(log.details, null, 2)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 환경 변수 정보 */}
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">현재 설정:</h3>
          <ul className="text-sm space-y-1">
            <li>• STT Model: {import.meta.env.VITE_STT_MODEL || 'whisper-1'}</li>
            <li>• STT Language: {import.meta.env.VITE_STT_LANGUAGE || 'ja'}</li>
            <li>• TTS Voice: {import.meta.env.VITE_TTS_VOICE_MODEL || 'alloy'}</li>
            <li>• TTS Speed: {import.meta.env.VITE_TTS_SPEED || '1.0'}</li>
            <li>• API Key: {openAISTTService.isConfigured() ? '설정됨' : '미설정'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OpenAITestPage;