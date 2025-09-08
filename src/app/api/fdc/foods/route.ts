/**
 * FDC API Foods Batch Route
 * Provides detailed food information for multiple FDC IDs
 */

import { NextRequest, NextResponse } from 'next/server';
import { fdcService } from '@/lib/firebase/fdc';

/**
 * Helper function to verify Firebase ID token from request headers
 */
async function verifyAuthentication(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }
    
    // For now, just check if token exists
    // In production, would verify with Firebase Admin SDK
    const token = authHeader.substring(7);
    return token.length > 0;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await verifyAuthentication(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if FDC service is available
    if (!fdcService.isAvailable()) {
      return NextResponse.json(
        { error: 'FDC API service is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    if (!Array.isArray(body.fdcIds) || body.fdcIds.length === 0) {
      return NextResponse.json(
        { error: 'fdcIds array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate all FDC IDs are valid integers
    const fdcIds = body.fdcIds.map((id: any) => {
      const fdcId = parseInt(id);
      if (isNaN(fdcId) || fdcId <= 0) {
        throw new Error(`Invalid FDC ID: ${id}`);
      }
      return fdcId;
    });

    if (fdcIds.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 FDC IDs allowed per request' },
        { status: 400 }
      );
    }

    const format = body.format as 'abridged' | 'full' || 'abridged';
    const nutrients = Array.isArray(body.nutrients) 
      ? body.nutrients.map((n: any) => parseInt(n)).filter((n: number) => !isNaN(n))
      : undefined;

    // Fetch multiple foods using the getFoods method
    const foods = await fdcService.getFoods({
      fdcIds: fdcIds,
      format: format,
      nutrients: nutrients
    });
    
    // Convert to application FoodItem format with color assignments
    const enhancedFoods = await Promise.all(
      foods.map(async (food: any) => {
        const foodItem = await fdcService.convertToFoodItem(food, 'temp-coach-id');
        return {
          fdcDetail: food,
          foodItem: foodItem
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enhancedFoods,
      meta: {
        requestedIds: fdcIds,
        foundCount: foods.length,
        format: format,
        convertedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('FDC foods batch error:', error);
    
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('Invalid FDC ID')) {
        return NextResponse.json(
          { error: 'Invalid request', details: error.message },
          { status: 400 }
        );
      }
      
      // Handle FDC API errors
      if (error.message.includes('FDC API')) {
        return NextResponse.json(
          { error: 'External service error', details: 'Food database temporarily unavailable' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
