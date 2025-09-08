import { FoodCategory } from '../types/ingredient-document';

/**
 * Meat & Poultry Category - Step 1 of food database creation
 * Testing structure with one complete category before expanding
 */
export const MEAT_POULTRY_CATEGORY: FoodCategory = {
  id: 'meat-poultry',
  name: 'Meat & Poultry',
  order: 1,
  description: 'unprocessed, hormone- & antibiotic-free / pasture-raised when possible',
  foods: [
    {
      id: 'beef-lamb-pork',
      name: 'Beef, Lamb, Pork - ONLY grass-fed, lean, pasture-raised whenever possible',
      categoryId: 'meat-poultry',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Iron', 'B vitamins'],
      warnings: ['Choose grass-fed when possible', 'Limit processed varieties']
    },
    {
      id: 'chicken-skinless',
      name: 'Chicken - skinless',
      categoryId: 'meat-poultry',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Lean protein', 'Niacin', 'Selenium'],
      fdcId: 171477 // Chicken breast, skinless, boneless, meat only, cooked, roasted
    },
    {
      id: 'chicken-with-skin',
      name: 'Chicken - with skin',
      categoryId: 'meat-poultry',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Protein', 'Healthy fats when pastured'],
      fdcId: 171078 // Chicken, broilers or fryers, breast, meat and skin, cooked, roasted
    },
    {
      id: 'turkey-skinless',
      name: 'Turkey - skinless',
      categoryId: 'meat-poultry',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Lean protein', 'Tryptophan', 'Phosphorus']
    },
    {
      id: 'turkey-with-skin',
      name: 'Turkey - with skin',
      categoryId: 'meat-poultry',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Protein', 'Healthy fats']
    },
    {
      id: 'duck',
      name: 'Duck',
      categoryId: 'meat-poultry',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Protein', 'Iron', 'Selenium'],
      warnings: ['Higher in saturated fat']
    },
    {
      id: 'liver',
      name: 'Liver (all types)',
      categoryId: 'meat-poultry',
      servingSize: '2-3 oz',
      nutritionalHighlights: ['Vitamin A', 'Iron', 'B vitamins'],
      warnings: ['Very high in vitamin A - limit frequency']
    }
  ]
};

/**
 * Seafood Category - Step 2 of food database creation
 */
export const SEAFOOD_CATEGORY: FoodCategory = {
  id: 'seafood',
  name: 'Seafood',
  order: 2,
  description: 'wild-caught when possible, low mercury varieties preferred',
  foods: [
    {
      id: 'salmon-wild',
      name: 'Salmon - wild-caught',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Omega-3 fatty acids', 'High protein', 'Vitamin D'],
      warnings: ['Choose wild-caught over farmed when possible'],
      fdcId: 175167 // Fish, salmon, Atlantic, wild, cooked, dry heat
    },
    {
      id: 'salmon-farmed',
      name: 'Salmon - farmed',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Protein', 'Omega-3 fatty acids'],
      warnings: ['May contain higher contaminants than wild-caught']
    },
    {
      id: 'tuna-light',
      name: 'Tuna - light/skipjack',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Selenium', 'Vitamin B12'],
      warnings: ['Lower mercury than albacore']
    },
    {
      id: 'tuna-albacore',
      name: 'Tuna - albacore/white',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Omega-3 fatty acids'],
      warnings: ['Higher mercury content - limit frequency']
    },
    {
      id: 'cod',
      name: 'Cod',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Lean protein', 'Low mercury', 'Phosphorus']
    },
    {
      id: 'halibut',
      name: 'Halibut',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Lean protein', 'Magnesium', 'Potassium'],
      warnings: ['Moderate mercury levels']
    },
    {
      id: 'sardines',
      name: 'Sardines',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Omega-3 fatty acids', 'Calcium', 'Low mercury'],
      notes: 'Excellent sustainable choice'
    },
    {
      id: 'mackerel',
      name: 'Mackerel',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Omega-3 fatty acids', 'Vitamin B12', 'Selenium']
    },
    {
      id: 'anchovies',
      name: 'Anchovies',
      categoryId: 'seafood',
      servingSize: '1-2 oz',
      nutritionalHighlights: ['Omega-3 fatty acids', 'Calcium', 'Low mercury']
    },
    {
      id: 'shrimp',
      name: 'Shrimp',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Selenium', 'Low mercury'],
      warnings: ['High cholesterol content']
    },
    {
      id: 'crab',
      name: 'Crab',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Zinc', 'Copper']
    },
    {
      id: 'lobster',
      name: 'Lobster',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Zinc', 'Phosphorus']
    },
    {
      id: 'scallops',
      name: 'Scallops',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Magnesium', 'Potassium']
    },
    {
      id: 'mussels',
      name: 'Mussels',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['High protein', 'Iron', 'Vitamin B12']
    },
    {
      id: 'oysters',
      name: 'Oysters',
      categoryId: 'seafood',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Zinc', 'Iron', 'Vitamin B12'],
      warnings: ['High cholesterol', 'Raw consumption risks']
    }
  ]
};

