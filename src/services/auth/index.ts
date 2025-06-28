import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // Token expires in 7 days
    secure: true,
    sameSite: 'strict'
  });
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};