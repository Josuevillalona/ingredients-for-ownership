'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { FoodSelectionGuide, FoodItemData, CategoryData, FoodStatus } from '@/components/food';

interface Food {
  id: string;
  name: string;
  categoryId: string;
  nutritionalHighlights?: string[];
  fdcId?: number;
}

interface FoodCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  foods?: Food[];
}

export default function CreatePlanPage() {
  return (
    <ProtectedRoute>
      <CreatePlanContent />
    </ProtectedRoute>
  );
}

function CreatePlanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodStatuses, setFoodStatuses] = useState<Map<string, FoodStatus>>(new Map());
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ingredientDocumentService = new IngredientDocumentService();

  // Load food categories and foods from Firestore
  useEffect(() => {
    loadFoodData();
  }, []);

  const loadFoodData = async () => {
    try {
      setLoading(true);

      // Load food categories
      const categoriesQuery = query(
        collection(db, 'food-categories'),
        orderBy('order', 'asc')
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);
      const categories = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FoodCategory[];

      // Load all foods
      const foodsQuery = query(collection(db, 'foods'));
      const foodsSnapshot = await getDocs(foodsQuery);
      const allFoods = foodsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Food[];

      setFoodCategories(categories);
      setFoods(allFoods);
      
      // Initialize all foods with 'none' status
      const initialStatuses = new Map<string, FoodStatus>();
      allFoods.forEach(food => {
        initialStatuses.set(food.id, 'none');
      });
      setFoodStatuses(initialStatuses);
    } catch (error) {
      console.error('Error loading food data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert our data to the format expected by FoodSelectionGuide
  const getFoodItemData = (): FoodItemData[] => {
    return foods.map(food => ({
      id: food.id,
      name: food.name,
      status: foodStatuses.get(food.id) || 'none',
      categoryId: food.categoryId,
      nutritionalHighlights: food.nutritionalHighlights
    }));
  };

  const getCategoryData = (): CategoryData[] => {
    return foodCategories.map(category => ({
      id: category.id,
      title: category.name,
      order: category.order
    }));
  };

  const handleStatusChange = (foodId: string, status: FoodStatus) => {
    setFoodStatuses(prev => {
      const newStatuses = new Map(prev);
      newStatuses.set(foodId, status);
      return newStatuses;
    });
  };

  const saveDocument = async () => {
    if (!user || !clientName) {
      alert('Please enter a client name before saving.');
      return;
    }

    // Get foods with any status except 'none'
    const selectedFoods = foods.filter(food => {
      const status = foodStatuses.get(food.id);
      return status && status !== 'none';
    });

    if (selectedFoods.length === 0) {
      alert('Please select at least one food before saving.');
      return;
    }

    setSaving(true);
    try {
      // Prepare ingredients data for Layer 1 format - only include foods with status
      const ingredients = selectedFoods.map(food => {
        const status = foodStatuses.get(food.id) || 'none';
        
        // Map status to color code and selection state
        let colorCode: 'blue' | 'yellow' | 'red' | null = null;
        let isSelected = true; // All foods with a status should be included in the plan
        
        if (status === 'approved') {
          // For approved foods, use green (recommended)
          colorCode = 'blue';
        } else if (status === 'neutral') {
          // For neutral foods, use yellow (caution/moderation)
          colorCode = 'yellow';
        } else if (status === 'avoid') {
          // For avoid foods, use red (do not consume)
          colorCode = 'red';
        }

        // Ensure no undefined values
        return {
          foodId: food.id,
          categoryId: food.categoryId || '',
          colorCode,
          isSelected,
          notes: `Coach marked as: ${status}`
        };
      });

      console.log('Creating document with data:', {
        clientName: clientName,
        ingredients: ingredients,
        status: 'published',
        userUid: user.uid
      });

      const document = await ingredientDocumentService.createDocument(user.uid, {
        clientName: clientName,
        ingredients: ingredients,
        status: 'published' as const
      });

      console.log('Document created successfully:', document);

      if (document && document.id) {
        console.log('Navigating to document view:', document.id);
        router.push(`/dashboard/plans/${document.id}`);
      } else {
        throw new Error('Document was created but has no ID');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      let errorMessage = 'Failed to save document. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = `Save failed: ${error.message}`;
        console.error('Full error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const getStatusSummary = () => {
    const counts = {
      approved: 0,
      neutral: 0,
      avoid: 0,
      none: 0
    };

    Array.from(foodStatuses.values()).forEach(status => {
      counts[status]++;
    });

    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-brand-white font-prompt font-bold text-2xl">I</span>
          </div>
          <p className="text-brand-dark/60 font-prompt">Loading food database...</p>
        </div>
      </div>
    );
  }

  const statusSummary = getStatusSummary();

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="text-brand-white/70 hover:text-brand-white">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-white font-prompt font-bold text-lg">I</span>
              </div>
              <h1 className="text-brand-white font-prompt font-bold text-2xl">
                Create Nutrition Plan
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Client Name Input */}
      <div className="bg-brand-white border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 border border-brand-gold/20 rounded-xl bg-brand-white
                           focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent
                           font-prompt text-brand-dark placeholder-brand-dark/40"
                placeholder="Enter client's name"
              />
            </div>
            
            {/* Status Summary */}
            <div className="flex items-center space-x-6 text-sm font-prompt">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-brand-dark">Approved: {statusSummary.approved}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-brand-dark">Neutral: {statusSummary.neutral}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-brand-dark">Avoid: {statusSummary.avoid}</span>
              </div>
            </div>

            {/* Save Button */}
            <Button
              variant="primary"
              onClick={saveDocument}
              isLoading={saving}
              disabled={!clientName || (statusSummary.approved + statusSummary.neutral + statusSummary.avoid) === 0}
            >
              {saving ? 'Saving...' : 'Save Plan'}
            </Button>
          </div>
        </div>
      </div>

      {/* Food Selection Guide */}
      <FoodSelectionGuide
        foods={getFoodItemData()}
        categories={getCategoryData()}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
