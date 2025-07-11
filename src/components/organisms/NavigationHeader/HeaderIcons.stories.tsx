import type { Meta, StoryObj } from '@storybook/react';
import { 
  XIcon, 
  MenuIcon, 
  SearchIcon, 
  SettingsIcon, 
  ArrowLeftIcon, 
  ShareIcon, 
  MoreHorizontalIcon 
} from './HeaderIcons';

const meta: Meta<typeof XIcon> = {
  title: 'Organisms/NavigationHeader/HeaderIcons',
  component: XIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '헤더에서 사용되는 아이콘 컴포넌트들입니다. 각 아이콘은 크기와 색상을 조절할 수 있습니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 12, max: 48, step: 2 },
      description: '아이콘 크기',
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

export const XIconStory: Story = {
  args: {
    size: 24,
    className: 'text-gray-600',
  },
  render: (args) => <XIcon {...args} />,
};

export const MenuIconStory: Story = {
  args: {
    size: 24,
    className: 'text-gray-600',
  },
  render: (args) => <MenuIcon {...args} />,
};

export const SearchIconStory: Story = {
  args: {
    size: 24,
    className: 'text-gray-600',
  },
  render: (args) => <SearchIcon {...args} />,
};

export const SettingsIconStory: Story = {
  args: {
    size: 24,
    className: 'text-gray-600',
  },
  render: (args) => <SettingsIcon {...args} />,
};

export const ArrowLeftIconStory: Story = {
  args: {
    size: 24,
    className: 'text-gray-600',
  },
  render: (args) => <ArrowLeftIcon {...args} />,
};

export const ShareIconStory: Story = {
  args: {
    size: 24,
    className: 'text-gray-600',
  },
  render: (args) => <ShareIcon {...args} />,
};

export const MoreHorizontalIconStory: Story = {
  args: {
    size: 24,
    className: 'text-gray-600',
  },
  render: (args) => <MoreHorizontalIcon {...args} />,
};

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-8 p-8">
      <div className="text-center">
        <XIcon size={32} className="text-red-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">XIcon</p>
      </div>
      <div className="text-center">
        <MenuIcon size={32} className="text-blue-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">MenuIcon</p>
      </div>
      <div className="text-center">
        <SearchIcon size={32} className="text-green-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">SearchIcon</p>
      </div>
      <div className="text-center">
        <SettingsIcon size={32} className="text-purple-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">SettingsIcon</p>
      </div>
      <div className="text-center">
        <ArrowLeftIcon size={32} className="text-orange-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">ArrowLeftIcon</p>
      </div>
      <div className="text-center">
        <ShareIcon size={32} className="text-pink-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">ShareIcon</p>
      </div>
      <div className="text-center">
        <MoreHorizontalIcon size={32} className="text-indigo-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">MoreHorizontalIcon</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 헤더 아이콘을 한 눈에 볼 수 있습니다.',
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <MenuIcon size={16} className="text-blue-500" />
      <MenuIcon size={20} className="text-blue-500" />
      <MenuIcon size={24} className="text-blue-500" />
      <MenuIcon size={32} className="text-blue-500" />
      <MenuIcon size={40} className="text-blue-500" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 아이콘을 보여줍니다.',
      },
    },
  },
};

export const ColorVariations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SettingsIcon size={28} className="text-red-500" />
      <SettingsIcon size={28} className="text-orange-500" />
      <SettingsIcon size={28} className="text-yellow-500" />
      <SettingsIcon size={28} className="text-green-500" />
      <SettingsIcon size={28} className="text-blue-500" />
      <SettingsIcon size={28} className="text-indigo-500" />
      <SettingsIcon size={28} className="text-purple-500" />
      <SettingsIcon size={28} className="text-pink-500" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 색상의 아이콘을 보여줍니다.',
      },
    },
  },
};

export const NavigationIcons: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
      <ArrowLeftIcon size={24} className="text-gray-700 hover:text-blue-500 cursor-pointer" />
      <MenuIcon size={24} className="text-gray-700 hover:text-blue-500 cursor-pointer" />
      <SearchIcon size={24} className="text-gray-700 hover:text-blue-500 cursor-pointer" />
      <SettingsIcon size={24} className="text-gray-700 hover:text-blue-500 cursor-pointer" />
      <ShareIcon size={24} className="text-gray-700 hover:text-blue-500 cursor-pointer" />
      <MoreHorizontalIcon size={24} className="text-gray-700 hover:text-blue-500 cursor-pointer" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '네비게이션에서 사용되는 아이콘들의 실제 사용 예시입니다.',
      },
    },
  },
};

export const ButtonStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-gray-600">Normal:</span>
        <XIcon size={24} className="text-gray-600" />
        <SearchIcon size={24} className="text-gray-600" />
        <SettingsIcon size={24} className="text-gray-600" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-gray-600">Hover:</span>
        <XIcon size={24} className="text-blue-500" />
        <SearchIcon size={24} className="text-blue-500" />
        <SettingsIcon size={24} className="text-blue-500" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-gray-600">Active:</span>
        <XIcon size={24} className="text-blue-600" />
        <SearchIcon size={24} className="text-blue-600" />
        <SettingsIcon size={24} className="text-blue-600" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-gray-600">Disabled:</span>
        <XIcon size={24} className="text-gray-300" />
        <SearchIcon size={24} className="text-gray-300" />
        <SettingsIcon size={24} className="text-gray-300" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼의 다양한 상태를 보여줍니다.',
      },
    },
  },
};