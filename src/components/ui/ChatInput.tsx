import React, { useRef, useEffect } from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../shared/config/theme.config';
import { getAccentColor } from "../../shared/config/app.config";
import { CategoryIcon, SendIcon } from '../../assets/icons';

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    <div className="w-full bg-white flex justify-center items-end px-2 sm:px-4 py-4 gap-2 sm:gap-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      {/* Category Button */}
      <button 
        className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${colors.backgroundHover} hover:text-white group`}
        aria-label="카테고리"
      >
        <CategoryIcon className={`w-5 h-5 ${colors.textBlack} group-hover:text-white`} />
      </button>
      
      {/* Input Field */}
      <div 
        className="flex flex-col justify-end items-center flex-1 min-w-0 max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[387px]"
        style={{
          display: 'flex',
          maxHeight: '300px',
          padding: '5px 15px',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '10px',
          background: '#EBEBEB',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('student.chatbot.placeholder')}
          className="resize-none bg-transparent border-none outline-none"
          style={{
            maxHeight: '270px',
            alignSelf: 'stretch',
            color: '#B7B7B7',
            fontFamily: 'Work Sans',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '24px',
            width: '100%',
            minHeight: '24px',
          }}
          rows={1}
          disabled={disabled}
        />
      </div>
      
      {/* Send Button */}
      <button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${
          value.trim() && !disabled
            ? `${colors.backgroundHover} hover:text-white group`
            : 'cursor-not-allowed'
        }`}
        aria-label={t('student.chatbot.send')}
      >
        <SendIcon className={`w-5 h-5 transition-colors ${
          value.trim() && !disabled
            ? `${colors.text} group-hover:text-white`
            : 'text-gray-400'
        }`} />
      </button>
    </div>
  );
}