import { getApiUrl, getChatApiUrl } from '../../shared/config/app.config';
import { getAuthToken } from '../auth';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const isChatEndpoint = endpoint.startsWith('/students/chat');
  const baseUrl = isChatEndpoint ? getChatApiUrl() : getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const token = getAuthToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};