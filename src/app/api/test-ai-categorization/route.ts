import { NextRequest, NextResponse } from 'next/server';
import { foodCategorizationService } from '@/lib/services/food-categorization';
import type { FoodItem } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

// Test API route to verify AI categorization is working
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing AI categorization...');
    
    // Create some test foods
    const testFoods: FoodItem[] = [
      {
        id: 'test-chicken',
        name: 'Grilled Chicken Breast',
        description: 'Lean animal protein source',
        nutritionalInfo: {
          protein: 25,
          carbs: 0,
          fat: 3,
          calories: 130
        },
        source: 'manual',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-tofu',
        name: 'Extra Firm Tofu',
        description: 'Plant-based protein from soybeans',
        nutritionalInfo: {
          protein: 15,
          carbs: 3,
          fat: 8,
          calories: 140
        },
        source: 'manual',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-broccoli',
        name: 'Fresh Broccoli',
        description: 'Green cruciferous vegetable',
        nutritionalInfo: {
          protein: 3,
          carbs: 6,
          fat: 0,
          calories: 25,
          fiber: 3
        },
        source: 'fdc-api',
        tags: ['sr-legacy'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-avocado',
        name: 'Hass Avocado',
        description: 'Creamy fruit high in healthy fats',
        nutritionalInfo: {
          protein: 2,
          carbs: 9,
          fat: 15,
          calories: 160,
          fiber: 7
        },
        source: 'fdc-api',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-almonds',
        name: 'Raw Almonds',
        description: 'Tree nuts high in healthy fats and protein',
        nutritionalInfo: {
          protein: 6,
          carbs: 6,
          fat: 14,
          calories: 160,
          fiber: 4
        },
        source: 'fdc-api',
        tags: ['sr-legacy'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-nutritional-yeast',
        name: 'Nutritional Yeast Flakes',
        description: 'Deactivated yeast used as a cheese substitute, high in B vitamins',
        nutritionalInfo: {
          protein: 8,
          carbs: 5,
          fat: 1,
          calories: 60,
          fiber: 3
        },
        source: 'manual',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-sardines',
        name: 'Sardines in Water',
        description: 'Small oily fish packed in water',
        nutritionalInfo: {
          protein: 25,
          carbs: 0,
          fat: 11,
          calories: 208,
          fiber: 0
        },
        source: 'fdc-api',
        tags: ['sr-legacy'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-anchovies',
        name: 'Anchovies',
        description: 'Small saltwater fish, often cured',
        nutritionalInfo: {
          protein: 20,
          carbs: 0,
          fat: 9,
          calories: 131,
          fiber: 0
        },
        source: 'fdc-api',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-sea-trout',
        name: 'Sea Trout Fillet',
        description: 'Fresh sea trout fish fillet',
        nutritionalInfo: {
          protein: 22,
          carbs: 0,
          fat: 8,
          calories: 150,
          fiber: 0
        },
        source: 'fdc-api',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      // Test the specific foods that were previously miscategorized
      {
        id: 'test-coconut',
        name: 'Coconut',
        description: 'Fresh coconut meat',
        nutritionalInfo: {
          protein: 3,
          carbs: 15,
          fat: 33,
          calories: 354,
          fiber: 9
        },
        source: 'fdc-api',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-kefir',
        name: 'Kefir',
        description: 'Fermented milk drink with probiotics',
        nutritionalInfo: {
          protein: 4,
          carbs: 5,
          fat: 1,
          calories: 41
        },
        source: 'fdc-api',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-macadamias',
        name: 'Macadamias',
        description: 'Raw macadamia nuts',
        nutritionalInfo: {
          protein: 8,
          carbs: 14,
          fat: 76,
          calories: 718,
          fiber: 9
        },
        source: 'fdc-api',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      },
      {
        id: 'test-eggs',
        name: 'Organic Whole Eggs',
        description: 'Fresh organic chicken eggs',
        nutritionalInfo: {
          protein: 13,
          carbs: 1,
          fat: 10,
          calories: 143
        },
        source: 'fdc-api',
        tags: ['foundation'],
        addedBy: 'test-coach',
        isGlobal: true,
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      }
    ];

    const results = await foodCategorizationService.categorizeFoods(testFoods);
    const stats = foodCategorizationService.getCategorizationStats(results);
    
    // Convert Map to object for JSON response
    const resultsObj: Record<string, any> = {};
    results.forEach((value, key) => {
      resultsObj[key] = value;
    });
    
    return NextResponse.json({
      success: true,
      message: 'AI categorization test completed',
      testFoods: testFoods.map(f => ({ id: f.id, name: f.name })),
      results: resultsObj,
      statistics: stats,
      huggingFaceAvailable: process.env.HUGGINGFACE_API_KEY ? true : false
    });
    
  } catch (error) {
    console.error('❌ AI categorization test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      huggingFaceAvailable: process.env.HUGGINGFACE_API_KEY ? true : false
    }, { status: 500 });
  }
}