import { NextRequest, NextResponse } from 'next/server';
import { ingredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { isValidShareToken } from '@/lib/services/share-token';

/**
 * Public API route for updating client tracking status
 * Allows clients to check/uncheck ingredients without authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const shareToken = params.token;
    console.log('🔍 Tracking update request for token:', shareToken);

    // Validate token format
    if (!shareToken || !isValidShareToken(shareToken)) {
      console.log('❌ Invalid token format:', shareToken);
      return NextResponse.json(
        { error: 'Invalid share token format' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { foodId, clientChecked } = body;
    console.log('📝 Update request for foodId:', foodId, 'Checked:', !!clientChecked);

    // Validate request data
    if (!foodId || typeof clientChecked !== 'boolean') {
      console.log('❌ Invalid request data:', { foodId, clientChecked });
      return NextResponse.json(
        { error: 'foodId and clientChecked (boolean) are required' },
        { status: 400 }
      );
    }

    console.log('� Updating client tracking via service...');

    // Update client tracking using the service method
    const success = await ingredientDocumentService.updateClientTracking(
      shareToken,
      foodId,
      clientChecked
    );

    if (!success) {
      console.log('❌ Failed to update client tracking');
      return NextResponse.json(
        { error: 'Failed to update tracking status' },
        { status: 500 }
      );
    }

    console.log('✅ Client tracking updated successfully');

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Tracking status updated successfully',
      updatedIngredient: {
        foodId,
        clientChecked
      }
    });

  } catch (error) {
    console.error('❌ Error updating tracking status:', error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      { error: 'Failed to update tracking status. Please try again.' },
      { status: 500 }
    );
  }
}
