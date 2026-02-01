'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import type { Food } from '@/lib/types';
import { useSharedDocument } from '@/lib/hooks/useSharedDocument';
import { getProgressSummary, isTrackableIngredient } from '@/lib/utils/progress';
import { FOOD_CATEGORIES, getSortedCategories, determineFoodCategory } from '@/lib/utils/food-categories';
import { PublicExportPDFButton } from '@/components/plans/PublicExportPDFButton';
import { CheckCircle, AlertCircle, MinusCircle, Info, Share2, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function SharedIngredientPage() {
  const params = useParams();
  const shareToken = params.token as string;

  const {
    document,
    foods,
    loading,
    error,
    updateTracking,
    trackingLoading,
    progressPercentage,
    progressMetrics
  } = useSharedDocument(shareToken);

  const getFoodDetails = (foodId: string): Food | null => {
    return foods.find(food => food.id === foodId) || null;
  };

  const handleTrackingUpdate = async (foodId: string, checked: boolean) => {
    try {
      await updateTracking(foodId, checked);
    } catch (error) {
      alert('Failed to update tracking. Please try again.');
    }
  };

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
          <p className="text-brand-dark/60 font-prompt">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 shadow-card border border-red-200 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="font-prompt font-bold text-xl text-brand-dark mb-4">
            Plan Not Available
          </h1>
          <p className="text-brand-dark/60 mb-6">
            {error || 'This nutrition plan is no longer available or the link has expired.'}
          </p>
        </div>
      </div>
    );
  }

  // Group ingredients by category
  const ingredientsWithDetails = document.ingredients.map(ing => {
    const food = getFoodDetails(ing.foodId);
    return {
      ...ing,
      food,
      // Use shared categorization logic
      resolvedCategory: food ? determineFoodCategory(food) : 'other'
    };
  });

  const groupedIngredients = ingredientsWithDetails.reduce((acc, ing) => {
    const catId = ing.resolvedCategory || 'other';
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(ing);
    return acc;
  }, {} as Record<string, typeof ingredientsWithDetails>);

  const sortedCategories = getSortedCategories();
  const hasAnyFoods = ingredientsWithDetails.length > 0;

  return (
    <div className="min-h-screen bg-brand-cream/30 font-prompt pb-20">

      {/* Hero Header */}
      <div className="bg-brand-dark text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 shadow-lg border border-white/10">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={32}
              className="h-8 w-auto opacity-90"
            />
            <span className="text-brand-gold font-bold ml-3 tracking-widest text-sm uppercase">Ingredients for Ownership</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-prompt">
            Nutrition Plan for <span className="text-brand-gold">{document.clientName}</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg font-light">
            Your personalized guide to therapeutic food & beverage choices.
          </p>

          <div className="mt-8 flex justify-center">
            <PublicExportPDFButton
              shareToken={shareToken}
              clientName={document.clientName}
            />
          </div>
        </div>
      </div>

      {/* Main Content Card - Overlapping Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20">

        {/* Progress Section */}
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-card border border-brand-gold/10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-1">Your Progress</h2>
              <p className="text-brand-dark/60 text-sm">Track your adherence to Recommended foods.</p>
            </div>

            <div className="flex-1 max-w-md w-full">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-brand-gold">{progressPercentage}% Complete</span>
                <span className="text-gray-400">Weekly Goal</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-brand-gold h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-8">
          {sortedCategories.map((category) => {
            const categoryFoods = groupedIngredients[category.id] || [];
            if (categoryFoods.length === 0) return null;

            return (
              <section key={category.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-2 px-2">
                  <h3 className="font-bold text-2xl text-brand-dark">{category.displayName}</h3>
                  <span className="text-xs font-bold bg-white text-brand-dark/50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    {categoryFoods.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryFoods.map((ingredient, index) => {
                    const food = ingredient.food;
                    const color = ingredient.colorCode || 'blue';
                    const isLoading = trackingLoading.has(ingredient.foodId);
                    const isCheckable = isTrackableIngredient(color);

                    let statusConfig = {
                      bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', label: 'Approved', dot: 'bg-blue-500'
                    };

                    if (color === 'yellow') {
                      statusConfig = { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', label: 'Neutral', dot: 'bg-yellow-500' };
                    } else if (color === 'red') {
                      statusConfig = { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', label: 'Avoid', dot: 'bg-red-500' };
                    }

                    return (
                      <div key={`${ingredient.foodId}-${index}`}
                        className={`bg-white rounded-2xl p-4 border shadow-sm transition-all relative overflow-hidden ${ingredient.clientChecked
                          ? 'border-brand-gold/50 shadow-brand-gold/10'
                          : 'border-gray-100 hover:shadow-md'
                          }`}>

                        {/* Status Left Border */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${statusConfig.bg.replace('bg-', 'bg-').replace('50', '500')}`}></div>

                        <div className="pl-3 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2">
                            <div className="mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}>
                                {statusConfig.label}
                              </span>
                            </div>

                            {/* Interactive Checkbox */}
                            {isCheckable && (
                              <label className="relative flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={ingredient.clientChecked || false}
                                  onChange={(e) => handleTrackingUpdate(ingredient.foodId, e.target.checked)}
                                  disabled={isLoading}
                                  className="peer sr-only"
                                />
                                <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${ingredient.clientChecked
                                  ? 'bg-brand-gold border-brand-gold'
                                  : 'border-gray-300 group-hover:border-brand-gold/50'
                                  }`}>
                                  {isLoading ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <CheckCircle className={`w-4 h-4 text-white transition-opacity ${ingredient.clientChecked ? 'opacity-100' : 'opacity-0'}`} />
                                  )}
                                </div>
                              </label>
                            )}
                          </div>

                          <h4 className="font-bold text-lg text-brand-dark mb-1 leading-tight capitalize">
                            {food?.name.toLowerCase() || 'Unknown Food'}
                          </h4>

                          {/* Highlights */}
                          {food?.nutritionalHighlights && food.nutritionalHighlights.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {food.nutritionalHighlights.slice(0, 2).map((highlight: string, i: number) => (
                                <span key={i} className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded-md uppercase tracking-wide font-medium border border-gray-100">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Notes */}
                          {ingredient.notes && (
                            <div className="mt-auto pt-3 border-t border-gray-50">
                              <div className="flex items-start gap-1.5 ">
                                <Info className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-gray-500 italic leading-snug">
                                  &quot;{ingredient.notes}&quot;
                                </p>
                              </div>
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
        </div>

        {!hasAnyFoods && (
          <div className="bg-white rounded-[32px] p-12 text-center shadow-card border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Plan Empty</h3>
            <p className="text-gray-500 mt-2">
              This plan content is currently unavailable.
            </p>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-brand-dark/40 text-sm pb-8">
        <p>© {new Date().getFullYear()} Ingredients for Ownership. All rights reserved.</p>
      </footer>
    </div>
  );
}
