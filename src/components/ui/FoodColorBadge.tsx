import React from 'react';
import { clsx } from 'clsx';
import type { FoodCategory } from '@/lib/types';

interface FoodColorBadgeProps {
  category: FoodCategory;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FoodColorBadge({ 
  category, 
  children, 
  size = 'md',
  className 
}: FoodColorBadgeProps) {
  const categoryStyles = {
    blue: 'bg-food-blue-100 text-food-blue-800 border-food-blue-200',
    yellow: 'bg-food-yellow-100 text-food-yellow-800 border-food-yellow-200',
    red: 'bg-food-red-100 text-food-red-800 border-food-red-200',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium', 
    lg: 'px-4 py-2 text-base font-semibold',
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full border font-prompt transition-all duration-200',
      categoryStyles[category],
      sizeStyles[size],
      className
    )}>
      {children}
    </span>
  );
}
