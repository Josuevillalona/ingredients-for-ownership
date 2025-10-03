'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { FoodCard } from '@/components/food/FoodCard';
import { AddFoodForm } from '@/components/food/AddFoodForm';
import { FDCFoodSearch } from '@/components/food/FDCFoodSearch';
import { useFoods } from '@/lib/hooks/useFoods';
import { useAuth } from '@/lib/hooks/useAuth';
import type { FoodItem, CreateFoodData } from '@/lib/types';

type ViewMode = 'dashboard' | 'add-manual' | 'edit' | 'preview';
type DashboardTab = 'saved' | 'search';

export default function FoodsPage() {
  const { user } = useAuth();
  const { foods, loading, error, createFood, updateFood, deleteFood, searchFoods, loadFoods } = useFoods();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [activeTab, setActiveTab] = useState<DashboardTab>('saved');
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [previewFood, setPreviewFood] = useState<Omit<FoodItem, 'id'> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Filter foods based on search term only
  const filterFoods = async () => {
    let result = foods;

    // Apply search filter
    if (searchTerm.trim()) {
      result = await searchFoods(searchTerm);
    }

    setFilteredFoods(result);
  };

  // Update filtered foods whenever foods or search term changes
  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm]);

  // Handle food preview from FDC search (don't save immediately)
  const handleFoodPreview = (foodItem: Omit<FoodItem, 'id'>) => {
    setPreviewFood(foodItem);
    setViewMode('preview');
  };

  // Switch to saved foods tab when a food is successfully added
  const handleFoodAdded = async (foodItem: Omit<FoodItem, 'id'>) => {
    const createData: CreateFoodData = {
      name: foodItem.name,
      description: foodItem.description,
      servingSize: foodItem.servingSize,
      portionGuidelines: foodItem.portionGuidelines,
      nutritionalInfo: foodItem.nutritionalInfo,
      fdcId: foodItem.fdcId,
      source: foodItem.source || 'fdc-api',
      tags: foodItem.tags || []
    };

    const success = await createFood(createData);
    
    if (success) {
      setActiveTab('saved');
      setViewMode('dashboard');
      setPreviewFood(null);
      loadFoods(); // Refresh the food list
    }
  };

  const handleAddFood = async (data: CreateFoodData) => {
    setIsFormLoading(true);
    try {
      const success = await createFood(data);
      if (success) {
        setViewMode('dashboard');
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
        setViewMode('dashboard');
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
    setViewMode('dashboard');
    setEditingFood(null);
    setPreviewFood(null);
  };

  const renderContent = () => {
    if (viewMode === 'add-manual') {
      return (
        <AddFoodForm
          onSubmit={handleAddFood}
          onCancel={cancelForm}
          isLoading={isFormLoading}
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

    if (viewMode === 'preview' && previewFood) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Preview Food</h2>
            <Button variant="secondary" onClick={cancelForm}>
              Back to Search
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Food Details Card */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{previewFood.name}</h3>
                  {previewFood.description && (
                    <p className="text-gray-600 mt-1">{previewFood.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {previewFood.source?.toUpperCase() || 'MANUAL'}
                    </span>
                    {previewFood.fdcId && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        FDC: {previewFood.fdcId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Serving Information */}
              {(previewFood.servingSize || previewFood.portionGuidelines) && (
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Serving Information</h4>
                  {previewFood.servingSize && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Serving Size:</span> {previewFood.servingSize}
                    </p>
                  )}
                  {previewFood.portionGuidelines && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Portion Guidelines:</span> {previewFood.portionGuidelines}
                    </p>
                  )}
                </div>
              )}

              {/* Nutritional Information */}
              {previewFood.nutritionalInfo && (
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Nutritional Information</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {previewFood.nutritionalInfo.calories || 0}
                      </div>
                      <div className="text-xs text-gray-600">Calories</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-blue-900">
                        {previewFood.nutritionalInfo.protein || 0}g
                      </div>
                      <div className="text-xs text-blue-600">Protein</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-yellow-900">
                        {previewFood.nutritionalInfo.carbs || 0}g
                      </div>
                      <div className="text-xs text-yellow-600">Carbs</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-red-900">
                        {previewFood.nutritionalInfo.fat || 0}g
                      </div>
                      <div className="text-xs text-red-600">Fat</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-lg font-semibold text-green-900">
                        {previewFood.nutritionalInfo.fiber || 0}g
                      </div>
                      <div className="text-xs text-green-600">Fiber</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {previewFood.tags && previewFood.tags.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewFood.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={cancelForm}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleFoodAdded(previewFood)}
                disabled={isFormLoading}
              >
                {isFormLoading ? 'Saving...' : 'Save to Database'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Dashboard view with tabs
    return (
      <>
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'saved'
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>📚</span>
                  <span>Saved Foods ({foods.length})</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'search'
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>🔍</span>
                  <span>Search USDA Database</span>
                </span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'saved' ? (
              <>
                {/* Search Saved Foods */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your saved foods by name, description, or tags..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                  />
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
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">Error: {error}</p>
                  </div>
                )}

                {/* Saved Foods Grid */}
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
                          {searchTerm ? 'No foods found' : 'No foods saved yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {searchTerm 
                            ? 'Try adjusting your search or check the USDA Search tab to find new foods.'
                            : 'Start building your food database by searching the USDA database or adding foods manually.'
                          }
                        </p>
                        <div className="space-x-4">
                          {!searchTerm && (
                            <>
                              <Button onClick={() => setActiveTab('search')}>
                                Search USDA Database
                              </Button>
                              <Button variant="secondary" onClick={() => setViewMode('add-manual')}>
                                Add Manually
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {/* FDC Food Search */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">USDA Food Database</h3>
                      <p className="text-sm text-gray-600">Search and save foods from the official USDA database</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={() => setViewMode('add-manual')}
                      className="whitespace-nowrap"
                    >
                      Add Manually
                    </Button>
                  </div>
                  
                  <FDCFoodSearch
                    onFoodSelect={handleFoodPreview}
                    onFoodQuickSave={handleFoodAdded}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats - show when there are saved foods */}
        {!loading && !error && foods.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{foods.length}</div>
              <div className="text-sm text-gray-600">Total Saved Foods in Global Database</div>
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
                  {viewMode === 'add-manual' ? 'Add Food Manually' : 
                   viewMode === 'edit' ? 'Edit Food' :
                   viewMode === 'preview' ? 'Preview Food Details' : 'Search and save foods from USDA database'}
                </p>
              </div>
            </div>
            
            {viewMode === 'dashboard' && (
              <Button variant="primary" onClick={() => setActiveTab('search')}>
                Search New Foods
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
