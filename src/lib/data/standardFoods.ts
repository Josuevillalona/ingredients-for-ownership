/**
 * DISABLED - Standard Foods Database
 * This file is disabled as part of the clean slate approach for global food database
 * Foods will now be saved from the FDC API without pre-assigned colors
 */

import { FoodItem } from '../types';

// DISABLED: Standard foods array emptied for clean slate approach
export const standardFoods: Omit<FoodItem, 'id' | 'coachId' | 'createdAt' | 'lastUpdated'>[] = [];
