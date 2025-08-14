import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getClientMapping } from '../config/clientMappings';

interface ClientConfig {
  clientId: string;
  appId: string;
  clientName: string;
  schoolName: string;
}

interface ClientConfigContextType {
  config: ClientConfig;
  updateConfig: (newConfig: Partial<ClientConfig>) => void;
  clearConfig: () => void;
}

// 하드코딩된 기본값
const DEFAULT_CLIENT_ID = 'RS000001';
const DEFAULT_APP_ID = '0001';

const ClientConfigContext = createContext<ClientConfigContextType | undefined>(undefined);

export function ClientConfigProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const defaultMapping = getClientMapping(DEFAULT_CLIENT_ID);
  const [config, setConfig] = useState<ClientConfig>({
    clientId: DEFAULT_CLIENT_ID,
    appId: DEFAULT_APP_ID,
    clientName: defaultMapping.clientName,
    schoolName: defaultMapping.schoolName
  });

  // 초기 로드 시 쿼리 파라미터 및 sessionStorage 확인
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryClientId = searchParams.get('clientId');
    const queryAppId = searchParams.get('appId');

    // 우선순위: 쿼리 파라미터 > sessionStorage > 기본값
    const finalClientId = 
      queryClientId || 
      sessionStorage.getItem('clientId') || 
      DEFAULT_CLIENT_ID;
    
    const finalAppId = 
      queryAppId || 
      sessionStorage.getItem('appId') || 
      DEFAULT_APP_ID;

    // 쿼리 파라미터가 있으면 sessionStorage에 저장
    if (queryClientId) {
      sessionStorage.setItem('clientId', queryClientId);
      console.log(`ClientId saved to sessionStorage: ${queryClientId}`);
    }
    if (queryAppId) {
      sessionStorage.setItem('appId', queryAppId);
      console.log(`AppId saved to sessionStorage: ${queryAppId}`);
    }

    // clientId에 따른 매핑 정보 가져오기
    const mapping = getClientMapping(finalClientId);

    // 설정 업데이트
    setConfig({
      clientId: finalClientId,
      appId: finalAppId,
      clientName: mapping.clientName,
      schoolName: mapping.schoolName
    });

    console.log('ClientConfig initialized:', {
      clientId: finalClientId,
      appId: finalAppId,
      clientName: mapping.clientName,
      schoolName: mapping.schoolName,
      source: queryClientId || queryAppId 
        ? 'query params' 
        : sessionStorage.getItem('clientId') || sessionStorage.getItem('appId')
          ? 'sessionStorage'
          : 'default values'
    });
  }, [location.search]);

  // 설정 업데이트 함수
  const updateConfig = (newConfig: Partial<ClientConfig>) => {
    setConfig(prev => {
      let updated = { ...prev, ...newConfig };
      
      // clientId가 변경되면 매핑 정보도 업데이트
      if (newConfig.clientId && newConfig.clientId !== prev.clientId) {
        const mapping = getClientMapping(newConfig.clientId);
        updated = {
          ...updated,
          clientName: mapping.clientName,
          schoolName: mapping.schoolName
        };
      }
      
      // sessionStorage에도 저장
      if (newConfig.clientId) {
        sessionStorage.setItem('clientId', newConfig.clientId);
      }
      if (newConfig.appId) {
        sessionStorage.setItem('appId', newConfig.appId);
      }
      
      console.log('ClientConfig updated:', updated);
      return updated;
    });
  };

  // 설정 초기화 함수
  const clearConfig = () => {
    sessionStorage.removeItem('clientId');
    sessionStorage.removeItem('appId');
    const defaultMapping = getClientMapping(DEFAULT_CLIENT_ID);
    setConfig({
      clientId: DEFAULT_CLIENT_ID,
      appId: DEFAULT_APP_ID,
      clientName: defaultMapping.clientName,
      schoolName: defaultMapping.schoolName
    });
    console.log('ClientConfig cleared and reset to defaults');
  };

  return (
    <ClientConfigContext.Provider value={{ config, updateConfig, clearConfig }}>
      {children}
    </ClientConfigContext.Provider>
  );
}

// Context를 사용하는 커스텀 훅
export function useClientConfig() {
  const context = useContext(ClientConfigContext);
  if (context === undefined) {
    throw new Error('useClientConfig must be used within a ClientConfigProvider');
  }
  return context.config;
}

// 전체 Context를 반환하는 훅 (설정 업데이트가 필요한 경우)
export function useClientConfigContext() {
  const context = useContext(ClientConfigContext);
  if (context === undefined) {
    throw new Error('useClientConfigContext must be used within a ClientConfigProvider');
  }
  return context;
}