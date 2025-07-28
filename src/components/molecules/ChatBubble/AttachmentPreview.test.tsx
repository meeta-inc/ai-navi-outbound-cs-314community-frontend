import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttachmentPreview } from './AttachmentPreview';

// PDFLightbox 모킹
jest.mock('./PDFLightbox', () => ({
  PDFLightbox: ({ isOpen, onClose, pdfUrl }: any) => 
    isOpen ? (
      <div data-testid="pdf-lightbox" onClick={onClose}>
        PDF Lightbox - {pdfUrl}
      </div>
    ) : null
}));

// PDF 썸네일 유틸리티 모킹
jest.mock('../../../utils/pdfThumbnail', () => ({
  getCachedPDFThumbnail: jest.fn(() => 
    Promise.resolve('data:image/jpeg;base64,mocked-thumbnail-data')
  ),
}));

describe('AttachmentPreview', () => {
  const defaultProps = {
    pdfUrl: 'https://example.com/test.pdf'
  };

  it('미리보기 버튼을 렌더링한다', async () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /料金プランPDF/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('sub-bubble-attachment-preview');

    // 썸네일이 로드되면 이미지가 표시되어야 함
    await waitFor(() => {
      expect(screen.getByAltText('料金プラン PDF 미리보기')).toBeInTheDocument();
    });
  });

  it('클릭하면 PDFLightbox를 열어준다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByTestId('pdf-lightbox')).toBeInTheDocument();
    expect(screen.getByText(/test\.pdf/)).toBeInTheDocument();
  });

  it('Enter 키를 누르면 PDFLightbox를 열어준다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    
    expect(screen.getByTestId('pdf-lightbox')).toBeInTheDocument();
  });

  it('Space 키를 누르면 PDFLightbox를 열어준다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });
    
    expect(screen.getByTestId('pdf-lightbox')).toBeInTheDocument();
  });

  it('다른 키는 무시한다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'a' });
    
    expect(screen.queryByTestId('pdf-lightbox')).not.toBeInTheDocument();
  });

  it('PDFLightbox를 닫을 수 있다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    // 열기
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByTestId('pdf-lightbox')).toBeInTheDocument();
    
    // 닫기
    const lightbox = screen.getByTestId('pdf-lightbox');
    fireEvent.click(lightbox);
    expect(screen.queryByTestId('pdf-lightbox')).not.toBeInTheDocument();
  });

  it('추가 className을 적용한다', () => {
    render(<AttachmentPreview {...defaultProps} className="mt-4" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('sub-bubble-attachment-preview');
    expect(button).toHaveClass('mt-4');
  });

  it('아이콘과 텍스트를 표시한다', async () => {
    const { getCachedPDFThumbnail } = require('../../../utils/pdfThumbnail');
    getCachedPDFThumbnail.mockRejectedValueOnce(new Error('PDF 로드 실패'));

    render(<AttachmentPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('로딩중...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('料金プラン')).toBeInTheDocument();
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('접근성 레이블을 가지고 있다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', '料金プランPDFのプレビュー。クリックで拡大表示');
  });

  it('로딩 중에는 스피너를 표시한다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    expect(screen.getByText('로딩중...')).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('썸네일 로드에 실패하면 기본 아이콘을 표시한다', async () => {
    const { getCachedPDFThumbnail } = require('../../../utils/pdfThumbnail');
    getCachedPDFThumbnail.mockRejectedValueOnce(new Error('PDF 로드 실패'));

    render(<AttachmentPreview {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.queryByText('로딩중...')).not.toBeInTheDocument();
    });

    // 기본 PDF 아이콘이 표시되어야 함
    expect(screen.getByText('料金プラン')).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('썸네일이 성공적으로 로드되면 이미지를 표시한다', async () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    await waitFor(() => {
      const img = screen.getByAltText('料金プラン PDF 미리보기');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,mocked-thumbnail-data');
    });

    expect(screen.getByText('料金プラン')).toBeInTheDocument(); // 라벨도 표시
  });
});