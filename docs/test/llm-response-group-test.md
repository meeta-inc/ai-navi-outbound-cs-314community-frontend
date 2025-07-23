# LLMResponseGroup 순차 타이핑 테스트 가이드

## 📋 개요

`LLMResponseGroup.test.tsx` 파일은 **TDD 단계2**에서 작성된 테스트로, 이슈 #31 "LLM 응답 구조 개선 및 다중 버블 타이핑 애니메이션 구현"의 핵심인 다중 버블 순차 타이핑 애니메이션을 검증합니다.

### 📂 파일 위치
```
src/components/organisms/LLMResponseGroup/LLMResponseGroup.test.tsx
src/components/organisms/LLMResponseGroup/LLMResponseGroup.tsx
src/components/organisms/LLMResponseGroup/LLMResponseGroup.stories.tsx
```

### 🎯 테스트 목적
- **순차 표시**: 다중 버블의 순차적 타이핑 애니메이션 검증
- **상태 관리**: 현재 활성 버블 및 완료 상태 추적
- **사용자 경험**: 자연스러운 대화 흐름 구현
- **성능**: 효율적인 타이핑 애니메이션 구현

## 🏗️ LLMResponseGroup 구조

### 컴포넌트 Props
```typescript
interface LLMResponseGroupProps {
  response: LLMResponse;
  accentColor: AccentColor;
  enableTyping?: boolean;
  onComplete?: () => void;
}

interface LLMResponse {
  response: BubbleResponse[];
  tool?: string | null;
}
```

### 순차 표시 로직
1. **초기 상태**: 첫 번째 버블만 표시
2. **타이핑 중**: 현재 버블 타이핑 애니메이션
3. **다음 버블**: 현재 완료 후 다음 버블 표시
4. **전체 완료**: 모든 버블 표시 완료

## 🧪 테스트 그룹별 세부 내용

### 1️⃣ 기본 렌더링 (Basic Rendering)

#### 🎯 단일 버블 렌더링
```typescript
it('should render single bubble response')
```
- **검증 내용**: 1개 버블 응답 정상 렌더링
- **확인 요소**: 버블 표시, 올바른 타입 설정
- **단순 케이스**: 복잡한 순차 로직 없이 기본 동작

#### 🎯 다중 버블 구조 생성
```typescript
it('should render multiple bubbles structure')
```
- **검증 내용**: 3개 버블 (main, sub, cta) 구조 생성
- **DOM 구조**: 각 버블의 컨테이너 및 순서 확인
- **접근성**: 적절한 role 및 aria 속성

#### 🎯 버블 타입별 차별화
```typescript
it('should render different bubble types correctly')
```
- **main 버블**: 기본 봇 스타일, 150자 제한
- **sub 버블**: 연한 배경, 보조 정보 스타일
- **cta 버블**: 강조 스타일, 클릭 가능

### 2️⃣ 순차 타이핑 애니메이션 (Sequential Typing)

#### 🎯 타이핑 비활성화 모드
```typescript
it('should show all bubbles immediately when typing is disabled')
```
- **조건**: `enableTyping={false}`
- **동작**: 모든 버블 즉시 표시
- **용도**: 정적 표시, 성능 최적화 모드

#### 🎯 순차 타이핑 활성화 모드
```typescript
it('should show only first bubble initially when typing is enabled')
```
- **초기 상태**: 첫 번째 버블만 표시
- **숨김 처리**: 나머지 버블은 DOM에 없음
- **준비 상태**: 첫 번째 버블 타이핑 시작

#### 🎯 첫 번째 버블 타이핑 완료 처리
```typescript
it('should show second bubble after first bubble typing completes')
```
- **시뮬레이션**: 첫 번째 버블 타이핑 완료 이벤트
- **상태 변경**: 두 번째 버블 표시
- **연속성**: 자연스러운 흐름 유지

#### 🎯 전체 타이핑 완료 콜백
```typescript
it('should call onComplete when all bubbles are done typing')
```
- **조건**: 모든 버블 타이핑 완료
- **콜백**: `onComplete` 함수 1회 호출
- **타이밍**: 마지막 버블 완료 직후

### 3️⃣ 첨부파일 통합 (Attachment Integration)

#### 🎯 첨부파일 포함 버블 렌더링
```typescript
it('should render bubbles with attachments correctly')
```
- **검증 내용**: 첨부파일이 있는 버블 정상 표시
- **첨부파일 타입**: link, image, video, file 모두 지원
- **레이아웃**: 버블과 첨부파일 올바른 배치

#### 🎯 순차 타이핑 중 첨부파일 처리
```typescript
it('should handle attachments during sequential typing')
```
- **타이밍**: 버블 타이핑 완료 후 첨부파일 표시
- **애니메이션**: 부드러운 첨부파일 등장 효과
- **접근성**: 스크린 리더 호환

### 4️⃣ 에러 처리 및 엣지 케이스 (Error Handling)

#### 🎯 빈 응답 처리
```typescript
it('should handle empty response array')
```
- **조건**: `response.response = []`
- **동작**: 빈 상태 또는 오류 메시지 표시
- **안전성**: 앱 크래시 방지

#### 🎯 잘못된 버블 타입 처리
```typescript
it('should handle invalid bubble types gracefully')
```
- **조건**: 알 수 없는 `type` 값
- **동작**: 기본 타입으로 폴백
- **로깅**: 개발 모드에서 경고 메시지

