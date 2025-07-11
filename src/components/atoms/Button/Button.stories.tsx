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
    className: 'px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-semibold shadow-lg',
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화된 버튼',
    disabled: true,
    className: 'px-6 py-3 bg-gray-400 text-gray-600 rounded-xl cursor-not-allowed font-semibold shadow-md',
  },
};

export const Primary: Story = {
  args: {
    children: '주요 버튼',
    className: 'px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-bold shadow-xl transform hover:scale-105 transition-all duration-200',
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