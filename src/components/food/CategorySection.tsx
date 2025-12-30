'use client';

import React from 'react';
import { FoodItemData, CategoryData, FoodStatus } from './types';
import { FoodItem } from './FoodItem';

interface CategorySectionProps {
  category: CategoryData;
  foods: FoodItemData[];
  onStatusChange: (foodId: string, status: FoodStatus) => void;
  showActionIcon?: boolean;
}

export function CategorySection({ category, foods, onStatusChange, showActionIcon = true }: CategorySectionProps) {
  if (foods.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-prompt font-bold text-xl text-brand-dark">
          {category.title}
        </h2>
        <span className="bg-gray-100 text-gray-500 font-medium text-xs px-3 py-1 rounded-full">
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
            showActionIcon={showActionIcon}
          />
        ))}
      </div>
    </div>
  );
}
