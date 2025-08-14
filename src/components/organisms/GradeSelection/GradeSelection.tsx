import React from 'react';
import { useLocale } from '../../../contexts/LocaleContext';
import { getColorClasses, type AccentColor } from '../../../shared/config/theme.config';
import { getAccentColor } from '../../../shared/config/app.config';
import { GRADE_OPTIONS, type GradeType } from '../../../shared/constants/grade.constants';

interface GradeSelectionProps {
  onGradeSelect: (grade: GradeType) => void;
  accentColor?: AccentColor;
  className?: string;
  clientId?: string;
}

export const GradeSelection: React.FC<GradeSelectionProps> = ({
  onGradeSelect,
  accentColor: propAccentColor,
  className = '',
  clientId
}) => {
  const { t } = useLocale();
  const defaultAccentColor = getAccentColor();
  const accentColor = propAccentColor || defaultAccentColor;
  const colors = getColorClasses(accentColor);
  
  // MM000002일 때는 유아(preschool)를 제외
  const filteredGrades = clientId === 'MM000002' 
    ? GRADE_OPTIONS.filter(grade => grade.type !== 'preschool')
    : GRADE_OPTIONS;

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
                {t('onboarding.gradeSelectionHeader')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Options */}
      {filteredGrades.map((grade) => (
        <div key={grade.type} className="relative shrink-0 w-full">
          <div className="flex flex-row items-center overflow-clip relative size-full">
            <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start pl-5 pr-0 py-0 relative w-full">
              <button
                onClick={() => onGradeSelect(grade.type)}
                className={`${colors.background} box-border content-stretch flex flex-row gap-2.5 items-center justify-start max-w-[257px] p-[10px] relative rounded-[20px] shrink-0 hover:opacity-90 transition-opacity duration-200`}
                type="button"
              >
                <div
                  className={`flex flex-col justify-center leading-[0] relative shrink-0 ${colors.textWhite} text-left text-nowrap meeta-typography-mid`}
                >
                  <p className="block whitespace-pre">
                    {grade.emoji}{grade.label}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};