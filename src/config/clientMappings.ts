/**
 * 클라이언트 ID별 설정 매핑
 * client_id에 따라 client_name과 school_name을 동적으로 설정
 */

export interface ClientMapping {
  clientId: string;
  clientName: string;
  schoolName: string;
}

// 클라이언트별 매핑 정의
export const CLIENT_MAPPINGS: Record<string, ClientMapping> = {
  // 錬成会
  'RS000001': {
    clientId: 'RS000001',
    clientName: '錬成会',
    schoolName: '3.14 community'
  },
  
  // 名門会
  'MM000002': {
    clientId: 'MM000002', 
    clientName: '名門会',
    schoolName: '名門会'
  },
  
  // 기본값 (매핑이 없는 경우)
  'default': {
    clientId: 'RS000001',
    clientName: '錬成会',
    schoolName: '3.14 community'
  }
};

/**
 * 클라이언트 ID로 매핑 정보 가져오기
 * @param clientId 클라이언트 ID
 * @returns 클라이언트 매핑 정보
 */
export function getClientMapping(clientId: string): ClientMapping {
  return CLIENT_MAPPINGS[clientId] || CLIENT_MAPPINGS['default'];
}

/**
 * 클라이언트 이름 가져오기
 * @param clientId 클라이언트 ID
 * @returns 클라이언트 이름
 */
export function getClientName(clientId: string): string {
  const mapping = getClientMapping(clientId);
  return mapping.clientName;
}

/**
 * 학교 이름 가져오기
 * @param clientId 클라이언트 ID
 * @returns 학교 이름
 */
export function getSchoolName(clientId: string): string {
  const mapping = getClientMapping(clientId);
  return mapping.schoolName;
}