/**
 * Eggs, Dairy & Alternatives Category - Step 3 of food database creation
 */
export const EGGS_DAIRY_CATEGORY: FoodCategory = {
  id: 'eggs-dairy',
  name: 'Eggs, Dairy & Alternatives',
  order: 3,
  description: 'organic, grass-fed, and hormone-free options preferred',
  foods: [
    {
      id: 'eggs-whole',
      name: 'Eggs - whole (pasture-raised preferred)',
      categoryId: 'eggs-dairy',
      servingSize: '1-2 eggs',
      nutritionalHighlights: ['Complete protein', 'Choline', 'Vitamin D']
    },
    {
      id: 'egg-whites',
      name: 'Egg whites',
      categoryId: 'eggs-dairy',
      servingSize: '3-4 egg whites',
      nutritionalHighlights: ['Pure protein', 'Low calorie', 'No fat']
    },
    {
      id: 'milk-whole',
      name: 'Milk - whole (grass-fed preferred)',
      categoryId: 'eggs-dairy',
      servingSize: '1 cup',
      nutritionalHighlights: ['Calcium', 'Protein', 'Vitamin B12']
    },
    {
      id: 'milk-low-fat',
      name: 'Milk - 2% or skim',
      categoryId: 'eggs-dairy',
      servingSize: '1 cup',
      nutritionalHighlights: ['Calcium', 'Protein', 'Lower calories']
    },
    {
      id: 'yogurt-greek',
      name: 'Greek yogurt - plain',
      categoryId: 'eggs-dairy',
      servingSize: '3/4 cup',
      nutritionalHighlights: ['High protein', 'Probiotics', 'Calcium']
    },
    {
      id: 'yogurt-regular',
      name: 'Regular yogurt - plain',
      categoryId: 'eggs-dairy',
      servingSize: '3/4 cup',
      nutritionalHighlights: ['Probiotics', 'Calcium', 'Protein']
    },
    {
      id: 'cheese-hard',
      name: 'Hard cheeses (cheddar, swiss, etc.)',
      categoryId: 'eggs-dairy',
      servingSize: '1 oz',
      nutritionalHighlights: ['Calcium', 'Protein', 'Vitamin K2'],
      warnings: ['High in saturated fat and sodium']
    },
    {
      id: 'cheese-soft',
      name: 'Soft cheeses (brie, goat cheese, etc.)',
      categoryId: 'eggs-dairy',
      servingSize: '1 oz',
      nutritionalHighlights: ['Calcium', 'Protein'],
      warnings: ['High in saturated fat']
    },
    {
      id: 'cottage-cheese',
      name: 'Cottage cheese',
      categoryId: 'eggs-dairy',
      servingSize: '1/2 cup',
      nutritionalHighlights: ['High protein', 'Calcium', 'Low fat options available']
    },
    {
      id: 'butter',
      name: 'Butter (grass-fed preferred)',
      categoryId: 'eggs-dairy',
      servingSize: '1 tbsp',
      nutritionalHighlights: ['Vitamin A', 'Vitamin K2'],
      warnings: ['High in saturated fat - use in moderation']
    },
    {
      id: 'almond-milk',
      name: 'Almond milk - unsweetened',
      categoryId: 'eggs-dairy',
      servingSize: '1 cup',
      nutritionalHighlights: ['Low calorie', 'Vitamin E', 'Lactose-free'],
      notes: 'Often fortified with calcium and vitamins'
    },
    {
      id: 'oat-milk',
      name: 'Oat milk - unsweetened',
      categoryId: 'eggs-dairy',
      servingSize: '1 cup',
      nutritionalHighlights: ['Fiber', 'Beta-glucan', 'Lactose-free'],
      warnings: ['Higher in carbohydrates than other plant milks']
    },
    {
      id: 'soy-milk',
      name: 'Soy milk - unsweetened',
      categoryId: 'eggs-dairy',
      servingSize: '1 cup',
      nutritionalHighlights: ['Complete protein', 'Isoflavones', 'Lactose-free']
    },
    {
      id: 'coconut-milk',
      name: 'Coconut milk - canned',
      categoryId: 'eggs-dairy',
      servingSize: '1/4 cup',
      nutritionalHighlights: ['Medium-chain triglycerides', 'Lactose-free'],
      warnings: ['Very high in saturated fat']
    }
  ]
};

