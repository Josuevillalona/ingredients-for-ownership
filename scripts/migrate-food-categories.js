#!/usr/bin/env node

/**
 * Migration Script: Add Categories to Existing Foods
 * 
 * This script processes all existing foods in Firestore and adds
 * permanent category information using our AI categorization service.
 * 
 * Usage: node scripts/migrate-food-categories.js [--dry-run] [--batch-size=50]
 */

// Polyfill fetch for Node.js (if not available)
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Note: This script would normally use Firebase Admin SDK for production migrations
// For testing purposes, we'll simulate the migration process
const path = require('path');

console.log('📋 SIMULATION MODE: This script simulates the migration process');
console.log('📋 In production, this would use Firebase Admin SDK with proper credentials');

// Simulate database connection
const db = {
  collection: (name) => ({
    where: (field, op, value) => ({
      get: async () => ({
        docs: [
          // Simulate some existing foods without categories
          { 
            id: 'food1', 
            data: () => ({ name: 'Grilled Chicken Breast', description: 'Lean protein source' }),
            ref: { update: async (data) => console.log('  💾 Would update:', data) }
          },
          { 
            id: 'food2', 
            data: () => ({ name: 'Atlantic Salmon', description: 'Rich in omega-3 fatty acids' }),
            ref: { update: async (data) => console.log('  � Would update:', data) }
          },
          { 
            id: 'food3', 
            data: () => ({ name: 'Avocado', description: 'Creamy fruit high in healthy fats' }),
            ref: { update: async (data) => console.log('  💾 Would update:', data) }
          }
        ]
      })
    })
  })
};

// Import our categorization logic (adapted for Node.js)
class FoodCategorizer {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    this.modelEndpoint = `${this.baseUrl}/facebook/bart-large-mnli`;
    
    // Definitive keyword lists - these cannot be wrong
    this.DEFINITIVE_SEAFOOD = [
      'salmon', 'tuna', 'cod', 'trout', 'bass', 'mackerel', 'sardines', 'anchovies',
      'halibut', 'flounder', 'sole', 'snapper', 'mahi', 'tilapia', 'catfish', 'herring',
      'sea trout', 'rainbow trout', 'brook trout', 'sea bass', 'shrimp', 'crab', 
      'lobster', 'scallops', 'mussels', 'oysters', 'clams', 'prawns', 'fish'
    ];
    
    this.DEFINITIVE_MEAT = [
      'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'goose', 'venison', 'elk',
      'bacon', 'ham', 'sausage', 'ground beef', 'steak', 'roast', 'chops', 'ribs',
      'chicken breast', 'chicken thigh', 'ground turkey', 'pork chop', 'meat',
      'eggs', 'egg', 'whole eggs', 'egg whites', 'egg yolk', 'organic eggs'
    ];
    
    this.DEFINITIVE_NUTS_FATS = [
      'almonds', 'walnuts', 'pecans', 'cashews', 'pistachios', 'hazelnuts',
      'macadamia nuts', 'macadamias', 'brazil nuts', 'pine nuts', 'sunflower seeds', 'pumpkin seeds',
      'chia seeds', 'flax seeds', 'sesame seeds', 'hemp seeds', 'avocado',
      'coconut', 'coconut oil', 'olive oil', 'avocado oil', 'nuts', 'seeds'
    ];
    
    this.DEFINITIVE_DAIRY = [
      'milk', 'cheese', 'yogurt', 'kefir', 'cottage cheese', 'cream cheese',
      'greek yogurt', 'sour cream', 'butter', 'dairy', 'cheddar', 'mozzarella',
      'parmesan', 'swiss cheese', 'goat cheese', 'feta', 'ricotta', 'brie',
      'camembert', 'blue cheese', 'provolone', 'monterey jack', 'cream',
      'heavy cream', 'half and half', 'buttermilk', 'whey protein'
    ];
    
