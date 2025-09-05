/**
 * 카테고리 API 서비스
 * Content Config Service의 카테고리 관련 API 호출을 처리합니다.
 */

import { CategoryApiResponse, CategoryRequest } from '../../types/api/category.types';

const CONTENT_CONFIG_API_URL = import.meta.env.VITE_CONTENT_CONFIG_API_URL || 'https://content-config-dev.meeta.jp/v1';
const USE_CATEGORY_API = import.meta.env.VITE_USE_CATEGORY_API === 'true';

/**
 * 카테고리 목록을 가져옵니다
 * @param clientId - 클라이언트 ID
 * @param isActive - 활성 카테고리만 조회 (기본값: true)
 * @returns 카테고리 목록 또는 null (API 비활성화 또는 오류 시)
 */
export async function getCategories(
  clientId: string = 'RS000001',
  isActive: boolean = true
): Promise<CategoryApiResponse | null> {
  if (!USE_CATEGORY_API) {
    console.log('Category API is disabled');
    return null;
  }

  try {
    const params = new URLSearchParams({
      clientId,
      isActive: isActive.toString()
    });

    const url = `${CONTENT_CONFIG_API_URL}/categories?${params}`;
    console.log('Fetching categories from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Category API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Categories fetched successfully:', data);
    return data as CategoryApiResponse;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return null;
  }
}

/**
 * 카테고리 API 사용 여부를 확인합니다
 */
export function isCategoryApiEnabled(): boolean {
  return USE_CATEGORY_API;
}