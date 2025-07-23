# AI 코더 테스트 작성 지침

## 개요
이 문서는 AI 코더가 효과적인 테스트를 작성하기 위한 가이드라인을 제공합니다.

## Jest 테스트 환경 문제 해결

### import.meta.env 에러 해결
Jest 환경에서 `import.meta.env`를 사용하는 모듈을 테스트할 때 발생하는 에러를 해결하는 방법입니다.

#### 문제 상황
```bash
Cannot use 'import.meta.env' outside a module
```

#### 해결 방법

##### 1. 환경변수를 사용하는 모듈 직접 Mock
```typescript
// Bad: import.meta.env를 직접 mock하려고 시도
jest.mock('import.meta', () => ({
  env: {
    VITE_SHOW_GRADE_SELECTION: 'true'
  }
}));

// Good: 환경변수를 사용하는 설정 모듈을 mock
jest.mock('../shared/config/app.config', () => ({
  getAccentColor: () => 'orange',
  getShowNavigationHeader: () => true,
  getShowGradeSelection: () => true
}));
```

##### 2. 자주 사용되는 Mock 패턴
```typescript
// FAQ Categories config mock
jest.mock('../shared/config/faqCategories.config', () => ({
  getEnabledFAQCategories: () => [
    { id: 'category1', textKey: 'faq.category1' },
    { id: 'category2', textKey: 'faq.category2' }
  ]
}));

// Icon config mock
jest.mock('../shared/config/iconConfig', () => ({
  getIconConfig: () => ({ type: 'lucide', value: 'HelpCircle' })
}));

// Theme config mock
jest.mock('../shared/config/theme.config', () => ({
  getColorClasses: () => ({
    backgroundHover: 'hover:bg-orange-500',
    textBlack: 'text-black',
    text: 'text-orange-500'
  })
}));
```

##### 3. Locale JSON 파일 Mock
```typescript
// 각 언어별 번역 파일 mock
jest.mock('../locales/ko/common.json', () => ({
  default: { 
    test: '테스트',
    chat: {
      schoolName: '테스트 학교',
      greeting: '{school_name}에 오신 것을 환영합니다!'
    },
    onboarding: {
      gradeSelectionMessage: '학년을 선택해주세요'
    }
  }
}));

jest.mock('../locales/ja/common.json', () => ({
  default: { 
    test: 'テスト',
    chat: {
      schoolName: 'テスト学校', 
      greeting: '{school_name}へようこそ！'
    },
    onboarding: {
      gradeSelectionMessage: '学年を選択してください'
    }
  }
}));
```

## React Context 테스트 문제 해결

### LocaleContext Mock
React Context를 사용하는 컴포넌트 테스트 시 안정적인 mock 방법:

```typescript
// Mock LocaleContext directly for stable testing
const mockLocaleContext = {
  locale: 'ja' as const,
  setLocale: jest.fn(),
  t: jest.fn((key: string, params?: Record<string, any>) => {
    const translations: Record<string, string> = {
      'chat.greeting': 'テスト学校へようこそ！',
      'onboarding.gradeSelectionMessage': '学年を選択してください',
      'common.home': 'ホーム'
    };
    let result = translations[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        result = result.replace(`{${paramKey}}`, String(value));
      });
    }
    return result;
  }),
  isLoading: false
};

jest.mock('../contexts/LocaleContext', () => ({
  LocaleProvider: ({ children }: { children: React.ReactNode }) => children,
  useLocale: () => mockLocaleContext
}));
```

## 컴포넌트 Mock 패턴

### 1. 템플릿 컴포넌트 Mock
```typescript
jest.mock('../components/templates/ChatLayout', () => ({
  ChatLayout: ({ children, input, header, showNavigationHeader }: any) => (
    <div data-testid="chat-layout">
      {showNavigationHeader && header}
      {children}
      <div data-testid="chat-input-container">
        {input}
      </div>
    </div>
  )
}));
```

