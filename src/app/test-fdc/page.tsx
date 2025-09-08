/**
 * FDC Integration Test Page
 * This page tests the FDC API integration to ensure it's working correctly
 * Reference: https://fdc.nal.usda.gov/api-guide/
 */

'use client';

import React, { useState } from 'react';
import { FDCFoodSearch } from '@/components/food/FDCFoodSearch';
import { useFDC } from '@/lib/hooks/useFDC';
import { Button } from '@/components/ui/Button';
import type { FoodItem } from '@/lib/types';

export default function FDCTestPage() {
  const { isAvailable } = useFDC();
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [selectedFood, setSelectedFood] = useState<Omit<FoodItem, 'id'> | null>(null);

  const checkAvailability = async () => {
    setAvailabilityChecked(true);
    const available = await isAvailable();
    setServiceAvailable(available);
  };

  const handleFoodSelect = (foodItem: Omit<FoodItem, 'id'>) => {
    setSelectedFood(foodItem);
    console.log('Selected food:', foodItem);
  };

  const handleFoodDetail = (fdcId: number) => {
    console.log('View details for FDC ID:', fdcId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            FDC API Integration Test
          </h1>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Service Status Check
              </h2>
              <p className="text-sm text-blue-700 mb-3">
                Check if the FDC API is properly configured and accessible.
              </p>
              
              <Button
                onClick={checkAvailability}
                disabled={availabilityChecked}
                className="mb-3"
              >
                {availabilityChecked ? 'Checked' : 'Check FDC Service'}
              </Button>

              {availabilityChecked && (
                <div className={`p-3 rounded-md ${
                  serviceAvailable 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  <p className="font-medium">
                    {serviceAvailable 
                      ? '✅ FDC API is available and working!'
                      : '❌ FDC API is not available. Check API key configuration.'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Search Test
              </h2>
              <p className="text-sm text-green-700 mb-3">
                Test the food search functionality with the USDA database.
              </p>
              
              <FDCFoodSearch
                onFoodSelect={handleFoodSelect}
                onFoodDetail={handleFoodDetail}
                maxResults={10}
                allowMultiSelect={false}
                className="mt-4"
              />
            </div>

            {selectedFood && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-purple-800 mb-2">
                  Selected Food Details
                </h2>
                <div className="bg-white rounded border p-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedFood, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                Instructions
              </h2>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. First, click "Check FDC Service" to verify API connectivity</li>
                <li>2. If available, try searching for foods like "apple", "chicken breast", or "quinoa"</li>
                <li>3. Click on food items to see detailed information</li>
                <li>4. Check the browser console for additional debug information</li>
                <li>5. Selected food details will appear below the search</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
