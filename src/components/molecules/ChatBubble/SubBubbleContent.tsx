import React from 'react';
import { AttachmentData } from '../../../types';
import { parseTextContent } from '../../../utils/textFormatUtils';

interface SubBubbleContentProps {
  content: string;
  className?: string;
  isTypingComplete?: boolean;
  attachment?: AttachmentData | null;
}

export function SubBubbleContent({ content, className, isTypingComplete = true, attachment }: SubBubbleContentProps) {
  // (image) 텍스트 제거
  const processedContent = content.includes('(image)')
    ? content.replace('(image)', '').trim()
    : content;

  // attachment type에 따른 렌더링 분기
  if (attachment) {
    if (attachment.type === 'link') {
      // link 타입: URL 및 볼드 변환 수행
      return (
        <div className={`whitespace-pre-wrap ${className || ''}`}>
          {parseTextContent(processedContent)}
        </div>
      );
    } else {
      // link가 아닌 모든 타입: 텍스트만 표시 (AttachmentPreview는 ChatBubble에서 분리 렌더링)
      return (
        <div className={`whitespace-pre-wrap ${className || ''}`}>
          {parseTextContent(processedContent)}
        </div>
      );
    }
  }

  // attachment가 없는 기본 처리
  return (
    <div className={`whitespace-pre-wrap ${className || ''}`}>
      {parseTextContent(processedContent)}
    </div>
  );
}