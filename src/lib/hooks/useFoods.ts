import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { foodService } from '@/lib/firebase/foods';
import { standardFoods } from '@/lib/data/standardFoods';
import { useAuth } from './useAuth';
import type { FoodItem, CreateFoodData } from '@/lib/types';

export function useFoods() {
  const { user } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load foods for the current coach
  const loadFoods = async () => {
    if (!user) {
      setFoods([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Start with USDA-verified standard foods
      const usdaStandardFoods: FoodItem[] = standardFoods.map((food, index) => ({
        ...food,
        id: `usda-${index}`, // Generate consistent IDs for standard USDA foods
        coachId: 'global', // Mark as global standard foods
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      }));
      
      // Load additional foods added by coaches (FDC and manual fallback)
      const additionalFoods = await foodService.getFoodsForCoach(user.uid);
      const verifiedFoods = additionalFoods; // Include both FDC and manual foods
      
      // Combine standard and additional foods (FDC + manual)
      const allFoods = [...usdaStandardFoods, ...verifiedFoods];
      
      // Remove duplicates based on fdcId (prefer user-added over standard)
      const uniqueFoods = new Map<string, FoodItem>();
      
      // Add standard foods first
      usdaStandardFoods.forEach(food => {
        const key = food.fdcId?.toString() || food.id;
        uniqueFoods.set(key, food);
      });
      
      // Override with user-added foods (they take precedence)
      verifiedFoods.forEach((food: FoodItem) => {
        const key = food.fdcId?.toString() || food.id;
        uniqueFoods.set(key, food);
      });
      
      const finalFoods = Array.from(uniqueFoods.values());
      
      // Sort by name for consistent display
      finalFoods.sort((a, b) => a.name.localeCompare(b.name));
      
      setFoods(finalFoods);
    } catch (err) {
      console.error('Error loading foods:', err);
      setError(err instanceof Error ? err.message : 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  // Create a new food - ENABLED for FDC API foods and manual fallback
  const createFood = async (foodData: CreateFoodData): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      
      // Prefer FDC foods but allow manual as fallback
      if ('fdcId' in foodData && foodData.fdcId) {
        console.log('Creating USDA-verified food:', foodData.name);
      } else {
        console.log('Creating manual food (fallback):', foodData.name);
        // Add source flag for manual foods
        foodData.source = 'manual';
      }
      
      const foodId = await foodService.createFood(user.uid, foodData);
      
      // Reload foods to include the new food
      await loadFoods();
      
      return foodId;
    } catch (err) {
      console.error('Error creating food:', err);
      setError(err instanceof Error ? err.message : 'Failed to create food');
      return null;
    }
  };

  // Update an existing food - DISABLED for USDA-only system
  const updateFood = async (foodId: string, updates: Partial<CreateFoodData>): Promise<boolean> => {
    console.warn('Food editing disabled - using USDA-verified foods only');
    setError('Food editing is disabled. Using USDA-verified foods only.');
    return false;
  };

  // Delete a food - DISABLED for USDA-only system
  const deleteFood = async (foodId: string): Promise<boolean> => {
    console.warn('Food deletion disabled - using USDA-verified foods only');
    setError('Food deletion is disabled. Using USDA-verified foods only.');
    return false;
  };

  // Search foods - Search within USDA foods only
  const searchFoods = async (searchTerm: string): Promise<FoodItem[]> => {
    if (!searchTerm.trim()) return foods;
    
    const filteredFoods = foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filteredFoods;
  };

  // Get foods by category - Filter USDA foods by category
  const getFoodsByCategory = async (category: 'blue' | 'yellow' | 'red'): Promise<FoodItem[]> => {
    const filteredFoods = foods.filter(food => food.category === category);
    return filteredFoods;
  };

  // Load foods when user changes
  useEffect(() => {
    loadFoods();
  }, [user]);

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

// Hook for getting specific foods by IDs - works with USDA foods
export function useFoodsByIds(foodIds: string[]) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Match foods from USDA standard foods by ID
        const usdaFoodsWithIds: FoodItem[] = standardFoods.map((food, index) => ({
          ...food,
          id: `usda-${index}`,
          coachId: 'global',
          createdAt: Timestamp.now(),
          lastUpdated: Timestamp.now()
        }));
        
        const matchedFoods = usdaFoodsWithIds.filter(food => foodIds.includes(food.id));
        setFoods(matchedFoods);
      } catch (err) {
        console.error('Error fetching USDA foods by IDs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch foods');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [foodIds.join(',')]); // Re-run when food IDs change

  return { foods, loading, error };
}
