import type { IngredientSelection } from '@/lib/types';

/**
 * Smart Progress Calculation Utilities
 * 
 * Implements color-coded progress tracking where only Blue (unlimited) and Yellow (moderate)
 * foods count toward nutritional goals. Red (limited) foods are excluded from progress.
 */

export interface ProgressMetrics {
  /** Total number of trackable ingredients (blue + yellow) */
  trackableCount: number;
  /** Number of completed trackable ingredients */
  completedCount: number;
  /** Progress percentage (0-100) based on trackable foods only */
  percentage: number;
  /** Breakdown by color code */
  breakdown: {
    blue: { total: number; completed: number };
    yellow: { total: number; completed: number };
    red: { total: number; info: string };
  };
}

/**
 * Determines if an ingredient should be trackable based on color code
 * @param colorCode - The food color code (blue, yellow, red) or null
 * @returns true if the ingredient should be trackable (blue or yellow)
 */
export function isTrackableIngredient(colorCode: string | null): boolean {
  return colorCode === 'blue' || colorCode === 'yellow';
}

/**
 * Calculates smart progress metrics excluding red foods from goal tracking
 * @param ingredients - Array of ingredient selections
 * @returns Progress metrics with color-coded breakdown
 */
export function calculateSmartProgress(ingredients: IngredientSelection[]): ProgressMetrics {
  // Initialize counters
  const breakdown = {
    blue: { total: 0, completed: 0 },
    yellow: { total: 0, completed: 0 },
    red: { total: 0, info: 'For awareness only - enjoy occasionally' }
  };

  // Count ingredients by color and completion status
  ingredients.forEach(ingredient => {
    const { colorCode, clientChecked } = ingredient;
    
    // Handle null colorCode as non-trackable
    if (!colorCode) {
      console.warn('Ingredient missing color code:', ingredient.foodId);
      return;
    }
    
    switch (colorCode) {
      case 'blue':
        breakdown.blue.total++;
        if (clientChecked) breakdown.blue.completed++;
        break;
      case 'yellow':
        breakdown.yellow.total++;
        if (clientChecked) breakdown.yellow.completed++;
        break;
      case 'red':
        breakdown.red.total++;
        break;
      default:
        // Handle any unexpected color codes as non-trackable
        console.warn(`Unknown color code: ${colorCode}`);
        break;
    }
  });

  // Calculate trackable metrics (blue + yellow only)
  const trackableCount = breakdown.blue.total + breakdown.yellow.total;
  const completedCount = breakdown.blue.completed + breakdown.yellow.completed;
  
  // Calculate percentage (handle edge case of no trackable ingredients)
  const percentage = trackableCount > 0 ? Math.round((completedCount / trackableCount) * 100) : 0;

  return {
    trackableCount,
    completedCount,
    percentage,
    breakdown
  };
}

/**
 * Gets trackable ingredients only (blue and yellow foods)
 * @param ingredients - Array of ingredient selections
 * @returns Filtered array containing only trackable ingredients
 */
export function getTrackableIngredients(ingredients: IngredientSelection[]): IngredientSelection[] {
  return ingredients.filter(ingredient => isTrackableIngredient(ingredient.colorCode));
}

/**
 * Gets non-trackable ingredients (red foods)
 * @param ingredients - Array of ingredient selections
 * @returns Filtered array containing only red (awareness-only) ingredients
 */
export function getAwarenessOnlyIngredients(ingredients: IngredientSelection[]): IngredientSelection[] {
  return ingredients.filter(ingredient => ingredient.colorCode === 'red');
}

/**
 * Generates a human-readable progress summary
 * @param metrics - Progress metrics from calculateSmartProgress
 * @returns Formatted progress summary string
 */
export function getProgressSummary(metrics: ProgressMetrics): string {
  const { completedCount, trackableCount, percentage } = metrics;
  
  if (trackableCount === 0) {
    return 'No nutrition goals set yet';
  }
  
  if (completedCount === 0) {
    return `0 of ${trackableCount} nutrition goals started`;
  }
  
  if (percentage === 100) {
    return `All ${trackableCount} nutrition goals completed! 🎉`;
  }
  
  return `${completedCount} of ${trackableCount} nutrition goals completed (${percentage}%)`;
}

/**
 * Gets color-specific motivational messaging
 * @param colorCode - The food color code or null
 * @returns Appropriate message for the color category
 */
export function getColorMessage(colorCode: string | null): string {
  switch (colorCode) {
    case 'blue':
      return 'Great choice! Add this to your regular rotation.';
    case 'yellow':
      return 'Perfect for balanced nutrition in proper portions.';
    case 'red':
      return 'Enjoy occasionally and in moderation. No tracking needed.';
    default:
      return 'Follow your coach\'s guidance for this ingredient.';
  }
}
