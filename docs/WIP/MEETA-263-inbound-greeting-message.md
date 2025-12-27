# MEETA-263: 내부생(APP001) 전용 그리팅 메시지 구현

## 개요
APP001(내부생) 접속 시 그리팅 메시지를 변경하여 "お子様" 대신 "あなた"를 사용하도록 수정

## 완료된 수정 사항

### 1. isInboundApp 유틸리티 함수 추가
**파일**: `src/utils/appFeatures.ts`

```typescript
/**
 * 내부생(Inbound) 앱 여부를 확인하는 함수
 * @param appId - 애플리케이션 ID
 * @returns 내부생 앱이면 true, 아니면 false
 */
export const isInboundApp = (appId: string): boolean => {
  return appId === 'APP001';
};
```

### 2. isFAQEnabled 함수 리팩토링
**파일**: `src/utils/appFeatures.ts`

```typescript
export const isFAQEnabled = (appId: string): boolean => {
  // 내부생 앱의 경우 FAQ 기능 비활성화
  return !isInboundApp(appId);
};
```

### 3. GradeQuickReply.tsx 수정
**파일**: `src/components/organisms/GradeQuickReply/GradeQuickReply.tsx`

- import에 `isInboundApp` 추가
- `appId === 'APP001'` → `isInboundApp(appId || '')`로 변경

### 4. QuickReply.tsx 수정
**파일**: `src/components/organisms/QuickReply/QuickReply.tsx`

- import에 `isInboundApp` 추가
- `appId === 'APP001'` → `isInboundApp(appId || '')`로 변경

### 5. 로케일 파일 수정

**일본어** (`src/locales/ja/common.json`)
```json
"onboarding": {
  "gradeSelectionHeader": "お子様の学年を教えてください",
  "gradeSelectionMessage": "まずは、お子様の学年を教えてください🙋",
  "gradeSelectionMessageForInbound": "まずは、あなたの学年を教えてください🙋"
}
```

**영어** (`src/locales/en/common.json`)
```json
"onboarding": {
  "gradeSelectionHeader": "Please tell us your child's grade level",
  "gradeSelectionMessage": "First, please tell us your child's grade level🙋",
  "gradeSelectionMessageForInbound": "First, please tell us your grade level🙋"
}
```

**한국어** (`src/locales/ko/common.json`)
```json
"onboarding": {
  "gradeSelectionHeader": "자녀의 학년을 알려주세요",
  "gradeSelectionMessage": "먼저, 자녀의 학년을 알려주세요🙋",
  "gradeSelectionMessageForInbound": "먼저, 본인의 학년을 알려주세요🙋"
}
```

### 6. MainPage.tsx 수정
**파일**: `src/pages/MainPage.tsx`

```typescript
// import 추가
import { isFAQEnabled, isInboundApp } from '../utils/appFeatures';

// 그리팅 메시지 로직
useEffect(() => {
  if (showOnboardingMessage) {
    // 내부생 앱의 경우 다른 메시지 사용
    const messageKey = isInboundApp(appId)
      ? 'onboarding.gradeSelectionMessageForInbound'
      : 'onboarding.gradeSelectionMessage';
    const onboardingMessage = t(messageKey);
    addTypingBotMessage(onboardingMessage);
    // ...
  }
}, [showOnboardingMessage, addTypingBotMessage, t, appId]);
```

## 수정 파일 요약

| 파일 | 수정 내용 |
|------|----------|
| `src/utils/appFeatures.ts` | `isInboundApp()` 함수 추가, `isFAQEnabled()` 리팩토링 |
| `src/locales/ja/common.json` | `gradeSelectionMessageForInbound` 키 추가 |
| `src/locales/en/common.json` | `gradeSelectionMessageForInbound` 키 추가 |
| `src/locales/ko/common.json` | `gradeSelectionMessageForInbound` 키 추가 |
| `src/components/organisms/GradeQuickReply/GradeQuickReply.tsx` | `isInboundApp` 사용 |
| `src/components/organisms/QuickReply/QuickReply.tsx` | `isInboundApp` 사용 |
| `src/pages/MainPage.tsx` | 그리팅 메시지 분기 처리 |

## 테스트 확인 사항

1. APP001로 접속 시 "まずは、あなたの学年を教えてください🙋" 표시
2. 다른 appId로 접속 시 기존 메시지 "まずは、お子様の学年を教えてください🙋" 표시
3. 기존 기능(FAQ 비활성화, QuickReply/GradeQuickReply 비표시)이 정상 동작

## 관련 티켓
- MEETA-263

## 빌드 상태
- ✅ 빌드 성공 (npm run build)
