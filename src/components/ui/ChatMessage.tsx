import TypewriterText from './TypewriterText';
import type { Message } from '../../types';
import { getColorClasses } from '../../shared/config/theme.config';
import { getAccentColor, getShowTimestamp } from '../../shared/config/app.config';
import { useLocale } from '../../contexts/LocaleContext';
import { getSupporterName } from '../../shared/config/chatConfig';
import AiChatbotIcon from '../../assets/icons/Ai_Chatbot_1.svg';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  onTypingComplete?: () => void;
}


export default function ChatMessage({ message, isTyping = false, onTypingComplete }: ChatMessageProps) {
  const { locale } = useLocale();
  const accentColor = getAccentColor();
  const showTimestamp = getShowTimestamp();
  const colors = getColorClasses(accentColor);
  const isBot = message.type === 'bot';
  const supporterName = getSupporterName();

  if (isBot) {
    return (
      <div className="box-border content-stretch flex flex-col items-start justify-start max-w-[287px] p-0 relative shrink-0 w-[287px]">
        {/* 서포터 아이콘과 이름 */}
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
            {supporterName}
          </div>
        </div>

        {/* 메시지 버블 */}
        <div className="box-border content-stretch flex flex-col gap-[3px] items-start justify-start pb-0 pl-5 pr-0 pt-[3px] relative shrink-0">
          <div className={`${colors.bgLight} box-border content-stretch flex flex-row gap-2 items-start justify-start max-w-[257px] px-[15px] py-2.5 relative rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] shrink-0`}>
            <div
              className={`${colors.textSecondary} text-[14px] font-normal leading-[20px] max-w-[227px] relative shrink-0 text-left`}
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

  // 사용자 메시지 (Figma 디자인에 맞춤)
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
                {typeof message.content === 'string' ? message.content : message.content}
              </div>
            </div>
          </div>
        </div>
      </div>
      
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