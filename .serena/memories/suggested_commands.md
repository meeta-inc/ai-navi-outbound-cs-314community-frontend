# 개발 명령어 가이드

## 필수 실행 명령어 (작업 완료 후)
```bash
# 린트 검사 - 코드 스타일 확인
npm run lint

# 테스트 실행 - 모든 테스트 통과 확인
npm test -- --watchAll=false

# 빌드 테스트 - 빌드 오류 없음 확인
npm run build
```

## 주요 개발 명령어

### 개발 서버
```bash
npm run dev          # 로컬 개발 서버 실행 (localhost:5173)
npm run dev:host     # 네트워크 접근 가능한 개발 서버
npm run preview      # 빌드된 결과물 미리보기
npm run preview:host # 네트워크 접근 가능한 미리보기
```

### 테스트
```bash
npm test                # Jest 테스트 실행
npm run test:watch      # 테스트 감시 모드
npm run test:coverage   # 커버리지 포함 테스트
```

### 빌드 및 배포
```bash
npm run build           # 프로덕션 빌드
npm run lint            # ESLint 검사
```

### Storybook
```bash
npm run storybook       # Storybook 개발 서버 (port 6006)
npm run build-storybook # Storybook 정적 빌드
npm run test-storybook  # Storybook 테스트
npm run chromatic       # Chromatic 시각적 회귀 테스트
```

## Git 명령어
```bash
git status              # 변경사항 확인
git diff               # 변경 내용 확인
git add .              # 모든 변경사항 스테이징
git commit -m "type: message" # 커밋
git push origin branch-name   # 푸시
git checkout -b feature/name  # 새 브랜치 생성
```

## macOS 시스템 명령어
```bash
ls -la                 # 디렉토리 내용 확인
cd <directory>         # 디렉토리 이동
grep -r "pattern" .    # 패턴 검색
find . -name "*.tsx"   # 파일 찾기
open .                 # Finder에서 현재 디렉토리 열기
```

## Makefile 단축 명령어
```bash
make help              # 사용 가능한 명령어 보기
make install           # 의존성 설치
make dev               # 개발 서버 시작
make test              # 테스트 실행
make all-tests         # 모든 테스트 실행 (lint + jest)
make ci-test           # CI 스타일 테스트
```