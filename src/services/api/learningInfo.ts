import { getStudentFrontApiUrl } from '../../shared/config/app.config';
import type {
  RegisterLearningInfoRequest,
  RegisterLearningInfoResponse,
  RegisterLearningInfoErrorResponse,
  GradeId,
  Subject,
  GetSubjectsListResponse,
} from '../../types/api/learningInfo.types';

/**
 * 학생 수업 정보를 등록합니다 (온보딩).
 *
 * @param studentId - 학생 고유 ID (예: ST001)
 * @param request - 수업 정보 등록 요청 데이터
 * @returns 등록 결과 응답
 * @throws 등록 실패 시 에러
 */
export const registerLearningInfo = async (
  studentId: string,
  request: RegisterLearningInfoRequest
): Promise<RegisterLearningInfoResponse> => {
  const baseUrl = getStudentFrontApiUrl();
  const url = `${baseUrl}/students/${encodeURIComponent(studentId)}/learning-info`;

  // 디버깅용 로그
  console.log('registerLearningInfo - API URL:', url);
  console.log('registerLearningInfo - Request:', request);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // 에러 응답 파싱
      const errorData: RegisterLearningInfoErrorResponse = await response.json().catch(() => ({
        error: {
          code: 'REGISTER_ERROR',
          message: `HTTP error! status: ${response.status}`,
        },
        timestamp: new Date().toISOString(),
        traceId: 'unknown',
      }));

      // 특정 에러 코드에 따른 메시지 처리
      if (errorData.error.code === 'STUDENT_NOT_FOUND') {
        throw new Error('学生情報が見つかりません。');
      }

      throw new Error(errorData.error.message || '学習情報の登録に失敗しました。');
    }

    const data: RegisterLearningInfoResponse = await response.json();
    return data;

  } catch (error) {
    console.error('学習情報登録中にエラーが発生しました:', error);
    console.error('registerLearningInfo - Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      url: url,
    });

    if (error instanceof Error) {
      // TypeError: Failed to fetch는 네트워크 오류 또는 CORS 문제
      if (error.message === 'Failed to fetch') {
        throw new Error('サーバーに接続できません。ネットワーク接続を確認してください。');
      }
      throw error;
    }

    throw new Error('学習情報の登録に失敗しました。もう一度お試しください。');
  }
};

/**
 * Student Front API를 통해 과목 목록을 조회합니다.
 *
 * @param clientId - 클라이언트 ID (예: RS000001)
 * @returns 과목 목록 (Subject[]) 또는 null
 */
export const getSubjects = async (
  clientId: string,
  studentId: string,
  gradeId?: string
): Promise<Subject[] | null> => {
  const baseUrl = getStudentFrontApiUrl();
  const params = new URLSearchParams({ clientId, studentId });
  if (gradeId) {
    params.set('gradeId', gradeId);
  }
  const url = `${baseUrl}/subjects?${params}`;

  console.log('getSubjects - API URL:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('getSubjects - API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('getSubjects - Response:', data);
    console.log('getSubjects - Response type:', typeof data, Array.isArray(data));

    // 배열 형태의 응답 처리 (예: [{subjectId, subjectName, ...}])
    if (Array.isArray(data)) {
      return data;
    }
    // { items: [...] } 형태의 응답 처리
    if (data && data.items) {
      return data.items;
    }
    // { subjects: [...] } 형태의 응답 처리
    if (data && data.subjects) {
      return data.subjects;
    }
    console.warn('getSubjects - Unexpected response format:', Object.keys(data));
    return null;
  } catch (error) {
    console.error('教科リスト取得中にエラーが発生しました:', error);
    return null;
  }
};

/**
 * gradeLevel 유효성을 검사합니다.
 *
 * @param gradeLevel - 학년 레벨 (1~12)
 * @returns 유효한 학년 레벨인지 여부
 */
export const isValidGradeLevel = (gradeLevel: number): boolean => {
  return Number.isInteger(gradeLevel) && gradeLevel >= 1 && gradeLevel <= 12;
};

/**
 * gradeId와 gradeLevel의 조합이 유효한지 검사합니다.
 *
 * @param gradeId - 학년 ID
 * @param gradeLevel - 학년 레벨
 * @returns 유효한 조합인지 여부
 */
export const isValidGradeCombination = (gradeId: GradeId, gradeLevel: number): boolean => {
  switch (gradeId) {
    case 'preschool':
      // 유아는 별도 레벨 없음 (1로 고정하거나 별도 처리)
      return gradeLevel >= 1 && gradeLevel <= 3;
    case 'elementary':
      // 초등학교: 1~6학년
      return gradeLevel >= 1 && gradeLevel <= 6;
    case 'middle':
      // 중학교: 7~9 (또는 1~3)
      return gradeLevel >= 7 && gradeLevel <= 9;
    case 'high':
      // 고등학교: 10~12 (또는 1~3)
      return gradeLevel >= 10 && gradeLevel <= 12;
    default:
      return false;
  }
};

/**
 * 학교명 유효성을 검사합니다.
 *
 * @param schoolName - 학교명
 * @returns 유효한 학교명인지 여부
 */
export const isValidSchoolName = (schoolName: string): boolean => {
  return typeof schoolName === 'string' && schoolName.trim().length > 0;
};

/**
 * 학습 정보 등록 요청 데이터 전체 유효성을 검사합니다.
 *
 * @param request - 등록 요청 데이터
 * @returns 유효성 검사 결과
 */
export const validateLearningInfoRequest = (
  request: RegisterLearningInfoRequest
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!request.gradeId) {
    errors.push('学年IDは必須です。');
  }

  if (!isValidGradeLevel(request.gradeLevel)) {
    errors.push('学年レベルは1から12の間で入力してください。');
  }

  if (request.gradeId && request.gradeLevel && !isValidGradeCombination(request.gradeId, request.gradeLevel)) {
    errors.push('学年IDと学年レベルの組み合わせが正しくありません。');
  }

  if (!isValidSchoolName(request.schoolName)) {
    errors.push('学校名は必須です。');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
