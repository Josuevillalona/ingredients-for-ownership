import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { Plan, CreatePlanData, PlanFoodItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export class PlanService {
  private collectionName = 'plans';

  /**
   * Create a new nutrition plan for a client
   */
  async createPlan(coachId: string, planData: CreatePlanData): Promise<string> {
    try {
      const planRef = doc(collection(db, this.collectionName));
      const planId = planRef.id;

      const plan: Omit<Plan, 'id'> = {
        clientId: planData.clientId,
        coachId,
        title: planData.title.trim(),
        description: planData.description?.trim() || '',
        foods: planData.foods,
        shareToken: uuidv4(), // Generate unique share token
        isActive: true,
        createdAt: Timestamp.now(),
        lastModified: Timestamp.now()
      };

      await setDoc(planRef, plan);
      return planId;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw new Error('Failed to create nutrition plan');
    }
  }

  /**
   * Get all plans for a coach
   */
  async getPlansForCoach(coachId: string): Promise<Plan[]> {
    try {
      const plansQuery = query(
        collection(db, this.collectionName),
        where('coachId', '==', coachId),
        orderBy('lastModified', 'desc')
      );

      const snapshot = await getDocs(plansQuery);
      const plans: Plan[] = [];

      snapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() } as Plan);
      });

      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw new Error('Failed to fetch plans');
    }
  }

  /**
   * Get plans for a specific client
   */
  async getPlansForClient(coachId: string, clientId: string): Promise<Plan[]> {
    try {
      const plansQuery = query(
        collection(db, this.collectionName),
        where('coachId', '==', coachId),
        where('clientId', '==', clientId),
        orderBy('lastModified', 'desc')
      );

      const snapshot = await getDocs(plansQuery);
      const plans: Plan[] = [];

      snapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() } as Plan);
      });

      return plans;
    } catch (error) {
      console.error('Error fetching client plans:', error);
      throw new Error('Failed to fetch client plans');
    }
  }

  /**
   * Get a specific plan by ID
   */
  async getPlan(planId: string): Promise<Plan | null> {
    try {
      const planDoc = await getDoc(doc(db, this.collectionName, planId));
      
      if (!planDoc.exists()) {
        return null;
      }

      return { id: planDoc.id, ...planDoc.data() } as Plan;
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw new Error('Failed to fetch plan');
    }
  }

  /**
   * Get a plan by share token (for public access)
   */
  async getPlanByShareToken(shareToken: string): Promise<Plan | null> {
    try {
      const plansQuery = query(
        collection(db, this.collectionName),
        where('shareToken', '==', shareToken),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(plansQuery);
      
      if (snapshot.empty) {
        return null;
      }

      const planDoc = snapshot.docs[0];
      return { id: planDoc.id, ...planDoc.data() } as Plan;
    } catch (error) {
      console.error('Error fetching plan by share token:', error);
      throw new Error('Failed to fetch shared plan');
    }
  }

  /**
   * Update an existing plan
   */
  async updatePlan(planId: string, coachId: string, updates: Partial<CreatePlanData>): Promise<void> {
    try {
      const plan = await this.getPlan(planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }

      if (plan.coachId !== coachId) {
        throw new Error('Cannot update plan belonging to another coach');
      }

      const updateData: Partial<Plan> = {
        ...updates,
        lastModified: Timestamp.now()
      };

      await updateDoc(doc(db, this.collectionName, planId), updateData);
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  /**
   * Delete a plan
   */
  async deletePlan(planId: string, coachId: string): Promise<void> {
    try {
      const plan = await this.getPlan(planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }

      if (plan.coachId !== coachId) {
        throw new Error('Cannot delete plan belonging to another coach');
      }

      await deleteDoc(doc(db, this.collectionName, planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }

  /**
   * Generate shareable URL for a plan
   */
  getShareableUrl(shareToken: string): string {
    return `${window.location.origin}/shared/plan/${shareToken}`;
  }

  /**
   * Duplicate a plan
   */
  async duplicatePlan(planId: string, coachId: string, newTitle?: string): Promise<string> {
    try {
      const originalPlan = await this.getPlan(planId);
      
      if (!originalPlan) {
        throw new Error('Original plan not found');
      }

      if (originalPlan.coachId !== coachId) {
        throw new Error('Cannot duplicate plan belonging to another coach');
      }

      const duplicateData: CreatePlanData = {
        clientId: originalPlan.clientId,
        title: newTitle || `${originalPlan.title} (Copy)`,
        description: originalPlan.description,
        foods: originalPlan.foods
      };

      return await this.createPlan(coachId, duplicateData);
    } catch (error) {
      console.error('Error duplicating plan:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const planService = new PlanService();
