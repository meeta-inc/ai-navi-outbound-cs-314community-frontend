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
  async getAudioBuffer(voiceFile: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(voiceFile);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('[Demo Mode] Failed to get audio buffer:', error);
      throw error;
    }
  }

  /**
   * 데모 응답 처리
   */
  async processUserInput(userInput: string): Promise<{
    text: string;
    audioBuffer?: ArrayBuffer;
    duration: number;
  }> {
    // 시나리오 로드 확인
    if (!this.isLoaded) {
      await this.loadScenarios();
    }

    // 매칭 시나리오 찾기
    const scenario = this.findMatchingScenario(userInput);
    
    // 음성 파일이 있는 경우 버퍼 가져오기
    let audioBuffer: ArrayBuffer | undefined;
    if (scenario.response.voiceFile) {
      try {
        audioBuffer = await this.getAudioBuffer(scenario.response.voiceFile);
      } catch (error) {
        console.warn('[Demo Mode] Could not load audio buffer:', error);
      }
    }

    // 응답 반환
    return {
      text: scenario.response.text,
      audioBuffer,
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