import { FOOD_CATEGORIES, FOOD_DATABASE_STATS } from '../data/food-categories';
import { isValidFoodCategory, isValidFood } from '../types/ingredient-document';

/**
 * Test function to validate complete food category data structure
 * Run this before attempting database seeding
 */
export function validateFoodCategoryData(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  console.log('🧪 Testing complete food database structure...');
  console.log(`📊 Database Stats:`, FOOD_DATABASE_STATS);
  
  try {
    // Test each category
    for (const category of FOOD_CATEGORIES) {
      const categoryName = (category as any)?.name || 'unknown';
      console.log(`Testing category: ${categoryName}`);
      
      if (!isValidFoodCategory(category)) {
        errors.push(`Invalid category structure: ${(category as any)?.id || 'unknown'}`);
        continue;
      }
      
      // Test each food in the category
      for (const food of category.foods) {
        if (!isValidFood(food)) {
          errors.push(`Invalid food structure: ${(food as any)?.id || 'unknown'} in ${categoryName}`);
        }
        
        // Verify food belongs to this category
        if (food.categoryId !== category.id) {
          errors.push(`Food categoryId mismatch: ${food.id} (expected: ${category.id}, got: ${food.categoryId})`);
        }
      }
    }
    
    if (errors.length === 0) {
      console.log('✅ All food category data is valid!');
      console.log(`📊 Total: ${FOOD_DATABASE_STATS.totalCategories} categories with ${FOOD_DATABASE_STATS.totalFoods} total foods`);
      FOOD_DATABASE_STATS.categoriesWithCounts.forEach(cat => {
        console.log(`  - ${cat.name}: ${cat.count} items`);
      });
      return { isValid: true, errors: [] };
    } else {
      console.log('❌ Found validation errors:', errors);
      return { isValid: false, errors };
    }
    
  } catch (error) {
    console.error('❌ Validation failed with error:', error);
    return { isValid: false, errors: [`Validation error: ${error}`] };
  }
}

/**
 * Simple test runner - can be called from terminal or component
 */
export function runFoodDataValidation(): void {
  const result = validateFoodCategoryData();
  
  if (result.isValid) {
    console.log('🎉 Food data validation passed!');
  } else {
    console.error('💥 Food data validation failed:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  }
}
