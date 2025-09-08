'use client';

import { useState } from 'react';
import { Food } from '@/lib/types/ingredient-document';
import { foodNutritionService, NutritionalInfo } from '@/lib/services/food-nutrition';

interface FoodWithNutritionProps {
  food: Food;
  children: React.ReactNode;
  showOnHover?: boolean;
}

/**
 * Wrapper component that adds nutritional information display to any food item
 * Shows nutrition data on hover or click if FDC ID is available
 */
export function FoodWithNutrition({ 
  food, 
  children, 
  showOnHover = true 
}: FoodWithNutritionProps) {
  const [nutritionData, setNutritionData] = useState<NutritionalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasNutritionData = foodNutritionService.hasNutritionalData(food);

  const loadNutritionData = async () => {
    if (!hasNutritionData || nutritionData || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await foodNutritionService.getNutritionalInfo(food);
      setNutritionData(data);
    } catch (err) {
      setError('Failed to load nutrition data');
      console.error('Error loading nutrition:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    console.log('🖱️ Mouse enter:', food.name, 'FDC ID:', food.fdcId, 'Has nutrition data:', hasNutritionData);
    if (showOnHover && hasNutritionData) {
      setShowNutrition(true);
      loadNutritionData();
    }
  };

  const handleMouseLeave = () => {
    console.log('🖱️ Mouse leave:', food.name);
    if (showOnHover) {
      setShowNutrition(false);
    }
  };

  const handleClick = () => {
    console.log('🖱️ Click:', food.name, 'FDC ID:', food.fdcId, 'Has nutrition data:', hasNutritionData);
    if (hasNutritionData) {
      setShowNutrition(!showNutrition);
      loadNutritionData();
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Original content with nutrition indicator */}
      <div className={`${hasNutritionData ? 'cursor-pointer' : ''} flex items-center gap-1`}>
        {children}
        {hasNutritionData && (
          <span className="text-xs text-blue-500 opacity-60 hover:opacity-100 transition-opacity">
            ℹ️
          </span>
        )}
      </div>

      {/* Nutrition information tooltip/popup */}
      {showNutrition && hasNutritionData && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64 top-full left-0 mt-2">
          <div className="text-sm font-medium text-gray-900 mb-2">
            {food.name} - Nutrition Facts
          </div>
          
          {isLoading && (
            <div className="text-xs text-gray-500">Loading nutrition data...</div>
          )}
          
          {error && (
            <div className="text-xs text-red-500">{error}</div>
          )}
          
          {nutritionData && (
            <div className="space-y-1 text-xs">
              <div className="text-gray-600 mb-2">{nutritionData.servingInfo}</div>
              
              <div className="grid grid-cols-2 gap-2">
                <div><strong>{nutritionData.calories}</strong> calories</div>
                <div><strong>{nutritionData.protein}g</strong> protein</div>
                <div><strong>{nutritionData.carbs}g</strong> carbs</div>
                <div><strong>{nutritionData.fat}g</strong> fat</div>
                {nutritionData.fiber > 0 && (
                  <div><strong>{nutritionData.fiber}g</strong> fiber</div>
                )}
                {nutritionData.sugar > 0 && (
                  <div><strong>{nutritionData.sugar}g</strong> sugar</div>
                )}
              </div>
              
              {nutritionData.sodium > 0 && (
                <div className="pt-1 border-t border-gray-200">
                  <strong>{nutritionData.sodium}mg</strong> sodium
                </div>
              )}
              
              <div className="pt-1 text-gray-400 text-xs">
                Source: {nutritionData.source}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
