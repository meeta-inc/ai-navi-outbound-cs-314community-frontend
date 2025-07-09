import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../shared/config/theme.config';
import { getAccentColor } from "../../shared/config/app.config";

export interface QuickReplyOption {
  id: string;
  textKey: string;
  type: 'primary' | 'secondary';
}

interface QuickReplyProps {
  onReplyClick: (text: string) => void;
  show: boolean;
  options?: QuickReplyOption[];
}

const defaultOptions: QuickReplyOption[] = [
  {
    id: 'summer-course',
    textKey: 'chat.quickReplies.summerCourse',
    type: 'primary'
  },
  {
    id: 'tuition',
    textKey: 'chat.quickReplies.tuition',
    type: 'primary'
  },
  {
    id: 'elementary',
    textKey: 'chat.quickReplies.elementary',
    type: 'primary'
  },
  {
    id: 'other',
    textKey: 'chat.quickReplies.other',
    type: 'secondary'
  }
];

export default function QuickReply({ 
  onReplyClick, 
  show, 
  options = defaultOptions 
}: QuickReplyProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

  if (!show) return null;

  const handleOptionClick = (option: QuickReplyOption) => {
    const translatedText = t(option.textKey);
    onReplyClick(translatedText);
  };

  return (
    <div className="w-full max-w-[320px] mt-4">
      {/* Header Section */}
      <div className="mb-[7px] pl-5">
        <p 
          className={`${colors.textMuted} text-[12px] font-medium leading-[16px] tracking-[0.6px]`}
          style={{ fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif" }}
        >
          {t('chat.quickReplies.header')}
        </p>
      </div>

      {/* Options Section */}
      <div className="flex flex-col gap-[7px] items-start">
        {options.map((option) => (
          <div key={option.id} className="pl-5 w-full">
            <button
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
              {t(option.textKey)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}