/**
 * Minimal test script to verify basic Firestore seeding works
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc, Timestamp } = require('firebase/firestore');
const { resolve } = require('path');

// Load environment variables
require('dotenv').config({ path: resolve(__dirname, '../.env.local') });

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Minimal test data
const testCategories = [
  {
    id: 'proteins',
    name: 'Proteins',
    order: 1,
    description: 'Protein sources',
    foods: [
      {
        id: 'chicken',
        name: 'Chicken Breast',
        categoryId: 'proteins',
        servingSize: '4 oz',
        nutritionalHighlights: ['protein'],
        fdcId: 171477
      }
    ]
  }
];

async function seedMinimalData() {
  console.log('🧪 Testing minimal Firestore seeding...');
  
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log(`🔥 Connected to Firebase project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    
    const batch = writeBatch(db);
    
    testCategories.forEach((category) => {
      const docRef = doc(collection(db, 'food-categories'), category.id);
      
      // Ultra-clean data structure
      const cleanCategory = {
        id: category.id,
        name: category.name,
        order: category.order,
        description: category.description,
        foods: category.foods.map(food => ({
          id: food.id,
          name: food.name,
          categoryId: food.categoryId,
          servingSize: food.servingSize,
          nutritionalHighlights: food.nutritionalHighlights,
          fdcId: food.fdcId
        })),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      console.log('📝 Adding category:', cleanCategory.id);
      batch.set(docRef, cleanCategory);
    });
    
    console.log('🚀 Committing batch...');
    await batch.commit();
    console.log('✅ Minimal seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Minimal seeding failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
}

if (require.main === module) {
  seedMinimalData()
    .then(() => {
      console.log('✨ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}
