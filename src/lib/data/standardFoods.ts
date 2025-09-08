/**
 * Standard Foods Database
 * Generated from USDA FoodData Central API
 * Migration Date: 2025-07-27T00:36:00.500Z
 */

import { FoodItem } from '../types';

export const standardFoods: Omit<FoodItem, 'id' | 'coachId' | 'createdAt' | 'lastUpdated'>[] = [
  {
    "name": "chicken, breast, boneless, skinless, raw",
    "category": "blue",
    "description": "Chicken, breast, boneless, skinless, raw - USDA verified nutritional data (replaces: Chicken (skinless))",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 106,
      "protein": 23,
      "carbs": 0,
      "fat": 2,
      "fiber": 0
    },
    "fdcId": 2646170,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Chicken (skinless)",
    "migrationDate": "2025-07-27T00:35:35.042Z"
  },
  {
    "name": "turkey, whole, breast, meat only, raw",
    "category": "blue",
    "description": "Turkey, whole, breast, meat only, raw - USDA verified nutritional data (replaces: Turkey (skinless))",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 114,
      "protein": 24,
      "carbs": 0,
      "fat": 1,
      "fiber": 0
    },
    "fdcId": 171098,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Turkey (skinless)",
    "migrationDate": "2025-07-27T00:35:35.848Z"
  },
  {
    "name": "beef, carcass, separable lean and fat, choice, raw",
    "category": "yellow",
    "description": "Beef, carcass, separable lean and fat, choice, raw - USDA verified nutritional data (replaces: Beef, Lamb, Pork (grass-fed))",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 1220,
      "protein": 17,
      "carbs": 0,
      "fat": 24,
      "fiber": 0
    },
    "fdcId": 169430,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Beef, Lamb, Pork (grass-fed)",
    "migrationDate": "2025-07-27T00:35:36.623Z"
  },
  {
    "name": "duck, wild, breast, meat only, raw",
    "category": "yellow",
    "description": "Duck, wild, breast, meat only, raw - USDA verified nutritional data (replaces: Duck (skinless))",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 515,
      "protein": 20,
      "carbs": 0,
      "fat": 4,
      "fiber": 0
    },
    "fdcId": 174469,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Duck (skinless)",
    "migrationDate": "2025-07-27T00:35:37.334Z"
  },
  {
    "name": "chicken, liver, all classes, raw",
    "category": "yellow",
    "description": "Chicken, liver, all classes, raw - USDA verified nutritional data (replaces: Liver)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 496,
      "protein": 17,
      "carbs": 1,
      "fat": 5,
      "fiber": 0
    },
    "fdcId": 171060,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Liver",
    "migrationDate": "2025-07-27T00:35:38.113Z"
  },
  {
    "name": "fish, salmon, atlantic, farmed, raw",
    "category": "blue",
    "description": "Fish, salmon, Atlantic, farmed, raw - USDA verified nutritional data (replaces: Salmon (wild-caught))",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 208,
      "protein": 20,
      "carbs": 0,
      "fat": 13,
      "fiber": 0
    },
    "fdcId": 175167,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Salmon (wild-caught)",
    "migrationDate": "2025-07-27T00:35:38.946Z"
  },
  {
    "name": "sardine sandwich",
    "category": "blue",
    "description": "Sardine sandwich - USDA verified nutritional data (replaces: Sardines)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 234,
      "protein": 18,
      "carbs": 22,
      "fat": 8,
      "fiber": 1
    },
    "fdcId": 2707033,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Sardines",
    "migrationDate": "2025-07-27T00:35:39.687Z"
  },
  {
    "name": "fish, mackerel, atlantic, raw",
    "category": "blue",
    "description": "Fish, mackerel, Atlantic, raw - USDA verified nutritional data (replaces: Mackerel)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 858,
      "protein": 19,
      "carbs": 0,
      "fat": 14,
      "fiber": 0
    },
    "fdcId": 175119,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Mackerel",
    "migrationDate": "2025-07-27T00:35:40.473Z"
  },
  {
    "name": "clementine, raw",
    "category": "blue",
    "description": "Clementine, raw - USDA verified nutritional data (replaces: Arctic Char)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 53,
      "protein": 1,
      "carbs": 13,
      "fat": 0,
      "fiber": 2
    },
    "fdcId": 2709164,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Arctic Char",
    "migrationDate": "2025-07-27T00:35:41.245Z"
  },
  {
    "name": "sweet potato leaves, raw",
    "category": "yellow",
    "description": "Sweet potato leaves, raw - USDA verified nutritional data (replaces: Sweet Potato)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 175,
      "protein": 2,
      "carbs": 9,
      "fat": 1,
      "fiber": 5
    },
    "fdcId": 169303,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Sweet Potato",
    "migrationDate": "2025-07-27T00:35:42.018Z"
  },
  {
    "name": "beets, raw",
    "category": "blue",
    "description": "Beets, raw - USDA verified nutritional data (replaces: Beets)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 45,
      "protein": 2,
      "carbs": 9,
      "fat": 0,
      "fiber": 3
    },
    "fdcId": 2685576,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Beets",
    "migrationDate": "2025-07-27T00:35:42.807Z"
  },
  {
    "name": "cassava, raw",
    "category": "yellow",
    "description": "Cassava, raw - USDA verified nutritional data (replaces: Cassava)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 667,
      "protein": 1,
      "carbs": 38,
      "fat": 0,
      "fiber": 2
    },
    "fdcId": 169985,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Cassava",
    "migrationDate": "2025-07-27T00:35:43.518Z"
  },
  {
    "name": "spinach, raw",
    "category": "blue",
    "description": "Spinach, raw - USDA verified nutritional data (replaces: Spinach)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 27,
      "protein": 3,
      "carbs": 2,
      "fat": 1,
      "fiber": 2
    },
    "fdcId": 2709614,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Spinach",
    "migrationDate": "2025-07-27T00:35:44.308Z"
  },
  {
    "name": "kale, raw",
    "category": "blue",
    "description": "Kale, raw - USDA verified nutritional data (replaces: Kale)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 148,
      "protein": 3,
      "carbs": 4,
      "fat": 1,
      "fiber": 4
    },
    "fdcId": 168421,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Kale",
    "migrationDate": "2025-07-27T00:35:45.064Z"
  },
  {
    "name": "broccoli, raw",
    "category": "blue",
    "description": "Broccoli, raw - USDA verified nutritional data (replaces: Broccoli)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 39,
      "protein": 3,
      "carbs": 6,
      "fat": 0,
      "fiber": 2
    },
    "fdcId": 2709643,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Broccoli",
    "migrationDate": "2025-07-27T00:35:45.850Z"
  },
  {
    "name": "cauliflower, raw",
    "category": "blue",
    "description": "Cauliflower, raw - USDA verified nutritional data (replaces: Cauliflower)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 28,
      "protein": 2,
      "carbs": 5,
      "fat": 0,
      "fiber": 2
    },
    "fdcId": 2685573,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Cauliflower",
    "migrationDate": "2025-07-27T00:35:46.406Z"
  },
  {
    "name": "peppers, sweet, green, raw",
    "category": "blue",
    "description": "Peppers, sweet, green, raw - USDA verified nutritional data (replaces: Bell Peppers)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 23,
      "protein": 1,
      "carbs": 5,
      "fat": 0,
      "fiber": 1
    },
    "fdcId": 2709800,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Bell Peppers",
    "migrationDate": "2025-07-27T00:35:47.212Z"
  },
  {
    "name": "blueberries, raw",
    "category": "blue",
    "description": "Blueberries, raw - USDA verified nutritional data (replaces: Berries (mixed))",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 64,
      "protein": 1,
      "carbs": 15,
      "fat": 0,
      "fiber": 2
    },
    "fdcId": 2709275,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Berries (mixed)",
    "migrationDate": "2025-07-27T00:35:47.906Z"
  },
  {
    "name": "lemon, raw",
    "category": "blue",
    "description": "Lemon, raw - USDA verified nutritional data (replaces: Lemon)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 29,
      "protein": 1,
      "carbs": 9,
      "fat": 0,
      "fiber": 3
    },
    "fdcId": 2709168,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Lemon",
    "migrationDate": "2025-07-27T00:35:48.599Z"
  },
  {
    "name": "lime, raw",
    "category": "blue",
    "description": "Lime, raw - USDA verified nutritional data (replaces: Lime)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 30,
      "protein": 1,
      "carbs": 11,
      "fat": 0,
      "fiber": 3
    },
    "fdcId": 2709170,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Lime",
    "migrationDate": "2025-07-27T00:35:49.297Z"
  },
  {
    "name": "grapes, raw",
    "category": "yellow",
    "description": "Grapes, raw - USDA verified nutritional data (replaces: Grapes)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 83,
      "protein": 1,
      "carbs": 19,
      "fat": 0,
      "fiber": 1
    },
    "fdcId": 2709237,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Grapes",
    "migrationDate": "2025-07-27T00:35:49.995Z"
  },
  {
    "name": "apple, raw",
    "category": "blue",
    "description": "Apple, raw - USDA verified nutritional data (replaces: Apples)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 61,
      "protein": 0,
      "carbs": 15,
      "fat": 0,
      "fiber": 2
    },
    "fdcId": 2709215,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Apples",
    "migrationDate": "2025-07-27T00:35:50.503Z"
  },
  {
    "name": "banana, raw",
    "category": "yellow",
    "description": "Banana, raw - USDA verified nutritional data (replaces: Banana)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 97,
      "protein": 1,
      "carbs": 23,
      "fat": 0,
      "fiber": 2
    },
    "fdcId": 2709224,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Banana",
    "migrationDate": "2025-07-27T00:35:51.184Z"
  },
  {
    "name": "nuts, almonds, whole, raw",
    "category": "yellow",
    "description": "Nuts, almonds, whole, raw - USDA verified nutritional data (replaces: Almonds)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 626,
      "protein": 22,
      "carbs": 20,
      "fat": 51,
      "fiber": 11
    },
    "fdcId": 2346393,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Almonds",
    "migrationDate": "2025-07-27T00:35:51.881Z"
  },
  {
    "name": "nuts, walnuts, english, halves, raw",
    "category": "yellow",
    "description": "Nuts, walnuts, English, halves, raw - USDA verified nutritional data (replaces: Walnut)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 730,
      "protein": 15,
      "carbs": 11,
      "fat": 70,
      "fiber": 5
    },
    "fdcId": 2346394,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Walnut",
    "migrationDate": "2025-07-27T00:35:52.580Z"
  },
  {
    "name": "seeds, chia seeds, dried",
    "category": "yellow",
    "description": "Seeds, chia seeds, dried - USDA verified nutritional data (replaces: Chia Seeds)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 2030,
      "protein": 17,
      "carbs": 42,
      "fat": 31,
      "fiber": 34
    },
    "fdcId": 170554,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Chia Seeds",
    "migrationDate": "2025-07-27T00:35:53.317Z"
  },
  {
    "name": "quinoa, cooked",
    "category": "yellow",
    "description": "Quinoa, cooked - USDA verified nutritional data (replaces: Quinoa)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 503,
      "protein": 4,
      "carbs": 21,
      "fat": 2,
      "fiber": 3
    },
    "fdcId": 168917,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Quinoa",
    "migrationDate": "2025-07-27T00:35:54.041Z"
  },
  {
    "name": "rice, brown, cooked, as ingredient",
    "category": "yellow",
    "description": "Rice, brown, cooked, as ingredient - USDA verified nutritional data (replaces: Brown Rice)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 124,
      "protein": 2,
      "carbs": 26,
      "fat": 1,
      "fiber": 1
    },
    "fdcId": 2710789,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Brown Rice",
    "migrationDate": "2025-07-27T00:35:54.784Z"
  },
  {
    "name": "oats, raw",
    "category": "yellow",
    "description": "Oats, raw - USDA verified nutritional data (replaces: Oats (steel cut))",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 379,
      "protein": 13,
      "carbs": 68,
      "fat": 7,
      "fiber": 10
    },
    "fdcId": 2708489,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Oats (steel cut)",
    "migrationDate": "2025-07-27T00:35:55.495Z"
  },
  {
    "name": "buckwheat",
    "category": "yellow",
    "description": "Buckwheat - USDA verified nutritional data (replaces: Buckwheat)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 1440,
      "protein": 13,
      "carbs": 72,
      "fat": 3,
      "fiber": 10
    },
    "fdcId": 170286,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Buckwheat",
    "migrationDate": "2025-07-27T00:35:56.176Z"
  },
  {
    "name": "millet, raw",
    "category": "yellow",
    "description": "Millet, raw - USDA verified nutritional data (replaces: Millet)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 1580,
      "protein": 11,
      "carbs": 73,
      "fat": 4,
      "fiber": 9
    },
    "fdcId": 169702,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Millet",
    "migrationDate": "2025-07-27T00:35:56.876Z"
  },
  {
    "name": "egg, whole, raw",
    "category": "blue",
    "description": "Egg, whole, raw - USDA verified nutritional data (replaces: Eggs)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 143,
      "protein": 12,
      "carbs": 1,
      "fat": 10,
      "fiber": 0
    },
    "fdcId": 2707152,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Eggs",
    "migrationDate": "2025-07-27T00:35:57.678Z"
  },
  {
    "name": "yogurt, greek, plain, lowfat",
    "category": "blue",
    "description": "Yogurt, Greek, plain, lowfat - USDA verified nutritional data (replaces: Greek Yogurt)",
    "servingSize": "1 serving",
    "portionGuidelines": "Unlimited - eat freely as part of balanced meals. Focus on variety and quality.",
    "nutritionalInfo": {
      "calories": 73,
      "protein": 10,
      "carbs": 4,
      "fat": 2,
      "fiber": 0
    },
    "fdcId": 170903,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "blue"
    ],
    "originalName": "Greek Yogurt",
    "migrationDate": "2025-07-27T00:35:58.373Z"
  },
  {
    "name": "avocado, raw",
    "category": "yellow",
    "description": "Avocado, raw - USDA verified nutritional data (replaces: Avocado)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 160,
      "protein": 2,
      "carbs": 9,
      "fat": 15,
      "fiber": 7
    },
    "fdcId": 2709223,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Avocado",
    "migrationDate": "2025-07-27T00:35:59.069Z"
  },
  {
    "name": "olive oil",
    "category": "yellow",
    "description": "Olive oil - USDA verified nutritional data (replaces: Olive Oil)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 900,
      "protein": 0,
      "carbs": 0,
      "fat": 100,
      "fiber": 0
    },
    "fdcId": 2710186,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Olive Oil",
    "migrationDate": "2025-07-27T00:35:59.785Z"
  },
  {
    "name": "coconut oil",
    "category": "yellow",
    "description": "Coconut oil - USDA verified nutritional data (replaces: Coconut Oil)",
    "servingSize": "1 serving",
    "portionGuidelines": "Moderate portions - 1-2 servings per meal. Balance with blue foods for optimal nutrition.",
    "nutritionalInfo": {
      "calories": 895,
      "protein": 0,
      "carbs": 1,
      "fat": 99,
      "fiber": 0
    },
    "fdcId": 2710182,
    "isGlobal": true,
    "isStandard": true,
    "source": "standard",
    "tags": [
      "usda",
      "standard",
      "verified",
      "yellow"
    ],
    "originalName": "Coconut Oil",
    "migrationDate": "2025-07-27T00:36:00.496Z"
  }
];

