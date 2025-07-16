import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocale } from '../../../contexts/LocaleContext';
import { getColorClasses, AccentColor } from '../../../shared/config/theme.config';
import { getAccentColor } from "../../../shared/config/app.config";
import { getQuickReplyQuestions, updateQuestionStats, type QuickReplyData } from '../../../services/api/questions';
import { Button } from '../../atoms/Button';
import type { GradeType } from '../../../shared/constants/grade.constants';

export interface QuickReplyOption {
  id: string;
  text: string;
  type: 'primary' | 'secondary';
}

interface QuickReplyProps {
  onReplyClick: (text: string) => void;
  onShowFAQCategories?: () => void;
  onBackClick?: () => void;
  show: boolean;
  userId: string;
  options?: QuickReplyOption[];
  showBackButton?: boolean;
  grade?: GradeType;
}

export function QuickReply({ 
  onReplyClick, 
  onShowFAQCategories,
  onBackClick,
  show, 
  userId,
  options,
  showBackButton = false,
  grade
}: QuickReplyProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  const [apiData, setApiData] = useState<{header: string, questions: QuickReplyOption[]}>({
    header: '',
    questions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터를 가져오는 함수
  useEffect(() => {
    if (show && !options) {
      const fetchQuickReplyData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getQuickReplyQuestions(userId, grade);
          setApiData({
            header: data.header,
            questions: data.questions.map(q => ({
              id: q.id,
              text: t(q.text), // 로컬라이즈 키를 실제 텍스트로 변환
              type: q.type
            }))
          });
        } catch (err) {
          console.error('Failed to fetch quick reply questions:', err);
          setError(t('chat.quickReplies.error'));
          // 에러 발생 시 기본값 사용
          setApiData({
            header: t('chat.quickReplies.header'),
            questions: [
              { id: 'top1', text: t('chat.quickReplies.top1'), type: 'primary' },
              { id: 'top2', text: t('chat.quickReplies.top2'), type: 'primary' },
              { id: 'top3', text: t('chat.quickReplies.top3'), type: 'primary' },
              { id: 'other', text: t('chat.quickReplies.other'), type: 'secondary' }
            ]
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuickReplyData();
    }
  }, [show, userId, options, t, grade]);

  if (!show) return null;

  const handleOptionClick = async (option: QuickReplyOption) => {
    // "그외" 버튼의 경우 FAQ 카테고리 표시
    if (option.id === 'other' && onShowFAQCategories) {
      onShowFAQCategories();
      return;
    }
    
    // 질문 통계 업데이트
    await updateQuestionStats(option.id, option.text, userId);
    
    onReplyClick(option.text);
  };

  // 사용할 옵션 결정 (props로 전달된 것 또는 API에서 가져온 것)
  const finalOptions = options || apiData.questions;
  const headerText = options ? t('chat.quickReplies.header') : apiData.header;

  return (
    <div className="w-full max-w-[320px] mt-4">
      {/* Header Section */}
      <div className="mb-[7px] pl-5">
        <p 
          className={`${colors.textMuted} text-[12px] font-medium leading-[16px] tracking-[0.6px]`}
          style={{ fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif" }}
        >
          {headerText}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="ml-2 text-sm text-gray-500">{t('chat.quickReplies.loading')}</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="pl-5 py-2">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Options Section */}
      {!isLoading && (
        <div className="flex flex-col gap-[7px] items-start">
          {finalOptions.map((option) => (
          <div key={option.id} className="pl-5 w-full">
            <Button
              onClick={() => handleOptionClick(option)}
              className={`
                inline-flex items-center justify-start
                max-w-[257px] p-[10px] rounded-[20px]
                text-[12px] font-semibold leading-[16px] tracking-[0.6px]
                transition-all duration-200 hover:opacity-90
                text-left
                ${option.type === 'primary' 
                  ? `${colors.background} ${colors.textWhite}` 
                  : `${colors.bgLight} ${colors.textSecondary}`
                }
              `}
              style={{ 
                fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif"
              }}
            >
              {option.text}
            </Button>
          </div>
          ))}
          
          {/* もどる 버튼 */}
          {showBackButton && onBackClick && (
            <div className="pl-5 w-full">
              <Button
                onClick={onBackClick}
                className="
                  inline-flex items-center justify-start
                  max-w-[257px] p-[10px] rounded-[20px]
                  text-[12px] font-semibold leading-[16px] tracking-[0.6px]
                  transition-all duration-200 hover:opacity-90
                  text-left
                  bg-[#EBEBEB] text-gray-700
                "
                style={{ 
                  fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif"
                }}
              >
                もどる
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}