# TopQuestions 학년별 질문 표시 테스트 가이드

## 📋 개요

`TopQuestions.test.tsx` 파일은 **TDD 단계3-1**에서 작성된 테스트로, 이슈 #29 "카테고리 표시 및 학년별 질문 동적 표시 기능 구현"의 학년별 질문 동적 표시 기능을 검증합니다.

### 📂 파일 위치
```
src/components/organisms/TopQuestions/TopQuestions.test.tsx
src/components/organisms/TopQuestions/TopQuestions.tsx
src/shared/constants/gradeQuestions.constants.ts
src/pages/MainPage.tsx (컴포넌트 사용처)
```

### 🎯 테스트 목적
- **학년별 질문 필터링**: 선택된 학년에 맞는 질문 표시 기능 검증
- **카테고리별 질문 표시**: 카테고리별 질문 분류 기능 확인
- **베스트 질문 우선 표시**: 추천 질문 우선 정렬 기능 검증
- **UI 컴포넌트 렌더링**: 버튼 및 구조 정상 렌더링 확인

## 🏗️ TopQuestions 컴포넌트 구조

### Props 인터페이스
```typescript
interface TopQuestionsProps {
  categoryId: CategoryType;        // 선택된 카테고리 ID
  categoryTitle: string;           // 카테고리 제목 (번역된)
  grade: GradeType;               // 선택된 학년
  onQuestionSelect: (question: string) => void;
  onBackToCategories: () => void;
  userId: string;
  onDataLoaded?: () => void;
  className?: string;
}
```

### 학년별 데이터 필터링 로직
```typescript
// 학년과 카테고리별 질문 가져오기
const gradeQuestions = GRADE_CATEGORY_QUESTIONS[grade][categoryId];

// 베스트 질문 우선 정렬
const sortedQuestions = [...gradeQuestions].sort((a, b) => {
  if (a.isBest && !b.isBest) return -1;
  if (!a.isBest && b.isBest) return 1;
  return 0;
});
```

## 🧪 테스트 그룹별 세부 내용

### 1️⃣ 학년별 질문 필터링 (Grade-based question filtering)

#### 🎯 고등학생 질문 표시
```typescript
it('should display questions for selected grade and category')
```
- **검증 내용**: 고등학생-수업 카테고리 질문들이 올바르게 표시되는지 확인
- **데이터 소스**: `GRADE_CATEGORY_QUESTIONS.high.curriculum`
- **기대값**: 5개의 고등학생 맞춤형 수업 관련 질문 표시

#### 🎯 중학생 질문 표시
```typescript
it('should display middle school questions when grade is middle')
```
- **검증 내용**: 중학생 학년 선택 시 해당 질문들 표시
- **데이터 소스**: `GRADE_CATEGORY_QUESTIONS.middle.curriculum`
- **실패 시나리오**: 다른 학년의 질문이 표시되는 경우

#### 🎯 초등학생 질문 표시
```typescript
it('should display elementary school questions when grade is elementary')
```
- **검증 내용**: 초등학생 학년 선택 시 해당 질문들 표시
- **데이터 소스**: `GRADE_CATEGORY_QUESTIONS.elementary.curriculum`
- **특화 질문**: 초등교육과정 맞춤형 질문 포함

#### 🎯 유아 질문 표시
```typescript
it('should display preschool questions when grade is preschool')
```
- **검증 내용**: 유아 학년 선택 시 해당 질문들 표시
- **데이터 소스**: `GRADE_CATEGORY_QUESTIONS.preschool.curriculum`
- **특화 질문**: 유아교육 특성에 맞는 질문 포함

### 2️⃣ 카테고리별 질문 필터링 (Category-based question filtering)

#### 🎯 통학·학습시간 카테고리
```typescript
it('should display schedule category questions correctly')
```
- **검증 범위**: 고등학생-통학시간 카테고리 질문들
- **데이터 소스**: `GRADE_CATEGORY_QUESTIONS.high.schedule`
- **질문 예시**: 수업시간, 통학방법, 학습시간 관련 질문

