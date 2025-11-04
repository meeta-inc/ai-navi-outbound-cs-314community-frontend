import React, { useState } from 'react';
import { AttachmentData } from '../../../types';
import { ImageLightbox } from './ImageLightbox';

interface AttachmentPreviewProps {
  attachment: AttachmentData;
  className?: string;
}

export function AttachmentPreview({ attachment, className = '' }: AttachmentPreviewProps) {
  const [showLightbox, setShowLightbox] = useState(false);

  const handleClick = () => {
    if (attachment.type === 'image' || attachment.type === 'file') {
      setShowLightbox(true);
    } else {
      // 비디오나 다른 타입의 경우 (추후 구현)
      console.log('Attachment clicked:', attachment);
    }
  };

  const handleCloseLightbox = () => {
    setShowLightbox(false);
  };

  return (
    <>
      <div 
        className={`w-full h-32 cursor-pointer rounded-md border border-gray-200 ${className}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        aria-label={`${attachment.title || '添付ファイル'}プレビュー。クリックして拡大`}
      >
        <div className="relative w-full h-full overflow-hidden rounded-md">
          <img 
            src={attachment.thumbnail || attachment.url} 
            alt={`${attachment.title || '添付ファイル'}プレビュー`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* 이미지 라이트박스 */}
      {(attachment.type === 'image' || attachment.type === 'file') && (
        <ImageLightbox
          imageUrl={attachment.url}
          isOpen={showLightbox}
          onClose={handleCloseLightbox}
          title={attachment.title}
        />
      )}
    </>
  );
}