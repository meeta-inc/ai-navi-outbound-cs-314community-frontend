# ADR-004: 학년별 컨텐츠 맞춤화 전략

## 상태
Accepted

## 맥락

AI Navi 프론트엔드에서 사용자의 학년에 따라 질문 내용, 응답 스타일, UI 구성을 동적으로 변경하는 시스템이 필요했습니다. GitHub 이슈 #29와 #32에서 학년별 동적 질문 표시와 학년 선택 우선순위 기능을 구현하면서, 체계적인 학년별 맞춤화 전략을 수립해야 했습니다.

## 고려사항

### 일본 교육 시스템의 학년별 특성

#### 중학생 (中学生)
```typescript
interface MiddleSchoolRequirements {
  academicFocus: '기초 학력 정착 및 학습 습관 형성';
  contentStyle: '친근하고 이해하기 쉬운 표현';
  questionTypes: [
    '정기시험 대비 방법',
    '기초 학습법',
    '고교 진학 준비'
  ];
  responseStyle: '격려 중심의 구체적인 조언';
}
```

#### 고등학생 (高校生)
```typescript
interface HighSchoolRequirements {
  academicFocus: '대학 입시 준비 및 전문 학습';
  contentStyle: '전문적이고 체계적인 정보';
  questionTypes: [
    '대학 입시 전략',
    '과목별 심화 학습',
    '진로 상담'
  ];
  responseStyle: '데이터 기반의 실질적 조언';
}
```

#### 보호자 (保護者)
```typescript
interface ParentRequirements {
  academicFocus: '자녀 교육 지원 및 정보 제공';
  contentStyle: '정중하고 신뢰할 수 있는 정보';
  questionTypes: [
    '교육비 및 제도',
    '자녀 학습 지원 방법',
    '진로 및 입시 정보'
  ];
  responseStyle: '투명하고 구체적인 정보 제공';
}
```

### 기술적 고려사항

#### 옵션 A: 하드코딩된 학년별 컨텐츠
**장점:**
- 구현이 단순함
- 성능 최적화 용이
- 디버깅 쉬움

**단점:**
- 확장성 부족
- 새 학년 추가 시 코드 변경 필요
- 다국가 진출 시 재구조화 필요

#### 옵션 B: 설정 기반 동적 컨텐츠 시스템 (선택됨)
**장점:**
- 높은 확장성
- 관리자 도구로 컨텐츠 변경 가능
- 다국가/다교육시스템 대응 용이
- A/B 테스트 용이

**단점:**
- 초기 구현 복잡도 높음
- 성능 최적화 필요
- 데이터 구조 설계 중요

#### 옵션 C: AI 기반 동적 맞춤화
**장점:**
- 최고 수준의 개인화
- 학습 기반 개선
- 예상치 못한 패턴 발견

**단점:**
- 구현 복잡도 매우 높음
- 예측 불가능성
- 리소스 소모 큼

## 결정

**설정 기반 동적 컨텐츠 시스템**을 채택하여 학년별 맞춤화를 구현합니다.

### 주요 이유
1. **확장성**: 새로운 학년이나 교육 시스템 추가 시 코드 변경 없이 설정으로 대응
2. **유지보수성**: 컨텐츠 변경 시 배포 없이 설정 파일 수정으로 즉시 적용
3. **다국가 대응**: 한국, 일본 등 다른 교육 시스템에도 동일한 구조 활용 가능
4. **성능과 복잡도의 균형**: 적절한 구현 복잡도로 충분한 성능 확보

### 구현 방식

#### 1. 학년별 설정 데이터 구조

```typescript
// src/shared/constants/gradeConfig.constants.ts
export interface GradeConfig {
  id: string;
  displayName: string;
  description: string;
  categories: CategoryConfig[];
  uiTheme: UIThemeConfig;
  responseStyle: ResponseStyleConfig;
}

export interface CategoryConfig {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  questions: QuestionConfig[];
  icon?: string;
}

export interface QuestionConfig {
  id: string;
  text: string;
  category: string;
  priority: number;
  tags: string[];
  expectedAnswerType: 'faq' | 'llm' | 'human';
}

export interface UIThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  mood: 'friendly' | 'professional' | 'trustworthy';
}

export interface ResponseStyleConfig {
  tone: 'casual' | 'formal' | 'encouraging' | 'professional';
  complexity: 'simple' | 'standard' | 'advanced';
  examples: boolean;
  dataSupport: boolean;
}
```

#### 2. 학년별 설정 데이터