/**
 * Legumes Category - Step 4 of food database creation
 */
export const LEGUMES_CATEGORY: FoodCategory = {
  id: 'legumes',
  name: 'Legumes',
  order: 4,
  description: 'beans, lentils, and peas - excellent plant protein sources',
  foods: [
    {
      id: 'black-beans',
      name: 'Black beans',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Folate', 'Antioxidants']
    },
    {
      id: 'kidney-beans',
      name: 'Kidney beans',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Iron', 'Potassium']
    },
    {
      id: 'pinto-beans',
      name: 'Pinto beans',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Folate']
    },
    {
      id: 'navy-beans',
      name: 'Navy beans',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Manganese']
    },
    {
      id: 'chickpeas',
      name: 'Chickpeas (garbanzo beans)',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Folate', 'Manganese']
    },
    {
      id: 'lentils-red',
      name: 'Lentils - red',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fast-cooking', 'Protein', 'Iron', 'Folate']
    },
    {
      id: 'lentils-green',
      name: 'Lentils - green/brown',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Iron', 'Holds shape well']
    },
    {
      id: 'split-peas',
      name: 'Split peas',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Potassium']
    },
    {
      id: 'black-eyed-peas',
      name: 'Black-eyed peas',
      categoryId: 'legumes',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Folate', 'Potassium']
    },
    {
      id: 'edamame',
      name: 'Edamame',
      categoryId: 'legumes',
      servingSize: '1/2 cup shelled',
      nutritionalHighlights: ['Complete protein', 'Fiber', 'Folate', 'Vitamin K']
    },
    {
      id: 'tofu',
      name: 'Tofu',
      categoryId: 'legumes',
      servingSize: '3-4 oz',
      nutritionalHighlights: ['Complete protein', 'Calcium', 'Iron', 'Isoflavones']
    },
    {
      id: 'tempeh',
      name: 'Tempeh',
      categoryId: 'legumes',
      servingSize: '3 oz',
      nutritionalHighlights: ['Fermented', 'Probiotics', 'Complete protein', 'B vitamins']
    }
  ]
};

/**
 * Grains Category - Step 5 of food database creation
 */
