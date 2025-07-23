# ChatMessage LLM 통합 테스트 가이드

## 📋 개요

`ChatMessage.test.tsx` 파일은 **TDD 단계3**에서 작성된 테스트로, 이슈 #31 "LLM 응답 구조 개선 및 다중 버블 타이핑 애니메이션 구현"의 ChatMessage 컴포넌트 LLM 통합을 검증합니다.

### 📂 파일 위치
```
src/components/organisms/ChatMessage/ChatMessage.test.tsx
src/components/organisms/ChatMessage/ChatMessage.tsx
src/components/organisms/ChatMessage/ChatMessage.stories.tsx
```

### 🎯 테스트 목적
- **완전 통합**: ChatMessage에서 LLM 응답 완전 지원
- **하위 호환성**: 기존 Message 타입 100% 호환
- **아키텍처 일관성**: 기존 디자인 시스템 유지
- **타이핑 제어**: LLM 타이핑 효과 세밀한 제어

## 🏗️ ChatMessage LLM 통합 아키텍처

### 확장된 Props 인터페이스
```typescript
interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  hideAvatar?: boolean;
  // LLM 응답 지원을 위한 추가 props
  llmResponse?: LLMResponse;
  enableLLMTyping?: boolean;
}
```

### 렌더링 로직 분기
```typescript
// LLM 응답이 있으면 LLMResponseGroup 사용
{llmResponse ? (
  <LLMResponseGroup
    response={llmResponse}
    accentColor={accentColor}
    enableTyping={enableLLMTyping && isTyping}
    onComplete={onTypingComplete}
  />
) : (
  <ChatBubble
    content={message.content}
    isBot={true}
    accentColor={accentColor}
    isTyping={isTyping}
    onTypingComplete={onTypingComplete}
  />
)}
```

### 메시지 타입 확장
```typescript
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string | React.ReactNode;
  timestamp: Date;
  error?: boolean;
  llmResponse?: LLMResponse; // 새로 추가된 필드
}
```

## 🧪 테스트 그룹별 세부 내용

### 1️⃣ 기본 메시지 렌더링 (Basic Message Rendering)

#### 🎯 사용자 메시지 렌더링
```typescript
it('사용자 메시지를 올바르게 렌더링해야 한다')
```
- **검증 내용**: `type: 'user'` 메시지 정상 표시
- **하위 호환성**: 기존 사용자 메시지 동작 유지
- **스타일**: 우측 정렬, 사용자 버블 색상

#### 🎯 일반 봇 메시지 렌더링
```typescript
it('봇 메시지를 올바르게 렌더링해야 한다')
```
- **검증 내용**: `type: 'bot'` 메시지 ChatBubble로 렌더링
- **조건**: `llmResponse` 없을 때 기존 방식 사용
- **기능**: 완전한 하위 호환성 보장

#### 🎯 아바타 숨김 기능
```typescript
it('아바타 숨김 옵션이 동작해야 한다')
```
- **검증 내용**: `hideAvatar={true}` 시 UserAvatar 미표시
- **사용 사례**: 연속 봇 메시지에서 아바타 중복 제거
- **UI 일관성**: 기존 디자인 패턴 유지

### 2️⃣ LLM 응답 기능 (LLM Response Features)

#### 🎯 LLM 응답 렌더링
```typescript
it('LLM 응답이 있을 때 LLMResponseGroup을 사용해야 한다')
```
- **검증 내용**: `llmResponse` prop 제공 시 LLMResponseGroup 사용
- **내용 확인**: 모든 버블 텍스트 정상 표시
- **통합 검증**: ChatBubble 대신 LLMResponseGroup 렌더링

#### 🎯 기존 메시지와 LLM 응답 구분
```typescript
it('LLM 응답이 없을 때는 일반 ChatBubble을 사용해야 한다')
```
- **검증 내용**: `llmResponse` 없을 때 기존 ChatBubble 사용
- **메시지 표시**: `message.content` 내용 정상 표시
- **조건부 렌더링**: 올바른 컴포넌트 선택

#### 🎯 LLM 응답 데이터 전달
```typescript
it('LLM 응답 데이터가 올바르게 전달되어야 한다')
```
- **Props 전달**: `response`, `accentColor` 등 정확한 전달
- **데이터 무결성**: LLM 응답 구조 보존
- **참조 일관성**: 객체 참조 유지

