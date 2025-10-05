/**
 * FAQ 카테고리 데이터 변환 유틸리티
 */

import type { BackendCategoryResponse, BackendIconResponse } from '../types/api';
import type { FAQCategoryItem } from '../../components/organisms/FAQCategory/FAQCategory';
import type { IconConfig } from '../config/iconConfig';

/**
 * 백엔드 아이콘 응답을 프론트엔드 형식으로 변환
 */
const transformIconResponse = (icon: BackendIconResponse | null): {
  emojiIcon?: string;
  iconConfig?: IconConfig;
} => {
  if (!icon) {
    return {};
  }

  switch (icon.type) {
    case 'emoji':
      return {
        emojiIcon: icon.value
      };
    
    case 'lucide':
      return {
        iconConfig: {
          type: 'lucide',
          value: icon.value,
          ...(icon.color && { color: icon.color })
        }
      };
    
    case 'custom':
      // custom 타입은 현재 IconConfig에서 지원하지 않으므로 lucide로 fallback
      console.warn('Custom icon type not supported, falling back to lucide');
      return {
        iconConfig: {
          type: 'lucide',
          value: 'HelpCircle', // 기본 아이콘으로 fallback
        }
      };
    
    default:
      console.warn('Unknown icon type:', icon.type);
      return {};
  }
};

/**
 * 백엔드 FAQ 카테고리 응답을 프론트엔드 형식으로 변환
 */
export const transformBackendCategoryResponse = (
  backendData: BackendCategoryResponse[]
): FAQCategoryItem[] => {
  return backendData.map(item => {
    const iconProps = transformIconResponse(item.icon);
    
    return {
      id: item.categoryId,
      textKey: `category.${item.categoryId}`,
      valueKey: item.categoryId,
      displayName: item.categoryName,
      ...iconProps
    };
  });
};

/**
 * 안전한 아이콘 렌더링을 위한 타입 가드
 */
export const isValidEmojiIcon = (icon: unknown): icon is string => {
  return typeof icon === 'string' && icon.length > 0;
};

/**
 * 안전한 IconConfig 타입 가드
 */
export const isValidIconConfig = (config: unknown): config is IconConfig => {
  return (
    config &&
    typeof config === 'object' &&
    typeof config.type === 'string' &&
    typeof config.value === 'string'
  );
};

/**
 * 레거시 icon 객체 처리를 위한 타입 가드 및 변환
 */
export const transformLegacyIconObject = (icon: unknown): {
  emojiIcon?: string;
  iconConfig?: IconConfig;
} => {
  if (!icon || typeof icon !== 'object') {
    return {};
  }

  // {type, value, color} 형태의 객체 처리
  if ('type' in icon && 'value' in icon) {
    return transformIconResponse(icon as BackendIconResponse);
  }

  return {};
};