export const GRAINS_CATEGORY: FoodCategory = {
  id: 'grains',
  name: 'Grains',
  order: 5,
  description: 'whole grains preferred, gluten-free options marked',
  foods: [
    {
      id: 'quinoa',
      name: 'Quinoa',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Complete protein', 'Fiber', 'Iron', 'Gluten-free'],
      notes: 'Technically a seed, nutritionally similar to grains'
    },
    {
      id: 'brown-rice',
      name: 'Brown rice',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Manganese', 'Selenium', 'Gluten-free']
    },
    {
      id: 'wild-rice',
      name: 'Wild rice',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Antioxidants', 'Gluten-free']
    },
    {
      id: 'oats',
      name: 'Oats (steel-cut or rolled)',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Beta-glucan fiber', 'Protein', 'Heart-healthy'],
      warnings: ['May contain gluten from processing - choose certified GF if needed']
    },
    {
      id: 'barley',
      name: 'Barley',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Beta-glucan fiber', 'Selenium', 'Manganese'],
      warnings: ['Contains gluten']
    },
    {
      id: 'bulgur',
      name: 'Bulgur wheat',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Iron'],
      warnings: ['Contains gluten']
    },
    {
      id: 'farro',
      name: 'Farro',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'Iron'],
      warnings: ['Contains gluten']
    },
    {
      id: 'millet',
      name: 'Millet',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Magnesium', 'Phosphorus', 'Gluten-free']
    },
    {
      id: 'buckwheat',
      name: 'Buckwheat',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Complete protein', 'Rutin', 'Gluten-free'],
      notes: 'Despite the name, not related to wheat'
    },
    {
      id: 'amaranth',
      name: 'Amaranth',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Complete protein', 'Calcium', 'Iron', 'Gluten-free']
    },
    {
      id: 'whole-wheat-bread',
      name: 'Whole wheat bread',
      categoryId: 'grains',
      servingSize: '1 slice',
      nutritionalHighlights: ['Fiber', 'B vitamins', 'Iron'],
      warnings: ['Contains gluten', 'Check for added sugars']
    },
    {
      id: 'whole-wheat-pasta',
      name: 'Whole wheat pasta',
      categoryId: 'grains',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Fiber', 'Protein', 'B vitamins'],
      warnings: ['Contains gluten']
    }
  ]
};

/**
 * Nuts & Seeds Category - Step 6 of food database creation
 */
