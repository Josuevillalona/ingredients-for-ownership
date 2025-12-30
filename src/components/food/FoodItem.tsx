'use client';

import React, { useState } from 'react';
import { FoodItemData, FoodStatus, statusColors } from './types';
import { Edit2 } from 'lucide-react';
import { NutritionModal } from './NutritionModal';

interface FoodItemProps {
  food: FoodItemData;
  onStatusChange: (foodId: string, status: FoodStatus) => void;
  showActionIcon?: boolean;
}

export function FoodItem({ food, onStatusChange, showActionIcon = true }: FoodItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <>
      <div className="bg-brand-white/90 backdrop-blur-sm rounded-xl border border-brand-gold/20 p-3 
                      hover:shadow-md transition-all duration-200 group relative">

        {/* Edit/Info Button - Using Edit2 (Pencil) as requested */}
        {showActionIcon && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-3 right-3 p-1.5 rounded-full text-brand-gold/40 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors opacity-0 group-hover:opacity-100"
            title="View Nutrition Info"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Food Name */}
        <div className="mb-2 pr-6">
          <h3
            className="font-prompt font-medium text-brand-dark text-base leading-tight cursor-pointer hover:text-brand-gold transition-colors capitalize"
            onClick={() => setIsModalOpen(true)}
          >
            {food.name.toLowerCase()}
          </h3>
          {food.nutritionalHighlights && food.nutritionalHighlights.length > 0 && (
            <p className="text-xs text-brand-dark/50 font-prompt mt-1">
              {food.nutritionalHighlights.join(', ')}
            </p>
          )}
        </div>

        {/* Status Indicator */}
        <div className="mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${statusConfig.bg}`} />
            <span className={`text-xs font-prompt font-medium ${statusConfig.text}`}>
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
                className={`py-1.5 px-1 rounded-md text-[10px] uppercase tracking-wider font-prompt font-bold transition-all duration-200
                  ${isSelected
                    ? `${config.bg} text-white shadow-sm`
                    : `bg-gray-50 ${config.text} hover:bg-gray-100 border ${config.border}/20`
                  }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      <NutritionModal
        food={food}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
