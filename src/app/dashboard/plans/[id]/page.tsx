'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { db } from '@/lib/firebase/config';
import { collection, query, getDocs } from 'firebase/firestore';
import type { IngredientDocument, Food } from '@/lib/types';
import { ClientProgress } from '@/components/client/ClientProgress';
import { ExportPDFButton } from '@/components/plans/ExportPDFButton';
import { ArrowLeft, Edit, Share2, FileText, CheckCircle, AlertCircle, MinusCircle, Info } from 'lucide-react';
import { FOOD_CATEGORIES, getSortedCategories, determineFoodCategory } from '@/lib/utils/food-categories';

export default function ViewPlanPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen bg-brand-cream/30" />}>
        <ViewPlanContent />
      </Suspense>
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

  const fetchPlan = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load the document
      const ingredientDocumentService = new IngredientDocumentService();
      const doc = await ingredientDocumentService.getDocument(documentId, user.uid);
      if (!doc) {
        setError('Document not found or you do not have permission to view it.');
        return;
      }

      setDocument(doc);

      // Load all foods to get details for selected ingredients
      // In a real optimized app, we'd fetch only IDs needed, but for now this matches existing pattern
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
  }, [user, documentId]);

  useEffect(() => {
    if (user && documentId) {
      fetchPlan();
    }
  }, [user, documentId, fetchPlan]);

  const copyShareLink = () => {
    if (document) {
      const shareUrl = `${window.location.origin}/share/${document.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  const getSelectedFoodsWithDetails = () => {
    if (!document) return [];
    return document.ingredients
      .filter(ing => ing.isSelected)
      .map(ingredient => {
        const food = foods.find(f => f.id === ingredient.foodId);
        // Determine category using shared logic if not present on food
        // This ensures mismatch between edit/view is impossible
        const categoryId = food ? determineFoodCategory(food) : 'other';

        return {
          ...ingredient,
          food: food,
          resolvedCategory: categoryId
        };
      });
  };

  // Group by CATEGORY (Meat, Seafood, etc.) instead of Color
  const groupedIngredients = getSelectedFoodsWithDetails().reduce((acc, ingredient) => {
    const catId = ingredient.resolvedCategory || 'other';
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(ingredient);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/icons/icon-192x192.svg"
            alt="Loading"
            width={64}
            height={64}
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <p className="text-brand-dark/60 font-prompt">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-prompt font-bold text-2xl">!</span>
          </div>
          <h2 className="font-prompt font-bold text-xl text-brand-dark mb-2">Document Not Found</h2>
          <p className="text-brand-dark/60 font-prompt mb-4">{error}</p>
          <Link href="/dashboard">
            <Button variant="primary" className="rounded-full">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sortedCategories = getSortedCategories();
  const hasAnyFoods = getSelectedFoodsWithDetails().length > 0;

  return (
    <div className="min-h-full">
      {/* 1. Full-Width Sticky Header Container */}
      <div className="sticky top-0 z-[100] bg-white border-b border-gray-100/50 shadow-sm w-full">
        {/* Centered Content */}
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md border-brand-gold/10 relative z-20">
            <div className="flex items-center gap-4 flex-1">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Button>
              </Link>

              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-brand-dark">{document.clientName}&apos;s Plan</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${document.status === 'published'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                    {document.status === 'published' ? 'Active' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium">Last updated: {document.updatedAt ? document.updatedAt.toDate().toLocaleDateString() : 'Just now'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ExportPDFButton
                documentId={documentId}
                clientName={document.clientName}
                variant="ghost"
                className="rounded-full text-gray-500 hover:text-brand-gold"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={copyShareLink}
                className="rounded-full text-gray-500 hover:text-brand-gold gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>

              <Button
                variant="primary"
                onClick={() => router.push(`/dashboard/plans/${documentId}/edit`)}
                className="rounded-full shadow-lg shadow-brand-gold/20"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Plan
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="max-w-7xl mx-auto px-8 pt-6 pb-8 space-y-8">

        {/* Categories Grid */}
        {sortedCategories.map((category) => {
          const categoryFoods = groupedIngredients[category.id] || [];
          if (categoryFoods.length === 0) return null;

          return (
            <section key={category.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-bold text-xl text-brand-dark">{category.displayName}</h3>
                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {categoryFoods.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryFoods.map((ingredient, index) => {
                  // Determine styling based on color code
                  const color = ingredient.colorCode || 'blue';
                  let statusConfig = {
                    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', label: 'Approved'
                  };

                  if (color === 'yellow') {
                    statusConfig = { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', label: 'Neutral' };
                  } else if (color === 'red') {
                    statusConfig = { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', label: 'Avoid' };
                  }

                  return (
                    <div key={`${ingredient.foodId}-${index}`}
                      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">

                      {/* Left Border Indicator */}
                      <div className={`absolute top-0 left-0 w-1 h-full ${statusConfig.bg.replace('bg-', 'bg-').replace('50', '500')}`}></div>

                      <div className="pl-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors capitalize">
                            {ingredient.food?.name.toLowerCase() || 'Unknown Food'}
                          </h4>
                        </div>

                        {/* Status Pill */}
                        <div className="mb-2">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Highlights */}
                        {ingredient.food?.nutritionalHighlights && ingredient.food.nutritionalHighlights.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {ingredient.food.nutritionalHighlights.slice(0, 2).map((highlight: string, i: number) => (
                              <span key={i} className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded-md uppercase tracking-wide font-medium">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {ingredient.notes && (
                          <div className="flex items-start gap-1.5 mt-2 bg-gray-50 p-2 rounded-lg">
                            <Info className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-gray-500 italic leading-snug">
                              &quot;{ingredient.notes}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {!hasAnyFoods && (
          <div className="bg-gray-50 rounded-3xl border border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No foods selected</h3>
            <p className="text-gray-500 mt-1 mb-6 max-w-sm mx-auto">
              This plan doesn&apos;t have any foods added yet. Edit the plan to start adding recommendations.
            </p>
            <Button
              onClick={() => router.push(`/dashboard/plans/${documentId}/edit`)}
              className="rounded-full"
            >
              Edit Plan
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* Client Progress */}
          <div className="bg-white rounded-[32px] p-6 shadow-card border border-gray-100">
            <h3 className="font-bold text-lg text-brand-dark mb-4">Progress Tracker</h3>
            <ClientProgress
              document={document}
              foods={foods}
            />
          </div>

          {/* Share Information */}
          <div className="bg-brand-dark text-white rounded-[32px] p-8 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <Share2 className="w-6 h-6 text-brand-gold" />
              </div>

              <h3 className="font-bold text-2xl mb-2">Share with {document.clientName}</h3>
              <p className="text-white/60 mb-6 font-light">
                Clients can access their plan instantly via this secure link. No login or account creation required.
              </p>

              <div className="bg-white/5 rounded-xl p-2 pl-4 flex items-center justify-between border border-white/10">
                <code className="text-sm font-mono text-brand-gold truncate mr-4">
                  .../share/{document.shareToken?.substring(0, 12)}...
                </code>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={copyShareLink}
                  className="rounded-lg shadow-none"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
