import type { Meta, StoryObj } from '@storybook/react';
import { LLMResponseGroup } from './LLMResponseGroup';
import { LLMResponse } from '../../../types';

const meta: Meta<typeof LLMResponseGroup> = {
  title: 'Organisms/LLMResponseGroup',
  component: LLMResponseGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'LLM 응답을 여러 개의 버블로 표시하는 그룹 컴포넌트입니다. 순차적 타이핑 효과와 다양한 첨부파일을 지원합니다.',
      },
    },
  },
  argTypes: {
    response: {
      control: 'object',
      description: 'LLM 응답 데이터',
    },
    accentColor: {
      control: 'select',
      options: ['orange', 'blue', 'green', 'red', 'purple'],
      description: '테마 색상',
    },
    enableTyping: {
      control: 'boolean',
      description: '순차적 타이핑 효과 활성화 여부',
    },
    onComplete: {
      action: 'all-bubbles-completed',
      description: '모든 버블 완료 시 호출되는 콜백',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 LLM 응답 그룹
const basicResponse: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '안녕하세요! 영어 문법에 대한 답변을 드릴게요.',
      attachment: null
    },
    {
      type: 'sub',
      text: '3.14コミュニティ에서는 기초부터 고급까지 학습 가능합니다.',
      attachment: null
    },
    {
      type: 'cta',
      text: '더 궁금한 점이 있으시면 말씀해주세요!',
      attachment: null
    }
  ],
  tool: null
};

export const BasicLLMResponse: Story = {
  args: {
    response: basicResponse,
    accentColor: 'orange',
    enableTyping: false,
  },
};

export const WithTypingEffect: Story = {
  args: {
    response: basicResponse,
    accentColor: 'orange',
    enableTyping: true,
  },
};

// 첨부파일이 포함된 LLM 응답
const responseWithAttachments: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '영어 학습 자료를 준비했습니다.',
      attachment: null
    },
    {
      type: 'sub',
      text: '문법 가이드를 확인해보세요.',
      attachment: {
        type: 'link',
        url: 'https://example.com/grammar',
        title: '문법 가이드',
        description: '기초 영어 문법을 학습할 수 있는 가이드입니다.'
      }
    },
    {
      type: 'sub',
      text: '교재 이미지도 함께 확인하세요.',
      attachment: {
        type: 'image',
        url: 'https://example.com/textbook.jpg',
        title: '교재 표지',
        thumbnail: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=교재+표지'
      }
    },
    {
      type: 'cta',
      text: '학습을 시작해보세요!',
      attachment: null
    }
  ],
  tool: null
};

export const WithAttachments: Story = {
  args: {
    response: responseWithAttachments,
    accentColor: 'blue',
    enableTyping: false,
  },
};

export const WithAttachmentsAndTyping: Story = {
  args: {
    response: responseWithAttachments,
    accentColor: 'blue',
    enableTyping: true,
  },
};

// 단일 버블 응답
const singleBubbleResponse: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '간단한 답변입니다.',
      attachment: null
    }
  ],
  tool: null
};

export const SingleBubble: Story = {
  args: {
    response: singleBubbleResponse,
    accentColor: 'green',
    enableTyping: false,
  },
};

// 긴 텍스트가 포함된 응답
const longTextResponse: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '이것은 150자를 초과하는 매우 긴 메인 버블입니다. 메인 버블은 150자까지만 표시되며, 이를 초과하는 텍스트는 자동으로 잘려서 표시됩니다. 이 기능을 통해 사용자 경험을 향상시킬 수 있습니다.',
      attachment: null
    },
    {
      type: 'sub',
      text: '서브 버블은 텍스트 길이 제한이 없습니다. 따라서 이렇게 긴 텍스트도 모두 표시됩니다. 상세한 설명이나 부가 정보를 제공할 때 유용합니다.',
      attachment: null
    },
    {
      type: 'cta',
      text: '추가 질문이 있으시면 언제든 말씀해주세요!',
      attachment: null
    }
  ],
  tool: null
};

export const WithLongText: Story = {
  args: {
    response: longTextResponse,
    accentColor: 'purple',
    enableTyping: false,
  },
};

// 다양한 첨부파일 타입
const allAttachmentTypesResponse: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '다양한 첨부파일을 확인해보세요.',
      attachment: null
    },
    {
      type: 'sub',
      text: '링크 첨부파일입니다.',
      attachment: {
        type: 'link',
        url: 'https://example.com/guide',
        title: '학습 가이드',
        description: '상세한 학습 가이드를 확인하세요.'
      }
    },
    {
      type: 'sub',
      text: '이미지 첨부파일입니다.',
      attachment: {
        type: 'image',
        url: 'https://example.com/diagram.jpg',
        title: '문법 다이어그램',
        thumbnail: 'https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=문법+다이어그램'
      }
    },
    {
      type: 'sub',
      text: '동영상 첨부파일입니다.',
      attachment: {
        type: 'video',
        url: 'https://example.com/lesson.mp4',
        title: '영어 학습 동영상',
        description: '기초 영어 회화를 배울 수 있는 동영상입니다.',
        thumbnail: 'https://via.placeholder.com/300x200/27AE60/FFFFFF?text=학습+동영상'
      }
    },
    {
      type: 'sub',
      text: '파일 첨부파일입니다.',
      attachment: {
        type: 'file',
        url: 'https://example.com/worksheet.pdf',
        title: '학습 워크시트.pdf',
        description: 'PDF 형태의 학습 워크시트입니다.'
      }
    },
    {
      type: 'cta',
      text: '모든 자료를 활용해서 학습해보세요!',
      attachment: null
    }
  ],
  tool: null
};

export const AllAttachmentTypes: Story = {
  args: {
    response: allAttachmentTypesResponse,
    accentColor: 'red',
    enableTyping: false,
  },
};

// 다양한 색상 테마
export const BlueTheme: Story = {
  args: {
    response: basicResponse,
    accentColor: 'blue',
    enableTyping: false,
  },
};

export const GreenTheme: Story = {
  args: {
    response: basicResponse,
    accentColor: 'green',
    enableTyping: false,
  },
};

export const PurpleTheme: Story = {
  args: {
    response: basicResponse,
    accentColor: 'purple',
    enableTyping: false,
  },
};

// 실제 사용 시나리오
const realWorldResponse: LLMResponse = {
  response: [
    {
      type: 'main',
      text: '영어 현재완료 시제에 대해 설명드리겠습니다.',
      attachment: null
    },
    {
      type: 'sub',
      text: '현재완료는 과거에 시작된 동작이 현재까지 지속되거나 현재에 영향을 미치는 시제입니다.',
      attachment: {
        type: 'link',
        url: 'https://example.com/present-perfect',
        title: '현재완료 상세 가이드',
        description: '현재완료 시제의 모든 것을 배워보세요.'
      }
    },
    {
      type: 'sub',
      text: '예문과 함께 연습해보세요.',
      attachment: {
        type: 'file',
        url: 'https://example.com/practice.pdf',
        title: '현재완료 연습문제.pdf',
        description: '다양한 예문과 연습문제가 포함된 PDF입니다.'
      }
    },
    {
      type: 'cta',
      text: '더 자세한 설명이 필요하시면 언제든 질문해주세요!',
      attachment: null
    }
  ],
  tool: 'grammar_explanation'
};

export const RealWorldScenario: Story = {
  args: {
    response: realWorldResponse,
    accentColor: 'orange',
    enableTyping: true,
  },
};