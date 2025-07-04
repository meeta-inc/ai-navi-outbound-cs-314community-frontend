import React from 'react';
import { BookOpen, Settings, HelpCircle } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

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
    textKey: 'chat.quickReplies.study.title',
    valueKey: 'chat.quickReplies.study.message',
    icon: <BookOpen className="w-4 h-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverBgColor: "hover:bg-orange-100"
  },
  {
    textKey: 'chat.quickReplies.technical.title',
    valueKey: 'chat.quickReplies.technical.message',
    icon: <Settings className="w-4 h-4" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverBgColor: "hover:bg-green-100"
  },
  {
    textKey: 'chat.quickReplies.general.title',
    valueKey: 'chat.quickReplies.general.message',
    icon: <HelpCircle className="w-4 h-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverBgColor: "hover:bg-purple-100"
  }
];

export default function QuickReply({ onReplyClick, show }: QuickReplyProps) {
  const { t } = useLocale();

  if (!show) return null;

  return (
    <div className="pl-12">
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
      </div>
    </div>
  );
}