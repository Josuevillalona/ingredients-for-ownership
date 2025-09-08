/**
 * FoodData Central (FDC) API Service
 * Handles integration with USDA FDC API for food data
 */

import { 
  FDCSearchCriteriaInput, 
  FDCSearchResult, 
  FDCSearchResultFood,
  FDCEnhancedFoodItem,
  FDCFoodsRequest
} from '@/lib/validations/fdc';
import { 
  FDCAbridgedFoodItem,
  FDCBrandedFoodItem,
  FDCFoundationFoodItem
} from '@/lib/types/fdc';
import { FoodItem } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

export class FDCService {
  private readonly baseUrl = 'https://api.nal.usda.gov/fdc';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.FDC_API_KEY || '';
    if (!this.apiKey) {
      console.warn('FDC_API_KEY not found. FDC integration will be disabled.');
    }
  }

  /**
   * Check if FDC API is available
   */
  isAvailable(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Search foods using FDC API
   */
  async searchFoods(criteria: FDCSearchCriteriaInput): Promise<FDCSearchResult> {
    if (!this.isAvailable()) {
      throw new Error('FDC API is not configured');
    }

    try {
      const searchParams = new URLSearchParams({
        api_key: this.apiKey,
        query: criteria.query,
        pageSize: criteria.pageSize?.toString() || '50',
        pageNumber: criteria.pageNumber?.toString() || '0'
      });

      // Add optional parameters
      if (criteria.dataType?.length) {
        criteria.dataType.forEach(type => {
          searchParams.append('dataType', type);
        });
      }

      if (criteria.sortBy) {
        searchParams.set('sortBy', criteria.sortBy);
      }

      if (criteria.sortOrder) {
        searchParams.set('sortOrder', criteria.sortOrder);
      }

      if (criteria.brandOwner) {
        searchParams.set('brandOwner', criteria.brandOwner);
      }

      const response = await fetch(`${this.baseUrl}/v1/foods/search?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.validateSearchResult(data);

    } catch (error) {
      console.error('Error searching FDC foods:', error);
      throw new Error('Failed to search foods in FDC database');
    }
  }

  /**
   * Get detailed food information by FDC IDs
   */
  async getFoods(request: FDCFoodsRequest): Promise<(FDCAbridgedFoodItem | FDCBrandedFoodItem | FDCFoundationFoodItem)[]> {
    if (!this.isAvailable()) {
      throw new Error('FDC API is not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/foods?api_key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fdcIds: request.fdcIds,
          format: request.format || 'abridged',
          nutrients: request.nutrients
        }),
      });

      if (!response.ok) {
        throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];

    } catch (error) {
      console.error('Error fetching FDC foods:', error);
      throw new Error('Failed to fetch detailed food information');
    }
  }

  /**
   * Get single food item by FDC ID
   */
  async getFood(fdcId: number, format: 'abridged' | 'full' = 'abridged'): Promise<FDCAbridgedFoodItem | FDCBrandedFoodItem | FDCFoundationFoodItem | null> {
    if (!this.isAvailable()) {
      throw new Error('FDC API is not configured');
    }

    try {
      const searchParams = new URLSearchParams({
        api_key: this.apiKey,
        format
      });

      const response = await fetch(`${this.baseUrl}/v1/food/${fdcId}?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error fetching FDC food:', error);
      throw new Error('Failed to fetch food information');
    }
  }

  /**
   * Enhanced search that includes our color categorization
   */
  async searchFoodsEnhanced(
    criteria: FDCSearchCriteriaInput,
    includeColorAssignment = true
  ): Promise<FDCEnhancedFoodItem[]> {
    const searchResult = await this.searchFoods(criteria);
    
    if (!includeColorAssignment) {
      return searchResult.foods.map(food => ({ ...food }));
    }

    // Add color categorization to results
    return searchResult.foods.map(food => this.enhanceFoodItem(food));
  }

  /**
   * Convert FDC food item to our internal food item format
   */
  async convertToFoodItem(
    fdcFood: FDCSearchResultFood | FDCAbridgedFoodItem | FDCBrandedFoodItem | FDCFoundationFoodItem,
    coachId: string
  ): Promise<Omit<FoodItem, 'id'>> {
    const enhanced = this.enhanceFoodItem(fdcFood);
    const nutritionalInfo = this.extractNutritionalInfo(fdcFood);

    return {
      name: this.cleanFoodName(fdcFood.description),
      category: enhanced.category || 'yellow', // Default to yellow if unsure
      description: this.generateDescription(fdcFood),
      servingSize: this.generateServingSize(fdcFood),
      portionGuidelines: enhanced.portionGuidelines || this.generatePortionGuidelines(enhanced.category || 'yellow'),
      nutritionalInfo,
      fdcId: fdcFood.fdcId,
      isGlobal: false,
      coachId,
      tags: enhanced.tags || this.generateTags(fdcFood),
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };
  }

  /**
   * Validate search result data
   */
  private validateSearchResult(data: any): FDCSearchResult {
    // Basic validation - in production, use Zod schema validation
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid search result format');
    }

    return {
      foodSearchCriteria: data.foodSearchCriteria || {},
      totalHits: data.totalHits || 0,
      currentPage: data.currentPage || 0,
      totalPages: data.totalPages || 0,
      foods: Array.isArray(data.foods) ? data.foods : []
    };
  }

  /**
   * Enhance food item with color categorization and additional metadata
   */
  private enhanceFoodItem(food: FDCSearchResultFood | any): FDCEnhancedFoodItem {
    const category = this.assignColorCategory(food);
    const confidence = this.calculateConfidence(food, category);
    const portionGuidelines = this.generatePortionGuidelines(category);
    const tags = this.generateTags(food);

    return {
      ...food,
      category,
      confidence,
      portionGuidelines,
      tags
    };
  }

  /**
   * Assign color category based on food characteristics
   */
  private assignColorCategory(food: any): 'blue' | 'yellow' | 'red' {
    // Get basic food info
    const description = food.description?.toLowerCase() || '';
    const dataType = food.dataType;
    const brandOwner = food.brandOwner?.toLowerCase() || '';
    const ingredients = food.ingredients?.toLowerCase() || '';

    // Blue Foods (Nutrient-dense, unlimited consumption)
    const blueKeywords = [
      'spinach', 'kale', 'broccoli', 'cauliflower', 'asparagus',
      'salmon', 'tuna', 'cod', 'halibut', 'sardines',
      'chicken breast', 'turkey breast', 'egg whites',
      'bell pepper', 'cucumber', 'zucchini', 'lettuce',
      'herbs', 'spices', 'tea', 'water'
    ];

    // Red Foods (Limited portions, occasional consumption)
    const redKeywords = [
      'candy', 'chocolate', 'cookies', 'cake', 'ice cream',
      'soda', 'chips', 'fries', 'pizza', 'burger',
      'fried', 'processed', 'refined', 'sugar', 'syrup',
      'white bread', 'donut', 'pastry'
    ];

    // Yellow Foods (Moderate portions, balanced intake)
    const yellowKeywords = [
      'rice', 'quinoa', 'oats', 'bread', 'pasta',
      'nuts', 'seeds', 'avocado', 'olive oil',
      'beans', 'lentils', 'chickpeas',
      'sweet potato', 'banana', 'apple'
    ];

    // Check for red foods first (most restrictive)
    if (redKeywords.some(keyword => description.includes(keyword))) {
      return 'red';
    }

    // Check for blue foods (most permissive)
    if (blueKeywords.some(keyword => description.includes(keyword))) {
      return 'blue';
    }

    // Check data type patterns
    if (dataType === 'Foundation' || dataType === 'SR Legacy') {
      // Foundation foods are typically whole foods
      if (description.includes('raw') || description.includes('fresh')) {
        return 'blue';
      }
    }

    if (dataType === 'Branded') {
      // Branded foods are often processed
      if (brandOwner.includes('organic') || ingredients.includes('organic')) {
        return 'yellow';
      }
      return 'red'; // Most branded foods default to red
    }

    // Check for yellow foods
    if (yellowKeywords.some(keyword => description.includes(keyword))) {
      return 'yellow';
    }

    // Default to yellow for unknown foods
    return 'yellow';
  }

  /**
   * Calculate confidence score for color assignment
   */
  private calculateConfidence(food: any, category: 'blue' | 'yellow' | 'red'): number {
    let confidence = 0.5; // Base confidence

    // Higher confidence for Foundation/SR Legacy foods
    if (food.dataType === 'Foundation' || food.dataType === 'SR Legacy') {
      confidence += 0.3;
    }

    // Lower confidence for branded foods without detailed info
    if (food.dataType === 'Branded' && !food.ingredients) {
      confidence -= 0.2;
    }

    // Higher confidence if we have nutritional data
    if (food.foodNutrients?.length > 0) {
      confidence += 0.2;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate portion guidelines based on category
   */
  private generatePortionGuidelines(category: 'blue' | 'yellow' | 'red'): string {
    switch (category) {
      case 'blue':
        return 'Unlimited - use freely as the base of meals and snacks';
      case 'yellow':
        return 'Moderate portions - include as part of balanced meals';
      case 'red':
        return 'Limited portions - occasional treats or special occasions only';
      default:
        return 'Moderate portions - include as part of balanced meals';
    }
  }

  /**
   * Generate tags based on food characteristics
   */
  private generateTags(food: any): string[] {
    const tags: string[] = [];
    const description = food.description?.toLowerCase() || '';

    // Add data type tag
    if (food.dataType) {
      tags.push(food.dataType.toLowerCase().replace(/[^a-z]/g, '-'));
    }

    // Add category tags based on description
    if (description.includes('organic')) tags.push('organic');
    if (description.includes('raw')) tags.push('raw');
    if (description.includes('fresh')) tags.push('fresh');
    if (description.includes('frozen')) tags.push('frozen');
    if (description.includes('canned')) tags.push('canned');
    if (description.includes('dried')) tags.push('dried');

    // Add brand tag if available
    if (food.brandOwner) {
      tags.push('branded');
    }

    return tags.slice(0, 10); // Limit to 10 tags
  }

  /**
   * Clean food name for our system
   */
  private cleanFoodName(description: string): string {
    return description
      .replace(/\b(raw|fresh|frozen|canned|dried)\b/gi, '') // Remove preparation terms
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Generate description for our system
   */
  private generateDescription(food: any): string {
    let description = food.description;
    
    if (food.brandOwner) {
      description += ` (${food.brandOwner})`;
    }

    if (food.dataType === 'Foundation') {
      description += ' - USDA Foundation Food';
    }

    return description;
  }

  /**
   * Generate serving size information
   */
  private generateServingSize(food: any): string {
    if (food.servingSize && food.servingSizeUnit) {
      return `${food.servingSize} ${food.servingSizeUnit}`;
    }

    // Default serving sizes based on food type
    const description = food.description?.toLowerCase() || '';
    
    if (description.includes('vegetable') || description.includes('fruit')) {
      return '1 cup';
    }
    if (description.includes('meat') || description.includes('fish') || description.includes('poultry')) {
      return '4 oz (palm-sized portion)';
    }
    if (description.includes('nuts') || description.includes('seeds')) {
      return '1 oz (small handful)';
    }
    if (description.includes('oil')) {
      return '1 tablespoon';
    }

    return '1 serving';
  }

  /**
   * Extract nutritional information from FDC food item
   */
  private extractNutritionalInfo(food: any) {
    const nutrients = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };

    // Check label nutrients first (branded foods)
    if (food.labelNutrients) {
      nutrients.calories = food.labelNutrients.calories?.value || 0;
      nutrients.protein = food.labelNutrients.protein?.value || 0;
      nutrients.carbs = food.labelNutrients.carbohydrates?.value || 0;
      nutrients.fat = food.labelNutrients.fat?.value || 0;
      nutrients.fiber = food.labelNutrients.fiber?.value || 0;
      return nutrients;
    }

    // Check food nutrients array
    if (food.foodNutrients) {
      for (const nutrient of food.foodNutrients) {
        const name = nutrient.name?.toLowerCase() || '';
        const number = nutrient.number;
        
        // Map common nutrients by number or name
        if (number === 208 || name.includes('energy') || name.includes('calories')) {
          nutrients.calories = nutrient.amount || 0;
        } else if (number === 203 || name.includes('protein')) {
          nutrients.protein = nutrient.amount || 0;
        } else if (number === 205 || name.includes('carbohydrate')) {
          nutrients.carbs = nutrient.amount || 0;
        } else if (number === 204 || name.includes('total lipid') || name.includes('fat')) {
          nutrients.fat = nutrient.amount || 0;
        } else if (number === 291 || name.includes('fiber')) {
          nutrients.fiber = nutrient.amount || 0;
        }
      }
    }

    return nutrients;
  }
}

// Export singleton instance
export const fdcService = new FDCService();
