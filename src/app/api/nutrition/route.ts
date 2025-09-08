import { NextRequest, NextResponse } from 'next/server';
import { FDCService } from '@/lib/firebase/fdc';

/**
 * API route to proxy FDC nutrition requests
 * Keeps the FDC API key secure on the server side
 */
export async function POST(request: NextRequest) {
  try {
    const { fdcIds, format = 'abridged', nutrients } = await request.json();

    if (!fdcIds || !Array.isArray(fdcIds) || fdcIds.length === 0) {
      return NextResponse.json(
        { error: 'fdcIds array is required' },
        { status: 400 }
      );
    }

    const fdcService = new FDCService();

    if (!fdcService.isAvailable()) {
      return NextResponse.json(
        { error: 'FDC API is not configured' },
        { status: 503 }
      );
    }

    const fdcFoods = await fdcService.getFoods({
      fdcIds,
      format,
      nutrients
    });

    return NextResponse.json(fdcFoods);

  } catch (error) {
    console.error('FDC API proxy error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch nutrition data' },
      { status: 500 }
    );
  }
}