export const NUTS_SEEDS_CATEGORY: FoodCategory = {
  id: 'nuts-seeds',
  name: 'Nuts & Seeds',
  order: 6,
  description: 'raw or dry roasted preferred, watch portion sizes',
  foods: [
    {
      id: 'almonds',
      name: 'Almonds',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 23 nuts)',
      nutritionalHighlights: ['Vitamin E', 'Magnesium', 'Fiber', 'Healthy fats']
    },
    {
      id: 'walnuts',
      name: 'Walnuts',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 14 halves)',
      nutritionalHighlights: ['Omega-3 fatty acids', 'Antioxidants', 'Brain health']
    },
    {
      id: 'cashews',
      name: 'Cashews',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 18 nuts)',
      nutritionalHighlights: ['Magnesium', 'Zinc', 'Iron', 'Creamy texture']
    },
    {
      id: 'pistachios',
      name: 'Pistachios',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 49 nuts)',
      nutritionalHighlights: ['Protein', 'Fiber', 'Potassium', 'Antioxidants']
    },
    {
      id: 'brazil-nuts',
      name: 'Brazil nuts',
      categoryId: 'nuts-seeds',
      servingSize: '1-2 nuts',
      nutritionalHighlights: ['Selenium', 'Magnesium', 'Healthy fats'],
      warnings: ['Very high in selenium - limit to 1-2 per day']
    },
    {
      id: 'pecans',
      name: 'Pecans',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 19 halves)',
      nutritionalHighlights: ['Antioxidants', 'Healthy fats', 'Manganese']
    },
    {
      id: 'macadamia-nuts',
      name: 'Macadamia nuts',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 10-12 nuts)',
      nutritionalHighlights: ['Monounsaturated fats', 'Manganese'],
      warnings: ['Very high in calories']
    },
    {
      id: 'hazelnuts',
      name: 'Hazelnuts',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 21 nuts)',
      nutritionalHighlights: ['Vitamin E', 'Folate', 'Healthy fats']
    },
    {
      id: 'peanuts',
      name: 'Peanuts',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz (about 28 nuts)',
      nutritionalHighlights: ['Protein', 'Niacin', 'Folate'],
      notes: 'Technically a legume, but nutritionally similar to nuts',
      warnings: ['Common allergen']
    },
    {
      id: 'chia-seeds',
      name: 'Chia seeds',
      categoryId: 'nuts-seeds',
      servingSize: '1 tbsp',
      nutritionalHighlights: ['Omega-3 fatty acids', 'Fiber', 'Calcium', 'Protein']
    },
    {
      id: 'flax-seeds',
      name: 'Flax seeds (ground)',
      categoryId: 'nuts-seeds',
      servingSize: '1 tbsp ground',
      nutritionalHighlights: ['Omega-3 fatty acids', 'Fiber', 'Lignans'],
      notes: 'Grind for better absorption'
    },
    {
      id: 'hemp-seeds',
      name: 'Hemp seeds',
      categoryId: 'nuts-seeds',
      servingSize: '1 tbsp',
      nutritionalHighlights: ['Complete protein', 'Omega fatty acids', 'Magnesium']
    },
    {
      id: 'pumpkin-seeds',
      name: 'Pumpkin seeds (pepitas)',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz',
      nutritionalHighlights: ['Zinc', 'Magnesium', 'Iron', 'Protein']
    },
    {
      id: 'sunflower-seeds',
      name: 'Sunflower seeds',
      categoryId: 'nuts-seeds',
      servingSize: '1 oz',
      nutritionalHighlights: ['Vitamin E', 'Magnesium', 'Selenium']
    },
    {
      id: 'sesame-seeds',
      name: 'Sesame seeds',
      categoryId: 'nuts-seeds',
      servingSize: '1 tbsp',
      nutritionalHighlights: ['Calcium', 'Magnesium', 'Healthy fats']
    },
    {
      id: 'almond-butter',
      name: 'Almond butter',
      categoryId: 'nuts-seeds',
      servingSize: '2 tbsp',
      nutritionalHighlights: ['Vitamin E', 'Magnesium', 'Protein'],
      warnings: ['High calorie density - watch portions']
    },
    {
      id: 'peanut-butter',
      name: 'Peanut butter (natural)',
      categoryId: 'nuts-seeds',
      servingSize: '2 tbsp',
      nutritionalHighlights: ['Protein', 'Niacin', 'Healthy fats'],
      warnings: ['Choose natural versions without added sugar', 'Common allergen']
    },
    {
      id: 'tahini',
      name: 'Tahini (sesame seed butter)',
      categoryId: 'nuts-seeds',
      servingSize: '2 tbsp',
      nutritionalHighlights: ['Calcium', 'Protein', 'Healthy fats']
    }
  ]
};

/**
 * Vegetables Category - Step 7 of food database creation
 */
