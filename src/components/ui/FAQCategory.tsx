import React from 'react';
import { ArrowLeft, MessageCircleMore } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../shared/config/theme.config';
import { getAccentColor } from "../../shared/config/app.config";
import { DynamicIcon } from './DynamicIcon';
import { getIconConfig, IconConfig } from '../../shared/config/iconConfig';

export interface FAQCategoryItem {
  id: string;
  textKey: string;
  valueKey: string;
  iconConfig?: IconConfig;
  icon?: React.ReactNode; // 백워드 호환성을 위해 유지
}

interface FAQCategoryProps {
  categories?: FAQCategoryItem[];
  onCategorySelect: (category: FAQCategoryItem) => void;
  onBack?: () => void;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  className?: string;
}

const createDefaultCategories = (): FAQCategoryItem[] => {
  const iconConfig = getIconConfig();
  
  return [
    {
      id: 'category1',
      textKey: 'chat.faq.category1.title',
      valueKey: 'chat.faq.category1.message',
      iconConfig: iconConfig.category1
    },
    {
      id: 'category2',
      textKey: 'chat.faq.category2.title',
      valueKey: 'chat.faq.category2.message',
      iconConfig: iconConfig.category2
    },
    {
      id: 'category3',
      textKey: 'chat.faq.category3.title',
      valueKey: 'chat.faq.category3.message',
      iconConfig: iconConfig.category3
    },
    {
      id: 'category4',
      textKey: 'chat.faq.category4.title',
      valueKey: 'chat.faq.category4.message',
      iconConfig: iconConfig.category4
    },
    {
      id: 'other',
      textKey: 'chat.faq.other.title',
      valueKey: 'chat.faq.other.message',
      iconConfig: iconConfig.other
    }
  ];
};

export default function FAQCategory({ 
  categories,
  onCategorySelect,
  onBack,
  title,
  description,
  showBackButton = true,
  className = ""
}: FAQCategoryProps) {
  const defaultCategories = createDefaultCategories();
  const finalCategories = categories || defaultCategories;
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

  const displayTitle = title || t('chat.faq.title');
  const displayDescription = description || t('chat.faq.description');

  return (
    <div className={`bg-gray-50 w-full max-w-[320px] ${className}`}>
      {/* Header Section */}
      <div className="mb-[7px] pl-5">
        <p 
          className={`${colors.textMuted} text-[12px] font-medium leading-[16px] tracking-[0.6px]`}
          style={{ fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif" }}
        >
          📚{displayDescription}
        </p>
      </div>

      {/* Categories Section */}
      <div className="flex flex-col gap-[7px] items-start">
        {finalCategories.map((category) => (
          <div key={category.id} className="pl-5 w-full">
            <button
              onClick={() => onCategorySelect(category)}
              className={`${colors.background} ${colors.textWhite} inline-flex items-center gap-2.5 max-w-[257px] pl-2.5 pr-5 py-2.5 rounded-[20px] text-[12px] font-semibold leading-[16px] tracking-[0.6px] transition-all duration-200 hover:opacity-90 text-left`}
              style={{ 
                fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif"
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {category.iconConfig ? (
                  <DynamicIcon 
                    config={category.iconConfig} 
                    className="w-4 h-4"
                  />
                ) : (
                  category.icon || <MessageCircleMore className="w-4 h-4" />
                )}
              </div>
              <span className="font-semibold flex-1 min-w-0">
                {t(category.textKey)}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}