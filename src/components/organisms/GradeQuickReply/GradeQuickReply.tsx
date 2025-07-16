import React from 'react';
import { useLocale } from '../../../contexts/LocaleContext';
import { QuickReply, type QuickReplyOption } from '../QuickReply';
import { GRADE_QUESTION_KEYS, type GradeType } from '../../../shared/constants/grade.constants';

interface GradeQuickReplyProps {
  grade: GradeType;
  onReplyClick: (text: string) => void;
  onShowFAQCategories?: () => void;
  onBackClick?: () => void;
  className?: string;
}

export const GradeQuickReply: React.FC<GradeQuickReplyProps> = ({
  grade,
  onReplyClick,
  onShowFAQCategories,
  onBackClick,
  className = ''
}) => {
  const { t } = useLocale();

  // 학년별 질문을 QuickReplyOption 형태로 변환
  const questionKeys = GRADE_QUESTION_KEYS[grade];
  const options: QuickReplyOption[] = [
    ...questionKeys.map((key, index) => ({
      id: `top${index + 1}`,
      text: t(key),
      type: 'primary' as const
    })),
    {
      id: 'other',
      text: t('chat.quickReplies.other'),
      type: 'secondary' as const
    }
  ];


  return (
    <div className={className}>
      <QuickReply
        onReplyClick={onReplyClick}
        onShowFAQCategories={onShowFAQCategories}
        onBackClick={onBackClick}
        show={true}
        userId="Hyunse0001"
        options={options}
        showBackButton={true}
        grade={grade}
      />
    </div>
  );
};