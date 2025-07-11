import type { Meta, StoryObj } from '@storybook/react';
import { FAQCategory } from './FAQCategory';
import type { AccentColor } from '../../../shared/config/theme.config';
import { MessageCircleMore, Book, HelpCircle, Settings } from 'lucide-react';

const meta: Meta<typeof FAQCategory> = {
  title: 'Organisms/FAQCategory',
  component: FAQCategory,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAQ 카테고리 목록을 표시하는 컴포넌트입니다. 사용자가 원하는 카테고리를 선택할 수 있습니다.',
      },
    },
  },
  argTypes: {
    categories: {
      description: '표시할 카테고리 목록 (선택사항, 미제공 시 기본값 사용)',
    },
    onCategorySelect: {
      action: 'category-selected',
      description: '카테고리 선택 시 호출되는 콜백 함수',
    },
    description: {
      control: 'text',
      description: '상단에 표시될 설명 텍스트',
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
    description: '궁금한 내용을 선택해주세요',
  },
};

export const WithCustomDescription: Story = {
  args: {
    description: '자주 묻는 질문 카테고리를 선택하세요',
  },
};

export const CustomCategories: Story = {
  args: {
    description: '맞춤 카테고리 예시',
    categories: [
      {
        id: 'technical',
        textKey: '기술 지원',
        valueKey: '기술 관련 문의사항이 있습니다',
        iconConfig: {
          type: 'lucide',
          value: 'Settings',
          fallback: Settings,
        },
      },
      {
        id: 'general',
        textKey: '일반 문의',
        valueKey: '일반적인 궁금증이 있습니다',
        iconConfig: {
          type: 'lucide',
          value: 'HelpCircle',
          fallback: HelpCircle,
        },
      },
      {
        id: 'guide',
        textKey: '이용 가이드',
        valueKey: '사용법을 알고 싶습니다',
        iconConfig: {
          type: 'lucide',
          value: 'Book',
          fallback: Book,
        },
      },
    ],
  },
};

export const SingleCategory: Story = {
  args: {
    description: '단일 카테고리',
    categories: [
      {
        id: 'support',
        textKey: '고객 지원',
        valueKey: '도움이 필요합니다',
        iconConfig: {
          type: 'lucide',
          value: 'MessageCircleMore',
          fallback: MessageCircleMore,
        },
      },
    ],
  },
};

export const ManyCategories: Story = {
  args: {
    description: '다양한 카테고리',
    categories: [
      {
        id: 'account',
        textKey: '계정 관리',
        valueKey: '계정 관련 문의',
        iconConfig: {
          type: 'lucide',
          value: 'User',
        },
      },
      {
        id: 'payment',
        textKey: '결제 문의',
        valueKey: '결제 관련 문의',
        iconConfig: {
          type: 'lucide',
          value: 'CreditCard',
        },
      },
      {
        id: 'technical',
        textKey: '기술 지원',
        valueKey: '기술 관련 문의',
        iconConfig: {
          type: 'lucide',
          value: 'Settings',
        },
      },
      {
        id: 'general',
        textKey: '일반 문의',
        valueKey: '일반적인 문의',
        iconConfig: {
          type: 'lucide',
          value: 'HelpCircle',
        },
      },
      {
        id: 'feedback',
        textKey: '피드백',
        valueKey: '의견을 전달하고 싶습니다',
        iconConfig: {
          type: 'lucide',
          value: 'MessageSquare',
        },
      },
    ],
  },
};

export const WithEmojis: Story = {
  args: {
    description: '이모지가 포함된 카테고리 💫',
    categories: [
      {
        id: 'learning',
        textKey: '📚 학습 관련',
        valueKey: '학습에 대해 궁금합니다',
        iconConfig: {
          type: 'lucide',
          value: 'Book',
        },
      },
      {
        id: 'tech',
        textKey: '⚙️ 기술 지원',
        valueKey: '기술적인 문제가 있습니다',
        iconConfig: {
          type: 'lucide',
          value: 'Settings',
        },
      },
      {
        id: 'community',
        textKey: '👥 커뮤니티',
        valueKey: '커뮤니티 관련 문의',
        iconConfig: {
          type: 'lucide',
          value: 'Users',
        },
      },
    ],
  },
};

export const LongCategoryNames: Story = {
  args: {
    description: '긴 이름의 카테고리들',
    categories: [
      {
        id: 'long1',
        textKey: '매우 긴 카테고리 이름을 가진 첫 번째 항목',
        valueKey: '이 카테고리에 대해 문의하고 싶습니다',
        iconConfig: {
          type: 'lucide',
          value: 'MessageCircleMore',
        },
      },
      {
        id: 'long2',
        textKey: '또 다른 아주 긴 카테고리 이름을 가진 두 번째 항목',
        valueKey: '이것도 선택할 수 있습니다',
        iconConfig: {
          type: 'lucide',
          value: 'HelpCircle',
        },
      },
    ],
  },
};

export const WithoutDescription: Story = {
  args: {
    categories: [
      {
        id: 'simple',
        textKey: '간단한 카테고리',
        valueKey: '설명 없이도 잘 작동합니다',
        iconConfig: {
          type: 'lucide',
          value: 'Check',
        },
      },
    ],
  },
};