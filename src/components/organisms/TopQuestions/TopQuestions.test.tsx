import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TopQuestions } from './TopQuestions';
import { GRADE_CATEGORY_QUESTIONS, GradeType, CategoryType, Question } from '../../../shared/constants/gradeQuestions.constants';

// useLocale 훅 모킹
jest.mock('../../../contexts/LocaleContext', () => ({
  useLocale: () => ({
    locale: 'ja',
    setLocale: jest.fn(),
    t: (key: string, params?: Record<string, any>) => {
      // 카테고리 이름 번역
      if (key === 'chat.faq.curriculum.title') return '授業・カリキュラム';
      if (key === 'chat.faq.schedule.title') return '通塾・学習時間';
      if (key === 'chat.faq.pricing.title') return '料金・制度';
      
      // TopQuestions 관련 번역
      if (key === 'chat.faq.topQuestionsTitle') {
        return `${params?.category || 'カテゴリー'}に関するよくある質問`;
      }
      if (key === 'chat.faq.backToCategories') return 'カテゴリー一覧に戻る';
      if (key === 'chat.faq.loading') return '読み込み中...';
      if (key === 'chat.faq.error') return 'エラーが発生しました';
      if (key === 'chat.faq.noQuestions') return '質問がありません';
      
      return key;
    }
  })
}));

// app.config 모킹하여 테스트 환경에서도 일관된 색상 사용
jest.mock('../../../shared/config/app.config', () => ({
  getAccentColor: () => 'green',
  getApiUrl: () => '/api',
  getChatApiUrl: () => '/api/chat',
  getShowNavigationHeader: () => true,
  getShowTimestamp: () => true,
  getShowGradeSelection: () => true,
  getAppConfig: () => ({
    apiUrl: '/api',
    chatApiUrl: '/api/chat',
    accentColor: 'green',
    showNavigationHeader: true,
    showTimestamp: true,
    showGradeSelection: true,
    environment: 'test',
    isDevelopment: false,
    isProduction: false,
  })
}));

/**
 * TopQuestions 컴포넌트 테스트 - TDD Stage 3-1
 * 이슈 #29: 카테고리 표시 및 학년별 질문 동적 표시 기능 구현
 * https://github.com/meeta-inc/ai-navi-outbound-cs-314community-frontend/issues/29
 * 
 * 이 테스트는 카테고리 선택 시 해당 학년의 질문들이 올바르게 표시되는지 검증합니다.
 * gradeQuestions.constants 데이터와 연동하여 학년별 맞춤형 질문을 제공하는 기능을 테스트합니다.
 */

