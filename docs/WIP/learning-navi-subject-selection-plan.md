# Plan: 학습 내비 과목 선택 기능 추가 (개정안)

학습 내비(Learning Navi) 기능이 활성화된 경우, 인사말 완료 후 사용자에게 과목 선택 UI를 제공합니다. 본 계획은 프로젝트의 **TDD 기반 8단계 개발 워크플로우**와 **Atomic Design** 원칙을 엄격히 준수합니다.

## 🏗️ 아키텍처 및 규칙 준수 사항

- **TDD Workflow**: 모든 컴포넌트 개발은 테스트 작성(RED) → 구현(GREEN) → 스토리북 작성 순서로 진행합니다.
- **Atomic Design**: `SubjectSelection`은 `organisms` 계층에 배치하며, `atoms`, `molecules`를 조합하여 구성합니다.
- **State Management**: `useActiveComponents` 훅을 사용하여 `messageId` 기반으로 컴포넌트의 활성 상태를 관리합니다.
- **Component Structure**: 각 컴포넌트는 구현(`tsx`), 테스트(`test.tsx`), 스토리북(`stories.tsx`), 엔트리(`index.ts`) 파일을 포함합니다.

---

## 📅 상세 개발 단계 (8-Step Workflow)

### 1단계: API 정의 및 기초 작업
- [ ] **[MODIFY]** `src/types/api/learningInfo.types.ts`: `Subject`, `GetSubjectsListResponse` 인터페이스 추가.
- [ ] **[MODIFY]** `src/services/api/learningInfo.ts`: `getSubjects` API 함수 추가.
- [ ] **[MODIFY]** `src/locales/ko(ja)/common.json`: 과목 선택 헤더 등 다국어 키 추가.

### 2단계: SubjectSelection 단위 테스트 작성 (RED)
- [ ] `src/components/organisms/SubjectSelection/SubjectSelection.test.tsx` 작성.
- [ ] 렌더링 검증, 과목 클릭 시 콜백 호출, 타이포그래피(`meeta-typography-mid`) 적용 여부 테스트.

### 3단계: SubjectSelection 컴포넌트 구현 (GREEN)
- [ ] `src/components/organisms/SubjectSelection/SubjectSelection.tsx` 구현.
- [ ] `GradeSelection`의 디자인 패턴(버튼 리스트, 아이콘 등)을 계승하여 레이아웃 구성.

### 4단계: 스토리북 및 엔트리 파일 작성
- [ ] `src/components/organisms/SubjectSelection/SubjectSelection.stories.tsx` 작성.
- [ ] `src/components/organisms/SubjectSelection/index.ts` 작성.

### 5단계: 메인페이지 통합 테스트 케이스 작성 (RED)
- [ ] `src/pages/MainPage.test.tsx`에 학습 내비 활성 시 과목 선택 UI 표시 여부 테스트 추가.
- [ ] `useActiveComponents` 상태에 따른 렌더링 검증 추가.

### 6단계: 메인페이지 통합 및 로직 구현 (GREEN)
- [ ] `MainPage.tsx`에서 인사말 완료(`onTypingComplete`) 시 `isEnableLearningNavi` 체크.
- [ ] `activateComponent('subjectSelection', messageId)`를 통해 UI 활성화.
- [ ] 과목 선택 시 `handleSubjectSelect`를 통해 학습 정보 등록 API 호출 연동.

### 7단계: 최종 점검 (make all-tests)
- [ ] `make all-tests` 명령어를 통해 전체 테스트 커버리지(80%+) 및 빌드 성공 확인.

---

## 🧪 검증 계획

### 자동화 테스트
- `npm test -- SubjectSelection.test.tsx`
- `npm test -- MainPage.test.tsx`

### 수동 확인 (Test Loader 활용)
1. `public/test-loader.html` 접속.
2. `isEnableLearningNavi: true` 설정 후 대화 시작.
3. 인사말이 끝난 직후 과목 선택 UI가 나타나는지 확인.
4. 과목 버튼 클릭 시 채팅 창에 해당 과목이 입력되고 진행되는지 확인.
