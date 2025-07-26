# AI Navi 프론트엔드 문서

## 개요

AI Navi 아웃바운드 CS 314 커뮤니티 프론트엔드 프로젝트의 공식 문서입니다. 이 문서는 프로젝트의 아키텍처, 개발 가이드라인, 도메인 배경 지식을 제공합니다.

## 문서 구조

### 📋 지침 문서 (rule/)
프론트엔드 개발을 위한 가이드라인과 규칙을 정의합니다.

- **[프론트엔드 컴포넌트 패턴](rule/frontend-component-patterns.md)**
  - Atomic Design 기반 컴포넌트 아키텍처
  - 실제 GitHub 이슈 해결 과정의 패턴화
  - TDD 및 Storybook 활용 방법

- **[사용자 경험 가이드라인](rule/user-experience-guidelines.md)**
  - AI 챗봇 UX 특화 가이드라인
  - 학년별 맞춤형 사용자 경험
  - 접근성 및 반응형 디자인

### 🏗️ 아키텍처 결정 기록 (ADR/)
주요 기술적 의사결정과 그 배경을 기록합니다.

- **[ADR-001: React + TypeScript 프론트엔드 아키텍처](ADR/ADR-001-react-typescript-frontend-architecture.md)**
  - 기술 스택 선택 이유와 근거
  - 실제 프로젝트 적용 결과

- **[ADR-002: Atomic Design 컴포넌트 아키텍처](ADR/ADR-002-atomic-design-component-architecture.md)**
  - 컴포넌트 구조화 전략
  - 재사용성과 확장성 고려사항

- **[ADR-003: LLM 응답 처리 전략](ADR/ADR-003-llm-response-handling-strategy.md)**
  - LLM 에러 처리 및 사용자 친화적 메시지
  - 3단계 버블 구조 응답 시스템
  - GitHub 이슈 #41 해결 과정

- **[ADR-004: 학년별 컨텐츠 맞춤화 전략](ADR/ADR-004-grade-based-content-customization.md)**
  - 설정 기반 동적 컨텐츠 시스템
  - 일본 교육 시스템 기반 학년별 차별화
  - GitHub 이슈 #29, #32 해결 과정

- **[ADR-005: 반응형 디자인 전략](ADR/ADR-005-responsive-design-strategy.md)**
  - Mobile-First 반응형 디자인
  - PC/모바일 일관성 확보 방안
  - GitHub 이슈 #44 해결 과정

- **[ADR-006: 메시지 ID 기반 컴포넌트 제어](ADR/ADR-006-message-id-based-component-control.md)**
  - 메시지 ID 기반 컴포넌트 생명주기 관리
  - FAQ 카테고리 중복 표시 문제 해결
  - 기존 CTA 구현 패턴과의 통합

### 📚 도메인 배경 지식 (background_context/)
비즈니스 도메인과 기술적 맥락을 설명합니다.

- **[고객 서비스 워크플로우](background_context/customer-service-workflow.md)**
  - AI Navi 고객 서비스의 전체 플로우
  - 사용자 여정과 시스템 응답 프로세스
  - Notion CS bot MVP 요구사항 반영

- **[학년별 교육 시스템 배경](background_context/grade-based-education-context.md)**
  - 일본 교육 시스템의 학년별 특성
  - 학년별 맞춤화 기능의 이론적 근거
  - 심리적·발달적 특성 고려사항

- **[LLM 통합 배경 및 요구사항](background_context/llm-integration-context.md)**
  - LLM 통합의 비즈니스 필요성
  - 기술적 요구사항과 제약사항
  - 성능 및 품질 기준

- **[기술 아키텍처 개요](background_context/technical-architecture.md)**
  - 전체 시스템 아키텍처
  - MeetA ABCD 개발 원칙 적용
  - 확장성 및 유지보수성 전략

- **[도메인 용어 사전](background_context/domain-glossary.md)**
  - 프로젝트에서 사용되는 핵심 용어
  - 교육 도메인 전문 용어
  - 기술 용어 정의

