import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './ChatInput';
import { LocaleProvider } from '../../../contexts/LocaleContext';

const meta: Meta<typeof ChatInput> = {
  title: 'Organisms/ChatInput',
  component: ChatInput,
  decorators: [
    (Story) => (
      <LocaleProvider>
        <div className="h-screen bg-gray-50 flex flex-col justify-end">
          <Story />
        </div>
      </LocaleProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
채팅 입력 컴포넌트입니다. 학년 선택 상태에 따라 활성화/비활성화됩니다.

## 주요 기능
- 메시지 입력 및 전송
- 메뉴 버튼 (학년 선택 후 활성화)
- Enter 키를 통한 메시지 전송
- 학년 미선택 시 비활성화 상태

## 사용 시나리오
1. **학년 미선택 상태**: 입력창과 메뉴 버튼이 비활성화되어 사용자가 먼저 학년을 선택하도록 유도
2. **학년 선택 완료**: 모든 기능이 활성화되어 정상적인 채팅 가능
      `,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: '입력 필드의 현재 값',
    },
    onChange: {
      action: 'input-changed',
      description: '입력값 변경 시 호출되는 콜백 함수',
    },
    onSend: {
      action: 'message-sent',
      description: '메시지 전송 시 호출되는 콜백 함수',
    },
    disabled: {
      control: 'boolean',
      description: '입력 필드 비활성화 여부',
    },
    placeholder: {
      control: 'text',
      description: '입력 필드 플레이스홀더 텍스트',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    disabled: false,
  },
};

export const WithText: Story = {
  args: {
    value: '안녕하세요! 도움이 필요합니다.',
    disabled: false,
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '무엇을 도와드릴까요? 😊',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: '',
    disabled: true,
  },
};

export const DisabledWithText: Story = {
  args: {
    value: '비활성화된 상태의 텍스트입니다.',
    disabled: true,
  },
};

export const LongText: Story = {
  args: {
    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    disabled: false,
  },
};

export const MultilineText: Story = {
  args: {
    value: `첫 번째 줄입니다.
두 번째 줄도 있습니다.
세 번째 줄까지 입력했습니다.
높이가 자동으로 조절됩니다.`,
    disabled: false,
  },
};

export const EmptyDisabled: Story = {
  args: {
    value: '',
    disabled: false,
    placeholder: '전송 버튼이 비활성화됩니다',
  },
  parameters: {
    docs: {
      description: {
        story: '입력값이 없을 때는 전송 버튼이 자동으로 비활성화됩니다.',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '질문을 자유롭게 입력해주세요! 🎯',
    disabled: false,
  },
};

export const ReadyToSend: Story = {
  args: {
    value: '전송 준비 완료된 메시지입니다.',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '텍스트가 입력된 상태에서는 전송 버튼이 활성화됩니다.',
      },
    },
  },
};

// 이슈 32번 관련: 학년 미선택 시 비활성화 상태
export const GradeNotSelected: Story = {
  args: {
    value: '',
    disabled: true,
    placeholder: 'まずは学年を選択してください',
  },
  parameters: {
    docs: {
      description: {
        story: `
**학년 미선택 상태** - 이슈 #32 구현

학년이 선택되지 않은 상태입니다:
- 입력창이 비활성화되어 텍스트 입력 불가
- 메뉴 버튼이 비활성화되어 클릭 불가  
- 전송 버튼이 비활성화됨
- 플레이스홀더가 학년 선택을 유도하는 메시지로 표시

이는 후속 플로우의 복잡한 분기를 제거하기 위한 UX 개선입니다.
        `,
      },
    },
  },
};

// 타이핑 중 일시 비활성화
export const TypingInProgress: Story = {
  args: {
    value: '방금 전송한 메시지입니다.',
    disabled: true,
    placeholder: 'AI가 답변 중입니다...',
  },
  parameters: {
    docs: {
      description: {
        story: `
**AI 응답 대기 중 상태**

AI가 응답을 생성하는 동안 일시적으로 비활성화된 상태입니다:
- 사용자가 연속으로 메시지를 보내는 것을 방지
- AI 응답 완료 후 다시 활성화됨
        `,
      },
    },
  },
};

// 메뉴 버튼 상태 확인용
export const MenuButtonStates: Story = {
  args: {
    value: '메뉴 버튼 상태를 확인해보세요',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
**메뉴 버튼 상태 테스트**

메뉴 버튼의 활성화/비활성화 상태를 확인할 수 있습니다:
- disabled를 false로 설정하면 메뉴 버튼이 활성화됩니다
- disabled를 true로 설정하면 메뉴 버튼이 비활성화되고 회색으로 표시됩니다
        `,
      },
    },
  },
};

// 학년 선택 완료 후 정상 상태
export const GradeSelected: Story = {
  args: {
    value: '',
    disabled: false,
    placeholder: 'どのようなことを知りたいですか？',
  },
  parameters: {
    docs: {
      description: {
        story: `
**학년 선택 완료 상태**

학년이 선택된 후 정상적으로 채팅이 가능한 상태입니다:
- 모든 버튼이 활성화됨
- 입력창에서 자유롭게 텍스트 입력 가능
- Enter 키로 메시지 전송 가능
- 메뉴 버튼 클릭 가능
        `,
      },
    },
  },
};