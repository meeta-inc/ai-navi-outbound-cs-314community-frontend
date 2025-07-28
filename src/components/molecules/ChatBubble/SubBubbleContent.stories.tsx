import type { Meta, StoryObj } from '@storybook/react';
import { SubBubbleContent } from './SubBubbleContent';

const meta: Meta<typeof SubBubbleContent> = {
  title: 'Molecules/ChatBubble/SubBubbleContent',
  component: SubBubbleContent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Sub Bubble 타입에서 사용되는 콘텐츠 컴포넌트입니다. URL 자동 링크 변환과 料金プラン PDF 미리보기 기능을 제공합니다.',
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: '표시할 텍스트 내용',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
    isTypingComplete: {
      control: 'boolean',
      description: '타이핑 애니메이션 완료 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 텍스트 표시입니다.
 */
export const Default: Story = {
  args: {
    content: '일반 텍스트입니다.',
    isTypingComplete: true,
  },
};

/**
 * URL이 자동으로 링크로 변환되는 예시입니다.
 */
export const WithURL: Story = {
  args: {
    content: '자세한 내용은 https://www.brainsgym.com/ 에서 확인하세요.',
    isTypingComplete: true,
  },
};

/**
 * 여러 URL이 포함된 텍스트입니다.
 */
export const WithMultipleURLs: Story = {
  args: {
    content: '공식 사이트: https://example.com 문서: www.docs.example.com 지원: http://support.example.com',
    isTypingComplete: true,
  },
};

/**
 * 料金プラン과 (image)가 포함된 경우 PDF 미리보기가 표시됩니다.
 */
export const WithPricePlan: Story = {
  args: {
    content: '料金プランについて詳しく見る (image)',
    isTypingComplete: true,
  },
};

/**
 * 타이핑이 완료되지 않은 상태에서는 PDF 미리보기가 표시되지 않습니다.
 */
export const WithPricePlanNotComplete: Story = {
  args: {
    content: '料金プランについて詳しく見る (image)',
    isTypingComplete: false,
  },
};

/**
 * 料金プラン과 URL이 함께 포함된 경우입니다.
 */
export const WithPricePlanAndURL: Story = {
  args: {
    content: '料金プランの詳細は https://example.com/plan 에서 확인하세요 (image)',
    isTypingComplete: true,
  },
};

/**
 * 커스텀 CSS 클래스가 적용된 예시입니다.
 */
export const WithCustomClass: Story = {
  args: {
    content: 'CSS 클래스가 적용된 텍스트입니다.',
    className: 'text-blue-600 font-bold',
    isTypingComplete: true,
  },
};