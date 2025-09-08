import type { IngredientSelection } from '@/lib/types';
import {
  calculateSmartProgress,
  isTrackableIngredient,
  getTrackableIngredients,
  getAwarenessOnlyIngredients,
  getProgressSummary,
  getColorMessage,
  type ProgressMetrics
} from '../progress';

// Mock ingredient data for testing
const mockIngredients: IngredientSelection[] = [
  // Blue ingredients (trackable)
  { 
    foodId: 'blueberries', 
    categoryId: 'fruits', 
    colorCode: 'blue', 
    isSelected: true, 
    notes: 'High antioxidants', 
    clientChecked: true 
  },
  { 
    foodId: 'spinach', 
    categoryId: 'vegetables', 
    colorCode: 'blue', 
    isSelected: true, 
    notes: 'Iron rich', 
    clientChecked: false 
  },
  { 
    foodId: 'salmon', 
    categoryId: 'proteins', 
    colorCode: 'blue', 
    isSelected: true, 
    notes: 'Omega-3', 
    clientChecked: true 
  },
  
  // Yellow ingredients (trackable)
  { 
    foodId: 'quinoa', 
    categoryId: 'grains', 
    colorCode: 'yellow', 
    isSelected: true, 
    notes: 'Complete protein', 
    clientChecked: true 
  },
  { 
    foodId: 'avocado', 
    categoryId: 'fats', 
    colorCode: 'yellow', 
    isSelected: true, 
    notes: 'Healthy fats', 
    clientChecked: false 
  },
  
  // Red ingredients (non-trackable)
  { 
    foodId: 'ice-cream', 
    categoryId: 'treats', 
    colorCode: 'red', 
    isSelected: true, 
    notes: 'Occasional treat', 
    clientChecked: false 
  },
  { 
    foodId: 'cookies', 
    categoryId: 'treats', 
    colorCode: 'red', 
    isSelected: true, 
    notes: 'Limited portions', 
    clientChecked: true // Should not count
  }
];

