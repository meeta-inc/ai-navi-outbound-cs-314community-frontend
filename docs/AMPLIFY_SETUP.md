# AWS Amplify 멀티 앱 배포 설정 가이드

## 🚀 배포 전략 개요

같은 리포지토리에서 **메인 프론트엔드 앱**과 **스토리북**을 동시에 배포하는 3가지 방법을 제시합니다.

## 방법 1: 별도 Amplify 앱 (권장)

### 1-1. 메인 앱 설정
1. [AWS Amplify 콘솔](https://console.aws.amazon.com/amplify/)에서 기존 앱 확인
2. **빌드 설정**에서 `amplify-main.yml` 사용하도록 변경

### 1-2. 스토리북 앱 생성
1. **"새 앱 호스팅"** 클릭
2. 같은 리포지토리 선택
3. 브랜치: `develop`
4. **빌드 설정**에서 `amplify-storybook.yml` 사용

### 1-3. 빌드 설정 파일

**메인 앱 (amplify-main.yml)**
```yaml
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

**스토리북 (amplify-storybook.yml)**
```yaml
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build-storybook
      artifacts:
        baseDirectory: storybook-static
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

## 방법 2: 브랜치별 배포

### 2-1. 브랜치 전략
- **develop**: 메인 앱 배포 (`npm run build`)
- **storybook**: 스토리북 배포 (`npm run build-storybook`)

### 2-2. 단일 amplify.yml 사용
```yaml
version: 1
applications:
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - |
              if [ "$AWS_BRANCH" = "storybook" ]; then
                npm run build-storybook
              else
                npm run build
              fi
      artifacts:
        baseDirectory: |
          if [ "$AWS_BRANCH" = "storybook" ]; then
            echo "storybook-static"
          else
            echo "dist"
          fi
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

## 방법 3: 멀티 앱 배포 (복잡)

### 3-1. 단일 amplify.yml로 두 앱 동시 배포
```yaml
version: 1
applications:
  # 메인 앱
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  
  # 스토리북 앱
  - appRoot: .
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build-storybook
      artifacts:
        baseDirectory: storybook-static
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

> **주의**: 이 방법은 현재 Amplify에서 완전히 지원하지 않을 수 있습니다.

### 4. 환경 변수 설정
Amplify 콘솔에서 **환경 변수** 탭으로 이동하여 설정:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NODE_VERSION` | `20` | Node.js 버전 (Storybook 9.x 필수) |
| `CHROMATIC_PROJECT_TOKEN` | `your_token` | Chromatic 연동 (선택사항) |
| `STORYBOOK_ENVIRONMENT` | `production` | 스토리북 환경 |

> **중요**: Storybook 9.x는 Node.js 20 이상이 필요합니다.

### 5. 도메인 설정
1. **도메인 관리** 탭에서 사용자 정의 도메인 추가 (선택사항)
2. 자동 생성된 도메인: `https://[app-id].amplifyapp.com`

## 🔧 고급 설정

### 브랜치 전략
- **develop**: 프로덕션 배포
- **feature/***: 자동 PR 미리보기
- **main**: 별도 환경 (필요 시)

### 알림 설정
1. **알림** 탭에서 이메일/Slack 알림 설정
2. 배포 성공/실패 알림 구성

### 성능 최적화
```yaml
# amplify.yml 성능 최적화
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --only=production
    build:
      commands:
        - npm run build-storybook
        - echo "Build optimization completed"
  artifacts:
    baseDirectory: storybook-static
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

## 🔐 보안 설정

### 액세스 제어
1. **액세스 제어** 탭에서 인증 설정
2. 비밀번호 보호 또는 AWS Cognito 연동

### 환경 변수 암호화
- 민감한 정보는 AWS Systems Manager Parameter Store 사용
- Amplify에서 자동으로 암호화 처리

## 📊 모니터링

### 빌드 로그
- 실시간 빌드 로그 확인
- 오류 발생 시 상세 정보 제공

### 성능 메트릭
- CloudWatch 연동으로 성능 모니터링
- 사용자 접속 통계 확인

### 알림
- 배포 상태 알림
- 오류 발생 시 즉시 알림

## 🛠️ 문제 해결

### 일반적인 문제
1. **빌드 실패**: Node.js 버전 확인
2. **스타일 깨짐**: Tailwind CSS 경로 확인
3. **환경 변수 오류**: 콘솔에서 변수 설정 확인

### 디버깅
```bash
# 로컬에서 같은 환경으로 테스트
npm ci
npm run build-storybook

# 빌드 결과 확인
ls -la storybook-static/
```

## 📈 최적화 팁

### 빌드 속도 향상
- 캐시 설정 최적화
- 의존성 설치 최소화
- 병렬 빌드 활용

### 배포 최적화
- 정적 파일 압축
- CDN 활용
- 이미지 최적화

## 🔄 업데이트 워크플로우

### 자동 배포
1. `develop` 브랜치에 push
2. Amplify 자동 빌드 트리거
3. 성공 시 배포 완료

### 수동 배포
1. Amplify 콘솔에서 **재배포** 클릭
2. 특정 커밋으로 롤백 가능