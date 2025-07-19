/**
 * 채팅 API 전용 JWE 서비스
 * LLM 채팅 요청 시 client_id와 app_id를 안전하게 전송하기 위한 JWE 토큰 생성
 */

import { JWEService, createJWEService } from './jweService';
import { ChatJWEPayload, JWEHeaderResult, JWETokenOptions } from '../../types/jwe';

export class ChatJWEService {
  private jweServiceIAM: JWEService;
  private clientId: string;
  private appId: string;

  constructor(clientId?: string, appId?: string) {
    // IAM 모드의 JWE 서비스 생성
    this.jweServiceIAM = createJWEService('iam');
    this.clientId = clientId || import.meta.env.VITE_CLIENT_ID || 'default_client';
    this.appId = appId || import.meta.env.VITE_APP_ID || 'ai-navi-chat';
  }

  /**
   * 채팅 요청용 JWE 토큰 생성
   * @param options 토큰 생성 옵션
   * @returns JWE 헤더 생성 결과
   */
  async createChatJWEToken(options: JWETokenOptions = {}): Promise<JWEHeaderResult> {
    try {
      // 채팅용 페이로드 생성
      const payload: ChatJWEPayload = {
        client_id: this.clientId,
        app_id: this.appId,
        request_type: 'chat',
        userId: `chat-user-${Date.now()}`,
        sessionId: `chat-session-${Date.now()}`,
        timestamp: Date.now(),
        // 만료시간 설정 (기본 1시간)
        exp: Math.floor(Date.now() / 1000) + (options.expiresIn || 3600),
        // 발급시간
        iat: Math.floor(Date.now() / 1000),
        // 사용 용도
        purpose: 'chat-api-authentication'
      };

      // IAM 모드로 JWE 서비스 사용
      const authMode = options.authMode || 'iam';
      const jweService = this.jweServiceIAM;

      console.log('채팅 JWE 토큰 생성 시작:', {
        client_id: this.clientId,
        app_id: this.appId,
        authMode
      });

      // JWE 토큰 생성
      const result = await jweService.createJWEToken(payload);

      if (result.success && result.token) {
        console.log('채팅 JWE 토큰 생성 성공:', {
          tokenLength: result.token.length,
          client_id: this.clientId,
          app_id: this.appId
        });

        return {
          success: true,
          token: result.token,
          details: {
            client_id: this.clientId,
            app_id: this.appId,
            tokenLength: result.token.length,
            authMode
          }
        };
      } else {
        console.error('채팅 JWE 토큰 생성 실패:', result.error);
        
        return {
          success: false,
          error: result.error || 'JWE 토큰 생성 실패',
          details: {
            client_id: this.clientId,
            app_id: this.appId,
            authMode
          }
        };
      }

    } catch (error) {
      console.error('채팅 JWE 서비스 오류:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        details: {
          client_id: this.clientId,
          app_id: this.appId,
          authMode
        }
      };
    }
  }

  /**
   * client_id 업데이트
   * @param clientId 새로운 클라이언트 ID
   */
  updateClientId(clientId: string): void {
    this.clientId = clientId;
    console.log('클라이언트 ID 업데이트:', clientId);
  }

  /**
   * app_id 업데이트
   * @param appId 새로운 앱 ID
   */
  updateAppId(appId: string): void {
    this.appId = appId;
    console.log('앱 ID 업데이트:', appId);
  }

  /**
   * 현재 설정 정보 조회
   * @returns 현재 클라이언트 ID와 앱 ID
   */
  getCurrentConfig(): { clientId: string; appId: string } {
    return {
      clientId: this.clientId,
      appId: this.appId
    };
  }

  /**
   * JWE 서비스 캐시 초기화
   */
  clearCache(): void {
    this.jweServiceIAM.clearCache();
    console.log('채팅 JWE 서비스 캐시 초기화됨');
  }
}

// 기본 채팅 JWE 서비스 인스턴스 (IAM 모드)
export const chatJWEService = new ChatJWEService();

// IAM 인증용 채팅 JWE 서비스 인스턴스 생성 함수
export function createChatJWEServiceWithIAM(clientId?: string, appId?: string): ChatJWEService {
  return new ChatJWEService(clientId, appId);
}