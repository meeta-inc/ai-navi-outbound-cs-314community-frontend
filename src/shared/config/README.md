# FAQ Categories Configuration

이 문서는 FAQ 카테고리의 동적 설정 방법을 설명합니다.

## 개요

FAQ 카테고리 시스템은 설정 파일 기반으로 구현되어 있어, 코드 수정 없이 환경변수만으로 카테고리 구성을 변경할 수 있습니다.

## 설정 방법

### 1. 환경변수를 통한 설정

`.env` 파일에서 `VITE_FAQ_CATEGORIES_CONFIG` 환경변수를 수정하여 카테고리를 구성할 수 있습니다.

```bash
# .env 파일
VITE_FAQ_CATEGORIES_CONFIG={"categories":[...],"defaultCategoryCount":3}
```

### 2. 설정 구조

```typescript
interface FAQCategoriesConfig {
  categories: FAQCategoryConfig[];
  defaultCategoryCount: number;
}

interface FAQCategoryConfig {
  id: string;                    // 카테고리 고유 ID
  textKey: string;              // 번역 키 (제목)
  valueKey: string;             // 번역 키 (메시지)
  iconConfig: IconConfig;       // 아이콘 설정
  order: number;                // 표시 순서
  enabled: boolean;             // 활성화 여부
}
```

### 3. 설정 예시

#### 기본 3개 카테고리 (현재 설정)
```json
{
  "categories": [
    {
      "id": "curriculum",
      "textKey": "chat.faq.curriculum.title",
      "valueKey": "chat.faq.curriculum.message", 
      "iconConfig": {"type": "lucide", "value": "BookOpen"},
      "order": 1,
      "enabled": true
    },
    {
      "id": "schedule", 
      "textKey": "chat.faq.schedule.title",
      "valueKey": "chat.faq.schedule.message",
      "iconConfig": {"type": "lucide", "value": "Clock"},
      "order": 2,
      "enabled": true
    },
    {
      "id": "pricing",
      "textKey": "chat.faq.pricing.title", 
      "valueKey": "chat.faq.pricing.message",
      "iconConfig": {"type": "lucide", "value": "DollarSign"},
      "order": 3,
      "enabled": true
    }
  ],
  "defaultCategoryCount": 3
}
```

#### 확장된 4개 카테고리
```json
{
  "categories": [
    // ... 위의 3개 카테고리 + 추가 카테고리
    {
      "id": "support",
      "textKey": "chat.faq.support.title",
      "valueKey": "chat.faq.support.message", 
      "iconConfig": {"type": "lucide", "value": "HelpCircle"},
      "order": 4,
      "enabled": true
    }
  ],
  "defaultCategoryCount": 4
}
```

## 카테고리 변경 방법

### 1. 카테고리 개수 변경
- `.env`에서 `VITE_FAQ_CATEGORIES_CONFIG`의 `categories` 배열과 `defaultCategoryCount` 수정
- 새로운 카테고리 추가 시 번역 파일(`src/locales/ja/common.json`)에 해당 번역키 추가 필요

### 2. 카테고리 순서 변경
- 각 카테고리의 `order` 값 수정

### 3. 카테고리 비활성화
- 특정 카테고리의 `enabled`를 `false`로 설정

### 4. 아이콘 변경
- `iconConfig`에서 아이콘 타입(`lucide`, `component`, `url`, `svg`)과 값 수정

## 번역 키 설정

새로운 카테고리 추가 시 `src/locales/ja/common.json`에 해당 번역을 추가해야 합니다:

```json
{
  "chat": {
    "faq": {
      "newCategory": {
        "title": "새 카테고리 제목",
        "message": "새 카테고리 메시지"
      }
    }
  }
}
```

## 개발 및 테스트

### 테스트 환경
Jest 테스트 환경에서는 항상 기본 설정(`DEFAULT_FAQ_CATEGORIES`)을 사용합니다.

### 브라우저 테스트
브라우저 개발자 도구 콘솔에서 다음 함수를 실행하여 설정을 확인할 수 있습니다:

```javascript
// 환경변수 확인
import.meta.env.VITE_FAQ_CATEGORIES_CONFIG

// 설정 테스트 (테스트 유틸리티 import 필요)
testFAQCategoriesConfig()
```

## 주의사항

1. **JSON 형식**: 환경변수 값은 유효한 JSON 형식이어야 합니다.
2. **번역 키**: 새로운 카테고리 추가 시 번역 파일에 해당 키를 추가해야 합니다.
3. **order 중복**: 카테고리의 `order` 값이 중복되지 않도록 주의하세요.
4. **enabled 필드**: 비활성화된 카테고리는 UI에 표시되지 않습니다.

## 파일 구조

```
src/shared/config/
├── faqCategories.config.ts    # 메인 설정 파일
├── faqCategories.test-app.ts  # 테스트 유틸리티
├── README.md                  # 이 문서
└── env.utils.ts              # 환경변수 유틸리티
```