import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getClientMapping } from '../config/clientMappings';

// React Native WebView 환경을 위한 타입 선언
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

// 인사말 정보 타입
interface Greeting {
  main: string;
  sub: string;
}

interface ClientConfig {
  clientId: string;
  appId: string;
  userId: string;
  clientName: string;
  schoolName: string;
  // postMessage에서 받는 추가 필드
  greeting?: Greeting | null;
  isEnableLearningNavi?: boolean;
  isRequestedLearningOnboarding?: boolean;
}

// postMessage로 받는 데이터 타입 정의 (INITIAL_DATA 스키마)
interface WebViewInitialData {
  clientId: string;
  userId: string;
  appId: string;
  greeting?: Greeting | null;
  isEnableLearningNavi?: boolean;
  isRequestedLearningOnboarding?: boolean;
}

interface PostMessageData {
  type: 'INITIAL_DATA';
  payload: WebViewInitialData;
}


interface ClientConfigContextType {
  config: ClientConfig;
  updateConfig: (newConfig: Partial<ClientConfig>) => void;
  clearConfig: () => void;
  // 환경 및 초기화 상태
  isEmbeddedEnvironment: boolean; // WebView/iframe 환경인지
  isInitialDataReceived: boolean; // INITIAL_DATA를 받았는지
}

// 하드코딩된 기본값
const DEFAULT_CLIENT_ID = 'RS000001';
const DEFAULT_APP_ID = '0001';
const DEFAULT_USER_ID = 'OutBoundUserWithoutId';

const ClientConfigContext = createContext<ClientConfigContextType | undefined>(undefined);

// WebView/iframe 환경인지 확인하는 함수
const checkIsEmbeddedEnvironment = (): boolean => {
  // React Native WebView 환경
  if (window.ReactNativeWebView) {
    return true;
  }
  // iframe 환경 (부모 창이 현재 창과 다른 경우)
  if (window.parent !== window) {
    return true;
  }
  return false;
};

