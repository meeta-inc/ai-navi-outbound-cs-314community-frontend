import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '기본 버튼 컴포넌트입니다. 다양한 상태와 속성을 지원합니다.',
      },
    },
  },
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 상태',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
    children: {
      control: 'text',
      description: '버튼 내용',
    },
    'aria-label': {
      control: 'text',
      description: '접근성을 위한 라벨',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: '버튼 타입',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 버튼',
    className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화된 버튼',
    disabled: true,
    className: 'px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed',
  },
};

export const Primary: Story = {
  args: {
    children: '주요 버튼',
    className: 'px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조 버튼',
    className: 'px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium',
  },
};

export const WithAriaLabel: Story = {
  args: {
    children: '💾',
    'aria-label': '저장하기',
    className: 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600',
  },
};

export const Submit: Story = {
  args: {
    children: '제출',
    type: 'submit',
    className: 'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium',
  },
};