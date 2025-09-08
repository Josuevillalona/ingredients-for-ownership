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

export class FoodService {
  private collectionName = 'foods';

  /**
   * Create a new food item for a coach - ENABLED for FDC API foods and manual fallback
   */
  async createFood(coachId: string, foodData: CreateFoodData): Promise<string> {
    const foodRef = doc(collection(db, this.collectionName));
    
    const foodItem: Omit<FoodItem, 'id'> = {
      ...foodData,
      coachId,
      isGlobal: false, // Coach-added foods are not global
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now()
    };

    await setDoc(foodRef, foodItem);
    return foodRef.id;
  }

  /**
   * Get all foods available to a coach (FDC foods and manual fallback foods)
   */
  async getFoodsForCoach(coachId: string): Promise<FoodItem[]> {
    try {
      // Get all coach-specific foods (FDC and manual)
      const coachFoodsQuery = query(
        collection(db, this.collectionName),
        where('coachId', '==', coachId),
        orderBy('name')
      );
      
      const coachSnapshot = await getDocs(coachFoodsQuery);
      const coachFoods = coachSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FoodItem[];

      return coachFoods;
    } catch (error) {
      console.error('Error fetching foods for coach:', error);
      return [];
    }
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
  async searchFoods(coachId: string, searchTerm: string): Promise<FoodItem[]> {
    try {
      const allFoods = await this.getFoodsForCoach(coachId);
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
   * Get foods by category
   */
  async getFoodsByCategory(coachId: string, category: 'blue' | 'yellow' | 'red'): Promise<FoodItem[]> {
    try {
      const allFoods = await this.getFoodsForCoach(coachId);
      return allFoods.filter(food => food.category === category);
    } catch (error) {
      console.error('Error fetching foods by category:', error);
      throw new Error('Failed to fetch foods by category');
    }
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
   * Update a food item (only if owned by coach or if editing is allowed)
   */
  async updateFood(foodId: string, coachId: string, updates: Partial<CreateFoodData>): Promise<void> {
    try {
      const food = await this.getFood(foodId);
      
      if (!food) {
        throw new Error('Food not found');
      }

      // Check if coach owns this food or if it's a global food they can edit
      if (food.coachId !== coachId && food.isGlobal) {
        throw new Error('Cannot edit global foods');
      }

      if (food.coachId !== coachId && !food.isGlobal) {
        throw new Error('Cannot edit food belonging to another coach');
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
   * Delete a food item (only if owned by coach)
   */
  async deleteFood(foodId: string, coachId: string): Promise<void> {
    try {
      const food = await this.getFood(foodId);
      
      if (!food) {
        throw new Error('Food not found');
      }

      // Only allow deletion of foods owned by the coach
      if (food.coachId !== coachId) {
        throw new Error('Cannot delete food belonging to another coach');
      }

      if (food.isGlobal) {
        throw new Error('Cannot delete global foods');
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
