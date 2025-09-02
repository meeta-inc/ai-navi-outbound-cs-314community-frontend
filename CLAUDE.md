# Claude Code 작업 가이드라인

## 🏢 GitHub 계정 사용 규칙

### 회사 리포지토리 작업 시
- **소유자(Owner)**: `meeta-inc` (회사 계정)
- **개인 계정 아님**: rimapa2025가 아닌 meeta-inc 사용
- **이슈/PR 생성 시**: 항상 owner를 `meeta-inc`로 지정

### 올바른 GitHub 명령 예시
```bash
# ✅ 올바른 예 - 회사 계정 사용
gh issue create --repo meeta-inc/ai-navi-outbound-cs-314community-frontend
gh pr create --repo meeta-inc/ai-navi-outbound-cs-314community-frontend

# ❌ 잘못된 예 - 개인 계정 사용
gh issue create --repo rimapa2025/ai-navi-outbound-cs-314community-frontend
```

## 🔴 중요: PR 타겟 브랜치 규칙

이 프로젝트에서 PR을 생성할 때는 **반드시** 다음 규칙을 따라주세요:

### 기본 타겟 브랜치
- **`dev2`**: 메인 개발 브랜치 (PRIMARY) ⭐
- **`develop`**: 보조 개발 브랜치 
- **`main`**: 프로덕션 브랜치

### PR 생성 전 필수 확인
1. **절대 develop을 기본값으로 가정하지 마세요**
2. **반드시 사용자에게 타겟 브랜치를 확인하세요**
3. 불확실한 경우: "PR 타겟 브랜치는 dev2가 맞나요?"라고 질문

### 올바른 PR 생성 예시
```bash
# ❌ 잘못된 예
gh pr create --base develop  # 확인 없이 develop 사용

# ✅ 올바른 예  
gh pr create --base dev2     # dev2를 기본으로 사용
```

### 사용자 요청 패턴
- "PR 만들어주세요" → **dev2를 타겟으로 하되, 먼저 확인**
- "develop에 PR 만들어주세요" → develop 사용
- "dev2에 PR 만들어주세요" → dev2 사용

## 테스트 명령어

### 린트 및 타입체크
```bash
npm run lint
npm run type-check
```

### 개발 서버 실행
```bash
npm run dev
npm run dev:host  # 네트워크 접근 가능
```

### 빌드
```bash
npm run build
npm run preview
```

## 환경 변수 설정

### FAQ API 관련
```env
VITE_USE_FAQ_API=true  # FAQ API 사용 여부
VITE_CONTENT_CONFIG_API_URL=https://content-config-dev.meeta.jp/v1
```

## 프로젝트 구조
- Atomic Design Pattern 사용
- TypeScript + React 18
- Vite 번들러
- Tailwind CSS

## Git 컨벤션
- feat: 새로운 기능
- fix: 버그 수정  
- refactor: 리팩토링
- docs: 문서 수정
- test: 테스트 코드
- chore: 빌드, 패키지 등

---
⚠️ **이 파일은 Claude Code가 프로젝트 작업 시 참조하는 가이드라인입니다**