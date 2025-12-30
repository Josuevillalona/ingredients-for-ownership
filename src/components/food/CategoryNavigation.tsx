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
          className={`px-4 py-2 rounded-full font-prompt font-medium transition-all duration-200 text-sm border
            ${!selectedCategory
              ? 'bg-brand-gold text-white border-brand-gold shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
        >
          All Categories
        </button>
        {sortedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`px-4 py-2 rounded-full font-prompt font-medium transition-all duration-200 text-sm border
              ${selectedCategory === category.id
                ? 'bg-brand-gold text-white border-brand-gold shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );
}
