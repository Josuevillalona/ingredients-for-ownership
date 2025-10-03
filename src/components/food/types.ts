export type FoodStatus = 'approved' | 'neutral' | 'avoid' | 'none';

export interface FoodItemData {
  id: string;
  name: string;
  status: FoodStatus;
  categoryId: string;
  nutritionalHighlights?: string[];
  fdcId?: number;
}

export interface CategoryData {
  id: string;
  title: string;
  order: number;
}

export interface FoodSelectionState {
  foods: FoodItemData[];
  searchTerm: string;
  selectedCategory?: string;
}

// Status color mapping for UI - matches final plan colors
export const statusColors = {
  approved: {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-700',
    label: 'Approved'
  },
  neutral: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    label: 'Neutral'
  },
  avoid: {
    bg: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-red-700',
    label: 'Avoid'
  },
  none: {
    bg: 'bg-gray-200',
    border: 'border-gray-300',
    text: 'text-gray-500',
    label: 'Not Set'
  }
} as const;
