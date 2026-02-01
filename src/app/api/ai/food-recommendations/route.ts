/**
 * API Route: AI Food Recommendations
 * Generates personalized food recommendations based on client health profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { foodRecommendationEngine } from '@/lib/ai/food-recommendation-engine';
import { foodService } from '@/lib/firebase/foods';
import { fdcService } from '@/lib/firebase/fdc';
import type { AIRecommendationRequest, AIRecommendationResponse } from '@/lib/types/ai-recommendations';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: AIRecommendationRequest = await request.json();
    const { clientProfile, foodIds, quickToggles } = body;

    // Validate input
    if (!clientProfile || clientProfile.trim().length < 10) {
      return NextResponse.json(
        { error: 'Client profile is required and must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if AI service is available
    if (!foodRecommendationEngine.isAvailable()) {
      return NextResponse.json(
        { error: 'AI recommendation service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Get foods to analyze
    let foods;
    if (foodIds && foodIds.length > 0) {
      // Analyze specific foods
      const allFoods = await foodService.getGlobalFoods();
      foods = allFoods.filter(f => foodIds.includes(f.id));
    } else {
      // Analyze all foods
      foods = await foodService.getGlobalFoods();
    }

    if (foods.length === 0) {
      return NextResponse.json(
        { error: 'No foods found to analyze' },
        { status: 400 }
      );
    }

    // Generate recommendations
    const aiResult = await foodRecommendationEngine.generateRecommendations({
      clientProfile,
      foods,
      quickToggles
    });

    const recommendations = aiResult.recommendations;
    const suggestedFoodNames = aiResult.suggestedFoods;

    const processingTime = Date.now() - startTime;

    // Count methods used
    const hardRulesApplied = recommendations.filter(r => r.confidence >= 0.95).length;
    const aiProcessed = recommendations.length - hardRulesApplied;

    // Fetch details for suggested missing foods (if any)
    let suggestedFoodsDetails: any[] = [];
    if (suggestedFoodNames && suggestedFoodNames.length > 0) {
      try {
        // Search FDC for each suggestion in parallel
        const searchPromises = suggestedFoodNames.map(async (name) => {
          try {
            // Basic search for the food name
            const results = await fdcService.searchFoodsEnhanced({
              query: name,
              pageSize: 1, // We only want the best match
              dataType: ['Foundation', 'SR Legacy'] // Prefer whole foods
            });

            if (results && results.length > 0) {
              const bestMatch = results[0];
              // Only include if it doesn't already exist in our DB (fuzzy check by name)
              const exists = foods.some(f => f.name.toLowerCase().includes(name.toLowerCase()));
              if (!exists) {
                return bestMatch;
              }
            }
            return null;
          } catch (e) {
            console.warn(`Failed to search FDC for suggestion: ${name}`, e);
            return null;
          }
        });

        const results = await Promise.all(searchPromises);
        suggestedFoodsDetails = results.filter(item => item !== null);
      } catch (error) {
        console.error('Error fetching FDC suggestions:', error);
      }
    }

    const response: AIRecommendationResponse = {
      recommendations,
      processingTime,
      foodsProcessed: foods.length,
      hardRulesApplied,
      aiProcessed,
      suggestedFoods: suggestedFoodsDetails
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('AI recommendation error:', error);

    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Failed to generate AI recommendations',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

// OPTIONS request for CORS (if needed)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
