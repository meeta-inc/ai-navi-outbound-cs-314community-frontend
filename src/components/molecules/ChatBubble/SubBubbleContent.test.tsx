import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SubBubbleContent } from './SubBubbleContent';

// Mock AttachmentPreview 컴포넌트
jest.mock('./AttachmentPreview', () => ({
  AttachmentPreview: ({ attachment, className }: { attachment: any, className?: string }) => (
    <div data-testid="attachment-preview" data-attachment-type={attachment?.type} className={className}>
      Attachment: {attachment?.type} - {attachment?.url}
    </div>
  )
}));

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

  describe('(image) 텍스트 제거 처리', () => {
    it('(image)가 포함된 경우 (image) 텍스트를 제거한다', () => {
      render(
        <SubBubbleContent 
          content="텍스트 내용 (image)" 
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('텍스트 내용')).toBeInTheDocument();
      expect(screen.queryByText('(image)')).not.toBeInTheDocument();
    });

    it('(image)가 없으면 텍스트를 그대로 표시한다', () => {
      render(
        <SubBubbleContent 
          content="일반 텍스트입니다" 
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('일반 텍스트입니다')).toBeInTheDocument();
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

  describe('attachment 기능', () => {
    it('attachment prop이 없으면 기존 방식으로 동작한다', () => {
      render(<SubBubbleContent content="일반 텍스트" />);
      
      expect(screen.getByText('일반 텍스트')).toBeInTheDocument();
      expect(screen.queryByTestId('attachment-preview')).not.toBeInTheDocument();
    });

    it('link 타입 attachment는 URL 변환만 수행한다', () => {
      const linkAttachment = {
        type: 'link' as const,
        url: 'https://example.com',
        title: '예제 사이트'
      };

      render(
        <SubBubbleContent 
          content="확인해보세요 https://example.com" 
          attachment={linkAttachment}
        />
      );
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(screen.queryByTestId('attachment-preview')).not.toBeInTheDocument();
    });

    it('image 타입 attachment는 텍스트만 표시한다 (AttachmentPreview는 ChatBubble에서 분리 렌더링)', () => {
      const imageAttachment = {
        type: 'image' as const,
        url: 'https://example.com/image.jpg',
        title: '예제 이미지'
      };

      render(
        <SubBubbleContent 
          content="이미지를 확인하세요" 
          attachment={imageAttachment}
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('이미지를 확인하세요')).toBeInTheDocument();
      expect(screen.queryByTestId('attachment-preview')).not.toBeInTheDocument();
    });

    it('video 타입 attachment는 텍스트만 표시한다 (AttachmentPreview는 ChatBubble에서 분리 렌더링)', () => {
      const videoAttachment = {
        type: 'video' as const,
        url: 'https://example.com/video.mp4',
        title: '예제 비디오'
      };

      render(
        <SubBubbleContent 
          content="비디오를 확인하세요" 
          attachment={videoAttachment}
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('비디오를 확인하세요')).toBeInTheDocument();
      expect(screen.queryByTestId('attachment-preview')).not.toBeInTheDocument();
    });

    it('file 타입 attachment는 텍스트만 표시한다 (AttachmentPreview는 ChatBubble에서 분리 렌더링)', () => {
      const fileAttachment = {
        type: 'file' as const,
        url: 'https://example.com/document.png',
        title: 'document.png'
      };

      render(
        <SubBubbleContent 
          content="파일을 확인하세요" 
          attachment={fileAttachment}
          isTypingComplete={true}
        />
      );
      
      expect(screen.getByText('파일을 확인하세요')).toBeInTheDocument();
      expect(screen.queryByTestId('attachment-preview')).not.toBeInTheDocument();
    });

    it('타이핑이 완료되지 않으면 image/video attachment 미리보기를 표시하지 않는다', () => {
      const imageAttachment = {
        type: 'image' as const,
        url: 'https://example.com/image.jpg',
        title: '예제 이미지'
      };

      render(
        <SubBubbleContent 
          content="이미지를 확인하세요" 
          attachment={imageAttachment}
          isTypingComplete={false}
        />
      );
      
      expect(screen.queryByTestId('attachment-preview')).not.toBeInTheDocument();
    });

    it('(image) 텍스트 제거와 attachment 기능이 함께 동작한다', () => {
      const imageAttachment = {
        type: 'image' as const,
        url: 'https://example.com/custom-image.jpg',
        title: '커스텀 이미지'
      };

      render(
        <SubBubbleContent 
          content="텍스트 내용 (image)" 
          attachment={imageAttachment}
          isTypingComplete={true}
        />
      );
      
      // (image) 텍스트는 제거되고 텍스트만 표시됨 (AttachmentPreview는 ChatBubble에서 분리 렌더링)
      expect(screen.getByText('텍스트 내용')).toBeInTheDocument();
      expect(screen.queryByText('(image)')).not.toBeInTheDocument();
      expect(screen.queryByTestId('attachment-preview')).not.toBeInTheDocument();
    });
  });
});