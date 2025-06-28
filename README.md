# CS 교육 지원 챗봇 프론트엔드

연성회 외부생 위한 CS(Customer Support) 챗봇 웹 애플리케이션입니다.

## 🌟 주요 기능

- **다국어 지원**: 일본어, 한국어, 영어 (기본값: 일본어)
- **AI 챗봇 상담**: 학습 관련 질문과 기술적 문의 지원
- **타이핑 애니메이션**: 자연스러운 대화 느낌의 UI
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **게스트 사용**: 로그인 없이 바로 사용 가능

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Cookie Management**: js-cookie

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트 (NavigationHeader)
│   ├── layout/         # 레이아웃 컴포넌트
│   └── ui/             # UI 컴포넌트 (ChatMessage, ChatInput, QuickReply, TypewriterText)
├── contexts/           # React Context (LocaleContext)
├── hooks/              # 커스텀 훅 (useChat)
├── locales/            # 다국어 번역 파일
│   ├── ja/            # 일본어
│   ├── ko/            # 한국어
│   └── en/            # 영어
├── pages/              # 페이지 컴포넌트 (MainPage)
├── services/           # API 및 비즈니스 로직
│   ├── api/           # API 관련 (chat, user)
│   ├── auth/          # 인증 관련
│   └── config/        # 환경설정
├── styles/             # 글로벌 스타일
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
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

5. **린트 검사**
   ```bash
   npm run lint
   ```

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
`.env` 파일에 API 엔드포인트를 설정하세요:

```env
VITE_API_URL=https://api.example.com
VITE_CHAT_API_URL=https://chat-api.example.com
```

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

## 🎨 컴포넌트 사용 예시

### 채팅 메시지
```typescript
import ChatMessage from './components/ui/ChatMessage';

<ChatMessage 
  message={{
    id: '1',
    type: 'bot',
    content: '안녕하세요!',
    timestamp: new Date()
  }}
  isTyping={true}
  onTypingComplete={() => console.log('타이핑 완료')}
/>
```

### 빠른 답변 버튼
```typescript
import QuickReply from './components/ui/QuickReply';

<QuickReply 
  show={true}
  onReplyClick={(reply) => console.log(reply)}
/>
```

### 채팅 훅 사용
```typescript
import { useChat } from './hooks/useChat';

function ChatComponent() {
  const {
    messages,
    newMessage,
    setNewMessage,
    isTyping,
    handleSendMessage,
    completeTyping
  } = useChat({
    userId: 'guest-123',
    onError: (error) => console.error(error)
  });

  return (
    // 채팅 UI 렌더링
  );
}
```

## 🔒 보안

- 쿠키는 `secure`와 `sameSite: 'strict'` 옵션으로 보안 설정
- API 토큰은 안전하게 쿠키에 저장
- XSS 방지를 위한 적절한 sanitization
- 게스트 사용자를 위한 임시 ID 생성

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