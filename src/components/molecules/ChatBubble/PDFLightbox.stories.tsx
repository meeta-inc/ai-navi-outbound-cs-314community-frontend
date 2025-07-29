import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PDFLightbox } from './PDFLightbox';

const meta: Meta<typeof PDFLightbox> = {
  title: 'Molecules/ChatBubble/PDFLightbox',
  component: PDFLightbox,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '전체 화면 PDF 뷰어 컴포넌트입니다. 모달 형태로 표시되며 ESC 키나 배경 클릭으로 닫을 수 있습니다.',
      },
    },
  },
  argTypes: {
    pdfUrl: {
      control: 'text',
      description: 'PDF 파일의 URL',
    },
    isOpen: {
      control: 'boolean',
      description: '라이트박스 열림 상태',
    },
    onClose: {
      action: 'closed',
      description: '닫기 콜백 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 열린 상태의 PDF 라이트박스입니다.
 */
export const Open: Story = {
  args: {
    pdfUrl: 'https://www.314community.com/wp-content/uploads/2025/02/kobetsu314-hschool_fees-plan2025.pdf',
    isOpen: true,
    onClose: () => console.log('라이트박스 닫기'),
  },
};

/**
 * 닫힌 상태의 PDF 라이트박스입니다. (아무것도 렌더링되지 않음)
 */
export const Closed: Story = {
  args: {
    pdfUrl: 'https://www.314community.com/wp-content/uploads/2025/02/kobetsu314-hschool_fees-plan2025.pdf',
    isOpen: false,
    onClose: () => console.log('라이트박스 닫기'),
  },
};

/**
 * 인터랙티브한 PDF 라이트박스 예시입니다.
 * 버튼을 클릭하여 열고 닫을 수 있습니다.
 */
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          PDF 열기
        </button>
        <PDFLightbox
          pdfUrl="https://www.314community.com/wp-content/uploads/2025/02/kobetsu314-hschool_fees-plan2025.pdf"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
};

/**
 * 다른 PDF 파일을 표시하는 라이트박스입니다.
 */
export const DifferentPDF: Story = {
  args: {
    pdfUrl: 'https://example.com/sample-document.pdf',
    isOpen: true,
    onClose: () => console.log('라이트박스 닫기'),
  },
};