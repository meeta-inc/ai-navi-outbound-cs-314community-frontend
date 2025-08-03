import React, { useEffect, useState, useRef } from 'react';

interface ImageLightboxProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function ImageLightbox({ imageUrl, isOpen, onClose, title }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // 줌 초기화
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // ESC 키로 닫기, 줌 컨트롤
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // 휠로 줌
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // 드래그로 이동
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* 컨트롤 버튼들 */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {/* 줌 인 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
            aria-label="拡大"
          >
            +
          </button>
          
          {/* 줌 아웃 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
            aria-label="縮小"
          >
            -
          </button>
          
          {/* 리셋 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetZoom();
            }}
            className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors text-xs"
            aria-label="元のサイズ"
          >
            1:1
          </button>
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-colors"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
        
        {/* 이미지 컨테이너 */}
        <div 
          className="relative flex items-center justify-center w-full h-full"
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt={title || '画像プレビュー'}
            className={`max-w-full max-h-full object-contain rounded-lg transition-transform ${
              scale > 1 ? 'cursor-move' : 'cursor-zoom-in'
            } ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: 'center'
            }}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              if (scale === 1) {
                handleZoomIn();
              }
            }}
            draggable={false}
          />
        </div>
        
        {/* 줌 레벨 표시 */}
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white rounded px-3 py-1 text-sm">
          {Math.round(scale * 100)}%
        </div>
        
        {/* 사용법 안내 */}
        <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-50 text-white rounded px-3 py-2 text-xs">
          <div>マウスホイール: ズームイン/アウト</div>
          <div>クリック: 拡大 | ドラッグ: 移動</div>
          <div>キーボード: +/- (ズーム), 0 (リセット), ESC (閉じる)</div>
        </div>
        
        {/* 제목 (있는 경우) */}
        {title && (
          <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-60 text-white text-sm py-2 px-3 rounded">
            {title}
          </div>
        )}
      </div>
    </div>
  );
}