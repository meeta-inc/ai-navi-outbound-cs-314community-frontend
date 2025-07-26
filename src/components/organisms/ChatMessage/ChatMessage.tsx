import type { Message, LLMResponse } from '../../../types';
import { getAccentColor, getShowTimestamp } from '../../../shared/config/app.config';
import { useLocale } from '../../../contexts/LocaleContext';
import { UserAvatar } from '../../molecules/UserAvatar';
import { ChatBubble } from '../../molecules/ChatBubble';
import { LLMResponseGroup } from '../LLMResponseGroup';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  onTypingComplete?: () => void;
  hideAvatar?: boolean;
  // LLM 응답 지원을 위한 추가 props
  llmResponse?: LLMResponse;
  enableLLMTyping?: boolean;
  // CTA 관련 props
  showCTAAfterComplete?: boolean;
  onMainCTAClick?: () => void;
  onSubCTAClick?: () => void;
  onCTADisplayed?: () => void; // CTA 표시 완료 후 스크롤 콜백
}

export function ChatMessage({ 
  message, 
  isTyping = false, 
  onTypingComplete, 
  hideAvatar = false,
  llmResponse,
  enableLLMTyping = true,
  showCTAAfterComplete = false,
  onMainCTAClick,
  onSubCTAClick,
  onCTADisplayed
}: ChatMessageProps) {
  const { locale } = useLocale();
  const accentColor = getAccentColor();
  const showTimestamp = getShowTimestamp();
  const isBot = message.type === 'bot';

  if (isBot) {
    return (
      <div className="box-border content-stretch flex flex-col items-start justify-start max-w-[287px] p-0 relative shrink-0 w-[287px]">
        {!hideAvatar && <UserAvatar accentColor={accentColor} />}
        
        {/* LLM 응답이 있으면 LLMResponseGroup 사용, 없으면 기존 ChatBubble 사용 */}
        {llmResponse ? (
          <LLMResponseGroup
            response={llmResponse}
            accentColor={accentColor}
            enableTyping={enableLLMTyping && isTyping}
            onComplete={onTypingComplete}
            showCTAAfterComplete={showCTAAfterComplete}
            onMainCTAClick={onMainCTAClick}
            onSubCTAClick={onSubCTAClick}
            onCTADisplayed={onCTADisplayed}
          />
        ) : (
          <ChatBubble
            content={message.content}
            isBot={true}
            accentColor={accentColor}
            isTyping={isTyping}
            onTypingComplete={onTypingComplete}
          />
        )}
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