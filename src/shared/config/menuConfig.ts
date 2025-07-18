import { IconConfig } from './iconConfig';

export interface MenuItem {
  id: string;
  icon: IconConfig;
  label: string;
  action?: string;
  url?: string;
  disabled?: boolean;
}

export interface CTAConfig {
  label: string;
  action: string;
  url?: string;
}

export interface MenuConfig {
  items: MenuItem[];
  cta?: CTAConfig;
}

// 기본 메뉴 설정
export const defaultMenuConfig: MenuConfig = {
  items: [
    {
      id: 'ai-faq',
      icon: {
        type: 'component',
        value: 'AiChatbotIcon'
      },
      label: 'AI FAQ',
      action: 'navigate',
      url: '/faq'
    },
    {
      id: 'request-materials',
      icon: {
        type: 'lucide',
        value: 'FileText'
      },
      label: '資料請求',
      action: 'navigate',
      url: '/request-materials'
    },
    {
      id: 'ai-consultation',
      icon: {
        type: 'lucide',
        value: 'Phone'
      },
      label: 'AI電話相談',
      action: 'navigate',
      url: '/consultation'
    }
  ],
  cta: {
    label: '無料体験に応募する',
    action: 'navigate',
    url: '/free-trial'
  }
};

// 고객사별 메뉴 설정을 가져오는 함수 
export const getMenuConfig = async (clientId: string): Promise<MenuConfig> => {
  // 동적 import를 사용하여 순환 의존성 방지
  const { MenuService } = await import('../../services/menuService');
  return MenuService.getMenuConfig(clientId);
};