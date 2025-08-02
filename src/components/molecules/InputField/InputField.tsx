import React, { useRef, useEffect, useState } from 'react';
import { useLocale } from '../../../contexts/LocaleContext';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  accentColor: AccentColor;
}

export function InputField({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  accentColor
}: InputFieldProps) {
  const { t } = useLocale();
  const colors = getColorClasses(accentColor);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPC, setIsPC] = useState(false);

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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsPC(window.innerWidth >= 500);
    };

    // 초기 설정
    checkScreenSize();

    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div 
      className="flex flex-col justify-end items-center flex-1 min-w-0 max-w-[280px]"
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
        ...(isPC && {
          width: '387px',
          maxWidth: '387px'
        })
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder || t('student.chatbot.placeholder')}
        className={`resize-none bg-transparent border-none outline-none ${colors.textBlack}`}
        style={{
          maxHeight: '270px',
          alignSelf: 'stretch',
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
  );
}