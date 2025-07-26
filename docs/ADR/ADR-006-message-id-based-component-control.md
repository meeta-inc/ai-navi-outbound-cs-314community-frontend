# ADR-006: 메시지 ID 기반 컴포넌트 제어 로직

## 상태
Accepted

## 맥락
AI Navi 채팅 인터페이스에서 FAQ 카테고리와 CTA 버튼 등의 컴포넌트가 메시지 내용 기반으로 필터링되어 중복 표시되는 문제가 발생했습니다. Notion에서 정의된 "문제 원인 파악 및 수정안"에 따르면, 메시지 내용이 아닌 **메시지 ID를 기준으로 컴포넌트의 생명주기를 관리**해야 합니다.

### 기존 문제점
1. **중복 표시**: 동일한 메시지 내용으로 FAQ 카테고리가 여러 번 표시됨
2. **상태 관리 복잡성**: 메시지 내용 기반 조건문으로 인한 예측 불가능한 동작
3. **확장성 제한**: 새로운 컴포넌트 추가 시 복잡한 조건 로직 필요

### 현재 CTA 구현 분석
기존 CTA 버튼 구현에서 이미 메시지 ID 기반 제어를 부분적으로 사용하고 있습니다:

```typescript
// MainPage.tsx에서 CTA 메시지 ID 관리
const [latestCTAMessageId, setLatestCTAMessageId] = useState<string | null>(null);
const [hideAllCTA, setHideAllCTA] = useState(false);

// 최신 LLM 응답 메시지 ID 업데이트
useEffect(() => {
  const llmMessages = messages.filter(m => m.type === 'bot' && m.llmResponse);
  if (llmMessages.length > 0) {
    const latestLLMMessage = llmMessages[llmMessages.length - 1];
    if (latestLLMMessage.id !== latestCTAMessageId) {
      setLatestCTAMessageId(latestLLMMessage.id);
      setHideAllCTA(false);
    }
  }
}, [messages, latestCTAMessageId]);

// 특정 메시지에서만 CTA 표시
showCTAAfterComplete: message.id === latestCTAMessageId && !hideAllCTA
```

## 고려사항

### 컴포넌트 제어 방식 검토

#### 옵션 A: 메시지 내용 기반 제어 (현재 방식)
**장점:**
- 직관적인 구현
- 단순한 조건문

**단점:**
- 중복 표시 문제
- 메시지 내용 변경 시 취약
- 확장성 부족
- 다국어 지원 시 복잡성 증가

#### 옵션 B: 메시지 ID 기반 제어 (선택됨)
**장점:**
- 고유성 보장
- 예측 가능한 동작
- 확장성 우수
- 성능 최적화 가능
- CTA 구현과 일관성

**단점:**
- 초기 구현 복잡도 상승
- 상태 관리 로직 추가 필요

#### 옵션 C: 컴포넌트 타입별 전역 상태 관리
**장점:**
- 중앙화된 제어
- 일관된 동작

**단점:**
- 복잡한 전역 상태
- 컴포넌트 간 결합도 증가

## 결정
**메시지 ID 기반 컴포넌트 제어 로직**을 채택합니다.

### 주요 이유
1. **고유성 보장**: 메시지 ID는 각 메시지마다 고유하여 중복 표시 방지
2. **예측 가능성**: 메시지 내용과 무관하게 일관된 동작 보장
3. **확장성**: 새로운 컴포넌트 타입 추가 시 동일한 패턴 적용 가능
4. **기존 패턴 활용**: CTA 구현에서 이미 검증된 방식
5. **성능 최적화**: ID 기반 비교로 불필요한 재렌더링 방지

### 구현 방식

#### 1. 활성 컴포넌트 메시지 ID 상태 관리

