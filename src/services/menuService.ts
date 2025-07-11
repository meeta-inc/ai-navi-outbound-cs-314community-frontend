import { MenuConfig } from '../shared/config/menuConfig';

// 고객사별 메뉴 설정 저장소 (실제로는 백엔드 API나 데이터베이스에서 관리)
const clientMenuConfigs: Record<string, MenuConfig> = {
  'default': {
    items: [
      {
        id: 'ai-faq',
        icon: 'MessageCircle',
        label: 'AI FAQ',
        action: 'navigate',
        url: '/faq',
        disabled: false
      },
      {
        id: 'request-materials',
        icon: 'FileText',
        label: '資料請求',
        action: 'navigate',
        url: '/request-materials',
        disabled: false
      },
      {
        id: 'ai-consultation',
        icon: 'Phone',
        label: 'AI電話相談',
        action: 'navigate',
        url: '/consultation',
        disabled: true  // 예시로 비활성화
      }
    ],
    cta: {
      label: '無料体験に応募する',
      action: 'navigate',
      url: '/free-trial'
    }
  },
  'education-client': {
    items: [
      {
        id: 'course-info',
        icon: 'Book',
        label: '講座情報',
        action: 'navigate',
        url: '/courses'
      },
      {
        id: 'enrollment',
        icon: 'UserPlus',
        label: '入学案内',
        action: 'navigate',
        url: '/enrollment'
      },
      {
        id: 'support',
        icon: 'HelpCircle',
        label: 'サポート',
        action: 'navigate',
        url: '/support'
      }
    ],
    cta: {
      label: '無料相談を予約',
      action: 'navigate',
      url: '/consultation'
    }
  },
  'business-client': {
    items: [
      {
        id: 'products',
        icon: 'Package',
        label: '製品情報',
        action: 'navigate',
        url: '/products'
      },
      {
        id: 'pricing',
        icon: 'CreditCard',
        label: '料金プラン',
        action: 'navigate',
        url: '/pricing'
      },
      {
        id: 'contact',
        icon: 'Mail',
        label: 'お問い合わせ',
        action: 'navigate',
        url: '/contact'
      }
    ],
    cta: {
      label: 'デモを申し込む',
      action: 'navigate',
      url: '/demo'
    }
  }
};

export class MenuService {
  // 고객사별 메뉴 설정 가져오기
  static getMenuConfig(clientId: string): MenuConfig {
    return clientMenuConfigs[clientId] || clientMenuConfigs['default'];
  }

  // 메뉴 설정 업데이트 (관리자용)
  static updateMenuConfig(clientId: string, config: MenuConfig): void {
    clientMenuConfigs[clientId] = config;
    // 실제로는 API 호출하여 백엔드에 저장
    console.log(`Menu config updated for client: ${clientId}`, config);
  }

  // 메뉴 아이템 추가
  static addMenuItem(clientId: string, item: any): void {
    const config = this.getMenuConfig(clientId);
    config.items.push(item);
    this.updateMenuConfig(clientId, config);
  }

  // 메뉴 아이템 제거
  static removeMenuItem(clientId: string, itemId: string): void {
    const config = this.getMenuConfig(clientId);
    config.items = config.items.filter(item => item.id !== itemId);
    this.updateMenuConfig(clientId, config);
  }

  // CTA 업데이트
  static updateCTA(clientId: string, cta: any): void {
    const config = this.getMenuConfig(clientId);
    config.cta = cta;
    this.updateMenuConfig(clientId, config);
  }

  // 메뉴 아이템 활성/비활성 상태 변경
  static setMenuItemDisabled(clientId: string, itemId: string, disabled: boolean): void {
    const config = this.getMenuConfig(clientId);
    const item = config.items.find(item => item.id === itemId);
    if (item) {
      item.disabled = disabled;
      this.updateMenuConfig(clientId, config);
    }
  }

  // 모든 메뉴 아이템 활성/비활성 상태 일괄 변경
  static setAllMenuItemsDisabled(clientId: string, disabled: boolean): void {
    const config = this.getMenuConfig(clientId);
    config.items.forEach(item => {
      item.disabled = disabled;
    });
    this.updateMenuConfig(clientId, config);
  }
}