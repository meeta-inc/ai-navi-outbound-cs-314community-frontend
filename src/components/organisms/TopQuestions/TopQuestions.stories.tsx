import type { Meta, StoryObj } from '@storybook/react';
import { TopQuestions } from './TopQuestions';

const meta: Meta<typeof TopQuestions> = {
  title: 'Organisms/TopQuestions',
  component: TopQuestions,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '특정 FAQ 카테고리의 상위 질문들을 표시하는 컴포넌트입니다. 뒤로가기 버튼과 질문 목록을 제공합니다.',
      },
    },
  },
  argTypes: {
    categoryId: {
      control: 'text',
      description: '카테고리 ID',
    },
    categoryTitle: {
      control: 'text',
      description: '카테고리 제목',
    },
    onQuestionSelect: {
      action: 'question-selected',
      description: '질문 선택 시 호출되는 콜백 함수',
    },
    onBackToCategories: {
      action: 'back-to-categories',
      description: '카테고리로 돌아가기 시 호출되는 콜백 함수',
    },
    userId: {
      control: 'text',
      description: 'API 호출을 위한 사용자 ID',
    },
    onDataLoaded: {
      action: 'data-loaded',
      description: '데이터 로딩 완료 시 호출되는 콜백 함수 (스크롤용)',
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
    categoryId: 'general',
    categoryTitle: '일반 문의',
    userId: 'user123',
  },
};

export const AcademicCategory: Story = {
  args: {
    categoryId: 'academic',
    categoryTitle: '학사 관련',
    userId: 'user123',
  },
};

export const TechnicalCategory: Story = {
  args: {
    categoryId: 'technical',
    categoryTitle: '기술 지원',
    userId: 'user123',
  },
};

export const LongCategoryTitle: Story = {
  args: {
    categoryId: 'long-title',
    categoryTitle: '매우 긴 카테고리 제목을 가진 FAQ 섹션',
    userId: 'user123',
  },
};

export const ShortCategoryTitle: Story = {
  args: {
    categoryId: 'short',
    categoryTitle: 'FAQ',
    userId: 'user123',
  },
};

export const WithEmojiTitle: Story = {
  args: {
    categoryId: 'emoji',
    categoryTitle: '📚 학습 가이드',
    userId: 'user123',
  },
};

export const PaymentCategory: Story = {
  args: {
    categoryId: 'payment',
    categoryTitle: '💳 결제 문의',
    userId: 'user123',
  },
};

export const AccountCategory: Story = {
  args: {
    categoryId: 'account',
    categoryTitle: '👤 계정 관리',
    userId: 'user123',
  },
};

export const SystemCategory: Story = {
  args: {
    categoryId: 'system',
    categoryTitle: '⚙️ 시스템 설정',
    userId: 'user123',
  },
};

export const CommunityCategory: Story = {
  args: {
    categoryId: 'community',
    categoryTitle: '👥 커뮤니티',
    userId: 'user123',
  },
};

export const SecurityCategory: Story = {
  args: {
    categoryId: 'security',
    categoryTitle: '🔒 보안 관련',
    userId: 'user123',
  },
};

export const MobileCategory: Story = {
  args: {
    categoryId: 'mobile',
    categoryTitle: '📱 모바일 앱',
    userId: 'user123',
  },
};

export const FeedbackCategory: Story = {
  args: {
    categoryId: 'feedback',
    categoryTitle: '💬 피드백 및 제안',
    userId: 'user123',
  },
};

export const WithCustomClass: Story = {
  args: {
    categoryId: 'custom',
    categoryTitle: '맞춤 스타일',
    userId: 'user123',
    className: 'bg-blue-50 border border-blue-200 rounded-lg',
  },
};