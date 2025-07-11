import type { Meta, StoryObj } from '@storybook/react';
import NavigationHeader from './NavigationHeader';
import type { AccentColor } from '../../../shared/config/theme.config';

const meta: Meta<typeof NavigationHeader> = {
  title: 'Organisms/NavigationHeader',
  component: NavigationHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '메인 네비게이션 헤더 컴포넌트입니다. 로고, 뒤로가기 버튼, 동적 메뉴 항목을 포함합니다.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: '헤더 제목',
    },
    accentColor: {
      control: 'select',
      options: ['orange', 'blue', 'green', 'red', 'purple'],
      description: '테마 색상',
    },
    clientId: {
      control: 'text',
      description: '클라이언트 ID (동적 헤더 설정용)',
    },
    showLogo: {
      control: 'boolean',
      description: '로고 표시 여부',
    },
    showDynamicHeader: {
      control: 'boolean',
      description: '동적 헤더 표시 여부',
    },
    onHeaderAction: {
      action: 'header-action',
      description: '헤더 액션 클릭 시 호출되는 콜백 함수',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '홈',
    accentColor: 'blue' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const WithBackButton: Story = {
  args: {
    title: '세부 페이지',
    accentColor: 'blue' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
  parameters: {
    docs: {
      description: {
        story: '홈이 아닌 페이지에서는 뒤로가기 버튼이 표시됩니다.',
      },
    },
  },
};

export const DynamicHeader: Story = {
  args: {
    title: '동적 헤더',
    accentColor: 'purple' as AccentColor,
    clientId: 'example-client',
    showLogo: true,
    showDynamicHeader: true,
  },
};

export const WithoutLogo: Story = {
  args: {
    title: '로고 없는 헤더',
    accentColor: 'green' as AccentColor,
    showLogo: false,
    showDynamicHeader: false,
  },
};

export const PurpleTheme: Story = {
  args: {
    title: '퍼플 테마',
    accentColor: 'purple' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const GreenTheme: Story = {
  args: {
    title: '그린 테마',
    accentColor: 'green' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const OrangeTheme: Story = {
  args: {
    title: '오렌지 테마',
    accentColor: 'orange' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const RedTheme: Story = {
  args: {
    title: '레드 테마',
    accentColor: 'red' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const LongTitle: Story = {
  args: {
    title: '매우 긴 헤더 제목을 가진 페이지 이름',
    accentColor: 'blue' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const ShortTitle: Story = {
  args: {
    title: 'FAQ',
    accentColor: 'blue' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const WithEmoji: Story = {
  args: {
    title: '📚 학습 센터',
    accentColor: 'blue' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const SettingsPage: Story = {
  args: {
    title: '⚙️ 설정',
    accentColor: 'gray' as AccentColor,
    showLogo: false,
    showDynamicHeader: false,
  },
};

export const ProfilePage: Story = {
  args: {
    title: '👤 프로필',
    accentColor: 'blue' as AccentColor,
    showLogo: false,
    showDynamicHeader: false,
  },
};

export const HelpPage: Story = {
  args: {
    title: '❓ 도움말',
    accentColor: 'green' as AccentColor,
    showLogo: true,
    showDynamicHeader: false,
  },
};

export const CustomClient: Story = {
  args: {
    title: '맞춤 클라이언트',
    accentColor: 'purple' as AccentColor,
    clientId: 'custom-client-123',
    showLogo: true,
    showDynamicHeader: true,
  },
};