import type { Meta, StoryObj } from '@storybook/react';
import { MenuModal } from './MenuModal';
import { defaultMenuConfig } from '../../../shared/config/menuConfig';
import type { MenuConfig } from '../../../shared/config/menuConfig';

const meta: Meta<typeof MenuModal> = {
  title: 'Organisms/MenuModal',
  component: MenuModal,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    accentColor: {
      control: { type: 'select' },
      options: ['orange', 'blue', 'green', 'purple', 'red'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MenuModal>;

// 3개 메뉴 + CTA
const threeItemsConfig: MenuConfig = {
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

// 3개 메뉴만 (CTA 없음)
const threeItemsNoCTAConfig: MenuConfig = {
  items: threeItemsConfig.items
};

// 4개 메뉴만 (CTA 없음)
const fourItemsConfig: MenuConfig = {
  items: [
    ...threeItemsConfig.items,
    {
      id: 'support',
      icon: {
        type: 'lucide',
        value: 'HelpCircle'
      },
      label: 'サポート',
      action: 'navigate',
      url: '/support'
    }
  ]
};

// 6개 메뉴만 (CTA 없음)
const sixItemsConfig: MenuConfig = {
  items: [
    ...fourItemsConfig.items,
    {
      id: 'news',
      icon: {
        type: 'lucide',
        value: 'Newspaper'
      },
      label: 'ニュース',
      action: 'navigate',
      url: '/news'
    },
    {
      id: 'events',
      icon: {
        type: 'lucide',
        value: 'Calendar'
      },
      label: 'イベント',
      action: 'navigate',
      url: '/events'
    }
  ]
};

export const ThreeItemsWithCTA: Story = {
  args: {
    isOpen: true,
    menuConfig: threeItemsConfig,
    accentColor: 'orange',
    onClose: () => console.log('Modal closed'),
    onMenuItemClick: (item) => console.log('Menu item clicked:', item),
  },
};

export const ThreeItemsNoCTA: Story = {
  args: {
    isOpen: true,
    menuConfig: threeItemsNoCTAConfig,
    accentColor: 'orange',
    onClose: () => console.log('Modal closed'),
    onMenuItemClick: (item) => console.log('Menu item clicked:', item),
  },
};

export const FourItems: Story = {
  args: {
    isOpen: true,
    menuConfig: fourItemsConfig,
    accentColor: 'orange',
    onClose: () => console.log('Modal closed'),
    onMenuItemClick: (item) => console.log('Menu item clicked:', item),
  },
};

export const SixItems: Story = {
  args: {
    isOpen: true,
    menuConfig: sixItemsConfig,
    accentColor: 'orange',
    onClose: () => console.log('Modal closed'),
    onMenuItemClick: (item) => console.log('Menu item clicked:', item),
  },
};

// 일부 메뉴가 비활성화된 상태
const threeItemsWithDisabledConfig: MenuConfig = {
  items: [
    {
      id: 'ai-faq',
      icon: {
        type: 'component',
        value: 'AiChatbotIcon'
      },
      label: 'AI FAQ',
      action: 'navigate',
      url: '/faq',
      disabled: false
    },
    {
      id: 'request-materials',
      icon: {
        type: 'lucide',
        value: 'FileText'
      },
      label: '資料請求',
      action: 'navigate',
      url: '/request-materials',
      disabled: true  // 비활성화
    },
    {
      id: 'ai-consultation',
      icon: {
        type: 'lucide',
        value: 'Phone'
      },
      label: 'AI電話相談',
      action: 'navigate',
      url: '/consultation',
      disabled: false
    }
  ],
  cta: {
    label: '無料体験に応募する',
    action: 'navigate',
    url: '/free-trial'
  }
};

export const WithDisabledItems: Story = {
  args: {
    isOpen: true,
    menuConfig: threeItemsWithDisabledConfig,
    accentColor: 'orange',
    onClose: () => console.log('Modal closed'),
    onMenuItemClick: (item) => console.log('Menu item clicked:', item),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    menuConfig: threeItemsConfig,
    accentColor: 'orange',
    onClose: () => console.log('Modal closed'),
    onMenuItemClick: (item) => console.log('Menu item clicked:', item),
  },
};