export class OpenAITTSService {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/audio/speech';
  
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    if (!this.apiKey || this.apiKey === 'sk-proj-xxxxx') {
      console.warn('OpenAI API key not configured properly');
    }
  }

  async synthesizeSpeech(text: string, voice?: string): Promise<ArrayBuffer> {
    if (!this.apiKey || this.apiKey === 'sk-proj-xxxxx') {
      throw new Error('OpenAI API key not configured');
    }

    const requestBody = {
      model: 'tts-1',
      input: text,
      voice: voice || import.meta.env.VITE_TTS_VOICE_MODEL || 'alloy',
      speed: parseFloat(import.meta.env.VITE_TTS_SPEED || '1.0')
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`TTS API Error: ${error.error?.message || response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('OpenAI TTS Error:', error);
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
    return !!(this.apiKey && this.apiKey !== 'sk-proj-xxxxx');
  }
}

export const openAITTSService = new OpenAITTSService();