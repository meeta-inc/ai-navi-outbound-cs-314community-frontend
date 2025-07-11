import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { MenuModal } from '../MenuModal';
import { useKeyboardState } from '../../../hooks/useKeyboardState';
import { MenuService } from '../../../services/menuService';
import type { AccentColor } from '../../../shared/config/theme.config';
import { getColorClasses } from '../../../shared/config/theme.config';
import type { MenuItem, MenuConfig } from '../../../shared/config/menuConfig';
import { useNavigate } from 'react-router-dom';

interface MenuButtonProps {
  clientId?: string;
  accentColor?: AccentColor;
}

export function MenuButton({ clientId = 'default', accentColor = 'orange' }: MenuButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null);
  const isKeyboardOpen = useKeyboardState();
  const colors = getColorClasses(accentColor);
  const navigate = useNavigate();
  
  // 고객사별 메뉴 설정 가져오기
  useEffect(() => {
    const config = MenuService.getMenuConfig(clientId);
    setMenuConfig(config);
  }, [clientId]);

  const handleMenuClick = () => {
    // 키보드가 열려있으면 키보드가 닫힐 때까지 대기
    if (isKeyboardOpen) {
      // input에서 포커스 제거
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        activeElement.blur();
      }
      
      // 키보드가 닫힌 후 모달 열기
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    console.log('Menu item clicked:', item);
    
    // 실제 네비게이션 처리
    if (item.action === 'navigate' && item.url) {
      navigate(item.url);
    }
    // 추가 액션 타입들은 여기에서 처리
  };

  return (
    <>
      <button
        onClick={handleMenuClick}
        className={`p-3 rounded-lg transition-all duration-200 ${colors.bgHover}`}
        aria-label="메뉴 열기"
      >
        <Menu className="w-6 h-6" />
      </button>

      {menuConfig && (
        <MenuModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          menuConfig={menuConfig}
          accentColor={accentColor}
          onMenuItemClick={handleMenuItemClick}
        />
      )}
    </>
  );
}