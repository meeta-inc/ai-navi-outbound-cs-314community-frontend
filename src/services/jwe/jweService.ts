/**
 * JWE 서비스
 * Cognito, KMS, JWE 토큰 생성을 통합한 서비스
 */

import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { KMSClient, GetPublicKeyCommand } from '@aws-sdk/client-kms';
import { generateJWEToken, JWEPayload } from './jweTokenGenerator';

export interface JWEServiceConfig {
  identityPoolId: string;
  region: string;
  kmsKeyId: string;
  authMode?: 'guest' | 'iam';
  iamCredentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    frontendRoleArn: string;
  };
}

export interface JWEServiceResult {
  success: boolean;
  token?: string;
  error?: string;
  details?: {
    authMode: string;
    identityId?: string;
    tokenLength?: number;
    publicKeyId?: string;
  };
}

export class JWEService {
  private config: JWEServiceConfig;
  private cachedPublicKey: Uint8Array | null = null;
  private publicKeyCacheTime: number = 0;
  private readonly CACHE_DURATION = 3600000; // 1시간

  constructor(config: JWEServiceConfig) {
    this.config = config;
  }

  /**
   * JWE 토큰 생성
   * @param payload 암호화할 페이로드
   * @returns JWE 토큰 생성 결과
   */
  async createJWEToken(payload: JWEPayload): Promise<JWEServiceResult> {
    try {
      // 1. AWS 자격증명 획득
      const credentials = await this.getAWSCredentials();
      if (!credentials) {
        return {
          success: false,
          error: 'AWS 자격증명 획득 실패'
        };
      }

      // 2. KMS 공개키 조회 (캐시 확인)
      const publicKey = await this.getKMSPublicKey(credentials);
      if (!publicKey) {
        return {
          success: false,
          error: 'KMS 공개키 조회 실패'
        };
      }

      // 3. JWE 토큰 생성
      const jweResult = await generateJWEToken(publicKey, payload);
      
      if (!jweResult.success || !jweResult.token) {
        return {
          success: false,
          error: jweResult.error || 'JWE 토큰 생성 실패',
          details: jweResult.details
        };
      }

      return {
        success: true,
        token: jweResult.token,
        details: {
          authMode: this.config.authMode || 'guest',
          tokenLength: jweResult.token.length,
          publicKeyId: this.config.kmsKeyId,
          ...jweResult.details
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        details: { authMode: this.config.authMode || 'guest' }
      };
    }
  }

  /**
   * AWS 자격증명 획득
   * @returns AWS 자격증명
   */
  private async getAWSCredentials(): Promise<any> {
    if (this.config.authMode === 'iam' && this.config.iamCredentials) {
      // IAM 사용자 인증
      const stsClient = new STSClient({
        region: this.config.region,
        credentials: {
          accessKeyId: this.config.iamCredentials.accessKeyId,
          secretAccessKey: this.config.iamCredentials.secretAccessKey,
        }
      });

      const assumeRoleResponse = await stsClient.send(new AssumeRoleCommand({
        RoleArn: this.config.iamCredentials.frontendRoleArn,
        RoleSessionName: 'jwe-service-session',
        DurationSeconds: 3600
      }));

      return assumeRoleResponse.Credentials;
    } else {
      // 게스트 접근 (기본값)
      const cognitoClient = new CognitoIdentityClient({
        region: this.config.region,
      });

      const identityResponse = await cognitoClient.send(new GetIdCommand({
        IdentityPoolId: this.config.identityPoolId,
      }));

      const credentialsResponse = await cognitoClient.send(new GetCredentialsForIdentityCommand({
        IdentityId: identityResponse.IdentityId!,
      }));

      return credentialsResponse.Credentials;
    }
  }

  /**
   * KMS 공개키 조회 (캐시 지원)
   * @param credentials AWS 자격증명
   * @returns KMS 공개키
   */
  private async getKMSPublicKey(credentials: any): Promise<Uint8Array | null> {
    // 캐시 확인
    const now = Date.now();
    if (this.cachedPublicKey && (now - this.publicKeyCacheTime) < this.CACHE_DURATION) {
      console.log('KMS 공개키 캐시 사용');
      return this.cachedPublicKey;
    }

    // KMS에서 공개키 조회
    const kmsClient = new KMSClient({
      region: this.config.region,
      credentials: {
        accessKeyId: credentials.AccessKeyId!,
        secretAccessKey: credentials.SecretKey || credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken!
      }
    });

    const publicKeyResponse = await kmsClient.send(new GetPublicKeyCommand({
      KeyId: this.config.kmsKeyId
    }));

    if (!publicKeyResponse.PublicKey) {
      return null;
    }

    // 캐시 업데이트
    this.cachedPublicKey = new Uint8Array(publicKeyResponse.PublicKey);
    this.publicKeyCacheTime = now;

    return this.cachedPublicKey;
  }

  /**
   * 캐시 초기화
   */
  clearCache(): void {
    this.cachedPublicKey = null;
    this.publicKeyCacheTime = 0;
  }
}

/**
 * JWE 서비스 인스턴스 생성 헬퍼
 * @returns JWE 서비스 인스턴스
 */
export function createJWEService(authMode: 'guest' | 'iam' = 'guest'): JWEService {
  const config: JWEServiceConfig = {
    identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
    region: import.meta.env.VITE_AWS_REGION,
    kmsKeyId: import.meta.env.VITE_KMS_KEY_ID,
    authMode
  };

  if (authMode === 'iam') {
    config.iamCredentials = {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      frontendRoleArn: import.meta.env.VITE_FRONTEND_ROLE_ARN
    };
  }

  return new JWEService(config);
}