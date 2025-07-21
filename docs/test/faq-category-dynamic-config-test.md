# FAQ 카테고리 동적 설정 테스트 가이드

## 📋 개요

`FAQCategory.test.tsx` 파일은 **TDD 단계2-1**에서 작성된 테스트로, 이슈 #29 "카테고리 표시 및 학년별 질문 동적 표시 기능 구현"의 FAQ 카테고리 동적 설정 시스템을 검증합니다.

### 📂 파일 위치
```
src/components/organisms/FAQCategory/FAQCategory.test.tsx
src/components/organisms/FAQCategory/FAQCategory.tsx
src/shared/config/faqCategories.config.ts
src/shared/utils/env.utils.ts
.env (환경변수 설정)
```

### 🎯 테스트 목적
- **카테고리 개수 제어**: 환경변수를 통한 카테고리 개수 동적 변경 검증
- **설정 기반 렌더링**: 설정 파일 기반 카테고리 표시 기능 확인
- **환경 분리**: 테스트/브라우저 환경별 안전한 설정 로딩 검증

## 🏗️ 동적 설정 시스템 구조

### 설정 파일 구조
```typescript
interface FAQCategoryConfig {
  id: string;                    // 카테고리 고유 ID
  textKey: string;              // 번역 키 (제목)
  valueKey: string;             // 번역 키 (메시지)
  iconConfig: IconConfig;       // 아이콘 설정
  order: number;                // 표시 순서
  enabled: boolean;             // 활성화 여부
}

interface FAQCategoriesConfig {
  categories: FAQCategoryConfig[];
  defaultCategoryCount: number;
}
```

### 환경변수 설정 (.env)
```bash
# 기본 3개 카테고리 설정
VITE_FAQ_CATEGORIES_CONFIG={"categories":[
  {
    "id":"curriculum",
    "textKey":"chat.faq.curriculum.title",
    "valueKey":"chat.faq.curriculum.message",
    "iconConfig":{"type":"lucide","value":"BookOpen"},
    "order":1,
    "enabled":true
  },
  {
    "id":"schedule", 
    "textKey":"chat.faq.schedule.title",
    "valueKey":"chat.faq.schedule.message",
    "iconConfig":{"type":"lucide","value":"Clock"},
    "order":2,
    "enabled":true
  },
  {
    "id":"pricing",
    "textKey":"chat.faq.pricing.title",
    "valueKey":"chat.faq.pricing.message", 
    "iconConfig":{"type":"lucide","value":"DollarSign"},
    "order":3,
    "enabled":true
  }
],"defaultCategoryCount":3}
```

## 🧪 테스트 그룹별 세부 내용

### 1️⃣ 카테고리 렌더링 요구사항 (Category Rendering Requirements)

#### 🎯 정확한 카테고리 개수 렌더링
```typescript
it('should render exactly 3 categories')
```
- **검증 내용**: 환경변수 설정에 따라 정확히 3개 카테고리 표시
- **측정 방법**: `screen.getAllByRole('button').length === 3`
- **이슈 연관**: #29 요구사항 "3개 카테고리만 표시"

#### 🎯 올바른 일본어 카테고리명 표시
```typescript
it('should display correct Japanese category names')
```
- **검증 내용**: 번역 시스템을 통한 정확한 일본어 표시
- **기대값**:
  ```
  授業・カリキュラム (curriculum)
  通塾・学習時間 (schedule)
  料金・制度 (pricing)
  ```
- **실패 시나리오**: 번역키 누락, 잘못된 번역

#### 🎯 기본 카테고리 구조 생성
```typescript
it('should create 3 default categories with correct structure')
```
- **검증 내용**: 각 카테고리가 올바른 속성과 구조로 생성
- **확인 요소**: 버튼 존재, 올바른 접근성 name 속성
- **실패 시나리오**: DOM 구조 오류, 접근성 속성 누락

### 2️⃣ 카테고리 클릭 처리 (Category Click Handling)

#### 🎯 개별 카테고리 클릭 이벤트
```typescript
it('should call onCategorySelect with correct category when [category] is clicked')
```
- **검증 카테고리**: curriculum, schedule, pricing
- **확인 내용**: 
  - 콜백 함수 1회 호출
  - 올바른 카테고리 객체 전달 (`id`, `textKey` 포함)
- **실패 시나리오**: 이벤트 미발생, 잘못된 파라미터

#### 🎯 다중 클릭 독립성
```typescript
it('should handle multiple category clicks independently')
```
- **검증 내용**: 여러 카테고리를 순차 클릭 시 각각 독립적 처리
- **측정**: 3회 클릭 → 3회 콜백 호출, 각각 다른 카테고리 ID
- **실패 시나리오**: 클릭 간섭, 상태 오염

### 3️⃣ 커스텀 카테고리 지원 (Custom Categories Support)

#### 🎯 Props를 통한 카테고리 오버라이드
```typescript
it('should render custom categories when provided')
```
- **검증 내용**: `categories` props 제공 시 환경변수 설정 무시
- **테스트 시나리오**: 3개 커스텀 카테고리 전달 → 정확한 렌더링
- **활용 사례**: 특정 페이지별 다른 카테고리 구성

## 🔧 환경별 동작 방식

