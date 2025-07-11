# Chromatic 설정 가이드

## 🚀 Chromatic 프로젝트 토큰 취득

### 1단계: Chromatic 계정 생성
1. [chromatic.com](https://chromatic.com) 방문
2. **"Sign up with GitHub"** 클릭
3. GitHub 계정으로 로그인 및 권한 승인

### 2단계: 프로젝트 연결
1. **"Add project"** 또는 **"Create project"** 클릭
2. GitHub 리포지토리 선택: `ai-navi-outbound-cs-314community-frontend`
3. 프로젝트 이름 확인 및 생성

### 3단계: 프로젝트 토큰 확인
1. 프로젝트 생성 완료 후 **대시보드**로 이동
2. **"Manage"** → **"Configure"** 클릭
3. **"Project token"** 섹션에서 토큰 복사
   ```
   예시: chpt_abcd1234567890efghijklmnopqrstuv
   ```

### 4단계: GitHub Secrets 설정
1. GitHub 리포지토리 → **Settings** → **Secrets and variables** → **Actions**
2. **"New repository secret"** 클릭
3. 설정 내용:
   ```
   Name: CHROMATIC_PROJECT_TOKEN
   Secret: chpt_abcd1234567890efghijklmnopqrstuv
   ```
4. **"Add secret"** 클릭

## 📋 토큰 설정 확인 방법

### GitHub Actions에서 확인
```yaml
# .github/workflows/chromatic.yml
- name: Publish to Chromatic
  uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    buildScriptName: build-storybook
```

### 로컬에서 테스트
```bash
# 환경 변수 설정 (임시)
export CHROMATIC_PROJECT_TOKEN=chpt_your_token_here

# Chromatic 실행
npm run chromatic
```

## 🔒 보안 고려사항

### 토큰 보안 유지
- ✅ GitHub Secrets 사용 (권장)
- ❌ 코드에 직접 하드코딩 금지
- ❌ .env 파일에 저장 후 커밋 금지

### 팀원 권한 관리
1. Chromatic 프로젝트 → **"Collaborators"**
2. 팀원 초대 및 권한 설정:
   - **Viewer**: 결과 확인만 가능
   - **Reviewer**: 변경사항 승인/거부 가능
   - **Admin**: 모든 권한

## 🎯 첫 배포 및 베이스라인 설정

### 첫 Chromatic 배포
```bash
# 로컬에서 첫 실행 (베이스라인 생성)
npm run chromatic

# 또는 GitHub에 push하여 자동 실행
git add .
git commit -m "Add Chromatic visual testing"
git push origin develop
```

### 베이스라인 승인
1. Chromatic 대시보드에서 **첫 빌드** 확인
2. 모든 스토리 **"Accept"** 클릭
3. 이제 기준점(baseline)이 설정됨

## 📊 Chromatic 대시보드 활용

### 빌드 결과 확인
- **✅ No changes**: 변경사항 없음
- **⚠️ Changes detected**: 시각적 변경 감지
- **❌ Build failed**: 빌드 실패

### 변경사항 리뷰
1. **"Review changes"** 클릭
2. Before/After 비교 확인
3. **Accept** 또는 **Deny** 선택

### 팀 협업 워크플로우
```
개발자: 코드 수정 → PR 생성
   ↓
Chromatic: 자동 스크린샷 → 변경사항 감지
   ↓
디자이너: 리뷰 → 승인/거부
   ↓
개발자: 피드백 반영 → 머지
```

## 🛠️ 문제 해결

### 토큰 관련 오류
```bash
# 오류: Invalid project token
# 해결: 토큰 재확인 및 GitHub Secrets 업데이트
```

### 빌드 실패 시
```bash
# 로컬에서 테스트
npm run build-storybook
npm run chromatic --dry-run  # 실제 업로드 없이 테스트
```

### 권한 오류
```bash
# 오류: Access denied
# 해결: Chromatic 프로젝트에 GitHub 계정 추가 필요
```

## 💰 요금제 정보

### 무료 플랜
- **월 5,000 스크린샷**
- 1명 사용자
- 기본 기능

### 유료 플랜
- **월 25,000+ 스크린샷**
- 무제한 사용자
- 고급 협업 기능
- 우선 지원

### 오픈소스 혜택
- **무제한 스크린샷**
- 공개 리포지토리 대상
- 별도 신청 필요

## 📈 최적화 팁

### 스크린샷 수 줄이기
```typescript
// 불필요한 스토리 제외
export const AnimatedComponent: Story = {
  parameters: {
    chromatic: { disable: true }
  }
};
```

### 모드 활용
```typescript
// 특정 뷰포트만 테스트
export const ResponsiveComponent: Story = {
  parameters: {
    chromatic: {
      modes: {
        mobile: { viewport: 'mobile1' },
        desktop: { viewport: 'desktop' }
      }
    }
  }
};
```