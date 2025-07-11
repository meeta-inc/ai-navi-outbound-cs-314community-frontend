import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CustomIcon, SchoolIcon, TeacherIcon } from './CustomIcon';

const meta: Meta<typeof CustomIcon> = {
  title: 'Atoms/CustomIcon',
  component: CustomIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '프로젝트 전용 커스텀 아이콘들입니다. SVG 형태로 구현되어 있으며 색상과 크기를 조절할 수 있습니다.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS 클래스명 (크기, 색상 등)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-8 h-8 text-blue-500',
  },
};

export const Small: Story = {
  args: {
    className: 'w-4 h-4 text-gray-600',
  },
};

export const Medium: Story = {
  args: {
    className: 'w-6 h-6 text-indigo-500',
  },
};

export const Large: Story = {
  args: {
    className: 'w-12 h-12 text-purple-600',
  },
};

export const School: Story = {
  render: (args) => React.createElement(SchoolIcon, args),
  args: {
    className: 'w-8 h-8 text-emerald-600',
  },
};

export const SchoolSmall: Story = {
  render: (args) => React.createElement(SchoolIcon, args),
  args: {
    className: 'w-5 h-5 text-emerald-500',
  },
};

export const SchoolLarge: Story = {
  render: (args) => React.createElement(SchoolIcon, args),
  args: {
    className: 'w-16 h-16 text-emerald-700',
  },
};

export const Teacher: Story = {
  render: (args) => React.createElement(TeacherIcon, args),
  args: {
    className: 'w-8 h-8 text-orange-600',
  },
};

export const TeacherSmall: Story = {
  render: (args) => React.createElement(TeacherIcon, args),
  args: {
    className: 'w-5 h-5 text-orange-500',
  },
};

export const TeacherLarge: Story = {
  render: (args) => React.createElement(TeacherIcon, args),
  args: {
    className: 'w-16 h-16 text-orange-700',
  },
};

export const ColorVariations: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <CustomIcon className="w-8 h-8 text-red-500" />
      <CustomIcon className="w-8 h-8 text-green-500" />
      <CustomIcon className="w-8 h-8 text-blue-500" />
      <CustomIcon className="w-8 h-8 text-purple-500" />
      <CustomIcon className="w-8 h-8 text-yellow-500" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 색상의 커스텀 아이콘들을 보여줍니다.',
      },
    },
  },
};

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 items-center">
      <div className="text-center">
        <CustomIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
        <p className="text-sm text-gray-600">CustomIcon</p>
      </div>
      <div className="text-center">
        <SchoolIcon className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
        <p className="text-sm text-gray-600">SchoolIcon</p>
      </div>
      <div className="text-center">
        <TeacherIcon className="w-12 h-12 text-orange-600 mx-auto mb-2" />
        <p className="text-sm text-gray-600">TeacherIcon</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 커스텀 아이콘들을 한 눈에 볼 수 있습니다.',
      },
    },
  },
};