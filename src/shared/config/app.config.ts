import { AccentColor } from './theme.config';

export const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.warn('API URL is not defined');
    return '/api';
  }

  return apiUrl;
};

export const getChatApiUrl = () => {
  const chatApiUrl = import.meta.env.VITE_CHAT_API_URL;

  if (!chatApiUrl) {
    console.warn('Chat API URL is not defined, falling back to main API');
    return getApiUrl();
  }

  return chatApiUrl;
};

export const getAccentColor = (): AccentColor => {
  const accentColor = import.meta.env.VITE_ACCENT_COLOR;
  
  if (!accentColor || !['orange', 'blue', 'green', 'red', 'purple'].includes(accentColor)) {
    console.warn('Invalid or undefined accent color, falling back to orange');
    return 'orange';
  }
  
  return accentColor as AccentColor;
};

export const getShowNavigationHeader = () => {
  const showHeader = import.meta.env.VITE_SHOW_NAVIGATION_HEADER;
  
  // 문자열 'true'를 boolean으로 변환, 기본값은 true
  if (showHeader === 'false') {
    return false;
  }
  
  return true;
};

export const getShowTimestamp = () => {
  const showTimestamp = import.meta.env.VITE_SHOW_TIMESTAMP;
  
  // 문자열 'false'를 boolean으로 변환, 기본값은 true
  if (showTimestamp === 'false') {
    return false;
  }
  
  return true;
};

export const getShowGradeSelection = () => {
  const showGradeSelection = import.meta.env.VITE_SHOW_GRADE_SELECTION;
  
  // 문자열 'false'를 boolean으로 변환, 기본값은 true
  if (showGradeSelection === 'false') {
    return false;
  }
  
  return true;
};

export const getAppConfig = () => {
  return {
    apiUrl: getApiUrl(),
    chatApiUrl: getChatApiUrl(),
    accentColor: getAccentColor(),
    showNavigationHeader: getShowNavigationHeader(),
    showTimestamp: getShowTimestamp(),
    showGradeSelection: getShowGradeSelection(),
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
};