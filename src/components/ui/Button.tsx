import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  isLoading = false,
  disabled,
  className,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-prompt font-medium transition-all duration-200 focus:ring-2 focus:ring-brand-focus focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-brand-gold text-brand-dark hover:bg-brand-hover disabled:hover:bg-brand-gold',
    secondary: 'bg-brand-dark text-brand-white hover:bg-brand-dark/90',
    outline: 'border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark',
    ghost: 'text-brand-gold hover:bg-brand-gold/10',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md min-h-[36px]',
    md: 'px-4 py-2 text-base rounded-lg min-h-[44px] touch-target',    // Mobile-friendly
    lg: 'px-6 py-3 text-lg rounded-lg min-h-[52px]',
  };

  return (
    <button
      className={clsx(
        baseStyles, 
        variantStyles[variant], 
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
}
