import React from 'react';
import type { IngredientDocument, Food } from '@/lib/types';
import { calculateSmartProgress, getProgressSummary } from '@/lib/utils/progress';

interface ClientProgressProps {
  document: IngredientDocument;
  foods?: Food[];
  className?: string;
}

export function ClientProgress({ document, foods = [], className = '' }: ClientProgressProps) {
  const progressMetrics = calculateSmartProgress(document.ingredients);

  const getFoodName = (foodId: string): string => {
    const food = foods.find(f => f.id === foodId);
    return food?.name || foodId;
  };

  const getProgressStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const stats = {
    checked: progressMetrics.completedCount,
    total: progressMetrics.trackableCount,
    percentage: progressMetrics.percentage
  };

  return (
    <div className={`bg-brand-white rounded-lg p-4 border border-brand-gold/20 ${className}`}>
      {/* Progress Overview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-prompt font-semibold text-brand-dark">
            Nutrition Goals Progress
          </h3>
          <span className={`text-lg font-bold ${getProgressStatusColor(stats.percentage)}`}>
            {stats.percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(stats.percentage)}`}
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>

        <p className="text-sm text-brand-dark/60">
          {getProgressSummary(progressMetrics)}
        </p>

        {progressMetrics.breakdown.red.total > 0 && (
          <p className="text-xs text-brand-dark/50 mt-1">
            {progressMetrics.breakdown.red.total} awareness-only item(s) • {progressMetrics.breakdown.red.info}
          </p>
        )}
      </div>

      {/* Recently Checked Items */}
      {stats.checked > 0 && (
        <div>
          <h4 className="font-prompt font-medium text-brand-dark mb-2 text-sm">
            Recently Checked:
          </h4>
          <div className="space-y-1">
            {document.ingredients
              .filter(ingredient => ingredient.clientChecked && (ingredient.colorCode === 'blue' || ingredient.colorCode === 'yellow'))
              .slice(-3) // Show last 3 checked trackable items
              .map((ingredient) => (
                <div key={ingredient.foodId} className="flex items-center text-xs">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-brand-dark/70">
                    {getFoodName(ingredient.foodId)}
                  </span>
                </div>
              ))}
            {stats.checked > 3 && (
              <p className="text-xs text-brand-dark/50 ml-4">
                +{stats.checked - 3} more nutrition goals
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.checked === 0 && (
        <div className="text-center py-2">
          <p className="text-gray-500 font-medium">
            You haven&apos;t tracked any food choices yet.
          </p>
        </div>
      )}
    </div>
  );
}
