/**
 * API 관련 타입 정의
 */

/**
 * 백엔드 FAQ 카테고리 API 응답의 아이콘 타입
 */
export interface BackendIconResponse {
  type: 'emoji' | 'lucide' | 'custom';
  value: string;
  color: string | null;
}

/**
 * 백엔드 FAQ 카테고리 API 응답 타입
 */
export interface BackendCategoryResponse {
  categoryId: string;
  clientId: string;
  categoryName: string;
  originName: string;
  description: string;
  displayOrder: number;
  icon: BackendIconResponse | null;
  color: string | null;
  targetAttributes: string[];
  isActive: boolean;
  faqCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * 백엔드 FAQ 카테고리 목록 API 응답 타입
 */
export interface BackendCategoriesResponse {
  items: BackendCategoryResponse[];
  totalCount: number;
  nextToken: string | null;
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}