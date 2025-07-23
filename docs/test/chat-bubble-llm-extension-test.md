# ChatBubble LLM 확장 테스트 가이드

## 📋 개요

`ChatBubble.test.tsx` 파일은 **TDD 단계1**에서 작성된 테스트로, 이슈 #31 "LLM 응답 구조 개선 및 다중 버블 타이핑 애니메이션 구현"의 핵심 ChatBubble 컴포넌트 확장을 검증합니다.

### 📂 파일 위치
```
src/components/molecules/ChatBubble/ChatBubble.test.tsx
src/components/molecules/ChatBubble/ChatBubble.tsx
src/types/index.ts (LLM 응답 타입 정의)
```

### 🎯 테스트 목적
- **하위 호환성**: 기존 ChatBubble 기능 유지 보장
- **LLM 지원 확장**: 새로운 버블 타입 및 첨부파일 지원 검증
- **타이핑 애니메이션**: 새로운 LLM 응답 타이핑 효과 확인
- **접근성**: ARIA 속성 및 접근성 준수 검증

## 📊 LLM 응답 구조

### BubbleResponse 타입
```typescript
interface BubbleResponse {
  type: 'main' | 'sub' | 'cta';
  text: string;
  attachment?: AttachmentData | null;
}
```

### 버블 타입별 특성
| 타입 | 설명 | 최대 길이 | 스타일 |
|------|------|-----------|--------|
| `main` | 주요 응답 | 150자 | 기본 봇 버블 |
| `sub` | 보조 설명 | 무제한 | 연한 배경 |
| `cta` | 행동 유도 | 무제한 | 강조 스타일 |

### AttachmentData 구조
```typescript
interface AttachmentData {
  type: 'link' | 'image' | 'video' | 'file';
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}
```

## 🧪 테스트 그룹별 세부 내용

### 1️⃣ 기본 기능 유지 (Backward Compatibility)

#### 🎯 기본 봇 메시지 렌더링
```typescript
it('should render bot message correctly')
```
- **검증 내용**: 기존 `isBot=true` 메시지가 정상 렌더링
- **확인 요소**: 텍스트 표시, 기본 스타일 적용
- **하위 호환성**: 기존 코드 변경 없이 동작

#### 🎯 사용자 메시지 렌더링
```typescript
it('should render user message correctly')
```
- **검증 내용**: `isBot=false` 사용자 메시지 정상 표시
- **스타일**: 우측 정렬, 사용자 색상 적용
- **기능 유지**: 기존 동작 100% 호환

#### 🎯 타이핑 애니메이션 기본 동작
```typescript
it('should handle typing animation')
```
- **검증 내용**: `isTyping=true` 시 TypewriterText 컴포넌트 사용
- **콜백**: `onTypingComplete` 호출 확인
- **기존 기능**: 완전 호환 보장

### 2️⃣ LLM 버블 타입 지원 (LLM Bubble Types)

#### 🎯 Main 버블 스타일링
```typescript
it('should render main type bubble with correct styling')
```
- **검증 내용**: `bubbleType='main'` 시 기본 봇 스타일 적용
- **텍스트 제한**: 150자 초과 시 "..." 표시
- **data-testid**: `main-bubble` 설정

#### 🎯 Sub 버블 스타일링
```typescript
it('should render sub type bubble with correct styling')
```
- **스타일**: 연한 배경색, 작은 폰트 크기
- **위치**: main 버블 하단 배치
- **data-testid**: `sub-bubble` 설정

#### 🎯 CTA 버블 스타일링
```typescript
it('should render cta type bubble with correct styling')
```
- **스타일**: 강조 배경색, 포인터 커서
- **클릭**: 버튼 형태로 동작
- **data-testid**: `cta-bubble` 설정

#### 🎯 텍스트 길이 제한 처리
```typescript
it('should truncate main bubble text if it exceeds 150 characters')
```
- **main 타입**: 150자 초과 시 잘라내기 + "..." 추가
- **sub/cta 타입**: 길이 제한 없음
- **정확성**: 정확히 150자에서 절단

### 3️⃣ 첨부파일 지원 (Attachment Support)

#### 🎯 링크 첨부파일 렌더링
```typescript
it('should render link attachment correctly')
```
- **구성**: 제목, 설명, 외부 링크 아이콘
- **동작**: 클릭 시 새 탭에서 열기 (`target="_blank"`)
- **보안**: `rel="noopener noreferrer"` 속성

#### 🎯 이미지 첨부파일 렌더링
```typescript
it('should render image attachment correctly')
```
- **표시**: 이미지 미리보기, 제목/설명
- **alt 속성**: 접근성을 위한 대체 텍스트
- **크기**: 최대 너비 제한

#### 🎯 비디오 첨부파일 렌더링
```typescript
it('should render video attachment correctly')
```
- **썸네일**: 비디오 썸네일 이미지 표시
- **플레이 버튼**: 재생 아이콘 오버레이
- **메타데이터**: 제목, 설명 표시

#### 🎯 파일 첨부파일 렌더링
```typescript
it('should render file attachment correctly')
```
- **아이콘**: 파일 타입별 아이콘 표시
- **정보**: 파일명, 크기, 다운로드 링크
- **다운로드**: 클릭 시 파일 다운로드

