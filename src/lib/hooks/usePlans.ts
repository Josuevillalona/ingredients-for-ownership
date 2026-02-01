import { useState, useEffect, useCallback } from 'react';
import { planService } from '@/lib/firebase/plans';
import { useAuth } from './useAuth';
import type { Plan, CreatePlanData } from '@/lib/types';

interface UsePlansReturn {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  createPlan: (planData: CreatePlanData) => Promise<string | null>;
  updatePlan: (planId: string, updates: Partial<CreatePlanData>) => Promise<boolean>;
  deletePlan: (planId: string) => Promise<boolean>;
  duplicatePlan: (planId: string, newTitle?: string) => Promise<string | null>;
  getPlansForClient: (clientId: string) => Promise<Plan[]>;
  loadPlans: () => Promise<void>;
}

export function usePlans(): UsePlansReturn {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all plans for the current coach
  const loadPlans = useCallback(async () => {
    if (!user) {
      setPlans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const coachPlans = await planService.getPlansForCoach(user.uid);
      setPlans(coachPlans);
    } catch (err) {
      console.error('Error loading plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new plan
  const createPlan = async (planData: CreatePlanData): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const planId = await planService.createPlan(user.uid, planData);

      // Reload plans to include the new one
      await loadPlans();

      return planId;
    } catch (err) {
      console.error('Error creating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to create plan');
      return null;
    }
  };

  // Update an existing plan
  const updatePlan = async (planId: string, updates: Partial<CreatePlanData>): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await planService.updatePlan(planId, user.uid, updates);

      // Reload plans to reflect the update
      await loadPlans();

      return true;
    } catch (err) {
      console.error('Error updating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to update plan');
      return false;
    }
  };

  // Delete a plan
  const deletePlan = async (planId: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await planService.deletePlan(planId, user.uid);

      // Remove from local state
      setPlans(prev => prev.filter(plan => plan.id !== planId));

      return true;
    } catch (err) {
      console.error('Error deleting plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete plan');
      return false;
    }
  };

  // Duplicate a plan
  const duplicatePlan = async (planId: string, newTitle?: string): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const newPlanId = await planService.duplicatePlan(planId, user.uid, newTitle);

      // Reload plans to include the new one
      await loadPlans();

      return newPlanId;
    } catch (err) {
      console.error('Error duplicating plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to duplicate plan');
      return null;
    }
  };

  // Get plans for a specific client
  const getPlansForClient = async (clientId: string): Promise<Plan[]> => {
    if (!user) return [];

    try {
      setError(null);
      return await planService.getPlansForClient(user.uid, clientId);
    } catch (err) {
      console.error('Error getting plans for client:', err);
      setError(err instanceof Error ? err.message : 'Failed to get client plans');
      return [];
    }
  };

  // Load plans when user changes
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    getPlansForClient,
    loadPlans
  };
}

// Hook for getting a specific plan by ID
export function usePlan(planId: string | null) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) {
      setPlan(null);
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const planData = await planService.getPlan(planId);
        setPlan(planData);
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  return { plan, loading, error };
}

// Hook for getting a shared plan by token (public access)
export function useSharedPlan(shareToken: string | null) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareToken) {
      setPlan(null);
      setLoading(false);
      return;
    }

    const fetchSharedPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const planData = await planService.getPlanByShareToken(shareToken);
        setPlan(planData);
      } catch (err) {
        console.error('Error fetching shared plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch shared plan');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPlan();
  }, [shareToken]);

  return { plan, loading, error };
}
