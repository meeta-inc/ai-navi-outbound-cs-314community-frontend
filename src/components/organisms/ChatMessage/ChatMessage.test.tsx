import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage } from './ChatMessage';
import { LLMResponse, Message } from '../../../types';

// Mock the contexts and config
jest.mock('../../../contexts/LocaleContext', () => ({
  useLocale: () => ({ locale: 'ko' }),
}));

jest.mock('../../../shared/config/app.config', () => ({
  getAccentColor: () => 'orange',
  getShowTimestamp: () => true,
}));

// Mock CTAButtons component
jest.mock('../../molecules/CTAButtons', () => ({
  CTAButtons: ({ show, onMainClick, onSubClick }: any) => 
    show ? (
      <div data-testid="cta-buttons">
        <button onClick={onMainClick} data-testid="main-cta">資料請求する</button>
        <button onClick={onSubClick} data-testid="sub-cta">もう少し質問する</button>
      </div>
    ) : null
}));

describe('ChatMessage 컴포넌트', () => {
  const mockUserMessage: Message = {
    id: '1',
    type: 'user',
    content: '안녕하세요! 질문이 있습니다.',
    timestamp: new Date(),
  };

  const mockBotMessage: Message = {
    id: '2',
    type: 'bot',
    content: '안녕하세요! 무엇을 도와드릴까요?',
    timestamp: new Date(),
  };

  const mockLLMResponse: LLMResponse = {
    response: [
      {
        type: 'main',
        text: '안녕하세요! 영어 문법에 대한 답변을 드릴게요.',
        attachment: null
      },
      {
        type: 'sub',
        text: '3.14コミュニティ에서는 기초부터 고급까지 학습 가능합니다.',
        attachment: {
          type: 'link',
          url: 'https://example.com/grammar',
          title: '문법 가이드'
        }
      },
      {
        type: 'cta',
        text: '더 궁금한 점이 있으시면 말씀해주세요!',
        attachment: null
      }
    ],
    tool: null
  };

  describe('기본 메시지 렌더링', () => {
    it('사용자 메시지를 올바르게 렌더링해야 한다', () => {
      render(<ChatMessage message={mockUserMessage} />);
      
      expect(screen.getByText('안녕하세요! 질문이 있습니다.')).toBeInTheDocument();
    });

    it('봇 메시지를 올바르게 렌더링해야 한다', () => {
      render(<ChatMessage message={mockBotMessage} />);
      
      expect(screen.getByText('안녕하세요! 무엇을 도와드릴까요?')).toBeInTheDocument();
    });

    it('아바타 숨김 옵션이 동작해야 한다', () => {
      render(<ChatMessage message={mockBotMessage} hideAvatar={true} />);
      
      // UserAvatar 컴포넌트가 렌더링되지 않는지 확인 (data-testid나 class로)
      const avatarElements = document.querySelectorAll('[class*="avatar"]');
      expect(avatarElements).toHaveLength(0);
    });
  });

  describe('LLM 응답 기능', () => {
    it('LLM 응답이 있을 때 LLMResponseGroup을 사용해야 한다', () => {
      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
        />
      );

      // LLM 응답의 첫 번째 버블 텍스트가 표시되는지 확인
      expect(screen.getByText(/안녕하세요! 영어 문법에 대한 답변을 드릴게요/)).toBeInTheDocument();
      expect(screen.getByText(/3.14コミュニティ에서는 기초부터 고급까지 학습 가능합니다/)).toBeInTheDocument();
      expect(screen.getByText(/더 궁금한 점이 있으시면 말씀해주세요!/)).toBeInTheDocument();
    });

    it('LLM 응답이 없을 때는 일반 ChatBubble을 사용해야 한다', () => {
      render(<ChatMessage message={mockBotMessage} />);
      
      // 기존 메시지 content가 표시되는지 확인
      expect(screen.getByText('안녕하세요! 무엇을 도와드릴까요?')).toBeInTheDocument();
    });

    it('LLM 응답에서 타이핑 애니메이션이 활성화되어야 한다', async () => {
      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          isTyping={true}
          enableLLMTyping={true}
        />
      );

      // 첫 번째 버블만 표시되고 나머지는 숨겨져 있어야 함
      const mainBubble = screen.getByTestId('main-bubble');
      expect(mainBubble).toBeInTheDocument();
      
      expect(screen.queryByTestId('sub-bubble')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cta-bubble')).not.toBeInTheDocument();
    });

    it('enableLLMTyping이 false일 때는 타이핑 효과가 비활성화되어야 한다', () => {
      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          isTyping={true}
          enableLLMTyping={false}
        />
      );

      // 모든 버블이 즉시 표시되어야 함
      expect(screen.getByTestId('main-bubble')).toBeInTheDocument();
      expect(screen.getByTestId('sub-bubble')).toBeInTheDocument();
      expect(screen.getByTestId('cta-bubble')).toBeInTheDocument();
    });
  });

  describe('타이핑 애니메이션', () => {
    it('일반 메시지에서 타이핑 애니메이션이 동작해야 한다', () => {
      const onTypingComplete = jest.fn();
      
      render(
        <ChatMessage 
          message={mockBotMessage} 
          isTyping={true}
          onTypingComplete={onTypingComplete}
        />
      );

      // 타이핑 애니메이션이 시작되었는지 확인 (TypewriterText 컴포넌트 사용)
      const bubbleText = screen.getByTestId('bubble-text');
      expect(bubbleText).toBeInTheDocument();
    });

    it('onTypingComplete 콜백이 호출되어야 한다', async () => {
      const onTypingComplete = jest.fn();
      
      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          isTyping={true}
          enableLLMTyping={true}
          onTypingComplete={onTypingComplete}
        />
      );

      // 타이핑 완료까지 기다림
      await waitFor(() => {
        expect(onTypingComplete).toHaveBeenCalledTimes(1);
      }, { timeout: 10000 });
    });
  });

  describe('첨부파일 처리', () => {
    it('LLM 응답의 첨부파일이 올바르게 표시되어야 한다', () => {
      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          enableLLMTyping={false}
        />
      );

      // 링크 첨부파일 확인
      const link = screen.getByText('문법 가이드');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com/grammar');
    });
  });

  describe('접근성', () => {
    it('봇 메시지에 적절한 ARIA 속성이 있어야 한다', () => {
      render(<ChatMessage message={mockBotMessage} />);
      
      const botMessage = screen.getByRole('article');
      expect(botMessage).toHaveAttribute('aria-label', 'AI 응답 메시지');
    });

    it('LLM 응답 버블들에 적절한 data-testid가 설정되어야 한다', () => {
      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          enableLLMTyping={false}
        />
      );

      expect(screen.getByTestId('main-bubble')).toBeInTheDocument();
      expect(screen.getByTestId('sub-bubble')).toBeInTheDocument();
      expect(screen.getByTestId('cta-bubble')).toBeInTheDocument();
    });
  });

  describe('CTA 버튼 기능', () => {
    it('showCTAAfterComplete가 true일 때 CTA 버튼이 표시되어야 한다', () => {
      const onMainCTAClick = jest.fn();
      const onSubCTAClick = jest.fn();

      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          enableLLMTyping={false}
          showCTAAfterComplete={true}
          onMainCTAClick={onMainCTAClick}
          onSubCTAClick={onSubCTAClick}
        />
      );

      expect(screen.getByTestId('cta-buttons')).toBeInTheDocument();
      expect(screen.getByTestId('main-cta')).toBeInTheDocument();
      expect(screen.getByTestId('sub-cta')).toBeInTheDocument();
    });

    it('showCTAAfterComplete가 false일 때 CTA 버튼이 표시되지 않아야 한다', () => {
      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          enableLLMTyping={false}
          showCTAAfterComplete={false}
        />
      );

      expect(screen.queryByTestId('cta-buttons')).not.toBeInTheDocument();
    });

    it('CTA 버튼 클릭 시 올바른 콜백이 호출되어야 한다', () => {
      const onMainCTAClick = jest.fn();
      const onSubCTAClick = jest.fn();

      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          enableLLMTyping={false}
          showCTAAfterComplete={true}
          onMainCTAClick={onMainCTAClick}
          onSubCTAClick={onSubCTAClick}
        />
      );

      const mainButton = screen.getByTestId('main-cta');
      const subButton = screen.getByTestId('sub-cta');

      fireEvent.click(mainButton);
      fireEvent.click(subButton);

      expect(onMainCTAClick).toHaveBeenCalledTimes(1);
      expect(onSubCTAClick).toHaveBeenCalledTimes(1);
    });

    it('LLM 응답이 없을 때는 CTA 버튼이 표시되지 않아야 한다', () => {
      const onMainCTAClick = jest.fn();
      const onSubCTAClick = jest.fn();

      render(
        <ChatMessage 
          message={mockBotMessage}
          showCTAAfterComplete={true}
          onMainCTAClick={onMainCTAClick}
          onSubCTAClick={onSubCTAClick}
        />
      );

      expect(screen.queryByTestId('cta-buttons')).not.toBeInTheDocument();
    });

    it('CTA 버튼이 올바른 accentColor와 함께 표시되어야 한다', () => {
      const onMainCTAClick = jest.fn();
      const onSubCTAClick = jest.fn();

      render(
        <ChatMessage 
          message={mockBotMessage} 
          llmResponse={mockLLMResponse}
          enableLLMTyping={false}
          showCTAAfterComplete={true}
          onMainCTAClick={onMainCTAClick}
          onSubCTAClick={onSubCTAClick}
        />
      );

      // CTA 버튼이 렌더링되는지 확인 (실제 색상은 CTAButtons 컴포넌트에서 테스트됨)
      expect(screen.getByTestId('cta-buttons')).toBeInTheDocument();
    });
  });
});