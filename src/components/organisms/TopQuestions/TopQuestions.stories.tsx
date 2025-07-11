import type { Meta, StoryObj } from '@storybook/react';
import { TopQuestions } from './TopQuestions';
import { fn } from '@storybook/test';

// API 모킹을 위한 mock 데이터
const mockQuestions = {
  general: [
    '서비스 이용 방법이 궁금해요',
    '회원가입은 어떻게 하나요?',
    '비밀번호를 잊어버렸어요'
  ],
  academic: [
    '수강신청은 언제 시작하나요?',
    '성적 확인은 어디서 하나요?',
    '휴학 신청 절차가 궁금합니다'
  ],
  technical: [
    '앱이 실행되지 않아요',
    '로그인이 안 돼요',
    '화면이 깨져서 보여요'
  ],
  payment: [
    '결제 수단을 변경하고 싶어요',
    '환불은 어떻게 받나요?',
    '결제 내역을 확인하고 싶어요'
  ],
  default: [
    '자주 묻는 질문 1',
    '자주 묻는 질문 2',
    '자주 묻는 질문 3'
  ]
};

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
    msw: {
      handlers: [
        // API 모킹 핸들러
      ],
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
    categoryId: 'category1',
    categoryTitle: '授業について',
    userId: 'user123',
  },
};

export const TeacherCategory: Story = {
  args: {
    categoryId: 'category2',
    categoryTitle: '講師について',
    userId: 'user123',
  },
};

export const AchievementCategory: Story = {
  args: {
    categoryId: 'category3',
    categoryTitle: '塾の実績について',
    userId: 'user123',
  },
};

export const HomeworkCategory: Story = {
  args: {
    categoryId: 'category4',
    categoryTitle: '宿題について',
    userId: 'user123',
  },
};

export const OtherCategory: Story = {
  args: {
    categoryId: 'other',
    categoryTitle: 'その他',
    userId: 'user123',
  },
};

export const LongCategoryTitle: Story = {
  args: {
    categoryId: 'category1',
    categoryTitle: '非常に長いカテゴリタイトルを持つFAQセクション',
    userId: 'user123',
  },
};

export const ShortTitle: Story = {
  args: {
    categoryId: 'category2',
    categoryTitle: 'FAQ',
    userId: 'user123',
  },
};

export const WithEmojiTitle: Story = {
  args: {
    categoryId: 'category3',
    categoryTitle: '📚 学習ガイド',
    userId: 'user123',
  },
};

export const WithCustomClass: Story = {
  args: {
    categoryId: 'category1',
    categoryTitle: 'カスタムスタイル',
    userId: 'user123',
    className: 'bg-blue-50 border border-blue-200 rounded-lg',
  },
};