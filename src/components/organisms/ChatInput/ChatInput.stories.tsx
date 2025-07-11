import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './ChatInput';

const meta: Meta<typeof ChatInput> = {
  title: 'Organisms/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '채팅 입력 컴포넌트입니다. 카테고리 버튼, 입력 필드, 전송 버튼을 포함합니다.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: '입력 필드의 현재 값',
    },
    onChange: {
      action: 'input-changed',
      description: '입력값 변경 시 호출되는 콜백 함수',
    },
    onSend: {
      action: 'message-sent',
      description: '메시지 전송 시 호출되는 콜백 함수',
    },
    disabled: {
      control: 'boolean',
      description: '입력 필드 비활성화 여부',
    },
    placeholder: {
      control: 'text',
      description: '입력 필드 플레이스홀더 텍스트',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    disabled: false,
  },
};

export const WithText: Story = {
  args: {
    value: '안녕하세요! 도움이 필요합니다.',
    disabled: false,
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '무엇을 도와드릴까요? 😊',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: '',
    disabled: true,
  },
};

export const DisabledWithText: Story = {
  args: {
    value: '비활성화된 상태의 텍스트입니다.',
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    disabled: false,
  },
};

export const MultilineText: Story = {
  args: {
    value: `첫 번째 줄입니다.
두 번째 줄도 있습니다.
세 번째 줄까지 입력했습니다.
높이가 자동으로 조절됩니다.`,
    disabled: false,
  },
};

export const EmptyDisabled: Story = {
  args: {
    value: '',
    disabled: false,
    placeholder: '전송 버튼이 비활성화됩니다',
  },
  parameters: {
    docs: {
      description: {
        story: '입력값이 없을 때는 전송 버튼이 자동으로 비활성화됩니다.',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '질문을 자유롭게 입력해주세요! 🎯',
    disabled: false,
  },
};

export const ReadyToSend: Story = {
  args: {
    value: '전송 준비 완료된 메시지입니다.',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '텍스트가 입력된 상태에서는 전송 버튼이 활성화됩니다.',
      },
    },
  },
};