### 2. 복잡한 컴포넌트 Mock
```typescript
jest.mock('../components/organisms/ChatInput', () => ({
  ChatInput: (props: any) => (
    <div 
      data-testid="chat-input" 
      data-disabled={props.disabled}
      data-value={props.value}
      data-placeholder={props.placeholder}
    >
      <input 
        type="text" 
        disabled={props.disabled} 
        placeholder={props.placeholder}
        data-testid="chat-input-field"
      />
      ChatInput - disabled: {props.disabled ? 'true' : 'false'}
      {props.placeholder && ` - placeholder: ${props.placeholder}`}
    </div>
  )
}));
```

### 3. 훅 Mock
```typescript
jest.mock('../hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    newMessage: '',
    setNewMessage: jest.fn(),
    isTyping: false,
    currentlyTyping: null,
    messagesEndRef: { current: null },
    chatContainerRef: { current: null },
    handleSendMessage: jest.fn(),
    completeTyping: jest.fn(),
    addWelcomeMessage: jest.fn(),
    addTypingBotMessage: jest.fn(),
    addUserMessage: jest.fn()
  })
}));
```

## 테스트 작성 시 주의사항

### 1. Mock 순서
- import.meta.env를 사용하는 모듈들은 테스트 파일 상단에서 가장 먼저 mock
- Context나 훅 등은 그 다음에 mock
- 컴포넌트들은 마지막에 mock

### 2. 데이터 테스트 속성 활용
테스트 가능한 컴포넌트를 위해 `data-testid`, `data-*` 속성을 적극 활용:

```typescript
// Good: 테스트하기 쉬운 속성들
data-testid="chat-input"
data-disabled={props.disabled}
data-placeholder={props.placeholder}
data-value={props.value}
```

### 3. act() 래핑
React 상태 업데이트가 있는 테스트는 `act()`로 래핑:

```typescript
await act(async () => {
  render(
    <TestWrapper>
      <ComponentUnderTest />
    </TestWrapper>
  );
});
```

## TDD 테스트 작성 순서

### 1. RED 단계 - 실패하는 테스트 작성
```typescript
it('학년 미선택 시 ChatInput이 비활성화되어야 한다', async () => {
  // 아직 구현되지 않은 기능에 대한 테스트
  // 이 테스트는 실패해야 함 (RED)
  expect(chatInput).toHaveAttribute('data-disabled', 'true');
});
```

### 2. GREEN 단계 - 테스트 통과시키기
```typescript
// MainPage.tsx에서 실제 구현
disabled={isTyping || (showGradeSelection && !selectedGrade)}
```

### 3. BLUE 단계 - 리팩토링
- 코드 품질 개선
- 중복 제거
- 성능 최적화

## 자주 발생하는 에러와 해결책

### 1. "Cannot read properties of null (reading 'useContext')"
- **원인**: Context가 제대로 mock되지 않음
- **해결**: Context를 직접 mock하고 TestWrapper 대신 간단한 div 사용

### 2. "Invalid hook call"
- **원인**: jest.doMock과 dynamic import 사용 시 React hook 규칙 위반
- **해결**: require().hookName = mockFunction 패턴 사용

### 3. "Module not found"
- **원인**: 상대 경로 문제
- **해결**: 정확한 상대 경로 확인 및 파일 존재 여부 검증

## 테스트 파일 구조 템플릿

```typescript
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 1. 환경변수 사용 모듈들 mock (가장 먼저)
jest.mock('../shared/config/app.config', () => ({
  // config mocks
}));

// 2. Context mock
jest.mock('../contexts/LocaleContext', () => ({
  // context mocks
}));

// 3. 훅 mock
jest.mock('../hooks/useChat', () => ({
  // hook mocks  
}));

// 4. 컴포넌트 mock
jest.mock('../components/templates/ChatLayout', () => ({
  // component mocks
}));

// 5. 테스트 대상 컴포넌트 import (마지막)
import ComponentUnderTest from './ComponentUnderTest';

// 6. TestWrapper 정의
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="test-wrapper">
    {children}
  </div>
);

// 7. 테스트 케이스들
describe('ComponentUnderTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 테스트 케이스들...
});
```

이 가이드라인을 따르면 import.meta.env 관련 에러를 피하고 안정적인 테스트를 작성할 수 있습니다.