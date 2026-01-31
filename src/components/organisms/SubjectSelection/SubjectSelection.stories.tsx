import type { Meta, StoryObj } from '@storybook/react';
import { SubjectSelection } from './SubjectSelection';
import type { Subject } from '../../../types/api/learningInfo.types';

// 스토리용 과목 데이터
const mockSubjects: Subject[] = [
  {
    subjectId: 'math',
    subjectName: '算数',
    subjectIcon: '📐',
    priority: 1,
  },
  {
    subjectId: 'english',
    subjectName: '英語',
    subjectIcon: '🔤',
    priority: 2,
  },
  {
    subjectId: 'science',
    subjectName: '理科',
    subjectIcon: '🔬',
    priority: 3,
  },
  {
    subjectId: 'social',
    subjectName: '社会',
    subjectIcon: '🌏',
    priority: 4,
  },
  {
    subjectId: 'japanese',
    subjectName: '国語',
    subjectIcon: '📖',
    priority: 5,
  },
];

const meta = {
  title: 'Organisms/SubjectSelection',
  component: SubjectSelection,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SubjectSelection 컴포넌트 - 학습 내비 과목 선택 UI',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSubjectSelect: {
      description: '과목 선택 시 호출되는 콜백 함수',
      action: 'subjectSelected',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
    isLoading: {
      description: '로딩 상태',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SubjectSelection>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    onSubjectSelect: (subjectId: string) => {
      console.log('Selected subject:', subjectId);
    },
    apiSubjects: mockSubjects,
  },
};

// 로딩 상태
export const Loading: Story = {
  args: {
    onSubjectSelect: (subjectId: string) => {
      console.log('Selected subject:', subjectId);
    },
    apiSubjects: null,
    isLoading: true,
  },
};

// 상호작용 예시
export const Interactive: Story = {
  args: {
    onSubjectSelect: (subjectId: string) => {
      const subject = mockSubjects.find((s) => s.subjectId === subjectId);
      alert(`選択された教科: ${subject?.subjectIcon}${subject?.subjectName}`);
    },
    apiSubjects: mockSubjects,
  },
  parameters: {
    docs: {
      description: {
        story: '과목 선택 시 알림창이 표시되는 상호작용 예시',
      },
    },
  },
};

// 모바일 뷰
export const MobileView: Story = {
  args: {
    onSubjectSelect: (subjectId: string) => {
      console.log('Selected subject:', subjectId);
    },
    apiSubjects: mockSubjects,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: '모바일 화면에서의 SubjectSelection 컴포넌트 표시',
      },
    },
  },
};

// 개발자 테스트용
export const DevTest: Story = {
  args: {
    onSubjectSelect: (subjectId: string) => {
      console.group('SubjectSelection Event');
      console.log('Selected subject:', subjectId);
      console.log('Timestamp:', new Date().toISOString());
      const subject = mockSubjects.find((s) => s.subjectId === subjectId);
      console.log('Subject info:', subject);
      console.groupEnd();
    },
    apiSubjects: mockSubjects,
  },
  parameters: {
    docs: {
      description: {
        story: '개발자를 위한 상세한 로깅이 포함된 테스트 스토리',
      },
    },
  },
};
