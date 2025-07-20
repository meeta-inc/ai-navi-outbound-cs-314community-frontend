import { fetchApi } from './index';
import { chatJWEService } from '../jwe/chatJWEService';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string | React.ReactNode;
  timestamp: Date;
  error?: boolean;
}

export interface ToolInfo {
  type: string;
  id: string;
  name: string;
  input: any;
}

export interface ChatResponse {
  response: string;
  tool?: ToolInfo;
  timestamp?: string;
}

export const sendChatMessage = async (message: string, userId: string): Promise<ChatResponse> => {
  try {
    // JWE 토큰 생성 (client_id, app_id 암호화)
    console.log('채팅 메시지 전송 시작 - JWE 토큰 생성 중...');
    const jweResult = await chatJWEService.createChatJWEToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // JWE 토큰이 성공적으로 생성된 경우 헤더에 추가
    if (jweResult.success && jweResult.token) {
      headers['X-JWE-Token'] = jweResult.token;
      console.log('JWE 토큰이 헤더에 추가됨:', {
        client_id: jweResult.details?.client_id,
        app_id: jweResult.details?.app_id,
        tokenLength: jweResult.details?.tokenLength
      });
    } else {
      // JWE 토큰 생성 실패 시 경고 로그 (채팅은 계속 진행)
      console.warn('JWE 토큰 생성 실패, 토큰 없이 요청 진행:', jweResult.error);
    }

    return fetchApi('/students/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        message,
      }),
    });

  } catch (error) {
    console.error('채팅 메시지 전송 중 오류:', error);
    
    // JWE 토큰 생성 실패해도 기본 채팅 요청은 진행 (폴백)
    console.log('JWE 토큰 없이 기본 채팅 요청 시도');
    return fetchApi('/students/chat', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        message,
      }),
    });
  }
};

export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  return fetchApi(`/students/chat/history/${userId}`);
};