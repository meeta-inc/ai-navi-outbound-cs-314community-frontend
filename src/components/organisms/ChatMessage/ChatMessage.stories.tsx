import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessage } from './ChatMessage';
import type { LLMResponse } from '../../../types';

const meta: Meta<typeof ChatMessage> = {
  title: 'Organisms/ChatMessage',
  component: ChatMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '개별 채팅 메시지를 표시하는 컴포넌트입니다. 사용자와 봇 메시지를 구분하여 렌더링합니다.',
      },
    },
  },
  argTypes: {
    message: {
      description: '표시할 메시지 객체',
    },
    isTyping: {
      control: 'boolean',
      description: '타이핑 애니메이션 표시 여부 (봇 메시지만)',
    },
    onTypingComplete: {
      action: 'typing-completed',
      description: '타이핑 완료 시 호출되는 콜백 함수',
    },
    llmResponse: {
      control: 'object',
      description: 'LLM 응답 객체 (봇 메시지만)',
    },
    enableLLMTyping: {
      control: 'boolean',
      description: 'LLM 응답 타이핑 효과 활성화 여부',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BotMessage: Story = {
  args: {
    message: {
      id: '1',
      type: 'bot',
      content: '안녕하세요! 무엇을 도와드릴까요?',
      timestamp: new Date(),
    },
    isTyping: false,
  },
};

export const UserMessage: Story = {
  args: {
    message: {
      id: '2',
      type: 'user',
      content: '안녕하세요! 도움이 필요합니다.',
      timestamp: new Date(),
    },
  },
};

export const BotMessageWithTyping: Story = {
  args: {
    message: {
      id: '3',
      type: 'bot',
      content: '타이핑 효과가 적용된 봇 메시지입니다. 글자가 하나씩 나타납니다.',
      timestamp: new Date(),
    },
    isTyping: true,
  },
};

export const LongBotMessage: Story = {
  args: {
    message: {
      id: '4',
      type: 'bot',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      timestamp: new Date(),
    },
    isTyping: false,
  },
};

export const LongUserMessage: Story = {
  args: {
    message: {
      id: '5',
      type: 'user',
      content: '이것은 사용자가 작성한 매우 긴 메시지입니다. 여러 줄에 걸쳐 작성될 수 있으며, 최대 너비를 초과하면 자동으로 줄바꿈이 됩니다. 사용자 메시지는 오른쪽에 정렬되어 표시됩니다.',
      timestamp: new Date(),
    },
  },
};

export const MultilineBotMessage: Story = {
  args: {
    message: {
      id: '6',
      type: 'bot',
      content: `안녕하세요!

이것은 여러 줄로 구성된 봇 메시지입니다.

각 줄이 올바르게 표시되는지 확인해보세요.
- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

감사합니다! 😊`,
      timestamp: new Date(),
    },
    isTyping: false,
  },
};

export const MultilineUserMessage: Story = {
  args: {
    message: {
      id: '7',
      type: 'user',
      content: `안녕하세요!

다음과 같은 질문이 있습니다:

1. 과제 제출 방법
2. 성적 확인 방법
3. 휴학 신청 절차

자세한 안내 부탁드립니다.`,
      timestamp: new Date(),
    },
  },
};

export const ErrorMessage: Story = {
  args: {
    message: {
      id: '8',
      type: 'bot',
      content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      timestamp: new Date(),
      error: true,
    },
    isTyping: false,
  },
};

export const WithEmojis: Story = {
  args: {
    message: {
      id: '9',
      type: 'bot',
      content: '안녕하세요! 😊 오늘 하루는 어떠셨나요? 🌟 궁금한 것이 있으시면 언제든지 물어보세요! 🤗',
      timestamp: new Date(),
    },
    isTyping: false,
  },
};

export const ShortMessages: Story = {
  render: () => (
    <div className="space-y-4">
      <ChatMessage
        message={{
          id: '10',
          type: 'user',
          content: '안녕',
          timestamp: new Date(),
        }}
      />
      <ChatMessage
        message={{
          id: '11',
          type: 'bot',
          content: '안녕하세요!',
          timestamp: new Date(),
        }}
      />
      <ChatMessage
        message={{
          id: '12',
          type: 'user',
          content: '고마워',
          timestamp: new Date(),
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '짧은 메시지들의 대화 예시입니다.',
      },
    },
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <ChatMessage
        message={{
          id: '13',
          type: 'bot',
          content: '안녕하세요! 무엇을 도와드릴까요?',
          timestamp: new Date(Date.now() - 300000),
        }}
      />
      <ChatMessage
        message={{
          id: '14',
          type: 'user',
          content: '과제 제출 방법을 알고 싶어요.',
          timestamp: new Date(Date.now() - 240000),
        }}
      />
      <ChatMessage
        message={{
          id: '15',
          type: 'bot',
          content: '과제 제출은 학습 관리 시스템에서 할 수 있습니다. 자세한 방법을 안내해드릴게요.',
          timestamp: new Date(Date.now() - 180000),
        }}
        isTyping={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 대화 흐름을 보여주는 예시입니다.',
      },
    },
  },
};

// LLM 응답 예시 데이터
const llmResponseExample: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '안녕하세요! 영어 문법에 대한 답변을 드릴게요.',
      attachment: null
    },
    {
      type: 'sub',
      text: '3.14コミュニティ에서는 기초부터 고급까지 학습 가능합니다.',
      attachment: {
        type: 'link',
        url: 'https://example.com/grammar',
        title: '문법 가이드',
        description: '기초 영어 문법을 학습할 수 있는 가이드입니다.'
      }
    },
    {
      type: 'cta',
      text: '더 궁금한 점이 있으시면 말씀해주세요!',
      attachment: null
    }
  ],
  tool: null
};

