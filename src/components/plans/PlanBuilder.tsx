'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { FoodColorBadge } from '@/components/ui/FoodColorBadge';
import { AddFDCFoodForm } from '@/components/food/AddFDCFoodForm';
import { useFoods } from '@/lib/hooks/useFoods';
import { useClients } from '@/lib/hooks/useClients';
import { foodCategoriesForDisplay } from '@/lib/data/standardFoods';
import type { FoodItem, Client, PlanFoodItem } from '@/lib/types';

interface PlanBuilderProps {
  selectedClientId?: string;
  onPlanCreated?: (planId: string) => void;
}

export function PlanBuilder({ selectedClientId, onPlanCreated }: PlanBuilderProps) {
  const { foods, loading: foodsLoading, loadFoods } = useFoods();
  const { clients, isLoading: clientsLoading } = useClients();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [planTitle, setPlanTitle] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<Record<string, PlanFoodItem>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'blue' | 'yellow' | 'red'>('all');
  const [showAddFood, setShowAddFood] = useState(false);

  // Set initial client if provided
  useEffect(() => {
    if (selectedClientId && clients.length > 0) {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        setSelectedClient(client);
        setPlanTitle(`Nutrition Plan for ${client.name}`);
      }
    }
  }, [selectedClientId, clients]);

  // Filter foods based on search and category
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group foods by category for organized display
  const groupedFoods = {
    blue: filteredFoods.filter(f => f.category === 'blue'),
    yellow: filteredFoods.filter(f => f.category === 'yellow'), 
    red: filteredFoods.filter(f => f.category === 'red')
  };

  const toggleFoodSelection = (food: FoodItem) => {
    const foodKey = food.id;
    
    if (selectedFoods[foodKey]) {
      // Remove from selection
      const newSelection = { ...selectedFoods };
      delete newSelection[foodKey];
      setSelectedFoods(newSelection);
    } else {
      // Add to selection
      const planFoodItem: PlanFoodItem = {
        foodId: food.id,
        foodName: food.name,
        category: food.category,
        servingSize: food.servingSize,
        mealType: 'breakfast', // Default, can be changed later
        notes: ''
      };
      setSelectedFoods(prev => ({
        ...prev,
        [foodKey]: planFoodItem
      }));
    }
  };

  const handleNewFoodAdded = async (foodId: string) => {
    // Refresh foods list to get the newly added food
    await loadFoods();
    
    // Find the newly added food and automatically add it to the plan
    setTimeout(() => {
      const newFood = foods.find(f => f.id === foodId);
      if (newFood) {
        toggleFoodSelection(newFood);
      }
    }, 100); // Small delay to ensure foods are loaded
    
    // Close the add food modal
    setShowAddFood(false);
  };

  const handleCreatePlan = async () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    if (Object.keys(selectedFoods).length === 0) {
      alert('Please select at least one food item');
      return;
    }

    // TODO: Implement plan creation service
    console.log('Creating plan:', {
      clientId: selectedClient.id,
      title: planTitle,
      foods: Object.values(selectedFoods)
    });

    if (onPlanCreated) {
      onPlanCreated('new-plan-id'); // Placeholder
    }
  };

  const selectedFoodsCount = Object.keys(selectedFoods).length;

  if (foodsLoading || clientsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Add Food Form
  if (showAddFood) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add Food to Plan</h2>
            <Button
              variant="outline"
              onClick={() => setShowAddFood(false)}
            >
              Back to Plan
            </Button>
          </div>
          
          <AddFDCFoodForm
            onSuccess={handleNewFoodAdded}
            onCancel={() => setShowAddFood(false)}
            onManualAdd={() => {
              // For manual add, we'll still use the same flow but switch to manual form
              // This could be enhanced to show the manual form inline
              console.log('Manual add requested during plan creation');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Nutrition Plan</h2>
        
        {/* Client Selection */}
        {!selectedClientId && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Client
            </label>
            <select
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                setSelectedClient(client || null);
                if (client) {
                  setPlanTitle(`Nutrition Plan for ${client.name}`);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Plan Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Title
          </label>
          <input
            type="text"
            value={planTitle}
            onChange={(e) => setPlanTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            placeholder="Enter plan title..."
          />
        </div>

        {/* Selection Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedFoodsCount} food{selectedFoodsCount !== 1 ? 's' : ''} selected
          </div>
          <Button
            onClick={handleCreatePlan}
            disabled={!selectedClient || !planTitle.trim() || selectedFoodsCount === 0}
          >
            Create Plan ({selectedFoodsCount})
          </Button>
        </div>
      </div>

      {/* Food Selection Interface */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Select Foods for Plan
          </h3>
          
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search foods..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>
            
            {/* Add New Food Button */}
            <Button
              variant="outline"
              onClick={() => setShowAddFood(true)}
              className="whitespace-nowrap"
            >
              + Add New Food
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-brand-gold text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Foods ({filteredFoods.length})
          </button>
          <button
            onClick={() => setActiveCategory('blue')}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'blue'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Blue Foods ({groupedFoods.blue.length})
          </button>
          <button
            onClick={() => setActiveCategory('yellow')}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'yellow'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Yellow Foods ({groupedFoods.yellow.length})
          </button>
          <button
            onClick={() => setActiveCategory('red')}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'red'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Red Foods ({groupedFoods.red.length})
          </button>
        </div>

        {/* Food Grid by Category */}
        <div className="space-y-6">
          {Object.entries(groupedFoods).map(([category, categoryFoods]) => {
            if (activeCategory !== 'all' && activeCategory !== category) return null;
            if (categoryFoods.length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <FoodColorBadge category={category as 'blue' | 'yellow' | 'red'}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} Foods
                  </FoodColorBadge>
                  <span className="text-sm text-gray-500">
                    ({categoryFoods.length} foods)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryFoods.map((food) => {
                    const isSelected = !!selectedFoods[food.id];
                    
                    return (
                      <div
                        key={food.id}
                        onClick={() => toggleFoodSelection(food)}
                        className={`
                          p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${isSelected
                            ? 'border-brand-gold bg-brand-cream shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {food.name}
                          </h4>
                          <div className="ml-2 flex-shrink-0">
                            <div className={`
                              w-5 h-5 rounded border-2 flex items-center justify-center
                              ${isSelected
                                ? 'bg-brand-gold border-brand-gold'
                                : 'border-gray-300'
                              }
                            `}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>

                        {food.servingSize && (
                          <p className="text-xs text-gray-600 mb-1">
                            <span className="font-medium">Serving:</span> {food.servingSize}
                          </p>
                        )}

                        {food.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {food.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredFoods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No foods found matching "${searchTerm}"`
                : 'No foods available'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {searchTerm && (
                <Button 
                  variant="secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              )}
              <Button
                onClick={() => setShowAddFood(true)}
                className="bg-brand-gold hover:bg-brand-gold/90"
              >
                + Add New Food
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Foods Summary */}
      {selectedFoodsCount > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Selected Foods ({selectedFoodsCount})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(selectedFoods).map((planFood) => (
              <div key={planFood.foodId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FoodColorBadge category={planFood.category} size="sm">
                    {planFood.category.charAt(0).toUpperCase()}
                  </FoodColorBadge>
                  <span className="text-sm font-medium">{planFood.foodName}</span>
                </div>
                <button
                  onClick={() => {
                    const newSelection = { ...selectedFoods };
                    delete newSelection[planFood.foodId];
                    setSelectedFoods(newSelection);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
