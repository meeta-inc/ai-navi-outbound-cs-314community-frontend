import type { Meta, StoryObj } from '@storybook/react';
import { ChatBubble } from './ChatBubble';
import type { AccentColor } from '../../../shared/config/theme.config';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';

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
    content: '詳しい文法ガイドをご確認ください。 https://example.com/grammar',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'link',
      url: 'https://example.com/grammar',
      title: '文法ガイド',
      description: '基礎英語文法を学習できるガイドです。'
    },
    isTyping: false,
  },
};

export const BubbleWithImageAttachment: Story = {
  args: {
    content: '教材画像をご確認ください。',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/4A90E2/FFFFFF?text=教材表紙',
      title: '教材表紙',
      thumbnail: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=教材表紙'
    },
    isTyping: false,
  },
};

export const BubbleWithImageAttachmentSeparated: Story = {
  name: 'Image Attachment - Separated Rendering',
  args: {
    content: '画像が分離されて表示されます。',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=分離された画像',
      title: '分離された画像例',
      thumbnail: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=分離された画像'
    },
    isTyping: false,
  },
};

export const BubbleWithVideoAttachment: Story = {
  args: {
    content: '学習動画をご視聴ください。',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'video',
      url: 'https://example.com/lesson.mp4',
      title: '英語学習動画',
      description: '基礎英語会話を学べる動画です。',
      thumbnail: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=動画サムネイル'
    },
    isTyping: false,
  },
};

export const BubbleWithVideoAttachmentSeparated: Story = {
  name: 'Video Attachment - Separated Rendering',
  args: {
    content: '動画が分離されて表示されます。',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'video',
      url: 'https://example.com/lesson.mp4',
      title: '分離された動画例',
      description: 'テキストバブルと分離されて表示される動画です。',
      thumbnail: 'https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=分離された動画'
    },
    isTyping: false,
  },
};

export const BubbleWithFileAttachment: Story = {
  args: {
    content: 'PDF資料をダウンロードしてください。',
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'sub',
    attachment: {
      type: 'file',
      url: 'https://example.com/grammar-guide.pdf',
      title: '文法ガイド.pdf',
      description: 'PDF形式の詳細な文法ガイドです。'
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

// ========== Sub Bubble URL 링크 변환 스토리들 ==========

/**
 * Sub Bubble에서 URL이 자동으로 링크로 변환되는 예시입니다.
 */
export const SubBubbleWithURL: Story = {
  args: {
    content: '자세한 내용은 https://www.brainsgym.com/ 에서 확인하세요.',
    isBot: true,
    accentColor: 'blue',
    bubbleType: 'sub',
    isTyping: false,
  },
};

/**
 * Sub Bubble에서 여러 URL이 포함된 경우의 예시입니다.
 */
export const SubBubbleWithMultipleURLs: Story = {
  args: {
    content: '공식 사이트: https://example.com 문서: www.docs.example.com',
    isBot: true,
    accentColor: 'blue',
    bubbleType: 'sub',
    isTyping: false,
  },
};

/**
 * (image) 텍스트가 포함된 Sub Bubble 예시입니다.
 * (image) 텍스트는 제거되고 첨부파일이 있는 경우 분리 렌더링됩니다.
 */
export const SubBubbleWithImageText: Story = {
  args: {
    content: '画像ファイルの詳細情報です (image)',
    isBot: true,
    accentColor: 'green',
    bubbleType: 'sub',
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/2ECC71/FFFFFF?text=画像ファイル',
      title: '画像ファイル例',
      thumbnail: 'https://via.placeholder.com/300x200/2ECC71/FFFFFF?text=画像ファイル'
    },
    isTyping: false,
  },
};

/**
 * (image) 텍스트와 타이핑 효과가 적용된 예시입니다.
 * 타이핑 애니메이션이 완료된 후 첨부파일 미리보기가 표시됩니다.
 */
export const SubBubbleWithImageTextTyping: Story = {
  args: {
    content: '画像ファイルをアップロードしました (image)',
    isBot: true,
    accentColor: 'green',
    bubbleType: 'sub',
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/F39C12/FFFFFF?text=アップロード画像',
      title: 'アップロード画像',
      thumbnail: 'https://via.placeholder.com/300x200/F39C12/FFFFFF?text=アップロード画像'
    },
    isTyping: true,
  },
};

// ========== LLM 에러 메시지 스토리들 ==========

/**
 * LLM 에러 상황에서 표시되는 기본 에러 메시지입니다.
 * 빈 응답이나 HTTP 에러 시 사용됩니다.
 */
export const LLMErrorMessage: Story = {
  args: {
    content: ERROR_MESSAGES.LLM_TEMPORARY_ERROR,
    isBot: true,
    accentColor: 'red',
    bubbleType: 'main',
    isTyping: false,
  },
};

/**
 * 타이핑 효과가 적용된 LLM 에러 메시지입니다.
 */
export const LLMErrorMessageWithTyping: Story = {
  args: {
    content: ERROR_MESSAGES.LLM_TEMPORARY_ERROR,
    isBot: true,
    accentColor: 'red',
    bubbleType: 'main',
    isTyping: true,
  },
};

/**
 * 한국어 버전의 LLM 에러 메시지입니다.
 */
export const LLMErrorMessageKorean: Story = {
  args: {
    content: ERROR_MESSAGES.LLM_TEMPORARY_ERROR_KO,
    isBot: true,
    accentColor: 'red',
    bubbleType: 'main',
    isTyping: false,
  },
};

/**
 * Orange 테마의 LLM 에러 메시지입니다.
 */
export const LLMErrorMessageOrange: Story = {
  args: {
    content: ERROR_MESSAGES.LLM_TEMPORARY_ERROR,
    isBot: true,
    accentColor: 'orange',
    bubbleType: 'main',
    isTyping: false,
  },
};

/**
 * Blue 테마의 LLM 에러 메시지입니다.
 */
export const LLMErrorMessageBlue: Story = {
  args: {
    content: ERROR_MESSAGES.LLM_TEMPORARY_ERROR,
    isBot: true,
    accentColor: 'blue',
    bubbleType: 'main',
    isTyping: false,
  },
};

/**
 * 다양한 LLM 에러 시나리오들을 보여주는 스토리입니다.
 */
export const LLMErrorScenarios: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">일반적인 LLM 에러 (Red)</h3>
        <ChatBubble
          content={ERROR_MESSAGES.LLM_TEMPORARY_ERROR}
          isBot={true}
          accentColor="red"
          bubbleType="main"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">네트워크 에러 (Orange)</h3>
        <ChatBubble
          content="ネットワーク接続に問題があります。インターネット接続を確認してください。"
          isBot={true}
          accentColor="orange"
          bubbleType="main"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">서버 에러 (Red)</h3>
        <ChatBubble
          content="サーバーエラーが発生しました。しばらく待ってから再度お試しください。"
          isBot={true}
          accentColor="red"
          bubbleType="main"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">타임아웃 에러 (Blue)</h3>
        <ChatBubble
          content="リクエストがタイムアウトしました。時間をおいて再度お試しください。"
          isBot={true}
          accentColor="blue"
          bubbleType="main"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">한국어 에러 메시지</h3>
        <ChatBubble
          content={ERROR_MESSAGES.LLM_TEMPORARY_ERROR_KO}
          isBot={true}
          accentColor="red"
          bubbleType="main"
        />
      </div>
    </div>
  ),
};