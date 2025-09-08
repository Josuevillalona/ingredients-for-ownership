import { Timestamp } from 'firebase/firestore';

/**
 * Core ingredient document representing a coach's recommendation for a specific client
 * Replaces the previous Client + Plan structure with a simplified direct approach
 */
export interface IngredientDocument {
  id: string;
  clientName: string;
  coachId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  shareToken: string;
  ingredients: IngredientSelection[];
  status: 'draft' | 'published';
}

/**
 * Individual ingredient selection within a document
 * Maps to specific foods in the global food database
 */
export interface IngredientSelection {
  foodId: string;
  categoryId: string;
  colorCode: 'blue' | 'yellow' | 'red' | null;
  isSelected: boolean;
  clientChecked?: boolean; // Track client progress/completion
  notes?: string; // Coach notes for this specific ingredient
}

/**
 * Food category grouping for the ingredient selection interface
 * Replaces previous food management with predefined database
 */
export interface FoodCategory {
  id: string;
  name: string;
  order: number;
  description?: string;
  foods: Food[];
}

/**
 * Individual food item in the global database
 * Simplified from previous FoodItem to focus on ingredient recommendations
 */
export interface Food {
  id: string;
  name: string;
  categoryId: string;
  notes?: string; // General notes about the food
  servingSize?: string; // Recommended serving size
  nutritionalHighlights?: string[]; // Key nutritional benefits
  warnings?: string[]; // Any allergens or considerations
  fdcId?: number; // FoodData Central ID for detailed nutritional information
}

/**
 * Data required to create a new ingredient document
 */
export interface CreateIngredientDocumentData {
  clientName: string;
  coachId: string;
  ingredients?: IngredientSelection[];
  status?: 'draft' | 'published';
}

/**
 * Data for updating an existing ingredient document
 */
export interface UpdateIngredientDocumentData {
  clientName?: string;
  ingredients?: IngredientSelection[];
  status?: 'draft' | 'published';
}

/**
 * Client tracking update for ingredient completion
 * Used when clients check off ingredients they've obtained/completed
 */
export interface ClientTrackingUpdate {
  foodId: string;
  clientChecked: boolean;
}

/**
 * Type guards for runtime validation
 */
export function isValidIngredientDocument(data: any): data is IngredientDocument {
  const isValid = (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.clientName === 'string' &&
    typeof data.coachId === 'string' &&
    (data.createdAt instanceof Timestamp || data.createdAt != null) && // Allow server timestamps
    (data.updatedAt instanceof Timestamp || data.updatedAt != null) && // Allow server timestamps
    typeof data.shareToken === 'string' &&
    Array.isArray(data.ingredients) &&
    ['draft', 'published'].includes(data.status)
  );
  
  if (!isValid) {
    console.log('Invalid IngredientDocument:', {
      hasId: typeof data.id === 'string',
      hasClientName: typeof data.clientName === 'string',
      hasCoachId: typeof data.coachId === 'string',
      hasCreatedAt: data.createdAt instanceof Timestamp || data.createdAt != null,
      hasUpdatedAt: data.updatedAt instanceof Timestamp || data.updatedAt != null,
      hasShareToken: typeof data.shareToken === 'string',
      hasIngredients: Array.isArray(data.ingredients),
      hasValidStatus: ['draft', 'published'].includes(data.status),
      actualData: data
    });
  }
  
  return isValid;
}

export function isValidIngredientSelection(data: any): data is IngredientSelection {
  return (
    typeof data === 'object' &&
    typeof data.foodId === 'string' &&
    typeof data.categoryId === 'string' &&
    (data.colorCode === null || ['blue', 'yellow', 'red'].includes(data.colorCode)) &&
    typeof data.isSelected === 'boolean'
  );
}

export function isValidFoodCategory(data: any): data is FoodCategory {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.order === 'number' &&
    Array.isArray(data.foods)
  );
}

export function isValidFood(data: any): data is Food {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.categoryId === 'string'
  );
}
