import { 
  QuickReplyApiResponse, 
  TopQuestionsApiResponse,
  QuickReplyRequest,
  TopQuestionsRequest,
  CATEGORY_ID_MAP
} from '../../types/api/faq.types';
import { GradeType } from '../../shared/constants/grade.constants';
import { CategoryType } from '../../shared/constants/gradeQuestions.constants';

/**
 * FAQ API Service
 * Handles all FAQ-related API calls to the content-config-service
 */

const FAQ_API_BASE_URL = import.meta.env.VITE_CONTENT_CONFIG_API_URL || 'https://content-config-dev.meeta.jp/v1';
const USE_FAQ_API = import.meta.env.VITE_USE_FAQ_API === 'true';

/**
 * Fetch top 3 questions for Quick Reply component
 * @param grade - Grade level (preschool, elementary, middle, high)
 * @param clientId - Client ID (defaults to RS000001)
 * @returns Promise with quick reply questions
 */
export async function getQuickReplyQuestions(
  grade: GradeType,
  clientId: string = 'RS000001'
): Promise<QuickReplyApiResponse | null> {
  if (!USE_FAQ_API) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      clientId,
      targetAttribute: grade,
      limit: '3'
    });

    const url = `${FAQ_API_BASE_URL}/faqs/quick-reply?${params}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Quick Reply API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data as QuickReplyApiResponse;
  } catch (error) {
    console.error('Failed to fetch quick reply questions:', error);
    return null;
  }
}

/**
 * Fetch top 5 questions for Top Questions component
 * @param grade - Grade level (preschool, elementary, middle, high)
 * @param categoryId - Category ID (curriculum, schedule, pricing or API categoryId like CAT202508150001)
 * @param clientId - Client ID (defaults to RS000001)
 * @returns Promise with top questions
 */
export async function getTopQuestions(
  grade: GradeType,
  categoryId: CategoryType | string,
  clientId: string = 'RS000001'
): Promise<TopQuestionsApiResponse | null> {
  if (!USE_FAQ_API) {
    return null;
  }

  try {
    // API에서 받은 categoryId(CAT로 시작)인 경우 직접 사용, 아니면 매핑 사용
    let apiCategoryId: string;
    if (categoryId.startsWith('CAT')) {
      // API에서 받은 categoryId 직접 사용
      apiCategoryId = categoryId;
    } else {
      // 기존 매핑 사용
      apiCategoryId = CATEGORY_ID_MAP[categoryId as CategoryType];
      if (!apiCategoryId) {
        console.error('Invalid category ID:', categoryId);
        return null;
      }
    }

    const params = new URLSearchParams({
      clientId,
      targetAttribute: grade,
      categoryId: apiCategoryId,
      limit: '5'
    });

    const response = await fetch(`${FAQ_API_BASE_URL}/faqs/top-questions?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Top Questions API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data as TopQuestionsApiResponse;
  } catch (error) {
    console.error('Failed to fetch top questions:', error);
    return null;
  }
}

/**
 * Check if FAQ API is enabled
 */
export function isFaqApiEnabled(): boolean {
  return USE_FAQ_API;
}