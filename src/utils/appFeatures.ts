/**
 * 앱 기능 관련 유틸리티 함수들
 */

/**
 * 내부생(Inbound) 앱 여부를 확인하는 함수
 * @param appId - 애플리케이션 ID
 * @returns 내부생 앱이면 true, 아니면 false
 */
export const isInboundApp = (appId: string): boolean => {
  return appId === 'APP001';
};

/**
 * FAQ 기능 활성화 여부를 확인하는 함수
 * @param appId - 애플리케이션 ID
 * @returns FAQ 기능이 활성화되어 있으면 true, 비활성화되어 있으면 false
 */
export const isFAQEnabled = (appId: string): boolean => {
  // 내부생 앱의 경우 FAQ 기능 비활성화
  return !isInboundApp(appId);
};

/**
 * 앱별 기능 설정을 가져오는 함수
 * @param appId - 애플리케이션 ID
 * @returns 앱별 기능 설정 객체
 */
export const getAppFeatures = (appId: string) => {
  return {
    faq: isFAQEnabled(appId),
    // 추후 다른 기능들도 추가 가능
  };
};