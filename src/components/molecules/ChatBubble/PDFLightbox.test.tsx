import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PDFLightbox } from './PDFLightbox';

describe('PDFLightbox', () => {
  const defaultProps = {
    pdfUrl: 'https://example.com/test.pdf',
    isOpen: true,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('isOpen이 false일 때는 렌더링하지 않는다', () => {
    render(<PDFLightbox {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('isOpen이 true일 때 렌더링한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTitle('料金プランPDF')).toBeInTheDocument();
  });

  it('닫기 버튼을 클릭하면 onClose를 호출한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('배경을 클릭하면 onClose를 호출한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('콘텐츠 영역을 클릭해도 닫히지 않는다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    const content = screen.getByTitle('料金プランPDF').parentElement;
    fireEvent.click(content!);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('ESC 키를 누르면 onClose를 호출한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('다른 키는 무시한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('PDF iframe에 올바른 URL을 설정한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    const iframe = screen.getByTitle('料金プランPDF');
    expect(iframe).toHaveAttribute('src', 'https://example.com/test.pdf#toolbar=1&navpanes=0&scrollbar=1');
  });

  it('모바일용 다운로드 링크를 표시한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    const downloadLink = screen.getByText('PDFをダウンロード').closest('a');
    expect(downloadLink).toHaveAttribute('href', 'https://example.com/test.pdf');
    expect(downloadLink).toHaveAttribute('target', '_blank');
    expect(downloadLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('열릴 때 body의 overflow를 hidden으로 설정한다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('닫힐 때 body의 overflow를 복원한다', () => {
    const { unmount } = render(<PDFLightbox {...defaultProps} />);
    
    unmount();
    
    expect(document.body.style.overflow).toBe('');
  });

  it('접근성 속성을 가지고 있다', () => {
    render(<PDFLightbox {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'PDFビューアー');
  });
});