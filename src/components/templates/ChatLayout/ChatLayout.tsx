import React from 'react';

interface ChatLayoutProps {
  header: React.ReactNode;
  messages: React.ReactNode;
  input: React.ReactNode;
  quickReplies?: React.ReactNode;
  faqCategory?: React.ReactNode;
  className?: string;
}

export function ChatLayout({
  header,
  messages,
  input,
  quickReplies,
  faqCategory,
  className = ""
}: ChatLayoutProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      {header}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages}
        
        {/* Quick Replies */}
        {quickReplies}
        
        {/* FAQ Category */}
        {faqCategory}
      </div>
      
      {/* Input Area */}
      {input}
    </div>
  );
}