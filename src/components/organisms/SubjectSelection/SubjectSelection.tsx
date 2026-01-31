import React from 'react';
import { useLocale } from '../../../contexts/LocaleContext';
import { getColorClasses, type AccentColor } from '../../../shared/config/theme.config';
import { getAccentColor } from '../../../shared/config/app.config';
import type { Subject } from '../../../types/api/learningInfo.types';

interface SubjectSelectionProps {
  onSubjectSelect: (subjectId: string) => void;
  accentColor?: AccentColor;
  className?: string;
  apiSubjects?: Subject[] | null;
  isLoading?: boolean;
}

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({
  onSubjectSelect,
  accentColor: propAccentColor,
  className = '',
  apiSubjects,
  isLoading = false,
}) => {
  const { t } = useLocale();
  const defaultAccentColor = getAccentColor();
  const accentColor = propAccentColor || defaultAccentColor;
  const colors = getColorClasses(accentColor);

  // 과목 옵션을 priority 순으로 정렬
  const subjectOptions = React.useMemo(() => {
    if (apiSubjects && apiSubjects.length > 0) {
      return [...apiSubjects].sort((a, b) => a.priority - b.priority);
    }
    return [] as Subject[];
  }, [apiSubjects]);

  return (
    <div
      className={`flex flex-col gap-[7px] items-start justify-start pb-3.5 pt-[5px] px-0 w-full ${className}`}
    >
      {/* Header */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start pb-[5px] pl-5 pr-0 pt-0 relative w-full">
            <div
              className={`flex flex-col justify-center leading-[0] relative shrink-0 ${colors.textMuted} text-left text-nowrap meeta-typography-small`}
            >
              <p className="block whitespace-pre">
                {t('onboarding.subjectSelectionHeader')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Options */}
      {isLoading ? (
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center relative size-full">
            <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start pl-5 pr-0 py-0 relative w-full">
              <div className={`${colors.textMuted} meeta-typography-mid`}>
                読み込み中...
              </div>
            </div>
          </div>
        </div>
      ) : (
        subjectOptions.map((subject) => (
          <div key={subject.subjectId} className="relative shrink-0 w-full">
            <div className="flex flex-row items-center overflow-clip relative size-full">
              <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start pl-5 pr-0 py-0 relative w-full">
                <button
                  onClick={() => onSubjectSelect(subject.subjectId)}
                  className={`${colors.background} box-border content-stretch flex flex-row gap-2.5 items-center justify-start max-w-[257px] p-[10px] relative rounded-[20px] shrink-0 hover:opacity-90 transition-opacity duration-200`}
                  type="button"
                >
                  <div
                    className={`flex flex-col justify-center leading-[0] relative shrink-0 ${colors.textWhite} text-left text-nowrap meeta-typography-mid`}
                  >
                    <p className="block whitespace-pre">
                      {subject.subjectIcon || ''}{subject.subjectName}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
