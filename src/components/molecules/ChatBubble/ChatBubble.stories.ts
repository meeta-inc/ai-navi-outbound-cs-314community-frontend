import type { Meta, StoryObj } from '@storybook/react';
import { ChatBubble } from './ChatBubble';
import type { AccentColor } from '../../../shared/config/theme.config';

const meta: Meta<typeof ChatBubble> = {
  title: 'Molecules/ChatBubble',
  component: ChatBubble,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '채팅 메시지를 표시하는 버블 컴포넌트입니다. 봇과 사용자 메시지를 구분하여 표시하며, 타이핑 효과를 지원합니다.',
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: '채팅 메시지 내용',
    },
    isBot: {
      control: 'boolean',
      description: '봇 메시지 여부',
    },
    accentColor: {
      control: 'select',
      options: ['orange', 'blue', 'green', 'red', 'purple'],
      description: '테마 색상',
    },
    isTyping: {
      control: 'boolean',
      description: '타이핑 효과 활성화 여부',
    },
    onTypingComplete: {
      action: 'typing-completed',
      description: '타이핑 완료 시 호출되는 콜백',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BotMessage: Story = {
  args: {
    content: '안녕하세요! 무엇을 도와드릴까요?',
    isBot: true,
    accentColor: 'blue',
    isTyping: false,
  },
};

export const UserMessage: Story = {
  args: {
    content: '안녕하세요! 도움이 필요합니다.',
    isBot: false,
    accentColor: 'blue',
  },
};

export const BotMessageWithTyping: Story = {
  args: {
    content: '타이핑 효과가 적용된 봇 메시지입니다. 글자가 하나씩 나타납니다.',
    isBot: true,
    accentColor: 'blue',
    isTyping: true,
  },
};

export const LongBotMessage: Story = {
  args: {
    content: '이것은 긴 봇 메시지입니다. 여러 줄로 구성되어 있으며, 최대 너비를 초과하면 자동으로 줄바꿈됩니다. 이렇게 긴 메시지도 적절히 표시됩니다.',
    isBot: true,
    accentColor: 'blue',
    isTyping: false,
  },
};

export const LongUserMessage: Story = {
  args: {
    content: '이것은 긴 사용자 메시지입니다. 여러 줄로 구성되어 있으며, 최대 너비를 초과하면 자동으로 줄바꿈됩니다. 사용자 메시지도 적절히 표시됩니다.',
    isBot: false,
    accentColor: 'blue',
  },
};

export const MultilineMessage: Story = {
  args: {
    content: `안녕하세요!
이것은 여러 줄로 구성된 메시지입니다.
각 줄이 제대로 표시되는지 확인해보세요.`,
    isBot: true,
    accentColor: 'blue',
    isTyping: false,
  },
};

export const DifferentAccentColors: Story = {
  args: {
    content: '다양한 색상 테마를 확인해보세요.',
    isBot: true,
    accentColor: 'green',
    isTyping: false,
  },
};

export const PurpleTheme: Story = {
  args: {
    content: '퍼플 테마가 적용된 메시지입니다.',
    isBot: true,
    accentColor: 'purple',
    isTyping: false,
  },
};

export const OrangeTheme: Story = {
  args: {
    content: '오렌지 테마가 적용된 메시지입니다.',
    isBot: true,
    accentColor: 'orange',
    isTyping: false,
  },
};