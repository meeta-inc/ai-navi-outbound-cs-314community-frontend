# PostMessage 테스트 로더 페이지 기능 개선 계획 (WIP)

본 문서는 `public/test-loader.html` 페이지의 사용편의성 및 테스트 효율성을 높이기 위한 기능 추가 및 개선 계획을 정의합니다.

## 1. 개요
현재의 테스트 로더는 기본적인 필드 입력 방식만 지원하고 있어, 다양한 환경(local, dev, uat) 테스트와 복잡한 학생 데이터 입력을 수동으로 처리해야 하는 번거로움이 있습니다. 이를 개선하기 위해 환경 선택, 사용자 유형 구분, 학생 데이터 자동 선택 기능을 추가합니다.

## 2. 주요 추가 기능

### 2.1 Target URL 선택 기능 (환경별 사전 정의)
사용자가 직접 URL을 입력하는 대신, 주요 환경을 빠르게 선택할 수 있는 기능을 추가합니다.
- **UI:** Radio 버튼 또는 Select Box 형태
- **대상 및 엔드포인트:**
    - `local`: `http://localhost:5173`
    - `dev`: `https://ainavi-dev.meeta.jp`
    - `uat1`: `https://ainavi-uat1.meeta.jp`
- **동작:** 선택 시 `Target URL` 입력 필드의 값이 해당 URL로 즉시 업데이트됩니다.

### 2.2 사용자 유형 구분 (내부생 vs 외부생)
학생의 신분(내부생/외부생)에 따라 활성화되는 입력 항목을 자동으로 제어합니다.

- **UI:** "내부생(Internal)" / "외부생(External)" 라디오 버튼
- **동작 규칙:**
    - **외부생(External) 선택 시:**
        - 클라이언트 아이디 아래의 입력 항목(`App ID`, `User ID`, 맞춤 인사말 등)을 **비활성화(readonly/disabled)** 처리합니다.
        - 해당 필드들을 **공백** 또는 **미선택** 상태로 초기화합니다.
    - **내부생(Internal) 선택 시:**
        - `APP ID` 필드를 `APP001`로 초기화하고 **비활성화(readonly/disabled)** 처리합니다.
        - 클라이언트 아이디별 학생 선택 기능(2.3)을 활성화합니다.

### 2.3 내부생 학생 선택 기능 (학생 데이터 셋 활용)
특정 클라이언트 아이디에 속한 학생 정보를 쉽게 선택할 수 있도록 데이터 셋을 기반으로 한 풀다운(Select) 메뉴를 제공합니다.

- **데이터 소스:** 제공된 학생 데이터 JSON (연성회(RS000001), 아스나로(AS000003) 등)
- **동작:**
    - `Client ID`가 변경될 때마다 해당 클라이언트에 소속된 학생들의 목록을 필터링하여 풀다운에 렌더링합니다.
- **표시 규격:**
    - **Value:** `id` (UUID)
    - **Label:** `login_id` + `name` (예: `test0001 테스트太郎`)
- **연동:** 학생 선택 시 해당 학생의 `id`가 자동으로 `User ID` 필드에 주입됩니다.

## 3. 구현 상세 계획 (Development Guide)

### 3.1 UI 구조 변경
- `controls` 영역 상단에 `Environment` 섹션 추가.
- `User Type Selection` (Radio Group) 추가.
- `App ID`와 `User ID` 입력부 사이에 `Student Selection` (Select Box) 추가.

### 3.2 HTML/JS 변경점 (핵심 로직)

