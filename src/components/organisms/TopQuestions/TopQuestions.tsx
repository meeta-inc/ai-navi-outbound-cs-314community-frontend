import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale } from '../../../contexts/LocaleContext';
import { getColorClasses } from '../../../shared/config/theme.config';
import { getAccentColor } from "../../../shared/config/app.config";
import { updateQuestionStats } from '../../../services/api/questions';
import { Button } from '../../atoms/Button';
import { GRADE_CATEGORY_QUESTIONS, GradeType, CategoryType, Question } from '../../../shared/constants/gradeQuestions.constants';

// 스타일 상수 정의
const STYLES = {
  FONT_FAMILY: "'Noto Sans', 'Noto Sans JP', sans-serif",
  CONTAINER: "bg-gray-50 w-full max-w-[320px]",
  HEADER: "mb-[7px] pl-5",
  HEADER_TEXT: "text-[12px] font-medium leading-[16px] tracking-[0.6px]",
  LOADING_CONTAINER: "flex items-center justify-center py-4",
  LOADING_SPINNER: "w-5 h-5 animate-spin",
  LOADING_TEXT: "ml-2 text-sm text-gray-500",
  ERROR_CONTAINER: "pl-5 py-2",
  ERROR_TEXT: "text-red-500 text-sm",
  QUESTIONS_CONTAINER: "flex flex-col gap-[7px] items-start",
  QUESTION_WRAPPER: "pl-5 w-full",
  QUESTION_BUTTON: "inline-flex items-center justify-start max-w-[257px] p-[10px] rounded-[20px] text-[12px] font-semibold leading-[16px] tracking-[0.6px] transition-all duration-200 hover:opacity-90 text-left",
  NO_QUESTIONS: "text-gray-500 text-sm"
} as const;

// 질문 정렬 유틸리티 함수
const sortQuestionsByBest = (questions: Question[]): Question[] => {
  return [...questions].sort((a, b) => {
    if (a.isBest && !b.isBest) return -1;
    if (!a.isBest && b.isBest) return 1;
    return 0;
  });
};

interface TopQuestionsProps {
  categoryId: CategoryType;
  categoryTitle: string;
  grade: GradeType;
  onQuestionSelect: (question: string) => void;
  onBackToCategories: () => void;
  userId: string;
  onDataLoaded?: () => void;
  className?: string;
}

export function TopQuestions({ 
  categoryId,
  categoryTitle,
  grade,
  onQuestionSelect,
  onBackToCategories,
  userId,
  onDataLoaded,
  className = ""
}: TopQuestionsProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 학년별 질문 가져오기 (임시로 상수 사용, 향후 API 연동 예정)
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // TODO: 향후 서버 API 연동 시 아래 코드로 교체
        // const data = await getTopQuestionsByCategory(categoryId, grade, userId);
        // setQuestions(data.questions);
        
        // 임시: gradeQuestions.constants에서 데이터 가져오기
        const gradeQuestions = GRADE_CATEGORY_QUESTIONS[grade][categoryId];
        
        if (gradeQuestions && gradeQuestions.length > 0) {
          // 베스트 질문 우선 정렬
          const sortedQuestions = sortQuestionsByBest(gradeQuestions);
          
          // 질문 텍스트만 추출
          const questionTexts = sortedQuestions.map(q => q.text);
          setQuestions(questionTexts);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('エラーが発生しました');
        setQuestions([]);
      } finally {
        setIsLoading(false);
        // 데이터 로딩이 완료되면 스크롤 트리거
        if (onDataLoaded) {
          setTimeout(() => {
            onDataLoaded();
          }, 100);
        }
      }
    };

    loadQuestions();
  }, [categoryId, grade, userId, onDataLoaded]);
  
  const topQuestionsTitle = t('chat.faq.topQuestionsTitle', { category: categoryTitle });
  const backToCategories = t('chat.faq.backToCategories');

  const handleQuestionClick = async (question: string) => {
    // 질문 통계 업데이트
    await updateQuestionStats(`${categoryId}-question`, question, userId);
    onQuestionSelect(question);
  };

  const handleBackClick = async () => {
    // 돌아가기 통계 업데이트
    await updateQuestionStats(`${categoryId}-back`, backToCategories, userId);
    onBackToCategories();
  };

  return (
    <div className={`${STYLES.CONTAINER} ${className}`}>
      {/* Header Section */}
      <div className={STYLES.HEADER}>
        <p 
          className={`${colors.textMuted} ${STYLES.HEADER_TEXT}`}
          style={{ fontFamily: STYLES.FONT_FAMILY }}
        >
          ⭐{topQuestionsTitle}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={STYLES.LOADING_CONTAINER}>
          <Loader2 className={STYLES.LOADING_SPINNER} />
          <span className={STYLES.LOADING_TEXT}>{t('chat.faq.loading')}</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={STYLES.ERROR_CONTAINER}>
          <p className={STYLES.ERROR_TEXT}>{error}</p>
        </div>
      )}

      {/* Top Questions Section */}
      {!isLoading && (
        <div className={STYLES.QUESTIONS_CONTAINER}>
          {Array.isArray(questions) && questions.length > 0 ? questions.map((question, index) => (
            <div key={index} className={STYLES.QUESTION_WRAPPER}>
              <Button
                onClick={() => handleQuestionClick(question)}
                className={`${colors.background} ${colors.textWhite} ${STYLES.QUESTION_BUTTON}`}
                style={{ fontFamily: STYLES.FONT_FAMILY }}
              >
                {question}
              </Button>
            </div>
          )) : (
            <div className={STYLES.QUESTION_WRAPPER}>
              <p className={STYLES.NO_QUESTIONS}>{t('chat.faq.noQuestions')}</p>
            </div>
          )}
          
          {/* Back to Categories Button */}
          <div className={STYLES.QUESTION_WRAPPER}>
            <Button
              onClick={handleBackClick}
              className={`${colors.bgLight} ${colors.textSecondary} ${STYLES.QUESTION_BUTTON}`}
              style={{ fontFamily: STYLES.FONT_FAMILY }}
            >
              {backToCategories}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}