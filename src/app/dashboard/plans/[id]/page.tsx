'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { IngredientDocument, Food } from '@/lib/types';
import { ClientProgress } from '@/components/client/ClientProgress';
import { ExportPDFButton } from '@/components/plans/ExportPDFButton';

export default function ViewPlanPage() {
  return (
    <ProtectedRoute>
      <ViewPlanContent />
    </ProtectedRoute>
  );
}

function ViewPlanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<IngredientDocument | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ingredientDocumentService = new IngredientDocumentService();

  useEffect(() => {
    if (user && documentId) {
      loadDocument();
    }
  }, [user, documentId]);

  const loadDocument = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load the document
      const doc = await ingredientDocumentService.getDocument(documentId, user.uid);
      if (!doc) {
        setError('Document not found or you do not have permission to view it.');
        return;
      }

      setDocument(doc);

      // Load all foods to get details for selected ingredients
      const foodsQuery = query(collection(db, 'foods'));
      const foodsSnapshot = await getDocs(foodsQuery);
      const allFoods = foodsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Food[];

      setFoods(allFoods);
    } catch (error) {
      console.error('Error loading document:', error);
      setError('Failed to load document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    if (document) {
      const shareUrl = `${window.location.origin}/share/${document.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  const getSelectedFoodsWithDetails = () => {
    if (!document) return [];

    // Get ALL ingredients in the document (they all have a purpose in the plan)
    return document.ingredients
      .map(ingredient => {
        const food = foods.find(f => f.id === ingredient.foodId);
        return {
          ...ingredient,
          food: food
        };
      });
  };

  const groupedIngredients = getSelectedFoodsWithDetails().reduce((acc, ingredient) => {
    const color = ingredient.colorCode || 'blue';
    if (!acc[color]) acc[color] = [];
    acc[color].push(ingredient);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-brand-white font-prompt font-bold text-2xl">I</span>
          </div>
          <p className="text-brand-dark/60 font-prompt">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-prompt font-bold text-2xl">!</span>
          </div>
          <h2 className="font-prompt font-bold text-xl text-brand-dark mb-2">
            Document Not Found
          </h2>
          <p className="text-brand-dark/60 font-prompt mb-4">
            {error}
          </p>
          <Link href="/dashboard">
            <Button variant="primary">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="text-brand-white/70 hover:text-brand-white">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-white font-prompt font-bold text-lg">I</span>
              </div>
              <div>
                <h1 className="text-brand-white font-prompt font-bold text-2xl">
                  Ingredient Document
                </h1>
                <p className="text-brand-white/70 text-sm font-prompt">
                  For {document.clientName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Document Info */}
        <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gold/20 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-prompt font-bold text-2xl text-brand-dark mb-2">
                {document.clientName}'s Nutrition Plan
              </h2>
              <div className="flex items-center space-x-4 text-sm text-brand-dark/60 font-prompt">
                <span>Created: {document.createdAt.toDate().toLocaleDateString()}</span>
                <span>Status: {document.status}</span>
                <span>Foods: {getSelectedFoodsWithDetails().length}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <ExportPDFButton
                documentId={documentId}
                clientName={document.clientName}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={copyShareLink}
              >
                Copy Share Link
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(`/dashboard/plans/${documentId}/edit`)}
              >
                Edit Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Color-Coded Food Groups */}
        <div className="space-y-6">
          {(['blue', 'yellow', 'red'] as const).map((color) => {
            const colorFoods = groupedIngredients[color] || [];
            if (colorFoods.length === 0) return null;

            const colorConfig = {
              blue: { name: 'Recommended Foods (Blue)', bg: 'bg-[#81D4FA]/10', border: 'border-[#81D4FA]/30', text: 'text-[#5B9BD5]', badge: 'bg-[#81D4FA]' },
              yellow: { name: 'Moderate Foods (Yellow)', bg: 'bg-[#FFC000]/10', border: 'border-[#FFC000]/30', text: 'text-[#D4A000]', badge: 'bg-[#FFC000]' },
              red: { name: 'Foods to Avoid (Red)', bg: 'bg-[#FF5252]/10', border: 'border-[#FF5252]/30', text: 'text-[#D32F2F]', badge: 'bg-[#FF5252]' }
            };

            const config = colorConfig[color];

            return (
              <div key={color} className={`${config.bg} ${config.border} border rounded-xl p-6`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-4 h-4 ${config.badge} rounded-full`} />
                  <h3 className={`font-prompt font-bold text-xl ${config.text}`}>
                    {config.name} ({colorFoods.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colorFoods.map((ingredient, index) => (
                    <div key={`${ingredient.foodId}-${index}`} className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-prompt font-semibold text-brand-dark mb-1">
                        {ingredient.food?.name || 'Unknown Food'}
                      </h4>
                      {ingredient.food?.nutritionalHighlights && ingredient.food.nutritionalHighlights.length > 0 && (
                        <p className="text-sm text-brand-dark/60 font-prompt mb-2">
                          {ingredient.food.nutritionalHighlights.join(', ')}
                        </p>
                      )}
                      {ingredient.notes && (
                        <p className="text-sm text-brand-dark/80 font-prompt italic">
                          Note: {ingredient.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {getSelectedFoodsWithDetails().length === 0 && (
          <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gold/20 p-8 text-center">
            <p className="text-brand-dark/60 font-prompt">
              No foods have been selected for this plan yet.
            </p>
          </div>
        )}

        {/* Client Progress */}
        <ClientProgress 
          document={document} 
          foods={foods}
          className="mb-8"
        />

        {/* Share Information */}
        <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gold/20 p-6">
          <h3 className="font-prompt font-bold text-xl text-brand-dark mb-4">
            Share with Client
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-prompt text-sm text-brand-dark/60 mb-2">Share Link:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 px-3 py-2 bg-white rounded border text-sm font-mono">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/share/${document.shareToken}`}
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={copyShareLink}
              >
                Copy
              </Button>
            </div>
          </div>
          <p className="text-sm text-brand-dark/60 font-prompt">
            Share this link with your client so they can view their personalized nutrition plan.
            No login required for clients.
          </p>
        </div>
      </div>
    </div>
  );
}
