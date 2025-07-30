import { useEffect, useState } from 'react';
import { isIOS } from '../utils/device';

export function useKeyboardState() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // iOS용 Visual Viewport API 활용
    if (isIOS() && 'visualViewport' in window && window.visualViewport) {
      const handleVisualViewportResize = () => {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        setIsKeyboardOpen(keyboardHeight > 50);
      };
      
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
      window.visualViewport.addEventListener('scroll', handleVisualViewportResize);
      
      return () => {
        window.visualViewport?.removeEventListener('resize', handleVisualViewportResize);
        window.visualViewport?.removeEventListener('scroll', handleVisualViewportResize);
      };
    }
    
    // 기존 로직 (non-iOS 환경)
    const handleResize = () => {
      // 모바일 브라우저에서 키보드가 열리면 viewport 높이가 감소함
      const threshold = 100; // 픽셀 단위 임계값
      const isNowOpen = window.innerHeight < window.screen.height - threshold;
      setIsKeyboardOpen(isNowOpen);
    };

    // 입력 필드 포커스 이벤트 감지
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      // 약간의 지연 후 키보드 닫힘 처리
      setTimeout(() => {
        setIsKeyboardOpen(false);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return isKeyboardOpen;
}