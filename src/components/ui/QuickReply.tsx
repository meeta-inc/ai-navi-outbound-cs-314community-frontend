import React, { useState } from 'react';
import { MessageCircleMore, HelpCircle } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { getColorClasses } from '../../utils/theme';
import { getAccentColor } from '../../services/config';
import FAQCategory, { FAQCategoryItem } from './FAQCategory';

export interface QuickReplyOption {
  textKey: string;
  valueKey: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverBgColor: string;
}

interface QuickReplyProps {
  onReplyClick: (reply: QuickReplyOption) => void;
  show: boolean;
}


const quickReplies: QuickReplyOption[] = [
  {
    textKey: 'chat.quickReplies.study.message',
    valueKey: 'chat.quickReplies.study.message',
    icon: <MessageCircleMore className="w-4 h-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverBgColor: "hover:bg-orange-100"
  },
  {
    textKey: 'chat.quickReplies.technical.message',
    valueKey: 'chat.quickReplies.technical.message',
    icon: <MessageCircleMore className="w-4 h-4" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverBgColor: "hover:bg-green-100"
  },
  {
    textKey: 'chat.quickReplies.general.message',
    valueKey: 'chat.quickReplies.general.message',
    icon: <MessageCircleMore className="w-4 h-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverBgColor: "hover:bg-purple-100"
  }
];

export default function QuickReply({ onReplyClick, show }: QuickReplyProps) {
  const { t } = useLocale();
  const [showFAQ, setShowFAQ] = useState(false);
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);

  if (!show) return null;

  const handleOtherClick = () => {
    setShowFAQ(true);
  };

  const handleFAQClick = (category: FAQCategoryItem) => {
    const reply: QuickReplyOption = {
      textKey: category.textKey,
      valueKey: category.valueKey,
      icon: category.icon || <MessageCircleMore className="w-4 h-4" />,
      color: colors.text,
      bgColor: colors.bgHover,
      hoverBgColor: colors.bgHover
    };
    onReplyClick(reply);
    setShowFAQ(false);
  };

  const handleBackClick = () => {
    setShowFAQ(false);
  };

  if (showFAQ) {
    return (
      <div className="pl-12">
        <FAQCategory
          onCategorySelect={handleFAQClick}
          onBack={handleBackClick}
        />
      </div>
    );
  }

  return (
    <div className="pl-12">
      <div className="mb-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>✨</span>
          {t('chat.quickReplies.description')}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onReplyClick(reply)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${reply.color} ${reply.bgColor} ${reply.hoverBgColor} border border-transparent hover:border-orange-200`}
          >
            {reply.icon}
            {t(reply.textKey)}
          </button>
        ))}
        <button
          onClick={handleOtherClick}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${colors.text} ${colors.bgLight} hover:bg-${accentColor}-100 ${colors.textHover} border border-transparent hover:${colors.border} hover:shadow-sm`}
        >
          <HelpCircle className="w-4 h-4" />
          {t('chat.quickReplies.other')}
        </button>
      </div>
    </div>
  );
}