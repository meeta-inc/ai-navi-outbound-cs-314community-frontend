import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button/Variants',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '새로운 버튼 변형들을 모아놓은 컬렉션입니다. 다양한 스타일과 크기를 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NeonButton: Story = {
  args: {
    children: '네온 버튼',
    className: 'px-8 py-4 bg-black text-cyan-400 border-2 border-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black font-bold shadow-lg hover:shadow-cyan-400/50 transition-all duration-300',
  },
};

export const GlassmorphismButton: Story = {
  args: {
    children: '글래스모피즘',
    className: 'px-8 py-4 bg-white/20 backdrop-blur-md text-gray-800 border border-white/30 rounded-2xl hover:bg-white/30 font-semibold shadow-xl transition-all duration-300',
  },
};

export const OutlineButton: Story = {
  args: {
    children: '아웃라인 버튼',
    className: 'px-6 py-3 bg-transparent text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white font-semibold transition-all duration-300',
  },
};

export const LargeButton: Story = {
  args: {
    children: '대형 버튼',
    className: 'px-12 py-6 bg-emerald-500 text-white text-xl rounded-2xl hover:bg-emerald-600 font-bold shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-105 transition-all duration-300',
  },
};

export const SmallButton: Story = {
  args: {
    children: '작은 버튼',
    className: 'px-3 py-1.5 bg-rose-500 text-white text-sm rounded-md hover:bg-rose-600 font-medium transition-all duration-200',
  },
};