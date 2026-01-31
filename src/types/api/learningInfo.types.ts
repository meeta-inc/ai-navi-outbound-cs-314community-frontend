/**
 * 학생 수업 정보 등록 API 타입 정의
 */

// 학년 ID (gradeId) 열거형
export type GradeId = 'preschool' | 'elementary' | 'middle' | 'high';

// 학년 ID 한글/일본어 매핑
export const GRADE_ID_LABELS: Record<GradeId, { ja: string; ko: string }> = {
  preschool: { ja: '幼児', ko: '유아' },
  elementary: { ja: '小学生', ko: '초등학생' },
  middle: { ja: '中学生', ko: '중학생' },
  high: { ja: '高校生', ko: '고등학생' },
};

/**
 * 학생 수업 정보 등록 요청
 */
export interface RegisterLearningInfoRequest {
  // 학년 ID (필수)
  gradeId: GradeId;
  // 학년 레벨 (필수, 1~12)
  // 초등학교(1~6), 중학교(7~9), 고등학교(10~12)
  gradeLevel: number;
  // 학교명 (필수, 일본어 표기)
  schoolName: string;
}

/**
 * 학생 수업 정보 등록 성공 응답
 */
export interface RegisterLearningInfoResponse {
  // 결과 상태
  result: 'success' | 'fail';
  // 응답 시간 (ISO 8601 형식)
  timestamp: string;
  // 요청 추적 ID
  traceId: string;
}

/**
 * 과목 정보 인터페이스
 */
export interface Subject {
  // 과목 ID (예: 'math', 'english', 'science')
  subjectId: string;
  // 과목 표시명 (예: '算数', '英語')
  subjectName: string;
  // 과목 아이콘 (이모지, 옵션)
  subjectIcon?: string;
  // 정렬 우선순위
  priority: number;
}

/**
 * 과목 목록 API 응답
 */
export interface GetSubjectsListResponse {
  items: Subject[];
}

/**
 * API 에러 객체
 */
export interface LearningInfoApiError {
  // 에러 코드 (예: STUDENT_NOT_FOUND, VALIDATION_ERROR)
  code: string;
  // 에러 메시지
  message: string;
  // 상세 정보 (선택)
  details?: string;
}

/**
 * 학생 수업 정보 등록 에러 응답
 */
export interface RegisterLearningInfoErrorResponse {
  // 에러 정보
  error: LearningInfoApiError;
  // 응답 시간 (ISO 8601 형식)
  timestamp: string;
  // 요청 추적 ID
  traceId: string;
}
