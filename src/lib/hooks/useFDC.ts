/**
 * React Hook for FDC (FoodData Central) API Integration
 * Provides search functionality and food details from USDA database
 */

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { 
  FDCSearchCriteria, 
  FDCEnhancedFoodItem
} from '@/lib/types/fdc';
import type { FoodItem } from '@/lib/types';

interface FDCSearchResult {
  data: FDCEnhancedFoodItem[];
  meta: {
    query: string;
    pageSize: number;
    pageNumber: number;
    resultsCount: number;
  };
}

interface FDCFoodDetail {
  fdcDetail: any;
  foodItem: Omit<FoodItem, 'id'>;
}

interface FDCHookState {
  isLoading: boolean;
  error: string | null;
  searchResults: FDCEnhancedFoodItem[];
  searchMeta: FDCSearchResult['meta'] | null;
}

export function useFDC() {
  const { user } = useAuth();
  const [state, setState] = useState<FDCHookState>({
    isLoading: false,
    error: null,
    searchResults: [],
    searchMeta: null
  });

  /**
   * Helper function to get authorization headers
   */
  const getAuthHeaders = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, [user]);

  /**
   * Search foods in FDC database
   */
  const searchFoods = useCallback(async (criteria: FDCSearchCriteria): Promise<FDCEnhancedFoodItem[]> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const headers = await getAuthHeaders();

      const response = await fetch('/api/fdc/search', {
        method: 'POST',
        headers,
        body: JSON.stringify(criteria)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search foods');
      }

      const result: { success: boolean; data: FDCEnhancedFoodItem[]; meta: FDCSearchResult['meta'] } = await response.json();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        searchResults: result.data,
        searchMeta: result.meta
      }));

      return result.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [getAuthHeaders]);

  /**
   * Search foods using URL parameters (for simpler searches)
   */
  const searchFoodsSimple = useCallback(async (
    query: string,
    options?: {
      pageSize?: number;
      pageNumber?: number;
      dataType?: string[];
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<FDCEnhancedFoodItem[]> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const headers = await getAuthHeaders();
      const searchParams = new URLSearchParams({ query });
      
      if (options?.pageSize) searchParams.set('pageSize', options.pageSize.toString());
      if (options?.pageNumber) searchParams.set('pageNumber', options.pageNumber.toString());
      if (options?.dataType) searchParams.set('dataType', options.dataType.join(','));
      if (options?.sortBy) searchParams.set('sortBy', options.sortBy);
      if (options?.sortOrder) searchParams.set('sortOrder', options.sortOrder);

      const response = await fetch(`/api/fdc/search?${searchParams}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search foods');
      }

      const result: { success: boolean; data: FDCEnhancedFoodItem[]; meta: FDCSearchResult['meta'] } = await response.json();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        searchResults: result.data,
        searchMeta: result.meta
      }));

      return result.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [getAuthHeaders]);

  /**
   * Get detailed information for a single food item
   */
  const getFoodDetail = useCallback(async (
    fdcId: number,
    format: 'abridged' | 'full' = 'abridged'
  ): Promise<FDCFoodDetail> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const headers = await getAuthHeaders();
      const searchParams = new URLSearchParams({ format });

      const response = await fetch(`/api/fdc/foods/${fdcId}?${searchParams}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch food details');
      }

      const result: { success: boolean; data: FDCFoodDetail } = await response.json();
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [getAuthHeaders]);

  /**
   * Get detailed information for multiple food items
   */
  const getFoodsDetails = useCallback(async (
    fdcIds: number[],
    format: 'abridged' | 'full' = 'abridged',
    nutrients?: number[]
  ): Promise<FDCFoodDetail[]> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const headers = await getAuthHeaders();

      const response = await fetch('/api/fdc/foods', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fdcIds,
          format,
          nutrients
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch foods details');
      }

      const result: { success: boolean; data: FDCFoodDetail[] } = await response.json();
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, [getAuthHeaders]);

  /**
   * Clear search results and reset state
   */
  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      searchResults: [],
      searchMeta: null
    });
  }, []);

  /**
   * Check if FDC service is available (client-side check)
   */
  const isAvailable = useCallback(async (): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      
      // Try a simple search to check availability
      const response = await fetch('/api/fdc/search?query=apple&pageSize=1', {
        method: 'GET',
        headers
      });

      return response.status !== 503; // 503 means service unavailable
    } catch (error) {
      return false;
    }
  }, [getAuthHeaders]);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    searchResults: state.searchResults,
    searchMeta: state.searchMeta,
    
    // Actions
    searchFoods,
    searchFoodsSimple,
    getFoodDetail,
    getFoodsDetails,
    clearResults,
    isAvailable
  };
}
