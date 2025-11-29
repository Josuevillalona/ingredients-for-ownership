/**
 * API Route: AI Food Recommendations
 * Generates personalized food recommendations based on client health profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { foodRecommendationEngine } from '@/lib/ai/food-recommendation-engine';
import { foodService } from '@/lib/firebase/foods';
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
    const recommendations = await foodRecommendationEngine.generateRecommendations({
      clientProfile,
      foods,
      quickToggles
    });

    const processingTime = Date.now() - startTime;

    // Count methods used
    const hardRulesApplied = recommendations.filter(r => r.confidence >= 0.95).length;
    const aiProcessed = recommendations.length - hardRulesApplied;

    const response: AIRecommendationResponse = {
      recommendations,
      processingTime,
      foodsProcessed: foods.length,
      hardRulesApplied,
      aiProcessed
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
