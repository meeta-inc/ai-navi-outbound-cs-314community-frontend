import { useState, useEffect, useRef } from 'react';
import { sendChatMessage, type ChatResponse, type ToolInfo } from '../services/api/chat';
import type { Message } from '../types';

interface UseChatOptions {
  userId: string;
  onError?: (error: Error) => void;
}

interface ProcessedChatResponse {
  message: string;
  toolName?: string;
  toolInput?: any;
}

export function useChat({ userId, onError }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentlyTyping, setCurrentlyTyping] = useState<ProcessedChatResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentlyTyping]);

  const sendMessage = async (messageContent?: string): Promise<ProcessedChatResponse> => {
    try {
      const response = await sendChatMessage(messageContent || newMessage, userId);
      return {
        message: response.response,
        toolName: response.tool?.name,
        toolInput: response.tool?.input
      };
    } catch (error) {
      console.error('Error sending message:', error);
      if (onError) {
        onError(error as Error);
      }
      throw error;
    }
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || newMessage;
    if (!content.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await sendMessage(content);
      
      setCurrentlyTyping({
        message: response.message,
        toolName: response.toolName,
        toolInput: response.toolInput
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const completeTyping = () => {
    if (currentlyTyping) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: currentlyTyping.message,
        timestamp: new Date()
      }]);
      setCurrentlyTyping(null);
    }
  };

  const addWelcomeMessage = (message: string) => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: message,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isTyping,
    currentlyTyping,
    messagesEndRef,
    chatContainerRef,
    handleSendMessage,
    completeTyping,
    addWelcomeMessage,
    scrollToBottom
  };
}