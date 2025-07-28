import type { Meta, StoryObj } from '@storybook/react';
import { TopQuestions } from './TopQuestions';
import { LocaleProvider } from '../../../contexts/LocaleContext';

// Mock function for Storybook actions
const mockFn = () => () => {};

const meta: Meta<typeof TopQuestions> = {
  title: 'Organisms/TopQuestions',
  component: TopQuestions,
  decorators: [
    (Story) => (
      <LocaleProvider locale="ja">
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6' }}>
          <Story />
        </div>
      </LocaleProvider>
    ),
  ],
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
      control: 'select',
      options: ['curriculum', 'schedule', 'pricing'],
      description: '카테고리 ID (curriculum, schedule, pricing)',
    },
    categoryTitle: {
      control: 'text',
      description: '카테고리 제목',
    },
    grade: {
      control: 'select',
      options: ['preschool', 'elementary', 'middle', 'high'],
      description: '학년 (preschool, elementary, middle, high)',
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
    categoryId: 'curriculum',
    categoryTitle: '授業・カリキュラム',
    grade: 'high',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const HighSchoolCurriculum: Story = {
  args: {
    categoryId: 'curriculum',
    categoryTitle: '授業・カリキュラム',
    grade: 'high',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const HighSchoolSchedule: Story = {
  args: {
    categoryId: 'schedule',
    categoryTitle: '通塾・学習時間',
    grade: 'high',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const HighSchoolPricing: Story = {
  args: {
    categoryId: 'pricing',
    categoryTitle: '料金・制度',
    grade: 'high',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const MiddleSchoolCurriculum: Story = {
  args: {
    categoryId: 'curriculum',
    categoryTitle: '授業・カリキュラム',
    grade: 'middle',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const ElementaryCurriculum: Story = {
  args: {
    categoryId: 'curriculum',
    categoryTitle: '授業・カリキュラム',
    grade: 'elementary',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const PreschoolCurriculum: Story = {
  args: {
    categoryId: 'curriculum',
    categoryTitle: '授業・カリキュラム',
    grade: 'preschool',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const LongCategoryTitle: Story = {
  args: {
    categoryId: 'pricing',
    categoryTitle: '非常に長いカテゴリタイトルを持つFAQセクション料金・制度について',
    grade: 'high',
    userId: 'user123',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};

export const WithCustomClass: Story = {
  args: {
    categoryId: 'schedule',
    categoryTitle: '通塾・学習時間',
    grade: 'middle',
    userId: 'user123',
    className: 'bg-blue-50 border border-blue-200 rounded-lg',
    onQuestionSelect: mockFn(),
    onBackToCategories: mockFn(),
    onDataLoaded: mockFn(),
  },
};