```typescript
// src/pages/MainPage.tsx
interface ActiveComponentState {
  faqCategories: string | null;  // FAQ 카테고리를 표시할 메시지 ID
  topQuestions: string | null;   // Top 질문을 표시할 메시지 ID
  gradeSelection: string | null; // 학년 선택을 표시할 메시지 ID
  quickReply: string | null;     // 퀵 리플라이를 표시할 메시지 ID
}

const [activeComponentMessageId, setActiveComponentMessageId] = useState<ActiveComponentState>({
  faqCategories: null,
  topQuestions: null,
  gradeSelection: null,
  quickReply: null
});

// 컴포넌트 활성화 함수
const activateComponent = useCallback((
  componentType: keyof ActiveComponentState, 
  messageId: string
) => {
  setActiveComponentMessageId(prev => ({
    ...prev,
    [componentType]: messageId
  }));
}, []);

// 컴포넌트 비활성화 함수  
const deactivateComponent = useCallback((
  componentType: keyof ActiveComponentState
) => {
  setActiveComponentMessageId(prev => ({
    ...prev,
    [componentType]: null
  }));
}, []);
```

#### 2. 메시지 기반 컴포넌트 표시 로직

```typescript
// 기존 CTA 패턴을 확장한 컴포넌트 제어
{messages.map((message, index) => (
  <div key={message.id}>
    <ChatMessage message={message} />
    
    {/* FAQ 카테고리 - 특정 메시지 ID에서만 표시 */}
    {activeComponentMessageId.faqCategories === message.id && (
      <div className="mt-4">
        <FAQCategory 
          onCategorySelect={(category) => {
            handleFAQCategorySelect(category);
            // FAQ 카테고리 숨기고 해당 메시지에서 Top Questions 활성화
            deactivateComponent('faqCategories');
            activateComponent('topQuestions', message.id);
          }}
        />
      </div>
    )}
    
    {/* Top Questions - 특정 메시지 ID에서만 표시 */}
    {activeComponentMessageId.topQuestions === message.id && selectedCategory && (
      <div className="mt-4">
        <TopQuestions
          categoryId={selectedCategory.id}
          onQuestionSelect={(question) => {
            handleTopQuestionSelect(question);
            // Top Questions 숨기기
            deactivateComponent('topQuestions');
          }}
          onBackToCategories={() => {
            // Top Questions 숨기고 FAQ 카테고리 다시 활성화
            deactivateComponent('topQuestions');
            activateComponent('faqCategories', message.id);
          }}
        />
      </div>
    )}
    
    {/* Grade Selection - CTA 패턴과 동일한 방식 */}
    {activeComponentMessageId.gradeSelection === message.id && (
      <div className="mt-4">
        <GradeSelection 
          onGradeSelect={(grade) => {
            handleGradeSelect(grade);
            deactivateComponent('gradeSelection');
          }}
        />
      </div>
    )}
  </div>
))}
```

#### 3. 메시지 생성 시 컴포넌트 활성화

```typescript
// FAQ 카테고리 표시를 위한 봇 메시지 추가
const showFAQCategories = useCallback(() => {
  const otherText = t('chat.quickReplies.other');
  const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
  
  // 1. 사용자 메시지 추가
  addUserMessage(otherText, false);
  
  // 2. 봇 메시지 추가하고 해당 메시지 ID로 FAQ 카테고리 활성화
  setTimeout(() => {
    const botMessageId = addTypingBotMessage(whatWouldYouLikeToKnow);
    // 메시지 ID를 사용하여 FAQ 카테고리 활성화
    activateComponent('faqCategories', botMessageId);
  }, 100);
}, [addUserMessage, addTypingBotMessage, activateComponent, t]);

// 학년 선택 표시를 위한 온보딩 메시지
const showGradeSelection = useCallback(() => {
  const onboardingMessage = t('onboarding.gradeSelectionMessage');
  const messageId = addTypingBotMessage(onboardingMessage);
  
  // 메시지 ID를 사용하여 학년 선택 활성화
  activateComponent('gradeSelection', messageId);
}, [addTypingBotMessage, activateComponent, t]);
```

#### 4. useChat 훅에서 메시지 ID 반환