describe('TopQuestions Component - TDD Stage 3-1', () => {
  // 테스트용 props
  const defaultProps = {
    categoryId: 'curriculum' as CategoryType,
    categoryTitle: '授業・カリキュラム',
    grade: 'high' as GradeType,
    onQuestionSelect: jest.fn(),
    onBackToCategories: jest.fn(),
    userId: 'test-user'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Grade-based question filtering', () => {
    /**
     * 학년별 질문 필터링 기본 기능 테스트
     * 선택된 학년과 카테고리에 해당하는 질문들만 표시되는지 확인
     */
    it('should display questions for selected grade and category', () => {
      render(<TopQuestions {...defaultProps} />);

      // 고등학생-수업 카테고리 질문들이 표시되는지 확인
      const expectedQuestions = GRADE_CATEGORY_QUESTIONS.high.curriculum;
      
      expectedQuestions.forEach((question: Question) => {
        expect(screen.getByText(question.text)).toBeInTheDocument();
      });
    });

    /**
     * 중학생 질문 필터링 테스트
     */
    it('should display middle school questions when grade is middle', () => {
      const middleSchoolProps = {
        ...defaultProps,
        grade: 'middle' as GradeType
      };

      render(<TopQuestions {...middleSchoolProps} />);

      // 중학생-수업 카테고리 질문들이 표시되는지 확인
      const expectedQuestions = GRADE_CATEGORY_QUESTIONS.middle.curriculum;
      
      expectedQuestions.forEach((question: Question) => {
        expect(screen.getByText(question.text)).toBeInTheDocument();
      });
    });

    /**
     * 초등학생 질문 필터링 테스트
     */
    it('should display elementary school questions when grade is elementary', () => {
      const elementaryProps = {
        ...defaultProps,
        grade: 'elementary' as GradeType
      };

      render(<TopQuestions {...elementaryProps} />);

      // 초등학생-수업 카테고리 질문들이 표시되는지 확인
      const expectedQuestions = GRADE_CATEGORY_QUESTIONS.elementary.curriculum;
      
      expectedQuestions.forEach((question: Question) => {
        expect(screen.getByText(question.text)).toBeInTheDocument();
      });
    });

    /**
     * 유아 질문 필터링 테스트
     */
    it('should display preschool questions when grade is preschool', () => {
      const preschoolProps = {
        ...defaultProps,
        grade: 'preschool' as GradeType
      };

      render(<TopQuestions {...preschoolProps} />);

      // 유아-수업 카테고리 질문들이 표시되는지 확인
      const expectedQuestions = GRADE_CATEGORY_QUESTIONS.preschool.curriculum;
      
      expectedQuestions.forEach((question: Question) => {
        expect(screen.getByText(question.text)).toBeInTheDocument();
      });
    });
  });

  describe('Category-based question filtering', () => {
    /**
     * 통학·학습시간 카테고리 질문 필터링 테스트
     */
    it('should display schedule category questions correctly', () => {
      const scheduleProps = {
        ...defaultProps,
        categoryId: 'schedule' as CategoryType,
        categoryTitle: '通塾・学習時間'
      };

      render(<TopQuestions {...scheduleProps} />);

      // 고등학생-통학시간 카테고리 질문들이 표시되는지 확인
      const expectedQuestions = GRADE_CATEGORY_QUESTIONS.high.schedule;
      
      expectedQuestions.forEach((question: Question) => {
        expect(screen.getByText(question.text)).toBeInTheDocument();
      });
    });

    /**
     * 요금·제도 카테고리 질문 필터링 테스트
     */
    it('should display pricing category questions correctly', () => {
      const pricingProps = {
        ...defaultProps,
        categoryId: 'pricing' as CategoryType,
        categoryTitle: '料金・制度'
      };

      render(<TopQuestions {...pricingProps} />);

      // 고등학생-요금 카테고리 질문들이 표시되는지 확인
      const expectedQuestions = GRADE_CATEGORY_QUESTIONS.high.pricing;
      
      expectedQuestions.forEach((question: Question) => {
        expect(screen.getByText(question.text)).toBeInTheDocument();
      });
    });
  });

  describe('Best questions priority display', () => {
    /**
     * 베스트 질문들이 상단에 우선 표시되는지 테스트
     */
    it('should display best questions first', () => {
      render(<TopQuestions {...defaultProps} />);

      // 모든 질문 버튼 요소들을 가져옴
      const questionButtons = screen.getAllByRole('button');
      // 마지막 버튼은 "카테고리 일람으로 돌아가기" 버튼이므로 제외
      const questionOnlyButtons = questionButtons.slice(0, -1);

      // 첫 번째로 표시되는 질문들이 베스트 질문인지 확인
      const highCurriculumQuestions = GRADE_CATEGORY_QUESTIONS.high.curriculum;
      const bestQuestions = highCurriculumQuestions.filter(q => q.isBest);
      
      // 베스트 질문들이 존재하는 경우에만 테스트
      if (bestQuestions.length > 0) {
        bestQuestions.forEach((bestQuestion, index) => {
          expect(questionOnlyButtons[index]).toHaveTextContent(bestQuestion.text);
        });
      }
    });

    /**
     * 각 카테고리마다 베스트 질문이 최소 1개 이상 있는지 테스트
     */
    it('should have at least one best question per category for each grade', () => {
      const grades: GradeType[] = ['high', 'middle', 'elementary', 'preschool'];
      const categories: CategoryType[] = ['curriculum', 'schedule', 'pricing'];

      grades.forEach(grade => {
        categories.forEach(category => {
          const questions = GRADE_CATEGORY_QUESTIONS[grade][category];
          const bestQuestions = questions.filter(q => q.isBest);
          
          expect(bestQuestions.length).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  describe('Button rendering', () => {
    /**
     * 질문 버튼들이 올바르게 렌더링되는지 테스트
     * 실제 클릭 이벤트는 E2E 테스트에서 검증 (LLM 송신으로 인한 응답 시간 고려)
     */
    it('should render question buttons correctly', () => {
      render(<TopQuestions {...defaultProps} />);

      // 첫 번째 질문이 버튼으로 렌더링되는지 확인
      const firstQuestion = GRADE_CATEGORY_QUESTIONS.high.curriculum[0];
      const questionButton = screen.getByText(firstQuestion.text);
      
      expect(questionButton).toBeInTheDocument();
      expect(questionButton.tagName).toBe('BUTTON');
    });

    /**
     * "카테고리 일람으로 돌아가기" 버튼이 올바르게 렌더링되는지 테스트
     */
    it('should render back to categories button', () => {
      render(<TopQuestions {...defaultProps} />);

      const backButton = screen.getByText('カテゴリー一覧に戻る');
      expect(backButton).toBeInTheDocument();
      expect(backButton.tagName).toBe('BUTTON');
    });
  });

  describe('Question count validation', () => {
    /**
     * 각 학년-카테고리 조합별로 정확히 5개의 질문이 표시되는지 테스트
     */
    it('should display exactly 5 questions for each grade-category combination', () => {
      const grades: GradeType[] = ['high', 'middle', 'elementary', 'preschool'];
      const categories: CategoryType[] = ['curriculum', 'schedule', 'pricing'];

      grades.forEach(grade => {
        categories.forEach(category => {
          const props = {
            ...defaultProps,
            grade,
            categoryId: category,
            categoryTitle: GRADE_CATEGORY_QUESTIONS.categoryNames[category]
          };

          const { unmount } = render(<TopQuestions {...props} />);

          // 질문 버튼들 (마지막 "돌아가기" 버튼 제외)
          const questionButtons = screen.getAllByRole('button');
          const questionOnlyButtons = questionButtons.slice(0, -1);

          expect(questionOnlyButtons).toHaveLength(5);

          unmount();
        });
      });
    });
  });

  describe('Question ID uniqueness', () => {
    /**
     * 표시되는 모든 질문들이 고유한 ID를 가지고 있는지 테스트
     */
    it('should display questions with unique IDs', () => {
      render(<TopQuestions {...defaultProps} />);

      const questions = GRADE_CATEGORY_QUESTIONS.high.curriculum;
      const questionIds = questions.map(q => q.id);
      const uniqueIds = [...new Set(questionIds)];

      // 중복된 ID가 없어야 함
      expect(uniqueIds).toHaveLength(questionIds.length);
      
      // ID 형식이 올바른지 확인 (grade-category-number)
      questionIds.forEach(id => {
        expect(id).toMatch(/^high-curriculum-\d+$/);
      });
    });
  });

  describe('UI structure and styling', () => {
    /**
     * 컴포넌트의 기본 UI 구조가 올바르게 렌더링되는지 테스트
     */
    it('should render with correct UI structure', () => {
      render(<TopQuestions {...defaultProps} />);

      // 제목이 표시되는지 확인 (이모지 포함한 전체 텍스트로 확인)
      expect(screen.getByText('⭐授業・カリキュラムに関するよくある質問')).toBeInTheDocument();
      
      // "돌아가기" 버튼이 표시되는지 확인
      expect(screen.getByText('カテゴリー一覧に戻る')).toBeInTheDocument();
      
      // 컨테이너 클래스가 적용되는지 확인
      const titleElement = screen.getByText('⭐授業・カリキュラムに関するよくある質問');
      const container = titleElement.closest('div')?.parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('bg-gray-50', 'w-full', 'max-w-[320px]');
    });
  });
});