#### 🎯 요금·제도 카테고리
```typescript
it('should display pricing category questions correctly')
```
- **검증 범위**: 고등학생-요금 카테고리 질문들
- **데이터 소스**: `GRADE_CATEGORY_QUESTIONS.high.pricing`
- **질문 예시**: 수강료, 할인제도, 추가비용 관련 질문

### 3️⃣ 베스트 질문 우선 표시 (Best questions priority display)

#### 🎯 베스트 질문 상단 배치
```typescript
it('should display best questions first')
```
- **검증 내용**: `isBest: true` 질문들이 상단에 우선 표시되는지 확인
- **정렬 로직**: 베스트 질문(isBest) → 일반 질문 순으로 정렬
- **UI 활용**: 사용자가 가장 중요한 질문을 먼저 볼 수 있도록 함

#### 🎯 베스트 질문 개수 검증
```typescript
it('should have at least one best question per category for each grade')
```
- **검증 범위**: 4학년 × 3카테고리 = 12개 조합 모두 검사
- **최소 요구사항**: 각 카테고리마다 최소 1개 베스트 질문 보장
- **실패 시나리오**: 베스트 질문이 없는 카테고리 발견

### 4️⃣ 버튼 렌더링 (Button rendering)

#### 🎯 질문 버튼 렌더링
```typescript
it('should render question buttons correctly')
```
- **검증 내용**: 질문 텍스트가 클릭 가능한 버튼으로 렌더링되는지 확인
- **HTML 요소**: `<button>` 태그로 올바르게 렌더링
- **접근성**: 버튼 역할(role) 및 텍스트 내용 확인

#### 🎯 뒤로가기 버튼 렌더링
```typescript
it('should render back to categories button')
```
- **검증 내용**: "カテゴリー一覧に戻る" 버튼이 정상 렌더링되는지 확인
- **번역 키**: `chat.faq.backToCategories` 키 사용
- **실제 클릭 이벤트**: E2E 테스트에서 검증 (LLM 송신으로 인한 응답 시간 고려)

### 5️⃣ 질문 개수 검증 (Question count validation)

#### 🎯 학년-카테고리별 5개 질문 확인
```typescript
it('should display exactly 5 questions for each grade-category combination')
```
- **검증 범위**: 12개 조합 × 5개 질문 = 60개 질문 모두 확인
- **조합 목록**:
  - 유아: curriculum, schedule, pricing
  - 초등학생: curriculum, schedule, pricing  
  - 중학생: curriculum, schedule, pricing
  - 고등학생: curriculum, schedule, pricing
- **카운팅 방식**: 질문 버튼 개수 - 뒤로가기 버튼 1개 = 5개

### 6️⃣ 질문 ID 고유성 (Question ID uniqueness)

#### 🎯 중복되지 않는 고유 ID
```typescript
it('should display questions with unique IDs')
```
- **검증 내용**: 표시되는 모든 질문이 고유한 ID를 가지는지 확인
- **ID 형식**: `grade-category-number` (예: `high-curriculum-1`)
- **고유성 검사**: Set을 사용한 중복 제거 후 길이 비교

### 7️⃣ UI 구조 및 스타일링 (UI structure and styling)

#### 🎯 올바른 UI 구조 렌더링
```typescript
it('should render with correct UI structure')
```
- **제목 표시**: "⭐授業・カリキュラムに関するよくある質問" 형태
- **뒤로가기 버튼**: "カテゴリー一覧に戻る" 버튼 존재
- **컨테이너 클래스**: `bg-gray-50`, `w-full`, `max-w-[320px]` 적용

## 🚀 테스트 실행

### 로컬 실행
```bash
# Jest를 직접 실행
npx jest src/components/organisms/TopQuestions/TopQuestions.test.tsx

# 상세한 결과와 함께 실행
npx jest src/components/organisms/TopQuestions/TopQuestions.test.tsx --verbose

# 커버리지 없이 실행
npx jest src/components/organisms/TopQuestions/TopQuestions.test.tsx --no-coverage
```

