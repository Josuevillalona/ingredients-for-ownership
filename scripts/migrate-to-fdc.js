/**
 * FDC Migration Script
 * Migrates current food database to use USDA FoodData Central API
 */

// API Configuration
const FDC_API_KEY = 'TN89S7qVn25F2EDT3I8udrVAEzpZ5tz0Y9Wvp7z3';
const FDC_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Food mappings from current foods to FDC search terms
const FOOD_MAPPINGS = [
  { current: 'Chicken (skinless)', color: 'blue', fdcSearch: 'chicken breast raw' },
  { current: 'Turkey (skinless)', color: 'blue', fdcSearch: 'turkey breast raw' },
  { current: 'Beef, Lamb, Pork (grass-fed)', color: 'yellow', fdcSearch: 'beef lean raw' },
  { current: 'Duck (skinless)', color: 'yellow', fdcSearch: 'duck breast raw' },
  { current: 'Liver', color: 'yellow', fdcSearch: 'chicken liver raw' },
  { current: 'Salmon (wild-caught)', color: 'blue', fdcSearch: 'salmon atlantic raw' },
  { current: 'Sardines', color: 'blue', fdcSearch: 'sardines raw' },
  { current: 'Mackerel', color: 'blue', fdcSearch: 'mackerel atlantic raw' },
  { current: 'Arctic Char', color: 'blue', fdcSearch: 'arctic char raw' },
  { current: 'Sweet Potato', color: 'yellow', fdcSearch: 'sweet potato raw' },
  { current: 'Beets', color: 'blue', fdcSearch: 'beets raw' },
  { current: 'Cassava', color: 'yellow', fdcSearch: 'cassava raw' },
  { current: 'Spinach', color: 'blue', fdcSearch: 'spinach raw' },
  { current: 'Kale', color: 'blue', fdcSearch: 'kale raw' },
  { current: 'Broccoli', color: 'blue', fdcSearch: 'broccoli raw' },
  { current: 'Cauliflower', color: 'blue', fdcSearch: 'cauliflower raw' },
  { current: 'Bell Peppers', color: 'blue', fdcSearch: 'peppers sweet raw' },
  { current: 'Berries (mixed)', color: 'blue', fdcSearch: 'blueberries raw' },
  { current: 'Lemon', color: 'blue', fdcSearch: 'lemon raw' },
  { current: 'Lime', color: 'blue', fdcSearch: 'lime raw' },
  { current: 'Grapes', color: 'yellow', fdcSearch: 'grapes raw' },
  { current: 'Apples', color: 'blue', fdcSearch: 'apples raw' },
  { current: 'Banana', color: 'yellow', fdcSearch: 'bananas raw' },
  { current: 'Almonds', color: 'yellow', fdcSearch: 'almonds raw' },
  { current: 'Walnut', color: 'yellow', fdcSearch: 'walnuts raw' },
  { current: 'Chia Seeds', color: 'yellow', fdcSearch: 'chia seeds dried' },
  { current: 'Quinoa', color: 'yellow', fdcSearch: 'quinoa cooked' },
  { current: 'Brown Rice', color: 'yellow', fdcSearch: 'rice brown cooked' },
  { current: 'Oats (steel cut)', color: 'yellow', fdcSearch: 'oats raw' },
  { current: 'Buckwheat', color: 'yellow', fdcSearch: 'buckwheat raw' },
  { current: 'Millet', color: 'yellow', fdcSearch: 'millet raw' },
  { current: 'Eggs', color: 'blue', fdcSearch: 'egg whole raw' },
  { current: 'Greek Yogurt', color: 'blue', fdcSearch: 'yogurt greek plain' },
  { current: 'Avocado', color: 'yellow', fdcSearch: 'avocado raw' },
  { current: 'Olive Oil', color: 'yellow', fdcSearch: 'oil olive' },
  { current: 'Coconut Oil', color: 'yellow', fdcSearch: 'oil coconut' }
];

class FDCMigration {
  constructor() {
    this.apiKey = FDC_API_KEY;
    this.baseUrl = FDC_BASE_URL;
  }

