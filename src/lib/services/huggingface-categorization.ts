import type { FoodItem } from '@/lib/types';

export interface CategoryResult {
  category: string;
  confidence: number;
  method: 'huggingface-ai' | 'fallback' | 'regex';
  reasoning: string;
}

export class HuggingFaceFoodCategorization {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';
  
  // We'll use Facebook's BART model for zero-shot classification
  private modelEndpoint = `${this.baseUrl}/facebook/bart-large-mnli`;
  
  // Definitive keyword lists - these cannot be wrong
  private readonly DEFINITIVE_SEAFOOD = [
    'salmon', 'tuna', 'cod', 'trout', 'bass', 'mackerel', 'sardines', 'anchovies',
    'halibut', 'flounder', 'sole', 'snapper', 'mahi', 'tilapia', 'catfish', 'herring',
    'sea trout', 'rainbow trout', 'brook trout', 'sea bass', 'shrimp', 'crab', 
    'lobster', 'scallops', 'mussels', 'oysters', 'clams', 'prawns', 'fish'
  ];
  
  private readonly DEFINITIVE_MEAT = [
    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'goose', 'venison', 'elk',
    'bacon', 'ham', 'sausage', 'ground beef', 'steak', 'roast', 'chops', 'ribs',
    'chicken breast', 'chicken thigh', 'ground turkey', 'pork chop', 'meat',
    'eggs', 'egg', 'whole eggs', 'egg whites', 'egg yolk', 'organic eggs'
  ];
  
  private readonly DEFINITIVE_NUTS_FATS = [
    'almonds', 'walnuts', 'pecans', 'cashews', 'pistachios', 'hazelnuts',
    'macadamia nuts', 'macadamias', 'brazil nuts', 'pine nuts', 'sunflower seeds', 'pumpkin seeds',
    'chia seeds', 'flax seeds', 'sesame seeds', 'hemp seeds', 'avocado',
    'coconut', 'coconut oil', 'olive oil', 'avocado oil', 'nuts', 'seeds'
  ];
  
  // Definitive dairy products - comprehensive coverage
  private readonly DEFINITIVE_DAIRY = [
    'milk', 'cheese', 'yogurt', 'kefir', 'cottage cheese', 'cream cheese',
    'greek yogurt', 'sour cream', 'butter', 'dairy', 'cheddar', 'mozzarella',
    'parmesan', 'swiss cheese', 'goat cheese', 'feta', 'ricotta', 'brie',
    'camembert', 'blue cheese', 'provolone', 'monterey jack', 'cream',
    'heavy cream', 'half and half', 'buttermilk', 'whey protein'
  ];
  
  // Definitive plant proteins - vegan protein sources
  private readonly DEFINITIVE_PLANT_PROTEINS = [
    'tofu', 'tempeh', 'seitan', 'nutritional yeast', 'beans', 'lentils',
    'chickpeas', 'black beans', 'kidney beans', 'pinto beans', 'navy beans',
    'lima beans', 'garbanzo beans', 'protein powder', 'hemp protein',
    'pea protein', 'soy protein', 'plant protein', 'vegan protein'
  ];
  
