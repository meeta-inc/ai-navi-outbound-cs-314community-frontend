import React, { useState, useEffect } from 'react';
import { PDFLightbox } from './PDFLightbox';
import { getCachedPDFThumbnail } from '../../../utils/pdfThumbnail';

interface AttachmentPreviewProps {
  pdfUrl: string;
  className?: string;
}

export function AttachmentPreview({ pdfUrl, className = '' }: AttachmentPreviewProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDF 썸네일 생성
  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const thumbnail = await getCachedPDFThumbnail(pdfUrl);
        setThumbnailUrl(thumbnail);
      } catch (err) {
        console.error('PDF 썸네일 생성 실패:', err);
        setError('썸네일을 생성할 수 없습니다');
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnail();
  }, [pdfUrl]);

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mb-1"></div>
            <span className="text-xs">로딩중...</span>
          </div>
        ) : error || !thumbnailUrl ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
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
        ) : (
          <div className="relative w-full h-full overflow-hidden rounded-md">
            <img 
              src={thumbnailUrl} 
              alt="料金プラン PDF 미리보기"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2">
              料金プラン
            </div>
          </div>
        )}
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