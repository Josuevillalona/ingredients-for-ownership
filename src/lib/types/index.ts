import { Timestamp } from 'firebase/firestore';

// New Ingredient Document System - Layer 1 Implementation
export * from './ingredient-document';

// Core Business Data Models
export interface Coach {
  id: string;
  email: string;
  name: string;
  createdAt: Timestamp;
  preferences: {
    defaultPlanTemplate?: string;
    colorCodingStyle: 'standard' | 'custom';
  };
}

/**
 * @deprecated Legacy client model - being replaced by IngredientDocument.clientName
 * Will be removed in future version after migration is complete
 */
export interface Client {
  id: string;
  coachId: string;
  name: string;
  email?: string;
  sessionNotes: string;
  goals: string[];
  restrictions: string[];
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

/**
 * @deprecated Legacy food item model - being replaced by Food interface
 * Will be removed in future version after migration to global food database
 */
export interface FoodItem {
  id: string;
  coachId: string; // Foods can be coach-specific or global
  name: string;
  category: 'blue' | 'yellow' | 'red';
  description?: string;
  servingSize?: string;
  portionGuidelines?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  fdcId?: number; // FoodData Central ID for external foods
  isGlobal: boolean; // Global foods available to all coaches
  isStandard?: boolean; // USDA standard foods from migration
  source?: string; // Source of the food (e.g., 'standard', 'custom', 'search')
  tags: string[]; // For easy searching/filtering
  originalName?: string; // Original name before migration
  migrationDate?: string; // When the food was migrated from local to USDA
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

export interface CreateFoodData {
  name: string;
  category: 'blue' | 'yellow' | 'red';
  description?: string;
  servingSize?: string;
  portionGuidelines?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  fdcId?: number; // FoodData Central ID for USDA foods
  source?: string; // Source of the food (e.g., 'fdc-api', 'custom')
  tags: string[];
}

/**
 * @deprecated Legacy plan food item - being replaced by IngredientSelection
 * Will be removed in future version after migration is complete
 */
export interface PlanFoodItem {
  foodId: string;
  foodName: string;
  category: 'blue' | 'yellow' | 'red';
  servingSize?: string;
  notes?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

/**
 * @deprecated Legacy plan model - being replaced by IngredientDocument
 * Will be removed in future version after migration is complete
 */
export interface Plan {
  id: string;
  clientId: string;
  coachId: string;
  title: string;
  description?: string;
  foods: PlanFoodItem[];
  shareToken: string;
  isActive: boolean;
  createdAt: Timestamp;
  lastModified: Timestamp;
}

// Form Data Types
/**
 * @deprecated Legacy plan creation - being replaced by CreateIngredientDocumentData
 * Will be removed in future version after migration is complete
 */
export interface CreatePlanData {
  clientId: string;
  title: string;
  description?: string;
  foods: PlanFoodItem[];
}

export interface CreateClientData {
  name: string;
  email?: string;
  sessionNotes?: string;
  goals: string[];
  restrictions: string[];
}

// UI State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

// Food Categories for the color-coding system
export const FOOD_CATEGORIES = {
  blue: {
    name: 'Blue Foods',
    description: 'Nutrient-dense, unlimited consumption',
    color: 'bg-food-blue-100 text-food-blue-800 border-food-blue-200',
    examples: [
      'Spinach', 'Kale', 'Broccoli', 'Cauliflower', 'Bell Peppers',
      'Lean proteins (chicken breast, fish)', 'Egg whites'
    ]
  },
  yellow: {
    name: 'Yellow Foods', 
    description: 'Moderate portions, balanced intake',
    color: 'bg-food-yellow-100 text-food-yellow-800 border-food-yellow-200',
    examples: [
      'Brown rice', 'Quinoa', 'Sweet potatoes', 'Whole grain bread',
      'Avocado', 'Nuts', 'Seeds', 'Olive oil'
    ]
  },
  red: {
    name: 'Red Foods',
    description: 'Limited portions, occasional consumption', 
    color: 'bg-food-red-100 text-food-red-800 border-food-red-200',
    examples: [
      'Processed foods', 'Sugary snacks', 'Fried foods',
      'White bread', 'Candy', 'Soda', 'Fast food'
    ]
  }
} as const;

export type FoodCategory = keyof typeof FOOD_CATEGORIES;