  constructor() {
    // Check both client-side (NEXT_PUBLIC_) and server-side environment variables
    this.apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('🔑 HUGGINGFACE_API_KEY not found. Food categorization will use fallback method.');
    } else {
      console.log('✅ Hugging Face AI categorization enabled');
    }
  }

  /**
   * Check if Hugging Face API is available
   */
  isAvailable(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Multi-layer categorization: Definitive Keywords → AI + Validation → Enhanced Fallback
   */
  async categorizeFood(food: FoodItem): Promise<CategoryResult> {
    // Layer 1: Definitive keyword detection (99% confidence - cannot be wrong)
    const definitiveResult = this.getDefinitiveCategory(food);
    if (definitiveResult) {
      return definitiveResult;
    }

    // Layer 2: AI classification with critical validation
    if (this.isAvailable()) {
      try {
        const aiResult = await this.performAIClassification(food);
        // CRITICAL: Validate AI result to prevent obvious errors
        const validatedResult = this.validateAIResult(aiResult, food);
        if (validatedResult.confidence > 0.75) {
          return validatedResult;
        }
      } catch (error) {
        console.warn('AI categorization failed, using enhanced fallback:', error);
      }
    }

    // Layer 3: Enhanced pattern-based fallback
    return this.enhancedFallbackCategorization(food);
  }

  /**
   * Layer 1: Definitive keyword detection - these classifications cannot be wrong
   */
  private getDefinitiveCategory(food: FoodItem): CategoryResult | null {
    const name = food.name.toLowerCase();
    const description = (food.description || '').toLowerCase();
    const fullText = `${name} ${description}`;

    // Check for definitive seafood terms - these are NEVER plant proteins
    for (const term of this.DEFINITIVE_SEAFOOD) {
      // Use word boundaries to avoid false positives (e.g., "cream" in "creamy")
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        return {
          category: 'seafood',
          confidence: 0.99,
          method: 'regex',
          reasoning: `DEFINITIVE: "${term}" detected - seafood`
        };
      }
    }

    // Check for definitive meat terms - these are NEVER plant proteins
    for (const term of this.DEFINITIVE_MEAT) {
      // Use word boundaries to avoid false positives (e.g., "meat" in "coconut meat")
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        // Special case: avoid "coconut meat" being classified as meat
        if (term === 'meat' && /coconut.*meat|meat.*coconut/i.test(fullText)) {
          continue;
        }
        return {
          category: 'meat',
          confidence: 0.99,
          method: 'regex',
          reasoning: `DEFINITIVE: "${term}" detected - meat/animal protein`
        };
      }
    }

    // Check for definitive plant proteins (check before dairy to avoid conflicts)
    for (const term of this.DEFINITIVE_PLANT_PROTEINS) {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        return {
          category: 'plant-proteins',
          confidence: 0.99,
          method: 'regex',
          reasoning: `DEFINITIVE: "${term}" detected - plant protein`
        };
      }
    }

    // Check for definitive dairy products
    for (const term of this.DEFINITIVE_DAIRY) {
      // Use word boundaries to avoid false positives (e.g., "cheese" in "cheese substitute")
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        // Special cases: avoid false positives for plant-based alternatives
        if (term === 'cheese' && /cheese substitute|nutritional yeast/i.test(fullText)) {
          continue;
        }
        if (term === 'cream' && /creamy.*fruit|fruit.*creamy|avocado/i.test(fullText)) {
          continue;
        }
        return {
          category: 'dairy',
          confidence: 0.99,
          method: 'regex',
          reasoning: `DEFINITIVE: "${term}" detected - dairy product`
        };
      }
    }

    // Check for definitive nuts/fats
    for (const term of this.DEFINITIVE_NUTS_FATS) {
      // Use word boundaries for precise matching
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        return {
          category: 'healthy-fats',
          confidence: 0.99,
          method: 'regex',
          reasoning: `DEFINITIVE: "${term}" detected - healthy fats`
        };
      }
    }

    return null; // No definitive match found, proceed to AI
  }

  /**
   * Layer 2: AI Classification with enhanced labels
   */
  private async performAIClassification(food: FoodItem): Promise<CategoryResult> {
    const foodText = this.buildFoodDescription(food);
    
    const response = await fetch(this.modelEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: foodText,
        parameters: {
          candidate_labels: [
            'meat chicken beef pork lamb turkey eggs',
            'fish seafood salmon tuna sardines anchovies',
            'plant protein tofu beans lentils vegan',
            'nuts seeds almonds walnuts healthy fats',
            'vegetables greens broccoli spinach produce',
            'fruits berries apple banana',
            'grains bread rice pasta carbohydrates',
            'dairy milk cheese yogurt',
            'processed snacks supplements other'
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    return this.parseHuggingFaceResult(result, food);
  }

  /**
   * CRITICAL: Validate AI results to prevent obvious misclassifications
   */
  private validateAIResult(result: CategoryResult, food: FoodItem): CategoryResult {
    const name = food.name.toLowerCase();
    const description = (food.description || '').toLowerCase();
    const fullText = `${name} ${description}`;

    // CRITICAL VALIDATION: Never allow seafood/meat to be classified as plant protein
    if (result.category === 'plant-proteins') {
      const animalProteinPatterns = [
        /\b(fish|salmon|tuna|cod|trout|sardines|anchovies|seafood)\b/i,
        /\b(chicken|beef|pork|lamb|turkey|meat|bacon|ham)\b/i,
        /\b(shrimp|crab|lobster|scallops|mussels)\b/i
      ];
      
      for (const pattern of animalProteinPatterns) {
        if (pattern.test(fullText)) {
          // Determine if it's seafood or meat based on the pattern
          const isSeafood = /\b(fish|salmon|tuna|cod|trout|sardines|anchovies|seafood|shrimp|crab|lobster|scallops|mussels)\b/i.test(fullText);
          return {
            category: isSeafood ? 'seafood' : 'meat',
            confidence: 0.95,
            method: 'huggingface-ai',
            reasoning: `VALIDATION OVERRIDE: AI incorrectly classified animal protein as plant protein. Pattern: ${pattern}`
          };
        }
      }
    }

    // VALIDATION: Never allow nuts to be classified as meat or seafood
    if (result.category === 'meat' || result.category === 'seafood') {
      const nutsPatterns = [
        /\b(almonds|walnuts|cashews|pistachios|nuts|seeds)\b/i,
        /\b(avocado|olive oil|coconut oil)\b/i
      ];
      
      for (const pattern of nutsPatterns) {
        if (pattern.test(fullText)) {
          return {
            category: 'healthy-fats',
            confidence: 0.95,
            method: 'huggingface-ai',
            reasoning: `VALIDATION OVERRIDE: AI incorrectly classified nuts/fats as meat. Pattern: ${pattern}`
          };
        }
      }
    }

    return result; // AI result passed validation
  }

  /**
   * Build descriptive text for the food item
   */
  private buildFoodDescription(food: FoodItem): string {
    const parts = [food.name];
    
    if (food.description) {
      parts.push(food.description);
    }
    
    // Add nutritional context if available
    if (food.nutritionalInfo) {
      const { protein, carbs, fat, fiber } = food.nutritionalInfo;
      const nutritionParts = [];
      
      if (protein && protein > 10) nutritionParts.push('high protein');
      if (carbs && carbs > 15) nutritionParts.push('high carbohydrate');
      if (fat && fat > 10) nutritionParts.push('high fat');
      if (fiber && fiber > 3) nutritionParts.push('high fiber');
      
      if (nutritionParts.length > 0) {
        parts.push(`This food is ${nutritionParts.join(', ')}`);
      }
    }
    
    return parts.join('. ');
  }

  /**
   * Parse Hugging Face classification result
   */
  private parseHuggingFaceResult(result: any, food: FoodItem): CategoryResult {
    if (!result.labels || !result.scores || result.labels.length === 0) {
      console.warn('Invalid Hugging Face result, using fallback');
      return this.fallbackCategorization(food);
    }

    const topLabel = result.labels[0];
    const confidence = result.scores[0];
    
    // Map Hugging Face labels to our categories
    const category = this.mapLabelToCategory(topLabel);
    
    // If confidence is too low, use fallback
    if (confidence < 0.6) {
      console.warn(`Low confidence (${confidence}) for ${food.name}, using fallback`);
      return this.fallbackCategorization(food);
    }

    return {
      category,
      confidence,
      method: 'huggingface-ai',
      reasoning: `AI classified as "${topLabel}" with ${(confidence * 100).toFixed(1)}% confidence`
    };
  }

  /**
   * Map Hugging Face labels to our category system
   */
  private mapLabelToCategory(label: string): string {
    const labelMap: Record<string, string> = {
      'meat chicken beef pork lamb turkey eggs': 'meat',
      'fish seafood salmon tuna sardines anchovies': 'seafood',
      'plant protein tofu beans lentils vegan': 'plant-proteins',
      'nuts seeds almonds walnuts healthy fats': 'healthy-fats',
      'vegetables greens broccoli spinach produce': 'vegetables',
      'fruits berries apple banana': 'fruits',
      'grains bread rice pasta carbohydrates': 'healthy-carbs',
      'dairy milk cheese yogurt': 'dairy',
      'processed snacks supplements other': 'other'
    };

    return labelMap[label] || 'other';
  }

  /**
   * Layer 3: Enhanced fallback with priority-based pattern matching
   */
  private enhancedFallbackCategorization(food: FoodItem): CategoryResult {
    const name = food.name.toLowerCase();
    const description = (food.description || '').toLowerCase();
    const fullText = `${name} ${description}`;

    // Priority-ordered patterns (most specific first)
    const categoryPatterns = [
      {
        category: 'seafood',
        patterns: [
          /\b(fish|salmon|tuna|cod|trout|sardines|anchovies|seafood|bass|mackerel)\b/i,
          /\b(shrimp|crab|lobster|scallops|mussels|oysters|clams|prawns)\b/i,
          /\b(halibut|flounder|sole|snapper|mahi|tilapia|catfish|herring)\b/i
        ],
        confidence: 0.85
      },
      {
        category: 'meat',
        patterns: [
          /\b(chicken|beef|pork|lamb|turkey|meat|bacon|ham|sausage)\b/i,
          /\b(eggs|egg|whole eggs|egg whites|egg yolk|organic eggs)\b/i,
          /\b(duck|goose|venison|elk|ground beef|steak|roast|chops|ribs)\b/i
        ],
        confidence: 0.85
      },
      {
        category: 'healthy-fats',
        patterns: [
          /\b(almonds|walnuts|cashews|pistachios|pecans|hazelnuts)\b/i,
          /\b(nuts|seeds|avocado|olive oil|coconut oil)\b/i,
          /\b(sunflower seeds|pumpkin seeds|chia seeds|flax seeds)\b/i
        ],
        confidence: 0.85
      },
      {
        category: 'plant-proteins',
        patterns: [
          /\b(tofu|tempeh|seitan|nutritional yeast)\b/i,
          /\b(beans|lentils|chickpeas|protein powder)\b/i,
          /\b(black beans|kidney beans|pinto beans)\b/i
        ],
        confidence: 0.8
      },
      {
        category: 'vegetables',
        patterns: [
          /\b(vegetable|broccoli|spinach|kale|lettuce|cabbage)\b/i,
          /\b(carrot|pepper|onion|tomato|cucumber|celery)\b/i
        ],
        confidence: 0.75
      },
      {
        category: 'fruits',
        patterns: [
          /\b(fruit|apple|banana|orange|berry|grape|melon)\b/i,
          /\b(strawberry|blueberry|raspberry|blackberry)\b/i
        ],
        confidence: 0.75
      },
      {
        category: 'healthy-carbs',
        patterns: [
          /\b(rice|bread|pasta|oats|quinoa|barley)\b/i,
          /\b(potato|sweet potato|grain|cereal)\b/i
        ],
        confidence: 0.7
      },
      {
        category: 'dairy',
        patterns: [
          /\b(milk|cheese|yogurt|dairy|cream|butter)\b/i,
          /\b(cottage cheese|greek yogurt|cheddar|mozzarella)\b/i,
          /\b(kefir|feta|ricotta|brie|camembert|parmesan)\b/i,
          /\b(buttermilk|sour cream|cream cheese|whey)\b/i
        ],
        confidence: 0.7
      }
    ];

    // Test patterns in priority order
    for (const { category, patterns, confidence } of categoryPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(fullText)) {
          return {
            category,
            confidence,
            method: 'regex',
            reasoning: `Enhanced pattern match: ${pattern.toString()}`
          };
        }
      }
    }

    // Nutritional analysis as final fallback
    if (food.nutritionalInfo) {
      const { protein = 0, carbs = 0, fat = 0 } = food.nutritionalInfo;
      
      if (fat > 10 && fat > protein && fat > carbs) {
        return {
          category: 'healthy-fats',
          confidence: 0.6,
          method: 'fallback',
          reasoning: 'High fat content suggests healthy fats'
        };
      }
      
      if (protein > 15 && protein > carbs && protein > fat) {
        return {
          category: 'plant-proteins', // Default to plant for unknown high-protein foods
          confidence: 0.5,
          method: 'fallback',
          reasoning: 'High protein content, defaulting to plant proteins'
        };
      }
    }

    return {
      category: 'other',
      confidence: 0.3,
      method: 'fallback',
      reasoning: 'No clear indicators found - categorized as other'
    };
  }

  /**
   * Legacy fallback method - kept for compatibility
   */
  private fallbackCategorization(food: FoodItem): CategoryResult {
    return this.enhancedFallbackCategorization(food);
  }
}

// Export singleton instance
export const huggingFaceCategorization = new HuggingFaceFoodCategorization();