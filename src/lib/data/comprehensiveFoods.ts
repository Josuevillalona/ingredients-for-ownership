/**
 * Comprehensive food database based on "Ingredients for Ownership" methodology
 * Pre-populated with all foods organized by categories for quick plan creation
 */

import { Timestamp } from 'firebase/firestore';
import type { FoodItem } from '@/lib/types';

export const comprehensiveFoodDatabase: Omit<FoodItem, 'id' | 'coachId'>[] = [
  // PROTEINS - MEAT & POULTRY
  {
    name: "Chicken (skinless)",
    category: "blue",
    description: "Lean protein source, hormone & antibiotic-free preferred",
    servingSize: "Palm-sized portion (4-6 oz)",
    portionGuidelines: "Organic, pasture-raised when possible",
    nutritionalInfo: { calories: 185, protein: 35, carbs: 0, fat: 4, fiber: 0 },
    isGlobal: true,
    tags: ["protein", "poultry", "lean", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Turkey (skinless)",
    category: "blue",
    description: "Lean protein source",
    servingSize: "Palm-sized portion (4-6 oz)",
    portionGuidelines: "Remove skin, organic preferred",
    nutritionalInfo: { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0 },
    isGlobal: true,
    tags: ["protein", "poultry", "lean", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Beef, Lamb, Pork (grass-fed)",
    category: "yellow",
    description: "ONLY grass-fed, lean, pasture-raised - consume sparingly",
    servingSize: "4-6 ounces max",
    portionGuidelines: "Limit portions, choose grass-fed only",
    nutritionalInfo: { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
    isGlobal: true,
    tags: ["protein", "red meat", "grass-fed", "yellow", "sparingly"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Duck (skinless)",
    category: "yellow",
    description: "Higher fat poultry, remove skin",
    servingSize: "4 oz",
    portionGuidelines: "Moderate portions due to higher fat content",
    nutritionalInfo: { calories: 201, protein: 23, carbs: 0, fat: 11, fiber: 0 },
    isGlobal: true,
    tags: ["protein", "poultry", "higher fat", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Liver",
    category: "blue",
    description: "Organ meat, highly nutritious",
    servingSize: "3-4 oz",
    portionGuidelines: "Excellent source of vitamins and minerals",
    nutritionalInfo: { calories: 175, protein: 27, carbs: 5, fat: 5, fiber: 0 },
    isGlobal: true,
    tags: ["protein", "organ meat", "nutrient dense", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // SEAFOOD - HIGH OMEGA-3
  {
    name: "Salmon (wild-caught)",
    category: "blue",
    description: "High omega-3, sustainable/wild-caught preferred",
    servingSize: "4-6 oz",
    portionGuidelines: "Excellent source of omega-3 fatty acids",
    nutritionalInfo: { calories: 206, protein: 28, carbs: 0, fat: 9, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "omega-3", "wild-caught", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Sardines",
    category: "blue",
    description: "High omega-3, small fish",
    servingSize: "3-4 oz",
    portionGuidelines: "Excellent omega-3 source, low mercury",
    nutritionalInfo: { calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "omega-3", "low mercury", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Mackerel",
    category: "yellow",
    description: "High omega-3 but higher mercury - moderate consumption",
    servingSize: "3-4 oz",
    portionGuidelines: "Good omega-3 but higher mercury, limit frequency",
    nutritionalInfo: { calories: 262, protein: 24, carbs: 0, fat: 18, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "omega-3", "higher mercury", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Arctic Char",
    category: "blue",
    description: "High omega-3, low mercury",
    servingSize: "4-6 oz",
    portionGuidelines: "Excellent choice - high omega-3, low mercury",
    nutritionalInfo: { calories: 208, protein: 29, carbs: 0, fat: 9, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "omega-3", "low mercury", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // VEGETABLES - HIGHER STARCH
  {
    name: "Sweet Potato",
    category: "yellow",
    description: "Higher-starch vegetable, nutrient-dense",
    servingSize: "1 cup",
    portionGuidelines: "Great pre/post workout, moderate portions",
    nutritionalInfo: { calories: 112, protein: 2, carbs: 26, fat: 0, fiber: 4 },
    isGlobal: true,
    tags: ["vegetables", "starch", "complex carbs", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Beets",
    category: "yellow",
    description: "Higher-starch root vegetable",
    servingSize: "1 cup",
    portionGuidelines: "Natural nitrates, good for circulation",
    nutritionalInfo: { calories: 58, protein: 2, carbs: 13, fat: 0, fiber: 4 },
    isGlobal: true,
    tags: ["vegetables", "starch", "nitrates", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cassava",
    category: "yellow",
    description: "Starchy root vegetable",
    servingSize: "1/2 cup",
    portionGuidelines: "Higher carbohydrate content, moderate portions",
    nutritionalInfo: { calories: 165, protein: 1, carbs: 39, fat: 0, fiber: 2 },
    isGlobal: true,
    tags: ["vegetables", "starch", "root vegetable", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // VEGETABLES - LOWER STARCH (BLUE FOODS)
  {
    name: "Spinach",
    category: "blue",
    description: "Dark leafy green, unlimited consumption",
    servingSize: "Unlimited",
    portionGuidelines: "Nutrient-dense, use freely",
    nutritionalInfo: { calories: 7, protein: 1, carbs: 1, fat: 0, fiber: 1 },
    isGlobal: true,
    tags: ["vegetables", "leafy greens", "unlimited", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Kale",
    category: "blue",
    description: "Superfood green, unlimited consumption",
    servingSize: "Unlimited",
    portionGuidelines: "Excellent for salads, smoothies, chips",
    nutritionalInfo: { calories: 8, protein: 1, carbs: 1, fat: 0, fiber: 1 },
    isGlobal: true,
    tags: ["vegetables", "leafy greens", "superfood", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Broccoli",
    category: "blue",
    description: "Cruciferous vegetable, unlimited",
    servingSize: "Unlimited",
    portionGuidelines: "Steam, roast, or eat raw",
    nutritionalInfo: { calories: 25, protein: 3, carbs: 5, fat: 0, fiber: 2 },
    isGlobal: true,
    tags: ["vegetables", "cruciferous", "unlimited", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cauliflower",
    category: "blue",
    description: "Versatile low-carb vegetable",
    servingSize: "Unlimited",
    portionGuidelines: "Great rice or mash substitute",
    nutritionalInfo: { calories: 25, protein: 2, carbs: 5, fat: 0, fiber: 3 },
    isGlobal: true,
    tags: ["vegetables", "cruciferous", "low carb", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Bell Peppers",
    category: "blue",
    description: "Colorful peppers, high vitamin C",
    servingSize: "Unlimited",
    portionGuidelines: "Great for snacks or cooking",
    nutritionalInfo: { calories: 31, protein: 1, carbs: 7, fat: 0, fiber: 3 },
    isGlobal: true,
    tags: ["vegetables", "vitamin c", "unlimited", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // FRUITS - LOWER SUGAR
  {
    name: "Berries (mixed)",
    category: "blue",
    description: "Raspberries, strawberries, blackberries, blueberries",
    servingSize: "1 cup",
    portionGuidelines: "Emphasize WHOLE & lower-sugar fruits",
    nutritionalInfo: { calories: 84, protein: 1, carbs: 21, fat: 0, fiber: 8 },
    isGlobal: true,
    tags: ["fruit", "berries", "low sugar", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Lemon",
    category: "blue",
    description: "Citrus fruit, very low sugar",
    servingSize: "Unlimited",
    portionGuidelines: "Great for flavoring and vitamin C",
    nutritionalInfo: { calories: 17, protein: 1, carbs: 5, fat: 0, fiber: 5 },
    isGlobal: true,
    tags: ["fruit", "citrus", "low sugar", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Lime",
    category: "blue",
    description: "Citrus fruit, very low sugar",
    servingSize: "Unlimited",
    portionGuidelines: "Great for flavoring",
    nutritionalInfo: { calories: 20, protein: 0, carbs: 7, fat: 0, fiber: 2 },
    isGlobal: true,
    tags: ["fruit", "citrus", "low sugar", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // FRUITS - HIGHER SUGAR (YELLOW)
  {
    name: "Grapes",
    category: "yellow",
    description: "Higher sugar fruit - consume sparingly",
    servingSize: "1 cup",
    portionGuidelines: "Higher sugar content, moderate portions",
    nutritionalInfo: { calories: 104, protein: 1, carbs: 27, fat: 0, fiber: 1 },
    isGlobal: true,
    tags: ["fruit", "higher sugar", "moderate", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Apples",
    category: "yellow",
    description: "Higher sugar fruit",
    servingSize: "1 medium",
    portionGuidelines: "Good fiber content, moderate portions",
    nutritionalInfo: { calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4 },
    isGlobal: true,
    tags: ["fruit", "higher sugar", "fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Banana",
    category: "yellow",
    description: "Higher sugar fruit, good for post-workout",
    servingSize: "1 medium",
    portionGuidelines: "Higher sugar, good post-workout carbs",
    nutritionalInfo: { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3 },
    isGlobal: true,
    tags: ["fruit", "higher sugar", "post-workout", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // NUTS & SEEDS (YELLOW - MODERATE PORTIONS)
  {
    name: "Almonds",
    category: "yellow",
    description: "Tree nuts rich in healthy fats",
    servingSize: "1 oz (23 almonds)",
    portionGuidelines: "Small handful, watch portions",
    nutritionalInfo: { calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4 },
    isGlobal: true,
    tags: ["nuts", "healthy fats", "protein", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Walnut",
    category: "yellow",
    description: "Tree nuts with omega-3",
    servingSize: "1 oz (14 halves)",
    portionGuidelines: "Good omega-3 source, moderate portions",
    nutritionalInfo: { calories: 185, protein: 4, carbs: 4, fat: 18, fiber: 2 },
    isGlobal: true,
    tags: ["nuts", "omega-3", "healthy fats", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Chia Seeds",
    category: "yellow",
    description: "High omega-3 seeds",
    servingSize: "1 tablespoon",
    portionGuidelines: "Excellent omega-3 and fiber source",
    nutritionalInfo: { calories: 69, protein: 2, carbs: 6, fat: 4, fiber: 5 },
    isGlobal: true,
    tags: ["seeds", "omega-3", "fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // GRAINS (YELLOW - MODERATE PORTIONS)
  {
    name: "Quinoa",
    category: "yellow",
    description: "Complete protein grain, gluten-free",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "100% whole, unrefined, sprouted when possible",
    nutritionalInfo: { calories: 111, protein: 4, carbs: 20, fat: 2, fiber: 3 },
    isGlobal: true,
    tags: ["grains", "complete protein", "gluten free", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Brown Rice",
    category: "yellow",
    description: "Whole grain complex carbohydrate",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Moderate portions, 1/2-1 cup cooked",
    nutritionalInfo: { calories: 108, protein: 3, carbs: 22, fat: 1, fiber: 2 },
    isGlobal: true,
    tags: ["grains", "whole grain", "complex carbs", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Oats (steel cut)",
    category: "yellow",
    description: "Whole grain oats",
    servingSize: "1/2 cup dry",
    portionGuidelines: "Steel cut preferred over instant",
    nutritionalInfo: { calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4 },
    isGlobal: true,
    tags: ["grains", "whole grain", "fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Buckwheat",
    category: "yellow",
    description: "Gluten-free whole grain",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Good source of complete protein",
    nutritionalInfo: { calories: 77, protein: 3, carbs: 17, fat: 1, fiber: 2 },
    isGlobal: true,
    tags: ["grains", "gluten free", "complete protein", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Millet",
    category: "yellow",
    description: "Ancient gluten-free grain",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Moderate portions, good for variety",
    nutritionalInfo: { calories: 104, protein: 3, carbs: 21, fat: 1, fiber: 1 },
    isGlobal: true,
    tags: ["grains", "ancient grain", "gluten free", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // LEGUMES & BEANS (YELLOW - MODERATE PORTIONS)
  {
    name: "Black Beans",
    category: "yellow",
    description: "High fiber legume",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Good protein and fiber source",
    nutritionalInfo: { calories: 114, protein: 8, carbs: 20, fat: 0, fiber: 7 },
    isGlobal: true,
    tags: ["legumes", "protein", "fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Chickpeas/Garbanzo Beans",
    category: "yellow",
    description: "Versatile legume",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Great for hummus, salads, roasting",
    nutritionalInfo: { calories: 134, protein: 7, carbs: 22, fat: 2, fiber: 6 },
    isGlobal: true,
    tags: ["legumes", "protein", "versatile", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Lentils",
    category: "yellow",
    description: "High protein legume",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Excellent plant protein source",
    nutritionalInfo: { calories: 115, protein: 9, carbs: 20, fat: 0, fiber: 8 },
    isGlobal: true,
    tags: ["legumes", "plant protein", "high fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Kidney Beans",
    category: "yellow",
    description: "High fiber red beans",
    servingSize: "1/2 cup cooked",
    portionGuidelines: "Good for chili, salads",
    nutritionalInfo: { calories: 112, protein: 8, carbs: 20, fat: 0, fiber: 6 },
    isGlobal: true,
    tags: ["legumes", "protein", "fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // EGGS & DAIRY (BLUE TO YELLOW)
  {
    name: "Whole Eggs",
    category: "blue",
    description: "Complete protein source",
    servingSize: "1-2 eggs",
    portionGuidelines: "Pasture-raised preferred",
    nutritionalInfo: { calories: 70, protein: 6, carbs: 1, fat: 5, fiber: 0 },
    isGlobal: true,
    tags: ["protein", "complete protein", "eggs", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Egg Whites",
    category: "blue",
    description: "Pure protein, no fat",
    servingSize: "3-4 egg whites",
    portionGuidelines: "Great for high protein, low fat needs",
    nutritionalInfo: { calories: 17, protein: 4, carbs: 0, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["protein", "low fat", "eggs", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Greek Yogurt (plain)",
    category: "blue",
    description: "High protein dairy",
    servingSize: "1 cup",
    portionGuidelines: "Choose unsweetened, full-fat varieties",
    nutritionalInfo: { calories: 130, protein: 23, carbs: 9, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["dairy", "protein", "probiotics", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cottage Cheese",
    category: "yellow",
    description: "High protein dairy",
    servingSize: "1/2 cup",
    portionGuidelines: "Choose low-sodium varieties",
    nutritionalInfo: { calories: 110, protein: 14, carbs: 5, fat: 5, fiber: 0 },
    isGlobal: true,
    tags: ["dairy", "protein", "moderate", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // MORE SEAFOOD
  {
    name: "Cod",
    category: "blue",
    description: "Lean white fish",
    servingSize: "4-6 oz",
    portionGuidelines: "Very low fat, high protein",
    nutritionalInfo: { calories: 105, protein: 23, carbs: 0, fat: 1, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "lean protein", "low fat", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Halibut",
    category: "blue",
    description: "Lean white fish",
    servingSize: "4-6 oz",
    portionGuidelines: "Excellent lean protein source",
    nutritionalInfo: { calories: 140, protein: 27, carbs: 0, fat: 3, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "lean protein", "low mercury", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Tuna (canned in water)",
    category: "yellow",
    description: "Convenient protein source",
    servingSize: "3 oz",
    portionGuidelines: "Limit due to mercury content",
    nutritionalInfo: { calories: 109, protein: 25, carbs: 0, fat: 1, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "convenient", "mercury concern", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Shrimp",
    category: "blue",
    description: "Low calorie seafood",
    servingSize: "4-6 oz",
    portionGuidelines: "Very low calorie, high protein",
    nutritionalInfo: { calories: 84, protein: 18, carbs: 0, fat: 1, fiber: 0 },
    isGlobal: true,
    tags: ["seafood", "low calorie", "lean protein", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // MORE VEGETABLES
  {
    name: "Asparagus",
    category: "blue",
    description: "Low calorie vegetable",
    servingSize: "Unlimited",
    portionGuidelines: "Great source of folate",
    nutritionalInfo: { calories: 20, protein: 2, carbs: 4, fat: 0, fiber: 2 },
    isGlobal: true,
    tags: ["vegetables", "low calorie", "folate", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Brussels Sprouts",
    category: "blue",
    description: "Cruciferous vegetable",
    servingSize: "Unlimited",
    portionGuidelines: "High in vitamin C and K",
    nutritionalInfo: { calories: 38, protein: 3, carbs: 8, fat: 0, fiber: 3 },
    isGlobal: true,
    tags: ["vegetables", "cruciferous", "vitamin c", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cucumber",
    category: "blue",
    description: "Hydrating vegetable",
    servingSize: "Unlimited",
    portionGuidelines: "Very low calorie, hydrating",
    nutritionalInfo: { calories: 16, protein: 1, carbs: 4, fat: 0, fiber: 1 },
    isGlobal: true,
    tags: ["vegetables", "hydrating", "low calorie", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Zucchini",
    category: "blue",
    description: "Versatile summer squash",
    servingSize: "Unlimited",
    portionGuidelines: "Great pasta substitute when spiralized",
    nutritionalInfo: { calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 1 },
    isGlobal: true,
    tags: ["vegetables", "low carb", "versatile", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cabbage",
    category: "blue",
    description: "Cruciferous vegetable",
    servingSize: "Unlimited",
    portionGuidelines: "Great for slaws and fermentation",
    nutritionalInfo: { calories: 25, protein: 1, carbs: 6, fat: 0, fiber: 2 },
    isGlobal: true,
    tags: ["vegetables", "cruciferous", "fermentation", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Carrots",
    category: "yellow",
    description: "Root vegetable, higher in sugar",
    servingSize: "1 cup",
    portionGuidelines: "Moderate portions due to natural sugars",
    nutritionalInfo: { calories: 52, protein: 1, carbs: 12, fat: 0, fiber: 4 },
    isGlobal: true,
    tags: ["vegetables", "root vegetable", "beta carotene", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Corn",
    category: "yellow",
    description: "Starchy vegetable",
    servingSize: "1/2 cup",
    portionGuidelines: "Higher carbohydrate content",
    nutritionalInfo: { calories: 62, protein: 2, carbs: 14, fat: 1, fiber: 2 },
    isGlobal: true,
    tags: ["vegetables", "starchy", "moderate portions", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Potato",
    category: "yellow",
    description: "Starchy tuber",
    servingSize: "1 medium",
    portionGuidelines: "Choose sweet potatoes when possible",
    nutritionalInfo: { calories: 161, protein: 4, carbs: 37, fat: 0, fiber: 4 },
    isGlobal: true,
    tags: ["vegetables", "starchy", "tuber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // MORE FRUITS
  {
    name: "Grapefruit",
    category: "blue",
    description: "Low sugar citrus fruit",
    servingSize: "1/2 grapefruit",
    portionGuidelines: "Excellent for vitamin C",
    nutritionalInfo: { calories: 52, protein: 1, carbs: 13, fat: 0, fiber: 2 },
    isGlobal: true,
    tags: ["fruit", "citrus", "low sugar", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Avocado",
    category: "yellow",
    description: "Healthy fat fruit",
    servingSize: "1/2 avocado",
    portionGuidelines: "High in healthy monounsaturated fats",
    nutritionalInfo: { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
    isGlobal: true,
    tags: ["fruit", "healthy fats", "fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Orange",
    category: "yellow",
    description: "Citrus fruit with natural sugars",
    servingSize: "1 medium",
    portionGuidelines: "Good vitamin C, moderate portions",
    nutritionalInfo: { calories: 62, protein: 1, carbs: 15, fat: 0, fiber: 3 },
    isGlobal: true,
    tags: ["fruit", "citrus", "vitamin c", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Mango",
    category: "yellow",
    description: "Tropical fruit, higher sugar",
    servingSize: "1/2 cup",
    portionGuidelines: "Higher sugar content, moderate portions",
    nutritionalInfo: { calories: 54, protein: 1, carbs: 14, fat: 0, fiber: 1 },
    isGlobal: true,
    tags: ["fruit", "tropical", "higher sugar", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Pineapple",
    category: "yellow",
    description: "Tropical fruit with enzymes",
    servingSize: "1/2 cup",
    portionGuidelines: "Contains digestive enzymes, moderate portions",
    nutritionalInfo: { calories: 41, protein: 0, carbs: 11, fat: 0, fiber: 1 },
    isGlobal: true,
    tags: ["fruit", "tropical", "digestive enzymes", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // MORE NUTS & SEEDS
  {
    name: "Brazil Nuts",
    category: "yellow",
    description: "High selenium nuts",
    servingSize: "2-3 nuts",
    portionGuidelines: "Very high in selenium, limit portions",
    nutritionalInfo: { calories: 186, protein: 4, carbs: 3, fat: 19, fiber: 2 },
    isGlobal: true,
    tags: ["nuts", "selenium", "high fat", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Cashews",
    category: "yellow",
    description: "Creamy tree nuts",
    servingSize: "1 oz (18 cashews)",
    portionGuidelines: "Higher carb nuts, moderate portions",
    nutritionalInfo: { calories: 157, protein: 5, carbs: 9, fat: 12, fiber: 1 },
    isGlobal: true,
    tags: ["nuts", "higher carb", "creamy", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Flaxseed",
    category: "yellow",
    description: "Omega-3 rich seeds",
    servingSize: "1 tablespoon ground",
    portionGuidelines: "Must be ground for absorption",
    nutritionalInfo: { calories: 37, protein: 1, carbs: 2, fat: 3, fiber: 2 },
    isGlobal: true,
    tags: ["seeds", "omega-3", "fiber", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Hemp Seeds",
    category: "yellow",
    description: "Complete protein seeds",
    servingSize: "1 tablespoon",
    portionGuidelines: "Good omega ratio, complete protein",
    nutritionalInfo: { calories: 51, protein: 3, carbs: 1, fat: 4, fiber: 0 },
    isGlobal: true,
    tags: ["seeds", "complete protein", "omega balance", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Pumpkin Seeds",
    category: "yellow",
    description: "Mineral-rich seeds",
    servingSize: "1 oz",
    portionGuidelines: "High in zinc and magnesium",
    nutritionalInfo: { calories: 151, protein: 7, carbs: 5, fat: 13, fiber: 2 },
    isGlobal: true,
    tags: ["seeds", "minerals", "zinc", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // HEALTHY OILS & FATS (YELLOW)
  {
    name: "Olive Oil (Extra Virgin)",
    category: "yellow",
    description: "Healthy monounsaturated fat",
    servingSize: "1 tablespoon",
    portionGuidelines: "Use for dressings and low-heat cooking",
    nutritionalInfo: { calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0 },
    isGlobal: true,
    tags: ["oils", "monounsaturated", "antioxidants", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Coconut Oil",
    category: "yellow",
    description: "Saturated fat for high-heat cooking",
    servingSize: "1 tablespoon",
    portionGuidelines: "Good for high-heat cooking",
    nutritionalInfo: { calories: 121, protein: 0, carbs: 0, fat: 14, fiber: 0 },
    isGlobal: true,
    tags: ["oils", "saturated fat", "high heat", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Avocado Oil",
    category: "yellow",
    description: "High-heat cooking oil",
    servingSize: "1 tablespoon",
    portionGuidelines: "Excellent for high-temperature cooking",
    nutritionalInfo: { calories: 124, protein: 0, carbs: 0, fat: 14, fiber: 0 },
    isGlobal: true,
    tags: ["oils", "high heat", "neutral flavor", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // CONDIMENTS & SEASONINGS (BLUE)
  {
    name: "Apple Cider Vinegar",
    category: "blue",
    description: "Fermented vinegar with probiotics",
    servingSize: "1-2 tablespoons",
    portionGuidelines: "May help with blood sugar regulation",
    nutritionalInfo: { calories: 3, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["condiments", "fermented", "blood sugar", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Lemon Juice",
    category: "blue",
    description: "Fresh citrus juice",
    servingSize: "Unlimited",
    portionGuidelines: "Great for flavoring and vitamin C",
    nutritionalInfo: { calories: 7, protein: 0, carbs: 2, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["condiments", "citrus", "vitamin c", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Sea Salt/Himalayan Salt",
    category: "blue",
    description: "Natural mineral salt",
    servingSize: "Use sparingly",
    portionGuidelines: "Contains trace minerals",
    nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["seasonings", "minerals", "natural", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // HERBAL TEAS (BLUE)
  {
    name: "Herbal Teas",
    category: "blue",
    description: "Caffeine-free herbal infusions",
    servingSize: "Unlimited",
    portionGuidelines: "Chamomile, peppermint, ginger, etc.",
    nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["beverages", "herbal", "caffeine free", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // PROCESSED FOODS (RED - LIMIT)
  {
    name: "White Bread",
    category: "red",
    description: "Processed grain, limit consumption",
    servingSize: "1 slice",
    portionGuidelines: "Choose whole grain alternatives instead",
    nutritionalInfo: { calories: 75, protein: 2, carbs: 14, fat: 1, fiber: 1 },
    isGlobal: true,
    tags: ["processed", "refined grains", "limit", "red"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Pizza (regular cheese)",
    category: "red",
    description: "Processed food high in refined carbs",
    servingSize: "1 slice",
    portionGuidelines: "Occasional meal, choose thin crust when possible",
    nutritionalInfo: { calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 3 },
    isGlobal: true,
    tags: ["processed", "occasional", "refined carbs", "red"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "French Fries",
    category: "red",
    description: "Deep-fried potato, high fat and sodium",
    servingSize: "Small order",
    portionGuidelines: "Occasional treat only",
    nutritionalInfo: { calories: 365, protein: 4, carbs: 48, fat: 17, fiber: 4 },
    isGlobal: true,
    tags: ["fried", "high fat", "occasional", "red"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // BEVERAGES
  {
    name: "Water (sparkling/still)",
    category: "blue",
    description: "Primary hydration source",
    servingSize: "Unlimited",
    portionGuidelines: "Primary beverage choice",
    isGlobal: true,
    tags: ["beverages", "hydration", "unlimited", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Green Tea/Matcha",
    category: "blue",
    description: "Antioxidant-rich beverage",
    servingSize: "2-3 cups daily",
    portionGuidelines: "Contains caffeine, consume early in day",
    nutritionalInfo: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["beverages", "antioxidants", "caffeine", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Coffee (black)",
    category: "yellow",
    description: "Caffeinated beverage",
    servingSize: "2-3 cups daily",
    portionGuidelines: "Consume early in day, moderate portions",
    nutritionalInfo: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["beverages", "caffeine", "moderate", "yellow"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Soda/Soft Drinks",
    category: "red",
    description: "Sugar-sweetened beverages",
    servingSize: "Avoid",
    portionGuidelines: "Limit to special occasions only",
    nutritionalInfo: { calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0 },
    isGlobal: true,
    tags: ["beverages", "sugar", "avoid", "red"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },

  // HERBS & SPICES (ALL BLUE - UNLIMITED)
  {
    name: "Fresh Herbs",
    category: "blue",
    description: "Rosemary, oregano, parsley, cilantro, basil, mint, thyme, dill, sage",
    servingSize: "Unlimited",
    portionGuidelines: "Use freely for flavor and nutrition",
    isGlobal: true,
    tags: ["herbs", "spices", "unlimited", "flavor", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Garlic",
    category: "blue",
    description: "Aromatic bulb with health benefits",
    servingSize: "Unlimited",
    portionGuidelines: "Excellent for flavor and immune support",
    isGlobal: true,
    tags: ["aromatics", "unlimited", "immune support", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Ginger",
    category: "blue",
    description: "Anti-inflammatory root",
    servingSize: "Unlimited",
    portionGuidelines: "Great for digestion and inflammation",
    isGlobal: true,
    tags: ["spices", "anti-inflammatory", "digestion", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  },
  {
    name: "Turmeric",
    category: "blue",
    description: "Powerful anti-inflammatory spice",
    servingSize: "Unlimited",
    portionGuidelines: "Excellent anti-inflammatory properties",
    isGlobal: true,
    tags: ["spices", "anti-inflammatory", "unlimited", "blue"],
    createdAt: Timestamp.now(),
    lastUpdated: Timestamp.now()
  }
];

// Food categories organized for one-pager display
export const foodCategoriesForDisplay = {
  proteins: {
    title: "PROTEINS",
    subcategories: {
      "MEAT & POULTRY": ["Chicken (skinless)", "Turkey (skinless)", "Beef, Lamb, Pork (grass-fed)", "Duck (skinless)", "Liver"],
      "SEAFOOD": ["Salmon (wild-caught)", "Sardines", "Arctic Char", "Mackerel", "Cod", "Halibut", "Tuna (canned in water)", "Shrimp"],
      "EGGS & DAIRY": ["Whole Eggs", "Egg Whites", "Greek Yogurt (plain)", "Cottage Cheese"]
    }
  },
  vegetables: {
    title: "VEGETABLES", 
    subcategories: {
      "LOWER STARCH (Unlimited)": ["Spinach", "Kale", "Broccoli", "Cauliflower", "Bell Peppers", "Asparagus", "Brussels Sprouts", "Cucumber", "Zucchini", "Cabbage"],
      "HIGHER STARCH (Moderate)": ["Sweet Potato", "Beets", "Cassava", "Carrots", "Corn", "Potato"]
    }
  },
  fruits: {
    title: "FRUITS",
    subcategories: {
      "LOWER SUGAR (Emphasize)": ["Berries (mixed)", "Lemon", "Lime", "Grapefruit"],
      "HIGHER SUGAR (Sparingly)": ["Grapes", "Apples", "Banana", "Mango", "Orange", "Pineapple"],
      "HEALTHY FATS": ["Avocado"]
    }
  },
  legumes: {
    title: "LEGUMES & BEANS",
    subcategories: {
      "PLANT PROTEINS": ["Black Beans", "Chickpeas/Garbanzo Beans", "Lentils", "Kidney Beans"]
    }
  },
  nutsSeeds: {
    title: "NUTS & SEEDS",
    subcategories: {
      "NUTS": ["Almonds", "Walnut", "Brazil Nuts", "Cashews"],
      "SEEDS": ["Chia Seeds", "Hemp Seeds", "Flaxseed", "Pumpkin Seeds"]
    }
  },
  grains: {
    title: "GRAINS",
    subcategories: {
      "WHOLE GRAINS": ["Quinoa", "Brown Rice", "Oats (steel cut)", "Buckwheat", "Millet"]
    }
  },
  fats: {
    title: "HEALTHY FATS & OILS",
    subcategories: {
      "COOKING OILS": ["Olive Oil (Extra Virgin)", "Coconut Oil", "Avocado Oil"]
    }
  },
  beverages: {
    title: "BEVERAGES", 
    subcategories: {
      "UNLIMITED": ["Water (sparkling/still)", "Green Tea/Matcha", "Herbal Teas"],
      "MODERATE": ["Coffee (black)"],
      "LIMIT": ["Soda/Soft Drinks"]
    }
  },
  seasonings: {
    title: "HERBS, SPICES & SEASONINGS",
    subcategories: {
      "HERBS & SPICES": ["Fresh Herbs", "Garlic", "Ginger", "Turmeric"],
      "CONDIMENTS": ["Apple Cider Vinegar", "Lemon Juice", "Sea Salt/Himalayan Salt"]
    }
  }
};
