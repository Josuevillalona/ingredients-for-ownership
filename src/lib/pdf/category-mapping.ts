/**
 * PDF Category Display Configuration
 * Dynamically generates PDF display metadata from any food category
 * This ensures new categories from FDC API automatically work in PDFs
 */

export interface PDFCategoryConfig {
  displayName: string;
  order: number;
  description: string;
}

/**
 * Known category display preferences
 * Only for categories we want specific formatting
 */
const KNOWN_CATEGORIES: Record<string, Partial<PDFCategoryConfig>> = {
  'meat-poultry': {
    displayName: 'MEAT & POULTRY',
    order: 1,
    description: 'unprocessed, grass-fed when possible'
  },
  'seafood': {
    displayName: 'SEAFOOD',
    order: 2,
    description: 'wild-caught preferred'
  },
  'eggs-dairy': {
    displayName: 'EGGS & DAIRY',
    order: 3,
    description: 'pasture-raised & organic'
  },
  'legumes': {
    displayName: 'LEGUMES',
    order: 4,
    description: 'beans, lentils, peas'
  },
  'grains': {
    displayName: 'GRAINS',
    order: 5,
    description: 'whole grains preferred'
  },
  'nuts-seeds': {
    displayName: 'NUTS & SEEDS',
    order: 6,
    description: 'raw & unsalted preferred'
  },
  'vegetables': {
    displayName: 'VEGETABLES',
    order: 7,
    description: 'fresh/frozen, variety emphasized'
  },
  'fruits': {
    displayName: 'FRUITS',
    order: 8,
    description: 'whole fruits, watch portions'
  }
};

/**
 * Get PDF display configuration for any category
 * Dynamically handles new categories from AI categorization
 */
export function getPDFCategoryConfig(categoryId: string): PDFCategoryConfig {
  const known = KNOWN_CATEGORIES[categoryId];
  
  if (known) {
    return {
      displayName: known.displayName || formatCategoryName(categoryId),
      order: known.order || 99,
      description: known.description || ''
    };
  }
  
  // Auto-generate config for unknown categories
  return {
    displayName: formatCategoryName(categoryId),
    order: 99,
    description: 'additional ingredients'
  };
}

/**
 * Format category ID into human-readable display name
 */
function formatCategoryName(categoryId: string): string {
  return categoryId
    .split('-')
    .map(word => word.toUpperCase())
    .join(' & ');
}

/**
 * Get all category configs sorted by order
 */
export function getAllCategoryConfigs(categoryIds: string[]): PDFCategoryConfig[] {
  return categoryIds
    .map(id => getPDFCategoryConfig(id))
    .sort((a, b) => a.order - b.order);
}
