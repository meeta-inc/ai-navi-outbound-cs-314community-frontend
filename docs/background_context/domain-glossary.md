# 도메인 용어 사전

AI Navi 아웃바운드 CS 314 커뮤니티 프론트엔드 프로젝트에서 사용되는 주요 도메인 용어들을 정의합니다.

## A

### AI Navi
- **정의**: AI 기반 고객 서비스 플랫폼의 브랜드명
- **설명**: 고객이 AI와 자연스럽게 대화하며 문제를 해결할 수 있도록 안내하는 서비스

### Atomic Design
- **정의**: 컴포넌트를 atoms, molecules, organisms, templates 계층으로 구조화하는 설계 방법론
- **적용**: src/components 디렉토리 구조화에 사용

### Accent Color
- **정의**: 브랜드 아이덴티티를 나타내는 강조 색상
- **예시**: orange, blue, green 등 테마별 색상

## B

### Bubble Response
- **정의**: LLM이 생성한 응답을 여러 개의 말풍선으로 나누어 표시하는 형태
- **타입**: main, sub, cta로 구분

### Background Context
- **정의**: 프로젝트의 비즈니스 맥락과 도메인 지식을 문서화한 자료
- **목적**: 팀 구성원의 이해도 향상 및 온보딩 지원

## C

### ChatBot Widget
- **정의**: 웹사이트에 임베드되어 채팅 기능을 제공하는 독립적인 컴포넌트
- **특징**: 스크립트 삽입만으로 간단히 적용 가능

### CTA (Call To Action)
- **정의**: 사용자의 특정 행동을 유도하는 버튼이나 링크
- **예시**: "문의하기", "자세히 보기" 등

### CS (Customer Service)
- **정의**: 고객 서비스, 고객 지원
- **범위**: 문의 응답, 문제 해결, 상담 등 고객 관련 모든 서비스

## D

### Dynamic Configuration
- **정의**: 런타임에 설정값을 변경할 수 있는 동적 구성 방식
- **적용**: 메뉴 구성, FAQ 카테고리, 테마 설정 등

## F

### FAQ (Frequently Asked Questions)
- **정의**: 자주 묻는 질문과 답변
- **구조**: 카테고리별로 분류되어 관리됨

### Frontend
- **정의**: 사용자가 직접 상호작용하는 클라이언트 사이드 애플리케이션
- **기술스택**: React + TypeScript + Tailwind CSS

## G

### Grade Selection
- **정의**: 사용자의 학년 또는 수준을 선택하는 기능
- **목적**: 사용자 맞춤형 질문 및 응답 제공

### Gradient
- **정의**: 색상이 점진적으로 변화하는 그래픽 효과
- **적용**: 버튼, 배경 등 UI 요소에 시각적 효과 제공

## I

### Integration
- **정의**: 다른 시스템 또는 서비스와의 연동
- **예시**: LLM API 연동, 인증 시스템 연동 등

## J

### JWE (JSON Web Encryption)
- **정의**: JSON 데이터를 암호화하는 표준
- **용도**: 민감한 사용자 정보 보호

## L

### LLM (Large Language Model)
- **정의**: 대규모 언어 모델, AI 기반 자연어 처리 모델
- **역할**: 사용자 질문 이해 및 자연스러운 응답 생성

### LLM Response
- **정의**: LLM이 생성한 응답 데이터
- **구조**: response 배열, tool 정보, status 코드 포함

### Locale
- **정의**: 지역/언어 설정
- **지원 언어**: 일본어(ja), 한국어(ko), 영어(en)

## M

### MenuModal
- **정의**: 하단에서 올라오는 메뉴 선택 모달
- **특징**: 모바일 친화적 인터페이스, PC에서는 고정 너비

### Molecule
- **정의**: Atomic Design에서 atoms를 조합한 단위
- **예시**: ChatBubble, InputField, UserAvatar

## O

### Organism
- **정의**: Atomic Design에서 molecules와 atoms를 조합한 복잡한 컴포넌트
- **예시**: ChatInput, NavigationHeader, MenuModal

### Outbound CS
- **정의**: 능동적으로 고객에게 먼저 접근하는 고객 서비스
- **특징**: 프로모션, 안내사항 전달, 사전 예방적 지원

## Q

### Quick Reply
- **정의**: 빠른 응답을 위한 미리 정의된 선택지
- **용도**: 사용자 편의성 향상 및 정확한 의도 파악

## R

### Responsive Design
- **정의**: 다양한 화면 크기에 자동으로 적응하는 웹 디자인
- **구현**: Tailwind CSS의 반응형 클래스 활용

### Real-time
- **정의**: 실시간 처리 및 응답
- **기술**: WebSocket, Server-Sent Events 등

## S

### Storybook
- **정의**: UI 컴포넌트 개발 및 테스트를 위한 도구
- **용도**: 컴포넌트 문서화, 시각적 테스트, 디자인 시스템 관리

### Side Modal
- **정의**: 화면 좌측 또는 우측에서 나타나는 모달
- **용도**: PC 환경에서 채팅 위젯 표시

## T

### Tailwind CSS
- **정의**: 유틸리티 퍼스트 CSS 프레임워크
- **특징**: 클래스 기반 스타일링, 높은 커스터마이징 가능성

### TypeScript
- **정의**: 정적 타입을 지원하는 JavaScript 확장 언어
- **이점**: 타입 안전성, IDE 지원 향상, 런타임 에러 방지

### Theme
- **정의**: 애플리케이션의 시각적 테마 (색상, 폰트 등)
- **구성**: Accent Color 기반 동적 테마 시스템

## U

### UI/UX
- **UI (User Interface)**: 사용자 인터페이스, 시각적 요소
- **UX (User Experience)**: 사용자 경험, 전반적인 사용성

### User Avatar
- **정의**: 사용자를 나타내는 시각적 아이콘 또는 이미지
- **용도**: 채팅에서 사용자 식별

## W

### Widget
- **정의**: 웹사이트에 삽입 가능한 독립적인 UI 컴포넌트
- **특징**: 자체 포함된 기능, 쉬운 통합

### WebSocket
- **정의**: 실시간 양방향 통신을 위한 웹 표준
- **용도**: 실시간 채팅 기능 구현

## 약어 정리

| 약어 | 전체 명칭 | 의미 |
|------|-----------|------|
| ADR | Architecture Decision Record | 아키텍처 의사결정 기록 |
| API | Application Programming Interface | 애플리케이션 프로그래밍 인터페이스 |
| CS | Customer Service | 고객 서비스 |
| CTA | Call To Action | 행동 유도 요소 |
| FAQ | Frequently Asked Questions | 자주 묻는 질문 |
| JWE | JSON Web Encryption | JSON 웹 암호화 |
| LLM | Large Language Model | 대규모 언어 모델 |
| SPA | Single Page Application | 단일 페이지 애플리케이션 |
| UI | User Interface | 사용자 인터페이스 |
| UX | User Experience | 사용자 경험 |

## 최종 업데이트
2024-07-26 - 초기 문서 작성