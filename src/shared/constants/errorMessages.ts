/**
 * 에러 메시지 상수 정의
 * 애플리케이션 전반에서 사용되는 에러 메시지들을 중앙에서 관리
 */

export const ERROR_MESSAGES = {
  /**
   * LLM 일시적 에러 메시지
   * 사용 시나리오:
   * - LLM Response가 빈 배열일 때
   * - LLM Response 상태코드가 200이 아닌 경우
   * - 네트워크 에러 발생 시
   * - API 타임아웃 발생 시
   */
  LLM_TEMPORARY_ERROR: '申し訳ありません😭一時的なエラーが発生しています。一度チャットを閉じてから再度お試しください。',
  
  /**
   * 한국어 번역 버전 (필요시 사용)
   */
  LLM_TEMPORARY_ERROR_KO: '죄송합니다😭일시적인 오류가 발생하고 있습니다. 한번 채팅을 닫고 다시 시도해주세요.',
} as const;

/**
 * 에러 메시지 타입 정의
 */
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

/**
 * 에러 메시지 유틸리티 함수들
 */
export const ErrorMessageUtils = {
  /**
   * 에러 메시지 키로 메시지 가져오기
   */
  getMessage: (key: ErrorMessageKey): string => {
    return ERROR_MESSAGES[key];
  },
  
  /**
   * LLM 에러 메시지 가져오기 (기본 일본어)
   */
  getLLMErrorMessage: (): string => {
    return ERROR_MESSAGES.LLM_TEMPORARY_ERROR;
  },
  
  /**
   * LLM 에러 메시지 가져오기 (한국어)
   */
  getLLMErrorMessageKo: (): string => {
    return ERROR_MESSAGES.LLM_TEMPORARY_ERROR_KO;
  },
} as const;