```typescript
// src/hooks/useChat.ts
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // 메시지 추가 시 ID 반환하도록 수정
  const addTypingBotMessage = useCallback((content: string): string => {
    const messageId = generateId();
    const newMessage: Message = {
      id: messageId,
      type: 'bot',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return messageId; // 메시지 ID 반환
  }, []);
  
  const addUserMessage = useCallback((content: string, shouldTyping: boolean = true): string => {
    const messageId = generateId();
    const newMessage: Message = {
      id: messageId,
      type: 'user', 
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return messageId; // 메시지 ID 반환
  }, []);
  
  return {
    messages,
    addTypingBotMessage,
    addUserMessage,
    // ... 기타 기능들
  };
};
```

#### 5. 컴포넌트 상태 관리 훅 (선택적)

```typescript
// src/hooks/useActiveComponents.ts
interface ActiveComponentState {
  faqCategories: string | null;
  topQuestions: string | null;
  gradeSelection: string | null;
  quickReply: string | null;
  cta: string | null; // 기존 CTA와 통합
}

export const useActiveComponents = () => {
  const [activeComponents, setActiveComponents] = useState<ActiveComponentState>({
    faqCategories: null,
    topQuestions: null,
    gradeSelection: null,
    quickReply: null,
    cta: null
  });

  const activateComponent = useCallback((
    componentType: keyof ActiveComponentState,
    messageId: string
  ) => {
    setActiveComponents(prev => ({
      ...prev,
      [componentType]: messageId
    }));
  }, []);

  const deactivateComponent = useCallback((
    componentType: keyof ActiveComponentState
  ) => {
    setActiveComponents(prev => ({
      ...prev,
      [componentType]: null
    }));
  }, []);

  const isComponentActive = useCallback((
    componentType: keyof ActiveComponentState,
    messageId: string
  ) => {
    return activeComponents[componentType] === messageId;
  }, [activeComponents]);

  // 모든 컴포넌트 비활성화 (특정 상황에서 사용)
  const deactivateAllComponents = useCallback(() => {
    setActiveComponents({
      faqCategories: null,
      topQuestions: null,
      gradeSelection: null,
      quickReply: null,
      cta: null
    });
  }, []);

  return {
    activeComponents,
    activateComponent,
    deactivateComponent,
    isComponentActive,
    deactivateAllComponents
  };
};
```

#### 6. CTA 구현과의 통합

```typescript
// 기존 CTA 로직을 새로운 패턴에 통합
useEffect(() => {
  const llmMessages = messages.filter(m => m.type === 'bot' && m.llmResponse);
  if (llmMessages.length > 0) {
    const latestLLMMessage = llmMessages[llmMessages.length - 1];
    
    // 기존 CTA 로직과 새로운 컴포넌트 관리 통합
    if (latestLLMMessage.id !== activeComponents.cta) {
      activateComponent('cta', latestLLMMessage.id);
      setHideAllCTA(false);
    }
  }
}, [messages, activeComponents.cta, activateComponent]);

// CTA 서브 버튼 클릭 시 컴포넌트 상태 관리
const handleSubCTAClick = useCallback(() => {
  // CTA 비활성화
  deactivateComponent('cta');
  setHideAllCTA(true);
  
  // FAQ 카테고리를 위한 새 메시지 생성 및 활성화
  const subCTAText = 'もう少し質問する';
  const whatWouldYouLikeToKnow = t('chat.faq.whatWouldYouLikeToKnow');
  
  addUserMessage(subCTAText, false);
  
  setTimeout(() => {
    const botMessageId = addTypingBotMessage(whatWouldYouLikeToKnow);
    activateComponent('faqCategories', botMessageId);
  }, 100);
}, [deactivateComponent, addUserMessage, addTypingBotMessage, activateComponent, t]);
```

### 테스트 전략

#### 1. 단위 테스트

