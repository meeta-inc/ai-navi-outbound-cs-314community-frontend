import type { Meta, StoryObj } from '@storybook/react';
import { SubBubbleContent } from './SubBubbleContent';

const meta: Meta<typeof SubBubbleContent> = {
  title: 'Molecules/ChatBubble/SubBubbleContent',
  component: SubBubbleContent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Sub Bubbleタイプで使用されるコンテンツコンポーネントです。URL自動リンク変換と添付ファイル対応機能を提供します。',
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: '表示するテキスト内容',
    },
    className: {
      control: 'text',
      description: '追加CSSクラス',
    },
    isTypingComplete: {
      control: 'boolean',
      description: 'タイピングアニメーション完了状態',
    },
    attachment: {
      control: 'object',
      description: '添付ファイルデータ',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なテキスト表示です。
 */
export const Default: Story = {
  args: {
    content: '一般的なテキストです。',
    isTypingComplete: true,
  },
};

/**
 * URLが自動的にリンクに変換される例です。
 */
export const WithURL: Story = {
  args: {
    content: '詳細は https://www.brainsgym.com/ でご確認ください。',
    isTypingComplete: true,
  },
};

/**
 * 複数のURLが含まれるテキストです。
 */
export const WithMultipleURLs: Story = {
  args: {
    content: '公式サイト: https://example.com ドキュメント: www.docs.example.com サポート: http://support.example.com',
    isTypingComplete: true,
  },
};

/**
 * (image)テキストが含まれる場合、(image)部分が除去されます。
 */
export const WithImageText: Story = {
  args: {
    content: '画像ファイルの詳細情報です (image)',
    isTypingComplete: true,
  },
};

/**
 * リンク添付ファイルの場合、URL変換のみ実行されます。
 */
export const WithLinkAttachment: Story = {
  args: {
    content: '詳細情報は https://example.com/details をご確認ください。',
    attachment: {
      type: 'link',
      url: 'https://example.com/details',
      title: '詳細情報ページ',
      description: '詳細な情報を確認できるページです。'
    },
    isTypingComplete: true,
  },
};

/**
 * 画像添付ファイルの場合、テキストのみ表示されます（AttachmentPreviewはChatBubbleで分離レンダリング）。
 */
export const WithImageAttachment: Story = {
  args: {
    content: '画像をご確認ください。',
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/3498DB/FFFFFF?text=画像サンプル',
      title: '画像サンプル',
      thumbnail: 'https://via.placeholder.com/300x200/3498DB/FFFFFF?text=画像サンプル'
    },
    isTypingComplete: true,
  },
};

/**
 * 動画添付ファイルの場合、テキストのみ表示されます（AttachmentPreviewはChatBubbleで分離レンダリング）。
 */
export const WithVideoAttachment: Story = {
  args: {
    content: '学習動画をご視聴ください。',
    attachment: {
      type: 'video',
      url: 'https://example.com/lesson.mp4',
      title: '学習動画',
      description: '英語学習のための動画です。',
      thumbnail: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=動画サムネイル'
    },
    isTypingComplete: true,
  },
};

/**
 * (image)テキスト除去と添付ファイル機能が組み合わされた例です。
 */
export const WithImageTextAndAttachment: Story = {
  args: {
    content: '画像ファイルをアップロードしました (image)',
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/2ECC71/FFFFFF?text=アップロード画像',
      title: 'アップロード画像',
      thumbnail: 'https://via.placeholder.com/300x200/2ECC71/FFFFFF?text=アップロード画像'
    },
    isTypingComplete: true,
  },
};

/**
 * カスタムCSSクラスが適用された例です。
 */
export const WithCustomClass: Story = {
  args: {
    content: 'CSSクラスが適用されたテキストです。',
    className: 'text-blue-600 font-bold',
    isTypingComplete: true,
  },
};