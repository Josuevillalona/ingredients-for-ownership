'use client';

import React from 'react';
import { FoodItemData, CategoryData, FoodStatus } from './types';
import { FoodItem } from './FoodItem';

interface CategorySectionProps {
  category: CategoryData;
  foods: FoodItemData[];
  onStatusChange: (foodId: string, status: FoodStatus) => void;
}

export function CategorySection({ category, foods, onStatusChange }: CategorySectionProps) {
  if (foods.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-2 h-8 bg-brand-gold rounded-full" />
        <h2 className="font-prompt font-bold text-2xl text-brand-dark">
          {category.title}
        </h2>
        <span className="bg-brand-gold/20 text-brand-dark font-prompt font-medium text-sm px-3 py-1 rounded-full">
          {foods.length} items
        </span>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {foods.map((food) => (
          <FoodItem
            key={food.id}
            food={food}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
