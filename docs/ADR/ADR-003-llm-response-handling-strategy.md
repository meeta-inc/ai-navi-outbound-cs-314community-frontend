# ADR-003: LLM 응답 처리 전략

## 상태
Accepted

## 맥락
AI Navi 프론트엔드에서 LLM(Large Language Model) 응답을 안정적이고 사용자 친화적으로 처리하기 위한 전략이 필요했습니다. GitHub 이슈 #41에서 LLM 에러 발생 시 빈 버블이 표시되는 문제가 발생하여 체계적인 응답 처리 방안을 수립해야 했습니다.

## 고려사항

### 현재 LLM 응답 구조
```typescript
interface LLMResponse {
  response: BubbleResponse[];  // 응답 내용 배열
  tool?: string | null;        // 사용된 도구 정보
  status?: number;             // HTTP 상태 코드
}

interface BubbleResponse {
  type: 'main' | 'sub' | 'cta'; // 응답 유형
  text: string;                 // 응답 텍스트
  attachment?: AttachmentData;  // 첨부 데이터
}
```

### 에러 시나리오 분석
1. **HTTP 에러**: `response.status !== 200`
2. **빈 응답**: `response.response.length === 0`
3. **네트워크 에러**: API 호출 실패
4. **타임아웃**: 응답 지연 (30초 초과)
5. **형식 오류**: 응답 데이터 구조 불일치

### 처리 방식 검토

#### 옵션 A: useChat 훅에서 처리
**장점:**
- 중앙화된 에러 처리
- 비즈니스 로직과 UI 분리

**단점:**
- 컴포넌트별 에러 표시 방식 제한
- 복잡한 props 전달 필요

#### 옵션 B: LLMResponseGroup에서 처리 (선택됨)
**장점:**
- 단일 책임 원칙 준수
- 에러 경계 명확화
- 재사용성 높음
- 확장성 우수

**단점:**
- 컴포넌트 레벨 에러 처리

#### 옵션 C: Error Boundary 활용
**장점:**
- React 표준 패턴
- 예상치 못한 에러도 처리

**단점:**
- 비즈니스 로직 에러에는 부적합
- 복잡한 구현

## 결정
**LLMResponseGroup 컴포넌트에서 에러 처리를 수행**하는 방식을 채택합니다.

### 주요 이유
1. **단일 책임 원칙**: LLM 응답 처리는 LLMResponseGroup이 담당
2. **에러 경계 명확화**: LLM 관련 에러는 LLM 컴포넌트에서 처리
3. **재사용성**: 에러 처리 로직이 한 곳에 집중
4. **확장성**: 향후 다른 LLM 에러 타입 추가 시 용이

### 구현 방식

#### 1. 에러 메시지 상수 정의
```typescript
// src/shared/constants/errorMessages.ts
export const ERROR_MESSAGES = {
  LLM_TEMPORARY_ERROR: '申し訳ありません😭一時的なエラーが発生しています。一度チャットを閉じてから再度お試しください。',
  LLM_NETWORK_ERROR: 'インターネット接続を確認してください 🌐',
  LLM_TIMEOUT_ERROR: '応答時間が超過しました。もう一度お試しください ⏰'
} as const;

export const ErrorMessageUtils = {
  getLLMErrorMessage: (errorType?: string): string => {
    switch (errorType) {
      case 'network':
        return ERROR_MESSAGES.LLM_NETWORK_ERROR;
      case 'timeout':
        return ERROR_MESSAGES.LLM_TIMEOUT_ERROR;
      default:
        return ERROR_MESSAGES.LLM_TEMPORARY_ERROR;
    }
  }
} as const;
```

#### 2. LLMResponseGroup 에러 처리 구현
```typescript
// src/components/organisms/LLMResponseGroup/LLMResponseGroup.tsx
interface LLMResponseGroupProps {
  response: LLMResponse | null;
  accentColor?: AccentColor;
  onRetry?: () => void;
}

export const LLMResponseGroup: React.FC<LLMResponseGroupProps> = ({ 
  response, accentColor = 'orange', onRetry 
}) => {
  // 에러 조건 체크
  if (!response || !response.response || response.response.length === 0) {
    return (
      <ErrorBubble 
        message={ERROR_MESSAGES.LLM_TEMPORARY_ERROR}
        onRetry={onRetry}
        accentColor="red"
      />
    );
  }

  // HTTP 에러 체크
  if (response.status && response.status !== 200) {
    const errorType = response.status >= 500 ? 'server' : 'client';
    return (
      <ErrorBubble 
        message={ErrorMessageUtils.getLLMErrorMessage(errorType)}
        onRetry={onRetry}
        accentColor="red"
      />
    );
  }

  // 정상 응답 렌더링
  return (
    <div className="flex flex-col gap-2">
      {response.response.map((bubble, index) => (
        <ChatBubble 
          key={index}
          type={bubble.type}
          text={bubble.text}
          attachment={bubble.attachment}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
};
```

