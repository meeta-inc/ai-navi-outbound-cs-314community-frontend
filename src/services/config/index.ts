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

export const getAppConfig = () => {
  return {
    apiUrl: getApiUrl(),
    chatApiUrl: getChatApiUrl(),
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  };
};