export function ClientConfigProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  // 환경 및 초기화 상태
  const [isEmbeddedEnvironment] = useState<boolean>(() => checkIsEmbeddedEnvironment());
  const [isInitialDataReceived, setIsInitialDataReceived] = useState<boolean>(false);

  // 초기 로드 시 URL 파라미터를 즉시 확인하여 초기값 설정
  const getInitialConfig = () => {
    const searchParams = new URLSearchParams(location.search);
    const queryClientId = searchParams.get('clientId');
    const queryAppId = searchParams.get('appId');
    const queryUserId = searchParams.get('userId');
    
    const initialClientId = queryClientId || 
                           sessionStorage.getItem('clientId') || 
                           DEFAULT_CLIENT_ID;
    const initialAppId = queryAppId || 
                        sessionStorage.getItem('appId') || 
                        DEFAULT_APP_ID;
    const initialUserId = queryUserId || 
                         sessionStorage.getItem('userId') || 
                         DEFAULT_USER_ID;
    
    const mapping = getClientMapping(initialClientId);
    
    return {
      clientId: initialClientId,
      appId: initialAppId,
      userId: initialUserId,
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
    const queryUserId = searchParams.get('userId');

    // 쿼리 파라미터가 있고 현재 설정과 다른 경우에만 업데이트
    if ((queryClientId && queryClientId !== config.clientId) || 
        (queryAppId && queryAppId !== config.appId) ||
        (queryUserId && queryUserId !== config.userId)) {
      
      const newClientId = queryClientId || config.clientId;
      const newAppId = queryAppId || config.appId;
      const newUserId = queryUserId || config.userId;
      
      // sessionStorage 업데이트
      if (queryClientId) {
        sessionStorage.setItem('clientId', queryClientId);
        console.log(`ClientId saved to sessionStorage: ${queryClientId}`);
      }
      if (queryAppId) {
        sessionStorage.setItem('appId', queryAppId);
        console.log(`AppId saved to sessionStorage: ${queryAppId}`);
      }
      if (queryUserId) {
        sessionStorage.setItem('userId', queryUserId);
        console.log(`UserId saved to sessionStorage: ${queryUserId}`);
      }
      
      // 매핑 정보 가져오기
      const mapping = getClientMapping(newClientId);
      
      // 설정 업데이트
      setConfig({
        clientId: newClientId,
        appId: newAppId,
        userId: newUserId,
        clientName: mapping.clientName,
        schoolName: mapping.schoolName
      });
      
      console.log('ClientConfig updated from URL:', {
        clientId: newClientId,
        appId: newAppId,
        userId: newUserId,
        clientName: mapping.clientName,
        schoolName: mapping.schoolName
      });
    } else if (queryClientId || queryAppId || queryUserId) {
      // 쿼리 파라미터가 있지만 이미 설정과 같은 경우, sessionStorage만 업데이트
      if (queryClientId) {
        sessionStorage.setItem('clientId', queryClientId);
      }
      if (queryAppId) {
        sessionStorage.setItem('appId', queryAppId);
      }
      if (queryUserId) {
        sessionStorage.setItem('userId', queryUserId);
      }
    }
  }, [location.search, config.clientId, config.appId, config.userId]);

  // postMessage 리스너 - 부모 창(WebView)에서 config 데이터를 받아 덮어쓰기
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      // 데이터 유효성 검사 (INITIAL_DATA 스키마)
      // 네이티브 WebView에서는 JSON 문자열로 올 수 있으므로 파싱 처리
      let message: PostMessageData;
      if (typeof event.data === 'string') {
        try {
          message = JSON.parse(event.data);
        } catch {
          return; // JSON 파싱 실패 시 무시
        }
      } else {
        message = event.data as PostMessageData;
      }

      if (message && message.type === 'INITIAL_DATA' && message.payload) {
        const payload = message.payload;
        console.log('PostMessage received (INITIAL_DATA):', payload);

        const newClientId = payload.clientId || config.clientId;
        const newAppId = payload.appId || config.appId;
        const newUserId = payload.userId || config.userId;

        // sessionStorage 업데이트
        if (payload.clientId) {
          sessionStorage.setItem('clientId', payload.clientId);
          console.log(`ClientId saved to sessionStorage from postMessage: ${payload.clientId}`);
        }
        if (payload.appId) {
          sessionStorage.setItem('appId', payload.appId);
          console.log(`AppId saved to sessionStorage from postMessage: ${payload.appId}`);
        }
        if (payload.userId) {
          sessionStorage.setItem('userId', payload.userId);
          console.log(`UserId saved to sessionStorage from postMessage: ${payload.userId}`);
        }

        // 매핑 정보 가져오기
        const mapping = getClientMapping(newClientId);

        // 설정 업데이트 (postMessage로 받은 값으로 덮어쓰기)
        setConfig({
          clientId: newClientId,
          appId: newAppId,
          userId: newUserId,
          clientName: mapping.clientName,
          schoolName: mapping.schoolName,
          greeting: payload.greeting,
          isEnableLearningNavi: payload.isEnableLearningNavi,
          isRequestedLearningOnboarding: payload.isRequestedLearningOnboarding
        });

        // INITIAL_DATA 수신 완료 표시
        setIsInitialDataReceived(true);

        console.log('ClientConfig updated from postMessage:', {
          clientId: newClientId,
          appId: newAppId,
          userId: newUserId,
          clientName: mapping.clientName,
          schoolName: mapping.schoolName,
          greeting: payload.greeting,
          isEnableLearningNavi: payload.isEnableLearningNavi,
          isRequestedLearningOnboarding: payload.isRequestedLearningOnboarding
        });
      }
    };

    // iOS/Web: window에서 message 이벤트 수신
    window.addEventListener('message', handlePostMessage);

    // Android: document에서 message 이벤트 수신 (React Native WebView 호환성)
    // Android WebView에서는 document로 메시지가 전달되는 경우가 있음
    document.addEventListener('message', handlePostMessage as EventListener);

    console.log('PostMessage listeners registered (window + document)');

    // 리스너 등록 후 부모 창에 READY 메시지 전송
    // WebViewContainer가 READY를 받으면 INITIAL_DATA를 응답으로 보내줌
    const sendReadyMessage = () => {
      const readyMessage = { type: 'READY' };

      // React Native WebView 환경 체크
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(readyMessage));
        console.log('READY message sent to ReactNativeWebView');
      }
      // iframe 환경 체크 (부모 창이 현재 창과 다른 경우)
      else if (window.parent !== window) {
        window.parent.postMessage(readyMessage, '*');
        console.log('READY message sent to parent window (iframe)');
      }
    };

    sendReadyMessage();

    return () => {
      window.removeEventListener('message', handlePostMessage);
      document.removeEventListener('message', handlePostMessage as EventListener);
    };
  }, [config.clientId, config.appId, config.userId]);

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
      if (newConfig.userId) {
        sessionStorage.setItem('userId', newConfig.userId);
      }
      
      console.log('ClientConfig updated:', updated);
      return updated;
    });
  };

  // 설정 초기화 함수
  const clearConfig = () => {
    sessionStorage.removeItem('clientId');
    sessionStorage.removeItem('appId');
    sessionStorage.removeItem('userId');
    const defaultMapping = getClientMapping(DEFAULT_CLIENT_ID);
    setConfig({
      clientId: DEFAULT_CLIENT_ID,
      appId: DEFAULT_APP_ID,
      userId: DEFAULT_USER_ID,
      clientName: defaultMapping.clientName,
      schoolName: defaultMapping.schoolName
    });
    console.log('ClientConfig cleared and reset to defaults');
  };

  return (
    <ClientConfigContext.Provider value={{
      config,
      updateConfig,
      clearConfig,
      isEmbeddedEnvironment,
      isInitialDataReceived
    }}>
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
  return {
    ...context.config,
    isEmbeddedEnvironment: context.isEmbeddedEnvironment,
    isInitialDataReceived: context.isInitialDataReceived
  };
}

// 전체 Context를 반환하는 훅 (설정 업데이트가 필요한 경우)
export function useClientConfigContext() {
  const context = useContext(ClientConfigContext);
  if (context === undefined) {
    throw new Error('useClientConfigContext must be used within a ClientConfigProvider');
  }
  return context;
}