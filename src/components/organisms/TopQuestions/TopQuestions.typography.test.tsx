import React from 'react';
import { render } from '@testing-library/react';
import { TopQuestions } from './TopQuestions';
import { LocaleProvider } from '../../../contexts/LocaleContext';
import { GradeType, CategoryType } from '../../../shared/constants/gradeQuestions.constants';

// Mock the API service
jest.mock('../../../services/api/questions', () => ({
  updateQuestionStats: jest.fn().mockResolvedValue({})
}));

// Mock the grade questions constants to avoid undefined errors
jest.mock('../../../shared/constants/gradeQuestions.constants', () => ({
  ...jest.requireActual('../../../shared/constants/gradeQuestions.constants'),
  GRADE_CATEGORY_QUESTIONS: {
    middle1: {
      studyMethod: [
        { text: 'Test question 1', isBest: true },
        { text: 'Test question 2', isBest: false }
      ]
    },
    middle2: {
      studyMethod: [
        { text: 'Test question 1', isBest: true }
      ]
    },
    high1: {
      studyMethod: [
        { text: 'Test question 1', isBest: true }
      ]
    }
  }
}));

// Mock locale provider
const MockedTopQuestions = ({ 
  categoryId = 'studyMethod' as CategoryType,
  categoryTitle = '학습 방법',
  grade = 'middle1' as GradeType,
  onQuestionSelect,
  onBackToCategories,
  userId = 'test-user'
}: { 
  categoryId?: CategoryType;
  categoryTitle?: string;
  grade?: GradeType;
  onQuestionSelect: jest.Mock;
  onBackToCategories: jest.Mock;
  userId?: string;
}) => (
  <LocaleProvider locale="ja">
    <TopQuestions 
      categoryId={categoryId}
      categoryTitle={categoryTitle}
      grade={grade}
      onQuestionSelect={onQuestionSelect}
      onBackToCategories={onBackToCategories}
      userId={userId}
    />
  </LocaleProvider>
);

describe('TopQuestions Typography Tests', () => {
  const mockOnQuestionSelect = jest.fn();
  const mockOnBackToCategories = jest.fn();

  beforeEach(() => {
    mockOnQuestionSelect.mockClear();
    mockOnBackToCategories.mockClear();
  });

  describe('ALL/Label Medium/Medium Typography Requirements', () => {
    it('should apply meeta-typography-mid CSS class to elements', () => {
      const { container } = render(
        <MockedTopQuestions 
          onQuestionSelect={mockOnQuestionSelect}
          onBackToCategories={mockOnBackToCategories}
        />
      );
      
      // Check if meeta-typography-mid class is applied
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThan(0);
    });

    it('should have correct CSS styles applied via meeta-typography-mid class', () => {
      const { container } = render(
        <MockedTopQuestions 
          onQuestionSelect={mockOnQuestionSelect}
          onBackToCategories={mockOnBackToCategories}
        />
      );
      
      const typographyElement = container.querySelector('.meeta-typography-mid');
      expect(typographyElement).toBeInTheDocument();
      
      // Check if the element has the typography class
      expect(typographyElement).toHaveClass('meeta-typography-mid');
    });

    it('should apply typography to header and all question buttons', () => {
      const { container } = render(
        <MockedTopQuestions 
          onQuestionSelect={mockOnQuestionSelect}
          onBackToCategories={mockOnBackToCategories}
        />
      );
      
      // Should have header + question buttons + back button with typography
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThanOrEqual(3); // header + questions + back
    });

    it('should not have old font styles when meeta-typography-mid is applied', () => {
      const { container } = render(
        <MockedTopQuestions 
          onQuestionSelect={mockOnQuestionSelect}
          onBackToCategories={mockOnBackToCategories}
        />
      );
      
      const typographyElements = container.querySelectorAll('.meeta-typography-mid');
      
      typographyElements.forEach(element => {
        // Should not have old inline font styles
        expect(element).not.toHaveClass('text-[12px]');
        expect(element).not.toHaveClass('font-semibold');
        expect(element).not.toHaveClass('leading-[16px]');
        expect(element).not.toHaveClass('tracking-[0.6px]');
      });
    });

    it('should maintain proper structure with typography classes', () => {
      const { container } = render(
        <MockedTopQuestions 
          onQuestionSelect={mockOnQuestionSelect}
          onBackToCategories={mockOnBackToCategories}
        />
      );
      
      // Check that header has small typography (for description)
      const headerElement = container.querySelector('p.meeta-typography-small');
      expect(headerElement).toBeInTheDocument();
      
      // Check that buttons have typography
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toHaveClass('meeta-typography-mid');
      });
    });

    it('should work with different grade and category combinations', () => {
      const testCases = [
        { grade: 'middle1' as GradeType, categoryId: 'studyMethod' as CategoryType },
        { grade: 'middle2' as GradeType, categoryId: 'studyMethod' as CategoryType },
        { grade: 'high1' as GradeType, categoryId: 'studyMethod' as CategoryType }
      ];

      testCases.forEach(testCase => {
        const { container, unmount } = render(
          <MockedTopQuestions 
            grade={testCase.grade}
            categoryId={testCase.categoryId}
            onQuestionSelect={mockOnQuestionSelect}
            onBackToCategories={mockOnBackToCategories}
          />
        );
        
        const typographyElements = container.querySelectorAll('.meeta-typography-mid');
        expect(typographyElements.length).toBeGreaterThan(0);
        
        unmount();
      });
    });
  });
});