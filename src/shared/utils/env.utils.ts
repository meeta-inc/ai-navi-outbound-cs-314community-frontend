/**
 * @fileoverview 환경변수 유틸리티
 * 
 * Jest 테스트 환경과 브라우저 환경에서 안전하게 환경변수에 접근할 수 있는 유틸리티
 */

/**
 * 브라우저 환경에서 안전하게 Vite 환경변수에 접근
 */
export const getViteEnv = (key: string): string | undefined => {
  // Jest 테스트 환경에서는 환경변수 접근 건너뛰기
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return undefined;
  }
  
  if (typeof jest !== 'undefined') {
    return undefined;
  }
  
  try {
    // 브라우저 환경에서는 직접 import.meta에 접근 가능
    // Jest 환경에서는 위에서 이미 리턴했으므로 여기까지 오지 않음
    return (import.meta as any)?.env?.[key];
  } catch (error) {
    // import.meta에 접근할 수 없는 환경에서는 undefined 리턴
    console.warn(`Failed to access environment variable ${key}:`, error);
    return undefined;
  }
};