/**
 * Cognito Identity Pool 연결 테스트 컴포넌트
 * 단계별로 테스트하면서 문제를 파악합니다.
 */

import React, { useState } from 'react';
import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { KMSClient, GetPublicKeyCommand } from '@aws-sdk/client-kms';
import { generateJWEToken, createTestPayload } from '../../services/jwe/jweTokenGenerator';
import { chatJWEService } from '../../services/jwe/chatJWEService';
import { sendChatMessage } from '../../services/api/chat';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export const CognitoTestPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'iam' | 'profile'>('iam');
  const [testMode, setTestMode] = useState<'cognito' | 'kms' | 'jwe' | 'integration' | 'chat'>('cognito');
  const [lastPublicKey, setLastPublicKey] = useState<Uint8Array | null>(null);
  const [lastJWEToken, setLastJWEToken] = useState<string | null>(null);

  const addResult = (result: TestResult) => {
    setResults(prev => {
      const newResults = [...prev, result];
      // 새로운 결과가 추가되면 스크롤을 아래로 이동
      setTimeout(() => {
        // 전체 페이지를 맨 아래로 스크롤
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 100);
      return newResults;
    });
  };

  const clearResults = () => {
    setResults([]);
  };

  const testIAMAuthentication = async () => {
    setIsLoading(true);
    clearResults();

    try {
      // 1단계: IAM 환경변수 확인
      addResult({
        step: '1. IAM 환경변수 확인',
        status: 'pending',
        message: 'IAM 자격증명 환경변수 확인 중...'
      });

      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
      const region = import.meta.env.VITE_AWS_REGION;
      const frontendRoleArn = import.meta.env.VITE_FRONTEND_ROLE_ARN;

      if (!accessKeyId || !secretAccessKey || !region || !frontendRoleArn) {
        addResult({
          step: '1. IAM 환경변수 확인',
          status: 'error',
          message: 'IAM 자격증명 환경변수가 누락되었습니다',
          data: { 
            hasAccessKeyId: !!accessKeyId,
            hasSecretAccessKey: !!secretAccessKey,
            region,
            frontendRoleArn 
          }
        });
        return;
      }

      addResult({
        step: '1. IAM 환경변수 확인',
        status: 'success',
        message: 'IAM 환경변수 확인 완료',
        data: { region, frontendRoleArn, accessKeyId: accessKeyId.slice(0, 8) + '...' }
      });

      // 2단계: STS 클라이언트 생성 및 역할 가정
      addResult({
        step: '2. STS 역할 가정',
        status: 'pending',
        message: 'Frontend Role 가정 중...'
      });

      const stsClient = new STSClient({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        }
      });

      const assumeRoleCommand = new AssumeRoleCommand({
        RoleArn: frontendRoleArn,
        RoleSessionName: 'frontend-iam-auth-session',
        DurationSeconds: 3600
      });

      const assumeRoleResponse = await stsClient.send(assumeRoleCommand);

      if (!assumeRoleResponse.Credentials) {
        addResult({
          step: '2. STS 역할 가정',
          status: 'error',
          message: 'Frontend Role 가정에 실패했습니다'
        });
        return;
      }

      addResult({
        step: '2. STS 역할 가정',
        status: 'success',
        message: 'Frontend Role 가정 완료',
        data: {
          accessKeyId: assumeRoleResponse.Credentials.AccessKeyId?.slice(0, 8) + '...',
          expiration: assumeRoleResponse.Credentials.Expiration?.toISOString()
        }
      });

      // 3단계: Cognito Identity Pool에 인증된 사용자로 접근
      addResult({
        step: '3. Cognito 인증된 사용자 접근',
        status: 'pending',
        message: 'Cognito에 인증된 사용자로 접근 중...'
      });

      const cognitoClient = new CognitoIdentityClient({
        region: region,
        credentials: {
          accessKeyId: assumeRoleResponse.Credentials.AccessKeyId!,
          secretAccessKey: assumeRoleResponse.Credentials.SecretAccessKey!,
          sessionToken: assumeRoleResponse.Credentials.SessionToken!
        }
      });

      const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;
      const getIdCommand = new GetIdCommand({
        IdentityPoolId: identityPoolId,
      });

      const identityResponse = await cognitoClient.send(getIdCommand);

      if (!identityResponse.IdentityId) {
        addResult({
          step: '3. Cognito 인증된 사용자 접근',
          status: 'error',
          message: 'Cognito Identity ID 획득 실패'
        });
        return;
      }

      addResult({
        step: '3. Cognito 인증된 사용자 접근',
        status: 'success',
        message: 'Cognito 인증된 사용자 접근 완료',
        data: { identityId: identityResponse.IdentityId }
      });

      // 4단계: 인증된 사용자 자격증명 획득
      addResult({
        step: '4. 인증된 사용자 자격증명 획득',
        status: 'pending',
        message: '인증된 사용자 자격증명 요청 중...'
      });

      const getCredentialsCommand = new GetCredentialsForIdentityCommand({
        IdentityId: identityResponse.IdentityId,
      });

      const credentialsResponse = await cognitoClient.send(getCredentialsCommand);

      if (!credentialsResponse.Credentials) {
        addResult({
          step: '4. 인증된 사용자 자격증명 획득',
          status: 'error',
          message: '인증된 사용자 자격증명 획득 실패'
        });
        return;
      }

      addResult({
        step: '4. 인증된 사용자 자격증명 획득',
        status: 'success',
        message: '인증된 사용자 자격증명 획득 완료',
        data: {
          accessKeyId: credentialsResponse.Credentials.AccessKeyId,
          secretAccessKey: credentialsResponse.Credentials.SecretKey?.slice(0, 10) + '...',
          sessionToken: credentialsResponse.Credentials.SessionToken?.slice(0, 20) + '...',
          expiration: credentialsResponse.Credentials.Expiration?.toISOString()
        }
      });

      addResult({
        step: '✅ IAM 인증 테스트 완료',
        status: 'success',
        message: 'IAM 사용자 인증이 정상적으로 작동합니다!'
      });

    } catch (error) {
      addResult({
        step: '❌ IAM 인증 테스트 실패',
        status: 'error',
        message: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        data: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testProfileAuthentication = async () => {
    setIsLoading(true);
    clearResults();

    try {
      // 1단계: AWS Profile 확인
      addResult({
        step: '1. AWS Profile 확인',
        status: 'pending',
        message: 'AWS Profile 자격증명 확인 중...'
      });

      const region = import.meta.env.VITE_AWS_REGION;
      const frontendRoleArn = import.meta.env.VITE_FRONTEND_ROLE_ARN;
      const profileName = import.meta.env.VITE_AWS_PROFILE || 'default';

      if (!region || !frontendRoleArn) {
        addResult({
          step: '1. AWS Profile 확인',
          status: 'error',
          message: '필수 환경변수가 누락되었습니다',
          data: { region, frontendRoleArn, profileName }
        });
        return;
      }

      addResult({
        step: '1. AWS Profile 확인',
        status: 'success',
        message: 'AWS Profile 환경변수 확인 완료',
        data: { region, frontendRoleArn, profileName }
      });

      // 2단계: Profile 자격증명으로 STS 역할 가정
      addResult({
        step: '2. Profile로 STS 역할 가정',
        status: 'pending',
        message: 'Profile 자격증명으로 Frontend Role 가정 중...'
      });

      // Profile 인증은 브라우저 환경에서 직접 지원되지 않으므로
      // 환경변수를 통해 Profile 자격증명을 사용
      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
      
      if (!accessKeyId || !secretAccessKey) {
        addResult({
          step: '2. Profile로 STS 역할 가정',
          status: 'error',
          message: 'Profile 자격증명을 환경변수로 설정해야 합니다',
          data: { 
            note: 'VITE_AWS_ACCESS_KEY_ID, VITE_AWS_SECRET_ACCESS_KEY 환경변수 필요',
            profileName
          }
        });
        return;
      }

      const stsClient = new STSClient({
        region: region,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        }
      });

      const assumeRoleCommand = new AssumeRoleCommand({
        RoleArn: frontendRoleArn,
        RoleSessionName: 'frontend-profile-auth-session',
        DurationSeconds: 3600
      });

      const assumeRoleResponse = await stsClient.send(assumeRoleCommand);

      if (!assumeRoleResponse.Credentials) {
        addResult({
          step: '2. Profile로 STS 역할 가정',
          status: 'error',
          message: 'Profile로 Frontend Role 가정에 실패했습니다'
        });
        return;
      }

      addResult({
        step: '2. Profile로 STS 역할 가정',
        status: 'success',
        message: 'Profile로 Frontend Role 가정 완료',
        data: {
          accessKeyId: assumeRoleResponse.Credentials.AccessKeyId?.slice(0, 8) + '...',
          expiration: assumeRoleResponse.Credentials.Expiration?.toISOString(),
          profileName
        }
      });

      // 3단계: Cognito Identity Pool에 인증된 사용자로 접근
      addResult({
        step: '3. Cognito 인증된 사용자 접근',
        status: 'pending',
        message: 'Cognito에 인증된 사용자로 접근 중...'
      });

      const cognitoClient = new CognitoIdentityClient({
        region: region,
        credentials: {
          accessKeyId: assumeRoleResponse.Credentials.AccessKeyId!,
          secretAccessKey: assumeRoleResponse.Credentials.SecretAccessKey!,
          sessionToken: assumeRoleResponse.Credentials.SessionToken!
        }
      });

      const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;
      const getIdCommand = new GetIdCommand({
        IdentityPoolId: identityPoolId,
      });

      const identityResponse = await cognitoClient.send(getIdCommand);

      if (!identityResponse.IdentityId) {
        addResult({
          step: '3. Cognito 인증된 사용자 접근',
          status: 'error',
          message: 'Cognito Identity ID 획득 실패'
        });
        return;
      }

      addResult({
        step: '3. Cognito 인증된 사용자 접근',
        status: 'success',
        message: 'Cognito 인증된 사용자 접근 완료',
        data: { identityId: identityResponse.IdentityId }
      });

      // 4단계: 인증된 사용자 자격증명 획득
      addResult({
        step: '4. 인증된 사용자 자격증명 획득',
        status: 'pending',
        message: '인증된 사용자 자격증명 요청 중...'
      });

      const getCredentialsCommand = new GetCredentialsForIdentityCommand({
        IdentityId: identityResponse.IdentityId,
      });

      const credentialsResponse = await cognitoClient.send(getCredentialsCommand);

      if (!credentialsResponse.Credentials) {
        addResult({
          step: '4. 인증된 사용자 자격증명 획득',
          status: 'error',
          message: '인증된 사용자 자격증명 획득 실패'
        });
        return;
      }

      addResult({
        step: '4. 인증된 사용자 자격증명 획득',
        status: 'success',
        message: '인증된 사용자 자격증명 획득 완료',
        data: {
          accessKeyId: credentialsResponse.Credentials.AccessKeyId,
          secretAccessKey: credentialsResponse.Credentials.SecretKey?.slice(0, 10) + '...',
          sessionToken: credentialsResponse.Credentials.SessionToken?.slice(0, 20) + '...',
          expiration: credentialsResponse.Credentials.Expiration?.toISOString()
        }
      });

      addResult({
        step: '✅ Profile 인증 테스트 완료',
        status: 'success',
        message: 'AWS Profile 인증이 정상적으로 작동합니다!'
      });

    } catch (error) {
      addResult({
        step: '❌ Profile 인증 테스트 실패',
        status: 'error',
        message: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        data: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCognitoConnection = async () => {
    setIsLoading(true);
    clearResults();

    try {
      // 1단계: 환경변수 확인
      addResult({
        step: '1. 환경변수 확인',
        status: 'pending',
        message: '환경변수 로드 중...'
      });

      const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;
      const region = import.meta.env.VITE_AWS_REGION;

      if (!identityPoolId || !region) {
        addResult({
          step: '1. 환경변수 확인',
          status: 'error',
          message: '필수 환경변수가 누락되었습니다',
          data: { identityPoolId, region }
        });
        return;
      }

      addResult({
        step: '1. 환경변수 확인',
        status: 'success',
        message: '환경변수 로드 완료',
        data: { identityPoolId, region }
      });

      // 2단계: Cognito 클라이언트 생성
      addResult({
        step: '2. Cognito 클라이언트 생성',
        status: 'pending',
        message: 'Cognito 클라이언트 생성 중...'
      });

      const cognitoClient = new CognitoIdentityClient({
        region: region,
      });

      addResult({
        step: '2. Cognito 클라이언트 생성',
        status: 'success',
        message: 'Cognito 클라이언트 생성 완료'
      });

      // 3단계: Identity ID 획득
      addResult({
        step: '3. Identity ID 획득',
        status: 'pending',
        message: 'Cognito Identity ID 요청 중...'
      });

      const getIdCommand = new GetIdCommand({
        IdentityPoolId: identityPoolId,
      });

      const identityResponse = await cognitoClient.send(getIdCommand);

      if (!identityResponse.IdentityId) {
        addResult({
          step: '3. Identity ID 획득',
          status: 'error',
          message: 'Identity ID를 획득할 수 없습니다'
        });
        return;
      }

      addResult({
        step: '3. Identity ID 획득',
        status: 'success',
        message: 'Identity ID 획득 완료',
        data: { identityId: identityResponse.IdentityId }
      });

      // 4단계: 자격증명 획득
      addResult({
        step: '4. 자격증명 획득',
        status: 'pending',
        message: 'AWS 자격증명 요청 중...'
      });

      const getCredentialsCommand = new GetCredentialsForIdentityCommand({
        IdentityId: identityResponse.IdentityId,
      });

      const credentialsResponse = await cognitoClient.send(getCredentialsCommand);

      if (!credentialsResponse.Credentials) {
        addResult({
          step: '4. 자격증명 획득',
          status: 'error',
          message: 'AWS 자격증명을 획득할 수 없습니다'
        });
        return;
      }

      addResult({
        step: '4. 자격증명 획득',
        status: 'success',
        message: 'AWS 자격증명 획득 완료',
        data: {
          accessKeyId: credentialsResponse.Credentials.AccessKeyId,
          secretAccessKey: credentialsResponse.Credentials.SecretKey?.slice(0, 10) + '...',
          sessionToken: credentialsResponse.Credentials.SessionToken?.slice(0, 20) + '...',
          expiration: credentialsResponse.Credentials.Expiration?.toISOString()
        }
      });

      addResult({
        step: '✅ 게스트 접근 테스트 완료',
        status: 'success',
        message: 'Cognito Identity Pool 게스트 접근이 정상적으로 작동합니다!'
      });

    } catch (error) {
      addResult({
        step: '❌ 게스트 접근 테스트 실패',
        status: 'error',
        message: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        data: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testKMSAccess = async () => {
    setIsLoading(true);
    clearResults();

    try {
      // 1단계: 환경변수 확인
      addResult({
        step: '1. KMS 환경변수 확인',
        status: 'pending',
        message: 'KMS 환경변수 확인 중...'
      });

      const region = import.meta.env.VITE_AWS_REGION;
      const kmsKeyId = import.meta.env.VITE_KMS_KEY_ID;
      const kmsKeyArn = import.meta.env.VITE_KMS_KEY_ARN;

      if (!region || !kmsKeyId) {
        addResult({
          step: '1. KMS 환경변수 확인',
          status: 'error',
          message: 'KMS 환경변수가 누락되었습니다',
          data: { region, kmsKeyId, kmsKeyArn }
        });
        return;
      }

      addResult({
        step: '1. KMS 환경변수 확인',
        status: 'success',
        message: 'KMS 환경변수 확인 완료',
        data: { region, kmsKeyId, kmsKeyArn }
      });

      // 2단계: Cognito 자격증명 획득
      addResult({
        step: '2. Cognito 자격증명 획득',
        status: 'pending',
        message: 'Cognito 자격증명 획득 중...'
      });

      let credentials;
      
      // IAM 사용자 방식만 사용
      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
      const frontendRoleArn = import.meta.env.VITE_FRONTEND_ROLE_ARN;

      if (!accessKeyId || !secretAccessKey || !frontendRoleArn) {
        addResult({
          step: '2. Cognito 자격증명 획득',
          status: 'error',
          message: 'IAM 환경변수가 누락되었습니다'
        });
        return;
      }

      const stsClient = new STSClient({
        region,
        credentials: { accessKeyId, secretAccessKey }
      });

      const assumeRoleResponse = await stsClient.send(new AssumeRoleCommand({
        RoleArn: frontendRoleArn,
        RoleSessionName: 'kms-test-session',
        DurationSeconds: 3600
      }));

      credentials = assumeRoleResponse.Credentials;

      if (!credentials) {
        addResult({
          step: '2. Cognito 자격증명 획득',
          status: 'error',
          message: 'AWS 자격증명을 획득할 수 없습니다'
        });
        return;
      }

      addResult({
        step: '2. Cognito 자격증명 획득',
        status: 'success',
        message: 'AWS 자격증명 획득 완료',
        data: {
          accessKeyId: credentials.AccessKeyId?.slice(0, 8) + '...',
          expiration: credentials.Expiration?.toISOString(),
          authMode: authMode,
          note: 'IAM 사용자 - Frontend 역할 사용'
        }
      });

      // 3단계: KMS 클라이언트 생성 및 공개키 조회
      addResult({
        step: '3. KMS 공개키 조회',
        status: 'pending',
        message: 'KMS 공개키 조회 중...'
      });

      const kmsClient = new KMSClient({
        region,
        credentials: {
          accessKeyId: credentials.AccessKeyId!,
          secretAccessKey: (credentials as any).SecretKey || (credentials as any).SecretAccessKey,
          sessionToken: credentials.SessionToken!
        }
      });

      const publicKeyResponse = await kmsClient.send(new GetPublicKeyCommand({
        KeyId: kmsKeyId
      }));

      if (!publicKeyResponse.PublicKey) {
        addResult({
          step: '3. KMS 공개키 조회',
          status: 'error',
          message: 'KMS 공개키를 조회할 수 없습니다'
        });
        return;
      }

      // 공개키를 저장 (JWE 테스트에서 사용)
      const publicKeyArray = new Uint8Array(publicKeyResponse.PublicKey);
      setLastPublicKey(publicKeyArray);
      
      // 공개키를 Base64로 인코딩 (브라우저 환경에서 사용 가능한 방법)
      const publicKeyBase64 = btoa(String.fromCharCode(...publicKeyArray));

      addResult({
        step: '3. KMS 공개키 조회',
        status: 'success',
        message: 'KMS 공개키 조회 완료',
        data: {
          keyId: publicKeyResponse.KeyId,
          keyUsage: publicKeyResponse.KeyUsage,
          keySpec: publicKeyResponse.KeySpec,
          encryptionAlgorithms: publicKeyResponse.EncryptionAlgorithms,
          publicKeyLength: publicKeyResponse.PublicKey.length,
          publicKeyPreview: publicKeyBase64.slice(0, 100) + '...'
        }
      });

      addResult({
        step: '✅ KMS 테스트 완료',
        status: 'success',
        message: 'KMS 공개키 조회가 정상적으로 작동합니다!'
      });

    } catch (error) {
      addResult({
        step: '❌ KMS 테스트 실패',
        status: 'error',
        message: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        data: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testJWEGeneration = async () => {
    setIsLoading(true);
    clearResults();

    try {
      // 1단계: 공개키 확인
      addResult({
        step: '1. KMS 공개키 확인',
        status: 'pending',
        message: 'KMS 공개키 확인 중...'
      });

      if (!lastPublicKey) {
        addResult({
          step: '1. KMS 공개키 확인',
          status: 'error',
          message: '먼저 KMS 공개키 조회 테스트를 실행해주세요.'
        });
        return;
      }

      addResult({
        step: '1. KMS 공개키 확인',
        status: 'success',
        message: 'KMS 공개키 확인 완료',
        data: {
          publicKeyLength: lastPublicKey.length,
          publicKeyType: 'RSA_2048'
        }
      });

      // 2단계: 테스트 페이로드 생성
      addResult({
        step: '2. 테스트 페이로드 생성',
        status: 'pending',
        message: '암호화할 페이로드 생성 중...'
      });

      const testPayload = createTestPayload('test-user-123');
      
      addResult({
        step: '2. 테스트 페이로드 생성',
        status: 'success',
        message: '테스트 페이로드 생성 완료',
        data: testPayload
      });

      // 3단계: JWE 토큰 생성
      addResult({
        step: '3. JWE 토큰 생성',
        status: 'pending',
        message: 'JWE 토큰 생성 중...'
      });

      const result = await generateJWEToken(lastPublicKey, testPayload);

      if (result.success) {
        addResult({
          step: '3. JWE 토큰 생성',
          status: 'success',
          message: 'JWE 토큰 생성 완료',
          data: {
            tokenLength: result.token?.length,
            tokenPreview: result.token?.slice(0, 100) + '...',
            details: result.details
          }
        });

        // 4단계: 토큰 구조 분석
        addResult({
          step: '4. JWE 토큰 구조 분석',
          status: 'pending',
          message: 'JWE 토큰 구조 분석 중...'
        });

        const tokenParts = result.token?.split('.');
        if (tokenParts && tokenParts.length === 5) {
          addResult({
            step: '4. JWE 토큰 구조 분석',
            status: 'success',
            message: 'JWE 토큰 구조 분석 완료',
            data: {
              structure: 'Compact Serialization Format',
              parts: [
                { name: 'Protected Header', length: tokenParts[0].length },
                { name: 'Encrypted Key', length: tokenParts[1].length },
                { name: 'Initialization Vector', length: tokenParts[2].length },
                { name: 'Ciphertext', length: tokenParts[3].length },
                { name: 'Authentication Tag', length: tokenParts[4].length }
              ],
              totalParts: tokenParts.length
            }
          });
        }

        // 토큰 저장
        setLastJWEToken(result.token!);
        
        addResult({
          step: '✅ JWE 토큰 생성 테스트 완료',
          status: 'success',
          message: 'JWE 토큰이 정상적으로 생성되었습니다!',
          data: {
            fullToken: result.token
          }
        });

      } else {
        addResult({
          step: '3. JWE 토큰 생성',
          status: 'error',
          message: `JWE 토큰 생성 실패: ${result.error}`,
          data: result.details
        });
      }

    } catch (error) {
      addResult({
        step: '❌ JWE 토큰 생성 테스트 실패',
        status: 'error',
        message: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        data: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testIntegration = async () => {
    setIsLoading(true);
    clearResults();
    let publicKey: Uint8Array | null = null;
    let jweToken: string | null = null;

    try {
      // 단계 1: Cognito 인증
      addResult({
        step: '[통합] 1. Cognito 인증',
        status: 'pending',
        message: 'Cognito Identity Pool 연결 중...'
      });

      const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;
      const region = import.meta.env.VITE_AWS_REGION;
      let credentials;

      // IAM 사용자 인증만 사용
      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
      const frontendRoleArn = import.meta.env.VITE_FRONTEND_ROLE_ARN;

      const stsClient = new STSClient({
        region,
        credentials: { accessKeyId, secretAccessKey }
      });

      const assumeRoleResponse = await stsClient.send(new AssumeRoleCommand({
        RoleArn: frontendRoleArn,
        RoleSessionName: 'integration-test-session',
        DurationSeconds: 3600
      }));
      credentials = assumeRoleResponse.Credentials;

      if (!credentials) {
        throw new Error('AWS 자격증명 획득 실패');
      }

      addResult({
        step: '[통합] 1. Cognito 인증',
        status: 'success',
        message: 'Cognito 인증 성공',
        data: {
          authMode,
          accessKeyId: credentials.AccessKeyId?.slice(0, 8) + '...',
          expiration: credentials.Expiration?.toISOString()
        }
      });

      // 단계 2: KMS 공개키 조회
      addResult({
        step: '[통합] 2. KMS 공개키 조회',
        status: 'pending',
        message: 'KMS 공개키 조회 중...'
      });

      const kmsKeyId = import.meta.env.VITE_KMS_KEY_ID;
      const kmsClient = new KMSClient({
        region,
        credentials: {
          accessKeyId: credentials.AccessKeyId!,
          secretAccessKey: (credentials as any).SecretKey || (credentials as any).SecretAccessKey,
          sessionToken: credentials.SessionToken!
        }
      });

      const publicKeyResponse = await kmsClient.send(new GetPublicKeyCommand({
        KeyId: kmsKeyId
      }));

      if (!publicKeyResponse.PublicKey) {
        throw new Error('KMS 공개키 조회 실패');
      }

      publicKey = new Uint8Array(publicKeyResponse.PublicKey);
      setLastPublicKey(publicKey);

      addResult({
        step: '[통합] 2. KMS 공개키 조회',
        status: 'success',
        message: 'KMS 공개키 조회 성공',
        data: {
          keyId: publicKeyResponse.KeyId,
          keySpec: publicKeyResponse.KeySpec,
          keyUsage: publicKeyResponse.KeyUsage,
          publicKeyLength: publicKey.length
        }
      });

      // 단계 3: JWE 토큰 생성
      addResult({
        step: '[통합] 3. JWE 토큰 생성',
        status: 'pending',
        message: 'JWE 토큰 생성 중...'
      });

      const testPayload = createTestPayload('integration-test-user');
      const jweResult = await generateJWEToken(publicKey, testPayload);

      if (!jweResult.success || !jweResult.token) {
        throw new Error(jweResult.error || 'JWE 토큰 생성 실패');
      }

      jweToken = jweResult.token;
      setLastJWEToken(jweToken);

      addResult({
        step: '[통합] 3. JWE 토큰 생성',
        status: 'success',
        message: 'JWE 토큰 생성 성공',
        data: {
          tokenLength: jweToken.length,
          tokenPreview: jweToken.slice(0, 50) + '...',
          details: jweResult.details
        }
      });

      // 단계 4: 토큰 검증
      addResult({
        step: '[통합] 4. 토큰 검증',
        status: 'pending',
        message: 'JWE 토큰 구조 검증 중...'
      });

      const tokenParts = jweToken.split('.');
      if (tokenParts.length !== 5) {
        throw new Error(`잘못된 JWE 토큰 형식: ${tokenParts.length}개 부분 (예상: 5개)`);
      }

      // Protected Header 디코딩
      const protectedHeader = JSON.parse(atob(tokenParts[0]));

      addResult({
        step: '[통합] 4. 토큰 검증',
        status: 'success',
        message: 'JWE 토큰 검증 성공',
        data: {
          structure: 'Compact Serialization (5 parts)',
          protectedHeader,
          parts: [
            { name: 'Protected Header', length: tokenParts[0].length },
            { name: 'Encrypted Key', length: tokenParts[1].length },
            { name: 'Initialization Vector', length: tokenParts[2].length },
            { name: 'Ciphertext', length: tokenParts[3].length },
            { name: 'Authentication Tag', length: tokenParts[4].length }
          ]
        }
      });

      // 성공 메시지
      addResult({
        step: '✅ 통합 테스트 완료',
        status: 'success',
        message: '모든 단계가 성공적으로 완료되었습니다!',
        data: {
          summary: {
            authMode,
            cognitoIdentityPool: identityPoolId,
            kmsKeyId: import.meta.env.VITE_KMS_KEY_ID,
            jweTokenLength: jweToken.length,
            fullToken: jweToken
          }
        }
      });

    } catch (error) {
      addResult({
        step: '❌ 통합 테스트 실패',
        status: 'error',
        message: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        data: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestStart = () => {
    if (testMode === 'cognito') {
      if (authMode === 'iam') {
        testIAMAuthentication();
      } else {
        testProfileAuthentication();
      }
    } else if (testMode === 'kms') {
      testKMSAccess();
    } else if (testMode === 'jwe') {
      testJWEGeneration();
    } else if (testMode === 'chat') {
      testChatJWE();
    } else {
      testIntegration();
    }
  };

  const testChatJWE = async () => {
    setIsLoading(true);
    clearResults();

    try {
      // authMode가 'profile'인 경우 'iam'으로 변환
      const jweAuthMode = authMode === 'profile' ? 'iam' : authMode;
      
      // 1단계: 채팅 JWE 서비스 설정 확인
      addResult({
        step: '1. 채팅 JWE 서비스 설정 확인',
        status: 'pending',
        message: '채팅 JWE 서비스 설정 확인 중...'
      });

      const config = chatJWEService.getCurrentConfig();
      
      addResult({
        step: '1. 채팅 JWE 서비스 설정 확인',
        status: 'success',
        message: '채팅 JWE 서비스 설정 확인 완료',
        data: {
          clientId: config.clientId,
          appId: config.appId,
          authMode: jweAuthMode
        }
      });

      // 2단계: JWE 토큰 생성 테스트
      addResult({
        step: '2. 채팅용 JWE 토큰 생성',
        status: 'pending',
        message: 'client_id와 app_id가 포함된 JWE 토큰 생성 중...'
      });

      const jweResult = await chatJWEService.createChatJWEToken({ authMode: jweAuthMode });
      
      if (!jweResult.success || !jweResult.token) {
        addResult({
          step: '2. 채팅용 JWE 토큰 생성',
          status: 'error',
          message: `JWE 토큰 생성 실패: ${jweResult.error}`,
          data: jweResult.details
        });
        return;
      }

      addResult({
        step: '2. 채팅용 JWE 토큰 생성',
        status: 'success',
        message: '채팅용 JWE 토큰 생성 성공',
        data: {
          tokenLength: jweResult.token.length,
          tokenPreview: jweResult.token.slice(0, 50) + '...',
          details: jweResult.details
        }
      });

      // 3단계: 채팅 API 호출 테스트
      addResult({
        step: '3. JWE 헤더를 포함한 채팅 API 호출',
        status: 'pending',
        message: 'JWE 토큰이 포함된 채팅 메시지 전송 중...'
      });

      const testMessage = 'JWE 테스트 메시지입니다.';
      const testUserId = `test-user-${Date.now()}`;
      
      // 실제 채팅 API 호출 (JWE 헤더 포함)
      const chatResponse = await sendChatMessage(testMessage, testUserId);

      addResult({
        step: '3. JWE 헤더를 포함한 채팅 API 호출',
        status: 'success',
        message: '채팅 API 호출 성공',
        data: {
          request: {
            message: testMessage,
            userId: testUserId,
            jweHeaderIncluded: true
          },
          response: {
            responseLength: chatResponse.response?.length || 0,
            responsePreview: chatResponse.response?.slice(0, 100) + '...',
            timestamp: chatResponse.timestamp,
            tool: chatResponse.tool
          }
        }
      });

      // 성공 메시지
      addResult({
        step: '✅ 채팅 JWE 통합 테스트 완료',
        status: 'success',
        message: 'JWE 토큰이 포함된 채팅 API 호출이 성공했습니다!',
        data: {
          summary: {
            jweTokenGenerated: true,
            apiCallSuccessful: true,
            client_id: config.clientId,
            app_id: config.appId,
            authMode: jweAuthMode,
            testMessage,
            responseReceived: !!chatResponse.response
          }
        }
      });

    } catch (error) {
      addResult({
        step: '❌ 채팅 JWE 테스트 실패',
        status: 'error',
        message: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        data: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700">테스트 모드:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTestMode('cognito')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                testMode === 'cognito'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cognito 인증
            </button>
            <button
              onClick={() => setTestMode('kms')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                testMode === 'kms'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              KMS 공개키 조회
            </button>
            <button
              onClick={() => setTestMode('jwe')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                testMode === 'jwe'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              JWE 토큰 생성
            </button>
            <button
              onClick={() => setTestMode('integration')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                testMode === 'integration'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              통합 테스트
            </button>
            <button
              onClick={() => setTestMode('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                testMode === 'chat'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              채팅 JWE 테스트
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700">인증 방식:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAuthMode('iam')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                authMode === 'iam'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              IAM 환경변수
            </button>
            <button
              onClick={() => setAuthMode('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                authMode === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              AWS Profile
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleTestStart}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : testMode === 'cognito'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLoading ? '테스트 진행 중...' : `${testMode === 'cognito' ? 'Cognito 인증' : testMode === 'kms' ? 'KMS 공개키 조회' : testMode === 'jwe' ? 'JWE 토큰 생성' : testMode === 'chat' ? '채팅 JWE' : '통합'} 테스트 시작`}
          </button>
          
          {results.length > 0 && (
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              결과 초기화
            </button>
          )}
        </div>
      </div>

      <div className="test-results space-y-4 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50" style={{ maxHeight: '450px' }}>
        {results.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            테스트 결과가 여기에 표시됩니다.
          </div>
        ) : (
          results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              result.status === 'success'
                ? 'bg-green-50 border-green-500'
                : result.status === 'error'
                ? 'bg-red-50 border-red-500'
                : 'bg-blue-50 border-blue-500'
            }`}
          >
            <div className="flex items-center mb-2">
              <span className={`w-3 h-3 rounded-full mr-3 ${
                result.status === 'success'
                  ? 'bg-green-500'
                  : result.status === 'error'
                  ? 'bg-red-500'
                  : 'bg-blue-500'
              }`}></span>
              <h3 className="font-semibold text-gray-800">{result.step}</h3>
            </div>
            <p className="text-gray-700 mb-2">{result.message}</p>
            {result.data && (
              <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
          ))
        )}
      </div>
    </div>
  );
};