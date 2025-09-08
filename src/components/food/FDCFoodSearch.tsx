/**
 * FDC Food Search Component
 * Provides UI for searching and selecting foods from USDA FoodData Central database
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useFDC } from '@/lib/hooks/useFDC';
import { FoodColorBadge } from '@/components/ui/FoodColorBadge';
import { Button } from '@/components/ui/Button';
import type { FDCEnhancedFoodItem } from '@/lib/types/fdc';
import type { FoodItem } from '@/lib/types';

interface FDCFoodSearchProps {
  onFoodSelect?: (foodItem: Omit<FoodItem, 'id'>) => void;
  onFoodDetail?: (fdcId: number) => void;
  initialQuery?: string;
  maxResults?: number;
  allowMultiSelect?: boolean;
  className?: string;
}

interface SearchFilters {
  dataType: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function FDCFoodSearch({
  onFoodSelect,
  onFoodDetail,
  initialQuery = '',
  maxResults = 20,
  allowMultiSelect = false,
  className = ''
}: FDCFoodSearchProps) {
  const {
    isLoading,
    error,
    searchResults,
    searchMeta,
    searchFoodsSimple,
    getFoodDetail,
    clearResults,
    isAvailable
  } = useFDC();

  const [query, setQuery] = useState(initialQuery);
  const [selectedFoods, setSelectedFoods] = useState<Set<number>>(new Set());
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    dataType: ['Foundation', 'Branded'],
    sortBy: 'lowercaseDescription.keyword',
    sortOrder: 'asc'
  });

  // Check service availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await isAvailable();
      setServiceAvailable(available);
    };
    checkAvailability();
  }, [isAvailable]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    try {
      await searchFoodsSimple(query.trim(), {
        pageSize: maxResults,
        pageNumber: 0,
        dataType: filters.dataType,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [query, maxResults, filters, searchFoodsSimple]);

  const handleFoodSelect = useCallback(async (food: FDCEnhancedFoodItem) => {
    if (!onFoodSelect) return;

    try {
      // Get detailed food information and convert to FoodItem
      const detail = await getFoodDetail(food.fdcId, 'abridged');
      onFoodSelect(detail.foodItem);

      // Handle multi-select
      if (allowMultiSelect) {
        setSelectedFoods(prev => {
          const newSet = new Set(prev);
          if (newSet.has(food.fdcId)) {
            newSet.delete(food.fdcId);
          } else {
            newSet.add(food.fdcId);
          }
          return newSet;
        });
      } else {
        setSelectedFoods(new Set([food.fdcId]));
      }
    } catch (error) {
      console.error('Error selecting food:', error);
    }
  }, [onFoodSelect, getFoodDetail, allowMultiSelect]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSelectedFoods(new Set());
    clearResults();
  }, [clearResults]);

  // Service unavailable state
  if (serviceAvailable === false) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center mb-2">
          <div className="w-5 h-5 bg-yellow-400 rounded-full mr-2"></div>
          <h3 className="text-sm font-medium text-yellow-800">FDC Search Unavailable</h3>
        </div>
        <p className="text-sm text-yellow-700">
          The USDA FoodData Central service is currently unavailable. You can still add foods manually.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full mr-2"></div>
          <h3 className="text-sm font-medium text-blue-800">Search USDA Food Database</h3>
        </div>
        <p className="text-sm text-blue-700">
          Search from 300,000+ foods with automatic color categorization and nutritional information.
        </p>
      </div>

      {/* Search Input */}
      <div className="flex flex-col space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for foods (e.g., 'chicken breast', 'quinoa', 'blueberries')"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          {(searchResults.length > 0 || query) && (
            <Button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Search Filters */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <label className="text-gray-600">Data Type:</label>
            <select
              value={filters.dataType.join(',')}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dataType: e.target.value.split(',').filter(Boolean)
              }))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="Foundation,Branded">Foundation & Branded</option>
              <option value="Foundation">Foundation Only</option>
              <option value="Branded">Branded Only</option>
              <option value="Survey">Survey Foods</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-gray-600">Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="lowercaseDescription.keyword">Name</option>
              <option value="dataType.keyword">Type</option>
              <option value="publishedDate">Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Search Meta Information */}
      {searchMeta && (
        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <p>
            Found {searchMeta.resultsCount} results for "{searchMeta.query}"
            {searchMeta.resultsCount >= maxResults && ` (showing first ${maxResults})`}
          </p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Search Results</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((food) => (
              <FDCFoodCard
                key={food.fdcId}
                food={food}
                isSelected={selectedFoods.has(food.fdcId)}
                onSelect={() => handleFoodSelect(food)}
                onViewDetail={() => onFoodDetail?.(food.fdcId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Selected Foods Summary */}
      {selectedFoods.size > 0 && allowMultiSelect && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            {selectedFoods.size} food{selectedFoods.size !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Food Card Component
 */
interface FDCFoodCardProps {
  food: FDCEnhancedFoodItem;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetail?: () => void;
}

function FDCFoodCard({ food, isSelected, onSelect, onViewDetail }: FDCFoodCardProps) {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <FoodColorBadge category={food.category || 'yellow'} size="sm">
              {food.category || 'yellow'}
            </FoodColorBadge>
            <h5 className="font-medium text-gray-900 truncate">
              {food.description}
            </h5>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {food.dataType}
            </span>
            <span>FDC ID: {food.fdcId}</span>
            {food.brandOwner && (
              <span className="bg-blue-100 px-2 py-1 rounded">
                {food.brandOwner}
              </span>
            )}
          </div>

          {food.portionGuidelines && (
            <p className="text-xs text-gray-600 mt-1">
              {food.portionGuidelines}
            </p>
          )}
        </div>

        {onViewDetail && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail();
            }}
            className="ml-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Details
          </Button>
        )}
      </div>
    </div>
  );
}
