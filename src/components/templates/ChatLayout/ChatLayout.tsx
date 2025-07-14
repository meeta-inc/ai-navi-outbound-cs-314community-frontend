import React from 'react';

interface ChatLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  input: React.ReactNode;
  className?: string;
  showNavigationHeader?: boolean;
}

export function ChatLayout({
  header,
  children,
  input,
  className = "",
  showNavigationHeader = false
}: ChatLayoutProps) {
  return (
    <div className={`h-screen flex flex-col bg-white overflow-hidden ${className}`}>
      {/* Navigation Header */}
      {showNavigationHeader && header}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0">
          {input}
        </div>
      </div>
    </div>
  );
}