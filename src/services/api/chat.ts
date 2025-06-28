import { fetchApi } from './index';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string | React.ReactNode;
  timestamp: Date;
  error?: boolean;
}

export interface ToolInfo {
  type: string;
  id: string;
  name: string;
  input: any;
}

export interface ChatResponse {
  response: string;
  tool?: ToolInfo;
  timestamp?: string;
}

export const sendChatMessage = async (message: string, studentId: string): Promise<ChatResponse> => {
  return fetchApi('/students/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      studentId,
    }),
  });
};

export const getChatHistory = async (studentId: string): Promise<ChatMessage[]> => {
  return fetchApi(`/students/chat/history/${studentId}`);
};