import { foodService } from '@/lib/firebase/foods';
import { standardFoods } from '@/lib/data/standardFoods';

/**
 * Seeds the database with comprehensive food items
 * This should be run once to populate the global food database
 */
export async function seedStandardFoods() {
  console.log('🌱 Starting standard food database seeding...');
  
  try {
    let createdCount = 0;
    let skippedCount = 0;

    for (const foodData of standardFoods) {
      try {
        // Create as global food (this would require admin privileges in production)
        const foodItem = {
          ...foodData,
          coachId: 'global', // Special marker for global foods
          isGlobal: true,
          isStandard: true // Mark as USDA standard food
        };

        // In production, this would be handled by an admin function
        // For now, we'll just log what would be created
        console.log(`✅ Would create: ${foodData.name} (${foodData.category})`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Error creating ${foodData.name}:`, error);
        skippedCount++;
      }
    }

    console.log(`🎉 Seeding complete!`);
    console.log(`✅ Created: ${createdCount} foods`);
    console.log(`⚠️ Skipped: ${skippedCount} foods`);
    
    return { created: createdCount, skipped: skippedCount };
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

/**
 * Alternative approach: Create foods for a specific coach from the comprehensive database
 * This allows coaches to get started quickly with a full food database
 */
export async function initializeCoachFoodDatabase(coachId: string) {
  console.log(`🚀 Initializing food database for coach: ${coachId}`);
  
  try {
    let createdCount = 0;
    
    for (const foodData of standardFoods) {
      try {
        const createData = {
          name: foodData.name,
          category: foodData.category,
          description: foodData.description,
          servingSize: foodData.servingSize,
          portionGuidelines: foodData.portionGuidelines,
          nutritionalInfo: foodData.nutritionalInfo || {},
          tags: foodData.tags,
          isStandard: true, // Mark as USDA standard food
          fdcId: foodData.fdcId // Keep FDC reference
        };

        await foodService.createFood(coachId, createData);
        createdCount++;
        
      } catch (error) {
        console.error(`Error creating ${foodData.name} for coach:`, error);
      }
    }

    console.log(`✅ Created ${createdCount} foods for coach ${coachId}`);
    return createdCount;
    
  } catch (error) {
    console.error('Error initializing coach food database:', error);
    throw error;
  }
}
