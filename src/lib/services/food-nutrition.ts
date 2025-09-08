import { Food } from '@/lib/types/ingredient-document';

/**
 * Service for fetching nutritional information for foods with FDC IDs
 * Uses Next.js API route to keep FDC API key secure
 */
export class FoodNutritionService {
  private nutritionCache: Map<number, any> = new Map();

  constructor() {
    // No direct FDC service needed - we use our API route
  }

  /**
   * Check if nutritional data is available for a food item
   */
  hasNutritionalData(food: Food): boolean {
    const result = Boolean(food.fdcId);
    console.log('🔍 hasNutritionalData:', food.name, 'FDC ID:', food.fdcId, 'Result:', result);
    return result;
  }

  /**
   * Get nutritional information for a food item
   * Returns cached data if available, otherwise fetches from our API route
   */
  async getNutritionalInfo(food: Food): Promise<NutritionalInfo | null> {
    console.log('📊 getNutritionalInfo called for:', food.name, 'FDC ID:', food.fdcId);
    
    if (!food.fdcId) {
      console.log('❌ No FDC ID available');
      return null;
    }

    // Check cache first
    const cached = this.nutritionCache.get(food.fdcId);
    if (cached) {
      console.log('💾 Returning cached data for:', food.name);
      return cached;
    }

    console.log('🌐 Fetching from API route for:', food.name, 'FDC ID:', food.fdcId);

    try {
      // Fetch from our Next.js API route
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fdcIds: [food.fdcId],
          format: 'abridged',
          nutrients: [
            208, // Energy (calories)
            203, // Protein
            204, // Total lipid (fat)
            205, // Carbohydrate, by difference
            291, // Fiber, total dietary
            269, // Sugars, total including NLEA
            307, // Sodium
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API response error: ${response.status} ${response.statusText}`);
      }

      const fdcFoods = await response.json();
      console.log('📊 API response:', fdcFoods);

      if (!Array.isArray(fdcFoods) || fdcFoods.length === 0) {
        console.log('❌ No foods returned from API');
        return null;
      }

      const fdcFood = fdcFoods[0];
      const nutritionalInfo = this.processFDCNutrition(fdcFood);
      
      console.log('✅ Processed nutrition data:', nutritionalInfo);
      
      // Cache the result
      this.nutritionCache.set(food.fdcId, nutritionalInfo);
      
      return nutritionalInfo;

    } catch (error) {
      console.error(`❌ Failed to fetch nutrition for food ${food.name}:`, error);
      return null;
    }
  }

  /**
   * Process FDC nutrition data into our simplified format
   */
  private processFDCNutrition(fdcFood: any): NutritionalInfo {
    const nutrients = fdcFood.foodNutrients || [];
    
    const getNutrient = (nutrientNumber: string) => {
      const nutrient = nutrients.find((n: any) => n.number === nutrientNumber);
      return nutrient?.amount || 0;
    };

    return {
      calories: Math.round(getNutrient('208')),
      protein: Math.round(getNutrient('203') * 10) / 10,
      fat: Math.round(getNutrient('204') * 10) / 10,
      carbs: Math.round(getNutrient('205') * 10) / 10,
      fiber: Math.round(getNutrient('291') * 10) / 10,
      sugar: Math.round(getNutrient('269') * 10) / 10,
      sodium: Math.round(getNutrient('307')),
      servingInfo: `Per 100g`, // FDC data is typically per 100g
      source: 'USDA FoodData Central'
    };
  }

  /**
   * Clear the nutrition cache (useful for testing)
   */
  clearCache(): void {
    this.nutritionCache.clear();
  }
}

/**
 * Simplified nutritional information for display
 */
export interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  fat: number; // grams
  carbs: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // milligrams
  servingInfo: string;
  source: string;
}

// Export singleton instance
export const foodNutritionService = new FoodNutritionService();
