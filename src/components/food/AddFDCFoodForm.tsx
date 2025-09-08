/**
 * Add FDC Food Form Component
 * Allows coaches to search and add USDA-verified foods from FoodData Central API
 */

'use client';

import React, { useState } from 'react';
import { FDCFoodSearch } from './FDCFoodSearch';
import { useFoods } from '@/lib/hooks/useFoods';
import { Button } from '@/components/ui/Button';
import type { FoodItem, CreateFoodData } from '@/lib/types';

interface AddFDCFoodFormProps {
  onSuccess?: (foodId: string) => void;
  onCancel?: () => void;
  onManualAdd?: () => void; // New prop for manual add fallback
  className?: string;
}

export function AddFDCFoodForm({ 
  onSuccess, 
  onCancel,
  onManualAdd,
  className = '' 
}: AddFDCFoodFormProps) {
  const { createFood, loading: createLoading, error } = useFoods();
  const [selectedFood, setSelectedFood] = useState<Omit<FoodItem, 'id'> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleFoodSelect = (foodItem: Omit<FoodItem, 'id'>) => {
    setSelectedFood(foodItem);
  };

  const handleAddFood = async () => {
    if (!selectedFood || !selectedFood.fdcId) {
      console.error('No USDA food selected or missing FDC ID');
      return;
    }

    setIsAdding(true);

    try {
      // Convert to CreateFoodData format
      const createData: CreateFoodData = {
        name: selectedFood.name,
        category: selectedFood.category,
        description: selectedFood.description,
        servingSize: selectedFood.servingSize,
        portionGuidelines: selectedFood.portionGuidelines,
        nutritionalInfo: selectedFood.nutritionalInfo,
        fdcId: selectedFood.fdcId,
        tags: selectedFood.tags || [],
        source: 'fdc-api'
      };

      const foodId = await createFood(createData);
      
      if (foodId) {
        console.log(`Successfully added USDA food: ${selectedFood.name} (FDC ID: ${selectedFood.fdcId})`);
        onSuccess?.(foodId);
      }
    } catch (err) {
      console.error('Error adding USDA food:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFood(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Add New Food
        </h2>
        <p className="text-gray-600">
          Search our database of USDA-verified foods for accurate nutritional data
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Food Search */}
      {!selectedFood && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Our Food Database
            </h3>
            <FDCFoodSearch
              onFoodSelect={handleFoodSelect}
              maxResults={10}
              className="w-full"
            />
          </div>

          {/* Can't Find Food Option */}
          {onManualAdd && (
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-amber-900 mb-2">
                    Can't find your food?
                  </h4>
                  <p className="text-amber-800 text-sm mb-4">
                    If the food you're looking for isn't in our verified database, 
                    you can add it manually. Note: Manual entries won't have 
                    scientifically verified nutritional data.
                  </p>
                  <Button
                    onClick={onManualAdd}
                    variant="outline"
                    className="border-amber-300 text-amber-800 hover:bg-amber-100"
                  >
                    Add Food Manually
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Food Preview */}
      {selectedFood && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Food
            </h3>
            <Button
              onClick={handleClearSelection}
              variant="outline"
              size="sm"
            >
              Change Selection
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900">{selectedFood.name}</h4>
              <p className="text-sm text-gray-600">
                FDC ID: {selectedFood.fdcId} • USDA Verified
              </p>
            </div>

            {selectedFood.description && (
              <div>
                <span className="text-sm font-medium text-gray-700">Description:</span>
                <p className="text-sm text-gray-600 mt-1">{selectedFood.description}</p>
              </div>
            )}

            {selectedFood.nutritionalInfo && (
              <div>
                <span className="text-sm font-medium text-gray-700">Nutrition (per 100g):</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                  {selectedFood.nutritionalInfo.calories && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedFood.nutritionalInfo.calories}
                      </div>
                      <div className="text-xs text-gray-500">Calories</div>
                    </div>
                  )}
                  {selectedFood.nutritionalInfo.protein && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedFood.nutritionalInfo.protein}g
                      </div>
                      <div className="text-xs text-gray-500">Protein</div>
                    </div>
                  )}
                  {selectedFood.nutritionalInfo.carbs && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedFood.nutritionalInfo.carbs}g
                      </div>
                      <div className="text-xs text-gray-500">Carbs</div>
                    </div>
                  )}
                  {selectedFood.nutritionalInfo.fat && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedFood.nutritionalInfo.fat}g
                      </div>
                      <div className="text-xs text-gray-500">Fat</div>
                    </div>
                  )}
                  {selectedFood.nutritionalInfo.fiber && (
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-lg font-bold text-gray-900">
                        {selectedFood.nutritionalInfo.fiber}g
                      </div>
                      <div className="text-xs text-gray-500">Fiber</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Button
          onClick={onCancel}
          variant="outline"
          disabled={isAdding}
        >
          Cancel
        </Button>

        <Button
          onClick={handleAddFood}
          disabled={!selectedFood || isAdding || createLoading}
          className="min-w-[120px]"
        >
          {isAdding || createLoading ? 'Adding...' : 'Add Food'}
        </Button>
      </div>

      {/* Info Footer */}
      <div className="text-center text-sm text-gray-500 pt-4">
        ✅ All foods are USDA-verified with accurate nutritional data
      </div>
    </div>
  );
}
