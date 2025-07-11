import React from 'react';
import { Loader2 } from 'lucide-react';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';

interface TypingIndicatorProps {
  accentColor?: AccentColor;
  showLoader?: boolean;
  className?: string;
}

export function TypingIndicator({ 
  accentColor = 'orange',
  showLoader = true,
  className = ''
}: TypingIndicatorProps) {
  const colors = getColorClasses(accentColor);
  
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {showLoader && (
        <div className={`${colors.background} text-white p-2 rounded-full flex-shrink-0`}>
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      <div className={`${colors.bgLight} p-3 rounded-2xl rounded-bl-sm`}>
        <div className="flex items-center gap-1">
          <div 
            className={`w-2 h-2 ${colors.background} rounded-full animate-bounce`} 
            style={{ animationDelay: '0ms' }}
          />
          <div 
            className={`w-2 h-2 ${colors.background} rounded-full animate-bounce`} 
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className={`w-2 h-2 ${colors.background} rounded-full animate-bounce`} 
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}