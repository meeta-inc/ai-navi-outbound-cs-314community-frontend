import { MenuConfig } from '../shared/config/menuConfig';

// AI 음성 상담 기능 활성화 여부 확인
const isVoiceConsultationEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_VOICE_CONSULTATION === 'true';
};

// 고객사별 메뉴 설정 저장소 (실제로는 백엔드 API나 데이터베이스에서 관리)
const clientMenuConfigs: Record<string, MenuConfig> = {
  'default': {
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
        action: 'external-link',
        url: 'https://www.314community.com/inquiry/',
        disabled: false
      },
      {
        id: 'ai-consultation',
        icon: {
          type: 'lucide',
          value: 'Phone'
        },
        label: 'AI音声相談',
        action: 'voice-input',  // 음성 입력 액션으로 변경
        url: '/consultation',
        disabled: !isVoiceConsultationEnabled()  // 환경 변수에 따라 활성화/비활성화
      }
    ],
    cta: {
      label: '無料体験に応募する',
      action: 'external-link',
      url: 'https://lp-mur2.314community.com/'
    }
  },
  'education-client': {
    items: [
      {
        id: 'course-info',
        icon: {
          type: 'lucide',
          value: 'Book'
        },
        label: '講座情報',
        action: 'navigate',
        url: '/courses'
      },
      {
        id: 'enrollment',
        icon: {
          type: 'lucide',
          value: 'UserPlus'
        },
        label: '入学案内',
        action: 'navigate',
        url: '/enrollment'
      },
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
        icon: {
          type: 'lucide',
          value: 'Package'
        },
        label: '製品情報',
        action: 'navigate',
        url: '/products'
      },
      {
        id: 'pricing',
        icon: {
          type: 'lucide',
          value: 'CreditCard'
        },
        label: '料金プラン',
        action: 'navigate',
        url: '/pricing'
      },
      {
        id: 'contact',
        icon: {
          type: 'lucide',
          value: 'Mail'
        },
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
  },
  // MM000002 (名門会) 전용 설정
  'MM000002': {
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
        action: 'external-link',
        url: 'https://meimonkai.co.jp/request/',  // 名門会 자료청구 링크
        disabled: false
      },
      {
        id: 'ai-consultation',
        icon: {
          type: 'lucide',
          value: 'Phone'
        },
        label: 'AI音声相談',
        action: 'voice-input',  // 음성 입력 액션으로 변경
        url: '/consultation',
        disabled: !isVoiceConsultationEnabled()  // 환경 변수에 따라 활성화/비활성화
      }
    ],
    cta: {
      label: '無料体験に応募する',
      action: 'external-link',
      url: 'https://meimonkai.co.jp/request/'  // 名門会 무료체험 링크
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