### 기대 결과
```
PASS src/components/organisms/TopQuestions/TopQuestions.test.tsx
  TopQuestions Component - TDD Stage 3-1
    Grade-based question filtering
      ✓ should display questions for selected grade and category
      ✓ should display middle school questions when grade is middle
      ✓ should display elementary school questions when grade is elementary
      ✓ should display preschool questions when grade is preschool
    Category-based question filtering
      ✓ should display schedule category questions correctly
      ✓ should display pricing category questions correctly
    Best questions priority display
      ✓ should display best questions first
      ✓ should have at least one best question per category for each grade
    Button rendering
      ✓ should render question buttons correctly
      ✓ should render back to categories button
    Question count validation
      ✓ should display exactly 5 questions for each grade-category combination
    Question ID uniqueness
      ✓ should display questions with unique IDs
    UI structure and styling
      ✓ should render with correct UI structure

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

## 🔧 테스트 실패 시 디버깅 가이드

### 학년별 질문 필터링 오류
1. **grade prop 누락**: MainPage.tsx에서 `grade={selectedGrade || 'high'}` 추가 확인
2. **데이터 구조 오류**: `GRADE_CATEGORY_QUESTIONS[grade]`가 undefined인 경우
3. **카테고리 ID 불일치**: categoryId가 'curriculum', 'schedule', 'pricing' 중 하나인지 확인

### 번역 키 누락 오류
1. **noQuestions 키**: `src/locales/ja/common.json`에 `"noQuestions": "質問がありません"` 추가
2. **loading 키**: `src/locales/ja/common.json`에 `"loading": "読み込み中..."` 추가
3. **backToCategories 키**: 이미 존재하는지 확인

### UI 렌더링 오류
1. **이모지 텍스트 매칭**: `⭐授業・カリキュラムに関するよくある質問` 전체 텍스트로 검색
2. **컨테이너 클래스**: CSS 클래스명 정확성 재확인
3. **TypeScript null 체크**: `closest('div')?.parentElement` 형태로 null 안전성 보장

### 베스트 질문 정렬 오류
1. **정렬 함수 확인**: `sortQuestionsByBest` 유틸리티 함수 정상 작동 여부
2. **isBest 플래그**: gradeQuestions.constants.ts에서 베스트 질문 플래그 설정 확인

## 🎯 TDD 연관성

이 테스트는 **TDD Red-Green-Refactor 사이클**의 전체 과정을 거쳤습니다:

### 🔴 TDD Stage 3-1 (Red)
- **테스트 작성**: 13개 테스트 케이스 작성
- **실패 확인**: TopQuestions 컴포넌트 미구현 상태로 테스트 실패

### 🟢 TDD Stage 3-2 (Green)
- **최소 구현**: grade prop 추가, gradeQuestions.constants 연동
- **학년별 필터링**: 선택된 학년과 카테고리에 맞는 질문 표시
- **베스트 질문 정렬**: `sortQuestionsByBest` 함수로 우선순위 정렬
- **번역 키 추가**: 누락된 일본어 번역 키 추가
- **MainPage 통합**: TopQuestions에 grade prop 전달 수정

### 🔵 TDD Stage 3-3 (Refactor)
- **스타일 상수 추출**: STYLES 객체로 CSS 클래스 중앙화
- **유틸리티 함수 분리**: `sortQuestionsByBest` 함수 추출
- **코드 가독성 개선**: 중복 제거 및 구조 개선

## 🔗 실제 사용 사례

### MainPage.tsx에서의 사용
```tsx
<TopQuestions
  categoryId={selectedCategory.id}
  categoryTitle={t(selectedCategory.textKey)}
  grade={selectedGrade || 'high'}  // 중요: grade prop 전달
  onQuestionSelect={handleTopQuestionSelect}
  onBackToCategories={handleBackToCategories}
  userId="Hyunse0001"
  onDataLoaded={handleTopQuestionsDataLoaded}
/>
```

### E2E 테스트 고려사항
- **질문 클릭 이벤트**: LLM 송신으로 인한 응답 시간을 고려하여 E2E 테스트에서 검증
- **실제 사용자 플로우**: 카테고리 선택 → 질문 표시 → 질문 클릭 → LLM 응답 전체 플로우 테스트

## 📚 관련 문서
- [이슈 #29: 카테고리 표시 및 학년별 질문 동적 표시 기능 구현](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29)
- [학년별 질문 데이터 상수 테스트](./grade-questions-constants-test.md)
- [FAQ 카테고리 동적 설정 테스트](./faq-category-dynamic-config-test.md)