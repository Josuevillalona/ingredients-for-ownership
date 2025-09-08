import { NextRequest, NextResponse } from 'next/server';
import { ingredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { isValidShareToken } from '@/lib/services/share-token';

/**
 * Public API route for accessing ingredient documents via share token
 * No authentication required - this is for client access
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const shareToken = params.token;

    // Validate token format
    if (!shareToken || !isValidShareToken(shareToken)) {
      return NextResponse.json(
        { error: 'Invalid share token format' },
        { status: 400 }
      );
    }

    // Get document by share token (public access)
    const document = await ingredientDocumentService.getDocumentByShareToken(shareToken);

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or no longer available' },
        { status: 404 }
      );
    }

    // Only return published documents to clients
    if (document.status !== 'published') {
      return NextResponse.json(
        { error: 'Document is not available for viewing' },
        { status: 403 }
      );
    }

    // Return document data without sensitive information
    const publicDocument = {
      id: document.id,
      clientName: document.clientName,
      ingredients: document.ingredients,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      status: document.status
      // Note: coachId and shareToken are excluded for security
    };

    return NextResponse.json({ document: publicDocument });

  } catch (error) {
    console.error('❌ Error fetching shared document:', error);
    
    return NextResponse.json(
      { error: 'Failed to load document. Please try again later.' },
      { status: 500 }
    );
  }
}
