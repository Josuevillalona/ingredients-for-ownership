/**
 * Admin seeding script for Firestore database
 * Uses Firebase Admin SDK with service account for authenticated writes
 */

const admin = require('firebase-admin');
const { resolve } = require('path');

// Load environment variables
require('dotenv').config({ path: resolve(__dirname, '../.env.local') });

// Import the food categories data
const { foodCategories } = require('./food-data.js');

/**
 * Initialize Firebase Admin
 */
function initializeFirebaseAdmin() {
  try {
    // For local development, we'll use the Firebase emulator or project default credentials
    // In production, you would use a service account key file
    
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: projectId
      });
    }
    
    const db = admin.firestore();
    return db;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

/**
 * Seed food categories collection with admin privileges
 */
async function seedFoodCategories(db) {
  console.log('🌱 Starting food categories seeding with Admin SDK...');
  
  try {
    const batch = db.batch();
    let count = 0;
    
    // Add each food category to the batch
    foodCategories.forEach((category) => {
      const docRef = db.collection('food-categories').doc(category.id);
      
      // Clean the category data to ensure Firestore compatibility
      const cleanCategory = {
        id: String(category.id),
        name: String(category.name),
        order: Number(category.order),
        description: String(category.description || ''),
        foods: category.foods.map(food => ({
          id: String(food.id),
          name: String(food.name),
          categoryId: String(food.categoryId),
          servingSize: String(food.servingSize || ''),
          nutritionalHighlights: Array.isArray(food.nutritionalHighlights) ? food.nutritionalHighlights.map(String) : [],
          warnings: Array.isArray(food.warnings) ? food.warnings.map(String) : [],
          notes: String(food.notes || ''),
          fdcId: food.fdcId ? Number(food.fdcId) : null
        })),
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      };
      
      batch.set(docRef, cleanCategory);
      count++;
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`✅ Successfully seeded ${count} food categories`);
    
    // Log categories summary
    foodCategories.forEach(category => {
      console.log(`📁 ${category.name}: ${category.foods.length} foods`);
    });
    
    const totalFoods = foodCategories.reduce((sum, cat) => sum + cat.foods.length, 0);
    console.log(`📊 Total foods across all categories: ${totalFoods}`);
    
  } catch (error) {
    console.error('❌ Error seeding food categories:', error);
    throw error;
  }
}

/**
 * Create individual food documents for easier querying
 */
async function seedIndividualFoods(db) {
  console.log('🌱 Starting individual foods seeding...');
  
  try {
    const batch = db.batch();
    let count = 0;
    
    // Extract all foods from categories
    const allFoods = [];
    foodCategories.forEach(category => {
      category.foods.forEach(food => {
        const cleanFood = {
          id: String(food.id),
          name: String(food.name),
          categoryId: String(category.id),
          categoryName: String(category.name),
          servingSize: String(food.servingSize || ''),
          nutritionalHighlights: Array.isArray(food.nutritionalHighlights) ? food.nutritionalHighlights.map(String) : [],
          warnings: Array.isArray(food.warnings) ? food.warnings.map(String) : [],
          notes: String(food.notes || ''),
          fdcId: food.fdcId ? Number(food.fdcId) : null,
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now()
        };
        allFoods.push(cleanFood);
      });
    });
    
    // Add each food to the batch
    allFoods.forEach((food) => {
      const docRef = db.collection('foods').doc(food.id);
      batch.set(docRef, food);
      count++;
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`✅ Successfully seeded ${count} individual food items`);
    
  } catch (error) {
    console.error('❌ Error seeding individual foods:', error);
    throw error;
  }
}

/**
 * Create sample ingredient documents for testing
 */
async function seedSampleIngredientDocuments(db) {
  console.log('🌱 Starting sample ingredient documents seeding...');
  
  try {
    const { nanoid } = require('nanoid');
    const batch = db.batch();
    
    // Sample coach ID (in production, this would be real user IDs)
    const sampleCoachId = 'demo-coach-123';
    
    // Sample ingredient documents
    const sampleDocuments = [
      {
        clientName: 'Sarah Johnson',
        coachId: sampleCoachId,
        status: 'published',
        ingredients: [
          {
            foodId: 'chicken-breast',
            categoryId: 'lean-proteins',
            colorCode: 'blue',
            isSelected: true,
            clientChecked: false,
            notes: 'Great source of lean protein'
          },
          {
            foodId: 'spinach',
            categoryId: 'non-starchy-vegetables',
            colorCode: 'blue',
            isSelected: true,
            clientChecked: true,
            notes: 'Rich in iron and vitamins'
          },
          {
            foodId: 'quinoa',
            categoryId: 'smart-carbs',
            colorCode: 'yellow',
            isSelected: true,
            clientChecked: false,
            notes: 'Complete protein grain'
          }
        ],
        shareToken: nanoid(),
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      },
      {
        clientName: 'Mike Chen',
        coachId: sampleCoachId,
        status: 'draft',
        ingredients: [
          {
            foodId: 'salmon',
            categoryId: 'lean-proteins',
            colorCode: 'blue',
            isSelected: true,
            clientChecked: false,
            notes: 'Omega-3 rich fish'
          },
          {
            foodId: 'sweet-potato',
            categoryId: 'smart-carbs',
            colorCode: 'yellow',
            isSelected: true,
            clientChecked: false,
            notes: 'Complex carbohydrate'
          }
        ],
        shareToken: nanoid(),
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      }
    ];
    
    // Add each document to the batch
    sampleDocuments.forEach((document) => {
      const docRef = db.collection('ingredient-documents').doc();
      batch.set(docRef, document);
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`✅ Successfully seeded ${sampleDocuments.length} sample ingredient documents`);
    console.log(`🔗 Sample coach ID for testing: ${sampleCoachId}`);
    
  } catch (error) {
    console.error('❌ Error seeding sample documents:', error);
    throw error;
  }
}

/**
 * Main seeding function using Admin SDK
 */
async function seedDatabaseAdmin() {
  console.log('🚀 Starting Firestore database seeding with Admin SDK...');
  console.log('📋 This will create:');
  console.log('   - food-categories collection with all food data');
  console.log('   - foods collection with individual food items');
  console.log('   - ingredient-documents collection with sample documents');
  console.log('');
  
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      throw new Error('Missing Firebase configuration. Please check your .env.local file.');
    }
    
    const db = initializeFirebaseAdmin();
    console.log(`🔥 Connected to Firebase project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    
    // Seed all collections
    await seedFoodCategories(db);
    console.log('');
    
    await seedIndividualFoods(db);
    console.log('');
    
    await seedSampleIngredientDocuments(db);
    console.log('');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - ${foodCategories.length} food categories`);
    const totalFoods = foodCategories.reduce((sum, cat) => sum + cat.foods.length, 0);
    console.log(`   - ${totalFoods} individual foods`);
    console.log('   - 2 sample ingredient documents');
    console.log('');
    console.log('🔗 You can now test the application with the demo coach ID: demo-coach-123');
    console.log('');
    console.log('✅ Layer 1 Foundation is now 100% COMPLETE!');
    
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    
    if (error.code === 'permission-denied') {
      console.log('');
      console.log('🔧 Authentication Issue:');
      console.log('The Admin SDK needs proper authentication. Options:');
      console.log('1. Run: firebase login');
      console.log('2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable');
      console.log('3. Or run this in a Firebase Functions environment');
    }
    
    process.exit(1);
  }
}

/**
 * Run the admin seeding script
 */
if (require.main === module) {
  seedDatabaseAdmin()
    .then(() => {
      console.log('✨ Admin seeding script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = {
  seedDatabaseAdmin,
  seedFoodCategories,
  seedIndividualFoods,
  seedSampleIngredientDocuments
};
