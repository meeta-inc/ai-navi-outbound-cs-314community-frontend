export class OpenAISTTService {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
  
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    if (!this.apiKey || this.apiKey === 'sk-proj-xxxxx') {
      console.warn('OpenAI API key not configured properly');
    }
  }

  async transcribeAudio(audioBlob: Blob, language: string = 'ja'): Promise<string> {
    if (!this.apiKey || this.apiKey === 'sk-proj-xxxxx') {
      throw new Error('OpenAI API key not configured');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', import.meta.env.VITE_STT_MODEL || 'whisper-1');
    formData.append('language', language);
    formData.append('temperature', import.meta.env.VITE_STT_TEMPERATURE || '0.2');
    formData.append('response_format', 'text');

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`STT API Error: ${error.error?.message || response.statusText}`);
      }

      const transcript = await response.text();
      return transcript.trim();
    } catch (error) {
      console.error('OpenAI STT Error:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.apiKey !== 'sk-proj-xxxxx');
  }
}

export const openAISTTService = new OpenAISTTService();