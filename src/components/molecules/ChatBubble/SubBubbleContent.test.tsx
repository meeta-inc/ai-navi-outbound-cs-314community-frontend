import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SubBubbleContent } from './SubBubbleContent';

describe('SubBubbleContent', () => {
  describe('URL 변환 기능', () => {
    it('http URL을 링크로 변환한다', () => {
      render(<SubBubbleContent content="자세한 내용은 http://example.com 에서 확인하세요" />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'http://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('https URL을 링크로 변환한다', () => {
      render(<SubBubbleContent content="사이트: https://www.brainsgym.com/" />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://www.brainsgym.com/');
    });

    it('www로 시작하는 URL을 https를 붙여 링크로 변환한다', () => {
      render(<SubBubbleContent content="방문하세요: www.example.com" />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://www.example.com');
      expect(link).toHaveTextContent('www.example.com');
    });

    it('여러 URL을 모두 링크로 변환한다', () => {
      render(
        <SubBubbleContent 
          content="첫 번째: https://first.com 두 번째: www.second.com" 
        />
      );
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', 'https://first.com');
      expect(links[1]).toHaveAttribute('href', 'https://www.second.com');
    });

    it('URL이 없는 텍스트는 그대로 표시한다', () => {
      render(<SubBubbleContent content="일반 텍스트입니다" />);
      
      expect(screen.getByText('일반 텍스트입니다')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('料金プラン + (image) 처리', () => {
    it('料金プラン과 (image)가 포함된 경우 (image) 텍스트를 제거한다', () => {
      render(
        <SubBubbleContent 
          content="料金プランについて詳しく見る (image)" 
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('料金プランについて詳しく見る')).toBeInTheDocument();
      expect(screen.queryByText('(image)')).not.toBeInTheDocument();
    });

    it('타이핑이 완료되면 AttachmentPreview를 표시한다', async () => {
      const { rerender } = render(
        <SubBubbleContent 
          content="料金プラン (image)" 
          isTypingComplete={false}
        />
      );
      
      // 초기에는 미리보기가 없음
      expect(screen.queryByRole('button', { name: /料金プランPDF/ })).not.toBeInTheDocument();
      
      // 타이핑 완료
      rerender(
        <SubBubbleContent 
          content="料金プラン (image)" 
          isTypingComplete={true}
        />
      );
      
      // 미리보기가 표시됨
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /料金プランPDF/ })).toBeInTheDocument();
      });
    });

    it('料金プラン이 없으면 (image)를 제거하지 않는다', () => {
      render(
        <SubBubbleContent 
          content="다른 내용 (image)" 
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('다른 내용 (image)')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /料金プランPDF/ })).not.toBeInTheDocument();
    });

    it('(image)가 없으면 미리보기를 표시하지 않는다', () => {
      render(
        <SubBubbleContent 
          content="料金プラン입니다" 
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('料金プラン입니다')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /料金プランPDF/ })).not.toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('추가 className을 적용한다', () => {
      const { container } = render(
        <SubBubbleContent content="테스트" className="custom-class" />
      );
      
      const contentDiv = container.querySelector('.whitespace-pre-wrap');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveClass('whitespace-pre-wrap');
      expect(contentDiv).toHaveClass('custom-class');
    });
  });
});