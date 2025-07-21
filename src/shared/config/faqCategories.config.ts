/**
 * @fileoverview FAQ 카테고리 설정 관리
 * 
 * 이 파일은 FAQ 카테고리의 구성을 중앙에서 관리합니다.
 * 카테고리 추가, 삭제, 수정이 필요한 경우 이 파일만 수정하면 됩니다.
 */

import { IconConfig } from './iconConfig';

export interface FAQCategoryConfig {
  id: string;
  textKey: string;
  valueKey: string;
  iconConfig: IconConfig;
  order: number;
  enabled: boolean;
}

export interface FAQCategoriesConfig {
  categories: FAQCategoryConfig[];
  defaultCategoryCount: number;
}

/**
 * 기본 FAQ 카테고리 설정
 * 이슈 #29에 따른 3개 카테고리 구성
 */
const DEFAULT_FAQ_CATEGORIES: FAQCategoryConfig[] = [
  {
    id: 'curriculum',
    textKey: 'chat.faq.curriculum.title',
    valueKey: 'chat.faq.curriculum.message',
    iconConfig: { type: 'lucide', value: 'BookOpen' },
    order: 1,
    enabled: true
  },
  {
    id: 'schedule',
    textKey: 'chat.faq.schedule.title', 
    valueKey: 'chat.faq.schedule.message',
    iconConfig: { type: 'lucide', value: 'Clock' },
    order: 2,
    enabled: true
  },
  {
    id: 'pricing',
    textKey: 'chat.faq.pricing.title',
    valueKey: 'chat.faq.pricing.message',
    iconConfig: { type: 'lucide', value: 'DollarSign' },
    order: 3,
    enabled: true
  }
];

/**
 * 환경 변수에서 카테고리 설정을 가져오거나 기본값 사용
 */
export const getFAQCategoriesConfig = (): FAQCategoriesConfig => {
  // 환경변수에서 카테고리 설정 로드 시도
  const configJson = import.meta.env.VITE_FAQ_CATEGORIES_CONFIG;
  
  // 환경변수에서 설정 로드
  if (configJson) {
    try {
      const customConfig = JSON.parse(configJson);
      console.log('Loaded custom FAQ categories configuration from environment:', customConfig);
      
      return {
        categories: customConfig.categories || DEFAULT_FAQ_CATEGORIES,
        defaultCategoryCount: customConfig.defaultCategoryCount || 3
      };
    } catch (error) {
      console.warn('Invalid FAQ categories configuration in environment variables, using defaults:', error);
    }
  }
  
  // 환경변수 설정이 없는 경우 기본값 사용
  console.log('Using default FAQ categories configuration');
  return {
    categories: DEFAULT_FAQ_CATEGORIES,
    defaultCategoryCount: 3
  };
};

/**
 * 활성화된 카테고리만 반환 (order 순으로 정렬)
 */
export const getEnabledFAQCategories = (): FAQCategoryConfig[] => {
  const config = getFAQCategoriesConfig();
  return config.categories
    .filter(category => category.enabled)
    .sort((a, b) => a.order - b.order)
    .slice(0, config.defaultCategoryCount);
};

/**
 * 특정 카테고리 ID로 설정 찾기
 */
export const getFAQCategoryById = (id: string): FAQCategoryConfig | undefined => {
  const categories = getEnabledFAQCategories();
  return categories.find(category => category.id === id);
};