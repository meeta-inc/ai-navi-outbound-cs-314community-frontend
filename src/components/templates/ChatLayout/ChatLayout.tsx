import React from 'react';
import { isIOS } from '../../../utils/device';
import { useIOSViewport } from '../../../hooks/useIOSViewport';

interface ChatLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  input: React.ReactNode;
  className?: string;
  showNavigationHeader?: boolean;
  // 스토리북 테스트를 위한 추가 props
  messages?: React.ReactNode;
  quickReplies?: React.ReactNode;
  faqCategory?: React.ReactNode;
}

export function ChatLayout({
  header,
  children,
  input,
  className = "",
  showNavigationHeader = false,
  messages,
  quickReplies,
  faqCategory
}: ChatLayoutProps) {
  const viewportInfo = useIOSViewport();

  // iOS에서 동적 높이 계산 (헤더가 있을 때만 적용)
  const mainContentStyle = isIOS() && showNavigationHeader && viewportInfo.chatContentHeight > 0 ? {
    height: `${viewportInfo.chatContentHeight}px`,
    maxHeight: `${viewportInfo.chatContentHeight}px`,
  } : {};

  return (
    <div className={`h-full flex flex-col bg-white ${className}`} data-testid="chat-layout">
      {/* Navigation Header */}
      {showNavigationHeader && header}
      
      {/* Main Content Area - iOS에서 헤더가 없을 때 전체 높이 사용 */}
      <div 
        className={`flex-1 flex flex-col bg-gray-50 min-h-0 ${
          isIOS() ? 'ios-dynamic-content' : ''
        } ${!showNavigationHeader && isIOS() ? 'h-full' : ''}`} 
        data-testid="main-content-area"
        style={mainContentStyle}
      >
        <div className="flex-1 overflow-y-auto">
          {/* 스토리북 테스트용 messages가 있으면 우선 사용, 없으면 children 사용 */}
          <div className="min-h-full">
            {messages || children}
          </div>
        </div>

        {/* Quick Replies Area */}
        {quickReplies && (
          <div className="flex-shrink-0 max-h-80 overflow-y-auto border-t border-gray-200">
            <div className="p-4">
              {quickReplies}
            </div>
          </div>
        )}

        {/* FAQ Category Area */}
        {faqCategory && (
          <div className="flex-shrink-0 max-h-60 overflow-y-auto border-t border-gray-200">
            <div className="p-4">
              {faqCategory}
            </div>
          </div>
        )}

        {/* Input Area - iOS에서는 fixed positioning으로 인해 별도 처리 */}
        {!isIOS() && (
          <div className="flex-shrink-0">
            {input}
          </div>
        )}
      </div>
      
      {/* iOS에서는 input을 layout 바깥에서 렌더링 */}
      {isIOS() && input}
    </div>
  );
}