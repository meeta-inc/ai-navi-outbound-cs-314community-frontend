export type HeaderActionType = 'close' | 'menu' | 'search' | 'settings' | 'back' | 'share' | 'more';

export interface HeaderAction {
  type: HeaderActionType;
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  visible?: boolean;
}

export interface HeaderConfig {
  maxItems: number;
  actions: HeaderAction[];
  alignment: 'left' | 'right' | 'center';
}

export interface ClientHeaderConfig {
  clientId: string;
  clientName: string;
  headerConfig: HeaderConfig;
}

// 기본 헤더 액션들
export const defaultHeaderActions = {
  close: (onClose?: () => void): HeaderAction => ({
    type: 'close',
    icon: 'x',
    label: '닫기',
    onClick: onClose || (() => window.close()),
    visible: true,
  }),
  menu: (onMenu?: () => void): HeaderAction => ({
    type: 'menu',
    icon: 'menu',
    label: '메뉴',
    onClick: onMenu || (() => {}),
    visible: true,
  }),
  search: (onSearch?: () => void): HeaderAction => ({
    type: 'search',
    icon: 'search',
    label: '검색',
    onClick: onSearch || (() => {}),
    visible: true,
  }),
  settings: (onSettings?: () => void): HeaderAction => ({
    type: 'settings',
    icon: 'settings',
    label: '설정',
    onClick: onSettings || (() => {}),
    visible: true,
  }),
  back: (onBack?: () => void): HeaderAction => ({
    type: 'back',
    icon: 'arrow-left',
    label: '뒤로',
    onClick: onBack || (() => window.history.back()),
    visible: true,
  }),
  share: (onShare?: () => void): HeaderAction => ({
    type: 'share',
    icon: 'share',
    label: '공유',
    onClick: onShare || (() => {}),
    visible: true,
  }),
  more: (onMore?: () => void): HeaderAction => ({
    type: 'more',
    icon: 'more-horizontal',
    label: '더보기',
    onClick: onMore || (() => {}),
    visible: true,
  }),
};

// 현재 클라이언트 설정 (닫기 버튼만)
export const currentClientConfig: ClientHeaderConfig = {
  clientId: 'default',
  clientName: 'Default Client',
  headerConfig: {
    maxItems: 1,
    alignment: 'right',
    actions: [
      defaultHeaderActions.close(() => {
        // 모달 닫기 로직
        console.log('모달 닫기');
      }),
    ],
  },
};

// 확장된 클라이언트 설정 예시 (최대 4개 메뉴)
export const extendedClientConfig: ClientHeaderConfig = {
  clientId: 'extended',
  clientName: 'Extended Client',
  headerConfig: {
    maxItems: 4,
    alignment: 'right',
    actions: [
      defaultHeaderActions.search(),
      defaultHeaderActions.settings(),
      defaultHeaderActions.share(),
      defaultHeaderActions.close(),
    ],
  },
};

// 클라이언트별 설정 맵
export const clientConfigs: Record<string, ClientHeaderConfig> = {
  default: currentClientConfig,
  extended: extendedClientConfig,
};

/**
 * 클라이언트 ID에 따른 헤더 설정을 반환합니다.
 * @param clientId - 클라이언트 ID
 * @returns 해당 클라이언트의 헤더 설정
 */
export function getHeaderConfig(clientId: string = 'default'): HeaderConfig {
  return clientConfigs[clientId]?.headerConfig || currentClientConfig.headerConfig;
}

/**
 * 헤더 액션의 표시 여부를 확인합니다.
 * @param action - 확인할 액션
 * @returns 표시 여부
 */
export function isActionVisible(action: HeaderAction): boolean {
  return action.visible !== false && !action.disabled;
}

/**
 * 최대 아이템 수에 맞게 액션 배열을 필터링합니다.
 * @param actions - 액션 배열
 * @param maxItems - 최대 아이템 수
 * @returns 필터링된 액션 배열
 */
export function filterActionsByMaxItems(actions: HeaderAction[], maxItems: number): HeaderAction[] {
  const visibleActions = actions.filter(isActionVisible);
  return visibleActions.slice(0, maxItems);
}