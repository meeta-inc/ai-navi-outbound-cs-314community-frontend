import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { sendChatMessage } from '../services/api/chat';
import { getColorClasses } from '../shared/config/theme.config';
import { getAccentColor } from "../shared/config/app.config";
import type { Message, LLMResponse } from '../types';

interface UseChatOptions {
  userId: string;
  gradeId?: string;
  onError?: (error: Error) => void;
  onTypingComplete?: () => void;
}

interface ProcessedChatResponse {
  message: string;
  toolName?: string;
  toolInput?: any;
  llmResponse?: LLMResponse;
  messageId?: string; // 미리 생성된 메시지 ID 저장용
}

export function useChat({ userId, gradeId, onError, onTypingComplete }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentlyTyping, setCurrentlyTyping] = useState<ProcessedChatResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef<boolean>(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
    }
    // 스크롤 후 플래그 리셋
    shouldScrollRef.current = true;
  }, [messages, currentlyTyping]);

  const sendMessage = async (messageContent?: string): Promise<ProcessedChatResponse> => {
    try {
      const response = await sendChatMessage(messageContent || newMessage, userId, gradeId);
      return {
        message: response.response,
        toolName: response.tool?.name,
        toolInput: response.tool?.input,
        llmResponse: response.llmResponse
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
        toolInput: response.toolInput,
        llmResponse: response.llmResponse
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
      // 미리 생성된 메시지 ID 사용 (없으면 새로 생성)
      const messageId = currentlyTyping.messageId || Date.now().toString();
      
      // LLM 응답이 있는 경우 특별 처리
      if (currentlyTyping.llmResponse) {
        // LLM 응답의 경우 메시지 content는 비워두고 llmResponse 정보만 저장
        const botMessage: Message = {
          id: messageId,
          type: 'bot',
          content: '', // LLM 응답의 경우 content는 비워둠
          timestamp: new Date(),
          llmResponse: currentlyTyping.llmResponse
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // 기존 메시지 추가
        const botMessage: Message = {
          id: messageId,
          type: 'bot',
          content: currentlyTyping.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }

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

  const addTypingBotMessage = useCallback((message: string, llmResponse?: boolean): string => {
    // 고유 메시지 ID 생성
    const messageId = Date.now().toString();
    
    // 타이핑 효과로 봇 메시지 표시 (메시지 ID 포함)
    setCurrentlyTyping({
      message: message,
      toolName: undefined,
      toolInput: undefined,
      llmResponse: llmResponse ? { 
        response: [{ type: 'main', text: message }],
        status: 200 
      } : undefined,
      messageId: messageId // 메시지 ID를 포함하여 completeTyping에서 사용
    });
    
    return messageId; // 메시지 ID 반환
  }, []);

  const addUserMessage = useCallback((content: string, shouldScroll: boolean = true): string => {
    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      type: 'user',
      content: content,
      timestamp: new Date()
    };
    
    // 스크롤 방지 플래그 설정
    shouldScrollRef.current = shouldScroll;
    
    setMessages(prev => [...prev, userMessage]);
    return messageId; // 메시지 ID 반환
  }, []);

  const addBotMessage = useCallback((content: string | React.ReactNode, shouldScroll: boolean = true) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: content,
      timestamp: new Date()
    };
    
    // 스크롤 방지 플래그 설정
    shouldScrollRef.current = shouldScroll;
    
    setMessages(prev => [...prev, botMessage]);
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
    addTypingBotMessage,
    addUserMessage,
    addBotMessage,
    scrollToBottom
  };
}