import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('AttachmentPreview', () => {
  const defaultProps = {
    pdfUrl: 'https://example.com/test.pdf'
  };

  it('미리보기 버튼을 렌더링한다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /料金プランPDF/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('sub-bubble-attachment-preview');
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

  it('아이콘과 텍스트를 표시한다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    expect(screen.getByText('料金プラン')).toBeInTheDocument();
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('접근성 레이블을 가지고 있다', () => {
    render(<AttachmentPreview {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', '料金プランPDFのプレビュー。クリックで拡大表示');
  });
});