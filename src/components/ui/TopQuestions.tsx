import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../shared/config/theme.config';
import { getAccentColor } from "../../shared/config/app.config";
import { getTopQuestionsByCategory, updateQuestionStats } from '../../services/api/questions';

interface TopQuestionsProps {
  categoryId: string;
  categoryTitle: string;
  onQuestionSelect: (question: string) => void;
  onBackToCategories: () => void;
  userId: string;
  onDataLoaded?: () => void;
  className?: string;
}

export default function TopQuestions({ 
  categoryId,
  categoryTitle,
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
  
  // API에서 카테고리별 질문 가져오기
  useEffect(() => {
    const fetchTopQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTopQuestionsByCategory(categoryId, userId);
        setQuestions(data.questions);
      } catch (err) {
        console.error('Failed to fetch top questions:', err);
        setError(t('chat.faq.error'));
        // 에러 발생 시 로컬 데이터 사용
        const questionsResult = t(`chat.faq.${categoryId}.topQuestions`);
        setQuestions(Array.isArray(questionsResult) ? questionsResult : []);
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

    fetchTopQuestions();
  }, [categoryId, userId, t, onDataLoaded]);
  
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
    <div className={`bg-gray-50 w-full max-w-[320px] ${className}`}>
      {/* Header Section */}
      <div className="mb-[7px] pl-5">
        <p 
          className={`${colors.textMuted} text-[12px] font-medium leading-[16px] tracking-[0.6px]`}
          style={{ fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif" }}
        >
          ⭐{topQuestionsTitle}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="ml-2 text-sm text-gray-500">{t('chat.faq.loading')}</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="pl-5 py-2">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Top Questions Section */}
      {!isLoading && (
        <div className="flex flex-col gap-[7px] items-start">
          {Array.isArray(questions) && questions.length > 0 ? questions.map((question, index) => (
            <div key={index} className="pl-5 w-full">
              <button
                onClick={() => handleQuestionClick(question)}
                className={`${colors.background} ${colors.textWhite} inline-flex items-center justify-start max-w-[257px] p-[10px] rounded-[20px] text-[12px] font-semibold leading-[16px] tracking-[0.6px] transition-all duration-200 hover:opacity-90 text-left`}
                style={{ 
                  fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif"
                }}
              >
                {question}
              </button>
            </div>
          )) : (
            <div className="pl-5 w-full">
              <p className="text-gray-500 text-sm">{t('chat.faq.noQuestions')}</p>
            </div>
          )}
          
          {/* Back to Categories Button */}
          <div className="pl-5 w-full">
            <button
              onClick={handleBackClick}
              className={`${colors.bgLight} ${colors.textSecondary} inline-flex items-center justify-start max-w-[257px] p-[10px] rounded-[20px] text-[12px] font-semibold leading-[16px] tracking-[0.6px] transition-all duration-200 hover:opacity-90 text-left`}
              style={{ 
                fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif"
              }}
            >
              {backToCategories}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}