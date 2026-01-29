# 이미지 입력 버튼 활성화 로직 개선 계획

## 1. 개요 및 목적
현재 `ChatInput` 컴포넌트에서 이미지 입력 버튼(첨부 버튼)이 특정 클라이언트 ID(`AS000003`)일 때만 표시되도록 하드코딩되어 있습니다. 이는 유지보수가 어렵고 확장성이 떨어지므로, `isEnableLearningNavi` 플래그를 기반으로 활성화 여부를 판단하도록 개선합니다.

## 2. 작업 상세 내용

### Step 1: `utils/appFeatures.ts` 유틸리티 함수 추가
`isMultimodalImageInputEnable` 함수를 추가하여 비즈니스 로직을 분리합니다.

**변경 전:**
(없음)

**변경 후:**
```typescript
/**
 * 멀티모달 이미지 입력 기능 활성화 여부를 확인하는 함수
 * @param isEnableLearningNavi - 학습 내비 기능 활성화 여부
 * @returns 이미지 입력 기능이 활성화되어 있으면 true
 */
export const isMultimodalImageInputEnable = (isEnableLearningNavi?: boolean): boolean => {
  return !!isEnableLearningNavi;
};
```

### Step 2: `MainPage.tsx` 변경
`ClientConfigContext`에서 `isEnableLearningNavi` 값을 가져와 `ChatInput` 컴포넌트에 전달해야 합니다.

1.  `useClientConfig()` 훅에서 `isEnableLearningNavi` 구조 분해 할당 추가.
2.  `ChatInput` 컴포넌트에 `isEnableLearningNavi` prop 전달.

**변경 예시:**
```typescript
// const { ..., isRequestedLearningOnboarding } = useClientConfig();
const { ..., isRequestedLearningOnboarding, isEnableLearningNavi } = useClientConfig();

// ...

<ChatInput
  // ... 기존 props
  isEnableLearningNavi={isEnableLearningNavi}
/>
```

### Step 3: `ChatInput.tsx` 컴포넌트 수정
하드코딩된 `clientId` 체크를 제거하고, `isMultimodalImageInputEnable` 유틸리티 함수를 이용한 조건문으로 변경합니다.

1.  `ChatInputProps` 인터페이스에 `isEnableLearningNavi` (optional) 추가.
2.  `isMultimodalImageInputEnable` import 추가.
3.  렌더링 로직 수정.

**변경 예시:**
```typescript
// import { isMultimodalImageInputEnable } from '../../../utils/appFeatures';

interface ChatInputProps {
  // ...
  isEnableLearningNavi?: boolean;
}

export function ChatInput({
  // ...
  isEnableLearningNavi,
}: ChatInputProps) {
  
  // ...

  // {clientId === 'AS000003' && ( ... )} ->
  {isMultimodalImageInputEnable(isEnableLearningNavi) && ( ... )}
  
  // ...
}
```

## 3. 영향 범위
*   **파일**:
    *   `src/utils/appFeatures.ts`
    *   `src/pages/MainPage.tsx`
    *   `src/components/organisms/ChatInput/ChatInput.tsx`
*   **기능**:
    *   AS000003 클라이언트뿐만 아니라, `isEnableLearningNavi` 설정이 true인 모든 클라이언트에서 이미지 첨부 버튼이 활성화됨.
    *   기존 AS000003 클라이언트라 하더라도 해당 설정이 false면 버튼이 보이지 않게 됨 (설정 확인 필요).

## 4. 검증 계획
*   `tests/postmessage-test-guide.md`에 작성된 테스트 페이지를 활용.
*   `Enable Learning Navi` 체크박스를 켜고 로드했을 때 파일 첨부 버튼(클립 또는 이미지 아이콘)이 표시되는지 확인.
*   체크박스를 끄고 로드했을 때 버튼이 숨겨지는지 확인.