    this.DEFINITIVE_PLANT_PROTEINS = [
      'tofu', 'tempeh', 'seitan', 'nutritional yeast', 'beans', 'lentils',
      'chickpeas', 'black beans', 'kidney beans', 'pinto beans', 'navy beans',
      'lima beans', 'garbanzo beans', 'protein powder', 'hemp protein',
      'pea protein', 'soy protein', 'plant protein', 'vegan protein'
    ];
  }

  isAvailable() {
    return Boolean(this.apiKey);
  }

  async categorizeFood(food) {
    try {
      // Layer 1: Definitive keyword detection
      const definitiveResult = this.getDefinitiveCategory(food);
      if (definitiveResult) {
        return definitiveResult;
      }

      // Layer 2: AI classification with validation
      if (this.isAvailable()) {
        try {
          const aiResult = await this.performAIClassification(food);
          const validatedResult = this.validateAIResult(aiResult, food);
          if (validatedResult.confidence > 0.75) {
            return validatedResult;
          }
        } catch (error) {
          console.warn(`⚠️  AI categorization failed for ${food.name}:`, error.message);
        }
      }

      // Layer 3: Enhanced pattern-based fallback
      return this.enhancedFallbackCategorization(food);
    } catch (error) {
      console.error(`❌ Categorization failed for ${food.name}:`, error);
      return {
        category: 'other',
        confidence: 0.1,
        method: 'fallback',
        reasoning: 'Error during categorization - defaulted to other'
      };
    }
  }

  getDefinitiveCategory(food) {
    const name = food.name.toLowerCase();
    const description = (food.description || '').toLowerCase();
    const fullText = `${name} ${description}`;

    // Check seafood first
    for (const term of this.DEFINITIVE_SEAFOOD) {
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

    // Check meat
    for (const term of this.DEFINITIVE_MEAT) {
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

    // Check plant proteins
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

    // Check dairy
    for (const term of this.DEFINITIVE_DAIRY) {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(fullText)) {
        // Special cases: avoid false positives
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

    // Check nuts/fats
    for (const term of this.DEFINITIVE_NUTS_FATS) {
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

    return null; // No definitive match found
  }

  async performAIClassification(food) {
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

  validateAIResult(result, food) {
    const name = food.name.toLowerCase();
    const description = (food.description || '').toLowerCase();
    const fullText = `${name} ${description}`;

    // Never allow seafood/meat to be classified as plant protein
    if (result.category === 'plant-proteins') {
      const animalProteinPatterns = [
        /\b(fish|salmon|tuna|cod|trout|sardines|anchovies|seafood)\b/i,
        /\b(chicken|beef|pork|lamb|turkey|meat|bacon|ham)\b/i,
        /\b(shrimp|crab|lobster|scallops|mussels)\b/i
      ];
      
      for (const pattern of animalProteinPatterns) {
        if (pattern.test(fullText)) {
          const isSeafood = /\b(fish|salmon|tuna|cod|trout|sardines|anchovies|seafood|shrimp|crab|lobster|scallops|mussels)\b/i.test(fullText);
          return {
            category: isSeafood ? 'seafood' : 'meat',
            confidence: 0.95,
            method: 'huggingface-ai',
            reasoning: 'VALIDATION OVERRIDE: AI incorrectly classified animal protein as plant protein'
          };
        }
      }
    }

    // Never allow nuts to be classified as meat or seafood
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
            reasoning: 'VALIDATION OVERRIDE: AI incorrectly classified nuts/fats as meat'
          };
        }
      }
    }

    return result;
  }

  buildFoodDescription(food) {
    const parts = [food.name];
    
    if (food.description) {
      parts.push(food.description);
    }
    
    if (food.nutritionalInfo) {
      const { protein = 0, carbs = 0, fat = 0, fiber = 0 } = food.nutritionalInfo;
      const nutritionParts = [];
      
      if (protein > 10) nutritionParts.push('high protein');
      if (carbs > 15) nutritionParts.push('high carbohydrate');
      if (fat > 10) nutritionParts.push('high fat');
      if (fiber > 3) nutritionParts.push('high fiber');
      
      if (nutritionParts.length > 0) {
        parts.push(`This food is ${nutritionParts.join(', ')}`);
      }
    }
    
    return parts.join('. ');
  }

  parseHuggingFaceResult(result, food) {
    if (!result.labels || !result.scores || result.labels.length === 0) {
      console.warn(`Invalid Hugging Face result for ${food.name}, using fallback`);
      return this.enhancedFallbackCategorization(food);
    }

    const topLabel = result.labels[0];
    const confidence = result.scores[0];
    
    const category = this.mapLabelToCategory(topLabel);
    
    if (confidence < 0.6) {
      console.warn(`Low confidence (${confidence}) for ${food.name}, using fallback`);
      return this.enhancedFallbackCategorization(food);
    }

    return {
      category,
      confidence,
      method: 'huggingface-ai',
      reasoning: `AI classified as "${topLabel}" with ${(confidence * 100).toFixed(1)}% confidence`
    };
  }

  mapLabelToCategory(label) {
    const labelMap = {
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

  enhancedFallbackCategorization(food) {
    const name = food.name.toLowerCase();
    const description = (food.description || '').toLowerCase();
    const fullText = `${name} ${description}`;

    // Priority-ordered patterns
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
          category: 'plant-proteins',
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
}

// Migration Script Main Logic
async function migrateFoodCategories() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='));
  const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1]) : 50;

  console.log('🚀 Starting Food Category Migration');
  console.log(`📋 Mode: ${isDryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
  console.log(`📦 Batch Size: ${batchSize}`);
  console.log('─'.repeat(50));

  const categorizer = new FoodCategorizer();
  
  if (!categorizer.isAvailable()) {
    console.log('⚠️  Hugging Face API key not found - will use fallback categorization only');
  }

  try {
    // Get all foods that don't have categories
    console.log('📖 Fetching foods without categories...');
    const foodsQuery = await db.collection('foods')
      .where('category', '==', null)
      .get();
    
    const totalFoods = foodsQuery.docs.length;
    console.log(`📊 Found ${totalFoods} foods to categorize`);

    if (totalFoods === 0) {
      console.log('✅ All foods already have categories!');
      return;
    }

    const stats = {
      processed: 0,
      successful: 0,
      failed: 0,
      aiCategorized: 0,
      regexCategorized: 0,
      fallbackCategorized: 0
    };

    // Process foods in batches
    const foods = foodsQuery.docs;
    for (let i = 0; i < foods.length; i += batchSize) {
      const batch = foods.slice(i, i + batchSize);
      console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(foods.length/batchSize)} (${batch.length} foods)`);
      
      const promises = batch.map(async (doc) => {
        try {
          const food = { id: doc.id, ...doc.data() };
          const categoryResult = await categorizer.categorizeFood(food);
          
          stats.processed++;
          
          // Track categorization methods
          if (categoryResult.method === 'huggingface-ai') {
            stats.aiCategorized++;
          } else if (categoryResult.method === 'regex') {
            stats.regexCategorized++;
          } else {
            stats.fallbackCategorized++;
          }
          
          console.log(`  ✅ ${food.name} → ${categoryResult.category} (${categoryResult.method}, ${(categoryResult.confidence * 100).toFixed(1)}%)`);
          
          if (!isDryRun) {
            // Update the food document with category information
            await doc.ref.update({
              category: categoryResult.category,
              categoryConfidence: categoryResult.confidence,
              categoryMethod: categoryResult.method,
              categorizedAt: new Date(),
              lastUpdated: new Date()
            });
          }
          
          stats.successful++;
          return { success: true, food: food.name, category: categoryResult.category };
        } catch (error) {
          stats.failed++;
          console.error(`  ❌ Failed to categorize ${doc.data().name}:`, error.message);
          return { success: false, food: doc.data().name, error: error.message };
        }
      });
      
      await Promise.all(promises);
      
      // Rate limiting - pause between batches to avoid overwhelming APIs
      if (i + batchSize < foods.length) {
        console.log('⏳ Pausing 2 seconds between batches...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Final statistics
    console.log('\n' + '═'.repeat(50));
    console.log('📊 MIGRATION COMPLETE');
    console.log('═'.repeat(50));
    console.log(`📈 Total Processed: ${stats.processed}`);
    console.log(`✅ Successful: ${stats.successful}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`🤖 AI Categorized: ${stats.aiCategorized}`);
    console.log(`🔍 Regex Categorized: ${stats.regexCategorized}`);
    console.log(`🔄 Fallback Categorized: ${stats.fallbackCategorized}`);
    console.log(`📊 Success Rate: ${((stats.successful / stats.processed) * 100).toFixed(1)}%`);
    
    if (isDryRun) {
      console.log('\n💡 This was a DRY RUN - no data was actually updated');
      console.log('💡 Remove --dry-run flag to perform actual migration');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Handle command line execution
if (require.main === module) {
  migrateFoodCategories()
    .then(() => {
      console.log('\n🎉 Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateFoodCategories, FoodCategorizer };