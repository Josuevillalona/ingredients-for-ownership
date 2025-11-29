'use client';

import React from 'react';
import { FoodItemData, FoodStatus, statusColors } from './types';

interface FoodItemProps {
  food: FoodItemData;
  onStatusChange: (foodId: string, status: FoodStatus) => void;
}

export function FoodItem({ food, onStatusChange }: FoodItemProps) {
  const currentStatus = food.status;
  const statusConfig = statusColors[currentStatus];

  const handleStatusClick = (status: FoodStatus) => {
    // If clicking the same status, deselect it (set to 'none')
    if (currentStatus === status) {
      onStatusChange(food.id, 'none');
    } else {
      onStatusChange(food.id, status);
    }
  };

  return (
    <div className="bg-brand-white/90 backdrop-blur-sm rounded-xl border border-brand-gold/20 p-4 
                    hover:shadow-md transition-all duration-200 group">
      {/* Food Name */}
      <div className="mb-3">
        <h3 className="font-prompt font-semibold text-brand-dark text-lg leading-tight">
          {food.name}
        </h3>
        {food.nutritionalHighlights && food.nutritionalHighlights.length > 0 && (
          <p className="text-sm text-brand-dark/60 font-prompt mt-1">
            {food.nutritionalHighlights.join(', ')}
          </p>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${statusConfig.bg}`} />
          <span className={`text-sm font-prompt font-medium ${statusConfig.text}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Status Selection Buttons */}
      <div className="grid grid-cols-3 gap-1">
        {(['approved', 'neutral', 'avoid'] as const).map((status) => {
          const config = statusColors[status];
          const isSelected = currentStatus === status;
          
          return (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`p-2 rounded-lg text-xs font-prompt font-medium transition-all duration-200
                ${isSelected 
                  ? `${config.bg} text-white shadow-sm` 
                  : `bg-gray-100 ${config.text} hover:bg-gray-200 border ${config.border}/30`
                }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
