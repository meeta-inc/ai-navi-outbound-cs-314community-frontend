import type { Meta, StoryObj } from '@storybook/react';
import { AttachmentPreview } from './AttachmentPreview';

const meta: Meta<typeof AttachmentPreview> = {
  title: 'Molecules/ChatBubble/AttachmentPreview',
  component: AttachmentPreview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'PDF 미리보기를 표시하는 컴포넌트입니다. 클릭하면 전체 화면 PDF 뷰어가 열립니다.',
      },
    },
  },
  argTypes: {
    pdfUrl: {
      control: 'text',
      description: 'PDF 파일의 URL',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 PDF 미리보기입니다.
 */
export const Default: Story = {
  args: {
    pdfUrl: 'https://www.314community.com/wp-content/uploads/2025/02/kobetsu314-hschool_fees-plan2025.pdf',
  },
};

/**
 * 다른 PDF 파일의 미리보기입니다.
 */
export const DifferentPDF: Story = {
  args: {
    pdfUrl: 'https://example.com/sample.pdf',
  },
};

/**
 * 추가 CSS 클래스가 적용된 미리보기입니다.
 */
export const WithCustomClass: Story = {
  args: {
    pdfUrl: 'https://www.314community.com/wp-content/uploads/2025/02/kobetsu314-hschool_fees-plan2025.pdf',
    className: 'mt-4 shadow-lg',
  },
};

/**
 * 여러 미리보기가 나란히 표시된 예시입니다.
 */
export const Multiple: Story = {
  render: () => (
    <div className="flex gap-4">
      <AttachmentPreview pdfUrl="https://example.com/plan1.pdf" />
      <AttachmentPreview pdfUrl="https://example.com/plan2.pdf" />
      <AttachmentPreview pdfUrl="https://example.com/plan3.pdf" />
    </div>
  ),
};