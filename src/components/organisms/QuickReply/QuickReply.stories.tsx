import type { Meta, StoryObj } from '@storybook/react';
import { QuickReply } from './QuickReply';
import { GRADE_QUESTION_KEYS } from '../../../shared/constants/grade.constants';

const meta: Meta<typeof QuickReply> = {
  title: 'Organisms/QuickReply',
  component: QuickReply,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '빠른 응답 옵션을 표시하는 컴포넌트입니다. 상위 3개 질문과 "기타" 옵션을 제공합니다.',
      },
    },
  },
  argTypes: {
    onReplyClick: {
      action: 'reply-clicked',
      description: '응답 선택 시 호출되는 콜백 함수',
    },
    onShowFAQCategories: {
      action: 'show-faq-categories',
      description: 'FAQ 카테고리 보기 시 호출되는 콜백 함수',
    },
    show: {
      control: 'boolean',
      description: '컴포넌트 표시 여부',
    },
    userId: {
      control: 'text',
      description: 'API 호출을 위한 사용자 ID',
    },
    options: {
      description: '사용자 정의 옵션 목록 (선택사항)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    show: true,
    userId: 'user123',
  },
};

export const Hidden: Story = {
  args: {
    show: false,
    userId: 'user123',
  },
};

export const CustomOptions: Story = {
  args: {
    show: true,
    userId: 'user123',
    options: [
      {
        id: '1',
        text: '학습 진도는 어떻게 확인하나요?',
        type: 'primary',
      },
      {
        id: '2',
        text: '과제 제출 방법을 알려주세요',
        type: 'primary',
      },
      {
        id: '3',
        text: '성적은 언제 확인할 수 있나요?',
        type: 'primary',
      },
      {
        id: 'other',
        text: '기타 문의사항',
        type: 'secondary',
      },
    ],
  },
};

export const FewOptions: Story = {
  args: {
    show: true,
    userId: 'user123',
    options: [
      {
        id: '1',
        text: '도움이 필요합니다',
        type: 'primary',
      },
      {
        id: 'other',
        text: '기타',
        type: 'secondary',
      },
    ],
  },
};

export const LongQuestions: Story = {
  args: {
    show: true,
    userId: 'user123',
    options: [
      {
        id: '1',
        text: '온라인 수업에서 과제를 제출하는 방법과 마감일 연장 신청 절차에 대해 자세히 알려주세요',
        type: 'primary',
      },
      {
        id: '2',
        text: '중간고사 성적 확인 방법과 성적에 이의가 있을 때 재검토 요청하는 방법을 설명해주세요',
        type: 'primary',
      },
      {
        id: '3',
        text: '휴학 신청 절차와 필요한 서류, 그리고 복학 시 주의사항에 대해 안내해주세요',
        type: 'primary',
      },
      {
        id: 'other',
        text: '기타 문의사항',
        type: 'secondary',
      },
    ],
  },
};

export const ShortQuestions: Story = {
  args: {
    show: true,
    userId: 'user123',
    options: [
      {
        id: '1',
        text: '로그인',
        type: 'primary',
      },
      {
        id: '2',
        text: '비밀번호',
        type: 'primary',
      },
      {
        id: '3',
        text: '성적',
        type: 'primary',
      },
      {
        id: 'other',
        text: '기타',
        type: 'secondary',
      },
    ],
  },
};

export const WithEmojis: Story = {
  args: {
    show: true,
    userId: 'user123',
    options: [
      {
        id: '1',
        text: '📚 과제 제출은 어떻게 하나요?',
        type: 'primary',
      },
      {
        id: '2',
        text: '📊 성적 확인 방법을 알려주세요',
        type: 'primary',
      },
      {
        id: '3',
        text: '💬 교수님께 질문하는 방법은?',
        type: 'primary',
      },
      {
        id: 'other',
        text: '🔍 기타 문의사항',
        type: 'secondary',
      },
    ],
  },
};

