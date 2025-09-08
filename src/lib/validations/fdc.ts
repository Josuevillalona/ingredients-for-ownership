/**
 * Zod validation schemas for FDC API integration
 * Validates requests, responses, and data transformation
 */

import { z } from 'zod';

// Base validation schemas
export const FDCDataTypeSchema = z.enum(['Branded', 'Foundation', 'Survey (FNDDS)', 'SR Legacy']);

export const FDCNutrientSchema = z.object({
  id: z.number(),
  number: z.string(),
  name: z.string().min(1, 'Nutrient name is required'),
  rank: z.number(),
  unitName: z.string().min(1, 'Unit name is required')
});

export const FDCAbridgedFoodNutrientSchema = z.object({
  number: z.number(),
  name: z.string().min(1, 'Nutrient name is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  unitName: z.string().min(1, 'Unit name is required'),
  derivationCode: z.string().optional(),
  derivationDescription: z.string().optional()
});

export const FDCFoodNutrientSchema = z.object({
  nutrient: FDCNutrientSchema,
  amount: z.number().min(0, 'Amount must be non-negative')
});

export const FDCLabelNutrientsSchema = z.object({
  calories: z.object({ value: z.number() }).optional(),
  fat: z.object({ value: z.number() }).optional(),
  saturatedFat: z.object({ value: z.number() }).optional(),
  transFat: z.object({ value: z.number() }).optional(),
  cholesterol: z.object({ value: z.number() }).optional(),
  sodium: z.object({ value: z.number() }).optional(),
  carbohydrates: z.object({ value: z.number() }).optional(),
  fiber: z.object({ value: z.number() }).optional(),
  sugars: z.object({ value: z.number() }).optional(),
  protein: z.object({ value: z.number() }).optional(),
  calcium: z.object({ value: z.number() }).optional(),
  iron: z.object({ value: z.number() }).optional(),
  potassium: z.object({ value: z.number() }).optional()
});

export const FDCFoodCategorySchema = z.object({
  id: z.number(),
  code: z.string().min(1, 'Category code is required'),
  description: z.string().min(1, 'Category description is required')
});

export const FDCMeasureUnitSchema = z.object({
  id: z.number(),
  abbreviation: z.string(),
  name: z.string()
});

export const FDCFoodPortionSchema = z.object({
  id: z.number(),
  amount: z.number().min(0, 'Amount must be non-negative'),
  gramWeight: z.number().min(0, 'Gram weight must be non-negative'),
  portionDescription: z.string().min(1, 'Portion description is required'),
  measureUnit: FDCMeasureUnitSchema.optional()
});

export const FDCFoodComponentSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Component name is required'),
  dataPoints: z.number().optional(),
  gramWeight: z.number().optional(),
  isRefuse: z.boolean().optional(),
  percentWeight: z.number().optional()
});

// Base FDC Food Item Schema
export const FDCFoodItemSchema = z.object({
  fdcId: z.number().positive('FDC ID must be positive'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  dataType: FDCDataTypeSchema,
  publicationDate: z.string().optional(),
  foodNutrients: z.array(FDCFoodNutrientSchema).optional()
});

// Abridged FDC Food Item Schema (for search results)
export const FDCAbridgedFoodItemSchema = FDCFoodItemSchema.extend({
  brandOwner: z.string().max(200, 'Brand owner name too long').optional(),
  gtinUpc: z.string().max(20, 'UPC code too long').optional(),
  ndbNumber: z.string().max(20, 'NDB number too long').optional(),
  foodCode: z.string().max(20, 'Food code too long').optional(),
  foodNutrients: z.array(FDCAbridgedFoodNutrientSchema).optional()
});

// Branded Food Item Schema
export const FDCBrandedFoodItemSchema = FDCFoodItemSchema.extend({
  brandOwner: z.string().min(1, 'Brand owner is required').max(200, 'Brand owner name too long'),
  gtinUpc: z.string().max(20, 'UPC code too long').optional(),
  ingredients: z.string().max(2000, 'Ingredients list too long').optional(),
  servingSize: z.number().positive('Serving size must be positive').optional(),
  servingSizeUnit: z.string().max(10, 'Serving size unit too long').optional(),
  brandedFoodCategory: z.string().max(200, 'Food category too long').optional(),
  labelNutrients: FDCLabelNutrientsSchema.optional()
});

// Foundation Food Item Schema
export const FDCFoundationFoodItemSchema = FDCFoodItemSchema.extend({
  ndbNumber: z.string().max(20, 'NDB number too long').optional(),
  scientificName: z.string().max(200, 'Scientific name too long').optional(),
  foodCategory: FDCFoodCategorySchema.optional(),
  foodComponents: z.array(FDCFoodComponentSchema).optional(),
  foodPortions: z.array(FDCFoodPortionSchema).optional()
});

// Search Criteria Schema
export const FDCSearchCriteriaSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200, 'Search query too long'),
  dataType: z.array(FDCDataTypeSchema).max(4, 'Too many data types').optional(),
  pageSize: z.number().min(1, 'Page size must be at least 1').max(200, 'Page size too large').default(50),
  pageNumber: z.number().min(0, 'Page number must be non-negative').default(0),
  sortBy: z.enum(['dataType.keyword', 'lowercaseDescription.keyword', 'fdcId', 'publishedDate']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  brandOwner: z.string().max(200, 'Brand owner name too long').optional()
});

