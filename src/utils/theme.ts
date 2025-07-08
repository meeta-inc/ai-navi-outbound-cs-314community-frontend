export type AccentColor = 'orange' | 'blue' | 'green' | 'red' | 'purple';

export interface ColorClasses {
  border: string;
  text: string;
  textHover: string;
  bgHover: string;
  bgLight: string;
  background: string;
  backgroundHover: string;
  ring: string;
  accent: string;
  accentSecondary: string;
  gradient: {
    from: string;
    to: string;
  };
}

const colorMap: Record<AccentColor, ColorClasses> = {
  orange: {
    border: 'border-navi-orange-sub2',
    text: 'text-navi-orange-main',
    textHover: 'hover:text-navi-orange-main',
    bgHover: 'hover:bg-navi-orange-sub2',
    bgLight: 'bg-navi-orange-sub2',
    background: 'bg-navi-orange-main',
    backgroundHover: 'hover:bg-navi-orange-main',
    ring: 'ring-navi-orange-main',
    accent: 'text-navi-orange-main',
    accentSecondary: 'text-navi-orange-sub1',
    gradient: {
      from: 'from-navi-orange-sub2',
      to: 'to-navi-orange-sub1'
    }
  },
  blue: {
    border: 'border-navi-blue-sub2',
    text: 'text-navi-blue-main',
    textHover: 'hover:text-navi-blue-main',
    bgHover: 'hover:bg-navi-blue-sub2',
    bgLight: 'bg-navi-blue-sub2',
    background: 'bg-navi-blue-main',
    backgroundHover: 'hover:bg-navi-blue-main',
    ring: 'ring-navi-blue-main',
    accent: 'text-navi-blue-main',
    accentSecondary: 'text-navi-blue-sub1',
    gradient: {
      from: 'from-navi-blue-sub2',
      to: 'to-navi-blue-sub1'
    }
  },
  green: {
    border: 'border-navi-green-sub2',
    text: 'text-navi-green-main',
    textHover: 'hover:text-navi-green-main',
    bgHover: 'hover:bg-navi-green-sub2',
    bgLight: 'bg-navi-green-sub2',
    background: 'bg-navi-green-main',
    backgroundHover: 'hover:bg-navi-green-main',
    ring: 'ring-navi-green-main',
    accent: 'text-navi-green-main',
    accentSecondary: 'text-navi-green-sub1',
    gradient: {
      from: 'from-navi-green-sub2',
      to: 'to-navi-green-sub1'
    }
  },
  red: {
    border: 'border-navi-red-sub2',
    text: 'text-navi-red-main',
    textHover: 'hover:text-navi-red-main',
    bgHover: 'hover:bg-navi-red-sub2',
    bgLight: 'bg-navi-red-sub2',
    background: 'bg-navi-red-main',
    backgroundHover: 'hover:bg-navi-red-main',
    ring: 'ring-navi-red-main',
    accent: 'text-navi-red-main',
    accentSecondary: 'text-navi-red-sub1',
    gradient: {
      from: 'from-navi-red-sub2',
      to: 'to-navi-red-sub1'
    }
  },
  purple: {
    border: 'border-navi-purple-sub2',
    text: 'text-navi-purple-main',
    textHover: 'hover:text-navi-purple-main',
    bgHover: 'hover:bg-navi-purple-sub2',
    bgLight: 'bg-navi-purple-sub2',
    background: 'bg-navi-purple-main',
    backgroundHover: 'hover:bg-navi-purple-main',
    ring: 'ring-navi-purple-main',
    accent: 'text-navi-purple-main',
    accentSecondary: 'text-navi-purple-sub1',
    gradient: {
      from: 'from-navi-purple-sub2',
      to: 'to-navi-purple-sub1'
    }
  }
};

/**
 * 액센트 컬러에 따른 CSS 클래스들을 반환합니다.
 * @param color - 액센트 컬러 ('orange' | 'blue' | 'green' | 'red' | 'purple')
 * @returns 해당 컬러의 CSS 클래스 객체
 */
export function getColorClasses(color: AccentColor): ColorClasses {
  return colorMap[color] || colorMap.orange;
}

/**
 * 모든 사용 가능한 액센트 컬러 목록을 반환합니다.
 * @returns 액센트 컬러 배열
 */
export function getAvailableColors(): AccentColor[] {
  return Object.keys(colorMap) as AccentColor[];
}

/**
 * 액센트 컬러가 유효한지 확인합니다.
 * @param color - 확인할 컬러 문자열
 * @returns 유효한 액센트 컬러인지 여부
 */
export function isValidAccentColor(color: string): color is AccentColor {
  return Object.keys(colorMap).includes(color);
}