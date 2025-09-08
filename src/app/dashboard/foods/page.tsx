'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { FoodCard } from '@/components/food/FoodCard';
import { AddFoodForm } from '@/components/food/AddFoodForm';
import { AddFDCFoodForm } from '@/components/food/AddFDCFoodForm';
import { useFoods } from '@/lib/hooks/useFoods';
import { useAuth } from '@/lib/hooks/useAuth';
import { FOOD_CATEGORIES } from '@/lib/types';
import type { FoodItem, CreateFoodData } from '@/lib/types';

type ViewMode = 'list' | 'add' | 'add-fdc' | 'edit';

export default function FoodsPage() {
  const { user } = useAuth();
  const { foods, loading, error, createFood, updateFood, deleteFood, searchFoods, loadFoods } = useFoods();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'blue' | 'yellow' | 'red'>('all');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Filter foods based on search term and category
  const filterFoods = async () => {
    let result = foods;

    // Apply search filter
    if (searchTerm.trim()) {
      result = await searchFoods(searchTerm);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(food => food.category === selectedCategory);
    }

    setFilteredFoods(result);
  };

  // Update filtered foods whenever foods, search term, or category changes
  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, selectedCategory]);

  const handleAddFood = async (data: CreateFoodData) => {
    setIsFormLoading(true);
    try {
      const success = await createFood(data);
      if (success) {
        setViewMode('list');
      }
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditFood = async (data: CreateFoodData) => {
    if (!editingFood) return;
    
    setIsFormLoading(true);
    try {
      const success = await updateFood(editingFood.id, data);
      if (success) {
        setViewMode('list');
        setEditingFood(null);
      }
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteFood = async (food: FoodItem) => {
    if (confirm(`Are you sure you want to delete "${food.name}"?`)) {
      await deleteFood(food.id);
    }
  };

  const startEdit = (food: FoodItem) => {
    setEditingFood(food);
    setViewMode('edit');
  };

  const cancelForm = () => {
    setViewMode('list');
    setEditingFood(null);
  };

  const renderContent = () => {
    if (viewMode === 'add') {
      return (
        <AddFoodForm
          onSubmit={handleAddFood}
          onCancel={cancelForm}
          isLoading={isFormLoading}
        />
      );
    }

    if (viewMode === 'add-fdc') {
      return (
        <AddFDCFoodForm
          onSuccess={(foodId) => {
            console.log('Successfully added FDC food:', foodId);
            setViewMode('list');
            loadFoods(); // Refresh the food list
          }}
          onCancel={cancelForm}
          onManualAdd={() => {
            setViewMode('add'); // Switch to manual add form
          }}
        />
      );
    }

    if (viewMode === 'edit' && editingFood) {
      return (
        <AddFoodForm
          onSubmit={handleEditFood}
          onCancel={cancelForm}
          initialData={editingFood}
          isLoading={isFormLoading}
        />
      );
    }

    return (
      <>
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search foods by name, description, or tags..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {Object.entries(FOOD_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as 'blue' | 'yellow' | 'red')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedCategory === key
                      ? 'bg-brand-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mx-auto mb-4"></div>
              <p className="text-gray-600">Loading foods...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Foods Grid */}
        {!loading && !error && (
          <>
            {filteredFoods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    onEdit={startEdit}
                    onDelete={handleDeleteFood}
                    showActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== 'all' ? 'No foods found' : 'No foods yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters.'
                    : 'Start building your food database by adding your first food item.'
                  }
                </p>            {(!searchTerm && selectedCategory === 'all') && (
              <Button onClick={() => setViewMode('add-fdc')}>
                Add Your First Food
              </Button>
            )}
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {!loading && !error && foods.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{foods.length}</div>
                <div className="text-sm text-gray-600">Total Foods</div>
              </div>
              {Object.entries(FOOD_CATEGORIES).map(([key, category]) => {
                const count = foods.filter(food => food.category === key).length;
                return (
                  <div key={key}>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{category.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-white font-prompt font-bold text-lg">🥗</span>
              </div>
              <div>
                <h1 className="text-brand-white font-prompt font-bold text-2xl">
                  Food Database
                </h1>
                <p className="text-brand-white/80 text-sm">
                  {viewMode === 'add' ? 'Add Food Manually' : 
                   viewMode === 'add-fdc' ? 'Add New Food' :
                   viewMode === 'edit' ? 'Edit Food' : 'Manage your food items'}
                </p>
              </div>
            </div>
            
            {viewMode === 'list' && (
              <Button variant="primary" onClick={() => setViewMode('add-fdc')}>
                Add New Food
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
