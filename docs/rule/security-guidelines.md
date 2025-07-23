# AI 코더 보안 지침

## 개요
이 문서는 AI 코더가 보안을 고려한 안전한 프론트엔드 코드를 작성하기 위한 가이드라인을 제공합니다.

## 기본 보안 원칙

### 1. 쿠키 보안 설정
```typescript
// Good: 보안 쿠키 설정
const cookieOptions = {
  secure: true,        // HTTPS에서만 전송
  sameSite: 'strict',  // CSRF 공격 방지
  httpOnly: true,      // XSS 공격 방지 (서버 측에서 설정)
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간
};

// Bad: 보안 설정 없는 쿠키
Cookies.set('token', value); // 보안 취약
```

### 2. API 토큰 관리
```typescript
// Good: 안전한 토큰 저장
import Cookies from 'js-cookie';

const saveToken = (token: string) => {
  Cookies.set('auth_token', token, {
    secure: true,
    sameSite: 'strict',
    expires: 1 // 1일
  });
};

const getToken = (): string | undefined => {
  return Cookies.get('auth_token');
};

// Bad: localStorage에 민감한 정보 저장
localStorage.setItem('token', token); // XSS 취약점
```

### 3. XSS 방지
```typescript
// Good: 입력값 검증 및 sanitization
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// React에서는 기본적으로 XSS 방지가 적용되지만 dangerouslySetInnerHTML 사용 시 주의
const SafeComponent = ({ userContent }: { userContent: string }) => {
  // Good: 텍스트로 렌더링 (자동 이스케이프)
  return <div>{userContent}</div>;
  
  // Bad: 검증되지 않은 HTML 삽입
  // return <div dangerouslySetInnerHTML={{ __html: userContent }} />;
};

// HTML 삽입이 필요한 경우 DOMPurify 사용
import DOMPurify from 'dompurify';

const SafeHTMLComponent = ({ htmlContent }: { htmlContent: string }) => {
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};
```

### 4. CSRF 방지
```typescript
// Good: CSRF 토큰 사용
const sendSecureRequest = async (data: any) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken || '',
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
};
```

### 5. 게스트 사용자 ID 생성
```typescript
// Good: 안전한 임시 ID 생성
const generateGuestId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `guest-${timestamp}-${random}`;
};

// 추가 보안: UUID 사용
import { v4 as uuidv4 } from 'uuid';

const generateSecureGuestId = (): string => {
  return `guest-${uuidv4()}`;
};

// Bad: 예측 가능한 ID
const badGuestId = `guest-${Date.now()}`; // 예측 가능
```

## JWE (JSON Web Encryption) 보안

### 1. JWE 토큰 생성
```typescript
import { EncryptJWT } from 'jose';

const createJWEToken = async (payload: any, secretKey: Uint8Array) => {
  try {
    const jwt = await new EncryptJWT(payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .encrypt(secretKey);
    
    return jwt;
  } catch (error) {
    console.error('JWE 생성 실패:', error);
    throw new Error('토큰 생성에 실패했습니다');
  }
};
```

### 2. JWE 토큰 검증
```typescript
import { jwtDecrypt } from 'jose';

const verifyJWEToken = async (token: string, secretKey: Uint8Array) => {
  try {
    const { payload } = await jwtDecrypt(token, secretKey);
    
    // 토큰 만료 시간 확인
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('토큰이 만료되었습니다');
    }
    
    return payload;
  } catch (error) {
    console.error('JWE 검증 실패:', error);
    throw new Error('유효하지 않은 토큰입니다');
  }
};
```

## AWS 보안 설정