export const OnlySecondaryOptions: Story = {
  args: {
    show: true,
    userId: 'user123',
    options: [
      {
        id: '1',
        text: '일반 문의',
        type: 'secondary',
      },
      {
        id: '2',
        text: '기술 지원',
        type: 'secondary',
      },
      {
        id: '3',
        text: '피드백',
        type: 'secondary',
      },
      {
        id: 'other',
        text: '기타',
        type: 'secondary',
      },
    ],
  },
};

export const MixedTypes: Story = {
  args: {
    show: true,
    userId: 'user123',
    options: [
      {
        id: '1',
        text: '중요한 질문입니다',
        type: 'primary',
      },
      {
        id: '2',
        text: '일반적인 질문',
        type: 'secondary',
      },
      {
        id: '3',
        text: '또 다른 중요한 질문',
        type: 'primary',
      },
      {
        id: 'other',
        text: '기타 문의',
        type: 'secondary',
      },
    ],
  },
};

// 학년별 QuickReply 스토리
export const PreschoolGrade: Story = {
  args: {
    show: true,
    userId: 'user123',
    grade: 'preschool',
    showBackButton: true,
    options: [
      {
        id: 'top1',
        text: '入園準備について教えてください',
        type: 'primary',
      },
      {
        id: 'top2',
        text: '保育時間はどのくらいですか？',
        type: 'primary',
      },
      {
        id: 'top3',
        text: '給食はありますか？',
        type: 'primary',
      },
      {
        id: 'other',
        text: 'その他',
        type: 'secondary',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '🐣 幼児 학년을 위한 QuickReply 컴포넌트입니다.',
      },
    },
  },
};

export const ElementaryGrade: Story = {
  args: {
    show: true,
    userId: 'user123',
    grade: 'elementary',
    showBackButton: true,
    options: [
      {
        id: 'top1',
        text: '授業カリキュラムについて教えてください',
        type: 'primary',
      },
      {
        id: 'top2',
        text: '放課後のクラブ活動はありますか？',
        type: 'primary',
      },
      {
        id: 'top3',
        text: '宿題はどのくらい出ますか？',
        type: 'primary',
      },
      {
        id: 'other',
        text: 'その他',
        type: 'secondary',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '👦 小学生 학년을 위한 QuickReply 컴포넌트입니다.',
      },
    },
  },
};

export const MiddleGrade: Story = {
  args: {
    show: true,
    userId: 'user123',
    grade: 'middle',
    showBackButton: true,
    options: [
      {
        id: 'top1',
        text: '夏期講習はいつから始まりますか？',
        type: 'primary',
      },
      {
        id: 'top2',
        text: '年間の授業料はいくらですか？',
        type: 'primary',
      },
      {
        id: 'top3',
        text: '小学生も対象ですか？',
        type: 'primary',
      },
      {
        id: 'other',
        text: 'その他',
        type: 'secondary',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '🧑‍🎓 中学生 학년을 위한 QuickReply 컴포넌트입니다.',
      },
    },
  },
};

export const HighGrade: Story = {
  args: {
    show: true,
    userId: 'user123',
    grade: 'high',
    showBackButton: true,
    options: [
      {
        id: 'top1',
        text: '大学進学実績を教えてください',
        type: 'primary',
      },
      {
        id: 'top2',
        text: '部活動は何がありますか？',
        type: 'primary',
      },
      {
        id: 'top3',
        text: '推薦入試の対策はありますか？',
        type: 'primary',
      },
      {
        id: 'other',
        text: 'その他',
        type: 'secondary',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '👩‍🎓 高校生 학년을 위한 QuickReply 컴포넌트입니다.',
      },
    },
  },
};

export const GradeWithBackButton: Story = {
  args: {
    show: true,
    userId: 'user123',
    grade: 'middle',
    showBackButton: true,
    options: [
      {
        id: 'top1',
        text: '夏期講習はいつから始まりますか？',
        type: 'primary',
      },
      {
        id: 'top2',
        text: '年間の授業料はいくらですか？',
        type: 'primary',
      },
      {
        id: 'top3',
        text: '小学生も対象ですか？',
        type: 'primary',
      },
      {
        id: 'other',
        text: 'その他',
        type: 'secondary',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '学年별 QuickReply에 "もどる" 버튼이 포함된 버전입니다.',
      },
    },
  },
};