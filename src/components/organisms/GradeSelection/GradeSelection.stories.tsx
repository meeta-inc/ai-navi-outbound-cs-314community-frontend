import type { Meta, StoryObj } from '@storybook/react';
import { GradeSelection } from './GradeSelection';
import type { GradeType } from './GradeSelection';

const meta = {
  title: 'Organisms/GradeSelection',
  component: GradeSelection,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'GradeSelection 컴포넌트 - 피그마 디자인과 완전히 일치하는 학년 선택 UI'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onGradeSelect: {
      description: '학년 선택 시 호출되는 콜백 함수',
      action: 'gradeSelected'
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text'
    }
  }
} satisfies Meta<typeof GradeSelection>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    onGradeSelect: (grade: GradeType) => {
      console.log('Selected grade:', grade);
    }
  }
};

// 상호작용 예시
export const Interactive: Story = {
  args: {
    onGradeSelect: (grade: GradeType) => {
      const gradeLabels = {
        preschool: '🐣幼児',
        elementary: '👦小学生',
        middle: '🧑‍🎓中学生',
        high: '👩‍🎓高校生'
      };
      alert(`선택된 학년: ${gradeLabels[grade]}`);
      console.log('Selected grade:', grade);
    }
  },
  parameters: {
    docs: {
      description: {
        story: '학년 선택 시 알림창이 표시되는 상호작용 예시'
      }
    }
  }
};

// 커스텀 스타일 예시
export const WithCustomStyle: Story = {
  args: {
    onGradeSelect: (grade: GradeType) => {
      console.log('Selected grade:', grade);
    },
    className: 'border-2 border-gray-200 rounded-lg p-4'
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 스타일이 적용된 GradeSelection 컴포넌트'
      }
    }
  }
};

// 모바일 뷰 시뮬레이션
export const MobileView: Story = {
  args: {
    onGradeSelect: (grade: GradeType) => {
      console.log('Selected grade:', grade);
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: '모바일 화면에서의 GradeSelection 컴포넌트 표시'
      }
    }
  }
};

// 개발자 테스트용 - 모든 상호작용 로깅
export const DevTest: Story = {
  args: {
    onGradeSelect: (grade: GradeType) => {
      console.group('GradeSelection Event');
      console.log('Selected grade:', grade);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Grade info:', {
        type: grade,
        label: {
          preschool: '🐣幼児',
          elementary: '👦小学生',
          middle: '🧑‍🎓中学生',
          high: '👩‍🎓高校生'
        }[grade]
      });
      console.groupEnd();
    }
  },
  parameters: {
    docs: {
      description: {
        story: '개발자를 위한 상세한 로깅이 포함된 테스트 스토리'
      }
    }
  }
};