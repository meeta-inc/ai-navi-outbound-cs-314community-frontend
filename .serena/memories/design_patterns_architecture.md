# 설계 패턴 및 아키텍처

## Atomic Design Pattern
프로젝트는 Atomic Design 패턴을 따름:
- **Atoms**: 가장 작은 단위의 컴포넌트 (Button, Icon, Typography)
- **Molecules**: Atoms 조합 (ChatBubble, InputField, UserAvatar)
- **Organisms**: Molecules + Atoms 조합 (ChatMessage, ChatInput, NavigationHeader)
- **Templates**: 페이지 레이아웃 (ChatLayout)
- **Pages**: 완성된 페이지 (MainPage)

## 관심사 분리 (Separation of Concerns)
- **컴포넌트**: UI 렌더링에만 집중
- **훅(Hooks)**: 비즈니스 로직과 상태 관리
- **서비스(Services)**: API 통신과 데이터 처리
- **컨텍스트(Contexts)**: 전역 상태 관리

## 상태 관리 패턴
- React Context API 사용 (Redux 없음)
- LocaleContext: 다국어 설정
- ThemeContext: 테마 설정
- 로컬 상태는 useState, useReducer 사용

## API 통신 패턴
- Fetch API 기반
- JWE 암호화를 통한 보안 통신
- AWS Cognito Identity Pool 인증
- 에러 처리 및 재시도 로직 포함

## 보안 패턴
- JWT 토큰 기반 인증
- JWE (JSON Web Encryption) 사용
- AWS KMS를 통한 키 관리
- 환경 변수로 민감 정보 관리

## 테스트 전략
- 단위 테스트: 개별 컴포넌트 및 함수
- 통합 테스트: 컴포넌트 간 상호작용
- 스냅샷 테스트: UI 변경 감지
- Storybook: 시각적 테스트

## 성능 최적화
- 코드 분할 (Code Splitting)
- Lazy Loading
- 메모이제이션 (useMemo, useCallback)
- 이미지 최적화

## 접근성 (A11y)
- ARIA 속성 사용
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 충분한 색상 대비

## 반응형 디자인
- Mobile-first 접근
- Tailwind CSS 반응형 유틸리티
- 브레이크포인트: sm(640px), md(768px), lg(1024px), xl(1280px)