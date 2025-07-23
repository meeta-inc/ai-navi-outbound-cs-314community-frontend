# AI 코더 코딩 표준 지침

## 개요
이 문서는 AI 코더가 일관성 있고 품질 높은 코드를 작성하기 위한 코딩 표준을 정의합니다.

## 파일 및 폴더 구조

### 컴포넌트 파일 구조
```
src/components/
├── atoms/          # 기본 UI 요소
├── molecules/      # atoms 조합
├── organisms/      # molecules + atoms 조합
└── templates/      # 페이지 레이아웃
```

### 파일 명명 규칙
- **컴포넌트**: PascalCase (예: `ChatInput.tsx`)
- **훅**: camelCase with use prefix (예: `useChat.ts`)
- **유틸리티**: camelCase (예: `formatDate.ts`)
- **상수**: CONSTANT_CASE (예: `API_ENDPOINTS.ts`)
- **타입**: PascalCase with Type suffix (예: `UserType.ts`)

### 필수 파일 세트
각 컴포넌트는 다음 파일들을 반드시 포함:
```
ChatInput/
├── ChatInput.tsx       # 컴포넌트 구현
├── ChatInput.test.tsx  # 테스트 케이스
├── ChatInput.stories.tsx # 스토리북
└── index.ts           # export 파일
```

## TypeScript 코딩 규칙

### 인터페이스 정의
```typescript
// Good: 명확한 인터페이스 정의
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  clientId?: string;
  onMenuItemClick?: (item: MenuItem) => void;
}

// Bad: any 타입 사용
interface ChatInputProps {
  value: any;
  onChange: any;
  onSend: any;
}
```

### 타입 가드 사용
```typescript
// Good: 타입 가드 활용
const isValidGrade = (grade: unknown): grade is GradeType => {
  return typeof grade === 'string' && ['elementary', 'middle', 'high'].includes(grade);
};

// Bad: 타입 단언 남용
const grade = selectedValue as GradeType;
```

### 제네릭 활용
```typescript
// Good: 재사용 가능한 제네릭 컴포넌트
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
}
```

## React 컴포넌트 작성 규칙

### 컴포넌트 구조
```typescript
// Good: 일관된 컴포넌트 구조
export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder,
  clientId = 'default',
  onMenuItemClick
}: ChatInputProps) {
  // 1. 훅 호출
  const { t } = useLocale();
  const accentColor = getAccentColor();
  
  // 2. 상태 정의
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  
  // 3. 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 핸들러 로직
  };
  
  // 4. JSX 반환
  return (
    <div>
      {/* 컴포넌트 내용 */}
    </div>
  );
}
```

### Props 검증
```typescript
// Good: 기본값과 선택적 props 명시
interface Props {
  required: string;
  optional?: string;
  withDefault?: boolean;
}

function Component({ 
  required, 
  optional, 
  withDefault = false 
}: Props) {
  // 구현
}
```

### 조건부 렌더링
```typescript
// Good: 명확한 조건부 렌더링
{showGradeSelection && selectedGrade && (
  <GradeQuickReply
    grade={selectedGrade}
    onReplyClick={handleQuickReplyClick}
  />
)}

// Bad: 중첩된 삼항 연산자
{showGradeSelection ? 
  selectedGrade ? 
    <GradeQuickReply /> : 
    <GradeSelection /> : 
  null
}
```

## 테스트 작성 규칙

### 테스트 구조
```typescript
describe('컴포넌트명 컴포넌트', () => {
  // 공통 설정
  const defaultProps = {
    // 기본 props
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('기능별 그룹', () => {
    it('구체적인 동작을 설명하는 테스트명', () => {
      // Given: 테스트 설정
      // When: 테스트 실행
      // Then: 결과 검증
    });
  });
});
```

### Mock 작성 규칙
```typescript
// Good: 명시적인 Mock 설정
jest.mock('../../../hooks/useKeyboardState', () => ({
  useKeyboardState: () => false,
}));

jest.mock('../../../shared/config/app.config', () => ({
  getAccentColor: () => 'orange',
}));

// Bad: 전역 Mock 남용
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
```

