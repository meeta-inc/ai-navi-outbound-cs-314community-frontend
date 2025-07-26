# ADR-002: Atomic Design 컴포넌트 아키텍처 채택

## 상태
Accepted

## 맥락
React 컴포넌트의 구조화 및 재사용성을 극대화하기 위한 컴포넌트 아키텍처 패턴을 선택해야 했습니다. 프로젝트의 복잡성이 증가함에 따라 일관된 컴포넌트 설계 원칙이 필요했습니다.

## 고려사항

### Atomic Design Pattern
**장점:**
- 계층적 구조로 컴포넌트 의존성 명확화
- 재사용성 극대화
- Storybook과의 자연스러운 연동
- 디자인 시스템과의 일관성

**단점:**
- 초기 학습 곡선
- 작은 프로젝트에서는 과도한 추상화 가능성

### Feature-based Architecture
**장점:**
- 기능별 응집도 높음
- 개발자가 이해하기 쉬움

**단점:**
- 컴포넌트 재사용성 제한
- 일관성 유지 어려움

### Flat Structure
**장점:**
- 단순한 구조
- 빠른 초기 개발

**단점:**
- 확장성 부족
- 유지보수 어려움

## 결정
Atomic Design Pattern을 채택하여 다음과 같이 컴포넌트를 구조화합니다:

```
src/components/
├── atoms/          # 기본 UI 요소 (Button, Icon, Typography)
├── molecules/      # atoms 조합 (ChatBubble, InputField, UserAvatar)
├── organisms/      # molecules 조합 (ChatInput, NavigationHeader, MenuModal)
└── templates/      # 페이지 레이아웃 (ChatLayout)
```

### 구현 원칙
1. **Atoms**: 최소 단위 컴포넌트, 다른 컴포넌트에 의존하지 않음
2. **Molecules**: 2개 이상의 atoms로 구성, 단일 기능 수행
3. **Organisms**: molecules와 atoms로 구성, 복잡한 기능 수행
4. **Templates**: organisms를 배치하는 레이아웃 컴포넌트

## 결과

### 긍정적 결과
- 컴포넌트 재사용성 대폭 향상
- Storybook을 통한 각 계층별 독립적 테스트 가능
- 일관된 디자인 시스템 구축
- 새로운 팀 구성원의 코드 이해도 향상
- 컴포넌트별 책임 분리 명확화

### 주의사항
- 초기 컴포넌트 분류에 대한 팀 내 합의 필요
- 과도한 추상화 지양 (YAGNI 원칙 준수)
- 컴포넌트 간 순환 의존성 방지

### 실제 적용 사례
- `Button` (atoms) → `CTAButtons` (molecules) → `ChatInput` (organisms)
- `Icon` (atoms) → `ChatBubble` (molecules) → `ChatMessage` (organisms)
- `Typography` (atoms) → `UserAvatar` (molecules) → `NavigationHeader` (organisms)

## 날짜
2024-01-15

## 작성자
Frontend Development Team