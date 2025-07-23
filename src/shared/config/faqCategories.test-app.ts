/**
 * @fileoverview FAQ 카테고리 동적 설정 테스트 앱
 * 
 * 이 파일은 실제 브라우저 환경에서 환경변수를 통한 동적 설정이 
 * 올바르게 작동하는지 테스트하기 위한 유틸리티입니다.
 */

import { getFAQCategoriesConfig, getEnabledFAQCategories } from './faqCategories.config';

/**
 * FAQ 카테고리 설정 테스트
 */
export const testFAQCategoriesConfig = () => {
  console.log('=== FAQ Categories Configuration Test ===');
  
  // 설정 로드
  const config = getFAQCategoriesConfig();
  console.log('Full configuration:', config);
  
  // 활성화된 카테고리 가져오기
  const categories = getEnabledFAQCategories();
  console.log('Enabled categories:', categories);
  
  // 카테고리 개수 확인
  console.log(`Number of categories: ${categories.length}`);
  console.log(`Expected count: ${config.defaultCategoryCount}`);
  
  // 각 카테고리 정보 출력
  categories.forEach((category, index) => {
    console.log(`Category ${index + 1}:`, {
      id: category.id,
      textKey: category.textKey,
      valueKey: category.valueKey,
      iconType: category.iconConfig.type,
      iconValue: category.iconConfig.value,
      order: category.order,
      enabled: category.enabled
    });
  });
  
  console.log('=== Test Complete ===');
  return categories;
};

/**
 * 환경변수 값 확인
 */
export const checkEnvironmentVariables = () => {
  console.log('=== Environment Variables Check ===');
  
  try {
    // @ts-ignore - 브라우저 환경에서만 실행
    const envConfig = import.meta?.env?.VITE_FAQ_CATEGORIES_CONFIG;
    console.log('VITE_FAQ_CATEGORIES_CONFIG:', envConfig);
    
    if (envConfig) {
      try {
        const parsed = JSON.parse(envConfig);
        console.log('Parsed config:', parsed);
      } catch (error) {
        console.error('Failed to parse config:', error);
      }
    } else {
      console.log('No environment configuration found');
    }
  } catch (error) {
    console.log('Environment variables not available (likely test environment)');
  }
  
  console.log('=== Environment Check Complete ===');
};

// 브라우저 환경에서만 자동 실행
if (typeof window !== 'undefined') {
  // 페이지 로드 후 실행
  document.addEventListener('DOMContentLoaded', () => {
    checkEnvironmentVariables();
    testFAQCategoriesConfig();
  });
}