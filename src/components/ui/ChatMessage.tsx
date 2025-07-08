import { UserIcon } from 'lucide-react';
import TypewriterText from './TypewriterText';
import type { Message } from '../../types';
import { getColorClasses } from '../../utils/theme';
import { useLocale } from '../../contexts/LocaleContext';
import { getAccentColor } from '../../services/config';
import { getSupporterName } from '../../config/chatConfig';
import AiChatbotIcon from '../../assets/icons/chat/Ai_Chatbot_1.svg';
import SupporterIcon from '../../assets/icons/chat/supporter-icon.svg';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}


export default function ChatMessage({ message, isTyping = false, onTypingComplete }: ChatMessageProps) {
  const { locale } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  const isBot = message.type === 'bot';
  const supporterName = getSupporterName();

  if (isBot) {
    return (
      <div className="box-border content-stretch flex flex-col items-start justify-start max-w-[287px] p-0 relative shrink-0 w-[287px]">
        {/* 서포터 아이콘과 이름 */}
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0">
          <div className="relative shrink-0 size-[35px]">
            <div className="absolute left-0 size-[35px] top-0">
              <img
                alt=""
                className="block max-w-none size-full"
                src={SupporterIcon}
              />
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
            className="text-[#b7b7b7] text-[14px] font-normal leading-[20px] relative shrink-0 text-left text-nowrap"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            {supporterName}
          </div>
        </div>

        {/* 메시지 버블 */}
        <div className="box-border content-stretch flex flex-col gap-[3px] items-start justify-start pb-0 pl-5 pr-0 pt-[3px] relative shrink-0">
          <div className="bg-navi-orange-sub2 box-border content-stretch flex flex-row gap-2 items-start justify-start max-w-[257px] px-[15px] py-2.5 relative rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shrink-0">
            <div
              className="text-[#303030] text-[14px] font-normal leading-[20px] max-w-[227px] relative shrink-0 text-left"
              style={{ fontFamily: "'Work Sans', 'Noto Sans JP', sans-serif" }}
            >
              {isTyping && typeof message.content === 'string' ? (
                <TypewriterText
                  text={message.content}
                  speed={30}
                  onComplete={onTypingComplete}
                />
              ) : (
                <div className="whitespace-pre-wrap">
                  {typeof message.content === 'string' ? message.content : message.content}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 사용자 메시지 (기존 스타일 유지)
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="max-w-[85%] order-first">
        <div className={`p-3 rounded-2xl ${colors.background} text-white rounded-br-sm`}>
          <div className="whitespace-pre-wrap">
            {typeof message.content === 'string' ? message.content : message.content}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-1 px-1 text-right">
          {message.timestamp.toLocaleTimeString(locale === 'ja' ? 'ja-JP' : locale === 'ko' ? 'ko-KR' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
          })}
        </div>
      </div>

      <div className={`${colors.background} text-white p-2 rounded-full flex-shrink-0`}>
        <UserIcon className="w-4 h-4" />
      </div>
    </div>
  );
}