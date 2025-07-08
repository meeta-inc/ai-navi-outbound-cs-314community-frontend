import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { sendChatMessage } from '../services/api/chat';
import { getColorClasses } from '../utils/theme';
import { getAccentColor } from '../services/config';
import type { Message } from '../types';

interface UseChatOptions {
  userId: string;
  onError?: (error: Error) => void;
  onTypingComplete?: () => void;
}

interface ProcessedChatResponse {
  message: string;
  toolName?: string;
  toolInput?: any;
}

export function useChat({ userId, onError, onTypingComplete }: UseChatOptions) {
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

  const createToolUI = (toolName: string): React.ReactNode | null => {
    const accentColor = getAccentColor();
    const colors = getColorClasses(accentColor);
    
    if (toolName === 'get_catalog') {
      return React.createElement('div', { 
        className: 'flex flex-col items-start gap-2' 
      }, 
        React.createElement('a', {
          href: '/catalog.pdf',
          target: '_blank',
          rel: 'noopener noreferrer',
          className: `inline-flex items-center gap-1 px-4 py-2 rounded-lg ${colors.background} text-white font-semibold ${colors.backgroundHover} transition-colors text-sm shadow-sm`
        }, 
          'カタログをダウンロード',
          React.createElement(Download, { className: 'w-4 h-4 ml-1' })
        )
      );
    }
    
    return null;
  };

  const completeTyping = () => {
    if (currentlyTyping) {
      // 기본 메시지 추가
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: currentlyTyping.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // 툴에 따른 추가 UI 렌더링
      if (currentlyTyping.toolName) {
        const toolUI = createToolUI(currentlyTyping.toolName);
        if (toolUI) {
          const toolMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: toolUI,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, toolMessage]);
        }
      }

      setCurrentlyTyping(null);
      
      // 타이핑 완료 콜백 호출
      if (onTypingComplete) {
        onTypingComplete();
      }
    }
  };

  const addWelcomeMessage = useCallback((message: string) => {
    // 타이핑 효과로 welcome 메시지 표시
    setCurrentlyTyping({
      message: message,
      toolName: undefined,
      toolInput: undefined
    });
  }, []);

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