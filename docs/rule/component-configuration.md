# AI 코더 컴포넌트 설정 및 사용 지침

## 개요
이 문서는 프로젝트의 주요 컴포넌트 사용법과 설정 방법을 AI 코더가 숙지할 수 있도록 정리한 가이드라인입니다.

## FAQ 카테고리 아이콘 설정

### 지원하는 아이콘 타입

시스템에서 지원하는 4가지 아이콘 타입:

1. **lucide**: Lucide React 아이콘 라이브러리
2. **url**: 외부 SVG/이미지 URL
3. **svg**: 인라인 SVG 문자열
4. **component**: React 컴포넌트

### 환경변수 설정 방법

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

아이콘 로딩에 실패했을 때 사용할 폴백 아이콘을 설정:

```env
VITE_FAQ_ICONS={"category1":{"type":"url","value":"https://example.com/icon.svg","fallback":"BookOpen"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

### 자주 사용되는 Lucide 아이콘

교육 관련 아이콘 예시:

```typescript
// 교육 관련 아이콘
const educationIcons = {
  BookOpen: '책',
  GraduationCap: '졸업모',
  School: '학교',
  Users: '사용자들',
  User: '사용자',
  Lightbulb: '전구'
};

// 성과 관련 아이콘
const achievementIcons = {
  Trophy: '트로피',
  Award: '상장',
  Star: '별',
  TrendingUp: '상승 트렌드',
  BarChart: '차트',
  Target: '타겟'
};

// 업무 관련 아이콘
const workIcons = {
  FileText: '문서',
  Clipboard: '클립보드',
  Calendar: '달력',
  Clock: '시계',
  CheckCircle: '체크'
};

