// Mock fetch API
global.fetch = jest.fn();

// Mock app config
jest.mock('../../shared/config/app.config', () => ({
  getApiUrl: () => 'https://test-api.example.com',
  getChatApiUrl: () => 'https://test-chat-api.example.com',
}));

// Mock auth token
jest.mock('../auth', () => ({
  getAuthToken: () => Promise.resolve('mock-token'),
}));

// Mock JWE service
jest.mock('../jwe/chatJWEService', () => ({
  chatJWEService: {
    createChatJWEToken: () => Promise.resolve({
      success: true,
      token: 'mock-jwe-token',
      details: {
        client_id: 'test-client',
        app_id: 'test-app',
        tokenLength: 100
      }
    })
  }
}));

import { isLLMResponse, normalizeResponse } from './chat';
import { LLMResponse } from '../../types';

describe('Chat API 유틸리티 함수', () => {
  describe('isLLMResponse', () => {
    it('유효한 LLM 응답을 올바르게 감지해야 한다', () => {
      const validLLMResponse: LLMResponse = {
        response: [
          {
            type: 'main',
            text: '테스트 메시지',
            attachment: null
          }
        ],
        tool: null
      };

      expect(isLLMResponse(validLLMResponse)).toBe(true);
    });

    it('잘못된 형식의 응답을 올바르게 거부해야 한다', () => {
      const invalidResponses = [
        null,
        undefined,
        {},
        { response: 'string' },
        { response: [] },
        { response: [{ text: 'no type' }] },
        { response: [{ type: 'invalid', text: 'invalid type' }] }
      ];

      invalidResponses.forEach(response => {
        expect(isLLMResponse(response)).toBe(false);
      });
    });

    it('다양한 버블 타입을 올바르게 감지해야 한다', () => {
      const mainBubble = {
        response: [{ type: 'main', text: 'test' }],
        tool: null
      };
      const subBubble = {
        response: [{ type: 'sub', text: 'test' }],
        tool: null
      };
      const ctaBubble = {
        response: [{ type: 'cta', text: 'test' }],
        tool: null
      };

      expect(isLLMResponse(mainBubble)).toBe(true);
      expect(isLLMResponse(subBubble)).toBe(true);
      expect(isLLMResponse(ctaBubble)).toBe(true);
    });
  });

  describe('normalizeResponse', () => {
    it('LLM 응답을 ExtendedChatResponse로 변환해야 한다', () => {
      const llmResponse: LLMResponse = {
        response: [
          {
            type: 'main',
            text: '테스트 메시지',
            attachment: null
          }
        ],
        tool: null
      };

      const normalized = normalizeResponse(llmResponse);

      expect(normalized.response).toBe('');
      expect(normalized.llmResponse).toEqual(llmResponse);
    });

    it('기존 ChatResponse 형식을 그대로 유지해야 한다', () => {
      const chatResponse = {
        response: '기존 형식의 응답',
        tool: {
          type: 'test',
          id: '123',
          name: 'test tool',
          input: {}
        },
        timestamp: '2024-01-01T00:00:00Z'
      };

      const normalized = normalizeResponse(chatResponse);

      expect(normalized).toEqual(chatResponse);
      expect(normalized.llmResponse).toBeUndefined();
    });

    it('타임스탬프가 있는 LLM 응답을 올바르게 처리해야 한다', () => {
      const llmResponseWithTimestamp = {
        response: [
          {
            type: 'main',
            text: '테스트 메시지',
            attachment: null
          }
        ],
        tool: null,
        timestamp: '2024-01-01T00:00:00Z'
      };

      const normalized = normalizeResponse(llmResponseWithTimestamp);

      expect(normalized.response).toBe('');
      expect(normalized.llmResponse).toEqual({
        response: [
          {
            type: 'main',
            text: '테스트 메시지',
            attachment: null
          }
        ],
        tool: null,
        timestamp: '2024-01-01T00:00:00Z'
      });
      expect(normalized.timestamp).toBe('2024-01-01T00:00:00Z');
    });

    it('첨부파일이 포함된 LLM 응답을 올바르게 처리해야 한다', () => {
      const llmResponseWithAttachment: LLMResponse = {
        response: [
          {
            type: 'sub',
            text: '첨부파일이 포함된 메시지',
            attachment: {
              type: 'link',
              url: 'https://example.com',
              title: '테스트 링크'
            }
          }
        ],
        tool: 'attachment_tool'
      };

      const normalized = normalizeResponse(llmResponseWithAttachment);

      expect(normalized.response).toBe('');
      expect(normalized.llmResponse).toEqual(llmResponseWithAttachment);
    });
  });
});