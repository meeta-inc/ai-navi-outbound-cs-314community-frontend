import React, { useState } from 'react';
import { PDFLightbox } from './PDFLightbox';

interface AttachmentPreviewProps {
  pdfUrl: string;
  className?: string;
}

export function AttachmentPreview({ pdfUrl, className = '' }: AttachmentPreviewProps) {
  const [showLightbox, setShowLightbox] = useState(false);

  const handleClick = () => {
    setShowLightbox(true);
  };

  const handleClose = () => {
    setShowLightbox(false);
  };

  return (
    <>
      <div 
        className={`sub-bubble-attachment-preview ${className}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        aria-label="料金プランPDFのプレビュー。クリックで拡大表示"
      >
        <div className="text-gray-500 text-sm">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mb-1"
          >
            <path 
              d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C19 20.1046 20.1046 19 19 19V5C19 3.89543 20.1046 3 19 3Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M7 7H12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M7 11H16" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M7 15H10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xs">料金プラン</span>
        </div>
      </div>
      
      {showLightbox && (
        <PDFLightbox 
          pdfUrl={pdfUrl}
          isOpen={showLightbox}
          onClose={handleClose}
        />
      )}
    </>
  );
}