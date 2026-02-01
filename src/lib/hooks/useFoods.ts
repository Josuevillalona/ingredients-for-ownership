import { useState, useEffect, useCallback } from 'react';
import { foodService } from '@/lib/firebase/foods';
import { useAuth } from './useAuth';
import type { FoodItem, CreateFoodData } from '@/lib/types';

export function useFoods() {
  const { user } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load global foods available to all coaches - Memoized for useEffect dependency
  const loadFoods = useCallback(async () => {
    if (!user) {
      setFoods([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load all global foods (saved by any coach)
      const globalFoods = await foodService.getGlobalFoods();

      // Sort by name for consistent display
      globalFoods.sort((a, b) => a.name.localeCompare(b.name));

      setFoods(globalFoods);
    } catch (err) {
      console.error('Error loading foods:', err);
      setError(err instanceof Error ? err.message : 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new global food - available to all coaches
  const createFood = async (foodData: CreateFoodData): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);

      // Get coach name if available (you might need to get this from user profile)
      const coachName = user.displayName || user.email || 'Unknown Coach';

      const foodId = await foodService.createFood(user.uid, foodData, coachName);

      // Reload foods to include the new food
      await loadFoods();

      return foodId;
    } catch (err) {
      console.error('Error creating food:', err);
      setError(err instanceof Error ? err.message : 'Failed to create food');
      return null;
    }
  };

  // Update an existing food (only if added by current coach)
  const updateFood = async (foodId: string, updates: Partial<CreateFoodData>): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await foodService.updateFood(foodId, user.uid, updates);

      // Reload foods to reflect the update
      await loadFoods();

      return true;
    } catch (err) {
      console.error('Error updating food:', err);
      setError(err instanceof Error ? err.message : 'Failed to update food');
      return false;
    }
  };

  // Delete a food (only if added by current coach)
  const deleteFood = async (foodId: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await foodService.deleteFood(foodId, user.uid);

      // Reload foods to reflect the deletion
      await loadFoods();

      return true;
    } catch (err) {
      console.error('Error deleting food:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete food');
      return false;
    }
  };

  // Search foods - Search within global foods
  const searchFoods = async (searchTerm: string): Promise<FoodItem[]> => {
    if (!searchTerm.trim()) return foods;

    try {
      return await foodService.searchFoods(searchTerm);
    } catch (err) {
      console.error('Error searching foods:', err);
      setError(err instanceof Error ? err.message : 'Failed to search foods');
      return foods;
    }
  };

  // @deprecated - Foods no longer have pre-assigned categories
  const getFoodsByCategory = async (category: 'blue' | 'yellow' | 'red'): Promise<FoodItem[]> => {
    console.warn('getFoodsByCategory is deprecated - foods no longer have pre-assigned categories');
    return [];
  };

  // Load foods when user changes
  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  return {
    foods,
    loading,
    error,
    loadFoods,
    createFood,
    updateFood,
    deleteFood,
    searchFoods,
    getFoodsByCategory
  };
}

// Hook for getting specific foods by IDs - works with global foods
export function useFoodsByIds(foodIds: string[]) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the foodIds string for the dependency array
  const foodIdsKey = foodIds.join(',');

  useEffect(() => {
    if (foodIds.length === 0) {
      setFoods([]);
      setLoading(false);
      return;
    }

    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get foods from the global food database by IDs
        const matchedFoods = await foodService.getFoodsByIds(foodIds);
        setFoods(matchedFoods);
      } catch (err) {
        console.error('Error fetching foods by IDs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch foods');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [foodIds, foodIdsKey]); // Use memoized key

  return { foods, loading, error };
}
