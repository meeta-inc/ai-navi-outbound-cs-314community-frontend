import React from 'react';
import { ImageIcon } from '../../assets/icons';

interface CustomIconProps {
  className?: string;
}

export const CustomIcon: React.FC<CustomIconProps> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7L12 2z"/>
    </svg>
  );
};

export const SchoolIcon: React.FC<CustomIconProps> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
    </svg>
  );
};

export const TeacherIcon: React.FC<CustomIconProps> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      <path d="M12.5 13c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z"/>
    </svg>
  );
};

// Re-export ImageIcon from assets/icons
export { ImageIcon };