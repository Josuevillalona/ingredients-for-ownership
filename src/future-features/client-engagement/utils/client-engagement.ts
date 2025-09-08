import type { IngredientDocument } from '@/lib/types';
import { calculateSmartProgress } from './progress';

/**
 * Client engagement status types
 */
export type EngagementStatus = 'active' | 'needs-attention' | 'new' | 'inactive';

export interface ClientEngagementMetrics {
  status: EngagementStatus;
  progressPercentage: number;
  totalGoals: number;
  completedGoals: number;
  documentsCount: number;
  lastActivityDays: number | null;
  statusMessage: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Calculate client engagement metrics based on their ingredient documents
 * @param documents - Array of ingredient documents for the client
 * @returns Client engagement metrics
 */
export function calculateClientEngagement(documents: IngredientDocument[]): ClientEngagementMetrics {
  if (documents.length === 0) {
    return {
      status: 'new',
      progressPercentage: 0,
      totalGoals: 0,
      completedGoals: 0,
      documentsCount: 0,
      lastActivityDays: null,
      statusMessage: 'No plans created yet',
      priority: 'medium'
    };
  }

  // Calculate overall progress across all documents
  let totalTrackableGoals = 0;
  let totalCompletedGoals = 0;
  let lastActivityTimestamp: number | null = null;

  documents.forEach(doc => {
    const progress = calculateSmartProgress(doc.ingredients);
    totalTrackableGoals += progress.trackableCount;
    totalCompletedGoals += progress.completedCount;

    // Check for recent client activity (any clientChecked = true)
    const hasRecentActivity = doc.ingredients.some(ingredient => ingredient.clientChecked);
    if (hasRecentActivity && doc.updatedAt) {
      const timestamp = doc.updatedAt.toMillis ? doc.updatedAt.toMillis() : new Date(doc.updatedAt).getTime();
      if (!lastActivityTimestamp || timestamp > lastActivityTimestamp) {
        lastActivityTimestamp = timestamp;
      }
    }
  });

  const progressPercentage = totalTrackableGoals > 0 ? Math.round((totalCompletedGoals / totalTrackableGoals) * 100) : 0;
  
  // Calculate days since last activity
  let lastActivityDays: number | null = null;
  if (lastActivityTimestamp) {
    lastActivityDays = Math.floor((Date.now() - lastActivityTimestamp) / (1000 * 60 * 60 * 24));
  }

  // Determine engagement status
  let status: EngagementStatus;
  let statusMessage: string;
  let priority: 'high' | 'medium' | 'low';

  if (lastActivityDays === null) {
    // No activity yet
    status = 'new';
    statusMessage = 'Plan shared, awaiting first interaction';
    priority = 'medium';
  } else if (lastActivityDays <= 3) {
    // Recent activity
    status = 'active';
    statusMessage = `Active • Last tracked ${lastActivityDays === 0 ? 'today' : `${lastActivityDays}d ago`}`;
    priority = progressPercentage >= 80 ? 'low' : 'medium';
  } else if (lastActivityDays <= 7) {
    // Moderate activity gap
    status = 'needs-attention';
    statusMessage = `${lastActivityDays}d since last activity`;
    priority = 'medium';
  } else {
    // Long activity gap
    status = 'inactive';
    statusMessage = `${lastActivityDays}d since last activity`;
    priority = 'high';
  }

  // Override priority for very high or very low progress
  if (progressPercentage >= 90) {
    priority = 'low'; // Doing great, low priority
  } else if (progressPercentage < 20 && lastActivityDays !== null && lastActivityDays > 3) {
    priority = 'high'; // Low progress + inactivity = needs attention
  }

  return {
    status,
    progressPercentage,
    totalGoals: totalTrackableGoals,
    completedGoals: totalCompletedGoals,
    documentsCount: documents.length,
    lastActivityDays,
    statusMessage,
    priority
  };
}

/**
 * Get visual styling for engagement status
 * @param status - The engagement status
 * @returns CSS classes and colors for the status
 */
export function getEngagementStatusStyling(status: EngagementStatus) {
  switch (status) {
    case 'active':
      return {
        badgeClass: 'bg-green-100 text-green-800 border-green-200',
        dotClass: 'bg-green-500',
        label: 'Active'
      };
    case 'needs-attention':
      return {
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotClass: 'bg-yellow-500',
        label: 'Needs Attention'
      };
    case 'new':
      return {
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        dotClass: 'bg-blue-500',
        label: 'New'
      };
    case 'inactive':
      return {
        badgeClass: 'bg-red-100 text-red-800 border-red-200',
        dotClass: 'bg-red-500',
        label: 'Inactive'
      };
    default:
      return {
        badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
        dotClass: 'bg-gray-500',
        label: 'Unknown'
      };
  }
}

/**
 * Get priority styling for client cards
 * @param priority - The priority level
 * @returns CSS classes for priority indication
 */
export function getPriorityStyling(priority: 'high' | 'medium' | 'low') {
  switch (priority) {
    case 'high':
      return {
        borderClass: 'border-l-4 border-l-red-500',
        bgClass: 'bg-red-50/50'
      };
    case 'medium':
      return {
        borderClass: 'border-l-4 border-l-yellow-500',
        bgClass: 'bg-yellow-50/30'
      };
    case 'low':
      return {
        borderClass: 'border-l-4 border-l-green-500',
        bgClass: 'bg-green-50/30'
      };
    default:
      return {
        borderClass: '',
        bgClass: ''
      };
  }
}

/**
 * Get recommended coaching action based on engagement metrics
 * @param metrics - Client engagement metrics
 * @returns Suggested coaching action
 */
export function getCoachingAction(metrics: ClientEngagementMetrics): string {
  const { status, progressPercentage, lastActivityDays } = metrics;

  if (status === 'new') {
    return 'Send welcome message';
  }

  if (status === 'active' && progressPercentage >= 80) {
    return 'Celebrate success';
  }

  if (status === 'active' && progressPercentage < 50) {
    return 'Offer support';
  }

  if (status === 'needs-attention') {
    return 'Send check-in';
  }

  if (status === 'inactive') {
    return 'Schedule call';
  }

  return 'Monitor progress';
}
