import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatar } from './UserAvatar';
import type { AccentColor } from '../../../shared/config/theme.config';

const meta: Meta<typeof UserAvatar> = {
  title: 'Molecules/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '사용자(AI 챗봇) 아바타 컴포넌트입니다. 아이콘과 이름을 표시하며, 테마 색상에 따라 스타일이 변경됩니다.',
      },
    },
  },
  argTypes: {
    accentColor: {
      control: 'select',
      options: ['orange', 'blue', 'green', 'red', 'purple'],
      description: '테마 색상',
    },
    supporterName: {
      control: 'text',
      description: '표시할 지원자 이름 (미제공 시 기본값 사용)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    accentColor: 'blue' as AccentColor,
  },
};

export const WithCustomName: Story = {
  args: {
    accentColor: 'blue' as AccentColor,
    supporterName: '도우미 AI',
  },
};

export const PurpleTheme: Story = {
  args: {
    accentColor: 'purple' as AccentColor,
    supporterName: '퍼플 봇',
  },
};

export const GreenTheme: Story = {
  args: {
    accentColor: 'green' as AccentColor,
    supporterName: '그린 도우미',
  },
};

export const OrangeTheme: Story = {
  args: {
    accentColor: 'orange' as AccentColor,
    supporterName: '오렌지 AI',
  },
};

export const RedTheme: Story = {
  args: {
    accentColor: 'red' as AccentColor,
    supporterName: '레드 봇',
  },
};

export const LongName: Story = {
  args: {
    accentColor: 'blue' as AccentColor,
    supporterName: '아주 긴 이름을 가진 AI 도우미',
  },
};

export const ShortName: Story = {
  args: {
    accentColor: 'green' as AccentColor,
    supporterName: 'AI',
  },
};

export const EmojiName: Story = {
  args: {
    accentColor: 'purple' as AccentColor,
    supporterName: '🤖 AI 친구',
  },
};

export const KoreanName: Story = {
  args: {
    accentColor: 'orange' as AccentColor,
    supporterName: '한국어 도우미',
  },
};

export const EnglishName: Story = {
  args: {
    accentColor: 'red' as AccentColor,
    supporterName: 'English Assistant',
  },
};