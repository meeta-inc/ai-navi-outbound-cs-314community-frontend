import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

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
    <div className="bg-white border-t">
      <div className="max-w-3xl mx-auto px-4">
        <div className="p-2 flex items-end gap-1">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || t('student.chatbot.placeholder')}
              className="w-full resize-none rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 max-h-32"
              rows={1}
              disabled={disabled}
            />
          </div>
          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
              value.trim() && !disabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
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