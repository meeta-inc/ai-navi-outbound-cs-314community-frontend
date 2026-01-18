export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string | React.ReactNode;
  timestamp: Date;
  error?: boolean;
  llmResponse?: LLMResponse;
  imageUrl?: string;      // 첨부된 이미지 URL (previewUrl 또는 로컬 이미지)
  s3Uri?: string;         // S3 URI (서버로 전송용)
}

// LLM 응답 구조 타입 정의
export interface LLMResponse {
  response: BubbleResponse[];
  tool?: string | null;
  status?: number; // HTTP 상태코드 (200이 아닌 경우 에러 처리)
}

export interface BubbleResponse {
  type: 'main' | 'sub' | 'cta';
  text: string;
  attachment?: AttachmentData | null;
}

export interface AttachmentData {
  type: 'link' | 'image' | 'video' | 'file';
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}