/**
 * FAQ API Response Types
 * Based on OpenAPI specification from content-config-service
 */

import { GradeType } from '../../shared/constants/grade.constants';

/**
 * FAQ item from Quick Reply API
 */
export interface QuickReplyFaqItem {
  faqId: string;
  question: string;
  priority: number;
}

/**
 * Response from /faqs/quick-reply endpoint
 * Returns top 3 FAQ questions across all categories for a grade
 */
export interface QuickReplyApiResponse {
  items: QuickReplyFaqItem[];
}

/**
 * FAQ item from Top Questions API
 */
export interface TopQuestionsFaqItem {
  faqId: string;
  question: string;
  priority: number;
}

/**
 * Response from /faqs/top-questions endpoint
 * Returns top 5 FAQ questions for a specific grade and category
 */
export interface TopQuestionsApiResponse {
  items: TopQuestionsFaqItem[];
}

/**
 * Category ID mapping
 * TODO: Will be replaced with API call in the future
 */
export const CATEGORY_ID_MAP: Record<string, string> = {
  curriculum: 'CAT202508150001',
  schedule: 'CAT202508150002',
  pricing: 'CAT202508150003'
};

/**
 * Request parameters for Quick Reply endpoint
 */
export interface QuickReplyRequest {
  clientId: string;
  targetAttribute: GradeType;
  limit?: number;
}

/**
 * Request parameters for Top Questions endpoint
 */
export interface TopQuestionsRequest {
  clientId: string;
  targetAttribute: GradeType;
  categoryId: string;
  limit?: number;
}