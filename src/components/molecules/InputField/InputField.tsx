import React, { useRef, useEffect, useState } from 'react';
import { useLocale } from '../../../contexts/LocaleContext';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';
import { X } from 'lucide-react';

export interface AttachedFile {
  file: File;
  preview: string;
  type: 'image' | 'pdf';
}

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  accentColor: AccentColor;
  'data-testid'?: string;
  attachedFile?: AttachedFile | null;
  onRemoveAttachment?: () => void;
}

export function InputField({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  accentColor,
  'data-testid': dataTestId,
  attachedFile,
  onRemoveAttachment
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
      {attachedFile && (
        <div className="w-full flex items-start gap-2 pt-2">
          <div className="relative group">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 bg-white">
              {attachedFile.type === 'image' ? (
                <img
                  src={attachedFile.preview}
                  alt="첨부 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              onClick={onRemoveAttachment}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
              aria-label="첨부 파일 삭제"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 truncate">{attachedFile.file.name}</p>
            <p className="text-xs text-gray-400">{(attachedFile.file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      )}
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
          fontFamily: '"Noto Sans", "Work Sans", sans-serif',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '24px',
          width: '100%',
          minHeight: '24px',
          WebkitAppearance: 'none',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
        rows={1}
        disabled={disabled}
        data-testid={dataTestId}
      />
    </div>
  );
}