// Food categories organized for display - mapped to our new standard foods
export const foodCategoriesForDisplay = {
  proteins: {
    title: "PROTEINS",
    subcategories: {
      "MEAT & POULTRY": ["chicken, breast, boneless, skinless, raw", "turkey, whole, breast, meat only, raw", "beef, carcass, separable lean and fat, choice, raw", "duck, wild, breast, meat only, raw", "chicken, liver, all classes, raw"],
      "SEAFOOD": ["fish, salmon, atlantic, farmed, raw", "fish, mackerel, atlantic, raw"],
      "EGGS & DAIRY": ["egg, whole, raw", "yogurt, greek, plain, lowfat"]
    }
  },
  vegetables: {
    title: "VEGETABLES", 
    subcategories: {
      "LOWER STARCH (Unlimited)": ["spinach, raw", "kale, raw", "broccoli, raw", "cauliflower, raw", "peppers, sweet, green, raw"],
      "HIGHER STARCH (Moderate)": ["sweet potato leaves, raw", "beets, raw", "cassava, raw"]
    }
  },
  fruits: {
    title: "FRUITS",
    subcategories: {
      "LOWER SUGAR (Emphasize)": ["blueberries, raw", "lemon, raw", "lime, raw"],
      "HIGHER SUGAR (Sparingly)": ["grapes, raw", "banana, raw"],
      "HEALTHY FATS": ["avocado, raw"]
    }
  },
  legumes: {
    title: "LEGUMES & BEANS",
    subcategories: {
      "PLANT PROTEINS": []  // Not included in current standard foods
    }
  },
  nutsSeeds: {
    title: "NUTS & SEEDS",
    subcategories: {
      "NUTS": ["nuts, almonds, whole, raw", "nuts, walnuts, english, halves, raw"],
      "SEEDS": ["seeds, chia seeds, dried"]
    }
  },
  grains: {
    title: "GRAINS",
    subcategories: {
      "WHOLE GRAINS": ["quinoa, cooked", "rice, brown, cooked, as ingredient", "oats, raw", "buckwheat", "millet, raw"]
    }
  },
  fats: {
    title: "HEALTHY FATS & OILS",
    subcategories: {
      "COOKING OILS": ["olive oil", "coconut oil"]
    }
  },
  beverages: {
    title: "BEVERAGES", 
    subcategories: {
      "UNLIMITED": [],  // Not included in current standard foods
      "MODERATE": [],
      "LIMIT": []
    }
  },
  seasonings: {
    title: "HERBS, SPICES & SEASONINGS",
    subcategories: {
      "HERBS & SPICES": [],  // Not included in current standard foods
      "CONDIMENTS": []
    }
  }
};

export default standardFoods;
