'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FoodItemData, CategoryData, FoodStatus } from './types';
import { SearchBar } from './SearchBar';
import { CategoryNavigation } from './CategoryNavigation';
import { CategorySection } from './CategorySection';

interface FoodSelectionGuideProps {
  foods: FoodItemData[];
  categories: CategoryData[];
  onStatusChange: (foodId: string, status: FoodStatus) => void;
  showActionIcon?: boolean;
}

export function FoodSelectionGuide({ foods, categories, onStatusChange, showActionIcon = true }: FoodSelectionGuideProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  // Filter foods based on search and category
  const filteredFoods = useMemo(() => {
    let filtered = foods;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchLower) ||
        (food.nutritionalHighlights &&
          food.nutritionalHighlights.some(highlight =>
            highlight.toLowerCase().includes(searchLower)
          ))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(food => food.categoryId === selectedCategory);
    }

    return filtered;
  }, [foods, searchTerm, selectedCategory]);

  // Group foods by category for display
  const foodsByCategory = useMemo(() => {
    const grouped = new Map<string, FoodItemData[]>();

    // Initialize all categories
    categories.forEach(category => {
      grouped.set(category.id, []);
    });

    // Group filtered foods
    filteredFoods.forEach(food => {
      const categoryFoods = grouped.get(food.categoryId) || [];
      categoryFoods.push(food);
      grouped.set(food.categoryId, categoryFoods);
    });

    return grouped;
  }, [filteredFoods, categories]);

  // Get sorted categories for display
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search foods by name or nutritional highlights..."
      />

      {/* Category Navigation */}
      <CategoryNavigation
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 text-sm text-brand-dark/60 font-prompt">
          <span>Showing {filteredFoods.length} foods</span>
          {searchTerm && (
            <span>• Search: &quot;{searchTerm}&quot;</span>
          )}
          {selectedCategory && (
            <span>• Category: {categories.find(c => c.id === selectedCategory)?.title}</span>
          )}
        </div>
      </div>

      {/* Food Categories */}
      <div className="space-y-8">
        {sortedCategories.map((category) => {
          const categoryFoods = foodsByCategory.get(category.id) || [];

          return (
            <CategorySection
              key={category.id}
              category={category}
              foods={categoryFoods}
              onStatusChange={onStatusChange}
              showActionIcon={showActionIcon}
            />
          );
        })}
      </div>

      {/* No Results */}
      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-brand-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-prompt font-bold text-xl text-brand-dark mb-2">
            No foods found
          </h3>
          <p className="text-brand-dark/60 font-prompt mb-4">
            Try adjusting your search terms or category filter.
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(undefined);
              }}
              className="bg-brand-gold text-brand-white px-6 py-2 rounded-lg font-prompt font-medium
                         hover:bg-brand-gold/90 transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
