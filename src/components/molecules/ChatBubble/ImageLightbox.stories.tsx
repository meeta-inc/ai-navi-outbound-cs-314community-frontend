import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ImageLightbox } from './ImageLightbox';

const meta: Meta<typeof ImageLightbox> = {
  title: 'Molecules/ChatBubble/ImageLightbox',
  component: ImageLightbox,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '画像を拡大表示するライトボックスコンポーネントです。ズームイン/アウト、パン機能、キーボードショートカットに対応しています。',
      },
    },
  },
  argTypes: {
    imageUrl: {
      control: 'text',
      description: '表示する画像のURL',
    },
    isOpen: {
      control: 'boolean',
      description: 'ライトボックスの表示状態',
    },
    title: {
      control: 'text',
      description: '画像のタイトル（オプション）',
    },
    onClose: {
      action: 'closed',
      description: 'ライトボックスを閉じる時のコールバック',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な画像ライトボックスです。
 */
export const Default: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/800x600/3498DB/FFFFFF?text=サンプル画像',
    isOpen: true,
    title: 'サンプル画像',
    onClose: () => console.log('ライトボックスを閉じました'),
  },
};

/**
 * タイトルなしの画像ライトボックスです。
 */
export const WithoutTitle: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/800x600/E74C3C/FFFFFF?text=タイトルなし画像',
    isOpen: true,
    onClose: () => console.log('ライトボックスを閉じました'),
  },
};

/**
 * 縦長画像のライトボックスです。
 */
export const PortraitImage: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/400x800/2ECC71/FFFFFF?text=縦長画像',
    isOpen: true,
    title: '縦長画像サンプル',
    onClose: () => console.log('ライトボックスを閉じました'),
  },
};

/**
 * 横長画像のライトボックスです。
 */
export const LandscapeImage: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/1200x400/F39C12/FFFFFF?text=横長画像',
    isOpen: true,
    title: '横長画像サンプル',
    onClose: () => console.log('ライトボックスを閉じました'),
  },
};

/**
 * 高解像度画像のライトボックスです。
 */
export const HighResolution: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/1920x1080/9B59B6/FFFFFF?text=高解像度画像',
    isOpen: true,
    title: '高解像度画像（1920x1080）',
    onClose: () => console.log('ライトボックスを閉じました'),
  },
};

/**
 * インタラクティブなライトボックスの例です。
 * ボタンをクリックして開閉できます。
 */
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          画像を拡大表示
        </button>
        
        <ImageLightbox
          imageUrl="https://via.placeholder.com/800x600/34495E/FFFFFF?text=インタラクティブ画像"
          isOpen={isOpen}
          title="インタラクティブ画像例"
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

/**
 * 複数の画像を切り替えるライトボックスの例です。
 */
export const MultipleImages: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    
    const images = [
      {
        url: 'https://via.placeholder.com/800x600/E74C3C/FFFFFF?text=画像1',
        title: '画像1'
      },
      {
        url: 'https://via.placeholder.com/800x600/3498DB/FFFFFF?text=画像2',
        title: '画像2'
      },
      {
        url: 'https://via.placeholder.com/800x600/2ECC71/FFFFFF?text=画像3',
        title: '画像3'
      }
    ];
    
    return (
      <div className="p-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentImage(index);
                setIsOpen(true);
              }}
              className="relative border-2 border-gray-200 rounded hover:border-blue-400 transition-colors"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-32 object-cover rounded"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2 rounded-b">
                {image.title}
              </div>
            </button>
          ))}
        </div>
        
        <ImageLightbox
          imageUrl={images[currentImage].url}
          isOpen={isOpen}
          title={images[currentImage].title}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

/**
 * 閉じられた状態のライトボックスです（表示されません）。
 */
export const Closed: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/800x600/95A5A6/FFFFFF?text=閉じられた画像',
    isOpen: false,
    title: '閉じられた画像',
    onClose: () => console.log('ライトボックスを閉じました'),
  },
};