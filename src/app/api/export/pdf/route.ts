import { NextRequest, NextResponse } from 'next/server';
import { pdfGenerator } from '@/lib/pdf/pdf-generator';
import { ingredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { foodService } from '@/lib/firebase/foods';
import { authService } from '@/lib/firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { documentId, coachId } = await request.json();

    // Validate required fields
    if (!documentId || !coachId) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId and coachId' },
        { status: 400 }
      );
    }

    // Fetch document and validate ownership
    const document = await ingredientDocumentService.getDocument(documentId, coachId);
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or access denied' },
        { status: 404 }
      );
    }

    // Only export published documents
    if (document.status !== 'published') {
      return NextResponse.json(
        { error: 'Only published documents can be exported' },
        { status: 400 }
      );
    }

    // Fetch all foods for ingredient lookup
    const foods = await foodService.getGlobalFoods();

    // Fetch coach profile for branding
    const coach = await authService.getCoachProfile(coachId);

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePDF({
      document,
      foods,
      coach: coach || undefined
    });

    // Generate filename
    const filename = pdfGenerator.generateFilename(document.clientName);

    // Return PDF as downloadable response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
