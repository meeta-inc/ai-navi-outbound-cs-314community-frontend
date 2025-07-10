# 배포 전략 가이드

## 🎯 권장 배포 전략: 별도 Amplify 앱

### 배포 구조
```
같은 GitHub 리포지토리
├── 메인 앱 (기존)
│   ├── 도메인: https://main-app.amplifyapp.com
│   ├── 브랜치: develop
│   └── 빌드: npm run build → dist/
│
└── 스토리북 앱 (신규)
    ├── 도메인: https://storybook-app.amplifyapp.com
    ├── 브랜치: develop
    └── 빌드: npm run build-storybook → storybook-static/
```

### 🔧 설정 단계

#### 1. 기존 메인 앱 수정
1. **Amplify 콘솔** → 기존 앱 선택
2. **빌드 설정** → **Build specification** 편집
3. 파일 경로: `amplify-main.yml`

#### 2. 새 스토리북 앱 생성
1. **Amplify 콘솔** → **새 앱 호스팅**
2. 같은 GitHub 리포지토리 선택
3. 브랜치: `develop`
4. **빌드 설정** → 파일 경로: `amplify-storybook.yml`

#### 3. 도메인 설정
- **메인 앱**: `yourapp.com`
- **스토리북**: `storybook.yourapp.com` 또는 `design.yourapp.com`

### 💡 장점
- ✅ 독립적인 배포 관리
- ✅ 각기 다른 환경 변수 설정 가능
- ✅ 도메인별 접근 권한 제어
- ✅ 빌드 실패 시 서로 영향 없음

### 📊 비용 고려사항
- 2개의 Amplify 앱 = 2배 비용 (빌드 시간 기준)
- 하지만 독립적 관리의 이점이 비용을 상쇄

## 🔄 대안 전략들

### 전략 2: 브랜치별 배포
```
develop 브랜치 → 메인 앱
storybook 브랜치 → 스토리북
```

**장점**: 단일 Amplify 앱 사용
**단점**: 브랜치 관리 복잡성

### 전략 3: 서브패스 배포
```
yourapp.com/ → 메인 앱
yourapp.com/storybook/ → 스토리북
```

**장점**: 단일 도메인 사용
**단점**: 복잡한 라우팅 설정 필요

## 🛠️ 실무 권장사항

### 개발 환경
```bash
# 로컬 개발
npm run dev          # 메인 앱 (localhost:5173)
npm run storybook    # 스토리북 (localhost:6006)
```

### 배포 워크플로우
```
1. feature 브랜치 개발
2. develop 브랜치 PR 생성
3. 자동 빌드 및 테스트
4. 머지 시 자동 배포
   - 메인 앱: production
   - 스토리북: design system
```

### 팀별 역할
- **개발자**: 메인 앱 + 스토리북 개발
- **디자이너**: 스토리북 리뷰 및 피드백
- **기획자**: 스토리북으로 기능 확인
- **QA**: 양쪽 환경 테스트

### 접근 권한 관리
- **메인 앱**: 내부 직원만 접근 (인증 필요)
- **스토리북**: 외부 디자이너도 접근 가능

## 🔒 보안 고려사항

### 환경별 설정
```yaml
# 메인 앱 환경 변수
REACT_APP_API_URL=https://api.production.com
REACT_APP_ENVIRONMENT=production

# 스토리북 환경 변수
STORYBOOK_ENVIRONMENT=production
CHROMATIC_PROJECT_TOKEN=xxx
```

### 접근 제어
- 메인 앱: 프로덕션 데이터 접근
- 스토리북: 모크 데이터만 사용

## 📈 모니터링 및 분석

### 메트릭 추적
- **메인 앱**: 사용자 행동 분석
- **스토리북**: 컴포넌트 사용률 추적

### 알림 설정
- 배포 성공/실패 알림
- 성능 저하 알림
- 보안 이슈 알림

## 🚀 향후 확장 계획

### 추가 환경 고려
- **스테이징**: staging 브랜치
- **QA**: qa 브랜치
- **데모**: demo 브랜치

### 마이크로 프론트엔드 대비
- 컴포넌트 라이브러리 패키지화
- 다른 프로젝트에서 재사용 가능한 구조