#### 🎯 긴 텍스트 처리
```typescript
it('should handle very long text content')
```
- **main 버블**: 150자 초과 시 자동 절단
- **sub/cta 버블**: 길이 제한 없이 렌더링
- **레이아웃**: 컨테이너 오버플로우 방지

## 🎬 타이핑 애니메이션 세부사항

### 타이밍 제어
```typescript
// 버블 간 지연 시간
const BUBBLE_DELAY = 500; // ms

// 타이핑 속도 설정
const TYPING_SPEED = 50; // ms per character
```

### 상태 관리
```typescript
interface TypingState {
  currentBubbleIndex: number;
  completedBubbles: Set<number>;
  isTypingComplete: boolean;
}
```

### 애니메이션 흐름
1. **시작**: 첫 번째 버블 타이핑 시작
2. **진행**: 글자별 순차 표시
3. **완료**: 다음 버블로 전환 (500ms 지연)
4. **반복**: 모든 버블 완료까지
5. **종료**: onComplete 콜백 호출

## 🚀 테스트 실행

### 로컬 실행
```bash
# LLMResponseGroup 테스트만 실행
npx jest src/components/organisms/LLMResponseGroup/LLMResponseGroup.test.tsx

# 상세한 결과와 함께 실행
npx jest src/components/organisms/LLMResponseGroup/LLMResponseGroup.test.tsx --verbose

# 타이핑 관련 테스트만 실행  
npx jest src/components/organisms/LLMResponseGroup/LLMResponseGroup.test.tsx --testNamePattern="typing"
```

### 기대 결과
```
PASS src/components/organisms/LLMResponseGroup/LLMResponseGroup.test.tsx
  LLMResponseGroup 컴포넌트
    기본 렌더링
      ✓ should render single bubble response
      ✓ should render multiple bubbles structure
      ✓ should render different bubble types correctly
    순차 타이핑 애니메이션
      ✓ should show all bubbles immediately when typing is disabled
      ✓ should show only first bubble initially when typing is enabled
      ✓ should show second bubble after first bubble typing completes
      ✓ should call onComplete when all bubbles are done typing
    첨부파일 통합
      ✓ should render bubbles with attachments correctly
      ✓ should handle attachments during sequential typing
    에러 처리 및 엣지 케이스
      ✓ should handle empty response array
      ✓ should handle invalid bubble types gracefully
      ✓ should handle very long text content

Test Suites: 1 passed, 1 total  
Tests:       12 passed, 12 total
```

## 🎨 Storybook 통합

### 스토리 구성
```typescript
// 기본 스토리
export const Default = {
  args: {
    response: mockLLMResponse,
    accentColor: 'orange',
    enableTyping: false
  }
};

// 타이핑 애니메이션 스토리
export const WithTyping = {
  args: {
    ...Default.args,
    enableTyping: true
  }
};

// 첨부파일 포함 스토리
export const WithAttachments = {
  args: {
    response: mockLLMResponseWithAttachments,
    accentColor: 'orange',
    enableTyping: true
  }
};
```

### 인터랙티브 테스트
- **Controls**: 실시간 props 변경
- **Actions**: onComplete 콜백 로깅
- **Viewport**: 반응형 테스트

## 🔧 테스트 실패 시 디버깅 가이드

### 순차 타이핑 오류
1. **상태 관리**: `currentBubbleIndex` 증가 로직 확인
2. **타이밍**: setTimeout 지연 시간 설정 검증
3. **이벤트**: 타이핑 완료 이벤트 전파 확인

### 렌더링 오류
1. **조건부 렌더링**: enableTyping에 따른 표시 로직
2. **DOM 구조**: 각 버블의 올바른 컨테이너 배치
3. **CSS 클래스**: 버블 타입별 스타일 적용

### 첨부파일 오류
1. **타입 검증**: attachment.type 유효성 확인
2. **URL 형식**: 첨부파일 URL 포맷 검증
3. **렌더링 순서**: 버블 → 첨부파일 순서 확인

### 성능 문제
1. **메모리 누수**: setTimeout 정리 확인
2. **리렌더링**: 불필요한 상태 업데이트 최소화
3. **DOM 조작**: 효율적인 조건부 렌더링

## 🎯 TDD 연관성

이 테스트는 **Component Driven Development (CDD)** 원칙 적용:

1. **🔴 Red**: 순차 타이핑 요구사항 테스트 작성 → 실패
2. **🟢 Green**: 최소 구현으로 테스트 통과
3. **🔵 Refactor**: 성능 최적화, 코드 구조 개선

### 이전/다음 단계
- **이전**: ChatBubble LLM 확장 테스트 ✅
- **현재**: LLMResponseGroup 순차 타이핑 ✅
- **다음**: ChatMessage LLM 통합 테스트

## 📚 관련 문서
- [이슈 #31: LLM 응답 구조 개선 및 다중 버블 타이핑 애니메이션 구현](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/31)
- [ChatBubble LLM 확장 테스트 가이드](./chat-bubble-llm-extension-test.md)
- [ChatMessage LLM 통합 테스트 가이드](./chat-message-llm-integration-test.md)
- [API 서비스 LLM 응답 처리 테스트 가이드](./api-llm-response-test.md)
- [MeetA Development Concept - CDD 원칙](https://www.notion.so/MeetA-Development-Concept-23845c9756f8805baf14efeaae60febf)