/**
 * JWE 관련 타입 정의
 */

import { JWEPayload } from '../services/jwe/jweTokenGenerator';

/**
 * 채팅 API용 JWE 페이로드
 */
export interface ChatJWEPayload extends JWEPayload {
  /** 클라이언트 ID */
  client_id: string;
  /** 애플리케이션 ID */
  app_id: string;
  /** 요청 타입 (채팅용) */
  request_type: 'chat';
}

/**
 * JWE 토큰 생성 옵션
 */
export interface JWETokenOptions {
  /** 인증 모드 */
  authMode?: 'iam';
  /** 토큰 유효시간 (초) */
  expiresIn?: number;
}

/**
 * JWE 헤더 생성 결과
 */
export interface JWEHeaderResult {
  /** 성공 여부 */
  success: boolean;
  /** JWE 토큰 (성공 시) */
  token?: string;
  /** 에러 메시지 (실패 시) */
  error?: string;
  /** 상세 정보 */
  details?: {
    client_id: string;
    app_id: string;
    tokenLength?: number;
    authMode: string;
  };
}