### 테스트 환경 (Jest)
```typescript
// Jest 환경에서는 항상 기본 설정 사용
const isTestEnvironment = typeof jest !== 'undefined';
if (isTestEnvironment) {
  return DEFAULT_FAQ_CATEGORIES;
}
```

### 브라우저 환경 (Vite)
```typescript
// import.meta.env를 통한 환경변수 접근
const configJson = import.meta?.env?.VITE_FAQ_CATEGORIES_CONFIG;
if (configJson) {
  const customConfig = JSON.parse(configJson);
  return customConfig.categories;
}
```

### 안전한 환경변수 접근
```typescript
// src/shared/utils/env.utils.ts
export const getViteEnv = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return undefined;  // 테스트 환경에서는 건너뛰기
  }
  
  try {
    return eval('import.meta')?.env?.[key];
  } catch (error) {
    return undefined;  // import.meta 미지원 환경 처리
  }
}
```

## 🚀 테스트 실행

### 로컬 실행
```bash
# FAQ 카테고리 테스트만 실행
npx jest src/components/organisms/FAQCategory/FAQCategory.test.tsx

# 상세한 결과와 함께 실행
npx jest src/components/organisms/FAQCategory/FAQCategory.test.tsx --verbose

# 특정 테스트 케이스만 실행
npx jest src/components/organisms/FAQCategory/FAQCategory.test.tsx --testNamePattern="should render exactly 3 categories"
```

### 기대 결과
```
PASS src/components/organisms/FAQCategory/FAQCategory.test.tsx
  FAQCategory Component - TDD Stage 2-1
    Category rendering requirements
      ✓ should render exactly 3 categories
      ✓ should display correct Japanese category names
      ✓ should create 3 default categories with correct structure
    Category click handling
      ✓ should call onCategorySelect with correct category when curriculum is clicked
      ✓ should call onCategorySelect with correct category when schedule is clicked
      ✓ should call onCategorySelect with correct category when pricing is clicked
      ✓ should handle multiple category clicks independently
    Custom categories support
      ✓ should render custom categories when provided

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

## 🔧 설정 변경 테스트

### 카테고리 개수 변경 테스트
1. `.env` 파일에서 `defaultCategoryCount` 변경
2. `categories` 배열에 새 카테고리 추가
3. 브라우저에서 실제 렌더링 확인

### 카테고리 순서 변경 테스트
1. 각 카테고리의 `order` 값 수정
2. UI에서 순서 변경 확인

### 카테고리 비활성화 테스트
1. 특정 카테고리의 `enabled: false` 설정
2. 해당 카테고리가 UI에 표시되지 않음 확인

## 🐛 테스트 실패 시 디버깅 가이드

### 환경변수 관련 오류
1. **JSON 파싱 오류**: `.env` 파일의 JSON 형식 검증
2. **import.meta 오류**: Jest 환경에서 실행 시 정상 (기본 설정 사용)
3. **설정 로딩 실패**: 브라우저 콘솔에서 환경변수 값 확인

### 렌더링 오류
1. **카테고리 개수 불일치**: `defaultCategoryCount`와 실제 활성 카테고리 수 일치 확인
2. **번역키 누락**: `src/locales/ja/common.json`에 해당 번역키 존재 확인
3. **아이콘 오류**: `iconConfig`의 타입과 값 정확성 확인

### 클릭 이벤트 오류
1. **콜백 미호출**: 버튼 요소의 `onClick` 핸들러 확인
2. **잘못된 파라미터**: 전달되는 카테고리 객체 구조 확인
3. **이벤트 버블링**: 중첩된 요소에서의 이벤트 전파 확인

## 🎯 TDD 연관성

이 테스트는 **TDD Red-Green-Refactor 사이클**의 핵심 구현:

1. **🔴 Red**: 테스트 작성 → 실패 확인 (5개 카테고리 → 3개 요구사항 불일치)
2. **🟢 Green**: 설정 기반 시스템 구현으로 테스트 통과
3. **🔵 Refactor**: 환경변수 안전 접근, 코드 구조 개선

### 이전 TDD 단계
- **TDD 1-1**: gradeQuestions 상수 테스트 ✅
- **TDD 1-2**: gradeQuestions 상수 구현 ✅

### 다음 TDD 단계
- **TDD 3-1**: 카테고리 선택 시 질문 표시 테스트
- **TDD 3-2**: 학년별 필터링 기능 구현

## 🔄 브라우저 환경 테스트

### 실시간 설정 확인
브라우저 개발자 도구 콘솔에서:
```javascript
// 환경변수 확인
console.log(import.meta.env.VITE_FAQ_CATEGORIES_CONFIG)

// 현재 설정 확인
import { getFAQCategoriesConfig } from './src/shared/config/faqCategories.config'
console.log(getFAQCategoriesConfig())

// 테스트 실행 (테스트 유틸리티 import 필요)
import { testFAQCategoriesConfig } from './src/shared/config/faqCategories.test-app'
testFAQCategoriesConfig()
```

## 📚 관련 문서
- [이슈 #29: 카테고리 표시 및 학년별 질문 동적 표시 기능 구현](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29)
- [FAQ 카테고리 설정 가이드](/src/shared/config/README.md)
- [학년별 질문 데이터 상수 테스트 가이드](./grade-questions-constants-test.md)
- [TDD 구현 계획 코멘트](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29#issuecomment-3096480208)