/**
 * JWE 서비스 통합 export
 */

export { JWEService, createJWEService } from './jweService';
export type { JWEServiceConfig, JWEServiceResult } from './jweService';

export { generateJWEToken, createTestPayload, convertToPEM } from './jweTokenGenerator';
export type { JWEPayload, JWEGenerationResult } from './jweTokenGenerator';

// 간편 사용을 위한 기본 JWE 서비스 인스턴스
import { createJWEService } from './jweService';

// IAM 인증용 기본 인스턴스
export const jweServiceIAM = createJWEService('iam');

// 채팅 전용 JWE 서비스
export { ChatJWEService, chatJWEService, createChatJWEServiceWithIAM } from './chatJWEService';
export type { ChatJWEPayload, JWEHeaderResult, JWETokenOptions } from '../types/jwe';