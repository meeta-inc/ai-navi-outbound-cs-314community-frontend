import React from 'react';
import { useLocale } from '../../../contexts/LocaleContext';
import { QuickReply, type QuickReplyOption } from '../QuickReply';
import { GRADE_QUESTION_KEYS, type GradeType } from '../../../shared/constants/grade.constants';
import { isFaqApiEnabled } from '../../../services/api/faq';
import { isFAQEnabled } from '../../../utils/appFeatures';

interface GradeQuickReplyProps {
  grade: GradeType;
  onReplyClick: (text: string) => void;
  onShowFAQCategories?: () => void;
  onBackClick?: () => void;
  className?: string;
  clientId?: string;
  appId?: string;
}

export const GradeQuickReply: React.FC<GradeQuickReplyProps> = ({
  grade,
  onReplyClick,
  onShowFAQCategories,
  onBackClick,
  className = '',
  clientId = 'RS000001',
  appId
}) => {
  const { t } = useLocale();
  const faqEnabled = appId ? isFAQEnabled(appId) : true; // FAQ 활성화 여부 확인

  // FAQ API가 활성화된 경우 options를 전달하지 않아 API를 사용하도록 함
  // FAQ API가 비활성화된 경우에만 로컬 옵션 사용
  let options: QuickReplyOption[] | undefined;
  
  if (!isFaqApiEnabled()) {
    // 학년별 질문을 QuickReplyOption 형태로 변환
    const questionKeys = GRADE_QUESTION_KEYS[grade];
    const baseOptions = questionKeys.map((key, index) => ({
      id: `top${index + 1}`,
      text: t(key),
      type: 'primary' as const
    }));

    // FAQ가 활성화된 경우에만 'other' 옵션 추가
    options = faqEnabled ? [
      ...baseOptions,
      {
        id: 'other',
        text: t('chat.quickReplies.other'),
        type: 'secondary' as const
      }
    ] : baseOptions;
  }

  // APP001의 경우 GradeQuickReply 자체를 렌더링하지 않음
  if (appId === 'APP001') {
    return null;
  }

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
        clientId={clientId}
        appId={appId}
      />
    </div>
  );
};