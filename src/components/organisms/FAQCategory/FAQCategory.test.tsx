/**
 * @fileoverview FAQCategory 컴포넌트 테스트
 * 
 * 이 테스트는 이슈 #29 (https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29)
 * TDD 단계2-1에서 작성된 테스트로, FAQCategory 컴포넌트의 카테고리 표시 기능을 검증합니다.
 * 
 * 테스트 범위:
 * - 정확히 3개 카테고리만 렌더링 (이슈 #29 요구사항)
 * - 카테고리 클릭 시 올바른 콜백 호출
 * - 카테고리명의 올바른 표시 (일본어)
 */

import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FAQCategory, FAQCategoryItem } from './FAQCategory';

// Mock 의존성
jest.mock('../../../shared/config/theme.config', () => ({
  getColorClasses: () => ({
    background: 'bg-blue-500',
    textWhite: 'text-white',
    textMuted: 'text-gray-500'
  })
}));

jest.mock('../../../shared/config/app.config', () => ({
  getAccentColor: () => 'blue'
}));

jest.mock('../../../shared/config/faqCategories.config', () => ({
  getEnabledFAQCategories: () => [
    {
      id: 'curriculum',
      textKey: 'chat.faq.curriculum.title',
      valueKey: 'chat.faq.curriculum.message',
      iconConfig: { type: 'lucide', value: 'BookOpen' },
      order: 1,
      enabled: true
    },
    {
      id: 'schedule',
      textKey: 'chat.faq.schedule.title', 
      valueKey: 'chat.faq.schedule.message',
      iconConfig: { type: 'lucide', value: 'Clock' },
      order: 2,
      enabled: true
    },
    {
      id: 'pricing',
      textKey: 'chat.faq.pricing.title',
      valueKey: 'chat.faq.pricing.message', 
      iconConfig: { type: 'lucide', value: 'DollarSign' },
      order: 3,
      enabled: true
    }
  ]
}));

jest.mock('../../../shared/config/iconConfig', () => ({
  getIconConfig: () => ({
    curriculum: { name: 'BookOpen', className: 'w-4 h-4' },
    schedule: { name: 'Clock', className: 'w-4 h-4' },
    pricing: { name: 'DollarSign', className: 'w-4 h-4' }
  })
}));

// LocaleContext Mock - useLocale 훅을 직접 Mock
jest.mock('../../../contexts/LocaleContext', () => ({
  useLocale: jest.fn(() => ({
    locale: 'ja',
    setLocale: jest.fn(),
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'chat.faq.curriculum.title': '授業・カリキュラム',
        'chat.faq.schedule.title': '通塾・学習時間',
        'chat.faq.pricing.title': '料金・制度',
        'chat.faq.description': 'よくある質問'
      };
      return translations[key] || key;
    },
    isLoading: false
  }))
}));

