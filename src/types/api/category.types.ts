/**
 * 카테고리 API 관련 타입 정의
 */

/**
 * 카테고리 아이템
 */
export interface CategoryItem {
  categoryId: string;
  categoryName: string;
  description: string;
  displayOrder: number;
  icon: string;
  color: string | null;
  targetAttributes: string[];
  isActive: boolean;
  clientId: string;
  faqCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * 카테고리 API 응답
 */
export interface CategoryApiResponse {
  items: CategoryItem[];
  totalCount: number;
  nextToken: string | null;
}

/**
 * 카테고리 요청 파라미터
 */
export interface CategoryRequest {
  clientId: string;
  isActive?: boolean;
  limit?: number;
  nextToken?: string;
}