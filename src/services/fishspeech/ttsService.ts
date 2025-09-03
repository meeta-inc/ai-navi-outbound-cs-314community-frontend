export class FishSpeechTTSService {
  private apiUrl: string;
  
  constructor() {
    // Fish Speech 로컬 서버 설정
    this.apiUrl = import.meta.env.VITE_FISH_SPEECH_API_URL || 'http://localhost:8080/v1/tts';
    
    if (!this.apiUrl) {
      console.warn('Fish Speech API URL not configured');
    }
  }

  async synthesizeSpeech(
    text: string, 
    referenceId?: string,
    chunkLength?: number
  ): Promise<ArrayBuffer> {
    if (!this.apiUrl) {
      throw new Error('Fish Speech API URL not configured');
    }

    const requestBody = {
      text: text,
      reference_id: referenceId || import.meta.env.VITE_FISH_SPEECH_REFERENCE_ID || null,
      chunk_length: chunkLength || parseInt(import.meta.env.VITE_FISH_SPEECH_CHUNK_LENGTH || '200'),
      format: 'wav',
      normalize: true,
      mp3_bitrate: 128,
      opus_bitrate: -1000,
      max_new_tokens: 1024,
      top_p: 0.7,
      repetition_penalty: 1.2,
      temperature: 0.7,
      streaming: false
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fish Speech API Error: ${errorText || response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Fish Speech TTS Error:', error);
      throw error;
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBufferDecoded = await audioContext.decodeAudioData(audioBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBufferDecoded;
    source.connect(audioContext.destination);
    
    return new Promise((resolve) => {
      source.onended = () => resolve();
      source.start(0);
    });
  }

  isConfigured(): boolean {
    const configured = !!this.apiUrl && import.meta.env.VITE_USE_FISH_SPEECH === 'true';
    return configured;
  }

  async testConnection(): Promise<boolean> {
    try {
      // v1/health 엔드포인트로 헬스체크
      const response = await fetch(this.apiUrl.replace('/v1/tts', '/v1/health'), {
        method: 'GET'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const fishSpeechTTSService = new FishSpeechTTSService();