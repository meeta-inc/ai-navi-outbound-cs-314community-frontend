import { useEffect, useState } from 'react';

export function useKeyboardState() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // 모바일 환경에서 키보드 상태 감지
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