// Search Result Food Schema
export const FDCSearchResultFoodSchema = z.object({
  fdcId: z.number().positive('FDC ID must be positive'),
  description: z.string().min(1, 'Description is required'),
  dataType: FDCDataTypeSchema,
  publicationDate: z.string().optional(),
  brandOwner: z.string().optional(),
  gtinUpc: z.string().optional(),
  ingredients: z.string().optional(),
  foodNutrients: z.array(FDCAbridgedFoodNutrientSchema).optional(),
  score: z.number().optional()
});

// Search Result Schema
export const FDCSearchResultSchema = z.object({
  foodSearchCriteria: FDCSearchCriteriaSchema,
  totalHits: z.number().min(0, 'Total hits must be non-negative'),
  currentPage: z.number().min(0, 'Current page must be non-negative'),
  totalPages: z.number().min(0, 'Total pages must be non-negative'),
  foods: z.array(FDCSearchResultFoodSchema)
});

// Enhanced Food Item Schema (with our categorization)
export const FDCEnhancedFoodItemSchema = FDCSearchResultFoodSchema.extend({
  category: z.enum(['blue', 'yellow', 'red']).optional(),
  confidence: z.number().min(0).max(1).optional(),
  portionGuidelines: z.string().max(500, 'Portion guidelines too long').optional(),
  tags: z.array(z.string().max(50, 'Tag too long')).max(10, 'Too many tags').optional()
});

// API Request Schemas
export const FDCFoodsRequestSchema = z.object({
  fdcIds: z.array(z.number().positive('FDC ID must be positive'))
    .min(1, 'At least one FDC ID is required')
    .max(20, 'Too many FDC IDs (max 20)'),
  format: z.enum(['abridged', 'full']).default('abridged'),
  nutrients: z.array(z.number().positive('Nutrient number must be positive'))
    .max(25, 'Too many nutrients (max 25)')
    .optional()
});

// Category Mapping Schema
export const FDCCategoryMappingSchema = z.object({
  fdcCategory: z.string().min(1, 'FDC category is required'),
  ourCategory: z.string().min(1, 'Our category is required'),
  ourSubcategory: z.string().min(1, 'Our subcategory is required'),
  defaultColor: z.enum(['blue', 'yellow', 'red'])
});

// Nutrient Mapping Schema
export const FDCNutrientMappingSchema = z.object({
  fdcNumber: z.string().min(1, 'FDC nutrient number is required'),
  name: z.string().min(1, 'Nutrient name is required'),
  unitName: z.string().min(1, 'Unit name is required'),
  priority: z.number().min(1, 'Priority must be at least 1')
});

// Transform FDC food item to our food item format
export const FDCToFoodItemTransformSchema = z.object({
  name: z.string().min(1, 'Food name is required'),
  category: z.enum(['blue', 'yellow', 'red']),
  description: z.string().min(1, 'Description is required'),
  servingSize: z.string().min(1, 'Serving size is required'),
  portionGuidelines: z.string().min(1, 'Portion guidelines are required'),
  nutritionalInfo: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    fiber: z.number().min(0)
  }),
  fdcId: z.number().positive('FDC ID must be positive'),
  isGlobal: z.boolean().default(false),
  tags: z.array(z.string().max(50)).max(10).default([])
});

// Export inferred types
export type FDCSearchCriteriaInput = z.infer<typeof FDCSearchCriteriaSchema>;
export type FDCSearchResult = z.infer<typeof FDCSearchResultSchema>;
export type FDCSearchResultFood = z.infer<typeof FDCSearchResultFoodSchema>;
export type FDCEnhancedFoodItem = z.infer<typeof FDCEnhancedFoodItemSchema>;
export type FDCFoodsRequest = z.infer<typeof FDCFoodsRequestSchema>;
export type FDCCategoryMapping = z.infer<typeof FDCCategoryMappingSchema>;
export type FDCNutrientMapping = z.infer<typeof FDCNutrientMappingSchema>;
export type FDCToFoodItemTransform = z.infer<typeof FDCToFoodItemTransformSchema>;
