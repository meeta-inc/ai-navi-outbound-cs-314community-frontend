# 코드베이스 구조

## 디렉토리 구조 (Atomic Design Pattern)
```
src/
├── components/          # 재사용 가능한 컴포넌트 (Atomic Design)
│   ├── atoms/          # 기본 UI 컴포넌트 (Button, Icon, Typography)
│   ├── molecules/      # 복합 컴포넌트 (ChatBubble, InputField, UserAvatar)
│   ├── organisms/      # 기능 컴포넌트 (ChatMessage, ChatInput, NavigationHeader)
│   └── templates/      # 레이아웃 템플릿 (ChatLayout)
├── contexts/           # React Context (LocaleContext, ThemeContext)
├── hooks/              # 커스텀 훅 (useChat, useTheme, useKeyboardState)
├── locales/            # 다국어 번역 파일
│   ├── ja/            # 일본어
│   ├── ko/            # 한국어
│   └── en/            # 영어
├── pages/              # 페이지 컴포넌트 (MainPage)
├── services/           # API 및 비즈니스 로직
│   ├── api/           # API 관련 (chat, user, questions)
│   ├── auth/          # 인증 관련 (token)
│   └── jwe/           # JWE 암호화 서비스
├── shared/             # 공유 설정 및 상수
│   ├── config/        # 앱 설정 (app, chat, header, menu, theme)
│   └── constants/     # 상수 정의 (grade)
├── types/              # TypeScript 타입 정의
├── dev/                # 개발 전용 (프로덕션에서 제외)
│   ├── components/    # 개발 도구 컴포넌트
│   └── pages/         # 테스트 페이지 (CognitoTestPage, JWETestPage)
├── assets/             # 정적 자산 (icons, images)
├── stories/            # Storybook 스토리 파일
├── utils/              # 유틸리티 함수
├── __mocks__/          # Jest 모의 객체
└── config/             # 설정 파일
```

## 문서 구조
```
docs/
├── ADR/                # Architecture Decision Records
├── rule/               # 개발 규칙 및 가이드라인
│   ├── coding-standards.md
│   ├── security-guidelines.md
│   ├── testing-guidelines.md
│   └── component-configuration.md
├── background_context/ # 비즈니스 및 기술 컨텍스트
└── test/              # 테스트 관련 문서
```

## 설정 파일
- package.json: 프로젝트 메타데이터 및 스크립트
- tsconfig.json: TypeScript 설정
- vite.config.ts: Vite 빌드 설정
- tailwind.config.js: Tailwind CSS 설정
- eslint.config.js: ESLint 설정
- jest.config.js: Jest 테스트 설정
- postcss.config.js: PostCSS 설정
- .storybook/: Storybook 설정