describe('Progress Calculation Utilities', () => {
  
  describe('isTrackableIngredient', () => {
    it('should return true for blue ingredients', () => {
      expect(isTrackableIngredient('blue')).toBe(true);
    });

    it('should return true for yellow ingredients', () => {
      expect(isTrackableIngredient('yellow')).toBe(true);
    });

    it('should return false for red ingredients', () => {
      expect(isTrackableIngredient('red')).toBe(false);
    });

    it('should return false for null color code', () => {
      expect(isTrackableIngredient(null)).toBe(false);
    });

    it('should return false for unknown color codes', () => {
      expect(isTrackableIngredient('green')).toBe(false);
      expect(isTrackableIngredient('purple')).toBe(false);
    });
  });

  describe('calculateSmartProgress', () => {
    it('should calculate progress excluding red foods', () => {
      const metrics = calculateSmartProgress(mockIngredients);
      
      // Should have 5 trackable ingredients (3 blue + 2 yellow)
      expect(metrics.trackableCount).toBe(5);
      
      // Should have 3 completed trackable ingredients (2 blue + 1 yellow)
      expect(metrics.completedCount).toBe(3);
      
      // Progress should be 60% (3/5)
      expect(metrics.percentage).toBe(60);
    });

    it('should provide detailed breakdown by color', () => {
      const metrics = calculateSmartProgress(mockIngredients);
      
      expect(metrics.breakdown.blue.total).toBe(3);
      expect(metrics.breakdown.blue.completed).toBe(2);
      
      expect(metrics.breakdown.yellow.total).toBe(2);
      expect(metrics.breakdown.yellow.completed).toBe(1);
      
      expect(metrics.breakdown.red.total).toBe(2);
      expect(metrics.breakdown.red.info).toBe('For awareness only - enjoy occasionally');
    });

    it('should handle empty ingredient list', () => {
      const metrics = calculateSmartProgress([]);
      
      expect(metrics.trackableCount).toBe(0);
      expect(metrics.completedCount).toBe(0);
      expect(metrics.percentage).toBe(0);
    });

    it('should handle all red ingredients', () => {
      const redOnlyIngredients: IngredientSelection[] = [
        { foodId: 'cake', colorCode: 'red', notes: 'Special occasions', clientChecked: false },
        { foodId: 'soda', colorCode: 'red', notes: 'Limit intake', clientChecked: true }
      ];
      
      const metrics = calculateSmartProgress(redOnlyIngredients);
      
      expect(metrics.trackableCount).toBe(0);
      expect(metrics.completedCount).toBe(0);
      expect(metrics.percentage).toBe(0);
      expect(metrics.breakdown.red.total).toBe(2);
    });

    it('should handle 100% completion', () => {
      const allCompletedIngredients: IngredientSelection[] = [
        { foodId: 'kale', colorCode: 'blue', notes: 'Superfood', clientChecked: true },
        { foodId: 'brown-rice', colorCode: 'yellow', notes: 'Whole grain', clientChecked: true }
      ];
      
      const metrics = calculateSmartProgress(allCompletedIngredients);
      
      expect(metrics.trackableCount).toBe(2);
      expect(metrics.completedCount).toBe(2);
      expect(metrics.percentage).toBe(100);
    });

    it('should handle ingredients with null color codes', () => {
      const ingredientsWithNull: IngredientSelection[] = [
        { foodId: 'unknown', colorCode: null, notes: 'No color assigned', clientChecked: true },
        { foodId: 'blueberries', colorCode: 'blue', notes: 'High antioxidants', clientChecked: true }
      ];
      
      const metrics = calculateSmartProgress(ingredientsWithNull);
      
      expect(metrics.trackableCount).toBe(1); // Only blue ingredient counts
      expect(metrics.completedCount).toBe(1);
      expect(metrics.percentage).toBe(100);
    });
  });

  describe('getTrackableIngredients', () => {
    it('should return only blue and yellow ingredients', () => {
      const trackable = getTrackableIngredients(mockIngredients);
      
      expect(trackable).toHaveLength(5);
      expect(trackable.every(ing => ing.colorCode === 'blue' || ing.colorCode === 'yellow')).toBe(true);
    });

    it('should maintain original ingredient data', () => {
      const trackable = getTrackableIngredients(mockIngredients);
      const blueberries = trackable.find(ing => ing.foodId === 'blueberries');
      
      expect(blueberries?.notes).toBe('High antioxidants');
      expect(blueberries?.clientChecked).toBe(true);
    });
  });

  describe('getAwarenessOnlyIngredients', () => {
    it('should return only red ingredients', () => {
      const awarenessOnly = getAwarenessOnlyIngredients(mockIngredients);
      
      expect(awarenessOnly).toHaveLength(2);
      expect(awarenessOnly.every(ing => ing.colorCode === 'red')).toBe(true);
    });
  });

  describe('getProgressSummary', () => {
    it('should provide appropriate message for no goals', () => {
      const metrics: ProgressMetrics = {
        trackableCount: 0,
        completedCount: 0,
        percentage: 0,
        breakdown: {
          blue: { total: 0, completed: 0 },
          yellow: { total: 0, completed: 0 },
          red: { total: 0, info: 'For awareness only - enjoy occasionally' }
        }
      };
      
      expect(getProgressSummary(metrics)).toBe('No nutrition goals set yet');
    });

    it('should provide appropriate message for zero progress', () => {
      const metrics: ProgressMetrics = {
        trackableCount: 5,
        completedCount: 0,
        percentage: 0,
        breakdown: {
          blue: { total: 3, completed: 0 },
          yellow: { total: 2, completed: 0 },
          red: { total: 2, info: 'For awareness only - enjoy occasionally' }
        }
      };
      
      expect(getProgressSummary(metrics)).toBe('0 of 5 nutrition goals started');
    });

    it('should provide appropriate message for partial progress', () => {
      const metrics: ProgressMetrics = {
        trackableCount: 5,
        completedCount: 3,
        percentage: 60,
        breakdown: {
          blue: { total: 3, completed: 2 },
          yellow: { total: 2, completed: 1 },
          red: { total: 2, info: 'For awareness only - enjoy occasionally' }
        }
      };
      
      expect(getProgressSummary(metrics)).toBe('3 of 5 nutrition goals completed (60%)');
    });

    it('should provide celebration message for 100% completion', () => {
      const metrics: ProgressMetrics = {
        trackableCount: 3,
        completedCount: 3,
        percentage: 100,
        breakdown: {
          blue: { total: 2, completed: 2 },
          yellow: { total: 1, completed: 1 },
          red: { total: 1, info: 'For awareness only - enjoy occasionally' }
        }
      };
      
      expect(getProgressSummary(metrics)).toBe('All 3 nutrition goals completed! 🎉');
    });
  });

  describe('getColorMessage', () => {
    it('should return appropriate message for blue foods', () => {
      expect(getColorMessage('blue')).toBe('Great choice! Add this to your regular rotation.');
    });

    it('should return appropriate message for yellow foods', () => {
      expect(getColorMessage('yellow')).toBe('Perfect for balanced nutrition in proper portions.');
    });

    it('should return appropriate message for red foods', () => {
      expect(getColorMessage('red')).toBe('Enjoy occasionally and in moderation. No tracking needed.');
    });

    it('should return default message for unknown colors', () => {
      expect(getColorMessage('purple')).toBe('Follow your coach\'s guidance for this ingredient.');
      expect(getColorMessage(null)).toBe('Follow your coach\'s guidance for this ingredient.');
    });
  });
});
