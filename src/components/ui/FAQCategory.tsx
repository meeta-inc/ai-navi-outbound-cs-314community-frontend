import React from 'react';
import { ArrowLeft, MessageCircleMore } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../utils/theme';
import { getAccentColor } from '../../services/config';

export interface FAQCategoryItem {
  id: string;
  textKey: string;
  valueKey: string;
  icon?: React.ReactNode;
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

const defaultCategories: FAQCategoryItem[] = [
  {
    id: 'schedule',
    textKey: 'chat.faq.schedule.title',
    valueKey: 'chat.faq.schedule.message',
    icon: <MessageCircleMore className="w-4 h-4" />
  },
  {
    id: 'grades',
    textKey: 'chat.faq.grades.title', 
    valueKey: 'chat.faq.grades.message',
    icon: <MessageCircleMore className="w-4 h-4" />
  },
  {
    id: 'homework',
    textKey: 'chat.faq.homework.title',
    valueKey: 'chat.faq.homework.message', 
    icon: <MessageCircleMore className="w-4 h-4" />
  },
  {
    id: 'support',
    textKey: 'chat.faq.support.title',
    valueKey: 'chat.faq.support.message',
    icon: <MessageCircleMore className="w-4 h-4" />
  }
];

export default function FAQCategory({ 
  categories = defaultCategories,
  onCategorySelect,
  onBack,
  title,
  description,
  showBackButton = true,
  className = ""
}: FAQCategoryProps) {
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

  const displayTitle = title || t('chat.faq.title');
  const displayDescription = description || t('chat.faq.description');

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('common.back')}</span>
          </button>
        )}
        
        {displayTitle && (
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {displayTitle}
          </h3>
        )}
        
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>💡</span>
          {displayDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className={`group flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 ${colors.bgHover} hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:${colors.border} focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 focus:ring-opacity-50`}
          >
            <div className={`p-2 rounded-lg ${colors.background} text-white group-hover:scale-110 transition-transform duration-200`}>
              {category.icon || <MessageCircleMore className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {t(category.textKey)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}