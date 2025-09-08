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
    console.log('📝 Update request:', { foodId, clientChecked });

    // Validate request data
    if (!foodId || typeof clientChecked !== 'boolean') {
      console.log('❌ Invalid request data:', { foodId, clientChecked });
      return NextResponse.json(
        { error: 'foodId and clientChecked (boolean) are required' },
        { status: 400 }
      );
    }

    // Get document by share token
    console.log('🔍 Getting document by share token...');
    const document = await ingredientDocumentService.getDocumentByShareToken(shareToken);

    if (!document) {
      console.log('❌ Document not found for token:', shareToken);
      return NextResponse.json(
        { error: 'Document not found or no longer available' },
        { status: 404 }
      );
    }

    console.log('✅ Document found:', {
      id: document.id,
      status: document.status,
      ingredientsCount: document.ingredients.length
    });

    // Only allow updates to published documents
    if (document.status !== 'published') {
      console.log('❌ Document not published:', document.status);
      return NextResponse.json(
        { error: 'Document is not available for updates' },
        { status: 403 }
      );
    }

    // Find the ingredient to update
    const ingredientIndex = document.ingredients.findIndex(
      ingredient => ingredient.foodId === foodId
    );

    if (ingredientIndex === -1) {
      console.log('❌ Ingredient not found:', foodId);
      console.log('Available ingredients:', document.ingredients.map(i => i.foodId));
      return NextResponse.json(
        { error: 'Ingredient not found in document' },
        { status: 404 }
      );
    }

    console.log('✅ Ingredient found at index:', ingredientIndex);

    // Update the ingredient's clientChecked status
    const updatedIngredients = [...document.ingredients];
    updatedIngredients[ingredientIndex] = {
      ...updatedIngredients[ingredientIndex],
      clientChecked
    };

    console.log('📝 Updating document via service...');

    // Use the service's updateDocument method but we need to bypass the coach verification
    // Let's create a special public update method
    const success = await updateDocumentTracking(document.id, updatedIngredients);

    if (!success) {
      console.log('❌ Failed to update document');
      return NextResponse.json(
        { error: 'Failed to update document' },
        { status: 500 }
      );
    }

    console.log('✅ Document updated successfully');

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

/**
 * Update document tracking status directly
 * This bypasses coach verification for public access
 */
async function updateDocumentTracking(documentId: string, updatedIngredients: any[]): Promise<boolean> {
  try {
    // Import Firestore functions here to avoid import issues
    const { updateDoc, doc, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase/config');

    const docRef = doc(db, 'ingredient-documents', documentId);
    await updateDoc(docRef, {
      ingredients: updatedIngredients,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('❌ Error in updateDocumentTracking:', error);
    return false;
  }
}
