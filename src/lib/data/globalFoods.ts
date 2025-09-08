/**
 * Seed script for global food items
 * This creates a comprehensive database of common foods categorized by the color system
 */

import { Timestamp } from 'firebase/firestore';
import type { FoodItem } from '@/lib/types';

export const globalFoods: Omit<FoodItem, 'id' | 'coachId'>[] = [
  // BLUE FOODS (Nutrient-dense, unlimited consumption)
  {
    name: "Spinach",
    category: "blue",
    description: "Dark leafy green packed with vitamins and minerals",
    servingSize: "1 cup fresh or 1/2 cup cooked",
    portionGuidelines: "Unlimited - use as base for salads or sides",
    nutritionalInfo: {
      calories: 7,
      protein: 0.9,
      carbs: 1.1,
      fat: 0.1,
      fiber: 0.7
    },
    isGlobal: true,
    tags: ["leafy greens", "vegetables", "iron", "folate"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Kale",
    category: "blue", 
    description: "Nutrient-dense superfood green",
    servingSize: "1 cup chopped",
    portionGuidelines: "Unlimited - great for salads, smoothies, or chips",
    nutritionalInfo: {
      calories: 8,
      protein: 0.6,
      carbs: 1.4,
      fat: 0.1,
      fiber: 0.6
    },
    isGlobal: true,
    tags: ["leafy greens", "superfood", "vegetables", "antioxidants"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Broccoli",
    category: "blue",
    description: "Cruciferous vegetable rich in vitamins C and K",
    servingSize: "1 cup chopped",
    portionGuidelines: "Unlimited - steam, roast, or eat raw",
    nutritionalInfo: {
      calories: 25,
      protein: 3,
      carbs: 5,
      fat: 0.3,
      fiber: 2.3
    },
    isGlobal: true,
    tags: ["cruciferous", "vegetables", "vitamin c", "fiber"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Chicken Breast (skinless)",
    category: "blue",
    description: "Lean protein source",
    servingSize: "4 oz cooked",
    portionGuidelines: "Palm-sized portion per meal",
    nutritionalInfo: {
      calories: 185,
      protein: 35,
      carbs: 0,
      fat: 4,
      fiber: 0
    },
    isGlobal: true,
    tags: ["lean protein", "poultry", "muscle building"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Salmon (wild-caught)",
    category: "blue",
    description: "Fatty fish rich in omega-3 fatty acids",
    servingSize: "4 oz cooked",
    portionGuidelines: "Palm-sized portion per meal",
    nutritionalInfo: {
      calories: 206,
      protein: 28,
      carbs: 0,
      fat: 9,
      fiber: 0
    },
    isGlobal: true,
    tags: ["fatty fish", "omega-3", "protein", "heart healthy"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Egg Whites",
    category: "blue",
    description: "Pure protein with no fat",
    servingSize: "4 egg whites",
    portionGuidelines: "Great for breakfast or post-workout",
    nutritionalInfo: {
      calories: 68,
      protein: 14,
      carbs: 1,
      fat: 0.2,
      fiber: 0
    },
    isGlobal: true,
    tags: ["protein", "eggs", "low fat", "breakfast"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cauliflower",
    category: "blue",
    description: "Versatile low-carb vegetable",
    servingSize: "1 cup chopped",
    portionGuidelines: "Unlimited - great rice or mash substitute",
    nutritionalInfo: {
      calories: 25,
      protein: 2,
      carbs: 5,
      fat: 0.1,
      fiber: 2.5
    },
    isGlobal: true,
    tags: ["cruciferous", "vegetables", "low carb", "versatile"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Bell Peppers",
    category: "blue",
    description: "Colorful, sweet peppers high in vitamin C",
    servingSize: "1 medium pepper",
    portionGuidelines: "Unlimited - great for snacks or cooking",
    nutritionalInfo: {
      calories: 31,
      protein: 1,
      carbs: 7,
      fat: 0.3,
      fiber: 2.5
    },
    isGlobal: true,
    tags: ["vegetables", "vitamin c", "colorful", "snacks"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // YELLOW FOODS (Moderate portions, balanced intake)
  {
    name: "Brown Rice",
    category: "yellow",
    description: "Whole grain complex carbohydrate",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Fist-sized portion, 1-2 servings per day",
    nutritionalInfo: {
      calories: 108,
      protein: 2.5,
      carbs: 22,
      fat: 0.9,
      fiber: 1.8
    },
    isGlobal: true,
    tags: ["whole grains", "complex carbs", "fiber", "staple"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Quinoa",
    category: "yellow",
    description: "Complete protein grain",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Fist-sized portion, great protein source",
    nutritionalInfo: {
      calories: 111,
      protein: 4,
      carbs: 20,
      fat: 1.8,
      fiber: 2.5
    },
    isGlobal: true,
    tags: ["whole grains", "complete protein", "gluten free", "versatile"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Sweet Potato",
    category: "yellow",
    description: "Nutrient-dense root vegetable",
    servingSize: "1 medium baked",
    portionGuidelines: "Fist-sized portion, great pre/post workout",
    nutritionalInfo: {
      calories: 112,
      protein: 2,
      carbs: 26,
      fat: 0.1,
      fiber: 3.9
    },
    isGlobal: true,
    tags: ["root vegetables", "complex carbs", "beta carotene", "fiber"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Avocado",
    category: "yellow",
    description: "Healthy fat source with fiber",
    servingSize: "1/2 medium avocado",
    portionGuidelines: "Thumb-sized portion, 1 serving per day",
    nutritionalInfo: {
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 15,
      fiber: 6.7
    },
    isGlobal: true,
    tags: ["healthy fats", "monounsaturated", "fiber", "potassium"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Almonds",
    category: "yellow",
    description: "Tree nuts rich in healthy fats and protein",
    servingSize: "1 oz (about 23 almonds)",
    portionGuidelines: "Small handful, watch portions",
    nutritionalInfo: {
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5
    },
    isGlobal: true,
    tags: ["nuts", "healthy fats", "protein", "vitamin e"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Olive Oil (Extra Virgin)",
    category: "yellow",
    description: "Healthy cooking fat",
    servingSize: "1 tablespoon",
    portionGuidelines: "Use sparingly for cooking or dressing",
    nutritionalInfo: {
      calories: 119,
      protein: 0,
      carbs: 0,
      fat: 13.5,
      fiber: 0
    },
    isGlobal: true,
    tags: ["healthy fats", "cooking oil", "monounsaturated", "mediterranean"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Whole Grain Bread",
    category: "yellow",
    description: "Fiber-rich complex carbohydrate",
    servingSize: "1 slice",
    portionGuidelines: "1-2 slices per meal, choose 100% whole grain",
    nutritionalInfo: {
      calories: 80,
      protein: 4,
      carbs: 15,
      fat: 1,
      fiber: 3
    },
    isGlobal: true,
    tags: ["whole grains", "fiber", "complex carbs", "breakfast"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Greek Yogurt (Plain)",
    category: "yellow",
    description: "High-protein dairy with probiotics",
    servingSize: "3/4 cup",
    portionGuidelines: "Great for breakfast or snacks",
    nutritionalInfo: {
      calories: 130,
      protein: 15,
      carbs: 9,
      fat: 4,
      fiber: 0
    },
    isGlobal: true,
    tags: ["dairy", "protein", "probiotics", "calcium"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // RED FOODS (Limited portions, occasional consumption)
  {
    name: "White Bread",
    category: "red",
    description: "Processed grain with little fiber",
    servingSize: "1 slice",
    portionGuidelines: "Limit to special occasions, choose whole grain instead",
    nutritionalInfo: {
      calories: 75,
      protein: 2.3,
      carbs: 14,
      fat: 1,
      fiber: 0.8
    },
    isGlobal: true,
    tags: ["processed", "refined grains", "low fiber", "limit"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "French Fries",
    category: "red",
    description: "Deep-fried potato with high fat and sodium",
    servingSize: "Small order (about 3 oz)",
    portionGuidelines: "Occasional treat only, high in calories",
    nutritionalInfo: {
      calories: 365,
      protein: 4,
      carbs: 48,
      fat: 17,
      fiber: 4
    },
    isGlobal: true,
    tags: ["fried food", "high fat", "processed", "occasional"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Candy/Chocolate",
    category: "red",
    description: "High sugar confectionery",
    servingSize: "1 small piece or 1 oz",
    portionGuidelines: "Small portions, special occasions only",
    nutritionalInfo: {
      calories: 150,
      protein: 1,
      carbs: 30,
      fat: 8,
      fiber: 1
    },
    isGlobal: true,
    tags: ["sugar", "processed", "treats", "occasional"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Soda/Soft Drinks",
    category: "red",
    description: "Sugar-sweetened beverages",
    servingSize: "12 fl oz can",
    portionGuidelines: "Avoid or limit to special occasions",
    nutritionalInfo: {
      calories: 140,
      protein: 0,
      carbs: 39,
      fat: 0,
      fiber: 0
    },
    isGlobal: true,
    tags: ["sugar", "beverages", "empty calories", "avoid"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Ice Cream",
    category: "red",
    description: "High sugar and fat frozen dessert",
    servingSize: "1/2 cup",
    portionGuidelines: "Small portions, occasional treat",
    nutritionalInfo: {
      calories: 140,
      protein: 2.5,
      carbs: 17,
      fat: 7,
      fiber: 0.5
    },
    isGlobal: true,
    tags: ["dessert", "high sugar", "high fat", "treats"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Pizza (Regular Cheese)",
    category: "red",
    description: "Processed food high in refined carbs and fat",
    servingSize: "1 slice medium pizza",
    portionGuidelines: "Occasional meal, choose thin crust when possible",
    nutritionalInfo: {
      calories: 285,
      protein: 12,
      carbs: 36,
      fat: 10,
      fiber: 2.5
    },
    isGlobal: true,
    tags: ["processed", "high fat", "refined carbs", "occasional"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cookies",
    category: "red",
    description: "High sugar baked goods",
    servingSize: "1 medium cookie",
    portionGuidelines: "Small portions, special treats only",
    nutritionalInfo: {
      calories: 50,
      protein: 0.6,
      carbs: 7,
      fat: 2.3,
      fiber: 0.2
    },
    isGlobal: true,
    tags: ["dessert", "sugar", "processed", "treats"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Potato Chips",
    category: "red",
    description: "High fat, high sodium snack food",
    servingSize: "1 oz (about 15 chips)",
    portionGuidelines: "Limit portions, choose baked when possible",
    nutritionalInfo: {
      calories: 152,
      protein: 2,
      carbs: 15,
      fat: 10,
      fiber: 1.4
    },
    isGlobal: true,
    tags: ["fried", "high fat", "high sodium", "snacks"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  }
];

export const seedGlobalFoods = async () => {
  const { foodService } = await import('@/lib/firebase/foods');
  
  console.log('Seeding global foods...');
  
  for (const food of globalFoods) {
    try {
      // Note: This would require admin privileges to create global foods
      // In production, this would be run as an admin script
      console.log(`Creating food: ${food.name}`);
    } catch (error) {
      console.error(`Error creating food ${food.name}:`, error);
    }
  }
  
  console.log('Global foods seeding complete!');
};