```typescript
// src/hooks/useActiveComponents.test.ts
describe('useActiveComponents', () => {
  test('컴포넌트 활성화가 올바르게 동작해야 함', () => {
    const { result } = renderHook(() => useActiveComponents());
    
    const messageId = 'msg-123';
    act(() => {
      result.current.activateComponent('faqCategories', messageId);
    });
    
    expect(result.current.isComponentActive('faqCategories', messageId)).toBe(true);
    expect(result.current.isComponentActive('topQuestions', messageId)).toBe(false);
  });
  
  test('컴포넌트 비활성화가 올바르게 동작해야 함', () => {
    const { result } = renderHook(() => useActiveComponents());
    
    const messageId = 'msg-123';
    act(() => {
      result.current.activateComponent('faqCategories', messageId);
      result.current.deactivateComponent('faqCategories');
    });
    
    expect(result.current.isComponentActive('faqCategories', messageId)).toBe(false);
  });
  
  test('동일한 컴포넌트 타입에서 메시지 ID 변경이 올바르게 동작해야 함', () => {
    const { result } = renderHook(() => useActiveComponents());
    
    const messageId1 = 'msg-123';
    const messageId2 = 'msg-456';
    
    act(() => {
      result.current.activateComponent('faqCategories', messageId1);
    });
    expect(result.current.isComponentActive('faqCategories', messageId1)).toBe(true);
    
    act(() => {
      result.current.activateComponent('faqCategories', messageId2);
    });
    expect(result.current.isComponentActive('faqCategories', messageId1)).toBe(false);
    expect(result.current.isComponentActive('faqCategories', messageId2)).toBe(true);
  });
});
```

#### 2. 통합 테스트

```typescript
// src/pages/MainPage.integration.test.tsx
describe('MainPage 메시지 ID 기반 컴포넌트 제어', () => {
  test('FAQ 카테고리가 특정 메시지에서만 표시되어야 함', async () => {
    render(<MainPage />);
    
    // 첫 번째 "その他" 클릭
    const otherButton1 = await screen.findByText('その他');
    await user.click(otherButton1);
    
    // FAQ 카테고리 표시 확인
    const faqCategory1 = await screen.findByTestId('faq-category');
    expect(faqCategory1).toBeInTheDocument();
    
    // 카테고리 선택
    const categoryButton = await screen.findByText('授業・カリキュラム');
    await user.click(categoryButton);
    
    // FAQ 카테고리 숨김 확인
    expect(screen.queryByTestId('faq-category')).not.toBeInTheDocument();
    
    // 다시 "その他" 클릭 (새로운 메시지)
    const otherButton2 = await screen.findByText('その他');
    await user.click(otherButton2);
    
    // 새로운 FAQ 카테고리만 표시되어야 함
    const faqCategories = await screen.findAllByTestId('faq-category');
    expect(faqCategories).toHaveLength(1);
  });
  
  test('CTA 버튼이 최신 LLM 메시지에서만 표시되어야 함', async () => {
    render(<MainPage />);
    
    // 첫 번째 질문 전송
    await sendTestMessage('첫 번째 질문');
    
    // 첫 번째 CTA 표시 확인
    const cta1 = await screen.findByTestId('cta-buttons');
    expect(cta1).toBeInTheDocument();
    
    // 두 번째 질문 전송
    await sendTestMessage('두 번째 질문');
    
    // 두 번째 CTA만 표시되어야 함
    const ctaButtons = await screen.findAllByTestId('cta-buttons');
    expect(ctaButtons).toHaveLength(1);
  });
});
```

#### 3. Storybook 스토리

```typescript
// src/components/organisms/ChatMessage/ChatMessage.stories.tsx
export const MessageIDBasedControl: Story = {
  args: {
    message: {
      id: 'msg-faq-123',
      type: 'bot',
      content: 'どのようなことを知りたいですか？',
      timestamp: new Date()
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'ADR-006: 메시지 ID 기반으로 FAQ 카테고리가 특정 메시지에서만 표시되는 패턴'
      }
    }
  },
  render: (args) => {
    const [activeMessageId, setActiveMessageId] = useState<string | null>('msg-faq-123');
    
    return (
      <div>
        <ChatMessage {...args} />
        {activeMessageId === args.message.id && (
          <div className="mt-4">
            <FAQCategory 
              onCategorySelect={() => setActiveMessageId(null)}
            />
          </div>
        )}
        <Button 
          onClick={() => setActiveMessageId(activeMessageId ? null : 'msg-faq-123')}
          className="mt-4"
        >
          FAQ 카테고리 토글
        </Button>
      </div>
    );
  }
};
```

