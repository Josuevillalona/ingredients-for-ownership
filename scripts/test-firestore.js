/**
 * Simple test script to debug Firestore seeding issues
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore');
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

async function testFirestoreWrite() {
  console.log('🧪 Testing Firestore write operations...');
  
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log(`🔥 Connected to Firebase project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    
    // Test 1: Simple document
    console.log('📝 Test 1: Writing simple document...');
    const simpleDoc = {
      name: 'test',
      value: 123,
      timestamp: Timestamp.now()
    };
    
    await setDoc(doc(db, 'test-collection', 'test-doc-1'), simpleDoc);
    console.log('✅ Simple document written successfully');
    
    // Test 2: Food category structure (minimal)
    console.log('📝 Test 2: Writing minimal food category...');
    const minimalCategory = {
      id: 'test-category',
      name: 'Test Category',
      order: 1,
      description: 'Test description',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(doc(db, 'food-categories', 'test-category'), minimalCategory);
    console.log('✅ Minimal category written successfully');
    
    // Test 3: Food category with foods array
    console.log('📝 Test 3: Writing category with foods array...');
    const categoryWithFoods = {
      id: 'test-category-2',
      name: 'Test Category 2',
      order: 2,
      description: 'Test description 2',
      foods: [
        {
          id: 'test-food-1',
          name: 'Test Food 1',
          categoryId: 'test-category-2',
          servingSize: '1 cup',
          nutritionalHighlights: ['protein'],
          warnings: [],
          notes: '',
          fdcId: null
        }
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(doc(db, 'food-categories', 'test-category-2'), categoryWithFoods);
    console.log('✅ Category with foods written successfully');
    
    console.log('🎉 All tests passed! Firestore is working correctly.');
    console.log('🔍 The issue might be with the specific data in food-data.js');
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    
    if (error.code === 'invalid-argument') {
      console.log('💡 This suggests an issue with field names or data types');
      console.log('🔍 Common causes:');
      console.log('   - Invalid characters in document IDs');
      console.log('   - Unsupported data types');
      console.log('   - Nested objects too deep');
      console.log('   - Array elements with invalid types');
    }
  }
}

if (require.main === module) {
  testFirestoreWrite()
    .then(() => {
      console.log('✨ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}
