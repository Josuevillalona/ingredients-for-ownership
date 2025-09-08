/**
 * Simplified food categories data for seeding script
 * This is a JavaScript version of the TypeScript food categories
 */

const sampleFoodCategories = [
  {
    id: 'lean-proteins',
    name: 'Lean Proteins',
    order: 1,
    description: 'High-quality protein sources',
    foods: [
      {
        id: 'chicken-breast',
        name: 'Chicken Breast (skinless)',
        categoryId: 'lean-proteins',
        servingSize: '4 oz',
        nutritionalHighlights: ['High protein', 'Low fat'],
        fdcId: 171477
      },
      {
        id: 'lean-ground-turkey',
        name: 'Lean Ground Turkey',
        categoryId: 'lean-proteins',
        servingSize: '4 oz',
        nutritionalHighlights: ['High protein', 'Lower fat than beef'],
        fdcId: 171080
      },
      {
        id: 'salmon',
        name: 'Salmon',
        categoryId: 'lean-proteins',
        servingSize: '4 oz',
        nutritionalHighlights: ['Omega-3 fatty acids', 'High protein'],
        fdcId: 175167
      },
      {
        id: 'eggs',
        name: 'Eggs',
        categoryId: 'lean-proteins',
        servingSize: '2 large eggs',
        nutritionalHighlights: ['Complete protein', 'Choline'],
        fdcId: 748967
      }
    ]
  },
  {
    id: 'non-starchy-vegetables',
    name: 'Non-Starchy Vegetables',
    order: 2,
    description: 'Low-calorie, nutrient-dense vegetables',
    foods: [
      {
        id: 'spinach',
        name: 'Spinach',
        categoryId: 'non-starchy-vegetables',
        servingSize: '1 cup raw',
        nutritionalHighlights: ['Iron', 'Folate', 'Vitamin K'],
        fdcId: 168462
      },
      {
        id: 'broccoli',
        name: 'Broccoli',
        categoryId: 'non-starchy-vegetables',
        servingSize: '1 cup chopped',
        nutritionalHighlights: ['Vitamin C', 'Fiber', 'Folate'],
        fdcId: 170379
      },
      {
        id: 'bell-peppers',
        name: 'Bell Peppers',
        categoryId: 'non-starchy-vegetables',
        servingSize: '1 cup chopped',
        nutritionalHighlights: ['Vitamin C', 'Antioxidants'],
        fdcId: 170427
      },
      {
        id: 'zucchini',
        name: 'Zucchini',
        categoryId: 'non-starchy-vegetables',
        servingSize: '1 cup sliced',
        nutritionalHighlights: ['Low calorie', 'Vitamin C'],
        fdcId: 169291
      }
    ]
  },
  {
    id: 'smart-carbs',
    name: 'Smart Carbs',
    order: 3,
    description: 'Complex carbohydrates and whole grains',
    foods: [
      {
        id: 'quinoa',
        name: 'Quinoa',
        categoryId: 'smart-carbs',
        servingSize: '1/2 cup cooked',
        nutritionalHighlights: ['Complete protein', 'Fiber'],
        fdcId: 168917
      },
      {
        id: 'sweet-potato',
        name: 'Sweet Potato',
        categoryId: 'smart-carbs',
        servingSize: '1 medium',
        nutritionalHighlights: ['Beta-carotene', 'Fiber'],
        fdcId: 168482
      },
      {
        id: 'brown-rice',
        name: 'Brown Rice',
        categoryId: 'smart-carbs',
        servingSize: '1/2 cup cooked',
        nutritionalHighlights: ['Fiber', 'Magnesium'],
        fdcId: 168880
      },
      {
        id: 'oats',
        name: 'Steel Cut Oats',
        categoryId: 'smart-carbs',
        servingSize: '1/2 cup dry',
        nutritionalHighlights: ['Beta-glucan fiber', 'Protein'],
        fdcId: 173904
      }
    ]
  },
  {
    id: 'healthy-fats',
    name: 'Healthy Fats',
    order: 4,
    description: 'Essential fatty acids and healthy fat sources',
    foods: [
      {
        id: 'avocado',
        name: 'Avocado',
        categoryId: 'healthy-fats',
        servingSize: '1/4 medium',
        nutritionalHighlights: ['Monounsaturated fats', 'Fiber'],
        fdcId: 171706
      },
      {
        id: 'olive-oil',
        name: 'Extra Virgin Olive Oil',
        categoryId: 'healthy-fats',
        servingSize: '1 tablespoon',
        nutritionalHighlights: ['Monounsaturated fats', 'Antioxidants'],
        fdcId: 171413
      },
      {
        id: 'almonds',
        name: 'Raw Almonds',
        categoryId: 'healthy-fats',
        servingSize: '1 oz (23 nuts)',
        nutritionalHighlights: ['Healthy fats', 'Vitamin E', 'Protein'],
        fdcId: 170567
      },
      {
        id: 'walnuts',
        name: 'Walnuts',
        categoryId: 'healthy-fats',
        servingSize: '1 oz (14 halves)',
        nutritionalHighlights: ['Omega-3 fatty acids', 'Protein'],
        fdcId: 170187
      }
    ]
  },
  {
    id: 'fruits',
    name: 'Fruits',
    order: 5,
    description: 'Fresh, whole fruits rich in vitamins and fiber',
    foods: [
      {
        id: 'blueberries',
        name: 'Blueberries',
        categoryId: 'fruits',
        servingSize: '1 cup',
        nutritionalHighlights: ['Antioxidants', 'Vitamin C', 'Fiber'],
        fdcId: 171711
      },
      {
        id: 'apple',
        name: 'Apple',
        categoryId: 'fruits',
        servingSize: '1 medium',
        nutritionalHighlights: ['Fiber', 'Vitamin C'],
        fdcId: 171688
      },
      {
        id: 'banana',
        name: 'Banana',
        categoryId: 'fruits',
        servingSize: '1 medium',
        nutritionalHighlights: ['Potassium', 'Vitamin B6'],
        fdcId: 173944
      },
      {
        id: 'strawberries',
        name: 'Strawberries',
        categoryId: 'fruits',
        servingSize: '1 cup',
        nutritionalHighlights: ['Vitamin C', 'Antioxidants'],
        fdcId: 167762
      }
    ]
  }
];

module.exports = { foodCategories: sampleFoodCategories };
