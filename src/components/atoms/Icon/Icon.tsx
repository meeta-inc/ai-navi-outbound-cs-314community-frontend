import React from 'react';
import * as LucideIcons from 'lucide-react';
import { IconConfig } from '../../../shared/config/iconConfig';
import { CustomIcon, SchoolIcon, TeacherIcon, ImageIcon } from '../../icons/CustomIcon';
import { AiChatbotIcon } from '../../../assets/icons';

// 커스텀 아이콘 컴포넌트 매핑
// 새로운 커스텀 아이콘을 추가하려면 여기에 import하고 componentMap에 추가하세요
const componentMap = {
  CustomIcon: CustomIcon,
  SchoolIcon: SchoolIcon,
  TeacherIcon: TeacherIcon,
  ImageIcon: ImageIcon,
  AiChatbotIcon: AiChatbotIcon,
  // 추가 컴포넌트들...
};

interface IconProps {
  config: IconConfig;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ config, className = "w-4 h-4" }) => {
  switch (config.type) {
    case 'lucide':
      try {
        const LucideIcon = LucideIcons[config.value as keyof typeof LucideIcons] as React.ComponentType<any>;
        return LucideIcon ? <LucideIcon className={className} /> : 
          (config.fallback ? <config.fallback className={className} /> : null);
      } catch (error) {
        console.warn(`Failed to load Lucide icon: ${config.value}`);
        return config.fallback ? <config.fallback className={className} /> : null;
      }
    
    case 'url':
      return (
        <img 
          src={config.value as string} 
          alt="category icon" 
          className={className}
          onError={(e) => {
            console.warn(`Failed to load icon from URL: ${config.value}`);
            if (config.fallback) {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Fallback component would need to be rendered separately
            }
          }}
        />
      );
    
    case 'svg':
      return (
        <div 
          className={className} 
          dangerouslySetInnerHTML={{ __html: config.value as string }} 
        />
      );
    
    case 'component':
      try {
        const Component = componentMap[config.value as keyof typeof componentMap];
        return Component ? <Component className={className} /> : 
          (config.fallback ? <config.fallback className={className} /> : null);
      } catch (error) {
        console.warn(`Failed to render custom component icon: ${config.value}`);
        return config.fallback ? <config.fallback className={className} /> : null;
      }
    
    default:
      console.warn(`Unknown icon type: ${config.type}`);
      return config.fallback ? <config.fallback className={className} /> : null;
  }
};