/**
 * FoodData Central (FDC) API types
 * Based on USDA FDC OpenAPI specification
 */

// FDC Data Types
export type FDCDataType = 'Branded' | 'Foundation' | 'Survey (FNDDS)' | 'SR Legacy';

// Base FDC Food Item
export interface FDCFoodItem {
  fdcId: number;
  description: string;
  dataType: FDCDataType;
  publicationDate?: string;
  foodNutrients?: FDCFoodNutrient[];
}

// Abridged FDC Food Item (for search results)
export interface FDCAbridgedFoodItem extends FDCFoodItem {
  brandOwner?: string;
  gtinUpc?: string;
  ndbNumber?: string;
  foodCode?: string;
}

// Branded Food Item (commercial products)
export interface FDCBrandedFoodItem extends FDCFoodItem {
  brandOwner: string;
  gtinUpc?: string;
  ingredients?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  brandedFoodCategory?: string;
  labelNutrients?: FDCLabelNutrients;
}

// Foundation Food Item (basic whole foods)
export interface FDCFoundationFoodItem extends FDCFoodItem {
  ndbNumber?: string;
  scientificName?: string;
  foodCategory?: FDCFoodCategory;
  foodComponents?: FDCFoodComponent[];
  foodPortions?: FDCFoodPortion[];
}

// Food Nutrient Information
export interface FDCFoodNutrient {
  nutrient: FDCNutrient;
  amount: number;
}

export interface FDCAbridgedFoodNutrient {
  number: number;
  name: string;
  amount: number;
  unitName: string;
  derivationCode?: string;
  derivationDescription?: string;
}

export interface FDCNutrient {
  id: number;
  number: string;
  name: string;
  rank: number;
  unitName: string;
}

// Label Nutrients (from branded foods)
export interface FDCLabelNutrients {
  calories?: { value: number };
  fat?: { value: number };
  saturatedFat?: { value: number };
  transFat?: { value: number };
  cholesterol?: { value: number };
  sodium?: { value: number };
  carbohydrates?: { value: number };
  fiber?: { value: number };
  sugars?: { value: number };
  protein?: { value: number };
  calcium?: { value: number };
  iron?: { value: number };
  potassium?: { value: number };
}

// Food Category (USDA classification)
export interface FDCFoodCategory {
  id: number;
  code: string;
  description: string;
}

// Food Component (for Foundation foods)
export interface FDCFoodComponent {
  id: number;
  name: string;
  dataPoints?: number;
  gramWeight?: number;
  isRefuse?: boolean;
  percentWeight?: number;
}

// Food Portion (serving size information)
export interface FDCFoodPortion {
  id: number;
  amount: number;
  gramWeight: number;
  portionDescription: string;
  measureUnit?: FDCMeasureUnit;
}

export interface FDCMeasureUnit {
  id: number;
  abbreviation: string;
  name: string;
}

// Search Request/Response Types
export interface FDCSearchCriteria {
  query: string;
  dataType?: FDCDataType[];
  pageSize?: number;
  pageNumber?: number;
  sortBy?: 'dataType.keyword' | 'lowercaseDescription.keyword' | 'fdcId' | 'publishedDate';
  sortOrder?: 'asc' | 'desc';
  brandOwner?: string;
}

export interface FDCSearchResult {
  foodSearchCriteria: FDCSearchCriteria;
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: FDCSearchResultFood[];
}

export interface FDCSearchResultFood {
  fdcId: number;
  description: string;
  dataType: FDCDataType;
  publicationDate?: string;
  brandOwner?: string;
  gtinUpc?: string;
  ingredients?: string;
  foodNutrients?: FDCAbridgedFoodNutrient[];
  score?: number;
}

// Enhanced food item with our color categorization
export interface FDCEnhancedFoodItem extends FDCSearchResultFood {
  category?: 'blue' | 'yellow' | 'red';
  confidence?: number;
  portionGuidelines?: string;
  tags?: string[];
}

// API Request Types
export interface FDCFoodsRequest {
  fdcIds: number[];
  format?: 'abridged' | 'full';
  nutrients?: number[];
}

// Category mapping for our system
export interface FDCCategoryMapping {
  fdcCategory: string;
  ourCategory: string;
  ourSubcategory: string;
  defaultColor: 'blue' | 'yellow' | 'red';
}

// Nutrient mapping for common nutrients we care about
export interface FDCNutrientMapping {
  fdcNumber: string;
  name: string;
  unitName: string;
  priority: number; // For determining which nutrients to fetch
}
