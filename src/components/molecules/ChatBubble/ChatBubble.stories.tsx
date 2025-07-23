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
        component: '채팅 메시지를 표시하는 버블 컴포넌트입니다. 봇과 사용자 메시지를 구분하여 표시하며, LLM 응답 타입별 스타일링과 첨부파일을 지원합니다.',
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
    bubbleType: {
      control: 'select',
      options: ['main', 'sub', 'cta'],
      description: 'LLM 응답 버블 타입',
    },
    attachment: {
      control: 'object',
      description: '첨부파일 데이터',
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
    content: '안녕하세요! 무엇을 도와드릴까요? 😊',
    isBot: true,
    accentColor: 'purple',
    isTyping: false,
  },
};

export const UserMessage: Story = {
  args: {
    content: '안녕하세요! 도움이 필요합니다. 🙋‍♂️',
    isBot: false,
    accentColor: 'purple',
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

// LLM 응답 버블 타입별 스토리
export const LLMMainBubble: Story = {
  args: {
    content: '안녕하세요! 영어 문법에 대한 답변을 드릴게요.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'main',
    isTyping: false,
  },
};

export const LLMSubBubble: Story = {
  args: {
    content: '3.14コミュニティ에서는 기초부터 고급까지 학습 가능합니다.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    isTyping: false,
  },
};

export const LLMCTABubble: Story = {
  args: {
    content: '더 궁금한 점이 있으시면 말씀해주세요!',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'cta',
    isTyping: false,
  },
};

export const LLMMainBubbleWithLongText: Story = {
  args: {
    content: '이것은 150자를 초과하는 메인 버블입니다. 메인 버블은 150자까지만 표시되며, 이를 초과하는 텍스트는 잘려서 표시됩니다. 이 메시지는 150자를 넘어서 테스트하기 위한 것입니다.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'main',
    isTyping: false,
  },
};

// 첨부파일이 포함된 버블 스토리
export const BubbleWithLinkAttachment: Story = {
  args: {
    content: '문법 가이드를 확인해보세요.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'link',
      url: 'https://example.com/grammar',
      title: '문법 가이드',
      description: '기초 영어 문법을 학습할 수 있는 가이드입니다.'
    },
    isTyping: false,
  },
};

export const BubbleWithImageAttachment: Story = {
  args: {
    content: '교재 이미지를 확인해보세요.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'image',
      url: 'https://example.com/textbook.jpg',
      title: '교재 표지',
      thumbnail: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=교재+표지'
    },
    isTyping: false,
  },
};

export const BubbleWithVideoAttachment: Story = {
  args: {
    content: '학습 동영상을 시청해보세요.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'video',
      url: 'https://example.com/lesson.mp4',
      title: '영어 학습 동영상',
      description: '기초 영어 회화를 배울 수 있는 동영상입니다.',
      thumbnail: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=동영상+썸네일'
    },
    isTyping: false,
  },
};

export const BubbleWithFileAttachment: Story = {
  args: {
    content: 'PDF 자료를 다운로드해보세요.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'file',
      url: 'https://example.com/grammar-guide.pdf',
      title: '문법 가이드.pdf',
      description: 'PDF 형태의 상세한 문법 가이드입니다.'
    },
    isTyping: false,
  },
};

// 타이핑 효과가 있는 LLM 버블
export const LLMMainBubbleWithTyping: Story = {
  args: {
    content: '타이핑 효과가 적용된 메인 버블입니다.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'main',
    isTyping: true,
  },
};

export const LLMSubBubbleWithTyping: Story = {
  args: {
    content: '타이핑 효과가 적용된 서브 버블입니다.',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    isTyping: true,
  },
};