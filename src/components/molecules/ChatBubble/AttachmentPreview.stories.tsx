import type { Meta, StoryObj } from '@storybook/react';
import { AttachmentPreview } from './AttachmentPreview';

const meta: Meta<typeof AttachmentPreview> = {
  title: 'Molecules/ChatBubble/AttachmentPreview',
  component: AttachmentPreview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '添付ファイルのプレビューを表示するコンポーネントです。画像、動画などの添付ファイルタイプに対応し、クリックで拡大表示やアクションを実行できます。',
      },
    },
  },
  argTypes: {
    attachment: {
      control: 'object',
      description: '添付ファイルデータ',
    },
    className: {
      control: 'text',
      description: '追加CSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 画像添付ファイルのプレビューです。
 */
export const ImageAttachment: Story = {
  args: {
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/3498DB/FFFFFF?text=画像サンプル',
      title: '画像サンプル',
      thumbnail: 'https://via.placeholder.com/300x200/3498DB/FFFFFF?text=画像サンプル'
    },
  },
};

/**
 * 動画添付ファイルのプレビューです。
 */
export const VideoAttachment: Story = {
  args: {
    attachment: {
      type: 'video',
      url: 'https://example.com/sample-video.mp4',
      title: '学習動画サンプル',
      description: 'サンプル動画の説明です。',
      thumbnail: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=動画サムネイル'
    },
  },
};

/**
 * ファイル添付ファイルのプレビューです。
 */
export const FileAttachment: Story = {
  args: {
    attachment: {
      type: 'file',
      url: 'https://example.com/document.pdf',
      title: 'ドキュメント.pdf',
      description: 'PDFドキュメントのサンプルです。',
      thumbnail: 'https://via.placeholder.com/300x200/95A5A6/FFFFFF?text=PDF'
    },
  },
};

/**
 * カスタムCSSクラスが適用されたプレビューです。
 */
export const WithCustomClass: Story = {
  args: {
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/2ECC71/FFFFFF?text=カスタムスタイル',
      title: 'カスタムスタイル画像',
      thumbnail: 'https://via.placeholder.com/300x200/2ECC71/FFFFFF?text=カスタムスタイル'
    },
    className: 'shadow-lg border-2 border-blue-300',
  },
};

/**
 * サムネイルなしの添付ファイルプレビューです。
 */
export const WithoutThumbnail: Story = {
  args: {
    attachment: {
      type: 'image',
      url: 'https://via.placeholder.com/600x400/F39C12/FFFFFF?text=元画像',
      title: 'サムネイルなし画像',
    },
  },
};

/**
 * 複数のプレビューが並んで表示された例です。
 */
export const Multiple: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <div className="w-64">
        <AttachmentPreview 
          attachment={{
            type: 'image',
            url: 'https://via.placeholder.com/600x400/3498DB/FFFFFF?text=画像1',
            title: '画像1',
            thumbnail: 'https://via.placeholder.com/300x200/3498DB/FFFFFF?text=画像1'
          }}
        />
      </div>
      <div className="w-64">
        <AttachmentPreview 
          attachment={{
            type: 'video',
            url: 'https://example.com/video2.mp4',
            title: '動画2',
            thumbnail: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=動画2'
          }}
        />
      </div>
      <div className="w-64">
        <AttachmentPreview 
          attachment={{
            type: 'file',
            url: 'https://example.com/file3.pdf',
            title: 'ファイル3.pdf',
            thumbnail: 'https://via.placeholder.com/300x200/95A5A6/FFFFFF?text=PDF3'
          }}
        />
      </div>
    </div>
  ),
};