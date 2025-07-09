import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../shared/config/theme.config';
import { getAccentColor } from "../../shared/config/app.config";

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
    <div className={`${colors.bgWhite} border-t`} style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="pt-4 px-4 pb-4 flex items-center gap-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || t('student.chatbot.placeholder')}
              className={`w-full resize-none rounded-lg ${colors.border} px-4 py-3 max-h-32 min-h-[48px] focus:ring-2 focus:border-transparent ${colors.ring}`}
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
                : `${colors.bgHover} ${colors.textMuted} cursor-not-allowed`
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