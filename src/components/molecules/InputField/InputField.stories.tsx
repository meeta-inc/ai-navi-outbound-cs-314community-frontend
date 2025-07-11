import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './InputField';
import type { AccentColor } from '../../../shared/config/theme.config';

const meta: Meta<typeof InputField> = {
  title: 'Molecules/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '자동 높이 조절이 가능한 텍스트 입력 필드입니다. 채팅 메시지 입력에 최적화되어 있습니다.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: '입력 필드의 현재 값',
    },
    onChange: {
      action: 'changed',
      description: '값 변경 시 호출되는 함수',
    },
    onKeyDown: {
      action: 'keydown',
      description: '키 입력 시 호출되는 함수',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '입력 필드 비활성화 여부',
    },
    accentColor: {
      control: 'select',
      options: ['orange', 'blue', 'green', 'red', 'purple'],
      description: '테마 색상',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'blue' as AccentColor,
    disabled: false,
  },
};

export const WithText: Story = {
  args: {
    value: '안녕하세요! 이것은 입력된 텍스트입니다.',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'blue' as AccentColor,
    disabled: false,
  },
};

export const MultilineText: Story = {
  args: {
    value: `이것은 여러 줄로 구성된 텍스트입니다.
두 번째 줄입니다.
세 번째 줄도 있습니다.
자동으로 높이가 조절됩니다.`,
    placeholder: '메시지를 입력하세요...',
    accentColor: 'blue' as AccentColor,
    disabled: false,
  },
};

export const LongText: Story = {
  args: {
    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'blue' as AccentColor,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: '비활성화된 입력 필드입니다.',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'blue' as AccentColor,
    disabled: true,
  },
};

export const DifferentPlaceholder: Story = {
  args: {
    value: '',
    placeholder: '질문을 자유롭게 입력해주세요! 😊',
    accentColor: 'purple' as AccentColor,
    disabled: false,
  },
};

export const PurpleTheme: Story = {
  args: {
    value: '퍼플 테마가 적용된 입력 필드입니다.',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'purple' as AccentColor,
    disabled: false,
  },
};

export const GreenTheme: Story = {
  args: {
    value: '그린 테마가 적용된 입력 필드입니다.',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'green' as AccentColor,
    disabled: false,
  },
};

export const OrangeTheme: Story = {
  args: {
    value: '오렌지 테마가 적용된 입력 필드입니다.',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'orange' as AccentColor,
    disabled: false,
  },
};

export const RedTheme: Story = {
  args: {
    value: '레드 테마가 적용된 입력 필드입니다.',
    placeholder: '메시지를 입력하세요...',
    accentColor: 'red' as AccentColor,
    disabled: false,
  },
};