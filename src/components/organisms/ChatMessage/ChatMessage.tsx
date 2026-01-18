import React from 'react';
import type { Message, LLMResponse } from '../../../types';
import { getAccentColor, getShowTimestamp } from '../../../shared/config/app.config';
import { useLocale } from '../../../contexts/LocaleContext';
import { UserAvatar } from '../../molecules/UserAvatar';
import { ChatBubble } from '../../molecules/ChatBubble';
import { LLMResponseGroup } from '../LLMResponseGroup';
import { ImagePreviewModal } from '../../molecules/ImagePreviewModal';

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
  clientId?: string; // clientId 추가
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
  onCTADisplayed,
  clientId
}: ChatMessageProps) {
  const { locale } = useLocale();
  const accentColor = getAccentColor();
  const showTimestamp = getShowTimestamp();
  const isBot = message.type === 'bot';
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
            clientId={clientId}
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
      {/* 첨부된 이미지가 있으면 표시 */}
      {message.imageUrl && (
        <>
          <div
            className="max-w-[200px] rounded-lg overflow-hidden mb-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={message.imageUrl}
              alt="添付画像"
              className="w-full h-auto object-contain"
              style={{ maxHeight: '300px' }}
            />
          </div>

          {/* 이미지 프리뷰 모달 */}
          <ImagePreviewModal
            isOpen={isModalOpen}
            imageUrl={message.imageUrl}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
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