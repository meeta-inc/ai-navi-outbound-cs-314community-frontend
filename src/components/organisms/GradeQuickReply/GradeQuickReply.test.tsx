import React from 'react';
import { render } from '@testing-library/react';
import { GradeQuickReply } from './GradeQuickReply';
import { LocaleProvider } from '../../../contexts/LocaleContext';
import { GradeType } from '../../../shared/constants/grade.constants';

// Mock the API service
jest.mock('../../../services/api/questions', () => ({
  getQuickReplyQuestions: jest.fn().mockResolvedValue({
    header: 'よくある質問',
    questions: []
  }),
  updateQuestionStats: jest.fn().mockResolvedValue({})
}));

// Mock the grade constants to avoid undefined errors
jest.mock('../../../shared/constants/grade.constants', () => ({
  ...jest.requireActual('../../../shared/constants/grade.constants'),
  GRADE_QUESTION_KEYS: {
    middle1: ['key1', 'key2'],
    middle2: ['key1', 'key2'],
    middle3: ['key1', 'key2'],
    high1: ['key1', 'key2'],
    high2: ['key1', 'key2'],
    high3: ['key1', 'key2'],
  }
}));

// Mock locale provider
const MockedGradeQuickReply = ({ 
  grade, 
  onReplyClick 
}: { 
  grade: GradeType; 
  onReplyClick: jest.Mock; 
}) => (
  <LocaleProvider locale="ja">
    <GradeQuickReply 
      grade={grade}
      onReplyClick={onReplyClick}
      onShowFAQCategories={jest.fn()}
      onBackClick={jest.fn()}
    />
  </LocaleProvider>
);

describe('GradeQuickReply Typography Tests', () => {
  const mockOnReplyClick = jest.fn();

  beforeEach(() => {
    mockOnReplyClick.mockClear();
  });

  describe('ALL/Label Medium/Medium Typography Requirements', () => {
    it('should apply meeta-typography-mid CSS class to elements', () => {
      const { container } = render(<MockedGradeQuickReply grade="middle1" onReplyClick={mockOnReplyClick} />);
      
      // Check if meeta-typography-mid class is applied
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThan(0);
    });

    it('should have correct CSS styles applied via meeta-typography-mid class', () => {
      const { container } = render(<MockedGradeQuickReply grade="middle1" onReplyClick={mockOnReplyClick} />);
      
      const typographyElement = container.querySelector('.meeta-typography-mid');
      expect(typographyElement).toBeInTheDocument();
      
      // Check if the element has the typography class
      expect(typographyElement).toHaveClass('meeta-typography-mid');
    });

    it('should apply typography to header and all grade quick reply buttons', () => {
      const { container } = render(<MockedGradeQuickReply grade="middle1" onReplyClick={mockOnReplyClick} />);
      
      // Should have header + multiple buttons with typography
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThanOrEqual(3); // header + buttons
    });

    it('should not have old font styles when meeta-typography-mid is applied', () => {
      const { container } = render(<MockedGradeQuickReply grade="middle1" onReplyClick={mockOnReplyClick} />);
      
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
      const { container } = render(<MockedGradeQuickReply grade="middle1" onReplyClick={mockOnReplyClick} />);
      
      // Check that header has small typography (for description)
      const headerContainer = container.querySelector('p.meeta-typography-small');
      expect(headerContainer).toBeInTheDocument();
      
      // Check that buttons have typography
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toHaveClass('meeta-typography-mid');
      });
    });

    it('should work with different grade types', () => {
      const grades: GradeType[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];
      
      grades.forEach(grade => {
        const { container, unmount } = render(<MockedGradeQuickReply grade={grade} onReplyClick={mockOnReplyClick} />);
        
        const typographyElements = container.querySelectorAll('.meeta-typography-mid');
        expect(typographyElements.length).toBeGreaterThan(0);
        
        unmount();
      });
    });
  });
});