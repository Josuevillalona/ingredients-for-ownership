
import type { FoodItem } from '@/lib/types';

export interface FoodCategoryConfig {
    id: string;
    displayName: string;
    description: string;
    order: number;
}

// Single Source of Truth for Food Categories
// Matches the "Coach Categories" defined in NewPlanPage/EditPlanPage
export const FOOD_CATEGORIES: Record<string, FoodCategoryConfig> = {
    'meat': {
        id: 'meat',
        displayName: 'Meat & Poultry',
        description: 'Chicken, beef, pork, lamb, eggs',
        order: 1
    },
    'seafood': {
        id: 'seafood',
        displayName: 'Seafood',
        description: 'Fish, shellfish, marine proteins',
        order: 2
    },
    'plant-proteins': {
        id: 'plant-proteins',
        displayName: 'Plant Proteins',
        description: 'Tofu, beans, lentils, protein powders',
        order: 3
    },
    'vegetables': {
        id: 'vegetables',
        displayName: 'Vegetables',
        description: 'Fresh vegetables and leafy greens',
        order: 4
    },
    'healthy-carbs': {
        id: 'healthy-carbs',
        displayName: 'Healthy Carbs',
        description: 'Whole grains, quinoa, sweet potatoes',
        order: 5
    },
    'healthy-fats': {
        id: 'healthy-fats',
        displayName: 'Healthy Fats',
        description: 'Nuts, seeds, avocado, olive oil',
        order: 6
    },
    'fruits': {
        id: 'fruits',
        displayName: 'Fruits',
        description: 'Fresh and dried fruits',
        order: 7
    },
    'dairy': {
        id: 'dairy',
        displayName: 'Dairy',
        description: 'Milk, cheese, yogurt products',
        order: 8
    },
    'other': {
        id: 'other',
        displayName: 'Other Foods',
        description: 'Processed and miscellaneous foods',
        order: 9
    }
};

/**
 * Helper to get categories as an array sorted by order
 */
export function getSortedCategories(): FoodCategoryConfig[] {
    return Object.values(FOOD_CATEGORIES).sort((a, b) => a.order - b.order);
}

/**
 * Determine food category from FoodItem
 */
export function determineFoodCategory(food: { category?: string; categoryId?: string; tags?: string[] }): string {
    // 1. Use assigned category if valid (checking both category and categoryId)
    const category = food.category || food.categoryId;
    if (category && FOOD_CATEGORIES[category]) {
        return category;
    }

    // 2. Fallback: Tag-based guessing
    if (!food.tags) return 'other';

    const tags = food.tags.map(tag => tag.toLowerCase());

    if (tags.some(tag => tag.includes('meat') || tag.includes('poultry') || tag.includes('chicken') || tag.includes('beef') || tag.includes('pork'))) return 'meat';
    if (tags.some(tag => tag.includes('fish') || tag.includes('seafood') || tag.includes('shrimp') || tag.includes('salmon'))) return 'seafood';
    if (tags.some(tag => tag.includes('bean') || tag.includes('lentil') || tag.includes('tofu') || tag.includes('tempeh'))) return 'plant-proteins';
    if (tags.some(tag => tag.includes('vegetable') || tag.includes('spinach') || tag.includes('kale') || tag.includes('broccoli'))) return 'vegetables';
    if (tags.some(tag => tag.includes('grain') || tag.includes('rice') || tag.includes('oat') || tag.includes('quinoa') || tag.includes('potato'))) return 'healthy-carbs';
    if (tags.some(tag => tag.includes('nut') || tag.includes('seed') || tag.includes('avocado') || tag.includes('oil'))) return 'healthy-fats';
    if (tags.some(tag => tag.includes('fruit') || tag.includes('berry') || tag.includes('apple') || tag.includes('banana'))) return 'fruits';
    if (tags.some(tag => tag.includes('milk') || tag.includes('cheese') || tag.includes('yogurt') || tag.includes('dairy'))) return 'dairy';

    return 'other';
}
