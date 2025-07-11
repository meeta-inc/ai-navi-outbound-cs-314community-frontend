import type { Meta, StoryObj } from '@storybook/react';
import DynamicNaviHeader from './DynamicNaviHeader';

const meta: Meta<typeof DynamicNaviHeader> = {
  title: 'Organisms/NavigationHeader/DynamicNaviHeader',
  component: DynamicNaviHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '클라이언트 설정에 따라 동적으로 구성되는 네비게이션 헤더입니다. 액션 버튼들을 설정 가능하게 표시합니다.',
      },
    },
  },
  argTypes: {
    clientId: {
      control: 'text',
      description: '클라이언트 ID (헤더 설정을 결정)',
    },
    onActionClick: {
      action: 'action-clicked',
      description: '액션 버튼 클릭 시 호출되는 콜백 함수',
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

export const Default: Story = {
  args: {
    clientId: 'default-client',
  },
};

export const CustomClient: Story = {
  args: {
    clientId: 'custom-client-123',
  },
};

export const WithClassName: Story = {
  args: {
    clientId: 'styled-client',
    className: 'bg-blue-50 border-b border-blue-200',
  },
};

export const EducationClient: Story = {
  args: {
    clientId: 'education-portal',
  },
  parameters: {
    docs: {
      description: {
        story: '교육 포털을 위한 헤더 설정 예시입니다.',
      },
    },
  },
};

export const BusinessClient: Story = {
  args: {
    clientId: 'business-suite',
  },
  parameters: {
    docs: {
      description: {
        story: '비즈니스 도구를 위한 헤더 설정 예시입니다.',
      },
    },
  },
};

export const CommunityClient: Story = {
  args: {
    clientId: 'community-platform',
  },
  parameters: {
    docs: {
      description: {
        story: '커뮤니티 플랫폼을 위한 헤더 설정 예시입니다.',
      },
    },
  },
};

export const MinimalClient: Story = {
  args: {
    clientId: 'minimal-client',
  },
  parameters: {
    docs: {
      description: {
        story: '최소한의 액션만 포함하는 심플한 헤더입니다.',
      },
    },
  },
};

export const FullFeatured: Story = {
  args: {
    clientId: 'full-featured-client',
  },
  parameters: {
    docs: {
      description: {
        story: '모든 기능을 포함하는 풀 피처 헤더입니다.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    clientId: 'mobile-client',
    className: 'max-w-sm',
  },
  parameters: {
    docs: {
      description: {
        story: '모바일에 최적화된 헤더 레이아웃입니다.',
      },
    },
  },
};

export const ThemeVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Blue Theme</h3>
        <DynamicNaviHeader clientId="blue-theme-client" />
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="text-sm font-medium text-green-800 mb-2">Green Theme</h3>
        <DynamicNaviHeader clientId="green-theme-client" />
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <h3 className="text-sm font-medium text-purple-800 mb-2">Purple Theme</h3>
        <DynamicNaviHeader clientId="purple-theme-client" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 테마가 적용된 동적 헤더들을 보여줍니다.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    clientId: 'non-existent-client',
  },
  parameters: {
    docs: {
      description: {
        story: '존재하지 않는 클라이언트 ID에 대한 폴백 상태입니다.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    clientId: 'loading-client',
  },
  parameters: {
    docs: {
      description: {
        story: '헤더 설정을 로딩하는 중의 상태입니다.',
      },
    },
  },
};

export const DisabledActions: Story = {
  args: {
    clientId: 'disabled-actions-client',
  },
  parameters: {
    docs: {
      description: {
        story: '일부 액션이 비활성화된 헤더입니다.',
      },
    },
  },
};

export const CustomActions: Story = {
  args: {
    clientId: 'custom-actions-client',
  },
  parameters: {
    docs: {
      description: {
        story: '사용자 정의 액션들을 포함한 헤더입니다.',
      },
    },
  },
};