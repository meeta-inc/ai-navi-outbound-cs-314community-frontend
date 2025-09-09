# 음성 모달 데모 모드 사용 가이드

## 📋 개요
음성 모달의 데모 모드는 실제 LLM API 호출 없이 미리 정의된 시나리오와 음성 파일을 사용하여 안정적인 데모 환경을 제공합니다.

## 🚀 빠른 시작

### 1. 환경변수 설정
`.env` 파일에서 다음 설정을 추가/수정합니다:

```env
# 데모 모드 활성화
VITE_VOICE_DEMO_MODE=true

# 시나리오 파일 경로 (로컬)
VITE_DEMO_SCENARIO_URL=/demo/scenarios.json

# 또는 S3 경로 사용
# VITE_DEMO_SCENARIO_URL=https://meeta-ai-navi.s3.ap-northeast-1.amazonaws.com/demo/scenarios.json
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 데모 모드 확인
- 음성 모달을 열면 데모 모드 인디케이터가 표시됩니다
- 음성 입력 시 키워드 매칭으로 미리 정의된 응답이 재생됩니다

## 📁 파일 구조

```
public/
└── demo/
    └── scenarios.json    # 데모 시나리오 데이터
```

## 🎯 시나리오 구조

### 시나리오 JSON 형식
```json
{
  "version": "1.0.0",
  "scenarios": [
    {
      "id": "demo_001_fee",
      "triggers": ["授業料", "いくら", "料金"],
      "response": {
        "text": "응답 텍스트",
        "voiceFile": "S3 음성 파일 URL",
        "duration": 15
      }
    }
  ]
}
```

### 필드 설명
- `id`: 시나리오 고유 ID
- `triggers`: 매칭할 키워드 배열 (부분 일치)
- `response.text`: 화면에 표시할 텍스트
- `response.voiceFile`: 재생할 음성 파일 URL
- `response.duration`: 예상 재생 시간 (초)

## 📝 시나리오 예시

| 사용자 입력 | 매칭 키워드 | 응답 |
|------------|------------|------|
| 授業料はいくらですか？ | 授業料, いくら | 수업료 안내 |
| 科目は何がありますか？ | 科目, 教科 | 과목 안내 |
| 体験授業はありますか？ | 体験, 無料 | 체험 수업 안내 |

## 🔧 시나리오 추가/수정

### 1. 로컬 시나리오 수정
`public/demo/scenarios.json` 파일을 직접 편집:

```json
{
  "id": "demo_new",
  "triggers": ["新しい", "キーワード"],
  "response": {
    "text": "새로운 응답 텍스트",
    "voiceFile": "https://example.com/voice.mp3",
    "duration": 10
  }
}
```

### 2. S3 음성 파일 업로드
1. S3 버킷에 음성 파일 업로드
2. 공개 읽기 권한 설정
3. URL을 시나리오에 추가

## ⚙️ 고급 설정

### 폴백 응답
키워드 매칭이 실패한 경우 `demo_default` 시나리오가 사용됩니다:

```json
{
  "id": "demo_default",
  "triggers": [],
  "response": {
    "text": "기본 응답 메시지",
    "voiceFile": "default.mp3",
    "duration": 10
  }
}
```

### 매칭 우선순위
1. 정확한 키워드 매칭
2. 부분 문자열 매칭
3. 기본 응답 (demo_default)

## 🐛 트러블슈팅

### 데모 모드가 활성화되지 않음
- `.env` 파일에서 `VITE_VOICE_DEMO_MODE=true` 확인
- 개발 서버 재시작 (`npm run dev`)

### 음성 파일이 재생되지 않음
- 브라우저 콘솔에서 CORS 에러 확인
- S3 버킷 CORS 설정 확인
- 음성 파일 URL 접근 가능 여부 확인

### 시나리오가 매칭되지 않음
- 키워드 철자 확인
- 부분 매칭 가능한 짧은 키워드 사용
- 브라우저 콘솔에서 매칭 로그 확인

## 📊 모니터링

브라우저 개발자 도구 콘솔에서 확인 가능한 로그:
- `[Demo Mode] Loaded scenarios: X`
- `[Demo Mode] Matched scenario: demo_xxx`
- `[Demo Mode] Playing voice: URL`

## 🚫 주의사항

- 데모 모드는 개발/스테이징 환경에서만 사용
- 프로덕션 배포 시 `VITE_VOICE_DEMO_MODE=false` 설정
- 민감한 정보를 시나리오에 포함하지 않음
- S3 음성 파일은 적절한 접근 권한 설정

## 💡 팁

1. **효과적인 키워드 선택**
   - 짧고 명확한 키워드 사용
   - 동의어를 triggers 배열에 포함
   - 일반적인 표현 우선 사용

2. **음성 파일 최적화**
   - MP3 형식, 128kbps 권장
   - 파일 크기는 5MB 이하
   - 명확한 발음과 적절한 속도

3. **시나리오 관리**
   - 버전 관리를 위해 Git에 커밋
   - 정기적인 시나리오 검토 및 업데이트
   - 사용 통계 모니터링