// 기타 아이콘
const utilityIcons = {
  MessageCircle: '메시지',
  HelpCircle: '도움말',
  Info: '정보',
  Settings: '설정',
  MoreHorizontal: '더보기'
};
```

### 커스텀 React 컴포넌트 아이콘 추가

#### 1. 컴포넌트 생성
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

#### 2. DynamicIcon 컴포넌트에 등록
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

#### 3. 환경변수에 설정
```env
VITE_FAQ_ICONS={"category1":{"type":"component","value":"SchoolIcon"},"category2":{"type":"component","value":"TeacherIcon"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

### 사용 가능한 내장 커스텀 아이콘

프로젝트에 이미 포함된 커스텀 아이콘들:
- `CustomIcon`: 기본 홈 아이콘
- `SchoolIcon`: 학교 건물 아이콘
- `TeacherIcon`: 선생님 아이콘
- `ImageIcon`: 이미지 아이콘 (Image.svg)

### 카테고리별 기본 매핑

카테고리의 내용은 클라이언트가 설정하기 때문에 API를 통해 호출한다.

현재 카테고리 구조: (카테고리의 갯수도 클라이언트가 지정)
- `category1`: 첫 번째 카테고리 
- `category2`: 두 번째 카테고리 
- `category3`: 세 번째 카테고리 
- `category4`: 네 번째 카테고리 
- `other`: 기타 카테고리

### 주의사항

1. **JSON 형식**: 환경변수는 유효한 JSON 형식이어야 합니다
2. **따옴표**: 모든 키와 값은 따옴표로 감싸야 합니다
3. **한 줄 작성**: 환경변수는 한 줄로 작성해야 합니다
4. **재시작 필요**: 환경변수 변경 후 개발 서버를 재시작해야 합니다
5. **URL 이미지**: CORS 정책을 준수하는 URL을 사용해야 합니다

## 컴포넌트 사용 예시

### 채팅 메시지 컴포넌트
```typescript
import { ChatMessage } from './components/organisms/ChatMessage';

// 기본 사용법
<ChatMessage 
  message={{
    id: '1',
    type: 'bot',
    content: '안녕하세요!',
    timestamp: new Date()
  }}
  isTyping={false}
  hideAvatar={false}
/>

// 타이핑 애니메이션과 함께 사용
<ChatMessage 
  message={{
    id: '2',
    type: 'bot',
    content: '답변을 생각하고 있습니다...',
    timestamp: new Date()
  }}
  isTyping={true}
  onTypingComplete={() => console.log('타이핑 완료')}
  hideAvatar={true}
  enableLLMTyping={true}
/>

// LLM 응답과 함께 사용
<ChatMessage 
  message={{
    id: '3',
    type: 'bot',
    content: '', // LLM 응답 시 content는 비워둠
    timestamp: new Date(),
    llmResponse: {
      type: 'text',
      text: 'LLM에서 생성된 응답입니다.'
    }
  }}
  llmResponse={{
    type: 'text',
    text: 'LLM에서 생성된 응답입니다.'
  }}
/>
```

### 채팅 입력 컴포넌트
```typescript
import { ChatInput } from './components/organisms/ChatInput';

// 기본 사용법
<ChatInput 
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  disabled={false}
  placeholder="메시지를 입력하세요"
/>

// 학년 미선택 시 비활성화 상태
<ChatInput 
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  disabled={!selectedGrade || isTyping}
  placeholder={selectedGrade ? "메시지를 입력하세요" : "まずは学年を選択してください"}
  onMenuItemClick={handleMenuClick}
/>

// 메뉴 기능과 함께 사용
<ChatInput 
  value={message}
  onChange={setMessage}
  onSend={handleSend}
  disabled={isTyping}
  clientId="custom-client"
  onMenuItemClick={(item) => {
    console.log('Menu item clicked:', item);
    if (item.id === 'ai-faq') {
      // FAQ 처리 로직
    }
  }}
/>
```

### 빠른 답변 컴포넌트
```typescript
import { QuickReply } from './components/organisms/QuickReply';

// 기본 사용법
<QuickReply 
  show={true}
  onReplyClick={(reply) => {
    console.log('Selected reply:', reply);
    handleSendMessage(reply);
  }}
  onShowFAQCategories={() => {
    setShowFAQCategories(true);
  }}
  userId="guest-123"
/>

// 학년별 퀵 리플라이
import { GradeQuickReply } from './components/organisms/GradeQuickReply';

<GradeQuickReply
  grade="high"
  onReplyClick={handleReplyClick}
  onShowFAQCategories={handleShowFAQ}
  onBackClick={handleBackToGradeSelection}
/>
```

### 학년 선택 컴포넌트
```typescript
import { GradeSelection } from './components/organisms/GradeSelection';
import { GradeType } from '../shared/constants/grade.constants';

<GradeSelection 
  onGradeSelect={(grade: GradeType) => {
    console.log('Selected grade:', grade);
    setSelectedGrade(grade);
    // 학년 선택 후 처리 로직
  }}
/>
```

### FAQ 카테고리 컴포넌트
```typescript
import { FAQCategory } from './components/organisms/FAQCategory';

<FAQCategory 
  onCategorySelect={(category) => {
    console.log('Selected category:', category);
    // 선택된 카테고리 처리 로직
  }}
/>
```

### 상위 질문 컴포넌트
```typescript
import { TopQuestions } from './components/organisms/TopQuestions';

<TopQuestions
  categoryId="category1"
  categoryTitle="수업에 관해서"
  grade="high"
  userId="guest-123"
  onQuestionSelect={(question) => {
    console.log('Selected question:', question);
    handleSendMessage(question);
  }}
  onBackToCategories={() => {
    setShowCategories(true);
    setShowTopQuestions(false);
  }}
  onDataLoaded={() => {
    // 데이터 로딩 완료 시 스크롤 등 추가 처리
    scrollToBottom();
  }}
/>
```

### 네비게이션 헤더 컴포넌트
```typescript
import { NavigationHeader } from './components/organisms/NavigationHeader';

<NavigationHeader 
  title="홈"
  accentColor="orange"
  showDynamicHeader={true}
  clientId="default"
  onHeaderAction={(action) => {
    if (action.type === 'close') {
      console.log('Header close action triggered');
    }
  }}
/>
```

### 채팅 레이아웃 템플릿
```typescript
import { ChatLayout } from './components/templates/ChatLayout';

<ChatLayout
  showNavigationHeader={true}
  header={<NavigationHeader title="채팅" />}
  input={
    <ChatInput
      value={message}
      onChange={setMessage}
      onSend={handleSend}
      disabled={isTyping}
    />
  }
>
  {/* 채팅 메시지들 */}
  <div className="chat-messages">
    {messages.map(message => (
      <ChatMessage key={message.id} message={message} />
    ))}
  </div>
</ChatLayout>
```

## 커스텀 훅 사용법

### useChat 훅
```typescript
import { useChat } from './hooks/useChat';

function ChatComponent() {
  const {
    messages,              // 채팅 메시지 배열
    newMessage,           // 현재 입력 중인 메시지
    setNewMessage,        // 입력 메시지 설정 함수
    isTyping,             // 타이핑 중 상태
    currentlyTyping,      // 현재 타이핑 중인 메시지 정보
    messagesEndRef,       // 스크롤 참조용 ref
    chatContainerRef,     // 채팅 컨테이너 ref
    handleSendMessage,    // 메시지 전송 함수
    completeTyping,       // 타이핑 완료 처리 함수
    addWelcomeMessage,    // 환영 메시지 추가 함수
    addTypingBotMessage,  // 타이핑 봇 메시지 추가 함수
    addUserMessage,       // 사용자 메시지 추가 함수
    scrollToBottom        // 스크롤 하단 이동 함수
  } = useChat({
    userId: 'guest-123',
    gradeId: selectedGrade || 'high',
    onError: (error) => {
      console.error('Chat error:', error);
      // 에러 처리 로직
    },
    onTypingComplete: () => {
      // 타이핑 완료 시 추가 처리
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  });

  return (
    <div>
      {/* 채팅 UI 구현 */}
    </div>
  );
}
```

### useLocale 훅
```typescript
import { useLocale } from './contexts/LocaleContext';

function Component() {
  const { 
    locale,      // 현재 언어 ('ko' | 'ja' | 'en')
    setLocale,   // 언어 변경 함수
    t,           // 번역 함수
    isLoading    // 번역 데이터 로딩 상태
  } = useLocale();
  
  // 언어 변경
  const handleLanguageChange = (newLocale: 'ko' | 'ja' | 'en') => {
    setLocale(newLocale);
  };
  
  // 번역 사용
  const greeting = t('chat.greeting');
  const parameterizedText = t('chat.greeting', { name: '사용자' });
  
  return (
    <div>
      {!isLoading && (
        <div>
          <h1>{greeting}</h1>
          <p>{parameterizedText}</p>
        </div>
      )}
    </div>
  );
}
```

## 환경변수 설정

### UI 관련 환경변수
```env
# 테마 색상 설정
VITE_ACCENT_COLOR=orange

# UI 컴포넌트 표시 여부
VITE_SHOW_NAVIGATION_HEADER=true
VITE_SHOW_TIMESTAMP=true
VITE_SHOW_GRADE_SELECTION=true

# FAQ 아이콘 설정
VITE_FAQ_ICONS={"category1":{"type":"lucide","value":"BookOpen"},"category2":{"type":"lucide","value":"Users"},"category3":{"type":"lucide","value":"Trophy"},"category4":{"type":"lucide","value":"FileText"},"other":{"type":"lucide","value":"MoreHorizontal"}}
```

### API 관련 환경변수
```env
# API 엔드포인트
VITE_API_BASE_URL=https://your-api-gateway-url
VITE_CHAT_API_URL=https://your-chat-api-url

# 클라이언트 식별
VITE_CLIENT_ID=your-client-id
VITE_APP_ID=your-app-id
```

이 지침을 참고하여 컴포넌트를 올바르게 설정하고 사용하시기 바랍니다.