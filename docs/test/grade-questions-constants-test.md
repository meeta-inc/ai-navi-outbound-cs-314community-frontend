# 학년별 질문 데이터 상수 테스트 가이드

## 📋 개요

`gradeQuestions.constants.test.ts` 파일은 **TDD 단계1-1**에서 작성된 테스트로, 이슈 #29 "카테고리 표시 및 학년별 질문 동적 표시 기능 구현"의 핵심 데이터 구조를 검증합니다.

### 📂 파일 위치
```
src/shared/constants/gradeQuestions.constants.test.ts
src/shared/constants/gradeQuestions.constants.ts
```

### 🎯 테스트 목적
- **데이터 구조 무결성**: 학년별 카테고리 질문 데이터의 올바른 구조 보장
- **콘텐츠 품질 검증**: 질문 내용과 메타데이터의 정확성 확인  
- **요구사항 준수**: 이슈 #29 명세서 요구사항 충족 여부 검증

## 📊 테스트 데이터 구조

### 학년 (GradeType)
| 타입 | 한국어 | 일본어 | 설명 |
|------|--------|--------|------|
| `preschool` | 유아 | 幼児 | 취학 전 아동 |
| `elementary` | 초등학생 | 小学生 | 초등학교 학생 |
| `middle` | 중학생 | 中学生 | 중학교 학생 |
| `high` | 고등학생 | 高校生 | 고등학교 학생 |

### 카테고리 (CategoryType)
| 타입 | 일본어 | 한국어 | 설명 |
|------|--------|--------|------|
| `curriculum` | 授業・カリキュラム | 수업·커리큘럼 | 교육과정 관련 |
| `schedule` | 通塾・学習時間 | 통학·학습시간 | 시간표 관련 |
| `pricing` | 料金・制度 | 요금·제도 | 비용 관련 |

### 질문 객체 구조 (Question)
```typescript
interface Question {
  id: string;      // 고유 식별자 (예: "high-curriculum-1")
  text: string;    // 질문 텍스트 (일본어)
  isBest: boolean; // 추천 질문 여부
}
```

## 🧪 테스트 그룹별 세부 내용

### 1️⃣ 데이터 구조 검증 (Data Structure Validation)

#### 🎯 모든 학년 타입 정의 검증
```typescript
it('should have all grade types defined')
```
- **검증 내용**: 4개 학년 키가 모두 존재하는지 확인
- **기대값**: `preschool`, `elementary`, `middle`, `high` 키 존재
- **실패 시나리오**: 학년 키 누락

#### 🎯 카테고리 개수 검증  
```typescript
it('should have exactly 3 categories for each grade')
```
- **검증 내용**: 각 학년별로 정확히 3개 카테고리 존재
- **기대값**: `curriculum`, `schedule`, `pricing` 카테고리
- **이슈 연관**: #29 요구사항 "모든 학년에 대해 공통적으로 3개 카테고리만 표시"

#### 🎯 질문 개수 검증
```typescript
it('should have exactly 5 questions for each category in each grade')
```
- **검증 내용**: 각 카테고리별로 정확히 5개 질문 존재
- **총 질문 수**: 4학년 × 3카테고리 × 5질문 = **60개 질문**
- **실패 시나리오**: 질문 수 부족 또는 과다

#### 🎯 질문 객체 구조 검증
```typescript
it('should have valid question structure for all questions')
```
- **검증 속성**: 
  - `id`: string (비어있지 않음)
  - `text`: string (비어있지 않음)  
  - `isBest`: boolean
- **실패 시나리오**: 필수 속성 누락, 잘못된 타입

### 2️⃣ 콘텐츠 검증 (Content Validation)

#### 🎯 일본어 카테고리명 검증
```typescript
it('should have category names in Japanese')
```
- **검증 내용**: 정확한 일본어 카테고리명 사용
- **기대값**:
  ```typescript
  {
    curriculum: '授業・カリキュラム',
    schedule: '通塾・学習時間', 
    pricing: '料金・制度'
  }
  ```

#### 🎯 질문 ID 고유성 검증
```typescript
it('should have unique question IDs across all grades and categories')
```
- **검증 내용**: 60개 모든 질문의 ID가 중복되지 않음
- **ID 형식**: `"grade-category-number"` (예: `"high-curriculum-1"`)
- **실패 시나리오**: ID 중복, 형식 불일치

