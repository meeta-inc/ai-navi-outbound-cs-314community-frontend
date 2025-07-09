import React from 'react';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';
import { getAccentColor } from '../../../shared/config/app.config';
import { CategoryIcon, SendIcon } from '../../../assets/icons';
import { useLocale } from '../../../contexts/LocaleContext';
import { Button } from '../../atoms/Button';
import { InputField } from '../../molecules/InputField';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder 
}: ChatInputProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // IME 변환 중일 때는 메시지 전송하지 않음
      if (e.nativeEvent.isComposing) {
        return;
      }
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full bg-white flex justify-center items-end px-2 sm:px-4 py-4 gap-2 sm:gap-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      {/* Category Button */}
      <Button
        className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${colors.backgroundHover} hover:text-white group`}
        aria-label="카테고리"
      >
        <CategoryIcon className={`w-7 h-7 ${colors.textBlack} group-hover:text-white`} />
      </Button>
      
      {/* Input Field */}
      <InputField
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        accentColor={accentColor}
      />
      
      {/* Send Button */}
      <Button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${
          value.trim() && !disabled
            ? `${colors.backgroundHover} hover:text-white group`
            : 'cursor-not-allowed'
        }`}
        aria-label={t('student.chatbot.send')}
      >
        <SendIcon className={`w-7 h-7 transition-colors ${
          value.trim() && !disabled
            ? `${colors.text} group-hover:text-white`
            : 'text-gray-400'
        }`} />
      </Button>
    </div>
  );
}