### 성능 최적화

#### 1. 메모이제이션 활용

```typescript
// 컴포넌트 활성화 상태 메모이제이션
const isComponentActive = useMemo(() => {
  return (componentType: keyof ActiveComponentState, messageId: string) => {
    return activeComponents[componentType] === messageId;
  };
}, [activeComponents]);

// 메시지 렌더링 최적화
const MessageWithComponents = memo(({ 
  message, 
  activeComponents, 
  onComponentAction 
}: MessageWithComponentsProps) => {
  return (
    <div key={message.id}>
      <ChatMessage message={message} />
      
      {activeComponents.faqCategories === message.id && (
        <FAQCategory onCategorySelect={onComponentAction} />
      )}
      
      {activeComponents.topQuestions === message.id && (
        <TopQuestions onQuestionSelect={onComponentAction} />
      )}
    </div>
  );
});
```

#### 2. 불필요한 재렌더링 방지

```typescript
// 컴포넌트 활성화 조건을 별도 컴포넌트로 분리
const ConditionalComponent = memo(({ 
  shouldShow, 
  children 
}: { 
  shouldShow: boolean; 
  children: React.ReactNode; 
}) => {
  return shouldShow ? <>{children}</> : null;
});

// 사용 예시
<ConditionalComponent shouldShow={activeComponents.faqCategories === message.id}>
  <FAQCategory onCategorySelect={handleCategorySelect} />
</ConditionalComponent>
```

## 결과

### 긍정적 결과
1. **중복 방지**: 메시지 ID 기반으로 컴포넌트 고유성 보장
2. **예측 가능성**: 일관된 컴포넌트 생명주기 관리
3. **확장성**: 새로운 컴포넌트 타입 쉽게 추가 가능
4. **성능 향상**: 불필요한 조건 검사 및 재렌더링 방지
5. **일관성**: 기존 CTA 패턴과 통합된 접근 방식
6. **테스트 용이성**: 명확한 상태 기반 테스트 작성 가능

### 주의사항
1. **메시지 ID 관리**: useChat 훅에서 메시지 ID 반환 로직 필요
2. **상태 복잡도**: 여러 컴포넌트 상태를 동시에 관리하는 복잡성
3. **메모리 누수**: 오래된 메시지 ID 참조로 인한 메모리 누수 방지 필요
4. **디버깅**: 상태 변화 추적을 위한 로깅 시스템 구축

### 마이그레이션 계획
1. **1단계**: useActiveComponents 훅 구현 및 테스트
2. **2단계**: useChat 훅에서 메시지 ID 반환 기능 추가
3. **3단계**: FAQ 카테고리를 메시지 ID 기반으로 변경
4. **4단계**: Top Questions 및 기타 컴포넌트 적용
5. **5단계**: 기존 CTA 로직과 통합
6. **6단계**: 레거시 내용 기반 조건문 제거

### 향후 확장 계획
1. **컴포넌트 히스토리**: 사용자가 이전 컴포넌트로 돌아갈 수 있는 기능
2. **지능형 활성화**: AI 기반 컴포넌트 자동 활성화 로직
3. **A/B 테스트**: 메시지 ID 기반 컴포넌트 표시 패턴 최적화
4. **분석 대시보드**: 컴포넌트 활성화 패턴 분석 및 사용자 경험 개선

## 관련 이슈
- Notion: 문제 원인 파악 및 수정안 - FAQ 카테고리 중복 표시 문제

## 참고 문서
- [프론트엔드 컴포넌트 패턴](../rule/frontend-component-patterns.md)
- [사용자 경험 가이드라인](../rule/user-experience-guidelines.md)  
- [LLM 응답 처리 전략](ADR-003-llm-response-handling-strategy.md)
- [React + TypeScript 아키텍처](ADR-001-react-typescript-frontend-architecture.md)

## 날짜
2025-07-26

## 작성자
Frontend Development Team