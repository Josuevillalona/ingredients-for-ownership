// Simple client SDK seeding script - uses regular Firebase authentication
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
require('dotenv').config({ path: '.env.local' });

// Simple token generator for testing
const generateShareToken = (prefix = 'demo') => {
  return `${prefix}-${Math.random().toString(36).substring(2, 15)}`;
};

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Import food data
const { foodCategories } = require('./food-data');

// Extract all foods from categories
const getAllFoods = () => {
  const foods = [];
  foodCategories.forEach(category => {
    if (category.foods && Array.isArray(category.foods)) {
      foods.push(...category.foods);
    }
  });
  return foods;
};

// Simplified food categories data for seeding
const seedFoodCategories = async () => {
  console.log('🌱 Starting food categories seeding...');
  
  const batch = writeBatch(db);
  
  foodCategories.forEach((category) => {
    const docRef = doc(collection(db, 'food-categories'), category.id);
    batch.set(docRef, {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  
  await batch.commit();
  console.log(`✅ Successfully seeded ${foodCategories.length} food categories`);
};

// Seed individual foods
const seedFoods = async () => {
  console.log('🥗 Starting foods seeding...');
  
  const foods = getAllFoods();
  
  // Process foods in batches of 500 (Firestore batch limit)
  const batchSize = 500;
  const batches = [];
  
  for (let i = 0; i < foods.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchFoods = foods.slice(i, i + batchSize);
    
    batchFoods.forEach((food) => {
      const docRef = doc(collection(db, 'foods'), food.id);
      batch.set(docRef, {
        ...food,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    batches.push(batch);
  }
  
  // Execute all batches
  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`✅ Completed batch ${i + 1}/${batches.length}`);
  }
  
  console.log(`✅ Successfully seeded ${foods.length} foods`);
};

// Seed sample ingredient documents
const seedIngredientDocuments = async () => {
  console.log('📋 Starting ingredient documents seeding...');
  
  // Create a demo coach account (you'll need to create this user in Firebase Auth manually)
  const demoCoachId = 'demo-coach-123';
  
  const sampleDocuments = [
    {
      id: 'sample-breakfast-plan',
      coachId: demoCoachId,
      title: 'Healthy Breakfast Plan',
      description: 'A balanced breakfast focusing on blue and yellow foods',
      shareToken: generateShareToken('breakfast'),
      categories: [
        {
          id: 'grains',
          name: 'Grains & Cereals',
          selectedFoods: [
            { foodId: 'oatmeal', quantity: '1 cup', color: 'blue' },
            { foodId: 'whole-wheat-toast', quantity: '2 slices', color: 'yellow' }
          ]
        },
        {
          id: 'fruits',
          name: 'Fruits',
          selectedFoods: [
            { foodId: 'banana', quantity: '1 medium', color: 'blue' },
            { foodId: 'blueberries', quantity: '1/2 cup', color: 'blue' }
          ]
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'sample-lunch-plan',
      coachId: demoCoachId,
      title: 'Power Lunch Plan',
      description: 'Protein-rich lunch with vegetables and moderate carbs',
      shareToken: generateShareToken('lunch'),
      categories: [
        {
          id: 'proteins',
          name: 'Proteins',
          selectedFoods: [
            { foodId: 'grilled-chicken', quantity: '4 oz', color: 'blue' },
            { foodId: 'chickpeas', quantity: '1/2 cup', color: 'blue' }
          ]
        },
        {
          id: 'vegetables',
          name: 'Vegetables',
          selectedFoods: [
            { foodId: 'mixed-greens', quantity: '2 cups', color: 'blue' },
            { foodId: 'cherry-tomatoes', quantity: '1 cup', color: 'blue' }
          ]
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const batch = writeBatch(db);
  
  sampleDocuments.forEach((document) => {
    const docRef = doc(collection(db, 'ingredient-documents'), document.id);
    batch.set(docRef, document);
  });
  
  await batch.commit();
  console.log(`✅ Successfully seeded ${sampleDocuments.length} ingredient documents`);
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🚀 Starting Firestore database seeding...');
    console.log('📋 This will create:');
    console.log('   - food-categories collection with all food data');
    console.log('   - foods collection with individual food items');
    console.log('   - ingredient-documents collection with sample documents');
    console.log('');
    
    // Check if we have an email/password for authentication
    const adminEmail = process.env.FIREBASE_ADMIN_EMAIL;
    const adminPassword = process.env.FIREBASE_ADMIN_PASSWORD;
    
    if (adminEmail && adminPassword) {
      console.log('🔐 Signing in with admin credentials...');
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('✅ Successfully authenticated');
    } else {
      console.log('⚠️  No admin credentials found - attempting unauthenticated seed');
      console.log('   (This may fail depending on security rules)');
    }
    
    // Execute seeding operations
    await seedFoodCategories();
    await seedFoods();
    await seedIngredientDocuments();
    
    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Verify data in Firebase Console');
    console.log('2. Test the application with seeded data');
    console.log('3. Restore production security rules');
    
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
