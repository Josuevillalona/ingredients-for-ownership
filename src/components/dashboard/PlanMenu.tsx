'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, FileDown, Trash2, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { ingredientDocumentService } from '@/lib/firebase/ingredient-documents';

interface PlanMenuProps {
    planId: string;
    clientName: string;
    shareToken: string | null;
    onDelete?: () => void;
}

export function PlanMenu({ planId, clientName, shareToken, onDelete }: PlanMenuProps) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExportPDF = async () => {
        if (!user) return;
        try {
            setIsExporting(true);
            const response = await fetch('/api/export/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId: planId, coachId: user.uid }),
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nutrition-plan-${clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setIsOpen(false);
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to export PDF');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;
        if (!confirm('Are you sure you want to delete this plan? This cannot be undone.')) return;

        try {
            setIsDeleting(true);
            await ingredientDocumentService.deleteDocument(planId, user.uid);
            setIsOpen(false);
            if (onDelete) onDelete();
        } catch (error) {
            console.error('Delete Error:', error);
            alert('Failed to delete plan');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopyLink = () => {
        if (!shareToken) {
            alert('This plan needs to be published first to generate a link.');
            return;
        }
        const url = `${window.location.origin}/share/${shareToken}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setIsOpen(false);
        }, 2000);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleExportPDF(); }}
                            disabled={isExporting}
                            className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50 text-brand-dark transition-colors disabled:opacity-50"
                        >
                            <FileDown className="w-4 h-4 text-brand-gold" />
                            {isExporting ? 'Generating...' : 'Export PDF'}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
                            className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50 text-brand-dark transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4 text-brand-dark/50" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                            disabled={isDeleting}
                            className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? 'Deleting...' : 'Delete Plan'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
