# 코딩 표준 및 컨벤션

## 파일 명명 규칙
- **컴포넌트**: PascalCase (예: `ChatInput.tsx`)
- **훅**: camelCase with use prefix (예: `useChat.ts`)
- **유틸리티**: camelCase (예: `formatDate.ts`)
- **상수**: CONSTANT_CASE (예: `API_ENDPOINTS.ts`)
- **타입**: PascalCase with Type suffix (예: `UserType.ts`)

## 컴포넌트 파일 구조
각 컴포넌트는 다음 파일들을 포함:
```
ComponentName/
├── ComponentName.tsx       # 컴포넌트 구현
├── ComponentName.test.tsx  # 테스트 케이스
├── ComponentName.stories.tsx # 스토리북
└── index.ts               # export 파일
```

## TypeScript 규칙
- 명시적 타입 정의 사용
- any 타입 사용 금지
- 인터페이스 우선 사용 (타입 별칭보다)
- Props 인터페이스는 컴포넌트명 + Props 패턴

## React 규칙
- 함수형 컴포넌트 사용
- React.FC 사용 지양
- 커스텀 훅 활용하여 로직 분리
- 조건부 렌더링시 && 연산자 또는 삼항 연산자 사용

## 스타일링
- Tailwind CSS 유틸리티 클래스 사용
- 커스텀 CSS는 최소화
- 반응형 디자인 필수 (mobile-first)

## 테스트
- 모든 컴포넌트에 테스트 필수
- React Testing Library 사용
- 90% 이상 커버리지 목표
- 유닛 테스트와 통합 테스트 구분

## 주석 및 문서화
- JSDoc 주석 사용
- 복잡한 로직에만 주석 추가
- 코드 자체가 문서가 되도록 명확한 명명

## Git 컨벤션
- 브랜치: feature/, fix/, refactor/ 프리픽스
- 커밋 메시지: feat:, fix:, refactor:, test:, docs: 프리픽스
- PR 전 lint와 test 통과 필수