#### 학생 데이터 정의
```javascript
const STUDENT_DATA = [
    {"id":"06906e8a-b4f9-42e1-849e-da4eb5c02e7a","client_id":"RS000001","name":"テスト健太","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"57c46aa8-80f1-7035-c445-ed03b005a8b8","enrollment_date":"2025-07-01","login_id":"test0006","created_at":"2025-12-30 04:34:04.620746+00","updated_at":"2025-12-30 04:35:32.586654+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null},
    {"id":"36b884ba-6f1a-4f0d-99e7-a50fdb5b574f","client_id":"RS000001","name":"テスト次郎","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"57c46aa8-80f1-7035-c445-ed03b005a8b8","enrollment_date":"2025-10-20","login_id":"test0003","created_at":"2025-12-30 04:34:04.620746+00","updated_at":"2025-12-30 04:35:38.334171+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null},
    {"id":"3db5e612-525d-4ea2-92e8-e9fb384a4799","client_id":"AS000003","name":"鈴木一郎","class_id":"47c99773-131b-4f68-b93d-ef792b5d0181","teacher_id":"883bdd42-a6f9-4f15-8e36-75c1bc884565","enrollment_date":"2024-04-03","login_id":"ASTEST0003","created_at":"2026-01-21 02:06:52.147604+00","updated_at":"2026-01-22 23:24:23.702367+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":7,"school_name":"東京中学校"},
    {"id":"4310ad51-5d9a-44ed-8e76-46bf96766c39","client_id":"RS000001","name":"テスト美咲","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"57c46aa8-80f1-7035-c445-ed03b005a8b8","enrollment_date":"2025-08-05","login_id":"test0005","created_at":"2025-12-30 04:34:04.620746+00","updated_at":"2025-12-30 04:35:45.495733+00","created_by":null,"updated_by":null,"grade_id":"elementary","grade_level":null,"school_name":null},
    {"id":"4c024193-5fa1-4781-9da9-838cf391c03d","client_id":"RS000001","name":"テスト五子","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"d734aaa8-c0a1-70d5-9164-c94f5e39349f","enrollment_date":"2025-01-04","login_id":"MP0005","created_at":"2026-01-07 23:39:23.347042+00","updated_at":"2026-01-07 23:40:28.487523+00","created_by":null,"updated_by":null,"grade_id":"high","grade_level":null,"school_name":null},
    {"id":"4f53087d-33f7-45c3-82a4-18e156263cc8","client_id":"AS000003","name":"佐藤花子","class_id":"72d3dbba-9174-48b2-8213-b5f28c0988f8","teacher_id":"7dcef024-6645-485e-9f4f-ab754deecc01","enrollment_date":"2024-04-02","login_id":"ASTEST0002","created_at":"2026-01-21 02:06:52.147604+00","updated_at":"2026-01-21 02:14:36.327166+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":7,"school_name":"町田第三中学校"},
    {"id":"51f13a90-f54c-454f-bd3f-7c17294924af","client_id":"RS000001","name":"テスト愛","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"e704da48-b0d1-70de-73c2-b510009b7f6b","enrollment_date":"2025-10-01","login_id":"test0009","created_at":"2025-12-30 04:41:56.677364+00","updated_at":"2025-12-30 04:42:36.531022+00","created_by":null,"updated_by":null,"grade_id":"elementary","grade_level":null,"school_name":null},
    {"id":"5f4f17a8-49cb-42b4-8934-facd5ddae43d","client_id":"RS000001","name":"テスト三郎","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"57c46aa8-80f1-7035-c445-ed03b005a8b8","enrollment_date":"2025-09-10","login_id":"test0004","created_at":"2025-12-30 04:34:04.620746+00","updated_at":"2025-12-30 04:35:52.247123+00","created_by":null,"updated_by":null,"grade_id":"high","grade_level":null,"school_name":null},
    {"id":"7497f98d-1608-484c-be20-92d6b2dd5c9c","client_id":"RS000001","name":"テスト四郎","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"d734aaa8-c0a1-70d5-9164-c94f5e39349f","enrollment_date":"2025-01-05","login_id":"MP0004","created_at":"2026-01-07 23:39:23.347042+00","updated_at":"2026-01-07 23:40:19.303926+00","created_by":null,"updated_by":null,"grade_id":"high","grade_level":null,"school_name":null},
    {"id":"7d244af6-b2b0-4a5c-bb31-423e35c53953","client_id":"RS000001","name":"テスト翔","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"e704da48-b0d1-70de-73c2-b510009b7f6b","enrollment_date":"2025-09-15","login_id":"test0010","created_at":"2025-12-30 04:41:56.677364+00","updated_at":"2025-12-30 04:42:36.531022+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null},
    {"id":"80b3238c-4dd9-42dd-8b8e-0124c9b99cb7","client_id":"RS000001","name":"テスト大輔","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"e704da48-b0d1-70de-73c2-b510009b7f6b","enrollment_date":"2025-11-05","login_id":"test0008","created_at":"2025-12-30 04:41:56.677364+00","updated_at":"2025-12-30 04:42:36.531022+00","created_by":null,"updated_by":null,"grade_id":"high","grade_level":null,"school_name":null},
    {"id":"986238b5-c1e5-4dff-b32b-039bece713b4","client_id":"RS000001","name":"テスト花子","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"57c46aa8-80f1-7035-c445-ed03b005a8b8","enrollment_date":"2025-11-15","login_id":"test0002","created_at":"2025-12-30 04:34:04.620746+00","updated_at":"2025-12-30 04:35:57.164153+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null},
    {"id":"a80b3154-a0cf-4576-a881-e3995800db1e","client_id":"RS000001","name":"テスト一郎","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"d734aaa8-c0a1-70d5-9164-c94f5e39349f","enrollment_date":"2025-01-08","login_id":"MP0001","created_at":"2026-01-07 23:39:23.347042+00","updated_at":"2026-01-07 23:39:23.347042+00","created_by":null,"updated_by":null,"grade_id":"elementary","grade_level":null,"school_name":null},
    {"id":"b4842832-8655-42b9-85a9-4ff2201294a3","client_id":"RS000001","name":"テスト太郎","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"57c46aa8-80f1-7035-c445-ed03b005a8b8","enrollment_date":"2025-12-01","login_id":"test0001","created_at":"2025-12-14 08:56:03.692389+00","updated_at":"2025-12-30 04:36:04.228105+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null},
    {"id":"b75832b1-8667-4b69-a0d6-4620ed317304","client_id":"RS000001","name":"テスト二郎","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"d734aaa8-c0a1-70d5-9164-c94f5e39349f","enrollment_date":"2025-01-07","login_id":"MP0002","created_at":"2026-01-07 23:39:23.347042+00","updated_at":"2026-01-07 23:40:10.914936+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null},
    {"id":"bde481d6-0612-47b7-8ac7-6c3a99c3e079","client_id":"AS000003","name":"田中太郎","class_id":"220c06b4-7e22-463b-bc15-198095332296","teacher_id":"7360b537-2a0d-4e2d-b619-9c473e9af43c","enrollment_date":"2024-04-01","login_id":"ASTEST0001","created_at":"2026-01-21 02:06:52.147604+00","updated_at":"2026-01-21 02:14:01.789233+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":""},
    {"id":"f1d944d6-628d-4659-b27d-a995e8ab4096","client_id":"RS000001","name":"テスト三子","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"d734aaa8-c0a1-70d5-9164-c94f5e39349f","enrollment_date":"2025-01-06","login_id":"MP0003","created_at":"2026-01-07 23:39:23.347042+00","updated_at":"2026-01-07 23:40:15.466727+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null},
    {"id":"f2948cac-925a-48c5-abc0-40d1be40ddaf","client_id":"RS000001","name":"テスト陽子","class_id":"94ebd5a7-477e-418d-b9f7-40396cfb9ea0","teacher_id":"e704da48-b0d1-70de-73c2-b510009b7f6b","enrollment_date":"2025-12-10","login_id":"test0007","created_at":"2025-12-30 04:41:56.677364+00","updated_at":"2025-12-30 04:42:36.531022+00","created_by":null,"updated_by":null,"grade_id":"middle","grade_level":null,"school_name":null}
];
```