### 3️⃣ 타이핑 애니메이션 (Typing Animation)

#### 🎯 LLM 타이핑 애니메이션 활성화
```typescript
it('LLM 응답에서 타이핑 애니메이션이 활성화되어야 한다')
```
- **조건**: `isTyping={true}`, `enableLLMTyping={true}`
- **동작**: 첫 번째 버블만 표시, 나머지 숨김
- **애니메이션**: 순차적 버블 표시 시작

#### 🎯 LLM 타이핑 비활성화
```typescript
it('enableLLMTyping이 false일 때는 타이핑 효과가 비활성화되어야 한다')
```
- **조건**: `enableLLMTyping={false}`
- **동작**: 모든 버블 즉시 표시
- **성능**: 타이핑 애니메이션 오버헤드 제거

#### 🎯 일반 메시지 타이핑
```typescript
it('일반 메시지에서 타이핑 애니메이션이 동작해야 한다')
```
- **검증 내용**: 기존 ChatBubble 타이핑 동작 유지
- **TypewriterText**: 기존 타이핑 컴포넌트 사용
- **호환성**: 기존 타이핑 로직 완전 보존

#### 🎯 타이핑 완료 콜백
```typescript
it('onTypingComplete 콜백이 호출되어야 한다')
```
- **LLM 모드**: LLMResponseGroup 완료 시 콜백 호출
- **일반 모드**: ChatBubble 완료 시 콜백 호출
- **타이밍**: 적절한 시점에 1회만 호출

### 4️⃣ 첨부파일 처리 (Attachment Handling)

#### 🎯 LLM 응답 첨부파일 표시
```typescript
it('LLM 응답의 첨부파일이 올바르게 표시되어야 한다')
```
- **링크 첨부파일**: 제목, URL, 외부 링크 아이콘
- **이미지 첨부파일**: 미리보기, alt 텍스트
- **파일 다운로드**: 다운로드 링크, 파일 정보

#### 🎯 첨부파일 접근성
```typescript
it('첨부파일이 접근성 요구사항을 충족해야 한다')
```
- **alt 속성**: 이미지 대체 텍스트
- **aria-label**: 링크 설명
- **키보드 접근**: 포커스 가능한 요소

### 5️⃣ 접근성 (Accessibility)

#### 🎯 ARIA 속성 설정
```typescript
it('봇 메시지에 적절한 ARIA 속성이 있어야 한다')
```
- **role**: `article` (봇 메시지)
- **aria-label**: "AI 응답 메시지"
- **의미적 구조**: 명확한 메시지 구분

#### 🎯 테스트 식별자
```typescript
it('LLM 응답 버블들에 적절한 data-testid가 설정되어야 한다')
```
- **버블 식별**: `main-bubble`, `sub-bubble`, `cta-bubble`
- **테스트 용이성**: E2E 테스트 지원
- **개발 편의성**: 디버깅 및 검증 도구

## 🎨 디자인 시스템 통합

### 색상 테마 일관성
```typescript
// 기존 테마 시스템 활용
const accentColor = getAccentColor();
const colors = getColorClasses(accentColor);
```

### 반응형 레이아웃
- **최대 너비**: 287px (기존 ChatMessage 규격)
- **모바일 최적화**: 터치 친화적 버튼 크기
- **플렉시블**: 콘텐츠에 따른 높이 자동 조정

### 타이포그래피
- **일관성**: 기존 ChatBubble 폰트 스타일 유지
- **계층 구조**: main > sub > cta 순서로 시각적 중요도
- **가독성**: 적절한 줄 간격 및 여백

## 🚀 테스트 실행

### 로컬 실행
```bash
# ChatMessage 테스트만 실행
npx jest src/components/organisms/ChatMessage/ChatMessage.test.tsx

# 상세한 결과와 함께 실행
npx jest src/components/organisms/ChatMessage/ChatMessage.test.tsx --verbose

# LLM 관련 테스트만 실행
npx jest src/components/organisms/ChatMessage/ChatMessage.test.tsx --testNamePattern="LLM"
```

