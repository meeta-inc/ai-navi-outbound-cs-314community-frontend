import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../utils/theme';
import { getAccentColor } from '../../services/config';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder 
}: ChatInputProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="bg-white border-t" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="pt-4 px-4 pb-4 flex items-center gap-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || t('student.chatbot.placeholder')}
              className="w-full resize-none rounded-lg border-gray-200 px-4 py-3 max-h-32 min-h-[48px] focus:ring-2 focus:border-transparent"
              style={{
                '--tw-ring-color': accentColor === 'orange' ? 'rgb(249 115 22)' : 
                                  accentColor === 'blue' ? 'rgb(59 130 246)' :
                                  accentColor === 'green' ? 'rgb(34 197 94)' :
                                  'rgb(168 85 247)'
              } as React.CSSProperties}
              rows={1}
              disabled={disabled}
            />
          </div>
          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className={`w-12 h-12 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center ${
              value.trim() && !disabled
                ? `${colors.background} text-white ${colors.backgroundHover}`
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label={t('student.chatbot.send')}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}