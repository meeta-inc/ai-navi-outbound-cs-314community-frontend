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

export const getAccentColor = () => {
  const accentColor = import.meta.env.VITE_ACCENT_COLOR;
  
  if (!accentColor || !['orange', 'blue', 'green', 'purple'].includes(accentColor)) {
    console.warn('Invalid or undefined accent color, falling back to orange');
    return 'orange';
  }
  
  return accentColor as 'orange' | 'blue' | 'green' | 'purple';
};

export const getAppConfig = () => {
  return {
    apiUrl: getApiUrl(),
    chatApiUrl: getChatApiUrl(),
    accentColor: getAccentColor(),
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
};