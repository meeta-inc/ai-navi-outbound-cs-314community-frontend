import React, { useState, useRef } from 'react';
import { useIOSViewport } from '../../../hooks/useIOSViewport';
import { isIOS } from '../../../utils/device';

interface IOSViewportDebugProps {
  enabled?: boolean;
}

export function IOSViewportDebug({ enabled = false }: IOSViewportDebugProps) {
  const viewportInfo = useIOSViewport();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  // URL 파라미터로 디버그 모드 확인 (예: ?debug=viewport)
  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug') === 'viewport';

  if ((!enabled && !debugMode) || !isIOS()) {
    return null;
  }

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const eventPos = getEventPosition(e.nativeEvent as MouseEvent | TouchEvent);
    dragRef.current = {
      startX: eventPos.x,
      startY: eventPos.y,
      startPosX: position.x,
      startPosY: position.y
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const eventPos = getEventPosition(e);
      const deltaX = eventPos.x - dragRef.current.startX;
      const deltaY = eventPos.y - dragRef.current.startY;
      
      // 드래그 거리가 3px 이상이면 드래그로 간주 (더 민감하게)
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        setIsDragging(true);
      }

      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 220, dragRef.current.startPosX + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - 100, dragRef.current.startPosY + deltaY))
      });
    };

    const handlePointerEnd = () => {
      document.removeEventListener('mousemove', handlePointerMove as EventListener);
      document.removeEventListener('mouseup', handlePointerEnd);
      document.removeEventListener('touchmove', handlePointerMove as EventListener);
      document.removeEventListener('touchend', handlePointerEnd);
      
      // 드래그 상태를 약간 지연 후 리셋 (클릭 이벤트와 충돌 방지)
      setTimeout(() => setIsDragging(false), 150);
    };

    // 마우스와 터치 이벤트 모두 등록
    document.addEventListener('mousemove', handlePointerMove as EventListener);
    document.addEventListener('mouseup', handlePointerEnd);
    document.addEventListener('touchmove', handlePointerMove as EventListener, { passive: false });
    document.addEventListener('touchend', handlePointerEnd);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        borderRadius: '6px',
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: '11px',
        lineHeight: '1.3',
        minWidth: '200px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: isDragging ? 'none' : 'all 0.2s ease'
      }}
    >
      {/* Header with toggle button */}
      <div 
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={toggleCollapse}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          background: isDragging ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '6px 6px 0 0',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          borderBottom: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          touchAction: 'none',
          transition: 'background 0.2s ease'
        }}
      >
        <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
          {isDragging ? '🖱️' : '📱'} iOS Viewport {isDragging ? '(드래그 중)' : ''}
        </span>
        <span 
          style={{ 
            fontSize: '14px',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            display: 'inline-block'
          }}
        >
          ▼
        </span>
      </div>

      {/* Content area */}
      {!isCollapsed && (
        <div style={{ padding: '10px 12px' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#ffd700' }}>주소창:</span>{' '}
            <span style={{ color: viewportInfo.hasAddressBar ? '#ff6b6b' : '#51cf66' }}>
              {viewportInfo.hasAddressBar ? '있음' : '없음'}
            </span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#74c0fc' }}>Screen:</span>{' '}
            <span>{viewportInfo.viewportHeight}px</span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#74c0fc' }}>Inner:</span>{' '}
            <span>{viewportInfo.innerHeight}px</span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#74c0fc' }}>Visual:</span>{' '}
            <span>{viewportInfo.visualViewportHeight}px</span>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#ffa8a8' }}>주소창 높이:</span>{' '}
            <span>{viewportInfo.addressBarHeight}px</span>
          </div>
          <div style={{ 
            marginBottom: '4px',
            padding: '4px 6px',
            background: 'rgba(81, 207, 102, 0.2)',
            borderRadius: '3px',
            border: '1px solid rgba(81, 207, 102, 0.3)'
          }}>
            <span style={{ color: '#51cf66', fontWeight: 'bold' }}>채팅 높이:</span>{' '}
            <span style={{ color: '#51cf66', fontWeight: 'bold' }}>
              {viewportInfo.chatContentHeight}px
            </span>
          </div>
          
          {/* Additional info */}
          <div style={{ 
            marginTop: '8px',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '6px'
          }}>
            💡 헤더 클릭: 접기/펼치기<br/>
            🖱️ 헤더 드래그: 위치 이동
          </div>
        </div>
      )}
    </div>
  );
}