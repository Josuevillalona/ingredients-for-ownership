/**
 * AI Food Recommendation Engine
 * Uses Llama 3.2 3B via Hugging Face to generate personalized food recommendations
 * based on client health profile and goals.
 */

import type { FoodItem } from '@/lib/types';

export interface FoodRecommendation {
  foodId: string;
  foodName: string;
  category: 'blue' | 'yellow' | 'red';
  reasoning: string;
  confidence: number;
}

export interface RecommendationOptions {
  clientProfile: string;
  foods: FoodItem[];
  quickToggles?: {
    diabetes?: boolean;
    weightLoss?: boolean;
    heartHealth?: boolean;
    dairyFree?: boolean;
    glutenFree?: boolean;
    inflammation?: boolean;
  };
}

interface LlamaResponse {
  recommendations: Array<{
    foodId: string;
    category: 'blue' | 'yellow' | 'red';
    reasoning: string;
    confidence: number;
  }>;
}

export class FoodRecommendationEngine {
  private apiKey: string;
  // Using Mistral 7B - available on free tier and good for structured output
  private modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3';

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ HUGGINGFACE_API_KEY not found. AI recommendations will not be available.');
    }
  }

  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Generate AI-powered food recommendations
   */
  async generateRecommendations(options: RecommendationOptions): Promise<FoodRecommendation[]> {
    const { clientProfile, foods, quickToggles } = options;

    if (!this.isAvailable()) {
      throw new Error('AI recommendation service is not configured. Please add HUGGINGFACE_API_KEY to your environment.');
    }

    // Layer 1: Apply hard safety rules (allergies, strict restrictions)
    const hardRulesResults = this.applyHardRules(clientProfile, foods, quickToggles);

    // Layer 2: Get AI recommendations for remaining foods
    const foodsNeedingAI = foods.filter(food => {
      const hardRule = hardRulesResults.find(r => r.foodId === food.id);
      return !hardRule; // Only process foods not caught by hard rules
    });

    let aiRecommendations: FoodRecommendation[] = [];
    if (foodsNeedingAI.length > 0) {
      aiRecommendations = await this.getAIRecommendations(clientProfile, foodsNeedingAI, quickToggles);
    }

    // Combine hard rules + AI recommendations
    return [...hardRulesResults, ...aiRecommendations];
  }

  /**
   * Layer 1: Hard safety rules for allergies and strict restrictions
   */
  private applyHardRules(
    clientProfile: string,
    foods: FoodItem[],
    quickToggles?: RecommendationOptions['quickToggles']
  ): FoodRecommendation[] {
    const profileLower = clientProfile.toLowerCase();
    const results: FoodRecommendation[] = [];

    // Dairy intolerance/allergy
    const hasDairyIssue = profileLower.includes('dairy') ||
                          profileLower.includes('lactose') ||
                          quickToggles?.dairyFree;
    if (hasDairyIssue) {
      const dairyKeywords = ['milk', 'cheese', 'yogurt', 'dairy', 'cream', 'butter', 'whey'];
      foods.forEach(food => {
        const foodText = `${food.name} ${food.description || ''}`.toLowerCase();
        if (dairyKeywords.some(keyword => foodText.includes(keyword))) {
          results.push({
            foodId: food.id,
            foodName: food.name,
            category: 'red',
            reasoning: 'Dairy intolerance/restriction noted - avoid to prevent digestive issues',
            confidence: 0.99
          });
        }
      });
    }

    // Gluten intolerance/celiac
    const hasGlutenIssue = profileLower.includes('gluten') ||
                           profileLower.includes('celiac') ||
                           quickToggles?.glutenFree;
    if (hasGlutenIssue) {
      const glutenKeywords = ['wheat', 'bread', 'pasta', 'gluten', 'barley', 'rye'];
      foods.forEach(food => {
        const foodText = `${food.name} ${food.description || ''}`.toLowerCase();
        if (glutenKeywords.some(keyword => foodText.includes(keyword))) {
          results.push({
            foodId: food.id,
            foodName: food.name,
            category: 'red',
            reasoning: 'Gluten intolerance/celiac noted - strict avoidance required',
            confidence: 0.99
          });
        }
      });
    }

    // Specific food allergies
    const allergyPatterns = [
      { keywords: ['peanut', 'peanuts'], reason: 'Peanut allergy noted' },
      { keywords: ['tree nut', 'almond', 'walnut', 'cashew'], reason: 'Tree nut allergy noted' },
      { keywords: ['shellfish', 'shrimp', 'crab', 'lobster'], reason: 'Shellfish allergy noted' },
      { keywords: ['soy', 'tofu', 'tempeh'], reason: 'Soy allergy noted' },
    ];

    allergyPatterns.forEach(({ keywords, reason }) => {
      if (keywords.some(k => profileLower.includes(k))) {
        foods.forEach(food => {
          const foodText = `${food.name} ${food.description || ''}`.toLowerCase();
          if (keywords.some(keyword => foodText.includes(keyword))) {
            results.push({
              foodId: food.id,
              foodName: food.name,
              category: 'red',
              reasoning: reason,
              confidence: 0.99
            });
          }
        });
      }
    });

    return results;
  }

  /**
   * Layer 2: Get AI recommendations using Llama 3.2
   */
  private async getAIRecommendations(
    clientProfile: string,
    foods: FoodItem[],
    quickToggles?: RecommendationOptions['quickToggles']
  ): Promise<FoodRecommendation[]> {
    const prompt = this.buildPrompt(clientProfile, foods, quickToggles);

    try {
      const response = await fetch(this.modelEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 8000, // Enough for 300+ foods
            temperature: 0.2, // Low temperature for consistent, conservative recommendations
            return_full_text: false,
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return this.parseAIResponse(result, foods);

    } catch (error) {
      console.error('AI recommendation error:', error);
      throw new Error(`Failed to generate AI recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build the prompt for Llama 3.2
   */
  private buildPrompt(
    clientProfile: string,
    foods: FoodItem[],
    quickToggles?: RecommendationOptions['quickToggles']
  ): string {
    // Build quick context from toggles
    let quickContext = '';
    if (quickToggles) {
      const conditions = [];
      if (quickToggles.diabetes) conditions.push('Type 2 diabetes');
      if (quickToggles.weightLoss) conditions.push('weight loss goal');
      if (quickToggles.heartHealth) conditions.push('heart health focus');
      if (quickToggles.inflammation) conditions.push('inflammation concerns');
      if (quickToggles.dairyFree) conditions.push('dairy-free diet');
      if (quickToggles.glutenFree) conditions.push('gluten-free diet');

      if (conditions.length > 0) {
        quickContext = `\nKey Focus Areas: ${conditions.join(', ')}`;
      }
    }

    // Build food list with nutritional context
    const foodsList = foods.map(food => {
      let nutritionContext = '';
      if (food.nutritionalInfo) {
        const { protein, carbs, fat, fiber, calories } = food.nutritionalInfo;
        const parts = [];
        if (calories) parts.push(`${calories}cal`);
        if (protein) parts.push(`${protein}g protein`);
        if (carbs) parts.push(`${carbs}g carbs`);
        if (fat) parts.push(`${fat}g fat`);
        if (fiber) parts.push(`${fiber}g fiber`);
        nutritionContext = parts.length > 0 ? ` (${parts.join(', ')})` : '';
      }
      return `- ${food.id}: ${food.name}${nutritionContext}`;
    }).join('\n');

    return `You are a clinical nutrition expert helping a health coach create a personalized nutrition plan.

CLIENT PROFILE:
${clientProfile}${quickContext}

TASK:
Categorize each food below as BLUE, YELLOW, or RED based on the client's health profile:

- BLUE (Therapeutic/Approved): Foods that directly support the client's health goals and conditions. These offer specific therapeutic benefits and should be emphasized.

- YELLOW (Healthful/Neutral): Nutritious foods that can be included in moderation as part of a balanced diet. Neither particularly beneficial nor harmful for this specific client.

- RED (Occasional/Avoid): Foods that may hinder goals, worsen conditions, or should be limited. Not forbidden, but best consumed occasionally or in small amounts.

FOODS TO CATEGORIZE:
${foodsList}

IMPORTANT GUIDELINES:
- Focus on blood sugar regulation for diabetes/prediabetes
- Emphasize anti-inflammatory foods for inflammation/autoimmune conditions
- Consider caloric density and satiety for weight management
- Prioritize heart-healthy foods for cardiovascular concerns
- Consider digestive impact for gut health issues
- Be conservative: if unsure, categorize as YELLOW rather than BLUE

Return ONLY valid JSON in this exact format (no additional text):
{
  "recommendations": [
    {
      "foodId": "food-id-here",
      "category": "blue",
      "reasoning": "Brief 1-2 sentence explanation in coach-friendly language",
      "confidence": 0.85
    }
  ]
}`;
  }

  /**
   * Parse AI response and map to recommendations
   */
  private parseAIResponse(result: any, foods: FoodItem[]): FoodRecommendation[] {
    try {
      // Hugging Face returns an array with generated text
      const generatedText = Array.isArray(result) ? result[0]?.generated_text : result.generated_text;

      if (!generatedText) {
        throw new Error('No generated text in response');
      }

      // Extract JSON from the response (might have extra text)
      const jsonMatch = generatedText.match(/\{[\s\S]*"recommendations"[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in response');
      }

      const parsed: LlamaResponse = JSON.parse(jsonMatch[0]);

      if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
        throw new Error('Invalid recommendations format');
      }

      // Map to our format and validate
      return parsed.recommendations
        .filter(rec => {
          // Validate each recommendation
          return rec.foodId &&
                 ['blue', 'yellow', 'red'].includes(rec.category) &&
                 rec.reasoning &&
                 typeof rec.confidence === 'number';
        })
        .map(rec => {
          const food = foods.find(f => f.id === rec.foodId);
          return {
            foodId: rec.foodId,
            foodName: food?.name || rec.foodId,
            category: rec.category,
            reasoning: rec.reasoning,
            confidence: rec.confidence
          };
        });

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw result:', result);
      throw new Error(`Failed to parse AI recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const foodRecommendationEngine = new FoodRecommendationEngine();
