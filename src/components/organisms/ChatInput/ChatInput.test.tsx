import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';
import { LocaleProvider } from '../../../contexts/LocaleContext';

// Mock locale JSON files
jest.mock('../../../locales/ko/common.json', () => ({
  default: { test: '테스트' }
}));

jest.mock('../../../locales/ja/common.json', () => ({
  default: { test: 'テスト' }
}));

jest.mock('../../../locales/en/common.json', () => ({
  default: { test: 'test' }
}));

// Mock dependencies
jest.mock('../../../hooks/useKeyboardState', () => ({
  useKeyboardState: () => false,
}));

jest.mock('../../../services/menuService', () => ({
  MenuService: {
    getMenuConfig: () => ({
      title: 'Test Menu',
      items: [
        { id: 'test', label: 'Test Item', action: 'test' }
      ]
    })
  }
}));

jest.mock('../../../shared/config/app.config', () => ({
  getAccentColor: () => 'orange',
}));

jest.mock('../../../shared/config/theme.config', () => ({
  getColorClasses: () => ({
    backgroundHover: 'hover:bg-orange-500',
    textBlack: 'text-black',
    text: 'text-orange-500'
  })
}));

jest.mock('../../../assets/icons', () => ({
  SendIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="send-icon">send</svg>
  ),
  CategoryIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="category-icon">menu</svg>
  )
}));

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LocaleProvider>
    {children}
  </LocaleProvider>
);

