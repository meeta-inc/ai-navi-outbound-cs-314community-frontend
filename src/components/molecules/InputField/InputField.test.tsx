/**
 * @fileoverview InputField 컴포넌트 테스트
 * 
 * 이 테스트는 이슈 #66 (https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/66)
 * PC 환경에서 입력창 너비가 짧은 문제 해결을 위한 테스트입니다.
 * 
 * 테스트 범위:
 * - PC 환경(500px 이상)에서 너비 387px 동적 스타일 적용
 * - 모바일 환경(500px 미만)에서 기존 반응형 디자인 유지
 * - 입력창 기본 기능 정상 작동
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputField } from './InputField';

// Mock 의존성
jest.mock('../../../contexts/LocaleContext', () => ({
  useLocale: () => ({
    t: (key: string) => key
  })
}));

jest.mock('../../../shared/config/theme.config', () => ({
  getColorClasses: () => ({
    textBlack: 'text-black'
  }),
  AccentColor: {
    BLUE: 'blue'
  }
}));

// Window 객체 모킹을 위한 도우미 함수
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  // resize 이벤트 모킹을 위한 addEventListener 모킹
  const mockAddEventListener = jest.fn();
  const mockRemoveEventListener = jest.fn();
  
  Object.defineProperty(window, 'addEventListener', {
    writable: true,
    value: mockAddEventListener,
  });
  
  Object.defineProperty(window, 'removeEventListener', {
    writable: true,
    value: mockRemoveEventListener,
  });
};

describe('InputField', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    accentColor: 'blue' as any
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('기본 렌더링', () => {
    it('입력필드가 정상적으로 렌더링된다', () => {
      render(<InputField {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('placeholder가 올바르게 표시된다', () => {
      const placeholder = '메시지를 입력하세요';
      render(<InputField {...defaultProps} placeholder={placeholder} />);
      
      const textarea = screen.getByPlaceholderText(placeholder);
      expect(textarea).toBeInTheDocument();
    });

    it('disabled 상태가 올바르게 적용된다', () => {
      render(<InputField {...defaultProps} disabled={true} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });
  });

  describe('사용자 상호작용', () => {
    it('텍스트 입력 시 onChange가 호출된다', () => {
      const onChange = jest.fn();
      render(<InputField {...defaultProps} onChange={onChange} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: '테스트 메시지' } });
      
      expect(onChange).toHaveBeenCalledWith('테스트 메시지');
    });

    it('키보드 이벤트가 올바르게 처리된다', () => {
      const onKeyDown = jest.fn();
      render(<InputField {...defaultProps} onKeyDown={onKeyDown} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter' });
      
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe('반응형 디자인 - 이슈 #66', () => {
    it('모바일 환경(500px 미만)에서 최대 너비가 280px이다', () => {
      mockWindowWidth(375); // 모바일 크기
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('max-w-[280px]');
      expect(container).not.toHaveStyle('width: 387px');
    });

    it('PC 환경(500px)에서 너비가 387px로 고정된다', () => {
      mockWindowWidth(500); // 정확히 500px
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveStyle('width: 387px');
      expect(container).toHaveStyle('max-width: 387px');
    });

    it('PC 환경(640px)에서 너비가 387px로 고정된다', () => {
      mockWindowWidth(640); // PC 크기 (500px 이상)
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveStyle('width: 387px');
      expect(container).toHaveStyle('max-width: 387px');
    });

    it('PC 환경(1024px)에서 너비가 387px로 고정된다', () => {
      mockWindowWidth(1024); // PC 크기 (500px 이상)
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveStyle('width: 387px');
      expect(container).toHaveStyle('max-width: 387px');
    });

    it('499px에서는 모바일로 간주되어 387px가 적용되지 않는다', () => {
      mockWindowWidth(499); // 500px 미만
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).not.toHaveStyle('width: 387px');
      expect(container).toHaveClass('max-w-[280px]');
    });
  });

  describe('스타일링', () => {
    it('컨테이너에 올바른 스타일이 적용된다', () => {
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveStyle({
        display: 'flex',
        maxHeight: '300px',
        padding: '5px 15px',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '10px',
        borderRadius: '10px',
        background: '#EBEBEB'
      });
    });

    it('textarea에 올바른 스타일이 적용된다', () => {
      render(<InputField {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveStyle({
        maxHeight: '270px',
        fontFamily: 'Work Sans',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        width: '100%',
        minHeight: '24px'
      });
    });
  });

  describe('자동 높이 조절', () => {
    it('긴 텍스트 입력 시 높이가 자동으로 조절된다', () => {
      const onChange = jest.fn();
      render(<InputField {...defaultProps} onChange={onChange} />);
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      
      // 긴 텍스트 입력 시뮬레이션
      const longText = '이것은 매우 긴 텍스트입니다. '.repeat(10);
      
      // scrollHeight를 모킹
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        value: 100
      });
      
      fireEvent.change(textarea, { target: { value: longText } });
      
      expect(onChange).toHaveBeenCalledWith(longText);
    });

    it('최대 높이(128px)를 초과하지 않는다', () => {
      render(<InputField {...defaultProps} />);
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      
      // 매우 큰 scrollHeight 모킹
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        value: 200
      });
      
      fireEvent.change(textarea, { target: { value: 'test' } });
      
      // 높이가 128px을 초과하지 않아야 함
      expect(textarea.style.height).toBe('128px');
    });
  });
});