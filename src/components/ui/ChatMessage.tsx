import { Bot, UserIcon } from 'lucide-react';
import TypewriterText from './TypewriterText';
import type { Message } from '../../types';
import { getColorClasses } from '../../utils/theme';
import { useLocale } from '../../contexts/LocaleContext';
import { getAccentColor } from '../../services/config';

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

  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'justify-end'}`}>
      {isBot && (
        <div className={`${colors.background} text-white p-2 rounded-full flex-shrink-0`}>
          <Bot className="w-4 h-4" />
        </div>
      )}
      
      <div className={`max-w-[85%] ${isBot ? '' : 'order-first'}`}>
        <div
          className={`p-3 rounded-2xl ${
            isBot
              ? 'bg-gray-100 text-gray-800 rounded-bl-sm'
              : `${colors.background} text-white rounded-br-sm`
          }`}
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
        
        <div className={`text-xs text-gray-500 mt-1 px-1 ${isBot ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString(locale === 'ja' ? 'ja-JP' : locale === 'ko' ? 'ko-KR' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
          })}
        </div>
      </div>

      {!isBot && (
        <div className={`${colors.background} text-white p-2 rounded-full flex-shrink-0`}>
          <UserIcon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}