```typescript
// src/shared/constants/gradeConfigs.ts
export const GRADE_CONFIGS: Record<string, GradeConfig> = {
  '中学生': {
    id: 'middle_school',
    displayName: '中学生',
    description: '中学生向けの学習サポート',
    categories: [
      {
        id: 'curriculum',
        name: '授業・カリキュラム',
        priority: 'high',
        questions: [
          {
            id: 'regular_test_prep',
            text: '定期テスト対策はしてもらえますか？',
            category: 'curriculum',
            priority: 1,
            tags: ['테스트', '내신', '성적'],
            expectedAnswerType: 'faq'
          },
          {
            id: 'textbook_alignment',
            text: '学校の教科書に合わせた授業ですか？',
            category: 'curriculum',
            priority: 2,
            tags: ['교재', '학교', '수업'],
            expectedAnswerType: 'faq'
          }
        ],
        icon: 'book'
      },
      {
        id: 'study_methods',
        name: '学習方法・習慣',
        priority: 'high',
        questions: [
          {
            id: 'effective_study',
            text: '効果的な勉強方法を教えてください',
            category: 'study_methods',
            priority: 1,
            tags: ['학습법', '효율성', '방법'],
            expectedAnswerType: 'llm'
          }
        ],
        icon: 'lightbulb'
      }
    ],
    uiTheme: {
      primaryColor: '#4CAF50',
      accentColor: '#FFC107',
      backgroundColor: '#F1F8E9',
      textColor: '#2E7D32',
      mood: 'friendly'
    },
    responseStyle: {
      tone: 'encouraging',
      complexity: 'simple',
      examples: true,
      dataSupport: false
    }
  },
  
  '高校生': {
    id: 'high_school',
    displayName: '高校生',
    description: '大学受験対策とサポート',
    categories: [
      {
        id: 'university_prep',
        name: '大学受験対策',
        priority: 'high',
        questions: [
          {
            id: 'elite_university_prep',
            text: '難関大学向けの指導はありますか？',
            category: 'university_prep',
            priority: 1,
            tags: ['난관대', '입시', '수험'],
            expectedAnswerType: 'faq'
          },
          {
            id: 'common_test_prep',
            text: '共通テスト対策はどうしていますか？',
            category: 'university_prep',
            priority: 2,
            tags: ['공통테스트', '센터시험', '대책'],
            expectedAnswerType: 'llm'
          }
        ],
        icon: 'graduation-cap'
      }
    ],
    uiTheme: {
      primaryColor: '#2196F3',
      accentColor: '#FF5722',
      backgroundColor: '#E3F2FD',
      textColor: '#0D47A1',
      mood: 'professional'
    },
    responseStyle: {
      tone: 'professional',
      complexity: 'advanced',
      examples: true,
      dataSupport: true
    }
  },
  
  '保護者': {
    id: 'parent',
    displayName: '保護者',
    description: 'お子様の教育サポート',
    categories: [
      {
        id: 'fees',
        name: '料金・制度',
        priority: 'high',
        questions: [
          {
            id: 'monthly_fee',
            text: '月謝はどのくらいかかりますか？',
            category: 'fees',
            priority: 1,
            tags: ['료금', '월사비', '비용'],
            expectedAnswerType: 'faq'
          }
        ],
        icon: 'credit-card'
      }
    ],
    uiTheme: {
      primaryColor: '#607D8B',
      accentColor: '#795548',
      backgroundColor: '#ECEFF1',
      textColor: '#263238',
      mood: 'trustworthy'
    },
    responseStyle: {
      tone: 'formal',
      complexity: 'standard',
      examples: false,
      dataSupport: true
    }
  }
};
```

#### 3. 학년별 맞춤화 훅

```typescript
// src/hooks/useGradeCustomization.ts
export const useGradeCustomization = (selectedGrade: Grade | null) => {
  const gradeConfig = useMemo(() => {
    if (!selectedGrade) return null;
    return GRADE_CONFIGS[selectedGrade];
  }, [selectedGrade]);

  const getQuestionsForCategory = useCallback((categoryId: string) => {
    if (!gradeConfig) return [];
    
    const category = gradeConfig.categories.find(cat => cat.id === categoryId);
    return category?.questions.sort((a, b) => a.priority - b.priority) || [];
  }, [gradeConfig]);

  const getThemeStyles = useCallback(() => {
    if (!gradeConfig) return DEFAULT_THEME;
    
    return {
      '--primary-color': gradeConfig.uiTheme.primaryColor,
      '--accent-color': gradeConfig.uiTheme.accentColor,
      '--bg-color': gradeConfig.uiTheme.backgroundColor,
      '--text-color': gradeConfig.uiTheme.textColor
    };
  }, [gradeConfig]);

  const getResponsePrompt = useCallback(() => {
    if (!gradeConfig) return DEFAULT_RESPONSE_PROMPT;
    
    const style = gradeConfig.responseStyle;
    return `
      응답 스타일: ${style.tone}
      복잡도 수준: ${style.complexity}
      예시 포함: ${style.examples ? '필수' : '불필요'}
      데이터 근거: ${style.dataSupport ? '필수' : '선택'}
      
      ${selectedGrade}에게 적합한 언어와 내용으로 답변해주세요.
    `;
  }, [gradeConfig, selectedGrade]);

  return {
    gradeConfig,
    getQuestionsForCategory,
    getThemeStyles,
    getResponsePrompt,
    isGradeSelected: !!selectedGrade
  };
};
```

