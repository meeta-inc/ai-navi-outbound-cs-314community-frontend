export type AccentColor = 'orange' | 'blue' | 'green' | 'purple';

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
    border: 'border-orange-100',
    text: 'text-orange-600',
    textHover: 'hover:text-orange-800',
    bgHover: 'hover:bg-orange-50',
    bgLight: 'bg-orange-50',
    background: 'bg-orange-500',
    backgroundHover: 'hover:bg-orange-600',
    ring: 'ring-orange-500',
    accent: 'text-orange-500',
    accentSecondary: 'text-orange-600',
    gradient: {
      from: 'from-orange-50',
      to: 'to-red-50'
    }
  },
  blue: {
    border: 'border-blue-100',
    text: 'text-blue-600',
    textHover: 'hover:text-blue-800',
    bgHover: 'hover:bg-blue-50',
    bgLight: 'bg-blue-50',
    background: 'bg-blue-500',
    backgroundHover: 'hover:bg-blue-600',
    ring: 'ring-blue-500',
    accent: 'text-blue-500',
    accentSecondary: 'text-blue-600',
    gradient: {
      from: 'from-blue-50',
      to: 'to-indigo-50'
    }
  },
  green: {
    border: 'border-green-100',
    text: 'text-green-600',
    textHover: 'hover:text-green-800',
    bgHover: 'hover:bg-green-50',
    bgLight: 'bg-green-50',
    background: 'bg-green-500',
    backgroundHover: 'hover:bg-green-600',
    ring: 'ring-green-500',
    accent: 'text-green-500',
    accentSecondary: 'text-green-600',
    gradient: {
      from: 'from-green-50',
      to: 'to-emerald-50'
    }
  },
  purple: {
    border: 'border-purple-100',
    text: 'text-purple-600',
    textHover: 'hover:text-purple-800',
    bgHover: 'hover:bg-purple-50',
    bgLight: 'bg-purple-50',
    background: 'bg-purple-500',
    backgroundHover: 'hover:bg-purple-600',
    ring: 'ring-purple-500',
    accent: 'text-purple-500',
    accentSecondary: 'text-purple-600',
    gradient: {
      from: 'from-purple-50',
      to: 'to-pink-50'
    }
  }
};

/**
 * 액센트 컬러에 따른 CSS 클래스들을 반환합니다.
 * @param color - 액센트 컬러 ('orange' | 'blue' | 'green' | 'purple')
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