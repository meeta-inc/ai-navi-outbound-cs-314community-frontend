import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LLMResponseGroup } from './LLMResponseGroup';
import { LLMResponse } from '../../../types';

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

describe('LLMResponseGroup 컴포넌트', () => {
  const mockResponse: LLMResponse = {
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

  describe('타이핑 애니메이션이 활성화된 경우', () => {
    it('버블이 순차적으로 표시되어야 한다', async () => {
      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={true}
        />
      );

      // 처음에는 첫 번째 버블 컨테이너만 표시 (타이핑 시작 전)
      const firstBubble = screen.getByTestId('main-bubble');
      expect(firstBubble).toBeInTheDocument();
      
      // 다른 버블들은 아직 표시되지 않음
      expect(screen.queryByTestId('sub-bubble')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cta-bubble')).not.toBeInTheDocument();

      // 타이핑이 시작되고 첫 번째 텍스트가 나타날 때까지 기다림
      await waitFor(() => {
        expect(screen.getByText(/안녕하세요! 영어 문법에 대한 답변을 드릴게요/)).toBeInTheDocument();
      }, { timeout: 3000 });

      // 첫 번째 버블 타이핑 완료 후 두 번째 버블 표시
      await waitFor(() => {
        expect(screen.getByTestId('sub-bubble')).toBeInTheDocument();
      }, { timeout: 5000 });

      // 두 번째 버블 타이핑 완료 후 세 번째 버블 표시
      await waitFor(() => {
        expect(screen.getByTestId('cta-bubble')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('모든 버블 완료 시 onComplete 콜백이 호출되어야 한다', async () => {
      const onComplete = jest.fn();
      
      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={true}
          onComplete={onComplete}
        />
      );

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      }, { timeout: 10000 });
    });
  });

  describe('타이핑 애니메이션이 비활성화된 경우', () => {
    it('모든 버블이 즉시 표시되어야 한다', () => {
      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={false}
        />
      );

      // 모든 버블이 즉시 표시됨
      expect(screen.getByText(/안녕하세요! 영어 문법에 대한 답변을 드릴게요/)).toBeInTheDocument();
      expect(screen.getByText(/3.14コミュニティ에서는 기초부터 고급까지 학습 가능합니다/)).toBeInTheDocument();
      expect(screen.getByText(/더 궁금한 점이 있으시면 말씀해주세요!/)).toBeInTheDocument();
    });
  });

  describe('첨부파일 처리', () => {
    it('링크 첨부파일이 올바르게 표시되어야 한다', () => {
      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={false}
        />
      );

      const link = screen.getByText('문법 가이드');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com/grammar');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('이미지 첨부파일이 올바르게 표시되어야 한다', () => {
      const responseWithImage: LLMResponse = {
        response: [
          {
            type: 'sub',
            text: '교재 이미지입니다.',
            attachment: {
              type: 'image',
              url: 'https://example.com/textbook.jpg',
              title: '교재 표지',
              thumbnail: 'https://example.com/textbook-thumb.jpg'
            }
          }
        ],
        tool: null
      };

      render(
        <LLMResponseGroup 
          response={responseWithImage}
          enableTyping={false}
        />
      );

      const image = screen.getByRole('img', { name: '교재 표지' });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/textbook-thumb.jpg');
    });
  });

  describe('버블 타입별 스타일', () => {
    it('각 버블 타입에 맞는 data-testid가 설정되어야 한다', () => {
      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={false}
        />
      );

      expect(screen.getByTestId('main-bubble')).toBeInTheDocument();
      expect(screen.getByTestId('sub-bubble')).toBeInTheDocument();
      expect(screen.getByTestId('cta-bubble')).toBeInTheDocument();
    });
  });

  describe('색상 테마', () => {
    it('지정된 액센트 색상이 적용되어야 한다', () => {
      render(
        <LLMResponseGroup 
          response={mockResponse}
          accentColor="blue"
          enableTyping={false}
        />
      );

      const mainBubble = screen.getByTestId('main-bubble');
      expect(mainBubble).toHaveClass('bg-navi-blue-sub2');
    });
  });

  describe('CTA 버튼 기능', () => {
    it('showCTAAfterComplete가 true이고 타이핑 비활성화된 경우 CTA 버튼이 즉시 표시되어야 한다', () => {
      const onMainCTAClick = jest.fn();
      const onSubCTAClick = jest.fn();

      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={false}
          showCTAAfterComplete={true}
          onMainCTAClick={onMainCTAClick}
          onSubCTAClick={onSubCTAClick}
        />
      );

      expect(screen.getByTestId('cta-buttons')).toBeInTheDocument();
      expect(screen.getByTestId('main-cta')).toBeInTheDocument();
      expect(screen.getByTestId('sub-cta')).toBeInTheDocument();
    });

    it('showCTAAfterComplete가 false인 경우 CTA 버튼이 표시되지 않아야 한다', () => {
      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={false}
          showCTAAfterComplete={false}
        />
      );

      expect(screen.queryByTestId('cta-buttons')).not.toBeInTheDocument();
    });

    it('CTA 버튼 클릭 시 콜백이 호출되어야 한다', () => {
      const onMainCTAClick = jest.fn();
      const onSubCTAClick = jest.fn();

      render(
        <LLMResponseGroup 
          response={mockResponse}
          enableTyping={false}
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
  });
});