#### 🎯 베스트 질문 개수 검증
```typescript
it('should have at least one best question per category for each grade')
```
- **검증 범위**: 각 카테고리마다 1-3개 베스트 질문 (`isBest: true`)
- **UI 활용**: 사용자에게 우선 추천할 질문 선별
- **실패 시나리오**: 베스트 질문 없음, 과다한 베스트 질문

### 3️⃣ 학년별 특화 콘텐츠 검증 (Specific Grade Content)

#### 🎯 고등학생 특화 질문
```typescript
it('should have high school specific questions')
```
- **필수 포함 질문**:
  - `"大学受験対策はどの科목に対応していますか？"` (대학수험 과목 대응)
  - `"難関大学向けの指導はありますか？"` (난관대학 지도)

#### 🎯 중학생 특화 질문
```typescript
it('should have middle school specific questions')
```
- **필수 포함 질문**:
  - `"定期テスト対策はしてもらえますか？"` (정기시험 대책)
  - `"高校受験対策はいつから始めるべきですか？"` (고교수험 시작시기)

#### 🎯 초등학생 특화 질문
```typescript
it('should have elementary school specific questions')
```
- **필수 포함 질문**:
  - `"中学受験コースはありますか？"` (중학수험 코스)
  - `"小学校の授業に合わせた指導ですか？"` (초등교과과정 맞춤 지도)

#### 🎯 유아 특화 질문
```typescript
it('should have preschool specific questions')
```
- **필수 포함 질문**:
  - `"何歳から通えますか？"` (입학 연령)
  - `"小学校受験に対応していますか？"` (초등수험 대응)

## 🚀 테스트 실행

### 로컬 실행
```bash
# Jest를 직접 실행
npx jest src/shared/constants/gradeQuestions.constants.test.ts

# 상세한 결과와 함께 실행  
npx jest src/shared/constants/gradeQuestions.constants.test.ts --verbose
```

### 기대 결과
```
PASS src/shared/constants/gradeQuestions.constants.test.ts
  GRADE_CATEGORY_QUESTIONS
    Data structure validation
      ✓ should have all grade types defined
      ✓ should have exactly 3 categories for each grade
      ✓ should have exactly 5 questions for each category in each grade
      ✓ should have valid question structure for all questions
    Content validation
      ✓ should have category names in Japanese
      ✓ should have unique question IDs across all grades and categories
      ✓ should have at least one best question per category for each grade
    Specific grade content
      ✓ should have high school specific questions
      ✓ should have middle school specific questions
      ✓ should have elementary school specific questions
      ✓ should have preschool specific questions

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

## 🔧 테스트 실패 시 디버깅 가이드

### 데이터 구조 오류
1. **학년 키 누락**: `GRADE_CATEGORY_QUESTIONS` 객체에 4개 학년 키 모두 추가
2. **카테고리 누락**: 각 학년별로 3개 카테고리 모두 정의
3. **질문 수 부족**: 각 카테고리당 정확히 5개 질문 추가

### 콘텐츠 오류  
1. **카테고리명 오타**: 일본어 표기 정확성 재확인
2. **ID 중복**: 질문 ID 형식 `grade-category-number` 준수
3. **베스트 질문 부족**: 각 카테고리마다 최소 1개 `isBest: true` 설정

### 특화 질문 누락
1. **필수 질문 확인**: 각 학년별 명세서 필수 질문 포함 여부 재확인
2. **텍스트 정확성**: 일본어 질문 텍스트 오타 검사

## 🎯 TDD 연관성

이 테스트는 **TDD Red-Green-Refactor 사이클**의 Red 단계에서 작성되어:

1. **🔴 Red**: 테스트 작성 → 실패 확인 (상수 파일 부재)
2. **🟢 Green**: 최소 구현으로 테스트 통과 (상수 파일 생성)  
3. **🔵 Refactor**: 코드 개선 (현재는 불필요)

### 다음 TDD 단계
- **TDD 2-1**: FAQCategory 컴포넌트 테스트 작성
- **TDD 2-2**: FAQCategory 컴포넌트 구현

## 📚 관련 문서
- [이슈 #29: 카테고리 표시 및 학년별 질문 동적 표시 기능 구현](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29)
- [TDD 구현 계획 코멘트](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29#issuecomment-3096480208)