  async searchFDCFood(searchTerm) {
    try {
      console.log(`   Query: "${searchTerm}"`);
      
      const response = await fetch(`${this.baseUrl}/foods/search?api_key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchTerm,
          pageSize: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const foods = data.foods || [];
      
      if (foods.length === 0) {
        return null;
      }

      // Filter for better matches
      const goodMatches = foods.filter(food => {
        const desc = food.description.toLowerCase();
        const hasNutrition = food.foodNutrients && food.foodNutrients.length > 0;
        const notBranded = !food.brandOwner;
        const notProcessed = !desc.includes('baby food') && 
                           !desc.includes('fast foods') &&
                           !desc.includes('restaurant');
        
        return hasNutrition && notBranded && notProcessed;
      });

      return goodMatches[0] || foods[0];
    } catch (error) {
      console.error(`   ❌ Search failed: ${error.message}`);
      return null;
    }
  }

  convertFDCToFoodItem(fdcFood, originalName, colorCategory) {
    // Extract nutritional information
    const nutrients = fdcFood.foodNutrients || [];
    const calories = this.getNutrientValue(nutrients, 'Energy');
    const protein = this.getNutrientValue(nutrients, 'Protein');
    const carbs = this.getNutrientValue(nutrients, 'Carbohydrate, by difference');
    const fat = this.getNutrientValue(nutrients, 'Total lipid (fat)');
    const fiber = this.getNutrientValue(nutrients, 'Fiber, total dietary');

    return {
      name: fdcFood.description.toLowerCase(),
      category: colorCategory,
      description: `${fdcFood.description} - USDA verified nutritional data (replaces: ${originalName})`,
      servingSize: '1 serving',
      portionGuidelines: this.getPortionGuidelines(colorCategory),
      nutritionalInfo: {
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        fiber: Math.round(fiber)
      },
      fdcId: fdcFood.fdcId,
      isGlobal: true,
      isStandard: true,
      source: 'standard',
      tags: ['usda', 'standard', 'verified', colorCategory],
      originalName: originalName,
      migrationDate: new Date().toISOString()
    };
  }

  getNutrientValue(nutrients, nutrientName) {
    const nutrient = nutrients.find(n => 
      n.nutrientName && n.nutrientName.toLowerCase().includes(nutrientName.toLowerCase())
    );
    return nutrient ? (nutrient.value || 0) : 0;
  }

  getPortionGuidelines(colorCategory) {
    switch (colorCategory) {
      case 'blue':
        return 'Unlimited - eat freely as part of balanced meals. Focus on variety and quality.';
      case 'yellow':
        return 'Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.';
      case 'red':
        return 'Limited portions - small amounts occasionally. Choose quality sources and pair with blue/yellow foods.';
      default:
        return 'Follow standard portion guidelines for balanced nutrition.';
    }
  }

  calculateConfidence(originalName, fdcDescription) {
    const original = originalName.toLowerCase();
    const fdc = fdcDescription.toLowerCase();
    
    const originalWords = original.split(/\s+/).filter(word => word.length > 2);
    const matchedWords = originalWords.filter(word => fdc.includes(word));
    
    return originalWords.length > 0 ? matchedWords.length / originalWords.length : 0;
  }

  async migrateFoods() {
    console.log(`🔑 FDC API Key found: ${this.apiKey.substring(0, 8)}...`);
    console.log('🚀 Starting FDC migration...');
    console.log(`📊 Migrating ${FOOD_MAPPINGS.length} foods to FDC equivalents\n`);
    
    const results = {
      successful: [],
      failed: [],
      fdcFoods: []
    };

    for (let i = 0; i < FOOD_MAPPINGS.length; i++) {
      const mapping = FOOD_MAPPINGS[i];
      console.log(`[${i + 1}/${FOOD_MAPPINGS.length}] 🔍 Searching for: ${mapping.current}`);
      
      const fdcFood = await this.searchFDCFood(mapping.fdcSearch);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!fdcFood) {
        console.log(`   ❌ No match found for: ${mapping.current}\n`);
        results.failed.push({
          original: mapping.current,
          searchTerm: mapping.fdcSearch,
          reason: 'No matches found'
        });
        continue;
      }

      const convertedFood = this.convertFDCToFoodItem(fdcFood, mapping.current, mapping.color);
      const confidence = this.calculateConfidence(mapping.current, fdcFood.description);

      console.log(`   ✅ Found: ${fdcFood.description}`);
      console.log(`   📋 FDC ID: ${fdcFood.fdcId}`);
      console.log(`   🎯 Confidence: ${Math.round(confidence * 100)}%`);
      console.log(`   🏷️  Category: ${mapping.color}\n`);

      results.successful.push({
        original: mapping.current,
        fdc: convertedFood,
        fdcId: fdcFood.fdcId,
        confidence: confidence
      });

      results.fdcFoods.push(convertedFood);
    }

    // Generate output files
    await this.generateMigrationResults(results);
    await this.generateStandardFoodsFile(results.fdcFoods);

    // Print summary
    this.printMigrationSummary(results);
  }

  async generateMigrationResults(results) {
    const fs = require('fs');
    const output = {
      migrationDate: new Date().toISOString(),
      summary: {
        total: FOOD_MAPPINGS.length,
        successful: results.successful.length,
        failed: results.failed.length,
        successRate: Math.round((results.successful.length / FOOD_MAPPINGS.length) * 100)
      },
      successful: results.successful,
      failed: results.failed
    };

    fs.writeFileSync('migration-results.json', JSON.stringify(output, null, 2));
  }

  async generateStandardFoodsFile(fdcFoods) {
    const fs = require('fs');
    const content = `/**
 * Standard Foods Database
 * Generated from USDA FoodData Central API
 * Migration Date: ${new Date().toISOString()}
 */

import { Food } from '../types';

export const standardFoods: Food[] = ${JSON.stringify(fdcFoods, null, 2)};

export default standardFoods;
`;

    fs.writeFileSync('src/lib/data/standardFoods.ts', content);
  }

  printMigrationSummary(results) {
    console.log('============================================================');
    console.log('📊 MIGRATION RESULTS');
    console.log('============================================================');
    console.log(`✅ Successful: ${results.successful.length}/${FOOD_MAPPINGS.length}`);
    console.log(`❌ Failed: ${results.failed.length}/${FOOD_MAPPINGS.length}`);
    console.log(`📈 Success Rate: ${Math.round((results.successful.length / FOOD_MAPPINGS.length) * 100)}%`);
    
    if (results.failed.length > 0) {
      console.log('❌ Failed foods:');
      results.failed.forEach(failure => {
        console.log(`   - ${failure.original} (searched: "${failure.searchTerm}")`);
      });
    }
    
    console.log('💾 Files generated:');
    console.log('   📄 migration-results.json - Full migration details');
    console.log('   📄 src/lib/data/standardFoods.ts - New standard foods database');
    console.log('🎯 Next Steps:');
    console.log('1. Review migration-results.json for accuracy');
    console.log('2. Test the new standard foods: npm run dev');
    console.log('3. Update your components to use standardFoods instead of comprehensiveFoods');
    console.log('4. Deploy the changes');
  }
}

// Run migration immediately
async function runMigration() {
  try {
    const migration = new FDCMigration();
    await migration.migrateFoods();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

module.exports = { FDCMigration, FOOD_MAPPINGS };