describe('FAQCategory Component - TDD Stage 2-1', () => {
  /**
   * 🎯 이슈 #29 핵심 요구사항 테스트: 3개 카테고리만 렌더링
   * 
   * 검증 내용: FAQCategory 컴포넌트가 정확히 3개의 카테고리만 표시하는지 확인
   * - curriculum (授業・カリキュラム)
   * - schedule (通塾・学習時間)  
   * - pricing (料金・制度)
   * 
   * 현재 구현: 5개 디폴트 카테고리 → 3개로 수정 필요
   */
  describe('Category rendering requirements', () => {
    it('should render exactly 3 categories', () => {
      const mockOnCategorySelect = jest.fn();
      
      render(<FAQCategory onCategorySelect={mockOnCategorySelect} />);

      // 버튼 요소로 카테고리 개수 확인
      const categoryButtons = screen.getAllByRole('button');
      expect(categoryButtons).toHaveLength(3);
    });

    /**
     * 🎯 카테고리명이 올바른 일본어로 표시되는지 확인
     * 
     * 검증 내용: 이슈 #29에서 지정한 정확한 일본어 카테고리명 표시 확인
     */
    it('should display correct Japanese category names', () => {
      const mockOnCategorySelect = jest.fn();
      
      render(<FAQCategory onCategorySelect={mockOnCategorySelect} />);

      expect(screen.getByText('授業・カリキュラム')).toBeInTheDocument();
      expect(screen.getByText('通塾・学習時間')).toBeInTheDocument();
      expect(screen.getByText('料金・制度')).toBeInTheDocument();
    });

    /**
     * 🎯 기본 3개 카테고리가 올바른 구조로 생성되는지 확인
     * 
     * 검증 내용: 각 카테고리가 필요한 속성들을 가지고 있는지 확인
     */
    it('should create 3 default categories with correct structure', () => {
      const mockOnCategorySelect = jest.fn();
      
      render(<FAQCategory onCategorySelect={mockOnCategorySelect} />);

      // 각 카테고리 버튼이 존재하고 올바른 텍스트를 가지는지 확인
      const curriculumButton = screen.getByRole('button', { name: /授業・カリキュラム/ });
      const scheduleButton = screen.getByRole('button', { name: /通塾・学習時間/ });
      const pricingButton = screen.getByRole('button', { name: /料金・制度/ });

      expect(curriculumButton).toBeInTheDocument();
      expect(scheduleButton).toBeInTheDocument();
      expect(pricingButton).toBeInTheDocument();
    });
  });

  /**
   * 🎯 카테고리 클릭 이벤트 처리 테스트
   * 
   * 검증 내용: 카테고리 클릭 시 올바른 콜백이 올바른 파라미터와 함께 호출되는지 확인
   */
  describe('Category click handling', () => {
    it('should call onCategorySelect with correct category when curriculum is clicked', () => {
      const mockOnCategorySelect = jest.fn();
      
      render(<FAQCategory onCategorySelect={mockOnCategorySelect} />);

      const curriculumButton = screen.getByRole('button', { name: /授業・カリキュラム/ });
      fireEvent.click(curriculumButton);

      expect(mockOnCategorySelect).toHaveBeenCalledTimes(1);
      expect(mockOnCategorySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'curriculum',
          textKey: expect.any(String)
        })
      );
    });

    it('should call onCategorySelect with correct category when schedule is clicked', () => {
      const mockOnCategorySelect = jest.fn();
      
      render(<FAQCategory onCategorySelect={mockOnCategorySelect} />);

      const scheduleButton = screen.getByRole('button', { name: /通塾・学習時間/ });
      fireEvent.click(scheduleButton);

      expect(mockOnCategorySelect).toHaveBeenCalledTimes(1);
      expect(mockOnCategorySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'schedule',
          textKey: expect.any(String)
        })
      );
    });

    it('should call onCategorySelect with correct category when pricing is clicked', () => {
      const mockOnCategorySelect = jest.fn();
      
      render(<FAQCategory onCategorySelect={mockOnCategorySelect} />);

      const pricingButton = screen.getByRole('button', { name: /料金・制度/ });
      fireEvent.click(pricingButton);

      expect(mockOnCategorySelect).toHaveBeenCalledTimes(1);
      expect(mockOnCategorySelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pricing',
          textKey: expect.any(String)
        })
      );
    });

    /**
     * 🎯 각 클릭 이벤트가 독립적으로 동작하는지 확인
     * 
     * 검증 내용: 여러 카테고리를 순차적으로 클릭했을 때 각각 올바르게 처리되는지 확인
     */
    it('should handle multiple category clicks independently', () => {
      const mockOnCategorySelect = jest.fn();
      
      render(<FAQCategory onCategorySelect={mockOnCategorySelect} />);

      const curriculumButton = screen.getByRole('button', { name: /授業・カリキュラム/ });
      const scheduleButton = screen.getByRole('button', { name: /通塾・学習時間/ });
      const pricingButton = screen.getByRole('button', { name: /料金・制度/ });

      // 순차적으로 클릭
      fireEvent.click(curriculumButton);
      fireEvent.click(scheduleButton);
      fireEvent.click(pricingButton);

      expect(mockOnCategorySelect).toHaveBeenCalledTimes(3);
      
      // 각 호출이 올바른 카테고리 ID로 이루어졌는지 확인
      expect(mockOnCategorySelect.mock.calls[0][0]).toMatchObject({ id: 'curriculum' });
      expect(mockOnCategorySelect.mock.calls[1][0]).toMatchObject({ id: 'schedule' });
      expect(mockOnCategorySelect.mock.calls[2][0]).toMatchObject({ id: 'pricing' });
    });
  });

  /**
   * 🎯 커스텀 카테고리 지원 테스트
   * 
   * 검증 내용: props로 전달된 카테고리가 올바르게 렌더링되는지 확인
   * (기존 5개 디폴트 대신 3개 카테고리 사용 시)
   */
  describe('Custom categories support', () => {
    it('should render custom categories when provided', () => {
      const customCategories: FAQCategoryItem[] = [
        {
          id: 'curriculum',
          textKey: 'chat.faq.curriculum.title',
          valueKey: 'chat.faq.curriculum.message'
        },
        {
          id: 'schedule', 
          textKey: 'chat.faq.schedule.title',
          valueKey: 'chat.faq.schedule.message'
        },
        {
          id: 'pricing',
          textKey: 'chat.faq.pricing.title', 
          valueKey: 'chat.faq.pricing.message'
        }
      ];

      const mockOnCategorySelect = jest.fn();
      
      render(
        <FAQCategory 
          categories={customCategories}
          onCategorySelect={mockOnCategorySelect} 
        />
      );

      expect(screen.getAllByRole('button')).toHaveLength(3);
      expect(screen.getByText('授業・カリキュラム')).toBeInTheDocument();
      expect(screen.getByText('通塾・学習時間')).toBeInTheDocument();
      expect(screen.getByText('料金・制度')).toBeInTheDocument();
    });
  });
});