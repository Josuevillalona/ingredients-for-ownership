import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IngredientDocument } from '@/lib/types/ingredient-document';
import type { FoodItem, Coach } from '@/lib/types';
import { IngredientPDFTemplate } from './pdf-template';

export interface PDFGenerationOptions {
  document: IngredientDocument;
  foods: FoodItem[];
  coach?: Coach;
  columns?: number;
}

export class PDFGenerator {
  /**
   * Generate PDF buffer from ingredient document
   */
  async generatePDF(options: PDFGenerationOptions): Promise<Buffer> {
    const { document, foods, coach, columns } = options;

    // Calculate optimal column count if not specified
    const optimalColumns = columns || this.calculateOptimalColumns(document);

    // Create PDF using the template component
    const templateElement = React.createElement(IngredientPDFTemplate, {
      document,
      foods,
      coachName: coach?.name,
      coachContact: coach?.email,
      columns: optimalColumns
    });

    // Generate PDF blob - the template returns a Document component
    const blob = await pdf(templateElement as any).toBlob();
    
    // Convert blob to buffer
    return Buffer.from(await blob.arrayBuffer());
  }

  /**
   * Calculate optimal number of columns based on ingredient count
   */
  private calculateOptimalColumns(document: IngredientDocument): number {
    const selectedCount = document.ingredients.filter(
      i => i.isSelected && i.colorCode
    ).length;

    if (selectedCount <= 25) return 2;      // Few ingredients: larger, more readable
    if (selectedCount <= 60) return 3;      // Medium: balanced layout
    return 4;                                // Many: compact grid
  }

  /**
   * Generate filename for PDF download
   */
  generateFilename(clientName: string): string {
    const sanitized = clientName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const date = new Date().toISOString().split('T')[0];
    return `nutrition-plan-${sanitized}-${date}.pdf`;
  }
}

// Export singleton instance
export const pdfGenerator = new PDFGenerator();