#### 상태 제어 로직 (Pseudo Code)
```javascript
function onUserTypeChange(type) {
    const isInternal = (type === 'internal');
    const appIdInput = document.getElementById('appId');
    const userIdInput = document.getElementById('userId');
    const clientIdSelect = document.getElementById('clientId');
    const studentSelect = document.getElementById('studentSelect');
    
    if (isInternal) {
        appIdInput.value = 'APP001';
        appIdInput.disabled = true;
        clientIdSelect.disabled = false;
        studentSelect.disabled = false;
        updateStudentList(clientIdSelect.value);
    } else {
        // 외부생 처리
        appIdInput.value = '';
        userIdInput.value = '';
        clientIdSelect.value = ''; // 선택 해제
        appIdInput.disabled = true;
        userIdInput.disabled = true;
        clientIdSelect.disabled = true;
        studentSelect.disabled = true;
        studentSelect.innerHTML = '<option value="">-- 학생 선택 --</option>';
        // 다른 필드 루프 돌며 공백 처리
    }
}

function updateStudentList(clientId) {
    const studentSelect = document.getElementById('studentSelect');
    const filtered = STUDENT_DATA.filter(s => s.client_id === clientId);
    
    studentSelect.innerHTML = '<option value="">-- 학생 선택 --</option>';
    filtered.forEach(student => {
        const opt = document.createElement('option');
        opt.value = student.id;
        opt.textContent = student.login_id + ' ' + student.name;
        studentSelect.appendChild(opt);
    });
}
```

## 4. 향후 계획 및 검증
- 개발팀 구현 후 각 환경별 접속 테스트.
- 내부생/외부생 전환 시 필드 초기화 및 비활성화 상태 정상 동작 확인.
- 학생 선택 시 User ID 주입 정확성 확인.
