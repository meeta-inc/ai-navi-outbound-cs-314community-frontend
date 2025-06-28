import { getAuthToken, setAuthToken, removeAuthToken } from './index';

export interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token?: string): TokenPayload | null => {
  try {
    const tokenToUse = token || getAuthToken();
    if (!tokenToUse) return null;

    const base64Url = tokenToUse.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token?: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;

  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  const currentToken = getAuthToken();
  if (!currentToken) return false;

  if (isTokenExpired(currentToken)) {
    removeAuthToken();
    return false;
  }

  return true;
};