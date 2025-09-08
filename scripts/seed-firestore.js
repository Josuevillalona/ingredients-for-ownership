/**
 * Script to seed the Firestore database with the complete food categories
 * This creates a collection structure for ingredient documents with food data
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc, Timestamp } = require('firebase/firestore');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// Firebase config - these should match your .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Load environment variables
require('dotenv').config({ path: resolve(__dirname, '../.env.local') });

// Import the food categories data
const { foodCategories } = require('./food-data.js');

/**
 * Initialize Firebase
 */
function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return db;
}

/**
 * Seed food categories collection
 */
async function seedFoodCategories(db) {
  console.log('🌱 Starting food categories seeding...');
  
  try {
    const batch = writeBatch(db);
    let count = 0;
    
    // Add each food category to the batch
    foodCategories.forEach((category) => {
      const docRef = doc(collection(db, 'food-categories'), category.id);
      
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
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
    const batch = writeBatch(db);
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
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        allFoods.push(cleanFood);
      });
    });
    
    // Add each food to the batch
    allFoods.forEach((food) => {
      const docRef = doc(collection(db, 'foods'), food.id);
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
    const batch = writeBatch(db);
    
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];
    
    // Add each document to the batch
    sampleDocuments.forEach((document) => {
      const docRef = doc(collection(db, 'ingredient-documents'));
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
 * Main seeding function
 */
async function seedDatabase() {
  console.log('🚀 Starting Firestore database seeding...');
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
    
    const db = initializeFirebase();
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
    
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

/**
 * Run the seeding script
 */
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

module.exports = {
  seedDatabase,
  seedFoodCategories,
  seedIndividualFoods,
  seedSampleIngredientDocuments
};
