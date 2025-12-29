import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
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
  const baseStyles = `
    font-prompt font-medium
    transition-all duration-[var(--duration-fast)]
    focus:ring-2 focus:ring-brand-gold focus:outline-none focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-[1.01] active:scale-[0.99]
    inline-flex items-center justify-center
    whitespace-nowrap
  `;

  const variantStyles = {
    primary: `
      bg-brand-gold text-white
      border border-brand-gold-600/20
      hover:bg-brand-gold-600
      shadow-soft hover:shadow-soft-lg
    `,
    secondary: `
      bg-transparent text-brand-dark
      border border-[var(--border-default)]
      hover:bg-brand-dark-50 hover:border-[var(--border-emphasis)]
    `,
    ghost: `
      bg-transparent text-brand-gold
      hover:bg-brand-gold-50
      border border-transparent
    `,
    danger: `
      bg-transparent text-[var(--color-error)]
      border border-[var(--color-error)]/20
      hover:bg-[var(--color-error)]/5 hover:border-[var(--color-error)]/40
    `
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8 rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm h-10 rounded-lg gap-2',
    lg: 'px-6 py-2.5 text-base h-12 rounded-lg gap-2.5'
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
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
}
