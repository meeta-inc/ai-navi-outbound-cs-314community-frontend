import React, { useEffect, useRef } from 'react';
import { X, Info } from 'lucide-react';
import { Icon } from '../../atoms/Icon/Icon';
import { useLocale } from '../../../contexts/LocaleContext';
import type { MenuConfig, MenuItem } from '../../../shared/config/menuConfig';
import type { AccentColor } from '../../../shared/config/theme.config';
import { getColorClasses } from '../../../shared/config/theme.config';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuConfig: MenuConfig;
  accentColor?: AccentColor;
  onMenuItemClick?: (item: MenuItem) => void;
}


export function MenuModal({
  isOpen,
  onClose,
  menuConfig,
  accentColor = 'orange',
  onMenuItemClick
}: MenuModalProps) {
  const { t } = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const colors = getColorClasses(accentColor);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    
    // 메뉴 아이템 클릭 후 모달 닫기
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-transparent flex items-end justify-center"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`
          ${colors.bgLight} shadow-xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          w-full max-w-lg mx-auto
          sm:max-w-md sm:mb-4
        `}
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-end px-4 py-2">
          <button
            onClick={onClose}
            className="p-2 -m-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 메뉴 아이템들 */}
        <div className="px-4 pb-4">
          {/* 메뉴 아이템 그리드 - 아이템 개수에 따라 레이아웃 결정 */}
          <div className={`
            grid gap-3 mb-4
            ${menuConfig.items.length === 3 ? 'grid-cols-3' : 
              menuConfig.items.length === 4 ? 'grid-cols-2' : 
              menuConfig.items.length === 6 ? 'grid-cols-3 w-full' :
              'grid-cols-3'
            }
          `}>
            {menuConfig.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item)}
                disabled={item.disabled}
                className={`
                  flex items-center justify-center
                  ${menuConfig.items.length === 4
                    ? 'gap-3 rounded-[3px] p-4 min-h-[80px]'
                    : 'flex-col gap-[3px] flex-1 self-stretch rounded-[3px]'
                  }
                  ${item.disabled 
                    ? 'bg-white border border-gray-200 opacity-50 cursor-not-allowed' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer'
                  }
                `}
                style={item.disabled && menuConfig.items.length !== 4 ? {
                  padding: '25px 20px',
                  minWidth: '100px'
                } : menuConfig.items.length !== 4 ? {
                  padding: '25px 20px',
                  minWidth: '100px'
                } : undefined}
              >
                <Icon
                  config={item.icon}
                  className={`w-6 h-6 ${colors.text}`}
                />
                <span className={`text-xs font-medium ${colors.text} text-center leading-tight whitespace-nowrap`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* CTA 버튼 */}
          {menuConfig.cta && (
            <button
              onClick={() => {
                if (onMenuItemClick && menuConfig.cta) {
                  onMenuItemClick({
                    id: 'cta',
                    icon: {
                      type: 'lucide',
                      value: 'Star'
                    },
                    label: menuConfig.cta.label,
                    action: menuConfig.cta.action,
                    url: menuConfig.cta.url
                  });
                }
                onClose();
              }}
              className={`
                w-full px-4 py-4 rounded-lg font-semibold text-white
                ${colors.background} hover:opacity-90 transition-opacity
                flex items-center justify-center gap-2
              `}
            >
              <Icon
                config={{
                  type: 'lucide',
                  value: 'Info',
                  fallback: Info
                }}
                className="w-5 h-5 text-white"
              />
              <span>{menuConfig.cta.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}