### 1. Cognito Identity Pool 사용
```typescript
import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';

const getCognitoCredentials = async () => {
  try {
    const client = new CognitoIdentityClient({ 
      region: process.env.VITE_AWS_REGION 
    });
    
    // Identity ID 가져오기
    const getIdCommand = new GetIdCommand({
      IdentityPoolId: process.env.VITE_COGNITO_IDENTITY_POOL_ID,
    });
    
    const { IdentityId } = await client.send(getIdCommand);
    
    // 임시 자격증명 가져오기
    const getCredentialsCommand = new GetCredentialsForIdentityCommand({
      IdentityId,
    });
    
    const { Credentials } = await client.send(getCredentialsCommand);
    
    return Credentials;
  } catch (error) {
    console.error('Cognito 자격증명 획득 실패:', error);
    throw new Error('인증에 실패했습니다');
  }
};
```

### 2. KMS를 통한 암호화
```typescript
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

const encryptWithKMS = async (data: string, keyId: string) => {
  try {
    const client = new KMSClient({ region: process.env.VITE_AWS_REGION });
    
    const command = new EncryptCommand({
      KeyId: keyId,
      Plaintext: new TextEncoder().encode(data),
    });
    
    const response = await client.send(command);
    return response.CiphertextBlob;
  } catch (error) {
    console.error('KMS 암호화 실패:', error);
    throw new Error('암호화에 실패했습니다');
  }
};

const decryptWithKMS = async (encryptedData: Uint8Array) => {
  try {
    const client = new KMSClient({ region: process.env.VITE_AWS_REGION });
    
    const command = new DecryptCommand({
      CiphertextBlob: encryptedData,
    });
    
    const response = await client.send(command);
    return new TextDecoder().decode(response.Plaintext);
  } catch (error) {
    console.error('KMS 복호화 실패:', error);
    throw new Error('복호화에 실패했습니다');
  }
};
```

## 환경변수 보안

### 1. 환경변수 검증
```typescript
// Good: 환경변수 검증
const validateEnvironmentVariables = () => {
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_COGNITO_IDENTITY_POOL_ID',
    'VITE_AWS_REGION',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`필수 환경변수가 누락되었습니다: ${missingVars.join(', ')}`);
  }
};

// 앱 시작 시 검증 실행
validateEnvironmentVariables();
```

### 2. 민감한 정보 처리
```typescript
// Good: 민감한 정보 마스킹
const maskSensitiveInfo = (value: string): string => {
  if (value.length <= 4) return '****';
  return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
};

const logSafeEnvironment = () => {
  console.log('환경 설정:', {
    apiUrl: maskSensitiveInfo(process.env.VITE_API_BASE_URL || ''),
    region: process.env.VITE_AWS_REGION,
    nodeEnv: process.env.NODE_ENV,
    // 민감한 키는 로그에 출력하지 않음
  });
};

// Bad: 민감한 정보 로그 출력
console.log('KMS Key:', process.env.VITE_KMS_KEY_ARN); // 보안 위험
```

## API 통신 보안

### 1. HTTPS 강제
```typescript
// Good: HTTPS 확인
const ensureHTTPS = (url: string): string => {
  if (process.env.NODE_ENV === 'production' && !url.startsWith('https://')) {
    throw new Error('프로덕션 환경에서는 HTTPS가 필요합니다');
  }
  return url;
};

const apiUrl = ensureHTTPS(process.env.VITE_API_BASE_URL || '');
```

### 2. 요청 타임아웃 설정
```typescript
// Good: 타임아웃 설정으로 DoS 공격 방지
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다');
    }
    throw error;
  }
};
```

