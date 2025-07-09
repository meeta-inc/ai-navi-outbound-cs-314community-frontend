import React from 'react';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';
import { TypewriterText } from '../../atoms/Typography';

interface ChatBubbleProps {
  content: string | React.ReactNode;
  isBot: boolean;
  accentColor: AccentColor;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}

export function ChatBubble({ 
  content, 
  isBot, 
  accentColor, 
  isTyping = false, 
  onTypingComplete 
}: ChatBubbleProps) {
  const colors = getColorClasses(accentColor);

  if (isBot) {
    return (
      <div className="box-border content-stretch flex flex-col gap-[3px] items-start justify-start pb-0 pl-5 pr-0 pt-[3px] relative shrink-0">
        <div className={`${colors.bgLight} box-border content-stretch flex flex-row gap-2 items-start justify-start max-w-[257px] px-[15px] py-2.5 relative rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shrink-0`}>
          <div
            className={`${colors.textSecondary} text-[14px] font-normal leading-[20px] max-w-[227px] relative shrink-0 text-left`}
            style={{ fontFamily: "'Work Sans', 'Noto Sans JP', sans-serif" }}
          >
            {isTyping && typeof content === 'string' ? (
              <TypewriterText
                text={content}
                speed={30}
                onComplete={onTypingComplete}
              />
            ) : (
              <div className="whitespace-pre-wrap">
                {typeof content === 'string' ? content : content}
              </div>
            )}
          </div>
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
              className="font-['Work_Sans:Regular',_'Noto_Sans_JP:Regular',_sans-serif] font-normal leading-[20px] relative text-[#303030] text-[14px] text-left"
              style={{ fontFamily: "'Work Sans', 'Noto Sans JP', sans-serif" }}
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