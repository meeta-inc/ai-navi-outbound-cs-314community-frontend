import React, { useState, useEffect } from 'react';
import { getColorClasses } from '../../../shared/config/theme.config';
import { getAccentColor } from '../../../shared/config/app.config';
import { SendIcon, CategoryIcon } from '../../../assets/icons';
import { useLocale } from '../../../contexts/LocaleContext';
import { Button } from '../../atoms/Button';
import { InputField } from '../../molecules/InputField';
import { MenuModal } from '../MenuModal';
import { MenuService } from '../../../services/menuService';
import { useKeyboardState } from '../../../hooks/useKeyboardState';
import { isIOS } from '../../../utils/device';
import type { MenuConfig, MenuItem } from '../../../shared/config/menuConfig';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  clientId?: string;
  onMenuItemClick?: (item: MenuItem) => void;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  placeholder,
  clientId = 'default',
  onMenuItemClick
}: ChatInputProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  
  // 메뉴 모달 상태 관리
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null);
  const isKeyboardOpen = useKeyboardState();

  // 고객사별 메뉴 설정 가져오기
  useEffect(() => {
    const config = MenuService.getMenuConfig(clientId);
    setMenuConfig(config);
  }, [clientId]);

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

  const handleMenuClick = () => {
    // disabled 상태일 때는 메뉴 열기 방지
    if (disabled) {
      return;
    }
    
    // 키보드가 열려있으면 키보드가 닫힐 때까지 대기
    if (isKeyboardOpen) {
      // input에서 포커스 제거
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur();
      }
      
      // 키보드가 닫힌 후 메뉴 모달 열기
      setTimeout(() => {
        setIsMenuModalOpen(true);
      }, 300);
    } else {
      setIsMenuModalOpen(true);
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    setIsMenuModalOpen(false);
  };

  // iOS 전용 스타일 적용
  const containerStyle = isIOS() ? {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    // paddingBottom 제거 - CSS 클래스에서 처리
    background: 'white',
    borderTop: '1px solid #e5e7eb'
  } : {
    paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
  };

  return (
    <div 
      className={`w-full bg-white flex justify-center items-end px-2 sm:px-4 py-4 gap-2 sm:gap-3 ${
        isIOS() ? 'ios-chat-input-fixed transform-gpu will-change-transform' : ''
      }`}
      style={containerStyle}>
      {/* Menu Button */}
      <Button
        onClick={handleMenuClick}
        disabled={disabled}
        className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex justify-center items-center flex-shrink-0 transition-colors ${
          disabled 
            ? 'cursor-not-allowed' 
            : `${colors.backgroundHover} hover:text-white group`
        }`}
        aria-label="メニュー"
      >
        <CategoryIcon className={`w-6 h-6 transition-colors ${
          disabled 
            ? 'text-gray-400' 
            : `${colors.textBlack} group-hover:text-white`
        }`} />
      </Button>
      
      {/* Input Field */}
      <InputField
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        accentColor={accentColor}
        data-testid="chat-input"
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

      {/* Menu Modal */}
      {menuConfig && (
        <MenuModal
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          menuConfig={menuConfig}
          accentColor={accentColor}
          onMenuItemClick={handleMenuItemClick}
        />
      )}
    </div>
  );
}