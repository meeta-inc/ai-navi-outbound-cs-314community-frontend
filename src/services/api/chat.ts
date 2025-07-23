import { fetchApi } from './index';
import { chatJWEService } from '../jwe/chatJWEService';
import { LLMResponse } from '../../types';

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

// 기존 ChatResponse (하위 호환성 유지)
export interface ChatResponse {
  response: string;
  tool?: ToolInfo;
  timestamp?: string;
}

// 새로운 LLM 응답 형식을 포함한 확장된 타입
export interface ExtendedChatResponse extends ChatResponse {
  llmResponse?: LLMResponse;
}

export const sendChatMessage = async (message: string, userId: string, gradeId?: string): Promise<ExtendedChatResponse> => {
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

    // 환경변수에서 clientId, appId 가져오기
    const clientId = import.meta.env.VITE_CLIENT_ID || 'RS000001';
    const appId = import.meta.env.VITE_APP_ID || '0001';
    
    const response = await fetchApi('/students/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        clientId,
        appId,
        gradeId: gradeId || 'high', // 기본값 high
        userId,
        message,
      }),
    });

    // 응답 형식을 정규화하여 반환
    return normalizeResponse(response);

  } catch (error) {
    console.error('채팅 메시지 전송 중 오류:', error);
    
    // JWE 토큰 생성 실패해도 기본 채팅 요청은 진행 (폴백)
    console.log('JWE 토큰 없이 기본 채팅 요청 시도');
    
    // 환경변수에서 clientId, appId 가져오기
    const clientId = import.meta.env.VITE_CLIENT_ID || 'RS000001';
    const appId = import.meta.env.VITE_APP_ID || '0001';
    
    const response = await fetchApi('/students/chat', {
      method: 'POST',
      body: JSON.stringify({
        clientId,
        appId,
        gradeId: gradeId || 'high', // 기본값 high
        userId,
        message,
      }),
    });

    return normalizeResponse(response);
  }
};

export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  return fetchApi(`/students/chat/history/${userId}`);
};

// 응답 형식을 감지하고 변환하는 유틸리티 함수
export const isLLMResponse = (response: any): response is LLMResponse => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  if (!Array.isArray(response.response) || response.response.length === 0) {
    return false;
  }
  
  const firstItem = response.response[0];
  if (!firstItem || !firstItem.type) {
    return false;
  }
  
  return ['main', 'sub', 'cta'].includes(firstItem.type);
};

// 기존 ChatResponse를 ExtendedChatResponse로 변환
export const normalizeResponse = (response: any): ExtendedChatResponse => {
  if (isLLMResponse(response)) {
    return {
      response: '', // LLM 응답의 경우 기존 response 필드는 빈 문자열
      llmResponse: response,
      timestamp: (response as any).timestamp
    };
  }
  
  // 기존 형식의 응답인 경우 그대로 반환
  return response as ExtendedChatResponse;
};