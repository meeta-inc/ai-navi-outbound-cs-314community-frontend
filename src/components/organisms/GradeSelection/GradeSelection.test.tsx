import React from 'react';
import { render } from '@testing-library/react';
import { GradeSelection } from './GradeSelection';
import { LocaleProvider } from '../../../contexts/LocaleContext';

// Mock locale provider
const MockedGradeSelection = ({ onGradeSelect }: { onGradeSelect: jest.Mock }) => (
  <LocaleProvider>
    <GradeSelection onGradeSelect={onGradeSelect} />
  </LocaleProvider>
);

describe('GradeSelection Typography Tests', () => {
  const mockOnGradeSelect = jest.fn();

  beforeEach(() => {
    mockOnGradeSelect.mockClear();
  });

  describe('ALL/Label Medium/Medium Typography Requirements', () => {
    it('should apply meeta-typography-mid CSS class to elements', () => {
      const { container } = render(<MockedGradeSelection onGradeSelect={mockOnGradeSelect} />);
      
      // Check if meeta-typography-mid class is applied
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThan(0);
    });

    it('should have correct CSS styles applied via meeta-typography-mid class', () => {
      const { container } = render(<MockedGradeSelection onGradeSelect={mockOnGradeSelect} />);
      
      const typographyElement = container.querySelector('.meeta-typography-mid');
      expect(typographyElement).toBeInTheDocument();
      
      // Check if the element has the typography class
      expect(typographyElement).toHaveClass('meeta-typography-mid');
    });

    it('should apply typography to header and all grade option buttons', () => {
      const { container } = render(<MockedGradeSelection onGradeSelect={mockOnGradeSelect} />);
      
      // Should have multiple grade options with mid typography (header is now small)
      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThanOrEqual(4); // 4+ grade options
    });

    it('should not have old font styles when meeta-typography-mid is applied', () => {
      const { container } = render(<MockedGradeSelection onGradeSelect={mockOnGradeSelect} />);
      
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
      const { container } = render(<MockedGradeSelection onGradeSelect={mockOnGradeSelect} />);
      
      // Check that header has small typography (for description)
      const headerContainer = container.querySelector('.relative.shrink-0.w-full');
      const headerTypography = headerContainer?.querySelector('.meeta-typography-small');
      expect(headerTypography).toBeInTheDocument();
      
      // Check that buttons have typography
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        const buttonTypography = button.querySelector('.meeta-typography-mid');
        expect(buttonTypography).toBeInTheDocument();
      });
    });
  });
});