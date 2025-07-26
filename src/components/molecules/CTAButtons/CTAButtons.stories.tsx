import type { Meta, StoryObj } from '@storybook/react';
import { CTAButtons } from './CTAButtons';
import { LocaleProvider } from '../../../contexts/LocaleContext';

const meta: Meta<typeof CTAButtons> = {
  title: 'Molecules/CTAButtons',
  component: CTAButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'AI 답변 후 표시되는 CTA 버튼 컴포넌트입니다. 자료청구와 추가 질문 옵션을 제공합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <LocaleProvider>
        <div className="p-4 bg-gray-50 min-h-screen">
          <Story />
        </div>
      </LocaleProvider>
    ),
  ],
  argTypes: {
    show: {
      control: 'boolean',
      description: 'CTA 버튼 표시 여부',
    },
    accentColor: {
      control: 'select',
      options: ['orange', 'blue', 'green', 'red', 'purple'],
      description: '테마 색상',
    },
    onMainClick: {
      action: 'main-clicked',
      description: '메인 CTA 버튼 클릭 시 호출되는 콜백',
    },
    onSubClick: {
      action: 'sub-clicked',
      description: '서브 CTA 버튼 클릭 시 호출되는 콜백',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    show: true,
    accentColor: 'orange',
  },
};

export const BlueTheme: Story = {
  args: {
    show: true,
    accentColor: 'blue',
  },
};

export const GreenTheme: Story = {
  args: {
    show: true,
    accentColor: 'green',
  },
};

export const PurpleTheme: Story = {
  args: {
    show: true,
    accentColor: 'purple',
  },
};

export const RedTheme: Story = {
  args: {
    show: true,
    accentColor: 'red',
  },
};

export const Hidden: Story = {
  args: {
    show: false,
    accentColor: 'orange',
  },
};

export const WithChatContext: Story = {
  args: {
    show: true,
    accentColor: 'blue',
  },
  decorators: [
    (Story) => (
      <LocaleProvider>
        <div className="p-4 bg-white min-h-screen">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <p className="text-sm">こんにちは！英語の文法について回答いたします。</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg mb-2">
                <p className="text-sm">3.14コミュニティでは基礎から上級まで学習可能です。</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg mb-4">
                <p className="text-sm">他にも質問がございましたら、お聞かせください！</p>
              </div>
            </div>
            <Story />
          </div>
        </div>
      </LocaleProvider>
    ),
  ],
};