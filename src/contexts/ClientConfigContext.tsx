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
  
  // 초기 로드 시 URL 파라미터를 즉시 확인하여 초기값 설정
  const getInitialConfig = () => {
    const searchParams = new URLSearchParams(location.search);
    const queryClientId = searchParams.get('clientId');
    const queryAppId = searchParams.get('appId');
    
    const initialClientId = queryClientId || 
                           sessionStorage.getItem('clientId') || 
                           DEFAULT_CLIENT_ID;
    const initialAppId = queryAppId || 
                        sessionStorage.getItem('appId') || 
                        DEFAULT_APP_ID;
    
    const mapping = getClientMapping(initialClientId);
    
    return {
      clientId: initialClientId,
      appId: initialAppId,
      clientName: mapping.clientName,
      schoolName: mapping.schoolName
    };
  };
  
  const [config, setConfig] = useState<ClientConfig>(getInitialConfig());

  // URL 변경 감지 및 sessionStorage 업데이트
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryClientId = searchParams.get('clientId');
    const queryAppId = searchParams.get('appId');

    // 쿼리 파라미터가 있고 현재 설정과 다른 경우에만 업데이트
    if ((queryClientId && queryClientId !== config.clientId) || 
        (queryAppId && queryAppId !== config.appId)) {
      
      const newClientId = queryClientId || config.clientId;
      const newAppId = queryAppId || config.appId;
      
      // sessionStorage 업데이트
      if (queryClientId) {
        sessionStorage.setItem('clientId', queryClientId);
        console.log(`ClientId saved to sessionStorage: ${queryClientId}`);
      }
      if (queryAppId) {
        sessionStorage.setItem('appId', queryAppId);
        console.log(`AppId saved to sessionStorage: ${queryAppId}`);
      }
      
      // 매핑 정보 가져오기
      const mapping = getClientMapping(newClientId);
      
      // 설정 업데이트
      setConfig({
        clientId: newClientId,
        appId: newAppId,
        clientName: mapping.clientName,
        schoolName: mapping.schoolName
      });
      
      console.log('ClientConfig updated from URL:', {
        clientId: newClientId,
        appId: newAppId,
        clientName: mapping.clientName,
        schoolName: mapping.schoolName
      });
    } else if (queryClientId || queryAppId) {
      // 쿼리 파라미터가 있지만 이미 설정과 같은 경우, sessionStorage만 업데이트
      if (queryClientId) {
        sessionStorage.setItem('clientId', queryClientId);
      }
      if (queryAppId) {
        sessionStorage.setItem('appId', queryAppId);
      }
    }
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