export const VEGETABLES_CATEGORY: FoodCategory = {
  id: 'vegetables',
  name: 'Vegetables',
  order: 7,
  description: 'fresh, frozen, or canned (no added salt/sugar) - aim for variety',
  foods: [
    {
      id: 'spinach',
      name: 'Spinach',
      categoryId: 'vegetables',
      servingSize: '1 cup raw or 1/2 cup cooked',
      nutritionalHighlights: ['Iron', 'Vitamin K', 'Folate', 'Lutein']
    },
    {
      id: 'kale',
      name: 'Kale',
      categoryId: 'vegetables',
      servingSize: '1 cup chopped',
      nutritionalHighlights: ['Vitamin K', 'Vitamin C', 'Beta-carotene', 'Calcium']
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      categoryId: 'vegetables',
      servingSize: '1 cup chopped',
      nutritionalHighlights: ['Vitamin C', 'Vitamin K', 'Folate', 'Sulforaphane']
    },
    {
      id: 'cauliflower',
      name: 'Cauliflower',
      categoryId: 'vegetables',
      servingSize: '1 cup chopped',
      nutritionalHighlights: ['Vitamin C', 'Fiber', 'Choline', 'Low carb']
    },
    {
      id: 'brussels-sprouts',
      name: 'Brussels sprouts',
      categoryId: 'vegetables',
      servingSize: '1 cup',
      nutritionalHighlights: ['Vitamin K', 'Vitamin C', 'Fiber', 'Antioxidants']
    },
    {
      id: 'cabbage',
      name: 'Cabbage',
      categoryId: 'vegetables',
      servingSize: '1 cup chopped',
      nutritionalHighlights: ['Vitamin C', 'Vitamin K', 'Fiber', 'Sulfur compounds']
    },
    {
      id: 'arugula',
      name: 'Arugula',
      categoryId: 'vegetables',
      servingSize: '2 cups',
      nutritionalHighlights: ['Vitamin K', 'Calcium', 'Nitrates', 'Peppery flavor']
    },
    {
      id: 'romaine-lettuce',
      name: 'Romaine lettuce',
      categoryId: 'vegetables',
      servingSize: '2 cups chopped',
      nutritionalHighlights: ['Vitamin A', 'Vitamin K', 'Folate', 'Hydrating']
    },
    {
      id: 'bell-peppers',
      name: 'Bell peppers (all colors)',
      categoryId: 'vegetables',
      servingSize: '1 medium pepper',
      nutritionalHighlights: ['Vitamin C', 'Vitamin A', 'Antioxidants', 'Low calorie']
    },
    {
      id: 'carrots',
      name: 'Carrots',
      categoryId: 'vegetables',
      servingSize: '1 medium carrot',
      nutritionalHighlights: ['Beta-carotene', 'Fiber', 'Vitamin K', 'Potassium']
    },
    {
      id: 'sweet-potatoes',
      name: 'Sweet potatoes',
      categoryId: 'vegetables',
      servingSize: '1 medium potato',
      nutritionalHighlights: ['Beta-carotene', 'Fiber', 'Potassium', 'Vitamin C']
    },
    {
      id: 'beets',
      name: 'Beets',
      categoryId: 'vegetables',
      servingSize: '1/2 cup cooked',
      nutritionalHighlights: ['Nitrates', 'Folate', 'Fiber', 'Antioxidants']
    },
    {
      id: 'asparagus',
      name: 'Asparagus',
      categoryId: 'vegetables',
      servingSize: '1 cup',
      nutritionalHighlights: ['Folate', 'Vitamin K', 'Vitamin A', 'Fiber']
    },
    {
      id: 'zucchini',
      name: 'Zucchini',
      categoryId: 'vegetables',
      servingSize: '1 medium zucchini',
      nutritionalHighlights: ['Vitamin C', 'Potassium', 'Low calorie', 'Versatile']
    },
    {
      id: 'cucumber',
      name: 'Cucumber',
      categoryId: 'vegetables',
      servingSize: '1 cup sliced',
      nutritionalHighlights: ['Hydrating', 'Vitamin K', 'Low calorie', 'Silica']
    },
    {
      id: 'tomatoes',
      name: 'Tomatoes',
      categoryId: 'vegetables',
      servingSize: '1 medium tomato',
      nutritionalHighlights: ['Lycopene', 'Vitamin C', 'Potassium', 'Folate']
    },
    {
      id: 'mushrooms',
      name: 'Mushrooms (all varieties)',
      categoryId: 'vegetables',
      servingSize: '1 cup sliced',
      nutritionalHighlights: ['B vitamins', 'Selenium', 'Potassium', 'Umami flavor']
    },
    {
      id: 'onions',
      name: 'Onions',
      categoryId: 'vegetables',
      servingSize: '1/2 cup chopped',
      nutritionalHighlights: ['Quercetin', 'Vitamin C', 'Prebiotic fiber', 'Sulfur compounds']
    },
    {
      id: 'garlic',
      name: 'Garlic',
      categoryId: 'vegetables',
      servingSize: '1-2 cloves',
      nutritionalHighlights: ['Allicin', 'Manganese', 'Immune support', 'Anti-inflammatory']
    },
    {
      id: 'green-beans',
      name: 'Green beans',
      categoryId: 'vegetables',
      servingSize: '1 cup',
      nutritionalHighlights: ['Vitamin K', 'Vitamin C', 'Fiber', 'Folate']
    },
    {
      id: 'peas',
      name: 'Green peas',
      categoryId: 'vegetables',
      servingSize: '1/2 cup',
      nutritionalHighlights: ['Protein', 'Fiber', 'Vitamin K', 'Vitamin C']
    },
    {
      id: 'corn',
      name: 'Corn',
      categoryId: 'vegetables',
      servingSize: '1/2 cup kernels',
      nutritionalHighlights: ['Fiber', 'Vitamin C', 'Magnesium', 'Antioxidants']
    },
    {
      id: 'eggplant',
      name: 'Eggplant',
      categoryId: 'vegetables',
      servingSize: '1 cup cubed',
      nutritionalHighlights: ['Fiber', 'Potassium', 'Antioxidants', 'Low calorie']
    },
    {
      id: 'celery',
      name: 'Celery',
      categoryId: 'vegetables',
      servingSize: '2 stalks',
      nutritionalHighlights: ['Vitamin K', 'Potassium', 'Low calorie', 'Hydrating']
    },
    {
      id: 'radishes',
      name: 'Radishes',
      categoryId: 'vegetables',
      servingSize: '1 cup sliced',
      nutritionalHighlights: ['Vitamin C', 'Fiber', 'Low calorie', 'Peppery flavor']
    }
  ]
};