### 기대 결과
```
PASS src/components/organisms/ChatMessage/ChatMessage.test.tsx
  ChatMessage 컴포넌트
    기본 메시지 렌더링
      ✓ 사용자 메시지를 올바르게 렌더링해야 한다
      ✓ 봇 메시지를 올바르게 렌더링해야 한다
      ✓ 아바타 숨김 옵션이 동작해야 한다
    LLM 응답 기능
      ✓ LLM 응답이 있을 때 LLMResponseGroup을 사용해야 한다
      ✓ LLM 응답이 없을 때는 일반 ChatBubble을 사용해야 한다
      ✓ LLM 응답 데이터가 올바르게 전달되어야 한다
    타이핑 애니메이션
      ✓ LLM 응답에서 타이핑 애니메이션이 활성화되어야 한다
      ✓ enableLLMTyping이 false일 때는 타이핑 효과가 비활성화되어야 한다
      ✓ 일반 메시지에서 타이핑 애니메이션이 동작해야 한다
      ✓ onTypingComplete 콜백이 호출되어야 한다
    첨부파일 처리
      ✓ LLM 응답의 첨부파일이 올바르게 표시되어야 한다
      ✓ 첨부파일이 접근성 요구사항을 충족해야 한다
    접근성
      ✓ 봇 메시지에 적절한 ARIA 속성이 있어야 한다
      ✓ LLM 응답 버블들에 적절한 data-testid가 설정되어야 한다

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
```

## 🔧 테스트 실패 시 디버깅 가이드

### 통합 오류
1. **Props 전달**: llmResponse가 LLMResponseGroup에 정확히 전달되는지 확인
2. **조건부 렌더링**: llmResponse 존재 여부에 따른 분기 로직 검증
3. **타입 검증**: LLMResponse 타입 구조 일치 확인

### 타이핑 애니메이션 오류
1. **상태 전달**: isTyping, enableLLMTyping props 전달 확인
2. **콜백 연결**: onTypingComplete가 올바른 컴포넌트로 전달되는지 검증
3. **타이밍**: 타이핑 시작/완료 시점 정확성 확인

### 스타일링 오류
1. **CSS 클래스**: accentColor에 따른 클래스 적용 확인
2. **레이아웃**: 287px 최대 너비 유지 검증
3. **반응형**: 다양한 화면 크기에서 레이아웃 확인

### 접근성 오류
1. **ARIA 속성**: role, aria-label 설정 누락 확인
2. **키보드 접근**: 포커스 가능한 요소 접근성 테스트
3. **스크린 리더**: 적절한 읽기 순서 확인

## 🎯 TDD 연관성

이 테스트는 **Architecture Driven Development (ADD)** 원칙 적용:

1. **🔴 Red**: 기존 아키텍처에 LLM 통합 요구사항 테스트 → 실패
2. **🟢 Green**: 최소 침습적 변경으로 통합 완성
3. **🔵 Refactor**: 코드 중복 제거, 성능 최적화

### 통합 완성도
- **하위 호환성**: 100% (기존 코드 변경 없음)
- **LLM 지원**: 완전 지원 (모든 기능 활성화)
- **확장성**: 미래 기능 추가 용이한 구조

## 📱 실제 사용 예시

### MainPage에서의 사용
```typescript
// 기존 메시지 (하위 호환)
<ChatMessage 
  message={message} 
  hideAvatar={!isFirstBotMessage}
/>

// LLM 응답 메시지 (새 기능)
<ChatMessage 
  message={message} 
  hideAvatar={!isFirstBotMessage}
  llmResponse={message.llmResponse}
  enableLLMTyping={true}
/>
```

### useChat 훅에서의 상태 관리
```typescript
// 메시지 저장 시 LLM 응답 포함
const botMessage: Message = {
  id: Date.now().toString(),
  type: 'bot',
  content: '', // LLM 응답 시 빈 문자열
  timestamp: new Date(),
  llmResponse: response.llmResponse // LLM 데이터
};
```

## 📚 관련 문서
- [이슈 #31: LLM 응답 구조 개선 및 다중 버블 타이핑 애니메이션 구현](https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/31)
- [LLMResponseGroup 순차 타이핑 테스트 가이드](./llm-response-group-test.md)
- [ChatBubble LLM 확장 테스트 가이드](./chat-bubble-llm-extension-test.md)
- [API 서비스 LLM 응답 처리 테스트 가이드](./api-llm-response-test.md)
- [MainPage LLM 통합 가이드](../MAINPAGE_LLM_INTEGRATION.md)
- [MeetA Development Concept - ADD 원칙](https://www.notion.so/MeetA-Development-Concept-23845c9756f8805baf14efeaae60febf)