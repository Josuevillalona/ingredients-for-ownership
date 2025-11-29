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

// Status color mapping for UI - matches PDF export colors exactly
export const statusColors = {
  approved: {
    bg: 'bg-[#81D4FA]',
    border: 'border-[#81D4FA]',
    text: 'text-[#5B9BD5]',
    label: 'Approved',
    hex: '#81D4FA'
  },
  neutral: {
    bg: 'bg-[#FFC000]',
    border: 'border-[#FFC000]',
    text: 'text-[#D4A000]',
    label: 'Neutral',
    hex: '#FFC000'
  },
  avoid: {
    bg: 'bg-[#FF5252]',
    border: 'border-[#FF5252]',
    text: 'text-[#D32F2F]',
    label: 'Avoid',
    hex: '#FF5252'
  },
  none: {
    bg: 'bg-gray-200',
    border: 'border-gray-300',
    text: 'text-gray-500',
    label: 'Not Set',
    hex: '#E5E7EB'
  }
} as const;
