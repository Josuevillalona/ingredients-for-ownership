/**
 * Database Cleanup Script - Clean Slate for Global Food Database
 * This script removes all existing food documents to start with a clean slate
 * where coaches must save foods from the FDC API before they appear.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

/**
 * Clean all food documents from the foods collection
 */
async function cleanupFoods() {
  console.log('🧹 Starting food database cleanup...');
  console.log(`📋 Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE CLEANUP'}`);
  
  try {
    // Get all documents in the foods collection
    const foodsSnapshot = await db.collection('foods').get();
    console.log(`📊 Found ${foodsSnapshot.docs.length} food documents`);
    
    if (foodsSnapshot.docs.length === 0) {
      console.log('✅ Food database is already empty');
      return;
    }
    
    // Show what will be deleted
    console.log('\n📝 Foods to be deleted:');
    foodsSnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.name || 'Unknown'} (ID: ${doc.id})`);
      if (data.addedBy) {
        console.log(`   Added by: ${data.addedByName || data.addedBy}`);
      }
      if (data.source) {
        console.log(`   Source: ${data.source}`);
      }
    });
    
    // Confirm deletion unless force mode
    if (!DRY_RUN && !FORCE) {
      console.log('\n⚠️  This will permanently delete all food documents.');
      console.log('   To proceed, add --force flag to the command.');
      console.log('   To see what would be deleted, use --dry-run flag.');
      return;
    }
    
    if (!DRY_RUN) {
      console.log('\n🗑️  Deleting food documents...');
      
      // Delete in batches of 500 (Firestore limit)
      const batchSize = 500;
      let deletedCount = 0;
      
      for (let i = 0; i < foodsSnapshot.docs.length; i += batchSize) {
        const batch = db.batch();
        const batchDocs = foodsSnapshot.docs.slice(i, i + batchSize);
        
        batchDocs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        deletedCount += batchDocs.length;
        console.log(`   Deleted ${deletedCount}/${foodsSnapshot.docs.length} documents`);
      }
      
      console.log(`✅ Successfully deleted ${deletedCount} food documents`);
    } else {
      console.log('\n✅ DRY RUN: No changes made');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

/**
 * Clean up food categories if they exist
 */
async function cleanupFoodCategories() {
  console.log('\n🧹 Checking for food-categories collection...');
  
  try {
    const categoriesSnapshot = await db.collection('food-categories').get();
    
    if (categoriesSnapshot.docs.length === 0) {
      console.log('✅ No food categories found');
      return;
    }
    
    console.log(`📊 Found ${categoriesSnapshot.docs.length} food category documents`);
    
    if (!DRY_RUN) {
      console.log('🗑️  Deleting food category documents...');
      
      const batch = db.batch();
      categoriesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Successfully deleted ${categoriesSnapshot.docs.length} food category documents`);
    } else {
      console.log('✅ DRY RUN: Would delete food categories');
    }
    
  } catch (error) {
    console.error('❌ Error cleaning food categories:', error);
    throw error;
  }
}

/**
 * Main cleanup function
 */
async function main() {
  console.log('🚀 Global Food Database Cleanup Tool');
  console.log('=====================================');
  
  try {
    await cleanupFoods();
    await cleanupFoodCategories();
    
    console.log('\n🎉 Cleanup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. The food database is now empty');
    console.log('2. Coaches will need to search and save foods from the FDC API');
    console.log('3. Saved foods will appear in /dashboard/foods');
    console.log('4. Only saved foods will be available for plan creation');
    
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Run the cleanup
main().then(() => {
  console.log('\n✅ Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});