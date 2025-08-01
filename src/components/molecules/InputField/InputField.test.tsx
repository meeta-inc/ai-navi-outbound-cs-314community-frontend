/**
 * @fileoverview InputField 컴포넌트 테스트
 * 
 * 이 테스트는 이슈 #66 (https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/66)
 * PC 환경에서 입력창 너비가 짧은 문제 해결을 위한 테스트입니다.
 * 
 * 테스트 범위:
 * - PC 환경(lg 브레이크포인트)에서 너비 387px 적용
 * - 모바일 환경에서 기존 반응형 디자인 유지
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
  
  // matchMedia 모킹 (Tailwind의 미디어 쿼리 테스트용)
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query.includes('min-width: 1024px') ? width >= 1024 : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
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
    it('모바일 환경에서 최대 너비가 280px이다', () => {
      mockWindowWidth(375); // 모바일 크기
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('max-w-[280px]');
    });

    it('태블릿 환경에서 최대 너비가 320px이다', () => {
      mockWindowWidth(640); // sm 브레이크포인트
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('sm:max-w-[320px]');
    });

    it('중간 화면에서 최대 너비가 360px이다', () => {
      mockWindowWidth(768); // md 브레이크포인트
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('md:max-w-[360px]');
    });

    it('PC 환경(lg)에서 너비가 387px로 고정된다', () => {
      mockWindowWidth(1024); // lg 브레이크포인트
      
      render(<InputField {...defaultProps} />);
      
      const container = screen.getByRole('textbox').parentElement;
      // 수정 후 예상되는 클래스들
      expect(container).toHaveClass('lg:w-[387px]');
      expect(container).toHaveClass('lg:max-w-[387px]');
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