import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SubjectSelection } from './SubjectSelection';
import { LocaleProvider } from '../../../contexts/LocaleContext';
import type { Subject } from '../../../types/api/learningInfo.types';

// 테스트용 과목 데이터
const mockSubjects: Subject[] = [
  {
    subjectId: 'math',
    subjectName: '算数',
    subjectIcon: '📐',
    priority: 1,
  },
  {
    subjectId: 'english',
    subjectName: '英語',
    subjectIcon: '🔤',
    priority: 2,
  },
  {
    subjectId: 'science',
    subjectName: '理科',
    subjectIcon: '🔬',
    priority: 3,
  },
];

// Mock locale provider 래퍼
const renderWithLocale = (ui: React.ReactElement) => {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
};

describe('SubjectSelection', () => {
  const mockOnSubjectSelect = jest.fn();

  beforeEach(() => {
    mockOnSubjectSelect.mockClear();
  });

  describe('렌더링 검증', () => {
    it('과목 목록이 올바르게 렌더링되어야 한다', () => {
      const { getByText } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={mockSubjects}
        />
      );

      expect(getByText(/📐算数/)).toBeInTheDocument();
      expect(getByText(/🔤英語/)).toBeInTheDocument();
      expect(getByText(/🔬理科/)).toBeInTheDocument();
    });

    it('헤더가 렌더링되어야 한다', () => {
      const { container } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={mockSubjects}
        />
      );

      // 헤더에 meeta-typography-small 클래스가 적용되어야 한다
      const headerTypography = container.querySelector('.meeta-typography-small');
      expect(headerTypography).toBeInTheDocument();
    });

    it('로딩 상태가 올바르게 표시되어야 한다', () => {
      const { getByText } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={null}
          isLoading={true}
        />
      );

      expect(getByText('読み込み中...')).toBeInTheDocument();
    });
  });

  describe('상호작용 검증', () => {
    it('과목 버튼 클릭 시 onSubjectSelect 콜백이 호출되어야 한다', () => {
      const { getByText } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={mockSubjects}
        />
      );

      fireEvent.click(getByText(/📐算数/).closest('button')!);
      expect(mockOnSubjectSelect).toHaveBeenCalledWith('math');
    });

    it('각 과목 버튼이 해당 subjectId를 전달해야 한다', () => {
      const { getByText } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={mockSubjects}
        />
      );

      fireEvent.click(getByText(/🔤英語/).closest('button')!);
      expect(mockOnSubjectSelect).toHaveBeenCalledWith('english');

      fireEvent.click(getByText(/🔬理科/).closest('button')!);
      expect(mockOnSubjectSelect).toHaveBeenCalledWith('science');
    });
  });

  describe('타이포그래피 검증', () => {
    it('버튼에 meeta-typography-mid CSS 클래스가 적용되어야 한다', () => {
      const { container } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={mockSubjects}
        />
      );

      const elementsWithTypography = container.querySelectorAll('.meeta-typography-mid');
      expect(elementsWithTypography.length).toBeGreaterThan(0);
    });

    it('모든 과목 버튼에 meeta-typography-mid가 적용되어야 한다', () => {
      const { container } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={mockSubjects}
        />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(3);

      buttons.forEach(button => {
        const buttonTypography = button.querySelector('.meeta-typography-mid');
        expect(buttonTypography).toBeInTheDocument();
      });
    });
  });

  describe('우선순위 정렬 검증', () => {
    it('과목이 priority 순서대로 정렬되어야 한다', () => {
      const unorderedSubjects: Subject[] = [
        { ...mockSubjects[2], priority: 3 }, // 理科
        { ...mockSubjects[0], priority: 1 }, // 算数
        { ...mockSubjects[1], priority: 2 }, // 英語
      ];

      const { container } = renderWithLocale(
        <SubjectSelection
          onSubjectSelect={mockOnSubjectSelect}
          apiSubjects={unorderedSubjects}
        />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons[0].textContent).toContain('算数');
      expect(buttons[1].textContent).toContain('英語');
      expect(buttons[2].textContent).toContain('理科');
    });
  });
});
