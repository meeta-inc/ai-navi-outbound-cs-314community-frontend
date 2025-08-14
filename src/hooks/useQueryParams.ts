import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface QueryParams {
  clientId?: string;
  appId?: string;
  [key: string]: string | undefined;
}

// 하드코딩된 기본값 (환경변수 대신 사용)
const DEFAULT_CLIENT_ID = 'RS000001';
const DEFAULT_APP_ID = '0001';

/**
 * URL 쿼리 파라미터를 파싱하여 반환하는 커스텀 훅
 * 
 * @returns {QueryParams} 파싱된 쿼리 파라미터 객체
 * 
 * @example
 * // URL: https://example.com?clientId=RS000001&appId=0001
 * const { clientId, appId } = useQueryParams();
 * console.log(clientId); // "RS000001"
 * console.log(appId); // "0001"
 */
export function useQueryParams(): QueryParams {
  const location = useLocation();
  const [params, setParams] = useState<QueryParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newParams: QueryParams = {};

    // 모든 쿼리 파라미터를 객체로 변환
    searchParams.forEach((value, key) => {
      newParams[key] = value;
    });

    setParams(newParams);

    // 디버깅용 로그
    if (newParams.clientId || newParams.appId) {
      console.log('Query params detected:', {
        clientId: newParams.clientId,
        appId: newParams.appId
      });
    }
  }, [location.search]);

  return params;
}

/**
 * clientId와 appId를 쿼리 파라미터 또는 sessionStorage에서 가져오는 훅
 * 환경변수는 사용하지 않고, 하드코딩된 기본값 사용
 * 우선순위: 쿼리 파라미터 > sessionStorage > 기본값
 * 
 * @returns {{ clientId: string, appId: string }} clientId와 appId
 */
export function useClientConfig() {
  const queryParams = useQueryParams();
  const [config, setConfig] = useState({
    clientId: DEFAULT_CLIENT_ID,
    appId: DEFAULT_APP_ID
  });

  useEffect(() => {
    // 쿼리 파라미터가 있으면 sessionStorage에 저장
    if (queryParams.clientId || queryParams.appId) {
      if (queryParams.clientId) {
        sessionStorage.setItem('clientId', queryParams.clientId);
      }
      if (queryParams.appId) {
        sessionStorage.setItem('appId', queryParams.appId);
      }
      
      console.log('Client config saved to sessionStorage from query params:', {
        clientId: queryParams.clientId,
        appId: queryParams.appId
      });
    }

    // 우선순위: 쿼리 파라미터 > sessionStorage > 기본값
    const finalClientId = 
      queryParams.clientId || 
      sessionStorage.getItem('clientId') || 
      DEFAULT_CLIENT_ID;
    
    const finalAppId = 
      queryParams.appId || 
      sessionStorage.getItem('appId') || 
      DEFAULT_APP_ID;

    // 설정이 변경되었을 때만 업데이트
    if (finalClientId !== config.clientId || finalAppId !== config.appId) {
      console.log('Client config updated:', {
        clientId: finalClientId,
        appId: finalAppId,
        source: queryParams.clientId || queryParams.appId 
          ? 'query params' 
          : sessionStorage.getItem('clientId') || sessionStorage.getItem('appId')
            ? 'sessionStorage'
            : 'default values'
      });

      setConfig({
        clientId: finalClientId,
        appId: finalAppId
      });
    }
  }, [queryParams.clientId, queryParams.appId]);

  return config;
}

/**
 * sessionStorage에 저장된 client 설정을 초기화하는 유틸리티 함수
 * 테스트나 디버깅 시 사용
 */
export function clearClientConfig() {
  sessionStorage.removeItem('clientId');
  sessionStorage.removeItem('appId');
  console.log('Client config cleared from sessionStorage');
}