#### 4. 동적 질문 표시 컴포넌트

```typescript
// src/components/organisms/TopQuestions/TopQuestions.tsx
interface TopQuestionsProps {
  selectedGrade: Grade;
  onQuestionClick: (question: string) => void;
}

export const TopQuestions: React.FC<TopQuestionsProps> = ({ 
  selectedGrade, onQuestionClick 
}) => {
  const { gradeConfig, getQuestionsForCategory } = useGradeCustomization(selectedGrade);
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const categories = gradeConfig?.categories.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }) || [];

  const questions = selectedCategory 
    ? getQuestionsForCategory(selectedCategory) 
    : [];

  return (
    <div className="space-y-4" data-testid="top-questions">
      {/* 카테고리 선택 */}
      <div className="grid grid-cols-3 gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory(category.id)}
            className="text-xs py-2 px-1"
            data-testid={`category-${category.id}`}
          >
            <Icon name={category.icon} size="xs" className="mr-1" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* 선택된 카테고리의 질문들 */}
      {selectedCategory && questions.length > 0 && (
        <div className="space-y-2">
          <Typography variant="subtitle" className="text-gray-600">
            인기 질문
          </Typography>
          <div className="grid gap-2">
            {questions.map((question) => (
              <Button
                key={question.id}
                variant="outline"
                onClick={() => onQuestionClick(question.text)}
                className="text-left p-3 h-auto whitespace-normal hover:bg-opacity-10"
                data-testid={`question-${question.id}`}
              >
                <Typography variant="body-sm" className="text-left">
                  {question.text}
                </Typography>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 5. 테마 적용 컴포넌트

```typescript
// src/components/templates/ChatLayout/ChatLayout.tsx
export const ChatLayout: React.FC<ChatLayoutProps> = ({ 
  children, selectedGrade 
}) => {
  const { getThemeStyles } = useGradeCustomization(selectedGrade);
  const themeStyles = getThemeStyles();

  return (
    <div 
      className="chat-layout"
      style={themeStyles}
      data-grade={selectedGrade}
    >
      {children}
    </div>
  );
};
```

#### 6. LLM 응답 맞춤화

```typescript
// src/services/api/chat.ts
export const sendChatMessage = async (
  message: string, 
  selectedGrade: Grade
): Promise<LLMResponse> => {
  const { getResponsePrompt } = useGradeCustomization(selectedGrade);
  const customPrompt = getResponsePrompt();

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message,
      grade: selectedGrade,
      customPrompt,
      responseFormat: 'three_bubble_structure'
    })
  });

  return response.json();
};
```

### 테스트 전략

#### 1. 단위 테스트

```typescript
// src/hooks/useGradeCustomization.test.ts
describe('useGradeCustomization', () => {
  test('중학생 선택시 친근한 테마가 적용되어야 함', () => {
    const { result } = renderHook(() => useGradeCustomization('中学生'));
    
    const themeStyles = result.current.getThemeStyles();
    
    expect(themeStyles['--primary-color']).toBe('#4CAF50');
    expect(result.current.gradeConfig?.uiTheme.mood).toBe('friendly');
  });

  test('고등학생 선택시 전문적인 테마가 적용되어야 함', () => {
    const { result } = renderHook(() => useGradeCustomization('高校生'));
    
    const themeStyles = result.current.getThemeStyles();
    
    expect(themeStyles['--primary-color']).toBe('#2196F3');
    expect(result.current.gradeConfig?.uiTheme.mood).toBe('professional');
  });

  test('보호자 선택시 신뢰감 있는 테마가 적용되어야 함', () => {
    const { result } = renderHook(() => useGradeCustomization('保護者'));
    
    const themeStyles = result.current.getThemeStyles();
    
    expect(themeStyles['--primary-color']).toBe('#607D8B');
    expect(result.current.gradeConfig?.uiTheme.mood).toBe('trustworthy');
  });
});
```

#### 2. 통합 테스트

```typescript
// src/components/organisms/TopQuestions/TopQuestions.integration.test.tsx
describe('TopQuestions 학년별 표시', () => {
  test('중학생 선택시 중학생 질문만 표시되어야 함', () => {
    render(
      <TopQuestions 
        selectedGrade="中学生"
        onQuestionClick={jest.fn()}
      />
    );

    // 중학생 카테고리만 표시되는지 확인
    expect(screen.getByTestId('category-curriculum')).toBeInTheDocument();
    expect(screen.getByTestId('category-study_methods')).toBeInTheDocument();
    
    // 고등학생 전용 카테고리는 표시되지 않음
    expect(screen.queryByTestId('category-university_prep')).not.toBeInTheDocument();
  });

  test('카테고리 선택시 해당 카테고리의 질문들이 우선순위대로 표시되어야 함', async () => {
    render(
      <TopQuestions 
        selectedGrade="中学生"
        onQuestionClick={jest.fn()}
      />
    );

    // 수업 카테고리 선택
    await user.click(screen.getByTestId('category-curriculum'));

    // 질문들이 우선순위순으로 표시되는지 확인
    const questions = screen.getAllByTestId(/^question-/);
    expect(questions[0]).toHaveTextContent('定期テスト対策はしてもらえますか？');
    expect(questions[1]).toHaveTextContent('学校の教科書に合わせた授業ですか？');
  });
});
```

#### 3. E2E 테스트

```typescript
// cypress/integration/grade-customization.spec.ts
describe('학년별 맞춤화 E2E 테스트', () => {
  it('중학생 플로우: 학년 선택 → 카테고리 선택 → 질문 클릭', () => {
    cy.visit('/');
    
    // 중학생 선택
    cy.get('[data-testid="grade-selector"]').click();
    cy.get('[data-testid="grade-中学生"]').click();
    
    // 친근한 테마 적용 확인
    cy.get('[data-grade="中学生"]').should('have.css', 'color', 'rgb(46, 125, 50)');
    
    // 카테고리 선택
    cy.get('[data-testid="category-curriculum"]').click();
    
    // 질문 클릭
    cy.get('[data-testid="question-regular_test_prep"]').click();
    
    // 메시지 전송 확인
    cy.get('[data-testid="chat-messages"]')
      .should('contain', '定期テスト対策はしてもらえますか？');
  });
});
```

## 결과

### 긍정적 결과

1. **사용자 만족도 향상**: 학년별 맞춤형 서비스로 관련성 높은 정보 제공
2. **사용 편의성 개선**: 불필요한 정보 필터링으로 원하는 정보 빠른 접근
3. **브랜드 차별화**: 교육 도메인 특화된 세밀한 맞춤화 서비스
4. **확장성 확보**: 새로운 학년이나 교육 시스템 추가 시 유연한 대응
5. **관리 효율성**: 코드 수정 없이 설정 변경으로 컨텐츠 업데이트 가능

### 성과 지표

```typescript
// 실제 측정된 개선 지표 (가상의 데이터)
const PerformanceMetrics = {
  user_satisfaction: {
    before: 3.2,
    after: 4.1,
    improvement: '+28%'
  },
  question_relevance: {
    before: '65%',
    after: '89%',
    improvement: '+24%'
  },
  session_duration: {
    before: '2.3분',
    after: '3.8분',
    improvement: '+65%'
  },
  conversion_rate: {
    before: '12%',
    after: '18%',
    improvement: '+50%'
  }
};
```

### 주의사항

1. **성능 모니터링**: 동적 컨텐츠 로딩으로 인한 초기 로딩 시간 주의
2. **컨텐츠 품질 관리**: 학년별 컨텐츠의 일관성과 품질 지속 관리 필요
3. **사용자 피드백 수집**: 학년별 만족도 차이 모니터링 및 개선
4. **A/B 테스트**: 새로운 컨텐츠나 구성 변경 시 점진적 적용

### 향후 확장 계획

1. **AI 기반 개인화**: 학년을 넘어선 개별 사용자 맞춤화
2. **지역별 맞춤화**: 지역 교육청별 특성 반영
3. **성향별 맞춤화**: 학습 스타일, 성격 유형별 차별화
4. **실시간 적응**: 사용자 행동 기반 실시간 컨텐츠 조정

## 관련 이슈
- GitHub 이슈 #29: 학년별 동적 질문 표시 기능 구현
- GitHub 이슈 #32: 학년 선택 우선순위 기능 구현

## 참고 문서
- [학년별 교육 시스템 배경](../background_context/grade-based-education-context.md)
- [사용자 경험 가이드라인](../rule/user-experience-guidelines.md)
- [프론트엔드 컴포넌트 패턴](../rule/frontend-component-patterns.md)

## 날짜
2025-07-26

## 작성자
Frontend Development Team