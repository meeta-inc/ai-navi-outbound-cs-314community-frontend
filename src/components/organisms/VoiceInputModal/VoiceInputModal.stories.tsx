import type { Meta, StoryObj } from '@storybook/react';
import { VoiceInputModal } from './VoiceInputModal';
import { LocaleProvider } from '../../../contexts/LocaleContext';
import React, { useState } from 'react';

const meta = {
  title: 'Organisms/VoiceInputModal',
  component: VoiceInputModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '음성 입력 모달 컴포넌트. Web Speech API를 사용하여 실시간 음성 인식을 제공합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <LocaleProvider>
        <div style={{ 
          minHeight: '100vh', 
          width: '100vw',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          padding: '20px',
          position: 'relative'
        }}>
          <Story />
        </div>
      </LocaleProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 표시 상태',
    },
    onClose: {
      description: '모달을 닫을 때의 콜백',
    },
    onTranscript: {
      description: '음성 인식 결과를 받는 콜백',
    },
  },
} satisfies Meta<typeof VoiceInputModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙티브 컴포넌트 래퍼
const VoiceInputModalWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [transcripts, setTranscripts] = useState<string[]>([]);

  const handleTranscript = (transcript: string) => {
    console.log('onTranscript:', transcript);
    setTranscripts(prev => [...prev, transcript]);
  };

  const handleClose = () => {
    console.log('onClose');
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        음성 입력 시작
      </button>

      <VoiceInputModal
        isOpen={isOpen}
        onClose={handleClose}
        onTranscript={handleTranscript}
      />

      {transcripts.length > 0 && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>인식 결과:</h3>
          {transcripts.map((text, index) => (
            <p key={index} style={{ margin: '4px 0', fontSize: '14px' }}>
              {index + 1}. {text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// 기본 표시
export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
  render: () => <VoiceInputModalWrapper />,
};

// 열린 상태
export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
};

// 닫힌 상태
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
};

// 시뮬레이션용 (실제 음성 인식 없이)
export const SimulatedRecording: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [simulatedTranscript, setSimulatedTranscript] = useState('');
    
    // 자동으로 텍스트를 추가하는 시뮬레이션
    const simulateRecording = () => {
      const texts = [
        'こんにちは',
        '今日はいい天気ですね',
        'AIアシスタントについて教えてください',
        '音声認識のテストをしています',
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < texts.length) {
          setSimulatedTranscript(texts.slice(0, index + 1).join('、'));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 1500);
      
      return () => clearInterval(interval);
    };

    return (
      <div>
        <button
          onClick={() => {
            setIsOpen(true);
            simulateRecording();
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          음성 입력 시뮬레이션 시작
        </button>

        <VoiceInputModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onTranscript={(transcript: string) => console.log('onTranscript:', transcript)}
        />

        {simulatedTranscript && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
              시뮬레이션 결과:
            </h3>
            <p style={{ margin: '0', fontSize: '14px' }}>{simulatedTranscript}</p>
          </div>
        )}
      </div>
    );
  },
};

// 모바일 뷰
export const MobileView: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
  render: () => <VoiceInputModalWrapper />,
};

// 태블릿 뷰
export const TabletView: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
  render: () => <VoiceInputModalWrapper />,
};

// 다크모드
export const DarkMode: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <LocaleProvider>
        <div 
          style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#1f2937',
          }}
        >
          <Story />
        </div>
      </LocaleProvider>
    ),
  ],
  render: () => <VoiceInputModalWrapper />,
};

// 테마 색상 변경
export const AccentColors: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('onClose'),
    onTranscript: (transcript: string) => console.log('onTranscript:', transcript),
  },
  render: () => {
    const colors = ['blue', 'green', 'purple', 'red', 'orange'];
    const [selectedColor, setSelectedColor] = useState('blue');
    const [isOpen, setIsOpen] = useState(false);

    // 환경변수를 임시로 변경하는 시뮬레이션
    (window as any).VITE_ACCENT_COLOR = selectedColor;

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>테마 색상 선택:</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  (window as any).VITE_ACCENT_COLOR = color;
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedColor === color ? '#3B82F6' : '#e5e7eb',
                  color: selectedColor === color ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          음성 입력 시작 ({selectedColor})
        </button>

        <VoiceInputModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onTranscript={(transcript: string) => console.log('onTranscript:', transcript)}
        />
      </div>
    );
  },
};