### 3. 입력값 검증
```typescript
// Good: API 요청 전 입력값 검증
interface ChatMessageRequest {
  message: string;
  userId: string;
  gradeId?: string;
}

const validateChatRequest = (request: ChatMessageRequest): void => {
  if (!request.message || request.message.trim().length === 0) {
    throw new Error('메시지는 필수입니다');
  }
  
  if (request.message.length > 1000) {
    throw new Error('메시지는 1000자를 초과할 수 없습니다');
  }
  
  if (!request.userId || request.userId.length < 5) {
    throw new Error('유효하지 않은 사용자 ID입니다');
  }
  
  // XSS 방지를 위한 HTML 태그 검사
  const htmlTagPattern = /<[^>]*>/g;
  if (htmlTagPattern.test(request.message)) {
    throw new Error('HTML 태그는 허용되지 않습니다');
  }
};

const sendChatMessage = async (message: string, userId: string, gradeId?: string) => {
  const request: ChatMessageRequest = { message, userId, gradeId };
  
  // 요청 전 검증
  validateChatRequest(request);
  
  // API 호출
  const response = await fetchWithTimeout('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  return response.json();
};
```

## 에러 처리 보안

### 1. 안전한 에러 메시지
```typescript
// Good: 사용자에게 안전한 에러 메시지 표시
const handleApiError = (error: unknown): string => {
  if (process.env.NODE_ENV === 'development') {
    console.error('API 에러 상세:', error);
  }
  
  // 프로덕션에서는 일반적인 메시지만 표시
  if (process.env.NODE_ENV === 'production') {
    return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  // 개발 환경에서는 상세 정보 표시
  if (error instanceof Error) {
    return error.message;
  }
  
  return String(error);
};

// Bad: 민감한 정보가 포함된 에러 메시지
const badErrorHandler = (error: any) => {
  alert(`에러 발생: ${JSON.stringify(error)}`); // 민감한 정보 노출 위험
};
```

### 2. 에러 로깅
```typescript
// Good: 안전한 에러 로깅
const logError = (error: unknown, context: string) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    message: error instanceof Error ? error.message : String(error),
    stack: process.env.NODE_ENV === 'development' ? 
      (error instanceof Error ? error.stack : undefined) : undefined,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  // 민감한 정보 제거
  const safeErrorInfo = {
    ...errorInfo,
    url: errorInfo.url.replace(/([?&]token=)[^&]+/, '$1[HIDDEN]'),
  };
  
  console.error('Error:', safeErrorInfo);
  
  // 프로덕션에서는 에러 모니터링 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorMonitoring(safeErrorInfo);
  }
};
```

## 보안 체크리스트

### 개발 시 확인사항
- [ ] 쿠키에 `secure`, `sameSite` 옵션 설정
- [ ] 민감한 데이터를 localStorage에 저장하지 않음
- [ ] 사용자 입력값에 대한 XSS 방지 처리
- [ ] API 요청에 적절한 타임아웃 설정
- [ ] 에러 메시지에서 민감한 정보 제거
- [ ] HTTPS 강제 사용 (프로덕션)
- [ ] 환경변수 검증 로직 구현
- [ ] JWE 토큰 만료 시간 확인

### 배포 전 확인사항
- [ ] `.env` 파일이 Git에서 제외되었는지 확인
- [ ] 프로덕션 환경변수가 올바르게 설정되었는지 확인
- [ ] 개발용 코드나 주석이 제거되었는지 확인
- [ ] 보안 헤더가 서버에서 올바르게 설정되었는지 확인
- [ ] CORS 정책이 적절히 설정되었는지 확인

### 정기적 보안 점검
- [ ] 의존성 패키지의 보안 취약점 확인 (`npm audit`)
- [ ] 만료된 인증서나 키 확인
- [ ] 접근 로그 분석
- [ ] 보안 패치 업데이트 적용

## 보안 도구 사용

### 1. npm audit 활용
```bash
# 보안 취약점 확인
npm audit

# 자동 수정 (주의: 호환성 확인 필요)
npm audit fix

# 심각한 취약점만 확인
npm audit --audit-level=high
```

### 2. 정적 분석 도구
```bash
# ESLint 보안 플러그인 설치
npm install --save-dev eslint-plugin-security

# .eslintrc.js에 추가
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"]
}
```

이 지침을 준수하여 안전하고 보안이 강화된 프론트엔드 애플리케이션을 개발하시기 바랍니다.