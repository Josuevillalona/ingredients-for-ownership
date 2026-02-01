import { useState, useEffect, useCallback } from 'react';
import type { IngredientDocument, Food } from '@/lib/types';
import { calculateSmartProgress, type ProgressMetrics } from '@/lib/utils/progress';

interface PublicIngredientDocument {
  id: string;
  clientName: string;
  ingredients: Array<{
    foodId: string;
    categoryId: string;
    colorCode: 'blue' | 'yellow' | 'red' | null;
    isSelected: boolean;
    clientChecked?: boolean;
    notes?: string;
  }>;
  createdAt: any;
  updatedAt: any;
  status: 'draft' | 'published';
}

interface UseSharedDocumentResult {
  document: PublicIngredientDocument | null;
  foods: Food[];
  loading: boolean;
  error: string | null;
  updateTracking: (foodId: string, checked: boolean) => Promise<void>;
  trackingLoading: Set<string>;
  progressPercentage: number;
  progressMetrics: ProgressMetrics | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing shared ingredient documents
 * Provides document loading, tracking updates, and progress calculation
 */
export function useSharedDocument(shareToken: string): UseSharedDocumentResult {
  const [document, setDocument] = useState<PublicIngredientDocument | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState<Set<string>>(new Set());

  const loadSharedDocument = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch shared document
      const documentResponse = await fetch(`/api/share/${shareToken}`);
      const documentData = await documentResponse.json();

      if (!documentResponse.ok) {
        throw new Error(documentData.error || 'Failed to load document');
      }

      setDocument(documentData.document);

      // Load all foods for ingredient details
      const foodsResponse = await fetch('/api/foods');
      if (foodsResponse.ok) {
        const foodsData = await foodsResponse.json();
        setFoods(foodsData.foods || []);
      }

    } catch (error) {
      console.error('Error loading shared document:', error);
      setError(error instanceof Error ? error.message : 'Failed to load your nutrition plan');
    } finally {
      setLoading(false);
    }
  }, [shareToken]);

  const updateTracking = async (foodId: string, checked: boolean) => {
    if (!document) return;

    setTrackingLoading(prev => new Set(prev).add(foodId));

    try {
      const response = await fetch(`/api/share/${shareToken}/tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodId,
          clientChecked: checked
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tracking');
      }

      // Update local state
      setDocument(prev => {
        if (!prev) return prev;

        const updatedIngredients = prev.ingredients.map(ingredient =>
          ingredient.foodId === foodId
            ? { ...ingredient, clientChecked: checked }
            : ingredient
        );

        return {
          ...prev,
          ingredients: updatedIngredients
        };
      });

    } catch (error) {
      console.error('Error updating tracking:', error);
      throw error; // Re-throw so component can handle it
    } finally {
      setTrackingLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(foodId);
        return newSet;
      });
    }
  };

  const progressPercentage = () => {
    if (!document) return 0;
    const metrics = calculateSmartProgress(document.ingredients);
    return metrics.percentage;
  };

  const progressMetrics = () => {
    if (!document) return null;
    return calculateSmartProgress(document.ingredients);
  };

  useEffect(() => {
    if (shareToken) {
      loadSharedDocument();
    }
  }, [loadSharedDocument, shareToken]);

  return {
    document,
    foods,
    loading,
    error,
    updateTracking,
    trackingLoading,
    progressPercentage: progressPercentage(),
    progressMetrics: progressMetrics(),
    refetch: loadSharedDocument
  };
}
