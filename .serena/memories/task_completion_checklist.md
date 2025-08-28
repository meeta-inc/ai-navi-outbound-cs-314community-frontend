# 작업 완료 체크리스트

## 코드 작성/수정 후 필수 확인 사항

### 1. 코드 품질 검사
```bash
# ESLint로 코드 스타일 검사
npm run lint
```
- 모든 ESLint 오류 및 경고 해결
- TypeScript 타입 오류 없음 확인

### 2. 테스트 실행
```bash
# 모든 테스트 실행
npm test -- --watchAll=false
```
- 기존 테스트 통과 확인
- 새 기능에 대한 테스트 추가
- 커버리지 90% 이상 유지

### 3. 빌드 확인
```bash
# 프로덕션 빌드 성공 확인
npm run build
```
- 빌드 오류 없음
- 번들 크기 확인

### 4. 로컬 테스트
```bash
# 개발 서버에서 기능 동작 확인
npm run dev
```
- 새 기능 정상 동작
- 기존 기능 영향 없음
- 반응형 디자인 확인 (모바일/데스크톱)
- 다국어 지원 확인 (ja/ko/en)

### 5. Storybook 확인 (컴포넌트 수정 시)
```bash
# Storybook에서 컴포넌트 확인
npm run storybook
```
- 스토리 업데이트
- 시각적 회귀 확인

### 6. 문서 업데이트
- README.md 업데이트 (필요시)
- JSDoc 주석 추가
- 복잡한 로직 설명 추가

### 7. Git 커밋
- 의미 있는 커밋 메시지 작성
- 커밋 프리픽스 사용 (feat:, fix:, refactor: 등)
- 하나의 커밋에 하나의 논리적 변경

## 체크리스트 요약
- [ ] ESLint 통과 (`npm run lint`)
- [ ] 모든 테스트 통과 (`npm test -- --watchAll=false`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 로컬 동작 확인
- [ ] 반응형 디자인 확인
- [ ] 다국어 지원 확인
- [ ] Storybook 업데이트 (해당시)
- [ ] 문서 업데이트 (필요시)