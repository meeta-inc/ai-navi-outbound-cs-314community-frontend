import React from 'react';
import { render } from '@testing-library/react';
import { QuickReply, QuickReplyOption } from './QuickReply';
import { LocaleProvider } from '../../../contexts/LocaleContext';

// Mock the API service
jest.mock('../../../services/api/questions', () => ({
  getQuickReplyQuestions: jest.fn().mockResolvedValue({
    header: 'よくある質問',
    questions: [
      { id: 'top1', text: 'chat.quickReplies.top1', type: 'primary' },
      { id: 'top2', text: 'chat.quickReplies.top2', type: 'primary' },
      { id: 'other', text: 'chat.quickReplies.other', type: 'secondary' }
    ]
  }),
  updateQuestionStats: jest.fn().mockResolvedValue({})
}));

// Mock locale provider
const MockedQuickReply = ({ 
  onReplyClick, 
  show = true, 
  userId = 'test-user',
  options 
}: { 
  onReplyClick: jest.Mock; 
  show?: boolean; 
  userId?: string;
  options?: QuickReplyOption[];
}) => (
  <LocaleProvider locale="ja">
    <QuickReply 
      onReplyClick={onReplyClick} 
      show={show} 
      userId={userId}
      options={options}
    />
  </LocaleProvider>
);

describe('QuickReply Typography Tests', () => {
  const mockOnReplyClick = jest.fn();

  beforeEach(() => {
    mockOnReplyClick.mockClear();
  });

  describe('ALL/Label Medium/Medium Typography Requirements', () => {
    const testOptions: QuickReplyOption[] = [
      { id: 'test1', text: '학습 방법에 대해 알고 싶어요', type: 'primary' },
      { id: 'test2', text: '교재 추천 부탁드려요', type: 'primary' },
      { id: 'other', text: '그 외', type: 'secondary' }
    ];

    it('should apply meeta-typography-mid CSS class to elements', () => {
      const { container } = render(<MockedQuickReply onReplyClick={mockOnReplyClick} options={testOptions} />);
      
      // Check if meeta-typography-mid class is applied
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThan(0);
    });

    it('should have correct CSS styles applied via meeta-typography-mid class', () => {
      const { container } = render(<MockedQuickReply onReplyClick={mockOnReplyClick} options={testOptions} />);
      
      const typographyElement = container.querySelector('.meeta-typography-mid');
      expect(typographyElement).toBeInTheDocument();
      
      // Check if the element has the typography class
      expect(typographyElement).toHaveClass('meeta-typography-mid');
    });

    it('should apply typography to header and all quick reply buttons', () => {
      const { container } = render(<MockedQuickReply onReplyClick={mockOnReplyClick} options={testOptions} />);
      
      // Should have multiple buttons with mid typography (header is now small)
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThanOrEqual(3); // 3+ buttons
    });

    it('should not have old font styles when meeta-typography-mid is applied', () => {
      const { container } = render(<MockedQuickReply onReplyClick={mockOnReplyClick} options={testOptions} />);
      
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
      const { container } = render(<MockedQuickReply onReplyClick={mockOnReplyClick} options={testOptions} />);
      
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
  });
});