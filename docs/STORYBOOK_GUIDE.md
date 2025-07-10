# 스토리북 개발 가이드

## 📋 개요
이 프로젝트는 CDD(Component-Driven Development) 방식으로 개발되며, 스토리북을 통해 컴포넌트를 독립적으로 개발하고 테스트할 수 있습니다.

## 🚀 시작하기

### 로컬 개발
```bash
# 스토리북 서버 시작
npm run storybook

# 브라우저에서 http://localhost:6006 열기
```

### 테스트 실행
```bash
# 스토리북 테스트 실행
npm run test-storybook

# Chromatic 배포 (시각적 회귀 테스트)
npm run chromatic
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── atoms/           # 기본 UI 요소
│   │   ├── Button/
│   │   ├── Typography/
│   │   └── Icon/
│   ├── molecules/       # 원자들의 조합
│   │   ├── ChatBubble/
│   │   ├── InputField/
│   │   └── UserAvatar/
│   ├── organisms/       # 복잡한 컴포넌트
│   │   ├── ChatInput/
│   │   ├── ChatMessage/
│   │   └── NavigationHeader/
│   └── templates/       # 페이지 레이아웃
│       └── ChatLayout/
```

## ✍️ 스토리 작성 가이드

### 1. 기본 스토리 구조
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '컴포넌트에 대한 설명을 여기에 작성합니다.',
      },
    },
  },
  argTypes: {
    // prop 정의
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
```

### 2. 다양한 상태 정의
```typescript
export const Default: Story = {
  args: {
    // 기본 props
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
```

### 3. 인터랙션 및 접근성
- **Controls**: 사용자가 실시간으로 props를 변경할 수 있도록 설정
- **Actions**: 이벤트 핸들러 동작 확인
- **A11y**: 접근성 검사 자동화

## 🎨 디자인 시스템 활용

### 테마 색상
- `orange`, `blue`, `green`, `red`, `purple`
- `getColorClasses(color)` 함수로 일관된 색상 적용

### 타이포그래피
- TypewriterText 컴포넌트로 타이핑 효과 구현
- 폰트: Work Sans, Noto Sans JP

### 스타일링
- Tailwind CSS 사용
- 반응형 디자인 고려
- 다크모드 지원 (추후 확장)

## 🧪 테스트 전략

### Visual Regression Testing
- **Chromatic**: 시각적 변경사항 자동 감지
- **GitHub Actions**: PR마다 자동 테스트 실행

### Interaction Testing
- **Test Runner**: 사용자 인터랙션 시나리오 테스트
- **Playwright**: 브라우저 기반 테스트

### Accessibility Testing
- **@storybook/addon-a11y**: 접근성 규칙 자동 검사
- **ARIA 속성**: 스크린 리더 지원

## 🤝 협업 워크플로우

### 디자이너와의 협업
1. **디자인 토큰**: Figma와 연동된 색상/간격 시스템
2. **컴포넌트 매핑**: 디자인 컴포넌트 ↔ 개발 컴포넌트 일치
3. **스토리북 리뷰**: 디자이너가 구현된 컴포넌트 검토

### 개발팀 협업
1. **컴포넌트 문서화**: 자동 생성된 문서로 사용법 공유
2. **코드 리뷰**: 스토리북 링크로 시각적 검토
3. **버전 관리**: Git 커밋마다 스토리북 배포

### 비즈니스 사이드 소통
1. **데모 환경**: 실제 동작하는 컴포넌트 확인
2. **피드백 수집**: 스토리북 댓글 기능 활용
3. **진행 상황 공유**: 배포된 스토리북으로 개발 현황 공유

## 🔧 개발 팁

### 성능 최적화
- 불필요한 re-render 방지
- 이미지 최적화 (WebP 포맷 사용)
- 번들 크기 모니터링

### 유지보수성
- 컴포넌트 단위 테스트 작성
- TypeScript 엄격 모드 활용
- ESLint/Prettier 규칙 준수

### 확장성
- 새로운 테마 추가 시 theme.config.ts 수정
- 다국어 지원 대비 i18n 구조 고려
- 반응형 디자인 breakpoint 표준화

## 📊 배포 및 모니터링

### AWS Amplify 배포
```bash
# 로컬에서 스토리북 빌드 테스트
npm run build-storybook

# Amplify 자동 배포 (develop 브랜치 push 시)
git push origin develop
```

### 배포 설정
1. **AWS Amplify 콘솔**에서 GitHub 연동
2. **Build settings**: `amplify.yml` 파일 자동 감지
3. **환경 변수**: 
   - `CHROMATIC_PROJECT_TOKEN` (Chromatic 연동 시)
   - `NODE_VERSION`: `18`

### 자동 배포 워크플로우
- **develop 브랜치**: Amplify 자동 배포
- **PR**: Preview 환경 제공 (Amplify 기능)
- **Chromatic**: 시각적 회귀 테스트 (GitHub Actions)

### 모니터링
- **Amplify 콘솔**: 배포 상태 및 로그 확인
- **CloudWatch**: 성능 메트릭 수집
- **Chromatic**: 시각적 변경사항 추적