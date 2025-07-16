import React from 'react';

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
  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Navigation Header */}
      {showNavigationHeader && header}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
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

        {/* Input Area */}
        <div className="flex-shrink-0">
          {input}
        </div>
      </div>
    </div>
  );
}