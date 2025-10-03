import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { FoodItem, CreateFoodData } from '@/lib/types';
import { huggingFaceCategorization } from '@/lib/services/huggingface-categorization';

export class FoodService {
  private collectionName = 'foods';

  /**
   * Create a new global food item - available to all coaches
   */
  async createFood(coachId: string, foodData: CreateFoodData, coachName?: string): Promise<string> {
    const foodRef = doc(collection(db, this.collectionName));
    
    // Ensure all required fields are present and have correct types
    // Only include optional fields if they have values (Firestore doesn't allow undefined)
    const foodItem: Omit<FoodItem, 'id'> = {
      name: foodData.name || '',
      source: foodData.source || 'manual',
      tags: Array.isArray(foodData.tags) ? foodData.tags : [],
      addedBy: coachId,
      isGlobal: true, // All foods are global in the new system
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    // Only add optional fields if they have actual values
    if (foodData.description) {
      foodItem.description = foodData.description;
    }
    if (foodData.servingSize) {
      foodItem.servingSize = foodData.servingSize;
    }
    if (foodData.portionGuidelines) {
      foodItem.portionGuidelines = foodData.portionGuidelines;
    }
    if (foodData.nutritionalInfo) {
      foodItem.nutritionalInfo = foodData.nutritionalInfo;
    }
    if (foodData.fdcId) {
      foodItem.fdcId = foodData.fdcId;
    }
    if (coachName) {
      foodItem.addedByName = coachName;
    }

    // Add categorization if provided in foodData, otherwise auto-categorize
    if (foodData.category) {
      // Use provided category information
      foodItem.category = foodData.category;
      if (foodData.categoryConfidence) {
        foodItem.categoryConfidence = foodData.categoryConfidence;
      }
      if (foodData.categoryMethod) {
        foodItem.categoryMethod = foodData.categoryMethod;
      }
      // Always set categorizedAt to now when using provided category
      foodItem.categorizedAt = Timestamp.now();
    } else {
      // Auto-categorize the food
      try {
        const categoryResult = await huggingFaceCategorization.categorizeFood({
          id: foodRef.id,
          name: foodItem.name,
          description: foodItem.description,
          tags: foodItem.tags,
          source: foodItem.source,
          addedBy: foodItem.addedBy,
          isGlobal: foodItem.isGlobal,
          createdAt: foodItem.createdAt,
          lastUpdated: foodItem.lastUpdated
        });

        foodItem.category = categoryResult.category;
        foodItem.categoryConfidence = categoryResult.confidence;
        foodItem.categoryMethod = categoryResult.method;
        foodItem.categorizedAt = Timestamp.now();
      } catch (error) {
        console.warn('Failed to categorize food during creation:', error);
        // Continue without categorization - it can be added later
      }
    }

    try {
      await setDoc(foodRef, foodItem);
      return foodRef.id;
    } catch (error) {
      console.error('Error saving food to Firestore:', error);
      throw error;
    }
  }

  /**
   * Get all global foods (available to all coaches)
   */
  async getGlobalFoods(): Promise<FoodItem[]> {
    try {
      // Get all global foods ordered by name
      const globalFoodsQuery = query(
        collection(db, this.collectionName),
        where('isGlobal', '==', true),
        orderBy('name')
      );
      
      const snapshot = await getDocs(globalFoodsQuery);
      const foods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FoodItem[];

      return foods;
    } catch (error) {
      console.error('Error fetching global foods:', error);
      return [];
    }
  }

  /**
   * @deprecated Legacy method - replaced by getGlobalFoods()
   */
  async getFoodsForCoach(coachId: string): Promise<FoodItem[]> {
    console.warn('getFoodsForCoach is deprecated, use getGlobalFoods() instead');
    return this.getGlobalFoods();
  }

  /**
   * Get only custom (non-standard) foods for a coach
   * @deprecated Application now uses only USDA-verified foods
   */
  async getCustomFoodsForCoach(coachId: string): Promise<FoodItem[]> {
    console.warn('⚠️ getCustomFoodsForCoach is deprecated - application uses only USDA foods');
    return []; // Return empty array since we don't use custom foods
  }

  /**
   * Search foods by name or tags
   */
  async searchFoods(searchTerm: string): Promise<FoodItem[]> {
    try {
      const allFoods = await this.getGlobalFoods();
      const term = searchTerm.toLowerCase().trim();

      if (!term) return allFoods;

      return allFoods.filter(food => 
        food.name.toLowerCase().includes(term) ||
        food.tags.some(tag => tag.includes(term)) ||
        (food.description && food.description.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching foods:', error);
      throw new Error('Failed to search foods');
    }
  }

  /**
   * @deprecated Category filtering removed - foods no longer have pre-assigned categories
   */
  async getFoodsByCategory(coachId: string, category: 'blue' | 'yellow' | 'red'): Promise<FoodItem[]> {
    console.warn('getFoodsByCategory is deprecated - foods no longer have pre-assigned categories');
    return [];
  }

  /**
   * Get a specific food by ID
   */
  async getFood(foodId: string): Promise<FoodItem | null> {
    try {
      const foodDoc = await getDoc(doc(db, this.collectionName, foodId));
      
      if (!foodDoc.exists()) {
        return null;
      }

      return { id: foodDoc.id, ...foodDoc.data() } as FoodItem;
    } catch (error) {
      console.error('Error fetching food:', error);
      throw new Error('Failed to fetch food');
    }
  }

  /**
   * Update a food item (only if added by the current coach or admin privileges)
   */
  async updateFood(foodId: string, coachId: string, updates: Partial<CreateFoodData>): Promise<void> {
    try {
      const food = await this.getFood(foodId);
      
      if (!food) {
        throw new Error('Food not found');
      }

      // Check if coach added this food
      if (food.addedBy !== coachId) {
        throw new Error('Cannot edit food added by another coach');
      }

      const updateData: Partial<FoodItem> = {
        ...updates,
        lastUpdated: Timestamp.now()
      };

      // Clean up tags if provided
      if (updates.tags) {
        updateData.tags = updates.tags.map(tag => tag.toLowerCase().trim());
      }

      await updateDoc(doc(db, this.collectionName, foodId), updateData);
    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  }

  /**
   * Delete a food item (only if added by the current coach)
   */
  async deleteFood(foodId: string, coachId: string): Promise<void> {
    try {
      const food = await this.getFood(foodId);
      
      if (!food) {
        throw new Error('Food not found');
      }

      // Only allow deletion of foods added by the coach
      if (food.addedBy !== coachId) {
        throw new Error('Cannot delete food added by another coach');
      }

      await deleteDoc(doc(db, this.collectionName, foodId));
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  }

  /**
   * Get foods by multiple IDs (useful for plan creation)
   */
  async getFoodsByIds(foodIds: string[]): Promise<FoodItem[]> {
    try {
      if (foodIds.length === 0) return [];

      const foodPromises = foodIds.map(id => this.getFood(id));
      const foods = await Promise.all(foodPromises);
      
      return foods.filter((food): food is FoodItem => food !== null);
    } catch (error) {
      console.error('Error fetching foods by IDs:', error);
      throw new Error('Failed to fetch foods');
    }
  }
}

// Export singleton instance
export const foodService = new FoodService();