describe('ChatInput 컴포넌트', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    onSend: jest.fn(),
    onMenuItemClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('학년 미선택 시 비활성화 상태', () => {
    it('disabled가 true일 때 입력창이 비활성화되어야 한다', async () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={true} />
        </TestWrapper>
      );

      await waitFor(() => {
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toBeDisabled();
      });
    });

    it('disabled가 true일 때 적절한 플레이스홀더가 표시되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={true} placeholder="まずは学年を選択してください" />
        </TestWrapper>
      );

      const inputElement = screen.getByPlaceholderText('まずは学年を選択してください');
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).toBeDisabled();
    });

    it('disabled가 true일 때 메뉴 버튼이 비활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={true} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      expect(menuButton).toBeDisabled();
    });

    it('disabled가 true일 때 전송 버튼이 비활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="테스트 메시지" disabled={true} />
        </TestWrapper>
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeDisabled();
    });

    it('disabled가 true일 때 메뉴 버튼 클릭이 무시되어야 한다', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={true} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      await user.click(menuButton);

      // 메뉴 모달이 열리지 않아야 함
      expect(screen.queryByText('Test Menu')).not.toBeInTheDocument();
    });

    it('disabled가 true일 때 Enter 키 입력이 무시되어야 한다', async () => {
      const user = userEvent.setup();
      const onSendMock = jest.fn();
      
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="테스트 메시지" onSend={onSendMock} disabled={true} />
        </TestWrapper>
      );

      const inputElement = screen.getByRole('textbox');
      await user.type(inputElement, '{enter}');

      expect(onSendMock).not.toHaveBeenCalled();
    });
  });

  describe('학년 선택 시 활성화 상태', () => {
    it('disabled가 false일 때 입력창이 활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={false} />
        </TestWrapper>
      );

      const inputElement = screen.getByRole('textbox');
      expect(inputElement).not.toBeDisabled();
    });

    it('disabled가 false일 때 메뉴 버튼이 활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={false} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      expect(menuButton).not.toBeDisabled();
    });

    it('disabled가 false이고 값이 있을 때 전송 버튼이 활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="테스트 메시지" disabled={false} />
        </TestWrapper>
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).not.toBeDisabled();
    });

    it('disabled가 false일 때 메뉴 버튼이 클릭 가능한 상태여야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={false} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      
      // 메뉴 버튼이 클릭 가능한 상태인지 확인
      expect(menuButton).not.toBeDisabled();
      expect(menuButton).toHaveClass('group');
    });

    it('disabled가 false이고 값이 있을 때 Enter 키로 전송이 가능해야 한다', async () => {
      const user = userEvent.setup();
      const onSendMock = jest.fn();
      
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="테스트 메시지" onSend={onSendMock} disabled={false} />
        </TestWrapper>
      );

      const inputElement = screen.getByRole('textbox');
      await user.type(inputElement, '{enter}');

      expect(onSendMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('스타일링 검증', () => {
    it('disabled 상태일 때 메뉴 버튼에 적절한 스타일이 적용되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={true} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      expect(menuButton).toHaveClass('cursor-not-allowed');
    });

    it('disabled 상태일 때 메뉴 아이콘에 회색 스타일이 적용되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={true} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      const icon = menuButton.querySelector('svg');
      expect(icon).toHaveClass('text-gray-400');
    });

    it('활성화 상태일 때 메뉴 버튼에 호버 스타일이 적용되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} disabled={false} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      expect(menuButton).toHaveClass('group');
      expect(menuButton.className).toMatch(/hover:text-white/);
    });
  });

  describe('메시지 값 상태에 따른 전송 버튼', () => {
    it('빈 값일 때 전송 버튼이 비활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="" disabled={false} />
        </TestWrapper>
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeDisabled();
    });

    it('공백만 있을 때 전송 버튼이 비활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="   " disabled={false} />
        </TestWrapper>
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeDisabled();
    });

    it('유효한 값이 있을 때 전송 버튼이 활성화되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="테스트 메시지" disabled={false} />
        </TestWrapper>
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).not.toBeDisabled();
    });
  });

  describe('iOS 호환성', () => {
    // iOS userAgent 설정을 위한 헬퍼 함수
    const setIOSUserAgent = () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        configurable: true,
        writable: true
      });
    };

    const restoreUserAgent = () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
        writable: true
      });
    };

    let originalUserAgent: string;

    beforeEach(() => {
      originalUserAgent = navigator.userAgent;
      setIOSUserAgent();
    });

    afterEach(() => {
      restoreUserAgent();
    });

    it('iOS에서 ChatInput이 화면에 표시되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} />
        </TestWrapper>
      );

      const inputContainer = screen.getByRole('textbox').parentElement?.parentElement;
      expect(inputContainer).toBeInTheDocument();
      expect(inputContainer).toBeVisible();
    });

    it('iOS에서 safe area inset이 적용되어야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} />
        </TestWrapper>
      );

      const container = screen.getByRole('textbox').parentElement?.parentElement;
      const styles = window.getComputedStyle(container!);
      
      // iOS에서는 fixed positioning과 safe area가 적용됨
      expect(container).toHaveAttribute('style');
      const styleAttr = container!.getAttribute('style');
      expect(styleAttr).toContain('position: fixed');
      expect(styleAttr).toContain('bottom: 0');
      expect(styleAttr).toContain('z-index: 1000');
      expect(styleAttr).toContain('padding-bottom: max(1rem, env(safe-area-inset-bottom, 1rem))');
    });

    it('iOS에서 메뉴 버튼이 접근 가능해야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toBeVisible();
    });

    it('iOS에서 전송 버튼이 접근 가능해야 한다', () => {
      render(
        <TestWrapper>
          <ChatInput {...defaultProps} value="테스트" />
        </TestWrapper>
      );

      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeInTheDocument();
      expect(sendButton).toBeVisible();
    });

    it('iOS에서 입력 필드가 정상 작동해야 한다', async () => {
      const user = userEvent.setup();
      const onChangeMock = jest.fn();

      render(
        <TestWrapper>
          <ChatInput {...defaultProps} onChange={onChangeMock} />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'iOS 테스트');

      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  describe('키보드 상태 감지', () => {
    it('키보드가 열렸을 때 적절히 처리되어야 한다', async () => {
      const user = userEvent.setup();
      
      // useKeyboardState mock을 키보드 열림 상태로 변경
      jest.mock('../../../hooks/useKeyboardState', () => ({
        useKeyboardState: () => true,
      }));

      render(
        <TestWrapper>
          <ChatInput {...defaultProps} />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: '메뉴' });
      await user.click(menuButton);

      // 키보드가 열려있을 때는 메뉴가 바로 열리지 않음
      expect(screen.queryByText('Test Menu')).not.toBeInTheDocument();
    });
  });
});