/**
 * Fruits Category - Step 8 of food database creation (FINAL)
 */
export const FRUITS_CATEGORY: FoodCategory = {
  id: 'fruits',
  name: 'Fruits',
  order: 8,
  description: 'fresh or frozen preferred, watch portions for higher sugar fruits',
  foods: [
    {
      id: 'blueberries',
      name: 'Blueberries',
      categoryId: 'fruits',
      servingSize: '1/2 cup',
      nutritionalHighlights: ['Antioxidants', 'Vitamin C', 'Fiber', 'Brain health']
    },
    {
      id: 'strawberries',
      name: 'Strawberries',
      categoryId: 'fruits',
      servingSize: '1 cup',
      nutritionalHighlights: ['Vitamin C', 'Folate', 'Antioxidants', 'Low glycemic']
    },
    {
      id: 'raspberries',
      name: 'Raspberries',
      categoryId: 'fruits',
      servingSize: '1/2 cup',
      nutritionalHighlights: ['Fiber', 'Vitamin C', 'Antioxidants', 'Low sugar']
    },
    {
      id: 'blackberries',
      name: 'Blackberries',
      categoryId: 'fruits',
      servingSize: '1/2 cup',
      nutritionalHighlights: ['Fiber', 'Vitamin C', 'Vitamin K', 'Antioxidants']
    },
    {
      id: 'apples',
      name: 'Apples',
      categoryId: 'fruits',
      servingSize: '1 medium apple',
      nutritionalHighlights: ['Fiber', 'Vitamin C', 'Quercetin', 'Pectin']
    },
    {
      id: 'pears',
      name: 'Pears',
      categoryId: 'fruits',
      servingSize: '1 medium pear',
      nutritionalHighlights: ['Fiber', 'Vitamin C', 'Copper', 'Potassium']
    },
    {
      id: 'oranges',
      name: 'Oranges',
      categoryId: 'fruits',
      servingSize: '1 medium orange',
      nutritionalHighlights: ['Vitamin C', 'Folate', 'Fiber', 'Flavonoids']
    },
    {
      id: 'grapefruits',
      name: 'Grapefruits',
      categoryId: 'fruits',
      servingSize: '1/2 medium grapefruit',
      nutritionalHighlights: ['Vitamin C', 'Lycopene', 'Fiber', 'Low glycemic']
    },
    {
      id: 'lemons',
      name: 'Lemons',
      categoryId: 'fruits',
      servingSize: '1 medium lemon',
      nutritionalHighlights: ['Vitamin C', 'Citrus flavonoids', 'Low sugar', 'Versatile']
    },
    {
      id: 'limes',
      name: 'Limes',
      categoryId: 'fruits',
      servingSize: '1 medium lime',
      nutritionalHighlights: ['Vitamin C', 'Citrus flavonoids', 'Low sugar', 'Flavor enhancer']
    },
    {
      id: 'bananas',
      name: 'Bananas',
      categoryId: 'fruits',
      servingSize: '1 medium banana',
      nutritionalHighlights: ['Potassium', 'Vitamin B6', 'Fiber', 'Natural sugars'],
      warnings: ['Higher in sugar - good for pre/post workout']
    },
    {
      id: 'grapes',
      name: 'Grapes',
      categoryId: 'fruits',
      servingSize: '1 cup',
      nutritionalHighlights: ['Resveratrol', 'Vitamin C', 'Potassium'],
      warnings: ['Higher in sugar - watch portions']
    },
    {
      id: 'kiwi',
      name: 'Kiwi',
      categoryId: 'fruits',
      servingSize: '1 medium kiwi',
      nutritionalHighlights: ['Vitamin C', 'Fiber', 'Vitamin K', 'Potassium']
    },
    {
      id: 'pineapple',
      name: 'Pineapple',
      categoryId: 'fruits',
      servingSize: '1/2 cup chunks',
      nutritionalHighlights: ['Vitamin C', 'Bromelain', 'Manganese'],
      warnings: ['Higher in sugar - watch portions']
    },
    {
      id: 'mango',
      name: 'Mango',
      categoryId: 'fruits',
      servingSize: '1/2 cup sliced',
      nutritionalHighlights: ['Vitamin A', 'Vitamin C', 'Folate'],
      warnings: ['Higher in sugar - watch portions']
    },
    {
      id: 'papaya',
      name: 'Papaya',
      categoryId: 'fruits',
      servingSize: '1 cup cubed',
      nutritionalHighlights: ['Vitamin C', 'Vitamin A', 'Papain enzyme', 'Folate']
    },
    {
      id: 'cantaloupe',
      name: 'Cantaloupe',
      categoryId: 'fruits',
      servingSize: '1 cup cubed',
      nutritionalHighlights: ['Vitamin A', 'Vitamin C', 'Potassium', 'Hydrating']
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      categoryId: 'fruits',
      servingSize: '1 cup cubed',
      nutritionalHighlights: ['Lycopene', 'Vitamin C', 'Hydrating', 'Citrulline']
    },
    {
      id: 'cherries',
      name: 'Cherries',
      categoryId: 'fruits',
      servingSize: '1/2 cup',
      nutritionalHighlights: ['Antioxidants', 'Melatonin', 'Anti-inflammatory', 'Vitamin C']
    },
    {
      id: 'plums',
      name: 'Plums',
      categoryId: 'fruits',
      servingSize: '1 medium plum',
      nutritionalHighlights: ['Vitamin C', 'Fiber', 'Potassium', 'Antioxidants']
    },
    {
      id: 'peaches',
      name: 'Peaches',
      categoryId: 'fruits',
      servingSize: '1 medium peach',
      nutritionalHighlights: ['Vitamin A', 'Vitamin C', 'Fiber', 'Potassium']
    },
    {
      id: 'avocado',
      name: 'Avocado',
      categoryId: 'fruits',
      servingSize: '1/3 medium avocado',
      nutritionalHighlights: ['Healthy fats', 'Fiber', 'Potassium', 'Folate'],
      notes: 'Unique fruit - high in healthy fats rather than sugars'
    }
  ]
};

// COMPLETE FOOD DATABASE - All 8 categories with 180+ total food items
export const FOOD_CATEGORIES: FoodCategory[] = [
  MEAT_POULTRY_CATEGORY, 
  SEAFOOD_CATEGORY, 
  EGGS_DAIRY_CATEGORY,
  LEGUMES_CATEGORY,
  GRAINS_CATEGORY,
  NUTS_SEEDS_CATEGORY,
  VEGETABLES_CATEGORY,
  FRUITS_CATEGORY
];

// Backward compatibility
export const INITIAL_CATEGORIES = FOOD_CATEGORIES;

// Quick stats for validation
export const FOOD_DATABASE_STATS = {
  totalCategories: FOOD_CATEGORIES.length,
  totalFoods: FOOD_CATEGORIES.reduce((total, category) => total + category.foods.length, 0),
  categoriesWithCounts: FOOD_CATEGORIES.map(category => ({
    name: category.name,
    count: category.foods.length
  }))
};
