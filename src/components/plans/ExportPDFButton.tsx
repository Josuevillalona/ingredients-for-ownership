'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';

interface ExportPDFButtonProps {
  documentId: string;
  clientName: string;
  className?: string;
}

export function ExportPDFButton({ documentId, clientName, className }: ExportPDFButtonProps) {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!user) {
      setError('You must be logged in to export PDFs');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentId,
          coachId: user.uid
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutrition-plan-${clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={isExporting}
        className="w-full sm:w-auto"
      >
        {isExporting ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full mr-2" />
            Generating PDF...
          </>
        ) : (
          <>
             Export PDF
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}
