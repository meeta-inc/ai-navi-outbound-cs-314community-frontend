import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { Heart, Home, User, Settings, Search, Star } from 'lucide-react';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '아이콘 컴포넌트입니다. Lucide Icons, URL, SVG, 커스텀 컴포넌트 등 다양한 타입을 지원합니다.',
      },
    },
  },
  argTypes: {
    config: {
      description: '아이콘 설정 객체',
    },
    className: {
      control: 'text',
      description: 'CSS 클래스명',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LucideIcon: Story = {
  args: {
    config: {
      type: 'lucide',
      value: 'Heart',
      fallback: Heart,
    },
    className: 'w-6 h-6 text-red-500',
  },
};

export const LucideIconHome: Story = {
  args: {
    config: {
      type: 'lucide',
      value: 'Home',
      fallback: Home,
    },
    className: 'w-6 h-6 text-blue-500',
  },
};

export const LucideIconUser: Story = {
  args: {
    config: {
      type: 'lucide',
      value: 'User',
      fallback: User,
    },
    className: 'w-6 h-6 text-green-500',
  },
};

export const LucideIconSettings: Story = {
  args: {
    config: {
      type: 'lucide',
      value: 'Settings',
      fallback: Settings,
    },
    className: 'w-6 h-6 text-gray-600',
  },
};

export const CustomIconSchool: Story = {
  args: {
    config: {
      type: 'component',
      value: 'SchoolIcon',
    },
    className: 'w-8 h-8 text-indigo-600',
  },
};

export const CustomIconTeacher: Story = {
  args: {
    config: {
      type: 'component',
      value: 'TeacherIcon',
    },
    className: 'w-8 h-8 text-purple-600',
  },
};

export const URLIcon: Story = {
  args: {
    config: {
      type: 'url',
      value: 'https://cdn.jsdelivr.net/npm/lucide@latest/icons/star.svg',
      fallback: Star,
    },
    className: 'w-6 h-6',
  },
};

export const SVGIcon: Story = {
  args: {
    config: {
      type: 'svg',
      value: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    },
    className: 'w-6 h-6 text-green-500',
  },
};

export const SmallIcon: Story = {
  args: {
    config: {
      type: 'lucide',
      value: 'Search',
      fallback: Search,
    },
    className: 'w-4 h-4 text-gray-500',
  },
};

export const LargeIcon: Story = {
  args: {
    config: {
      type: 'lucide',
      value: 'Star',
      fallback: Star,
    },
    className: 'w-12 h-12 text-yellow-500',
  },
};

export const IconWithFallback: Story = {
  args: {
    config: {
      type: 'lucide',
      value: 'NonExistentIcon', // 존재하지 않는 아이콘
      fallback: Heart,
    },
    className: 'w-6 h-6 text-red-500',
  },
};