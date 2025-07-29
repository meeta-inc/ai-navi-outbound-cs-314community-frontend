import { useState, useEffect } from 'react';
import { isIOS } from '../utils/device';

interface IOSViewportInfo {
  hasAddressBar: boolean;
  viewportHeight: number;
  innerHeight: number;
  visualViewportHeight: number;
  addressBarHeight: number;
  chatContentHeight: number;
}

export function useIOSViewport(): IOSViewportInfo {
  const [viewportInfo, setViewportInfo] = useState<IOSViewportInfo>({
    hasAddressBar: false,
    viewportHeight: 0,
    innerHeight: 0,
    visualViewportHeight: 0,
    addressBarHeight: 0,
    chatContentHeight: 0,
  });

  useEffect(() => {
    if (!isIOS()) {
      return;
    }

    const updateViewportInfo = () => {
      const innerHeight = window.innerHeight;
      const visualViewport = window.visualViewport;
      const visualViewportHeight = visualViewport ? visualViewport.height : innerHeight;
      
      // screen.height는 디바이스의 전체 화면 높이
      // innerHeight가 screen.height보다 작으면 주소 표시창이 있는 것으로 판단
      const screenHeight = window.screen.height;
      const hasAddressBar = innerHeight < screenHeight * 0.95; // 5% 여유를 둠
      
      // 주소 표시창 높이 계산 (대략적)
      const addressBarHeight = hasAddressBar ? screenHeight - innerHeight : 0;
      
      // ChatInput 높이 (약 80px) + safe area + 여유 공간
      const chatInputHeight = 80;
      const safeAreaBottom = 34; // iPhone의 일반적인 safe area bottom
      const extraPadding = 20;
      
      // 채팅 내용 영역의 실제 사용 가능한 높이
      const chatContentHeight = visualViewportHeight - chatInputHeight - safeAreaBottom - extraPadding;

      setViewportInfo({
        hasAddressBar,
        viewportHeight: screenHeight,
        innerHeight,
        visualViewportHeight,
        addressBarHeight,
        chatContentHeight,
      });
    };

    // 초기 계산
    updateViewportInfo();

    // 뷰포트 변경 이벤트 리스너
    const handleResize = () => {
      // 약간의 지연을 두어 브라우저가 UI를 완전히 업데이트한 후 계산
      setTimeout(updateViewportInfo, 100);
    };

    const handleVisualViewportChange = () => {
      setTimeout(updateViewportInfo, 100);
    };

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      window.visualViewport.addEventListener('scroll', handleVisualViewportChange);
    }

    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
        window.visualViewport.removeEventListener('scroll', handleVisualViewportChange);
      }
    };
  }, []);

  return viewportInfo;
}