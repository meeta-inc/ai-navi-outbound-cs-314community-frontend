import type { Meta, StoryObj } from '@storybook/react';
import { TypewriterText } from './Typography';

const meta: Meta<typeof TypewriterText> = {
  title: 'Atoms/Typography/TypewriterText',
  component: TypewriterText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '타이핑 효과를 제공하는 텍스트 컴포넌트입니다. 글자가 하나씩 나타나며, 속도 조절이 가능합니다.',
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: '표시할 텍스트',
    },
    speed: {
      control: { type: 'range', min: 10, max: 200, step: 10 },
      description: '타이핑 속도 (밀리초)',
    },
    onComplete: {
      action: 'completed',
      description: '타이핑 완료 시 호출되는 콜백',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '✨ 안녕하세요! 이것은 타이핑 효과가 적용된 텍스트입니다. 🚀',
    speed: 40,
  },
};

export const FastTyping: Story = {
  args: {
    text: '⚡ 빠른 타이핑 효과입니다. 글자가 번개처럼 빠르게 나타납니다! 💨',
    speed: 15,
  },
};

export const SlowTyping: Story = {
  args: {
    text: '느린 타이핑 효과입니다. 글자가 천천히 나타납니다.',
    speed: 100,
  },
};

export const MultilineText: Story = {
  args: {
    text: `안녕하세요!
이것은 여러 줄로 구성된 텍스트입니다.
각 줄이 순차적으로 타이핑됩니다.`,
    speed: 30,
  },
};

export const LongText: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    speed: 25,
  },
};

export const WithCallback: Story = {
  args: {
    text: '이 텍스트가 완료되면 콜백이 호출됩니다.',
    speed: 40,
    onComplete: () => console.log('타이핑 완료!'),
  },
};