### 테스트 케이스 명명
```typescript
// Good: 행동 중심의 테스트명
it('disabled가 true일 때 입력창이 비활성화되어야 한다', () => {});
it('학년 미선택 시 적절한 플레이스홀더가 표시되어야 한다', () => {});

// Bad: 구현 중심의 테스트명  
it('props.disabled 체크', () => {});
it('placeholder 렌더링', () => {});
```

## 스타일링 규칙

### Tailwind CSS 사용
```typescript
// Good: 의미있는 클래스 조합
<Button
  className={`w-8 h-8 flex justify-center items-center transition-colors ${
    disabled 
      ? 'cursor-not-allowed' 
      : `${colors.backgroundHover} hover:text-white group`
  }`}
>

// Bad: 인라인 스타일 남용
<Button style={{ width: '32px', height: '32px', display: 'flex' }}>
```

### 반응형 디자인
```typescript
// Good: 모바일 퍼스트 접근
<div className="px-2 sm:px-4 py-4 gap-2 sm:gap-3">
  <Button className="w-8 h-8 sm:w-[35px] sm:h-[35px]">
```

## 상태 관리 규칙

### 로컬 상태 vs 글로벌 상태
```typescript
// Good: 컴포넌트 로컬 상태
const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

// Good: 커스텀 훅 활용
const {
  messages,
  isTyping,
  handleSendMessage
} = useChat({ userId, gradeId });
```

### 상태 업데이트
```typescript
// Good: 함수형 업데이트
setMessages(prev => [...prev, newMessage]);

// Good: 불변성 유지
const updatedUser = {
  ...user,
  profile: {
    ...user.profile,
    name: newName
  }
};
```

## 에러 처리

### 에러 바운더리
```typescript
// Good: 컴포넌트별 에러 처리
try {
  const response = await sendMessage(content);
  setCurrentlyTyping(response);
} catch (error) {
  console.error('Error sending message:', error);
  if (onError) {
    onError(error as Error);
  }
  // 사용자에게 친화적인 에러 메시지 표시
}
```

### 타입 안전한 에러 처리
```typescript
// Good: 타입 가드로 에러 처리
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Known error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
};
```

## 접근성 (a11y) 규칙

### ARIA 레이블
```typescript
// Good: 적절한 ARIA 레이블
<Button
  onClick={handleMenuClick}
  disabled={disabled}
  aria-label="메뉴"
>
  <CategoryIcon />
</Button>

<input
  role="textbox"
  aria-describedby="input-help"
  placeholder={placeholder}
/>
```

### 키보드 네비게이션
```typescript
// Good: 키보드 이벤트 처리
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    if (e.nativeEvent.isComposing) {
      return; // IME 입력 중 처리 방지
    }
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend();
    }
  }
};
```

## 성능 최적화

### 메모이제이션
```typescript
// Good: 적절한 메모이제이션
const memoizedValue = useMemo(() => 
  expensiveCalculation(data), [data]
);

const memoizedCallback = useCallback(() => {
  handleExpensiveOperation();
}, [dependency]);
```

### 컴포넌트 분할
```typescript
// Good: 적절한 컴포넌트 분할
const ChatInputContainer = () => {
  return (
    <div>
      <MenuButton />
      <InputField />
      <SendButton />
    </div>
  );
};
```

## 코드 리뷰 체크리스트

### 필수 확인 사항
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 테스트 커버리지 80% 이상
- [ ] 스토리북 스토리 작성 완료
- [ ] ARIA 레이블 적용
- [ ] 반응형 디자인 고려
- [ ] 에러 처리 구현
- [ ] 성능 최적화 적용

### 코드 품질 기준
- 함수는 20줄 이하로 작성
- 컴포넌트는 200줄 이하로 작성  
- 중복 코드 제거
- 명확한 변수명 사용
- 주석은 필요한 경우에만 작성

이 지침을 준수하여 일관성 있고 품질 높은 코드를 작성하시기 바랍니다.