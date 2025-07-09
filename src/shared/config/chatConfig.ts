export interface ChatConfig {
  supporterName: string;
  schoolName: string;
}

export const defaultChatConfig: ChatConfig = {
  supporterName: 'AI Navi',
  schoolName: '3.14 community'
};

/**
 * 채팅 설정을 반환합니다.
 * @returns 채팅 설정 객체
 */
export function getChatConfig(): ChatConfig {
  return defaultChatConfig;
}

/**
 * 서포터 이름을 반환합니다.
 * @returns 서포터 이름
 */
export function getSupporterName(): string {
  return defaultChatConfig.supporterName;
}

/**
 * 학교 이름을 반환합니다.
 * @returns 학교 이름
 */
export function getSchoolName(): string {
  return defaultChatConfig.schoolName;
}