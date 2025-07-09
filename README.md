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

## 🎨 FAQ 카테고리 아이콘 설정

FAQ 카테고리의 아이콘을 클라이언트별로 커스터마이징할 수 있습니다.

### 기본 아이콘 타입

시스템에서 지원하는 4가지 아이콘 타입:

1. **lucide**: Lucide React 아이콘 라이브러리
2. **url**: 외부 SVG/이미지 URL
3. **svg**: 인라인 SVG 문자열
4. **component**: React 컴포넌트

### 환경변수 설정

`.env` 파일에 `VITE_FAQ_ICONS` 변수를 설정하세요:

#### 1. Lucide 아이콘 사용 (기본)
```env
VITE_FAQ_ICONS={"category1":{"type":"lucide","value":"BookOpen"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

#### 2. 외부 이미지 URL 사용
```env
VITE_FAQ_ICONS={"category1":{"type":"url","value":"https://cdn.example.com/icons/classes.svg"},"category2":{"type":"url","value":"https://cdn.example.com/icons/teachers.svg"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

#### 3. 인라인 SVG 사용
```env
VITE_FAQ_ICONS={"category1":{"type":"svg","value":"<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7L12 2z\"/></svg>"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

#### 4. 커스텀 React 컴포넌트 사용
```env
VITE_FAQ_ICONS={"category1":{"type":"component","value":"CustomIcon"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

### 폴백 아이콘 설정

아이콘 로딩에 실패했을 때 사용할 폴백 아이콘을 설정할 수 있습니다:

```env
VITE_FAQ_ICONS={"category1":{"type":"url","value":"https://example.com/icon.svg","fallback":"BookOpen"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

### 자주 사용되는 Lucide 아이콘

교육 관련 아이콘 예시:

```
교육 관련:
- BookOpen (책)
- GraduationCap (졸업모)
- School (학교)
- Users (사용자들)
- User (사용자)
- Lightbulb (전구)

성과 관련:
- Trophy (트로피)
- Award (상장)
- Star (별)
- TrendingUp (상승 트렌드)
- BarChart (차트)
- Target (타겟)

업무 관련:
- FileText (문서)
- Clipboard (클립보드)
- Calendar (달력)
- Clock (시계)
- CheckCircle (체크)

기타:
- MessageCircle (메시지)
- HelpCircle (도움말)
- Info (정보)
- Settings (설정)
- MoreHorizontal (더보기)
```

### 커스텀 React 컴포넌트 아이콘 추가

1. **컴포넌트 생성**
```typescript
// src/components/icons/CustomIcon.tsx
import React from 'react';

interface CustomIconProps {
  className?: string;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7L12 2z"/>
    </svg>
  );
};

export const SchoolIcon: React.FC<CustomIconProps> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
    </svg>
  );
};

export const TeacherIcon: React.FC<CustomIconProps> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      <path d="M12.5 13c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
    </svg>
  );
};
```

2. **DynamicIcon 컴포넌트에 등록**
```typescript
// src/components/ui/DynamicIcon.tsx
import { CustomIcon, SchoolIcon, TeacherIcon } from '../icons/CustomIcon';

const componentMap = {
  CustomIcon: CustomIcon,
  SchoolIcon: SchoolIcon,
  TeacherIcon: TeacherIcon,
  // 추가 컴포넌트들...
};

// component 타입 처리 부분에서 사용
case 'component':
  const Component = componentMap[config.value as keyof typeof componentMap];
  return Component ? <Component className={className} /> : null;
```

3. **환경변수에 설정**
```env
VITE_FAQ_ICONS={"category1":{"type":"component","value":"SchoolIcon"},"category2":{"type":"component","value":"TeacherIcon"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

#### 사용 가능한 내장 커스텀 아이콘

프로젝트에 이미 포함된 커스텀 아이콘들:
- `CustomIcon`: 기본 홈 아이콘
- `SchoolIcon`: 학교 건물 아이콘
- `TeacherIcon`: 선생님 아이콘
- `ImageIcon`: 이미지 아이콘 (Image.svg)

### 카테고리별 기본 매핑

현재 카테고리 구조:
- `category1`: 첫 번째 카테고리 (기본: 授業について - 수업 관련)
- `category2`: 두 번째 카테고리 (기본: 講師について - 강사 관련)
- `category3`: 세 번째 카테고리 (기본: 塾の実績について - 학원 실적)
- `category4`: 네 번째 카테고리 (기본: 宿題について - 숙제 관련)
- `other`: 기타 카테고리

### 주의사항

1. **JSON 형식**: 환경변수는 유효한 JSON 형식이어야 합니다
2. **따옴표**: 모든 키와 값은 따옴표로 감싸야 합니다
3. **한 줄 작성**: 환경변수는 한 줄로 작성해야 합니다
4. **재시작 필요**: 환경변수 변경 후 개발 서버를 재시작해야 합니다
5. **URL 이미지**: CORS 정책을 준수하는 URL을 사용해야 합니다

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