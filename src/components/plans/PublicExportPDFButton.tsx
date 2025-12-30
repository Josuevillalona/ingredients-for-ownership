'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, FileDown } from 'lucide-react';

interface PublicExportPDFButtonProps {
    shareToken: string;
    clientName: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
}

export function PublicExportPDFButton({
    shareToken,
    clientName,
    className,
    variant = 'primary',
    fullWidth = false
}: PublicExportPDFButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);

        try {
            const response = await fetch('/api/export/pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shareToken
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
                variant={variant}
                onClick={handleExport}
                disabled={isExporting}
                className={`${fullWidth ? 'w-full' : 'w-auto'} rounded-full shadow-lg shadow-brand-gold/20`}
            >
                {isExporting ? (
                    <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Generating PDF...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </>
                )}
            </Button>

            {error && (
                <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
            )}
        </div>
    );
}