### 4️⃣ 접근성 및 품질 (Accessibility & Quality)

#### 🎯 ARIA 속성 설정
```typescript
it('should have correct ARIA attributes')
```
- **role**: `article` (봇 메시지)
- **aria-label**: "AI 응답 메시지" (봇), "사용자 메시지" (사용자)
- **키보드 접근**: CTA 버블 포커스 가능

#### 🎯 테스트 식별자 설정
```typescript
it('should have proper data-testids for testing')
```
- **버블**: `bubble-text`, `{type}-bubble`
- **첨부파일**: `attachment-{type}`
- **타이핑**: `typing-text`

#### 🎯 조건부 렌더링
```typescript
it('should conditionally render elements based on props')
```
- **첨부파일**: attachment가 있을 때만 렌더링
- **타이핑**: isTyping=true일 때만 애니메이션
- **버블 타입**: bubbleType에 따른 스타일 변경

## 🎨 스타일 및 레이아웃

### CSS 클래스 구조
```css
/* 기본 버블 스타일 */
.chat-bubble-base
.chat-bubble-bot (봇 메시지)
.chat-bubble-user (사용자 메시지)

/* LLM 버블 타입별 스타일 */
.bubble-main (main 타입)
.bubble-sub (sub 타입)  
.bubble-cta (cta 타입)

/* 첨부파일 스타일 */
.attachment-container
.attachment-link
.attachment-image
.attachment-video
.attachment-file
```

### 반응형 지원
- **최대 너비**: 287px (기존 유지)
- **모바일**: 스타일 자동 조정
- **첨부파일**: 컨테이너 너비에 맞춤

## 🚀 테스트 실행

### 로컬 실행
```bash
# ChatBubble 테스트만 실행
npx jest src/components/molecules/ChatBubble/ChatBubble.test.tsx

# 상세한 결과와 함께 실행
npx jest src/components/molecules/ChatBubble/ChatBubble.test.tsx --verbose

# 특정 테스트 그룹만 실행
npx jest src/components/molecules/ChatBubble/ChatBubble.test.tsx --testNamePattern="LLM bubble types"
```

### 기대 결과
```
PASS src/components/molecules/ChatBubble/ChatBubble.test.tsx
  ChatBubble 컴포넌트
    기본 기능 유지
      ✓ should render bot message correctly
      ✓ should render user message correctly  
      ✓ should handle typing animation
    LLM 버블 타입 지원
      ✓ should render main type bubble with correct styling
      ✓ should render sub type bubble with correct styling
      ✓ should render cta type bubble with correct styling
      ✓ should truncate main bubble text if it exceeds 150 characters
    첨부파일 지원
      ✓ should render link attachment correctly
      ✓ should render image attachment correctly
      ✓ should render video attachment correctly
      ✓ should render file attachment correctly
    접근성 및 품질
      ✓ should have correct ARIA attributes
      ✓ should have proper data-testids for testing
      ✓ should conditionally render elements based on props

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

## 🔧 테스트 실패 시 디버깅 가이드

### 스타일링 오류
1. **버블 타입 스타일**: CSS 클래스명 정확성 확인
2. **텍스트 길이**: 150자 제한 로직 검증
3. **반응형**: 최대 너비 287px 유지 확인

### 첨부파일 오류
1. **타입별 렌더링**: attachment.type에 따른 조건부 렌더링
2. **URL 검증**: 첨부파일 URL 형식 확인
3. **보안 속성**: 외부 링크 보안 속성 설정

### 접근성 오류
1. **ARIA 속성**: role, aria-label 설정 확인
2. **키보드 접근**: CTA 버블 포커스 가능 여부
3. **alt 텍스트**: 이미지 대체 텍스트 설정

### 타이핑 애니메이션 오류
1. **TypewriterText**: 컴포넌트 import 확인
2. **콜백 호출**: onTypingComplete 함수 실행 여부
3. **조건부 렌더링**: isTyping props에 따른 분기

## 🎯 TDD 연관성

이 테스트는 **TDD Red-Green-Refactor 사이클**의 Red 단계에서 작성:

1. **🔴 Red**: 테스트 작성 → 실패 확인 (LLM 기능 미구현)
2. **🟢 Green**: 최소 구현으로 테스트 통과 (버블 타입, 첨부파일 지원)
3. **🔵 Refactor**: 코드 구조 개선, 성능 최적화

### 연관 TDD 단계
- **다음 단계**: LLMResponseGroup 컴포넌트 테스트 및 구현
- **통합 단계**: ChatMessage 컴포넌트에 LLM 지원 추가

## 📚 관련 문서
- [이슈 #31: LLM 응답 구조 개선 및 다중 버블 타이핑 애니메이션 구현](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/31)
- [LLMResponseGroup 테스트 가이드](./llm-response-group-test.md)
- [ChatMessage LLM 통합 테스트 가이드](./chat-message-llm-integration-test.md)
- [MeetA Development Concept](https://www.notion.so/MeetA-Development-Concept-23845c9756f8805baf14efeaae60febf)