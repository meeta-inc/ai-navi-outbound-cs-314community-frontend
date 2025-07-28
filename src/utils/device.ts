/**
 * 디바이스 감지 유틸리티 함수들
 */

/**
 * iOS 디바이스 감지
 * @returns iOS 디바이스 여부 (iPad, iPhone, iPod)
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * iOS Safari 브라우저 감지
 * @returns iOS Safari 브라우저 여부
 */
export const isIOSSafari = (): boolean => {
  const ua = navigator.userAgent;
  return isIOS() && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
};

/**
 * 모바일 디바이스 감지
 * @returns 모바일 디바이스 여부
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};