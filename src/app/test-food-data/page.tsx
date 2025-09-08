'use client';

import { useEffect, useState } from 'react';
import { runFoodDataValidation } from '@/lib/utils/validate-food-data';
import { FOOD_CATEGORIES, FOOD_DATABASE_STATS } from '@/lib/data/food-categories';
import { FoodWithNutrition } from '@/components/food/FoodWithNutrition';
import { foodNutritionService } from '@/lib/services/food-nutrition';

export default function TestFoodDataPage() {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    categoriesCount: number;
    foodsCount: number;
  } | null>(null);

  useEffect(() => {
    // Run validation on component mount
    try {
      runFoodDataValidation();
      
      
      setValidationResult({
        isValid: true,
        errors: [],
        categoriesCount: FOOD_DATABASE_STATS.totalCategories,
        foodsCount: FOOD_DATABASE_STATS.totalFoods
      });
    } catch (error) {
      console.error('Validation failed:', error);
      setValidationResult({
        isValid: false,
        errors: [String(error)],
        categoriesCount: 0,
        foodsCount: 0
      });
    }
  }, []);

  const testNutritionService = async () => {
    console.log('🧪 Testing nutrition service...');
    
    // Find a food with FDC ID
    const chickenFood = FOOD_CATEGORIES[0].foods.find(f => f.id === 'chicken-skinless');
    if (chickenFood) {
      console.log('🐔 Testing with chicken:', chickenFood);
      try {
        const nutritionData = await foodNutritionService.getNutritionalInfo(chickenFood);
        console.log('📊 Nutrition data:', nutritionData);
      } catch (error) {
        console.error('❌ Error testing nutrition:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Food Data Validation Test
        </h1>

        {/* Test Nutrition Service Button */}
        <div className="mb-6">
          <button
            onClick={testNutritionService}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🧪 Test Nutrition Service
          </button>
          <p className="text-sm text-gray-600 mt-1">
            Click this button and check the browser console (F12) for nutrition service logs
          </p>
        </div>

        {validationResult ? (
          <div className="space-y-6">
            {/* Validation Status */}
            <div className={`p-4 rounded-lg ${
              validationResult.isValid 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <h2 className={`text-lg font-semibold ${
                validationResult.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {validationResult.isValid ? '✅ Validation Passed' : '❌ Validation Failed'}
              </h2>
              
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-700">
                  Categories: {validationResult.categoriesCount}
                </p>
                <p className="text-sm text-gray-700">
                  Total Foods: {validationResult.foodsCount}
                </p>
              </div>
              
              {validationResult.errors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-red-800 mb-2">Errors:</h3>
                  <ul className="space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Food Categories Preview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Food Categories Preview
              </h2>
              
              <div className="space-y-4">
                {FOOD_CATEGORIES.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {category.name} ({category.foods.length} items)
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.foods.slice(0, 4).map((food) => (
                        <FoodWithNutrition key={food.id} food={food}>
                          <div className="text-sm text-gray-700">
                            • {food.name}
                            {food.servingSize && (
                              <span className="text-gray-500 ml-2">
                                ({food.servingSize})
                              </span>
                            )}
                            {food.fdcId && (
                              <span className="text-blue-500 text-xs ml-1" title="Nutrition data available">
                                📊
                              </span>
                            )}
                          </div>
                        </FoodWithNutrition>
                      ))}
                      {category.foods.length > 4 && (
                        <div className="text-sm text-gray-500 italic">
                          ... and {category.foods.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Running validation...</p>
          </div>
        )}
      </div>
    </div>
  );
}