const llmResponseWithAttachments: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '영어 학습 자료를 준비했습니다.',
      attachment: null
    },
    {
      type: 'sub',
      text: '교재 이미지를 확인해보세요.',
      attachment: {
        type: 'image',
        url: 'https://example.com/textbook.jpg',
        title: '교재 표지',
        thumbnail: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=교재+표지'
      }
    },
    {
      type: 'sub',
      text: 'PDF 자료도 다운로드하세요.',
      attachment: {
        type: 'file',
        url: 'https://example.com/grammar-guide.pdf',
        title: '문법 가이드.pdf',
        description: 'PDF 형태의 상세한 문법 가이드입니다.'
      }
    },
    {
      type: 'cta',
      text: '학습을 시작해보세요!',
      attachment: null
    }
  ],
  tool: 'study_materials'
};

// LLM 응답 스토리들
export const LLMResponse: Story = {
  args: {
    message: {
      id: 'llm-1',
      type: 'bot',
      content: '', // LLM 응답이 있을 때는 content는 무시됨
      timestamp: new Date(),
    },
    llmResponse: llmResponseExample,
    isTyping: false,
    enableLLMTyping: true,
  },
};

export const LLMResponseWithTyping: Story = {
  args: {
    message: {
      id: 'llm-2',
      type: 'bot',
      content: '',
      timestamp: new Date(),
    },
    llmResponse: llmResponseExample,
    isTyping: true,
    enableLLMTyping: true,
  },
};

export const LLMResponseWithAttachments: Story = {
  args: {
    message: {
      id: 'llm-3',
      type: 'bot',
      content: '',
      timestamp: new Date(),
    },
    llmResponse: llmResponseWithAttachments,
    isTyping: false,
    enableLLMTyping: true,
  },
};

export const LLMResponseAttachmentsWithTyping: Story = {
  args: {
    message: {
      id: 'llm-4',
      type: 'bot',
      content: '',
      timestamp: new Date(),
    },
    llmResponse: llmResponseWithAttachments,
    isTyping: true,
    enableLLMTyping: true,
  },
};

// 혼합 대화 예시
export const ConversationWithLLM: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <ChatMessage
        message={{
          id: 'conv-1',
          type: 'user',
          content: '영어 문법에 대해 질문이 있어요.',
          timestamp: new Date(Date.now() - 300000),
        }}
      />
      <ChatMessage
        message={{
          id: 'conv-2',
          type: 'bot',
          content: '',
          timestamp: new Date(Date.now() - 240000),
        }}
        llmResponse={llmResponseExample}
        isTyping={false}
        enableLLMTyping={true}
      />
      <ChatMessage
        message={{
          id: 'conv-3',
          type: 'user',
          content: '감사합니다! 자료가 도움이 되네요.',
          timestamp: new Date(Date.now() - 180000),
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'LLM 응답이 포함된 실제 대화 흐름 예시입니다.',
      },
    },
  },
};