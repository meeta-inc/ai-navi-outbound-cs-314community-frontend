import React from 'react';
import { HeaderAction, getHeaderConfig, filterActionsByMaxItems, isActionVisible } from '../../config/headerConfig';
import { headerIcons } from '../icons/HeaderIcons';

interface DynamicNaviHeaderProps {
  clientId?: string;
  onActionClick?: (action: HeaderAction) => void;
  className?: string;
}

export const DynamicNaviHeader: React.FC<DynamicNaviHeaderProps> = ({
  clientId = 'default',
  onActionClick,
  className = '',
}) => {
  const headerConfig = getHeaderConfig(clientId);
  const visibleActions = filterActionsByMaxItems(headerConfig.actions, headerConfig.maxItems);

  const handleActionClick = (action: HeaderAction) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      action.onClick();
    }
  };

  const getAlignmentClass = () => {
    switch (headerConfig.alignment) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
      default:
        return 'justify-end';
    }
  };

  return (
    <div className={`relative size-full ${className}`}>
      <div className={`flex flex-row items-center ${getAlignmentClass()} relative size-full`}>
        <div className={`box-border content-stretch flex flex-row gap-3 items-center ${getAlignmentClass()} px-3 py-[13px] relative size-full`}>
          {visibleActions.map((action, index) => {
            const IconComponent = headerIcons[action.icon as keyof typeof headerIcons];
            
            if (!IconComponent) {
              console.warn(`Icon "${action.icon}" not found for action "${action.type}"`);
              return null;
            }

            return (
              <button
                key={`${action.type}-${index}`}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
                className={`relative shrink-0 size-6 flex items-center justify-center transition-colors duration-200 ${
                  action.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-100 rounded-full p-1 cursor-pointer'
                }`}
                aria-label={action.label}
                title={action.label}
              >
                <IconComponent size={20} className="text-gray-700" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DynamicNaviHeader;