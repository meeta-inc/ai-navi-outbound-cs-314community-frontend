import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  onClick, 
  disabled = false, 
  className = '', 
  children, 
  'aria-label': ariaLabel,
  type = 'button'
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}