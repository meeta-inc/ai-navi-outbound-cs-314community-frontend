/**
 * JWE 토큰 생성 유틸리티
 * KMS 공개키를 사용하여 JWE 토큰을 생성합니다.
 */

import { importSPKI, CompactEncrypt } from 'jose';

export interface JWEPayload {
  userId: string;
  sessionId: string;
  timestamp: number;
  [key: string]: any;
}

export interface JWEGenerationResult {
  success: boolean;
  token?: string;
  error?: string;
  details?: any;
}

/**
 * PEM 형식의 공개키로 변환
 * @param publicKeyBytes 공개키 바이트 배열
 * @returns PEM 형식의 공개키 문자열
 */
export function convertToPEM(publicKeyBytes: Uint8Array): string {
  // Base64 인코딩
  const base64 = btoa(String.fromCharCode(...publicKeyBytes));
  
  // PEM 형식으로 포맷팅
  const pem = `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
  
  return pem;
}

/**
 * KMS 공개키를 사용하여 JWE 토큰 생성
 * @param publicKeyBytes KMS에서 가져온 공개키 바이트 배열
 * @param payload 암호화할 페이로드
 * @returns JWE 토큰 생성 결과
 */
export async function generateJWEToken(
  publicKeyBytes: Uint8Array,
  payload: JWEPayload
): Promise<JWEGenerationResult> {
  try {
    // 1. 공개키를 PEM 형식으로 변환
    const pemKey = convertToPEM(publicKeyBytes);
    console.log('PEM 형식 공개키 생성 완료');

    // 2. JOSE 라이브러리에서 사용할 수 있는 키 형식으로 임포트
    const publicKey = await importSPKI(pemKey, 'RSA-OAEP-256');
    console.log('공개키 임포트 완료');

    // 3. 페이로드를 JSON 문자열로 변환
    const payloadString = JSON.stringify(payload);
    const encoder = new TextEncoder();
    const payloadBytes = encoder.encode(payloadString);

    // 4. JWE 토큰 생성
    const jwe = await new CompactEncrypt(payloadBytes)
      .setProtectedHeader({ 
        alg: 'RSA-OAEP-256',  // KMS에서 지원하는 알고리즘
        enc: 'A256GCM'        // 대칭키 암호화 알고리즘
      })
      .encrypt(publicKey);

    console.log('JWE 토큰 생성 완료');

    return {
      success: true,
      token: jwe,
      details: {
        algorithm: 'RSA-OAEP-256',
        encryption: 'A256GCM',
        payloadSize: payloadBytes.length,
        tokenLength: jwe.length
      }
    };

  } catch (error) {
    console.error('JWE 토큰 생성 실패:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      details: error
    };
  }
}

/**
 * 테스트용 페이로드 생성
 * @param userId 사용자 ID
 * @returns JWE 페이로드
 */
export function createTestPayload(userId: string = 'test-user'): JWEPayload {
  return {
    userId,
    sessionId: `session-${Date.now()}`,
    timestamp: Date.now(),
    cognitoIdentityId: 'ap-northeast-1:xxxx-xxxx-xxxx',
    customData: {
      browser: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  };
}