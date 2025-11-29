/**
 * Types for AI-powered food recommendations
 */

export interface AIRecommendationRequest {
  clientProfile: string;
  foodIds?: string[]; // Optional: only analyze specific foods
  quickToggles?: {
    diabetes?: boolean;
    weightLoss?: boolean;
    heartHealth?: boolean;
    dairyFree?: boolean;
    glutenFree?: boolean;
    inflammation?: boolean;
  };
}

export interface AIRecommendationResponse {
  recommendations: AIFoodRecommendation[];
  processingTime: number; // milliseconds
  foodsProcessed: number;
  hardRulesApplied: number;
  aiProcessed: number;
}

export interface AIFoodRecommendation {
  foodId: string;
  foodName: string;
  category: 'blue' | 'yellow' | 'red';
  reasoning: string;
  confidence: number;
  method: 'hard-rule' | 'ai' | 'fallback';
}

export interface AIRecommendationMetadata {
  generatedAt: Date;
  clientProfileHash?: string; // For caching (don't store actual profile)
  model: string;
  processingTimeMs: number;
  foodsAnalyzed: number;
}
