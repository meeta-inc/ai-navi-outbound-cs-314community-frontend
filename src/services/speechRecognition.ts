/**
 * Speech Recognition Service
 * Web Speech API를 래핑한 서비스 클래스
 */

export interface SpeechRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechRecognitionCallbacks {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private callbacks: SpeechRecognitionCallbacks = {};

  constructor() {
    // 브라우저 호환성 체크
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.warn('Web Speech API is not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
  }

  /**
   * Speech Recognition 초기화
   */
  initialize(config: SpeechRecognitionConfig = {}): void {
    if (!this.recognition) {
      throw new Error('Speech Recognition is not supported');
    }

    // 기본 설정
    this.recognition.lang = config.lang || 'ja-JP';
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.maxAlternatives = config.maxAlternatives ?? 1;

    // 이벤트 핸들러 설정
    this.setupEventHandlers();
  }

  /**
   * 이벤트 핸들러 설정
   */
  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.isListening = false;
      this.callbacks.onEnd?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        this.callbacks.onResult?.(finalTranscript, true);
      } else if (interimTranscript) {
        this.callbacks.onResult?.(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'マイクのアクセスが許可されていません';
          break;
        case 'no-speech':
          errorMessage = '音声が検出されませんでした';
          break;
        case 'audio-capture':
          errorMessage = 'オーディオの取得に失敗しました';
          break;
        case 'network':
          errorMessage = 'ネットワークエラーが発生しました';
          break;
        case 'language-not-supported':
          errorMessage = '指定された言語はサポートされていません';
          break;
        default:
          errorMessage = `認識エラー: ${event.error}`;
      }

      this.callbacks.onError?.(new Error(errorMessage));
      this.isListening = false;
    };

    this.recognition.onnomatch = () => {
      console.log('No speech match');
      this.callbacks.onResult?.('', true);
    };
  }

  /**
   * コールバック設定
   */
  setCallbacks(callbacks: SpeechRecognitionCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * 音声認識開始
   */
  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech Recognition is not supported');
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    try {
      // マイク権限の確認
      await this.requestMicrophonePermission();
      
      // 認識開始
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      throw error;
    }
  }

  /**
   * 音声認識停止
   */
  stop(): void {
    if (!this.recognition) return;

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  /**
   * 音声認識中止
   */
  abort(): void {
    if (!this.recognition) return;

    if (this.isListening) {
      try {
        this.recognition.abort();
      } catch (error) {
        console.error('Error aborting recognition:', error);
      }
    }
  }

  /**
   * マイク権限リクエスト
   */
  private async requestMicrophonePermission(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 権限取得後、ストリームを停止
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone permission denied:', error);
      throw new Error('マイクのアクセス許可が必要です');
    }
  }

  /**
   * ブラウザサポート確認
   */
  static isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * 現在リスニング中かどうか
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    this.stop();
    this.recognition = null;
    this.callbacks = {};
  }
}