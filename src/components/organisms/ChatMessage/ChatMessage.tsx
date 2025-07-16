import React from 'react';
import type { Message } from '../../../types';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';
import { getAccentColor, getShowTimestamp } from '../../../shared/config/app.config';
import { useLocale } from '../../../contexts/LocaleContext';
import { UserAvatar } from '../../molecules/UserAvatar';
import { ChatBubble } from '../../molecules/ChatBubble';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  hideAvatar?: boolean;
}

export function ChatMessage({ message, isTyping = false, onTypingComplete, hideAvatar = false }: ChatMessageProps) {
  const { locale } = useLocale();
  const accentColor = getAccentColor();
  const showTimestamp = getShowTimestamp();
  const colors = getColorClasses(accentColor);
  const isBot = message.type === 'bot';

  if (isBot) {
    return (
      <div className="box-border content-stretch flex flex-col items-start justify-start max-w-[287px] p-0 relative shrink-0 w-[287px]">
        {!hideAvatar && <UserAvatar accentColor={accentColor} />}
        <ChatBubble
          content={message.content}
          isBot={true}
          accentColor={accentColor}
          isTyping={isTyping}
          onTypingComplete={onTypingComplete}
        />
      </div>
    );
  }

  // 사용자 메시지
  return (
    <div className="box-border content-stretch flex flex-col gap-[3px] items-end justify-start p-0 relative size-full">
      <ChatBubble
        content={message.content}
        isBot={false}
        accentColor={accentColor}
      />
      
      {showTimestamp && (
        <div className="text-xs text-[#666666] mt-1 px-1 text-right">
          {message.timestamp.toLocaleTimeString(locale === 'ja' ? 'ja-JP' : locale === 'ko' ? 'ko-KR' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
          })}
        </div>
      )}
    </div>
  );
}