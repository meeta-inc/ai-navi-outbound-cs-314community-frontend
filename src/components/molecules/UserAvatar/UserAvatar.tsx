import React from 'react';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';
import { getSupporterName } from '../../../shared/config/chatConfig';
import AiChatbotIcon from '../../../assets/icons/Ai_Chatbot_1.svg';

interface UserAvatarProps {
  accentColor: AccentColor;
  supporterName?: string;
}

export function UserAvatar({ accentColor, supporterName }: UserAvatarProps) {
  const colors = getColorClasses(accentColor);
  const displayName = supporterName || getSupporterName();

  return (
    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0">
      <div className="relative shrink-0 size-[35px]">
        <div className={`absolute left-0 size-[35px] top-0 ${colors.background} rounded-full`}>
        </div>
        <div className="absolute left-1.5 size-6 top-1.5">
          <img 
            alt="AI Chatbot" 
            className="block max-w-none size-full filter brightness-0 invert" 
            src={AiChatbotIcon} 
          />
        </div>
      </div>
      <div
        className={`${colors.textMuted} text-[14px] font-normal leading-[20px] relative shrink-0 text-left text-nowrap`}
        style={{ fontFamily: "'Work Sans', sans-serif" }}
      >
        {displayName}
      </div>
    </div>
  );
}