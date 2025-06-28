import { fetchApi } from './index';

export interface User {
  id: string;
  name: string;
  email: string;
  typeDiagnosisRequestFlag: string;
  unreadPeriodicReportFlag: string;
  personalityResult?: {
    serialNumber: string;
    [key: string]: any;
  };
}

export const getUserProfile = async (userId: string): Promise<User> => {
  return fetchApi(`/users/${userId}`);
};

export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User> => {
  return fetchApi(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const getUserPersonalityTest = async (userId: string) => {
  return fetchApi(`/users/${userId}/personality-test`);
};

export const submitPersonalityTest = async (userId: string, answers: any) => {
  return fetchApi(`/users/${userId}/personality-test`, {
    method: 'POST',
    body: JSON.stringify(answers),
  });
};