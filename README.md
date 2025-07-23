# CS 교육 지원 챗봇 프론트엔드

[![CI/CD Pipeline](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/meeta-inc/ai-navi-outbound-cs-314community-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/meeta-inc/ai-navi-outbound-cs-314community-frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Jest Tests](https://img.shields.io/badge/tests-passing-brightgreen)

연성회 외부생 위한 CS(Customer Support) 챗봇 웹 애플리케이션입니다.

## 🌟 주요 기능

- **다국어 지원**: 일본어, 한국어, 영어 (기본값: 일본어)
- **AI 챗봇 상담**: 학습 관련 질문과 기술적 문의 지원
- **타이핑 애니메이션**: 자연스러운 대화 느낌의 UI
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **보안 통신**: JWE 암호화를 통한 안전한 API 통신
- **AWS 통합**: Cognito Identity Pool, KMS를 활용한 보안 강화
- **학년별 맞춤 대응**: 학년 선택 기능을 통한 맞춤형 응답

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Cookie Management**: js-cookie
- **AWS SDK**: Cognito Identity, KMS, STS
- **Security**: JWE (JSON Web Encryption) with jose library

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트 (Atomic Design)
│   ├── atoms/          # 기본 UI 컴포넌트 (Button, Icon, Typography)
│   ├── molecules/      # 복합 컴포넌트 (ChatBubble, InputField, UserAvatar)
│   ├── organisms/      # 기능 컴포넌트 (ChatMessage, ChatInput, NavigationHeader)
│   └── templates/      # 레이아웃 템플릿 (ChatLayout)
├── contexts/           # React Context (LocaleContext, ThemeContext)
├── hooks/              # 커스텀 훅 (useChat, useTheme, useKeyboardState)
├── locales/            # 다국어 번역 파일
│   ├── ja/            # 일본어
│   ├── ko/            # 한국어
│   └── en/            # 영어
├── pages/              # 페이지 컴포넌트 (MainPage)
├── services/           # API 및 비즈니스 로직
│   ├── api/           # API 관련 (chat, user, questions)
│   ├── auth/          # 인증 관련 (token)
│   └── jwe/           # JWE 암호화 서비스
├── shared/             # 공유 설정 및 상수
│   ├── config/        # 앱 설정 (app, chat, header, menu, theme)
│   └── constants/     # 상수 정의 (grade)
├── types/              # TypeScript 타입 정의
├── dev/                # 개발 전용 (프로덕션에서 제외)
│   ├── components/    # 개발 도구 컴포넌트
│   └── pages/         # 테스트 페이지 (CognitoTestPage, JWETestPage)
└── assets/             # 정적 자산 (icons, images)
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **프로덕션 빌드**
   ```bash
   npm run build
   ```

4. **빌드 미리보기**
   ```bash
   npm run preview
   ```

5. **테스트 실행**
   ```bash
   # Jest 단위 테스트
   npm test
   
   # 커버리지 포함 테스트
   npm run test:coverage
   
   # 감시 모드 테스트
   npm run test:watch
   ```

6. **린트 검사**
   ```bash
   npm run lint
   ```

7. **Storybook 실행**
   ```bash
   npm run storybook
   ```

## 🧪 테스트 및 품질 보증

### Jest 단위 테스트
71개의 테스트 케이스로 높은 품질을 보장합니다:

```bash
# 모든 테스트 실행
npm test

# 커버리지 확인 (90% 이상 목표)
npm run test:coverage

# 특정 파일 테스트
npm test ChatMessage.test.tsx

# 감시 모드로 개발 중 테스트
npm run test:watch
```

**테스트 종류:**
- **컴포넌트 테스트**: React Testing Library를 사용한 UI 컴포넌트 테스트
- **API 서비스 테스트**: Mock을 활용한 서비스 로직 테스트
- **유틸리티 테스트**: 헬퍼 함수와 유틸리티 테스트
- **설정 테스트**: 앱 설정과 상수 검증

### Storybook 컴포넌트 개발
```bash
# Storybook 개발 서버 실행
npm run storybook

# 정적 빌드 생성
npm run build-storybook

# 시각적 회귀 테스트
npm run test-storybook
```

### CI/CD 자동화
- **GitHub Actions**: Node.js 18.x, 20.x, 22.x 매트릭스 테스트
- **ESLint**: 코드 품질 및 스타일 검사
- **Jest**: 자동화된 단위 테스트 실행
- **Codecov**: 테스트 커버리지 추적 및 리포팅
- **Chromatic**: Storybook 시각적 회귀 테스트

## 🛠 개발 도구

### 개발 전용 페이지 (Dev Tools)
개발 환경에서만 접근 가능한 테스트 도구들이 제공됩니다:

- **JWE 테스트**: `/dev/jwe-test` - JWE 토큰 생성 및 암호화 테스트
- **Cognito 테스트**: `/dev/cognito-test` - AWS Cognito 인증 테스트

이 페이지들은:
- 개발 환경에서만 표시됩니다 (`NODE_ENV=development`)
- 프로덕션 빌드에서는 자동으로 제외됩니다
- AWS 자격증명과 KMS 키 테스트가 가능합니다

## 🌍 다국어 지원

### 언어 전환
```typescript
import { useLocale } from './contexts/LocaleContext';

function Component() {
  const { locale, setLocale, t } = useLocale();
  
  // 언어 변경
  setLocale('ja'); // 일본어
  setLocale('ko'); // 한국어
  setLocale('en'); // 영어
  
  // 번역 사용
  const greeting = t('chat.greeting');
  const parameterized = t('chat.greeting', { name: '사용자' });
}
```

### 번역 파일 추가
새로운 번역 키를 추가하려면 `src/locales/{언어}/common.json` 파일을 수정하세요.

```json
{
  "newSection": {
    "newKey": "번역된 텍스트"
  }
}
```

## 🔧 API 연동

### 환경 변수 설정
`.env` 파일에 필요한 환경변수를 설정하세요:

```env
# API 엔드포인트
VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/stage
VITE_CHAT_API_URL=https://your-chat-api-url.execute-api.region.amazonaws.com/stage

# UI 설정
VITE_ACCENT_COLOR=green
VITE_SHOW_NAVIGATION_HEADER=true
VITE_SHOW_TIMESTAMP=true
VITE_SHOW_GRADE_SELECTION=true

# AWS Cognito Identity Pool
VITE_COGNITO_IDENTITY_POOL_ID=region:identity-pool-id

# AWS KMS 설정 (JWE 암호화용)
VITE_KMS_KEY_ID=alias/your-kms-key-alias
VITE_KMS_KEY_ARN=arn:aws:kms:region:account-id:key/key-id

# AWS 리전 설정
VITE_AWS_REGION=ap-northeast-1
VITE_NODE_ENV=development

# JWE 설정
VITE_CLIENT_ID=your-client-id
VITE_APP_ID=your-app-id

# AWS 역할 ARN (Frontend 역할)
VITE_FRONTEND_ROLE_ARN=arn:aws:iam::account-id:role/your-frontend-role

# AWS 자격증명 (개발 환경에서만 사용)
# VITE_AWS_ACCESS_KEY_ID=your_access_key_here
# VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here

# AWS Profile 설정 (개발 환경)
VITE_AWS_PROFILE=your-aws-profile
```

### 환경변수 설명

#### 필수 설정
- **VITE_API_BASE_URL**: 메인 API Gateway 엔드포인트
- **VITE_CHAT_API_URL**: 채팅 전용 API 엔드포인트
- **VITE_COGNITO_IDENTITY_POOL_ID**: AWS Cognito Identity Pool ID
- **VITE_AWS_REGION**: AWS 리전 (기본값: ap-northeast-1)

#### JWE 암호화 설정
- **VITE_KMS_KEY_ID**: KMS 암호화 키 별칭
- **VITE_KMS_KEY_ARN**: KMS 키의 전체 ARN
- **VITE_CLIENT_ID**: 클라이언트 식별자
- **VITE_APP_ID**: 애플리케이션 식별자

#### 개발 환경 설정
- **VITE_AWS_PROFILE**: AWS CLI 프로필 이름 (AWS 자격증명 대신 사용 권장)
- **VITE_AWS_ACCESS_KEY_ID/SECRET_ACCESS_KEY**: 직접 자격증명 (보안상 권장하지 않음)
- **VITE_FRONTEND_ROLE_ARN**: Frontend 역할 ARN (AssumeRole에 사용)

#### UI 설정
- **VITE_ACCENT_COLOR**: 테마 색상 (green, blue, purple 등)
- **VITE_SHOW_NAVIGATION_HEADER**: 상단 네비게이션 표시 여부
- **VITE_SHOW_TIMESTAMP**: 메시지 타임스탬프 표시 여부
- **VITE_SHOW_GRADE_SELECTION**: 학년 선택 기능 활성화 여부

### 보안 주의사항
보안 관련 자세한 내용은 [보안 지침 문서](docs/rule/security-guidelines.md)를 참조하세요.

### 챗봇 API 사용
```typescript
import { sendChatMessage } from './services/api/chat';

const response = await sendChatMessage('안녕하세요', 'guest-123');
console.log(response.response); // 챗봇 응답
console.log(response.tool);     // 도구 사용 정보 (선택적)
```

### API 응답 형태
```json
{
  "response": "챗봇의 응답 메시지",
  "tool": {
    "type": "tool_use",
    "id": "tool_id",
    "name": "tool_name",
    "input": {}
  }
}
```

## 🎨 컴포넌트 설정 및 사용법

컴포넌트 설정 및 사용법에 대한 자세한 내용은 [컴포넌트 설정 지침 문서](docs/rule/component-configuration.md)를 참조하세요.

### 주요 컴포넌트 간단 예시

```typescript
// 채팅 메시지
<ChatMessage message={message} isTyping={false} />

// 채팅 입력
<ChatInput value={text} onChange={setText} onSend={handleSend} />

// 빠른 답변
<QuickReply show={true} onReplyClick={handleReply} />
```

## 📱 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🏗 아키텍처 특징

### 관심사 분리
- **컴포넌트**: UI 렌더링에 집중
- **훅**: 비즈니스 로직과 상태 관리
- **서비스**: API 통신과 데이터 처리
- **컨텍스트**: 전역 상태 관리 (다국어)

### 확장 가능한 구조
- 모듈화된 서비스 디렉토리
- 타입 안정성을 위한 TypeScript
- 재사용 가능한 UI 컴포넌트
- 체계적인 번역 파일 관리

## 🤝 기여 방법

1. 이 저장소를 Fork 합니다
2. Feature 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🐛 버그 리포트 및 기능 요청

이슈가 있거나 새로운 기능을 제안하고 싶으시면 GitHub Issues를 사용해 주세요.

---

**CS 교육을 위한 사랑으로 제작 ❤️**