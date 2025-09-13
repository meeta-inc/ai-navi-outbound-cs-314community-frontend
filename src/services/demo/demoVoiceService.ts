/**
 * 데모 모드용 음성 서비스
 * 실제 API 호출 대신 미리 정의된 시나리오와 음성 파일을 사용
 */

export interface DemoScenario {
  id: string;
  triggers: string[];
  response: {
    text: string;
    voiceFile: string;
    duration: number;
  };
}

export interface DemoScenariosData {
  version: string;
  scenarios: DemoScenario[];
  metadata?: {
    lastUpdated: string;
    totalScenarios: number;
  };
}

export class DemoVoiceService {
  private scenarios: DemoScenario[] = [];
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isLoaded = false;
  private persistentAudio: HTMLAudioElement | null = null;

  /**
   * 데모 모드 활성화 여부 확인
   */
  static isDemoMode(): boolean {
    return import.meta.env.VITE_VOICE_DEMO_MODE === 'true';
  }

  /**
   * 시나리오 데이터 로드
   */
  async loadScenarios(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const scenarioUrl = import.meta.env.VITE_DEMO_SCENARIO_URL || '/demo/scenarios.json';
      console.log('[Demo Mode] Loading scenarios from:', scenarioUrl);
      
      const response = await fetch(scenarioUrl);
      if (!response.ok) {
        throw new Error(`Failed to load scenarios: ${response.statusText}`);
      }

      const data: DemoScenariosData = await response.json();
      this.scenarios = data.scenarios || [];
      this.isLoaded = true;

      console.log(`[Demo Mode] Loaded ${this.scenarios.length} scenarios`);
      
      // 음성 파일 프리로드 (옵션)
      if (import.meta.env.VITE_DEMO_PRELOAD_AUDIO === 'true') {
        this.preloadAudioFiles();
      }
    } catch (error) {
      console.error('[Demo Mode] Failed to load scenarios:', error);
      // 폴백: 기본 시나리오 사용
      this.scenarios = [this.getDefaultScenario()];
      this.isLoaded = true;
    }
  }

  /**
   * 음성 파일 프리로드
   */
  private async preloadAudioFiles(): Promise<void> {
    for (const scenario of this.scenarios) {
      try {
        const audio = new Audio(scenario.response.voiceFile);
        audio.preload = 'auto';
        this.audioCache.set(scenario.id, audio);
      } catch (error) {
        console.warn(`[Demo Mode] Failed to preload audio for ${scenario.id}:`, error);
      }
    }
  }

  /**
   * 사용자 입력에 맞는 시나리오 찾기
   */
  findMatchingScenario(userInput: string): DemoScenario {
    const normalizedInput = userInput.toLowerCase().trim();
    
    // 정확한 매칭 우선
    for (const scenario of this.scenarios) {
      for (const trigger of scenario.triggers) {
        if (normalizedInput.includes(trigger.toLowerCase())) {
          console.log(`[Demo Mode] Matched scenario: ${scenario.id} (trigger: ${trigger})`);
          return scenario;
        }
      }
    }

    // 부분 매칭 시도
    for (const scenario of this.scenarios) {
      for (const trigger of scenario.triggers) {
        const triggerParts = trigger.toLowerCase().split('');
        let matchCount = 0;
        for (const char of triggerParts) {
          if (normalizedInput.includes(char)) matchCount++;
        }
        if (matchCount >= triggerParts.length * 0.6) { // 60% 이상 매칭
          console.log(`[Demo Mode] Partial match scenario: ${scenario.id}`);
          return scenario;
        }
      }
    }

    // 기본 시나리오 반환
    console.log('[Demo Mode] Using default scenario');
    return this.scenarios.find(s => s.id === 'demo_default') || this.getDefaultScenario();
  }

  /**
   * 기본 시나리오
   */
  private getDefaultScenario(): DemoScenario {
    return {
      id: 'demo_fallback',
      triggers: [],
      response: {
        text: 'ご質問ありがとうございます。詳しい情報については、お問い合わせください。',
        voiceFile: '',
        duration: 5
      }
    };
  }

  /**
   * 음성 재생
   */
  async playAudio(voiceFile: string): Promise<void> {
    if (!voiceFile) {
      console.log('[Demo Mode] No voice file to play');
      return;
    }

    try {
      console.log('[Demo Mode] Playing voice:', voiceFile);
      
      // 캐시된 오디오 사용 또는 새로 생성
      let audio = Array.from(this.audioCache.values()).find(a => a.src === voiceFile);
      if (!audio) {
        audio = new Audio(voiceFile);
      }

      // CORS 설정
      audio.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          console.log('[Demo Mode] Audio playback completed');
          resolve();
        };
        audio.onerror = (error) => {
          console.error('[Demo Mode] Audio playback error:', error);
          reject(error);
        };
        
        audio.play().catch(error => {
          console.error('[Demo Mode] Failed to play audio:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('[Demo Mode] Audio playback failed:', error);
      throw error;
    }
  }

  /**
   * 음성을 ArrayBuffer로 가져오기 (TTS 서비스와의 호환성)
   */
  async getAudioBuffer(voiceFile: string): Promise<ArrayBuffer | undefined> {
    // 데모 모드에서는 CORS 문제로 인해 직접 재생 방식 사용
    // ArrayBuffer 대신 undefined 반환
    console.log('[Demo Mode] Will use direct audio playback for:', voiceFile);
    return undefined;
  }
  
  /**
   * 오디오 컨텍스트 활성화 (모바일 대응)
   * 사용자 상호작용 시점에 호출하여 오디오 재생 권한 획득
   */
  async activateAudioContext(): Promise<void> {
    if (this.persistentAudio) {
      return;
    }
    try {
      console.log('[Demo Mode] Activating audio context...');
      this.persistentAudio = new Audio();
      this.persistentAudio.volume = 0;
      this.persistentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAAA=';
      
      await this.persistentAudio.play();
      this.persistentAudio.volume = 1;
      console.log('[Demo Mode] Audio context activated with persistent element.');
    } catch (error) {
      console.warn('[Demo Mode] Failed to activate audio context:', error);
      this.persistentAudio = null;
    }
  }

  /**
   * Audio 요소를 사용한 직접 재생 (CORS 우회)
   */
  async playAudioDirect(voiceFile: string): Promise<void> {
    if (!voiceFile) {
      console.log('[Demo Mode] No voice file to play');
      return;
    }

    const audio = this.persistentAudio || new Audio();
    if (!this.persistentAudio) {
        console.warn('[Demo Mode] Persistent audio element not available. Creating new one. This might fail on iOS.');
    }

    return new Promise((resolve) => {
      console.log('[Demo Mode] Playing audio with persistent element:', voiceFile);
      
      const onEnded = () => {
        cleanup();
        resolve();
      };
      
      const onError = (error: Event | string) => {
        console.error('[Demo Mode] Audio playback error:', error);
        cleanup();
        resolve();
      };

      const cleanup = () => {
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
      }

      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);
      
      audio.src = voiceFile;
      const playPromise = audio.play();

      if (playPromise) {
        playPromise.catch(error => {
          console.error('[Demo Mode] Failed to play audio automatically:', error);

          // Fallback for iOS: if it's a NotAllowedError, wait for the next user interaction.
          if (error.name === 'NotAllowedError') {
            const playOnInteraction = () => {
              audio.play().catch(err => {
                console.error('[Demo Mode] Failed to play audio on interaction:', err);
              });
              // The { once: true } option will automatically remove the listener.
            };

            console.log('[Demo Mode] Waiting for user interaction to play audio...');
            document.addEventListener('touchstart', playOnInteraction, { once: true });
            document.addEventListener('click', playOnInteraction, { once: true });
          }
          
          // In any case of playback start error, resolve the promise to not block the app flow.
          cleanup();
          resolve();
        });
      }
    });
  }

  /**
   * 데모 응답 처리
   */
  async processUserInput(userInput: string): Promise<{
    text: string;
    audioBuffer?: ArrayBuffer;
    voiceFile?: string;
    duration: number;
  }> {
    // 시나리오 로드 확인
    if (!this.isLoaded) {
      await this.loadScenarios();
    }

    // 매칭 시나리오 찾기
    const scenario = this.findMatchingScenario(userInput);
    
    // 데모 모드에서는 직접 재생을 위해 voiceFile URL 반환
    return {
      text: scenario.response.text,
      audioBuffer: undefined, // CORS 문제로 ArrayBuffer 사용 안함
      voiceFile: scenario.response.voiceFile, // 직접 재생용 URL
      duration: scenario.response.duration
    };
  }

  /**
   * 캐시 초기화
   */
  clearCache(): void {
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioCache.clear();
  }
}

// 싱글톤 인스턴스
export const demoVoiceService = new DemoVoiceService();