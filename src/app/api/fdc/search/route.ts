/**
 * FDC API Search Route
 * Provides search functionality for FoodData Central database
 */

import { NextRequest, NextResponse } from 'next/server';
import { fdcService } from '@/lib/firebase/fdc';
import { FDCSearchCriteriaSchema } from '@/lib/validations/fdc';

import { getAdminAuth } from '@/lib/firebase/admin';

/**
 * Helper function to verify Firebase ID token from request headers
 */
async function verifyAuthentication(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.substring(7);

    // Verify token with Firebase Admin SDK
    await getAdminAuth().verifyIdToken(token);

    return true;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
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

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const searchCriteria = {
      query: query.trim(),
      dataType: searchParams.get('dataType')?.split(',').filter(Boolean) || undefined,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 20,
      pageNumber: searchParams.get('pageNumber') ? parseInt(searchParams.get('pageNumber')!) : 0,
      sortBy: searchParams.get('sortBy') as any || 'lowercaseDescription.keyword',
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc',
      brandOwner: searchParams.get('brandOwner') || undefined
    };

    // Validate search criteria
    const validatedCriteria = FDCSearchCriteriaSchema.parse(searchCriteria);

    // Perform enhanced search with color categorization
    const enhancedResults = await fdcService.searchFoodsEnhanced(
      validatedCriteria,
      true // Include color assignment
    );

    return NextResponse.json({
      success: true,
      data: enhancedResults,
      meta: {
        query: validatedCriteria.query,
        pageSize: validatedCriteria.pageSize,
        pageNumber: validatedCriteria.pageNumber,
        resultsCount: enhancedResults.length
      }
    });

  } catch (error) {
    console.error('FDC search error:', error);

    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid search parameters', details: error.message },
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

    // Validate search criteria
    const validatedCriteria = FDCSearchCriteriaSchema.parse(body);

    // Perform enhanced search with color categorization
    const enhancedResults = await fdcService.searchFoodsEnhanced(
      validatedCriteria,
      body.includeColorAssignment !== false
    );

    return NextResponse.json({
      success: true,
      data: enhancedResults,
      meta: {
        query: validatedCriteria.query,
        pageSize: validatedCriteria.pageSize,
        pageNumber: validatedCriteria.pageNumber,
        resultsCount: enhancedResults.length
      }
    });

  } catch (error) {
    console.error('FDC search error:', error);

    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid search parameters', details: error.message },
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
