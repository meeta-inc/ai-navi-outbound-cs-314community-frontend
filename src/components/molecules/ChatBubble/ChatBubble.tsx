import React from 'react';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';
import { TypewriterText } from '../../atoms/Typography';
import { BubbleResponse, AttachmentData } from '../../../types';
import { isIOS } from '../../../utils/device';
import { SubBubbleContent } from './SubBubbleContent';

interface ChatBubbleProps {
  content: string | React.ReactNode;
  isBot: boolean;
  accentColor: AccentColor;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  // 새로운 LLM 응답 타입 지원
  bubbleType?: BubbleResponse['type'];
  attachment?: AttachmentData | null;
}

export function ChatBubble({ 
  content, 
  isBot, 
  accentColor, 
  isTyping = false, 
  onTypingComplete,
  bubbleType = 'main',
  attachment
}: ChatBubbleProps) {
  const colors = getColorClasses(accentColor);
  const [localTypingComplete, setLocalTypingComplete] = React.useState(!isTyping);
  
  // 타이핑 완료 콜백 처리
  const handleTypingComplete = React.useCallback(() => {
    setLocalTypingComplete(true);
    onTypingComplete?.();
  }, [onTypingComplete]);
  
  // 150자 제한 (main 타입일 때만)
  const displayContent = bubbleType === 'main' && typeof content === 'string' && content.length > 150 
    ? content.substring(0, 150) + '...'
    : content;

  if (isBot) {
    return (
      <div className="box-border content-stretch flex flex-col gap-[3px] items-start justify-start pb-0 pl-5 pr-0 pt-[3px] relative shrink-0">
        <div 
          className={`${colors.bgLight} box-border content-stretch flex flex-col gap-2 max-w-[257px] px-[15px] py-2.5 relative rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shrink-0`}
          data-testid={`${bubbleType}-bubble`}
          role="article"
          aria-label="AI 응답 메시지"
        >
          <div
            className={`${colors.textSecondary} max-w-[227px] relative shrink-0 text-left meeta-text-mid-regular`}
            data-testid="bubble-text"
          >
            {isTyping && typeof displayContent === 'string' ? (
              <TypewriterText
                text={displayContent}
                speed={isIOS() ? 50 : 30}
                onComplete={handleTypingComplete}
              />
            ) : (
              bubbleType === 'sub' && typeof displayContent === 'string' ? (
                <SubBubbleContent 
                  content={displayContent} 
                  isTypingComplete={localTypingComplete}
                />
              ) : (
                <div className="whitespace-pre-wrap">
                  {typeof displayContent === 'string' ? displayContent : displayContent}
                </div>
              )
            )}
          </div>
          
          {/* 첨부파일 렌더링 */}
          {attachment && (
            <div className="mt-2">
              {attachment.type === 'link' && (
                <a 
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${colors.text} underline hover:no-underline meeta-text-mid-regular`}
                >
                  {attachment.title || '링크 보기'}
                </a>
              )}
              
              {attachment.type === 'image' && (
                <img 
                  src={attachment.thumbnail || attachment.url}
                  alt={attachment.title || '첨부 이미지'}
                  className="rounded-md max-w-full h-auto cursor-pointer"
                  onClick={() => window.open(attachment.url, '_blank')}
                />
              )}
              
              {attachment.type === 'video' && (
                <video 
                  src={attachment.url}
                  controls
                  className="rounded-md max-w-full h-auto"
                  poster={attachment.thumbnail}
                >
                  <track kind="captions" />
                </video>
              )}
              
              {attachment.type === 'file' && (
                <a 
                  href={attachment.url}
                  download
                  className={`${colors.text} underline hover:no-underline meeta-text-mid-regular flex items-center gap-1`}
                >
                  <span>📎</span>
                  {attachment.title || '파일 다운로드'}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 사용자 메시지
  return (
    <div className="box-border content-stretch flex flex-col gap-[3px] items-end justify-start p-0 relative size-full">
      <div className="flex items-center justify-center max-w-[257px] relative shrink-0">
        <div className="bg-[#ebebeb] box-border content-stretch flex flex-row gap-2 items-start justify-start px-[15px] py-2.5 relative rounded-tl-[10px] rounded-bl-[10px] rounded-br-[10px]">
          <div className="flex items-center justify-center max-w-[227px] relative shrink-0">
            <div
              className="relative text-[#303030] text-left meeta-text-mid-regular"
            >
              <div className="whitespace-pre-wrap">
                {typeof content === 'string' ? content : content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}