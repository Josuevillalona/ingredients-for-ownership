import { HuggingFaceFoodCategorization, type CategoryResult } from './huggingface-categorization';
import type { FoodItem } from '@/lib/types';

export class SmartFoodCategorizationService {
  private huggingFaceService = new HuggingFaceFoodCategorization();

  /**
   * Categorize food using the best available method
   */
  async categorizeFood(food: FoodItem): Promise<CategoryResult> {
    // Try Hugging Face AI first
    const result = await this.huggingFaceService.categorizeFood(food);
    
    // Log categorization for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🤗 Categorized "${food.name}" as "${result.category}" (${result.method}) with ${(result.confidence * 100).toFixed(1)}% confidence`);
    }
    
    return result;
  }

  /**
   * Batch categorize multiple foods
   */
  async categorizeFoods(foods: FoodItem[]): Promise<Map<string, CategoryResult>> {
    const results = new Map<string, CategoryResult>();
    
    console.log(`🤗 Starting AI categorization of ${foods.length} foods...`);
    
    // Process foods with a small delay to avoid rate limiting
    for (let i = 0; i < foods.length; i++) {
      const food = foods[i];
      try {
        const result = await this.categorizeFood(food);
        results.set(food.id, result);
        
        // Progress logging
        if (i % 5 === 0 || i === foods.length - 1) {
          console.log(`🤗 Progress: ${i + 1}/${foods.length} foods categorized`);
        }
        
        // Small delay between requests to be respectful to the API
        if (this.huggingFaceService.isAvailable() && i < foods.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Failed to categorize ${food.name}:`, error);
        // Set fallback result
        results.set(food.id, {
          category: 'other',
          confidence: 0.3,
          method: 'fallback',
          reasoning: 'Categorization failed, using fallback'
        });
      }
    }
    
    console.log(`✅ AI categorization complete! ${results.size} foods processed`);
    return results;
  }

  /**
   * Get categorization statistics
   */
  getCategorizationStats(results: Map<string, CategoryResult>): {
    aiCount: number;
    regexCount: number;
    fallbackCount: number;
    averageConfidence: number;
  } {
    let aiCount = 0;
    let regexCount = 0;
    let fallbackCount = 0;
    let totalConfidence = 0;

    results.forEach((result) => {
      switch (result.method) {
        case 'huggingface-ai':
          aiCount++;
          break;
        case 'regex':
          regexCount++;
          break;
        case 'fallback':
          fallbackCount++;
          break;
      }
      totalConfidence += result.confidence;
    });

    return {
      aiCount,
      regexCount,
      fallbackCount,
      averageConfidence: results.size > 0 ? totalConfidence / results.size : 0
    };
  }
}

// Export singleton instance
export const foodCategorizationService = new SmartFoodCategorizationService();

// Re-export types
export type { CategoryResult } from './huggingface-categorization';