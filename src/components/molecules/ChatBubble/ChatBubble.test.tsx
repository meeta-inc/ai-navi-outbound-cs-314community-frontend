import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatBubble } from './ChatBubble';
import { BubbleResponse } from '../../../types';

describe('ChatBubble 컴포넌트', () => {
  describe('기존 ChatBubble 기능', () => {
    it('봇 메시지를 올바르게 렌더링해야 한다', () => {
      render(
        <ChatBubble
          content="안녕하세요! 무엇을 도와드릴까요?"
          isBot={true}
          accentColor="orange"
        />
      );
      
      expect(screen.getByText('안녕하세요! 무엇을 도와드릴까요?')).toBeInTheDocument();
    });

    it('사용자 메시지를 올바르게 렌더링해야 한다', () => {
      render(
        <ChatBubble
          content="영어 문법에 대해 질문이 있어요"
          isBot={false}
          accentColor="orange"
        />
      );
      
      expect(screen.getByText('영어 문법에 대해 질문이 있어요')).toBeInTheDocument();
    });

    it('타이핑 애니메이션이 동작해야 한다', async () => {
      const onComplete = jest.fn();
      
      render(
        <ChatBubble
          content="타이핑 테스트"
          isBot={true}
          accentColor="orange"
          isTyping={true}
          onTypingComplete={onComplete}
        />
      );
      
      // 타이핑이 진행 중일 때는 전체 텍스트가 보이지 않음
      expect(screen.queryByText('타이핑 테스트')).not.toBeInTheDocument();
      
      // 타이핑 완료 후 콜백 호출 확인
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('LLM 응답 버블 타입별 렌더링', () => {
    describe('Main 버블', () => {
      it('Main 타입 버블이 핵심 요약을 표시해야 한다', () => {
        const mainBubble: BubbleResponse = {
          type: 'main',
          text: '3.14コミュニティでは 영어, 수학, 국어, 이과, 사회 주요 5과목 모두에 대응하고 있습니다.',
          attachment: null
        };

        render(
          <ChatBubble
            content={mainBubble.text}
            isBot={true}
            accentColor="orange"
            bubbleType={mainBubble.type}
          />
        );

        expect(screen.getByText(/3.14コミュニティ/)).toBeInTheDocument();
        expect(screen.getByText(/주요 5과목/)).toBeInTheDocument();
      });

      it('150자를 초과하는 텍스트는 잘라서 표시해야 한다', () => {
        const longText = 'a'.repeat(200);
        
        render(
          <ChatBubble
            content={longText}
            isBot={true}
            accentColor="orange"
            bubbleType="main"
          />
        );

        const displayedText = screen.getByTestId('bubble-text');
        // 150자 + "..." = 153자
        expect(displayedText.textContent?.length).toBeLessThanOrEqual(153);
      });
    });

    describe('Sub 버블', () => {
      it('Sub 타입 버블이 보충 설명을 표시해야 한다', () => {
        const subBubble: BubbleResponse = {
          type: 'sub',
          text: '기초 문법부터 고급 문법까지 체계적으로 학습할 수 있습니다.',
          attachment: null
        };

        render(
          <ChatBubble
            content={subBubble.text}
            isBot={true}
            accentColor="orange"
            bubbleType={subBubble.type}
          />
        );

        expect(screen.getByText(/기초 문법부터/)).toBeInTheDocument();
      });

      it('링크 첨부파일이 있을 때 링크를 표시해야 한다', () => {
        const subBubble: BubbleResponse = {
          type: 'sub',
          text: '자세한 내용은 아래 링크를 참고해주세요.',
          attachment: {
            type: 'link',
            url: 'https://example.com/grammar-guide',
            title: '영어 문법 가이드'
          }
        };

        render(
          <ChatBubble
            content={subBubble.text}
            isBot={true}
            accentColor="orange"
            bubbleType={subBubble.type}
            attachment={subBubble.attachment}
          />
        );

        expect(screen.getByText('영어 문법 가이드')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/grammar-guide');
      });

      it('이미지 첨부파일이 있을 때 이미지를 표시해야 한다', () => {
        const subBubble: BubbleResponse = {
          type: 'sub',
          text: '교재 이미지입니다.',
          attachment: {
            type: 'image',
            url: 'https://example.com/textbook.jpg',
            title: '교재 표지',
            thumbnail: 'https://example.com/textbook-thumb.jpg'
          }
        };

        render(
          <ChatBubble
            content={subBubble.text}
            isBot={true}
            accentColor="orange"
            bubbleType={subBubble.type}
            attachment={subBubble.attachment}
          />
        );

        const image = screen.getByRole('img', { name: '교재 표지' });
        expect(image).toHaveAttribute('src', 'https://example.com/textbook-thumb.jpg');
      });
    });

    describe('CTA 버블', () => {
      it('CTA 타입 버블이 행동 유도 메시지를 표시해야 한다', () => {
        const ctaBubble: BubbleResponse = {
          type: 'cta',
          text: '더 자세한 내용이 궁금하시면 언제든 물어보세요! 😊',
          attachment: null
        };

        render(
          <ChatBubble
            content={ctaBubble.text}
            isBot={true}
            accentColor="orange"
            bubbleType={ctaBubble.type}
          />
        );

        expect(screen.getByText(/궁금하시면 언제든 물어보세요/)).toBeInTheDocument();
        expect(screen.getByText(/😊/)).toBeInTheDocument();
      });

      it('CTA 버블은 따뜻한 톤의 스타일을 가져야 한다', () => {
        render(
          <ChatBubble
            content="상담이 필요하시면 연락주세요!"
            isBot={true}
            accentColor="orange"
            bubbleType="cta"
          />
        );

        const ctaBubble = screen.getByTestId('cta-bubble');
        expect(ctaBubble).toHaveClass('bg-navi-orange-sub2');
      });
    });
  });

  describe('LLM 응답 그룹 렌더링', () => {
    it('복수의 버블을 순서대로 표시해야 한다', async () => {
      const responses: BubbleResponse[] = [
        {
          type: 'main',
          text: '안녕하세요! 영어 문법에 대한 답변을 드릴게요.',
          attachment: null
        },
        {
          type: 'sub',
          text: '3.14コミュニティ에서는 기초부터 고급까지 학습 가능합니다.',
          attachment: null
        },
        {
          type: 'cta',
          text: '더 궁금한 점이 있으시면 말씀해주세요!',
          attachment: null
        }
      ];

      const { container } = render(
        <div>
          {responses.map((bubble, index) => (
            <ChatBubble
              key={index}
              content={bubble.text}
              isBot={true}
              accentColor="orange"
              bubbleType={bubble.type}
              attachment={bubble.attachment}
            />
          ))}
        </div>
      );

      const bubbles = container.querySelectorAll('[data-testid$="-bubble"]');
      expect(bubbles).toHaveLength(3);
      
      // 순서 확인
      expect(bubbles[0]).toHaveAttribute('data-testid', 'main-bubble');
      expect(bubbles[1]).toHaveAttribute('data-testid', 'sub-bubble');
      expect(bubbles[2]).toHaveAttribute('data-testid', 'cta-bubble');
    });

    it('각 버블은 순차적으로 타이핑 애니메이션을 표시해야 한다', async () => {
      const onComplete1 = jest.fn();

      render(
        <div>
          <ChatBubble
            content="첫 번째 버블"
            isBot={true}
            accentColor="orange"
            bubbleType="main"
            isTyping={true}
            onTypingComplete={onComplete1}
          />
          <ChatBubble
            content="두 번째 버블"
            isBot={true}
            accentColor="orange"
            bubbleType="sub"
            isTyping={false}
          />
        </div>
      );

      // 첫 번째 버블 타이핑 완료 대기
      await waitFor(() => {
        expect(onComplete1).toHaveBeenCalled();
      });

      // 두 번째 버블이 표시되어야 함
      expect(screen.getByText('두 번째 버블')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('버블 타입에 따라 적절한 ARIA 속성을 가져야 한다', () => {
      render(
        <ChatBubble
          content="접근성 테스트"
          isBot={true}
          accentColor="orange"
          bubbleType="main"
        />
      );

      const bubble = screen.getByTestId('main-bubble');
      expect(bubble).toHaveAttribute('role', 'article');
      expect(bubble).toHaveAttribute('aria-label', 'AI 응답 메시지');
    });
  });

  describe('Typography 시스템 적용', () => {
    it('봇 메시지 텍스트에 meeta-typography-mid 클래스가 적용되어야 한다', () => {
      const { container } = render(
        <ChatBubble
          content="Typography 테스트 메시지"
          isBot={true}
          accentColor="orange"
        />
      );

      // meeta-typography-mid 클래스를 가진 요소가 있어야 함
      const typographyElements = container.querySelectorAll('.meeta-typography-mid');
      expect(typographyElements.length).toBeGreaterThan(0);
    });

    it('사용자 메시지 텍스트에 meeta-typography-mid 클래스가 적용되어야 한다', () => {
      const { container } = render(
        <ChatBubble
          content="사용자 메시지 Typography 테스트"
          isBot={false}
          accentColor="orange"
        />
      );

      // meeta-typography-mid 클래스를 가진 요소가 있어야 함
      const typographyElements = container.querySelectorAll('.meeta-typography-mid');
      expect(typographyElements.length).toBeGreaterThan(0);
    });

    it('첨부파일 링크에 meeta-typography-mid 클래스가 적용되어야 한다', () => {
      render(
        <ChatBubble
          content="첨부파일 테스트"
          isBot={true}
          accentColor="orange"
          attachment={{
            type: 'link',
            url: 'https://example.com',
            title: '링크 제목'
          }}
        />
      );

      // 링크 요소에 meeta-typography-mid 클래스가 적용되어야 함
      const linkElement = screen.getByRole('link');
      expect(linkElement).toHaveClass('meeta-typography-mid');
    });

    it('첨부파일 다운로드 링크에 meeta-typography-mid 클래스가 적용되어야 한다', () => {
      render(
        <ChatBubble
          content="파일 첨부 테스트"
          isBot={true}
          accentColor="orange"
          attachment={{
            type: 'file',
            url: 'https://example.com/file.pdf',
            title: '파일 다운로드'
          }}
        />
      );

      // 파일 다운로드 링크에 meeta-typography-mid 클래스가 적용되어야 함
      const linkElement = screen.getByRole('link');
      expect(linkElement).toHaveClass('meeta-typography-mid');
    });
  });
});