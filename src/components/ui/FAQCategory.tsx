import React from 'react';
import { ArrowLeft, MessageCircleMore } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../shared/config/theme.config';
import { getAccentColor } from "../../shared/config/app.config";

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
    id: 'classes',
    textKey: 'chat.faq.classes.title',
    valueKey: 'chat.faq.classes.message',
    icon: <MessageCircleMore className="w-4 h-4" />
  },
  {
    id: 'teachers',
    textKey: 'chat.faq.teachers.title', 
    valueKey: 'chat.faq.teachers.message',
    icon: <MessageCircleMore className="w-4 h-4" />
  },
  {
    id: 'results',
    textKey: 'chat.faq.results.title',
    valueKey: 'chat.faq.results.message', 
    icon: <MessageCircleMore className="w-4 h-4" />
  },
  {
    id: 'homework',
    textKey: 'chat.faq.homework.title',
    valueKey: 'chat.faq.homework.message', 
    icon: <MessageCircleMore className="w-4 h-4" />
  },
  {
    id: 'other',
    textKey: 'chat.faq.other.title',
    valueKey: 'chat.faq.other.message',
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
    <div className={`bg-gray-50 w-full max-w-[320px] ${className}`}>
      {/* Header Section */}
      <div className="mb-[7px] pl-5">
        <p 
          className="text-[#B7B7B7] text-[12px] font-medium leading-[16px] tracking-[0.6px]"
          style={{ fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif" }}
        >
          📚{displayDescription}
        </p>
      </div>

      {/* Categories Section */}
      <div className="flex flex-col gap-[7px] items-start">
        {categories.map((category) => (
          <div key={category.id} className="pl-5 w-full">
            <button
              onClick={() => onCategorySelect(category)}
              className="bg-[#F57C00] inline-flex items-center gap-2.5 max-w-[257px] pl-2.5 pr-5 py-2.5 rounded-[20px] text-white text-[12px] font-semibold leading-[16px] tracking-[0.6px] transition-all duration-200 hover:opacity-90 text-left"
              style={{ fontFamily: "'Noto Sans', 'Noto Sans JP', sans-serif" }}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {category.icon || <MessageCircleMore className="w-4 h-4" />}
              </div>
              <span className="flex-1 min-w-0">
                {t(category.textKey)}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}