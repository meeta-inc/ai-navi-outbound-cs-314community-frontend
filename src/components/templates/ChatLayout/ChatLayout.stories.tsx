import type { Meta, StoryObj } from '@storybook/react';
import { ChatLayout } from './ChatLayout';
import NavigationHeader from '../../organisms/NavigationHeader/NavigationHeader';
import { ChatMessage } from '../../organisms/ChatMessage/ChatMessage';
import { ChatInput } from '../../organisms/ChatInput/ChatInput';
import { QuickReply } from '../../organisms/QuickReply/QuickReply';
import { FAQCategory } from '../../organisms/FAQCategory/FAQCategory';

const meta: Meta<typeof ChatLayout> = {
  title: 'Templates/ChatLayout',
  component: ChatLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '채팅 인터페이스의 전체 레이아웃을 정의하는 템플릿 컴포넌트입니다. 헤더, 메시지 영역, 입력 영역, 빠른 응답, FAQ 카테고리를 포함합니다.',
      },
    },
  },
  argTypes: {
    header: {
      description: '헤더 영역에 표시될 컴포넌트',
    },
    messages: {
      description: '메시지 목록을 표시할 컴포넌트',
    },
    input: {
      description: '입력 영역 컴포넌트',
    },
    quickReplies: {
      description: '빠른 응답 컴포넌트 (선택사항)',
    },
    faqCategory: {
      description: 'FAQ 카테고리 컴포넌트 (선택사항)',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages = (
  <div className="space-y-4">
    <ChatMessage
      message={{
        id: '1',
        type: 'bot',
        content: '안녕하세요! 무엇을 도와드릴까요?',
        timestamp: new Date(),
      }}
    />
    <ChatMessage
      message={{
        id: '2',
        type: 'user',
        content: '과제 제출 방법을 알고 싶어요.',
        timestamp: new Date(),
      }}
    />
    <ChatMessage
      message={{
        id: '3',
        type: 'bot',
        content: '과제 제출은 학습 관리 시스템에서 할 수 있습니다. 자세한 방법을 안내해드릴게요.',
        timestamp: new Date(),
      }}
    />
  </div>
);

const sampleHeader = (
  <NavigationHeader
    title="AI 도우미"
    accentColor="blue"
    showLogo={true}
  />
);

const sampleInput = (
  <ChatInput
    value=""
    onChange={() => {}}
    onSend={() => {}}
    placeholder="메시지를 입력하세요..."
  />
);

export const Default: Story = {
  args: {
    header: sampleHeader,
    messages: sampleMessages,
    input: sampleInput,
  },
};

export const WithQuickReplies: Story = {
  args: {
    header: sampleHeader,
    messages: sampleMessages,
    input: sampleInput,
    quickReplies: (
      <QuickReply
        show={true}
        userId="user123"
        onReplyClick={() => {}}
        onShowFAQCategories={() => {}}
      />
    ),
  },
};

export const WithFAQCategory: Story = {
  args: {
    header: sampleHeader,
    messages: sampleMessages,
    input: sampleInput,
    faqCategory: (
      <FAQCategory
        description="궁금한 내용을 선택해주세요"
        onCategorySelect={() => {}}
      />
    ),
  },
};

export const FullLayout: Story = {
  args: {
    header: sampleHeader,
    messages: sampleMessages,
    input: sampleInput,
    quickReplies: (
      <QuickReply
        show={true}
        userId="user123"
        onReplyClick={() => {}}
        onShowFAQCategories={() => {}}
      />
    ),
    faqCategory: (
      <FAQCategory
        description="자주 묻는 질문"
        onCategorySelect={() => {}}
      />
    ),
  },
};

export const EmptyChat: Story = {
  args: {
    header: sampleHeader,
    messages: (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>대화를 시작해보세요! 👋</p>
      </div>
    ),
    input: sampleInput,
    quickReplies: (
      <QuickReply
        show={true}
        userId="user123"
        onReplyClick={() => {}}
        onShowFAQCategories={() => {}}
      />
    ),
  },
};

export const LongConversation: Story = {
  args: {
    header: sampleHeader,
    messages: (
      <div className="space-y-4">
        {Array.from({ length: 10 }, (_, i) => (
          <ChatMessage
            key={i}
            message={{
              id: `${i + 1}`,
              type: i % 2 === 0 ? 'bot' : 'user',
              content: i % 2 === 0 
                ? `봇 메시지 ${Math.floor(i / 2) + 1}: 도움이 되었기를 바랍니다.`
                : `사용자 메시지 ${Math.floor(i / 2) + 1}: 추가 질문이 있습니다.`,
              timestamp: new Date(Date.now() - (10 - i) * 60000),
            }}
          />
        ))}
      </div>
    ),
    input: sampleInput,
  },
};

export const MinimalLayout: Story = {
  args: {
    header: (
      <NavigationHeader
        title="간단한 채팅"
        accentColor="purple"
        showLogo={false}
      />
    ),
    messages: (
      <div className="space-y-4">
        <ChatMessage
          message={{
            id: '1',
            type: 'bot',
            content: '안녕하세요!',
            timestamp: new Date(),
          }}
        />
      </div>
    ),
    input: sampleInput,
  },
};

export const WithTypingBot: Story = {
  args: {
    header: sampleHeader,
    messages: (
      <div className="space-y-4">
        <ChatMessage
          message={{
            id: '1',
            type: 'user',
            content: '안녕하세요!',
            timestamp: new Date(Date.now() - 60000),
          }}
        />
        <ChatMessage
          message={{
            id: '2',
            type: 'bot',
            content: '안녕하세요! 저는 AI 도우미입니다. 궁금한 것이 있으시면 언제든지 물어보세요. 최선을 다해 도와드리겠습니다.',
            timestamp: new Date(),
          }}
          isTyping={true}
        />
      </div>
    ),
    input: sampleInput,
  },
};

export const MobileLayout: Story = {
  args: {
    header: sampleHeader,
    messages: sampleMessages,
    input: sampleInput,
    quickReplies: (
      <QuickReply
        show={true}
        userId="user123"
        onReplyClick={() => {}}
        onShowFAQCategories={() => {}}
      />
    ),
    className: "max-w-sm mx-auto h-screen",
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: '모바일 환경에 최적화된 채팅 레이아웃입니다.',
      },
    },
  },
};

export const CustomTheme: Story = {
  args: {
    header: (
      <NavigationHeader
        title="커스텀 테마"
        accentColor="green"
        showLogo={true}
      />
    ),
    messages: sampleMessages,
    input: sampleInput,
    className: "bg-green-50",
  },
};

export const DarkMode: Story = {
  args: {
    header: (
      <NavigationHeader
        title="다크 모드"
        accentColor="blue"
        showLogo={true}
      />
    ),
    messages: sampleMessages,
    input: sampleInput,
    className: "bg-gray-900 text-white",
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: '다크 모드 스타일링이 적용된 채팅 레이아웃입니다.',
      },
    },
  },
};