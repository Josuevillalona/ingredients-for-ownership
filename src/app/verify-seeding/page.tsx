'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { FOOD_CATEGORIES, FOOD_DATABASE_STATS } from '@/lib/data/food-categories';
import { foodNutritionService } from '@/lib/services/food-nutrition';

// Type definitions for seeded data

interface DatabaseStats {
  foodCategories: number;
  foods: number;
  ingredientDocuments: number;
  loading: boolean;
  error?: string;
  verificationTime?: number;
}

interface NutritionTestResult {
  success: boolean;
  responseTime?: number;
  error?: string;
  sampleData?: any;
}

interface SampleData {
  foodCategories: SeededFoodCategory[];
  foods: SeededFood[];
  ingredientDocuments: SeededIngredientDocument[];
}

// Interfaces for seeded data (which may have different structure than production types)
interface SeededFoodCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  foods?: SeededFood[];
}

interface SeededFood {
  id: string;
  name: string;
  categoryId: string;
  servingSize?: string;
  nutritionalHighlights?: string[];
  fdcId?: number;
  warnings?: string[];
}

interface SeededIngredientDocument {
  id: string;
  title?: string;
  description?: string;
  coachId: string;
  shareToken: string;
  categories?: any[];
  isActive?: boolean;
  clientName?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface DatabaseVerificationResult {
  stats: DatabaseStats;
  sampleData: SampleData;
  isSeeded: boolean;
}

export default function DatabaseVerificationPage() {
  const [stats, setStats] = useState<DatabaseStats>({
    foodCategories: 0,
    foods: 0,
    ingredientDocuments: 0,
    loading: true
  });
  
  const [sampleData, setSampleData] = useState<SampleData>({
    foodCategories: [],
    foods: [],
    ingredientDocuments: []
  });

  const [nutritionTest, setNutritionTest] = useState<NutritionTestResult>({
    success: false
  });

  const [activeTab, setActiveTab] = useState<'database' | 'nutrition' | 'typescript'>('database');

  useEffect(() => {
    const verifyDatabase = async () => {
      const startTime = performance.now();
      
      try {
        console.log('🔍 Verifying database seeding...');
        console.log('🔥 Firebase Auth state:', auth?.currentUser?.uid || 'Not authenticated');
        
        // Check food-categories collection (should be publicly readable)
        console.log('📂 Checking food-categories collection...');
        const foodCategoriesQuery = query(collection(db, 'food-categories'));
        const foodCategoriesSnapshot = await getDocs(foodCategoriesQuery);
        const foodCategoriesData = foodCategoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as SeededFoodCategory));
        console.log('✅ Food categories loaded:', foodCategoriesSnapshot.size);
        
        // Check foods collection (should be publicly readable)
        console.log('🥗 Checking foods collection...');
        const foodsQuery = query(collection(db, 'foods'));
        const foodsSnapshot = await getDocs(foodsQuery);
        const foodsData = foodsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as SeededFood));
        console.log('✅ Foods loaded:', foodsSnapshot.size);
        
        // Check ingredient-documents collection (may require authentication)
        console.log('📋 Checking ingredient-documents collection...');
        let ingredientDocsData: SeededIngredientDocument[] = [];
        let ingredientDocsCount = 0;
        
        try {
          const ingredientDocsQuery = query(collection(db, 'ingredient-documents'));
          const ingredientDocsSnapshot = await getDocs(ingredientDocsQuery);
          ingredientDocsData = ingredientDocsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as SeededIngredientDocument));
          ingredientDocsCount = ingredientDocsSnapshot.size;
          console.log('✅ Ingredient documents loaded:', ingredientDocsCount);
        } catch (docsError) {
          console.warn('⚠️ Could not load ingredient documents (likely auth required):', docsError);
          // This is expected if not authenticated - ingredient docs require auth unless shared
        }
        
        // Calculate verification time
        const endTime = performance.now();
        const verificationTime = Math.round(endTime - startTime);
        
        // Validate data integrity
        const hasValidData = foodCategoriesData.length > 0 && foodsData.length > 0;
        
        setStats({
          foodCategories: foodCategoriesSnapshot.size,
          foods: foodsSnapshot.size,
          ingredientDocuments: ingredientDocsCount,
          loading: false,
          verificationTime
        });
        
        setSampleData({
          foodCategories: foodCategoriesData.slice(0, 3),
          foods: foodsData.slice(0, 5),
          ingredientDocuments: ingredientDocsData
        });
        
        console.log('✅ Database verification complete:', {
          foodCategories: foodCategoriesSnapshot.size,
          foods: foodsSnapshot.size,
          ingredientDocuments: ingredientDocsCount,
          hasValidData,
          verificationTime: `${verificationTime}ms`
        });
        
      } catch (error) {
        console.error('❌ Database verification failed:', error);
        
        // Calculate verification time even on error
        const endTime = performance.now();
        const verificationTime = Math.round(endTime - startTime);
        
        // Provide more specific error messages
        let errorMessage = 'Unknown error occurred';
        if (error instanceof Error) {
          if (error.message.includes('permission-denied') || error.message.includes('Missing or insufficient permissions')) {
            errorMessage = 'Permission denied - this may be expected for some collections without authentication. Food data should still be accessible.';
          } else if (error.message.includes('unavailable')) {
            errorMessage = 'Firestore service unavailable - check network connection';
          } else {
            errorMessage = error.message;
          }
        }
        
        setStats({
          foodCategories: 0,
          foods: 0,
          ingredientDocuments: 0,
          loading: false,
          error: errorMessage,
          verificationTime
        });
      }
    };

    verifyDatabase();
  }, []);

  const testNutritionAPI = async () => {
    const startTime = performance.now();
    setNutritionTest({ success: false });
    
    try {
      console.log('🧪 Testing nutrition API...');
      
      // Find a food with FDC ID from TypeScript database
      let testFood = null;
      
      // Look through all categories to find a food with an FDC ID
      for (const category of FOOD_CATEGORIES) {
        const foodWithFdc = category.foods.find(food => food.fdcId);
        if (foodWithFdc) {
          testFood = foodWithFdc;
          break;
        }
      }
      
      if (!testFood || !testFood.fdcId) {
        throw new Error('No test food with FDC ID found in database');
      }
      
      console.log('🎯 Testing with food:', testFood.name, 'FDC ID:', testFood.fdcId);
      
      const nutritionData = await foodNutritionService.getNutritionalInfo(testFood);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (!nutritionData) {
        throw new Error('No nutrition data returned');
      }
      
      setNutritionTest({
        success: true,
        responseTime,
        sampleData: {
          food: testFood.name,
          calories: nutritionData.calories,
          protein: nutritionData.protein,
          carbs: nutritionData.carbs,
          fat: nutritionData.fat,
          fiber: nutritionData.fiber
        }
      });
      
      console.log('✅ Nutrition API test successful:', nutritionData);
      
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      console.error('❌ Nutrition API test failed:', error);
      setNutritionTest({
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const refreshVerification = () => {
    setStats(prev => ({ ...prev, loading: true, error: undefined }));
    setSampleData({ foodCategories: [], foods: [], ingredientDocuments: [] });
    
    // Re-trigger verification
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Verifying database seeding...</p>
          </div>
        </div>
      </div>
    );
  }

  const isSeeded = stats.foodCategories > 0 && stats.foods > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Development Tools & Verification
          </h1>
          <button
            onClick={refreshVerification}
            disabled={stats.loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {stats.loading ? '🔄 Checking...' : '🔄 Refresh'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'database', label: 'Database Verification', icon: '🗄️' },
                { id: 'nutrition', label: 'Nutrition API Test', icon: '🧪' },
                { id: 'typescript', label: 'TypeScript Database', icon: '📝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'database' && (
          <>
            {/* Overall Status */}
            <div className={`p-6 rounded-lg mb-8 ${
              isSeeded 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            isSeeded ? 'text-green-800' : 'text-red-800'
          }`}>
            {isSeeded ? '✅ Database Successfully Seeded!' : '❌ Database Seeding Incomplete'}
          </h2>
          
          {stats.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700 text-sm">Error: {stats.error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.foodCategories}</div>
              <div className="text-sm text-gray-600">Food Categories</div>
              <div className="text-xs text-gray-500">Expected: 5</div>
              <div className={`text-xs mt-1 ${stats.foodCategories >= 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                {stats.foodCategories >= 5 ? '✅ Complete' : '⚠️ Partial'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.foods}</div>
              <div className="text-sm text-gray-600">Foods</div>
              <div className="text-xs text-gray-500">Expected: 20</div>
              <div className={`text-xs mt-1 ${stats.foods >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                {stats.foods >= 20 ? '✅ Complete' : '⚠️ Partial'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.ingredientDocuments}</div>
              <div className="text-sm text-gray-600">Sample Documents</div>
              <div className="text-xs text-gray-500">Expected: 2</div>
              <div className={`text-xs mt-1 ${stats.ingredientDocuments >= 2 ? 'text-green-600' : 'text-yellow-600'}`}>
                {stats.ingredientDocuments >= 2 ? '✅ Complete' : '⚠️ Partial'}
              </div>
            </div>
          </div>
        </div>

        {/* Sample Data */}
        {isSeeded && (
          <div className="space-y-6">
            {/* Food Categories Sample */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sample Food Categories
              </h3>
              <div className="space-y-3">
                {sampleData.foodCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded p-3">
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-600">{category.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ID: {category.id} | Order: {category.order}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foods Sample */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sample Foods
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleData.foods.map((food) => (
                  <div key={food.id} className="border border-gray-200 rounded p-3">
                    <div className="font-medium text-gray-900">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      Category: {food.categoryId} | Serving: {food.servingSize}
                    </div>
                    {food.fdcId && (
                      <div className="text-xs text-blue-600 mt-1">
                        📊 FDC ID: {food.fdcId}
                      </div>
                    )}
                    {food.nutritionalHighlights && (
                      <div className="text-xs text-green-600 mt-1">
                        Highlights: {food.nutritionalHighlights.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredient Documents Sample */}
            {sampleData.ingredientDocuments.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sample Ingredient Documents
                </h3>
                <div className="space-y-4">
                  {sampleData.ingredientDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded p-4">
                      <div className="font-medium text-gray-900">
                        {doc.title || doc.clientName || 'Untitled Document'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {doc.description || 'No description available'}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Coach ID: {doc.coachId} | Share Token: {doc.shareToken}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Categories: {doc.categories?.length || 0} | 
                        Status: {doc.isActive ? 'Active' : 'Inactive'} |
                        ID: {doc.id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">What This Means:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Food Categories</strong>: The main categories (Meat & Poultry, Seafood, etc.)</li>
            <li>• <strong>Foods</strong>: Individual food items with nutrition integration</li>
            <li>• <strong>Sample Documents</strong>: Test ingredient documents for development</li>
            <li>• All data includes FDC IDs for nutrition API integration</li>
            <li>• Share tokens enable public access to ingredient documents</li>
          </ul>
          
          {stats.verificationTime && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="text-sm text-blue-700">
                <strong>Performance:</strong> Verification completed in {stats.verificationTime}ms
                {stats.verificationTime < 1000 ? ' ⚡ (Fast)' : stats.verificationTime < 3000 ? ' ✅ (Good)' : ' ⚠️ (Slow)'}
              </div>
            </div>
          )}
        </div>
          </>
        )}

        {/* Nutrition API Test Tab */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  FDC API Integration Test
                </h3>
                <button
                  onClick={testNutritionAPI}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  🧪 Test Nutrition API
                </button>
              </div>
              
              {nutritionTest.success ? (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h4 className="text-green-800 font-medium mb-2">✅ API Test Successful</h4>
                  {nutritionTest.sampleData && (
                    <div className="text-sm text-green-700 space-y-1">
                      <div><strong>Food:</strong> {nutritionTest.sampleData.food}</div>
                      <div><strong>Calories:</strong> {nutritionTest.sampleData.calories}</div>
                      <div><strong>Protein:</strong> {nutritionTest.sampleData.protein}g</div>
                      <div><strong>Carbs:</strong> {nutritionTest.sampleData.carbs}g</div>
                      <div><strong>Fat:</strong> {nutritionTest.sampleData.fat}g</div>
                      <div><strong>Fiber:</strong> {nutritionTest.sampleData.fiber}g</div>
                    </div>
                  )}
                  {nutritionTest.responseTime && (
                    <div className="text-xs text-green-600 mt-2">
                      Response time: {nutritionTest.responseTime}ms
                    </div>
                  )}
                </div>
              ) : nutritionTest.error ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="text-red-800 font-medium mb-2">❌ API Test Failed</h4>
                  <div className="text-sm text-red-700">{nutritionTest.error}</div>
                  {nutritionTest.responseTime && (
                    <div className="text-xs text-red-600 mt-2">
                      Failed after: {nutritionTest.responseTime}ms
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <div className="text-gray-600">Click "Test Nutrition API" to verify FDC integration</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TypeScript Database Tab */}
        {activeTab === 'typescript' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                TypeScript Food Database Stats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{FOOD_DATABASE_STATS.totalCategories}</div>
                  <div className="text-sm text-gray-600">Total Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{FOOD_DATABASE_STATS.totalFoods}</div>
                  <div className="text-sm text-gray-600">Total Foods</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {FOOD_CATEGORIES.filter(cat => cat.foods.some(food => food.fdcId)).length}
                  </div>
                  <div className="text-sm text-gray-600">Categories with FDC Data</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Category Breakdown:</h4>
                <div className="space-y-2">
                  {FOOD_DATABASE_STATS.categoriesWithCounts.map((category) => (
                    <div key={category.name} className="flex justify-between text-sm">
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-gray-500">{category.count} items</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
