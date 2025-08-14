import { getColorClasses } from '../../../shared/config/theme.config';
import { getAccentColor, getCTAButtonsConfig } from '../../../shared/config/app.config';
import { Button } from '../../atoms/Button';
import { AccentColor } from '../../../shared/config/theme.config';

interface CTAButtonsProps {
  onMainClick: () => void;
  onSubClick: () => void;
  show: boolean;
  accentColor?: AccentColor;
  clientId?: string;
}

export function CTAButtons({ onMainClick, onSubClick, show, accentColor, clientId }: CTAButtonsProps) {
  const defaultAccentColor = getAccentColor();
  const colors = getColorClasses(accentColor || defaultAccentColor);
  const ctaConfig = getCTAButtonsConfig(clientId);

  if (!show) return null;

  const handleMainClick = () => {
    if (ctaConfig.main.action.type === 'link') {
      window.open(ctaConfig.main.action.detail, '_blank');
    }
    onMainClick();
  };

  const handleSubClick = () => {
    onSubClick();
  };

  return (
    <div className="w-full max-w-[320px] mt-4">
      <div className="flex flex-col gap-[9px] items-start">
        {/* Main CTA Button */}
        <div className="pl-5 w-full">
          <Button
            onClick={handleMainClick}
            className={`
              inline-flex items-center justify-start
              p-[10px] rounded-[20px]
              transition-all duration-200 hover:opacity-90
              text-left text-nowrap
              meeta-typography-mid
              ${colors.background} ${colors.textWhite}
            `}
          >
            {ctaConfig.main.title}
          </Button>
        </div>

        {/* Sub CTA Button */}
        <div className="pl-5 w-full">
          <Button
            onClick={handleSubClick}
            className={`
              inline-flex items-center justify-start
              p-[10px] rounded-[20px]
              transition-all duration-200 hover:opacity-90
              text-left text-nowrap
              meeta-typography-mid
              ${colors.bgLight} ${colors.textBlack}
            `}
          >
            {ctaConfig.sub.title}
          </Button>
        </div>
      </div>
    </div>
  );
}