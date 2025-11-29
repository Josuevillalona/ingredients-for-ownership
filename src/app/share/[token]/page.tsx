'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import type { Food } from '@/lib/types';
import { useSharedDocument } from '@/lib/hooks/useSharedDocument';
import { getColorMessage, getProgressSummary, isTrackableIngredient } from '@/lib/utils/progress';

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

  const getColorBadgeClass = (colorCode: string | null) => {
    switch (colorCode) {
      case 'blue':
        return 'bg-[#81D4FA]/10 text-[#5B9BD5] border-[#81D4FA]/30';
      case 'yellow':
        return 'bg-[#FFC000]/10 text-[#D4A000] border-[#FFC000]/30';
      case 'red':
        return 'bg-[#FF5252]/10 text-[#D32F2F] border-[#FF5252]/30';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getColorLabel = (colorCode: string | null) => {
    switch (colorCode) {
      case 'blue':
        return 'Unlimited';
      case 'yellow':
        return 'Moderate';
      case 'red':
        return 'Limited';
      default:
        return 'Not specified';
    }
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
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="bg-brand-white rounded-xl p-12 shadow-sm border border-brand-gold/20 text-center max-w-md">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-brand-dark/60 font-prompt">Loading your nutrition plan...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="bg-brand-white rounded-xl p-12 shadow-sm border border-red-200 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="font-prompt font-bold text-xl text-brand-dark mb-4">
            Plan Not Available
          </h1>
          <p className="text-brand-dark/60 mb-6">
            {error || 'This nutrition plan is no longer available or the link has expired.'}
          </p>
          <p className="text-sm text-brand-dark/50">
            Please contact your coach for a new link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark text-brand-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="font-prompt font-bold text-2xl mb-2">
              Nutrition Plan for {document.clientName}
            </h1>
            <p className="text-brand-white/80 text-sm">
              Your personalized ingredient recommendations
            </p>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-prompt font-bold text-lg text-brand-dark">
              Nutrition Goals Progress
            </h2>
            <span className="text-2xl font-bold text-brand-gold">
              {progressPercentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-brand-gold h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-brand-dark/60">
            {progressMetrics ? getProgressSummary(progressMetrics) : 'Loading progress...'}
          </p>
          
          {progressMetrics && progressMetrics.breakdown.red.total > 0 && (
            <p className="text-xs text-brand-dark/50 mt-2">
              {progressMetrics.breakdown.red.total} awareness-only item(s) • {progressMetrics.breakdown.red.info}
            </p>
          )}
        </div>
      </div>

      {/* Ingredients List */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        <div className="space-y-4">
          {document.ingredients.map((ingredient) => {
            const food = getFoodDetails(ingredient.foodId);
            const isLoading = trackingLoading.has(ingredient.foodId);
            
            return (
              <div
                key={ingredient.foodId}
                className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20"
              >
                <div className="flex items-start space-x-4">
                  {/* Conditional Checkbox or Awareness Badge */}
                  <div className="flex-shrink-0 pt-1">
                    {isTrackableIngredient(ingredient.colorCode) ? (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ingredient.clientChecked || false}
                          onChange={(e) => handleTrackingUpdate(ingredient.foodId, e.target.checked)}
                          disabled={isLoading}
                          className="w-6 h-6 text-brand-gold border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-gold focus:border-transparent disabled:opacity-50"
                        />
                      </label>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center">
                        <span className="text-xs text-red-600 font-medium border border-red-300 rounded px-1.5 py-0.5 bg-red-50">
                          ℹ️
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Food Information */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-prompt font-semibold text-lg text-brand-dark">
                        {food?.name || ingredient.foodId}
                      </h3>
                      
                      {/* Color Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorBadgeClass(ingredient.colorCode)}`}>
                        {getColorLabel(ingredient.colorCode)}
                      </span>
                    </div>

                    {/* Food Details */}
                    {food && (
                      <div className="space-y-2">
                        {food.nutritionalHighlights && food.nutritionalHighlights.length > 0 && (
                          <p className="text-sm text-brand-dark/70">
                            <strong>Benefits:</strong> {food.nutritionalHighlights.join(', ')}
                          </p>
                        )}
                        
                        {food.servingSize && (
                          <p className="text-sm text-brand-dark/70">
                            <strong>Serving:</strong> {food.servingSize}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Coach Notes */}
                    {ingredient.notes && (
                      <div className="mt-3 p-3 bg-brand-cream rounded-lg">
                        <p className="text-sm text-brand-dark/80">
                          <strong>Coach Note:</strong> {ingredient.notes}
                        </p>
                      </div>
                    )}

                    {/* Color-Specific Guidance */}
                    <div className="mt-3 p-3 rounded-lg" style={{
                      backgroundColor: ingredient.colorCode === 'blue' ? '#e6f3ff' :
                                      ingredient.colorCode === 'yellow' ? '#fff8e6' :
                                      ingredient.colorCode === 'red' ? '#ffe6e6' : '#f5f5f5'
                    }}>
                      <p className="text-sm text-brand-dark/80 italic">
                        {getColorMessage(ingredient.colorCode)}
                      </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                      <div className="mt-2 flex items-center text-sm text-brand-dark/60">
                        <div className="animate-spin w-4 h-4 border border-brand-gold border-t-transparent rounded-full mr-2"></div>
                        Updating...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
            <p className="text-sm text-brand-dark/60 mb-2">
              Questions about your plan? Contact your coach.
            </p>
            <p className="text-xs text-brand-dark/50">
              Last updated: {new Date(document.updatedAt.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
