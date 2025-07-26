import React from 'react';
import { render, screen } from '@testing-library/react';
import { MenuModal } from './MenuModal';
import { LocaleProvider } from '../../../contexts/LocaleContext';

// Mock 메뉴 설정
const mockMenuConfig = {
  items: [
    {
      id: 'item1',
      icon: { type: 'lucide' as const, value: 'Home' },
      label: '홈',
      action: 'navigate' as const
    },
    {
      id: 'item2', 
      icon: { type: 'lucide' as const, value: 'User' },
      label: '프로필',
      action: 'navigate' as const
    },
    {
      id: 'item3',
      icon: { type: 'lucide' as const, value: 'Settings' },
      label: '설정',
      action: 'navigate' as const
    }
  ],
  cta: {
    label: '문의하기',
    action: 'external-link' as const,
    url: 'https://example.com'
  }
};

const renderMenuModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    menuConfig: mockMenuConfig,
    accentColor: 'orange' as const,
    onMenuItemClick: jest.fn()
  };

  return render(
    <LocaleProvider>
      <MenuModal {...defaultProps} {...props} />
    </LocaleProvider>
  );
};

describe('MenuModal PC 환경 너비 테스트', () => {
  beforeEach(() => {
    // PC 환경 시뮬레이션 (768px 이상)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    // matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('min-width: 768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('PC 환경에서 모달 너비가 500px로 설정되어야 함', () => {
    renderMenuModal();
    
    const modal = screen.getByRole('button', { name: /close/i }).closest('div[data-testid="menu-modal"]') || 
                 document.querySelector('[class*="transform"][class*="shadow-xl"]');
    
    expect(modal).toBeInTheDocument();
    
    // PC 환경에서 500px 너비 클래스 확인
    expect(modal).toHaveClass('sm:w-[500px]');
    expect(modal).toHaveClass('sm:max-w-[500px]');
  });

  test('PC 환경에서 좌우 여백이 제거되어야 함', () => {
    renderMenuModal();
    
    const modal = document.querySelector('[class*="transform"][class*="shadow-xl"]');
    
    // mx-auto 클래스로 중앙 정렬되어야 함
    expect(modal).toHaveClass('mx-auto');
    
    // 내부 콘텐츠 컨테이너에 패딩 확인
    const menuContainer = screen.getByRole('button', { name: /홈/i }).closest('.px-4');
    expect(menuContainer).toBeInTheDocument();
  });

  test('모바일 환경에서는 전체 너비 유지', () => {
    // 모바일 환경 시뮬레이션
    Object.defineProperty(window, 'innerWidth', {
      value: 375,
    });
    
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        matches: !query.includes('min-width: 768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderMenuModal();
    
    const modal = document.querySelector('[class*="transform"][class*="shadow-xl"]');
    
    // 모바일에서는 w-full 클래스 적용
    expect(modal).toHaveClass('w-full');
  });

  test('메뉴 아이템들이 올바르게 렌더링되어야 함', () => {
    renderMenuModal();
    
    // 모든 메뉴 아이템이 렌더링되는지 확인
    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('프로필')).toBeInTheDocument();
    expect(screen.getByText('설정')).toBeInTheDocument();
    
    // CTA 버튼이 렌더링되는지 확인
    expect(screen.getByText('문의하기')).toBeInTheDocument();
  });

  test('PC 환경에서 모달이 중앙에 정렬되어야 함', () => {
    renderMenuModal();
    
    const modalContainer = document.querySelector('.fixed.inset-0');
    
    // 모달 컨테이너가 중앙 정렬 클래스를 가져야 함
    expect(modalContainer).toHaveClass('justify-center');
    expect(modalContainer).toHaveClass('items-end');
  });
});