## 프로젝트 주요 특징

### 🎯 실제 문제 해결 기반
모든 문서는 실제 GitHub 이슈 해결 과정을 바탕으로 작성되었습니다:

- **이슈 #29**: 학년별 동적 질문 표시 → 맞춤화 전략 수립
- **이슈 #32**: 학년 선택 우선순위 → UX 플로우 개선  
- **이슈 #41**: LLM 에러 처리 → 사용자 친화적 에러 시스템
- **이슈 #44**: PC/모바일 일관성 → 반응형 디자인 체계화

### 🎨 Atomic Design 패턴
컴포넌트 기반 아키텍처로 재사용성과 확장성을 확보:

```
atoms/ → molecules/ → organisms/ → templates/
  ↓         ↓           ↓           ↓
Button   ChatBubble   MenuModal  ChatLayout
Icon     InputField   ChatInput  MainLayout
```

### 🏫 교육 도메인 특화
일본 교육 시스템의 특성을 반영한 맞춤형 서비스:

- **중학생**: 기초 학습 및 학습 습관 형성 지원
- **고등학생**: 대학 입시 준비 및 전문 상담
- **보호자**: 자녀 교육 지원 및 정보 제공
- **재수생**: 효과적인 재수 전략 및 멘탈 관리

### 🤖 AI 기반 사용자 경험
LLM을 활용한 지능형 고객 서비스:

- **3단계 버블 응답**: main (핵심) → sub (보충) → cta (행동유도)
- **학년별 맞춤화**: 사용자 특성에 따른 응답 톤 및 내용 조정
- **에러 복구**: 친화적 에러 메시지와 대안 제시

## 문서 활용 가이드

### 👨‍💻 개발자를 위한 가이드
1. **신규 개발자**: ADR-001부터 순서대로 읽어 전체 구조 이해
2. **컴포넌트 개발**: `rule/frontend-component-patterns.md` 참조
3. **UX 구현**: `rule/user-experience-guidelines.md` 참조
4. **아키텍처 이해**: `background_context/technical-architecture.md` 참조

### 🎨 디자이너를 위한 가이드
1. **UX 설계**: `rule/user-experience-guidelines.md`
2. **반응형 디자인**: `ADR/ADR-005-responsive-design-strategy.md`
3. **사용자 플로우**: `background_context/customer-service-workflow.md`

### 📋 기획자를 위한 가이드
1. **도메인 이해**: `background_context/` 폴더 전체
2. **사용자 특성**: `background_context/grade-based-education-context.md`
3. **서비스 플로우**: `background_context/customer-service-workflow.md`

## 문서 업데이트 방침

### 📝 작성 원칙
- **실무 기반**: 실제 코드와 이슈 해결 과정 반영
- **한글 우선**: 팀 접근성을 위한 한글 작성
- **상호 참조**: 문서 간 연결성 확보
- **코드 예시**: 이론과 실제 구현 연결

### 🔄 업데이트 주기
- **ADR**: 주요 기술 결정 시 즉시 업데이트
- **가이드라인**: 새로운 패턴 발견 시 월 1회 업데이트
- **배경 지식**: 도메인 변화 시 분기별 검토

## 참고 자료

### 🌐 외부 리소스
- [MeetA Development Concept (Notion)](https://www.notion.so/23845c9756f8805baf14efeaae60febf)
- [AI Navi Chatbot 답변 생성 정책 (Notion)](https://www.notion.so/23445c9756f8806c944dd386622577c0)
- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 문서](https://tailwindcss.com/)

### 📖 추천 학습 자료
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Testing Library 문서](https://testing-library.com/)
- [Storybook 문서](https://storybook.js.org/)

---

**최종 업데이트**: 2025-07-26  
**작성자**: Frontend Development Team

> 이 문서에 대한 피드백이나 개선 제안은 GitHub 이슈로 등록해주세요.