import React from 'react';

export interface IconConfig {
  type: 'lucide' | 'url' | 'svg' | 'component';
  value: string | React.ComponentType<any>;
  fallback?: React.ComponentType<any>;
}

export interface FAQCategoryIconConfig {
  category1: IconConfig;
  category2: IconConfig;
  category3: IconConfig;
  category4: IconConfig;
  other: IconConfig;
}

export const getIconConfig = (): FAQCategoryIconConfig => {
  // 환경변수나 설정에서 아이콘 정보 가져오기
  const iconConfigJson = import.meta.env.VITE_FAQ_ICONS;
  
  if (iconConfigJson) {
    try {
      return JSON.parse(iconConfigJson);
    } catch (error) {
      console.warn('Invalid icon configuration, using defaults');
    }
  }
  
  // 기본 아이콘 설정
  return {
    category1: { type: 'lucide', value: 'BookOpen' },
    category2: { type: 'lucide', value: 'Users' },
    category3: { type: 'lucide', value: 'Trophy' },
    category4: { type: 'lucide', value: 'FileText' },
    other: { type: 'lucide', value: 'MoreHorizontal' }
  };
};