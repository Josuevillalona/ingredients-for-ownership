'use client';

import React from 'react';
import { CategoryData } from './types';

interface CategoryNavigationProps {
  categories: CategoryData[];
  selectedCategory?: string;
  onCategorySelect: (categoryId?: string) => void;
}

export function CategoryNavigation({ categories, selectedCategory, onCategorySelect }: CategoryNavigationProps) {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategorySelect(undefined)}
          className={`px-4 py-2 rounded-lg font-prompt font-medium transition-all duration-200 text-sm
            ${!selectedCategory 
              ? 'bg-brand-gold text-brand-white shadow-md' 
              : 'bg-brand-white/70 text-brand-dark hover:bg-brand-white border border-brand-gold/20'
            }`}
        >
          All Categories
        </button>
        {sortedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`px-4 py-2 rounded-lg font-prompt font-medium transition-all duration-200 text-sm
              ${selectedCategory === category.id
                ? 'bg-brand-gold text-brand-white shadow-md' 
                : 'bg-brand-white/70 text-brand-dark hover:bg-brand-white border border-brand-gold/20'
              }`}
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );
}