#### 3. ErrorBubble 컴포넌트
```typescript
// src/components/molecules/ErrorBubble/ErrorBubble.tsx
interface ErrorBubbleProps {
  message: string;
  onRetry?: () => void;
  accentColor?: AccentColor;
}

export const ErrorBubble: React.FC<ErrorBubbleProps> = ({ 
  message, onRetry, accentColor = 'red' 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="text-red-500 flex-shrink-0">
          <Icon name="alert-circle" size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <Typography variant="body" color="red-800">
            {message}
          </Typography>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
              onClick={onRetry}
            >
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### 4. API 레벨 에러 처리
```typescript
// src/services/api/chat.ts
export const sendChatMessage = async (message: string): Promise<LLMResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    
    return {
      ...data,
      status: response.status
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('timeout');
    }
    if (!navigator.onLine) {
      throw new Error('network');
    }
    throw error;
  }
};
```

#### 5. 훅에서의 에러 처리
```typescript
// src/hooks/useChat.ts
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(content);
      
      const newMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        llmResponse: response
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      // 에러는 LLMResponseGroup에서 처리하도록 null 응답 전달
      const errorMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: null,
        timestamp: new Date(),
        error: true,
        llmResponse: {
          response: [],
          status: error.message === 'network' ? 0 : 500
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
};
```

### 테스트 전략

#### 1. 단위 테스트
```typescript
// src/components/organisms/LLMResponseGroup/LLMResponseGroup.test.tsx
describe('LLMResponseGroup 에러 처리', () => {
  test('응답이 null이면 에러 메시지를 표시해야 함', () => {
    render(<LLMResponseGroup response={null} />);
    
    expect(screen.getByText(/一時的なエラーが発生しています/)).toBeInTheDocument();
  });

  test('빈 응답 배열이면 에러 메시지를 표시해야 함', () => {
    const emptyResponse = { response: [], status: 200 };
    
    render(<LLMResponseGroup response={emptyResponse} />);
    
    expect(screen.getByText(/一時的なエラーが発生しています/)).toBeInTheDocument();
  });

  test('HTTP 에러 상태면 에러 메시지를 표시해야 함', () => {
    const errorResponse = { response: [], status: 500 };
    
    render(<LLMResponseGroup response={errorResponse} />);
    
    expect(screen.getByText(/一時的なエラーが発生しています/)).toBeInTheDocument();
  });

  test('정상 응답이면 버블을 렌더링해야 함', () => {
    const normalResponse = {
      response: [
        { type: 'main', text: '테스트 응답' }
      ],
      status: 200
    };
    
    render(<LLMResponseGroup response={normalResponse} />);
    
    expect(screen.getByText('테스트 응답')).toBeInTheDocument();
  });
});
```

#### 2. 통합 테스트
```typescript
// src/components/organisms/LLMResponseGroup/LLMResponseGroup.integration.test.tsx
describe('LLMResponseGroup 통합 테스트', () => {
  test('재시도 버튼 클릭시 onRetry가 호출되어야 함', async () => {
    const mockRetry = jest.fn();
    
    render(<LLMResponseGroup response={null} onRetry={mockRetry} />);
    
    const retryButton = screen.getByText('다시 시도');
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
```

## 결과

### 긍정적 결과
1. **사용자 경험 개선**: 빈 버블 대신 친화적인 에러 메시지 표시
2. **에러 추적 가능**: 다양한 에러 타입별 처리 및 로깅
3. **재시도 기능**: 사용자가 쉽게 문제 해결 시도 가능
4. **코드 품질 향상**: 단일 책임 원칙 준수로 유지보수성 개선
5. **테스트 용이성**: 명확한 에러 조건으로 테스트 작성 용이

### 주의사항
1. **성능 모니터링**: 에러 발생률 지속 모니터링 필요
2. **에러 로깅**: 프로덕션에서 에러 패턴 분석을 위한 로깅 시스템 구축
3. **사용자 피드백**: 에러 메시지의 이해도 및 만족도 측정
4. **다국어 지원**: 에러 메시지의 언어별 맞춤화 고려

### 향후 확장 계획
1. **에러 타입 세분화**: 더 구체적인 에러 메시지 제공
2. **자동 재시도**: 네트워크 에러시 자동 재시도 로직
3. **에러 분석 대시보드**: 에러 패턴 분석 및 개선점 도출
4. **사용자 맞춤형 에러 메시지**: 사용자 컨텍스트 기반 메시지 제공

## 관련 이슈
- GitHub 이슈 #41: LLM 에러 발생 시 오류 메시지를 보내도록 개선

## 참고 문서
- [프론트엔드 컴포넌트 패턴](../rule/frontend-component-patterns.md)
- [사용자 경험 가이드라인](../rule/user-experience-guidelines.md)
- [LLM 통합 배경 및 요구사항](../background_context/llm-integration-context.md)
- [AI Navi Chatbot 답변 생성 정책 (Notion)](https://www.notion.so/23445c9756f8806c944dd386622577c0)

## 날짜
2025-07-26

## 작성자
Frontend Development Team