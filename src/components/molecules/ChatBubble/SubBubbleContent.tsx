import React from 'react';
import { AttachmentData } from '../../../types';

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

  // URL을 감지하고 링크로 변환하는 함수
  const convertUrlsToLinks = (text: string): React.ReactNode[] => {
    // URL 패턴 정규식 (http://, https://, www. 로 시작하는 URL 감지)
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = urlPattern.exec(text)) !== null) {
      // URL 이전의 일반 텍스트 추가
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // URL을 링크로 변환
      const url = match[0];
      const href = url.startsWith('http') ? url : `https://${url}`;
      
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 hover:no-underline"
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </a>
      );

      lastIndex = match.index + url.length;
    }

    // 마지막 남은 텍스트 추가
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  // attachment type에 따른 렌더링 분기
  if (attachment) {
    if (attachment.type === 'link') {
      // link 타입: URL 변환만 수행
      return (
        <div className={`whitespace-pre-wrap ${className || ''}`}>
          {convertUrlsToLinks(processedContent)}
        </div>
      );
    } else {
      // link가 아닌 모든 타입: 텍스트만 표시 (AttachmentPreview는 ChatBubble에서 분리 렌더링)
      return (
        <div className={`whitespace-pre-wrap ${className || ''}`}>
          {convertUrlsToLinks(processedContent)}
        </div>
      );
    }
  }

  // attachment가 없는 기본 처리
  return (
    <div className={`whitespace-pre-wrap ${className || ''}`}>
      {convertUrlsToLinks(processedContent)}
    </div>
  );
}