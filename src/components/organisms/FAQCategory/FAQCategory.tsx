import React from 'react';
import { MessageCircleMore } from 'lucide-react';
import { useLocale } from '../../../contexts/LocaleContext';
import { getColorClasses } from '../../../shared/config/theme.config';
import { getAccentColor } from "../../../shared/config/app.config";
import { Icon } from '../../atoms/Icon';
import { IconConfig } from '../../../shared/config/iconConfig';
import { getEnabledFAQCategories, FAQCategoryConfig } from '../../../shared/config/faqCategories.config';

// 상수 정의
const STYLES = {
  FONT_FAMILY: "'Noto Sans', 'Noto Sans JP', sans-serif",
  CONTAINER: "bg-gray-50 w-full max-w-[320px]",
  HEADER: "mb-[7px] pl-5",
  DESCRIPTION: "meeta-typography-small",
  CATEGORIES_CONTAINER: "flex flex-col gap-[7px] items-start",
  CATEGORY_WRAPPER: "pl-5 w-full",
  BUTTON_BASE: "inline-flex items-center gap-2.5 max-w-[257px] pl-2.5 pr-5 py-2.5 rounded-[20px] transition-all duration-200 hover:opacity-90 text-left meeta-typography-mid",
  ICON_CONTAINER: "w-5 h-5 flex items-center justify-center",
  ICON: "w-4 h-4",
  TEXT_SPAN: "flex-1 min-w-0"
} as const;

export interface FAQCategoryItem {
  id: string;
  textKey: string;
  valueKey: string;
  iconConfig?: IconConfig;
  /** @deprecated 백워드 호환성을 위해 유지. iconConfig 사용을 권장합니다. */
  icon?: React.ReactNode;
  /** API에서 가져온 카테고리 이름 (API 사용 시) */
  displayName?: string;
  /** API에서 가져온 이모지 아이콘 (API 사용 시) */
  emojiIcon?: string;
}

interface FAQCategoryProps {
  /** 커스텀 카테고리 목록. 제공되지 않으면 환경변수 설정 기반 기본 카테고리 사용 */
  categories?: FAQCategoryItem[];
  /** 카테고리 선택 시 호출되는 콜백 함수 */
  onCategorySelect: (category: FAQCategoryItem) => void;
  /** 카테고리 섹션 설명 텍스트. 제공되지 않으면 기본 번역값 사용 */
  description?: string;
  /** 컨테이너에 추가할 CSS 클래스명 */
  className?: string;
}

/**
 * 환경변수 설정을 기반으로 기본 카테고리 목록을 생성합니다.
 * @returns FAQCategoryItem 배열
 */
const createDefaultCategories = (): FAQCategoryItem[] => {
  const categoryConfigs = getEnabledFAQCategories();
  
  return categoryConfigs.map((config: FAQCategoryConfig): FAQCategoryItem => ({
    id: config.id,
    textKey: config.textKey,
    valueKey: config.valueKey,
    iconConfig: config.iconConfig
  }));
};

/**
 * 카테고리 아이콘을 렌더링합니다.
 * @param category 카테고리 아이템
 * @returns 렌더링할 아이콘 JSX 엘리먼트
 */
const renderCategoryIcon = (category: FAQCategoryItem): React.ReactNode => {
  // 1. API에서 가져온 이모지 아이콘 우선 표시 (타입 안전성 확보)
  if (category.emojiIcon && typeof category.emojiIcon === 'string') {
    return (
      <span className="text-base">{category.emojiIcon}</span>
    );
  }
  
  // 2. iconConfig 처리
  if (category.iconConfig) {
    return (
      <Icon 
        config={category.iconConfig} 
        className={STYLES.ICON}
      />
    );
  }
  
  // 3. 백워드 호환성 지원 - 레거시 icon 필드 처리
  if (category.icon) {
    // 객체인 경우 (API 응답의 {type, value, color} 형태)
    if (typeof category.icon === 'object' && 'type' in category.icon && 'value' in category.icon) {
      const iconObj = category.icon as {type: string, value: string, color?: string | null};
      
      if (iconObj.type === 'emoji' && typeof iconObj.value === 'string') {
        return <span className="text-base">{iconObj.value}</span>;
      }
      
      if (iconObj.type === 'lucide' && typeof iconObj.value === 'string') {
        return (
          <Icon 
            config={{
              type: 'lucide',
              value: iconObj.value
            }} 
            className={STYLES.ICON}
          />
        );
      }
      
      // 알 수 없는 객체 타입의 경우 경고하고 기본 아이콘 사용
      console.warn('Unknown icon object format:', iconObj);
    } else {
      // 기존 React.ReactNode 처리
      return category.icon;
    }
  }
  
  // 4. 기본 아이콘
  return <MessageCircleMore className={STYLES.ICON} />;
};

/**
 * FAQ 카테고리 선택 컴포넌트
 * 
 * 환경변수 설정 기반으로 동적으로 카테고리를 표시하며,
 * 사용자가 관심 있는 FAQ 카테고리를 선택할 수 있도록 합니다.
 * 
 * @param props FAQCategoryProps
 * @returns JSX.Element
 */
export function FAQCategory({ 
  categories,
  onCategorySelect,
  description,
  className = ""
}: FAQCategoryProps) {
  // 상태 및 설정 초기화
  const defaultCategories = createDefaultCategories();
  const finalCategories = categories || defaultCategories;
  const { t } = useLocale();
  const accentColor = getAccentColor();
  const colors = getColorClasses(accentColor);
  
  const displayDescription = description || t('chat.faq.description');

  return (
    <div className={`${STYLES.CONTAINER} ${className}`}>
      {/* 헤더 섹션 */}
      <div className={STYLES.HEADER}>
        <p 
          className={`${colors.textMuted} ${STYLES.DESCRIPTION}`}
        >
          📚{displayDescription}
        </p>
      </div>

      {/* 카테고리 섹션 */}
      <div className={STYLES.CATEGORIES_CONTAINER}>
        {finalCategories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            colors={colors}
            onCategorySelect={onCategorySelect}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 개별 카테고리 버튼 컴포넌트
 */
interface CategoryButtonProps {
  category: FAQCategoryItem;
  colors: ReturnType<typeof getColorClasses>;
  onCategorySelect: (category: FAQCategoryItem) => void;
  t: (key: string) => string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  colors,
  onCategorySelect,
  t
}) => (
  <div className={STYLES.CATEGORY_WRAPPER}>
    <button
      onClick={() => onCategorySelect(category)}
      className={`${colors.background} ${colors.textWhite} ${STYLES.BUTTON_BASE}`}
    >
      <div className={STYLES.ICON_CONTAINER}>
        {renderCategoryIcon(category)}
      </div>
      <span className={STYLES.TEXT_SPAN}>
        {category.displayName || t(category.textKey)}
      </span>
    </button>
  </div>
);