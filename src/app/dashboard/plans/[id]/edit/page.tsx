'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { FoodSelectionGuide, FoodItemData, CategoryData, FoodStatus } from '@/components/food';
import { AIRecommendationPanel } from '@/components/plans/AIRecommendationPanel';
import type { IngredientDocument, Food } from '@/lib/types';
import type { AIRecommendationResponse } from '@/lib/types/ai-recommendations';

export default function EditPlanPage() {
  return (
    <ProtectedRoute>
      <EditPlanContent />
    </ProtectedRoute>
  );
}

function EditPlanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = useState<IngredientDocument | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodStatuses, setFoodStatuses] = useState<Map<string, FoodStatus>>(new Map());
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ingredientDocumentService = new IngredientDocumentService();

  // Load existing document and food data
  useEffect(() => {
    if (user && documentId) {
      loadDocumentAndFoodData();
    }
  }, [user, documentId]);

  const loadDocumentAndFoodData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load the document
      const doc = await ingredientDocumentService.getDocument(documentId, user.uid);
      if (!doc) {
        setError('Document not found or you do not have permission to edit it.');
        return;
      }

      setDocument(doc);
      setClientName(doc.clientName);

      // Load all foods
      const foodsQuery = query(collection(db, 'foods'));
      const foodsSnapshot = await getDocs(foodsQuery);
      const allFoods = foodsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Food[];

      setFoods(allFoods);

      // Initialize food statuses from existing document
      const initialStatuses = new Map<string, FoodStatus>();
      
      // Set all foods to 'none' initially
      allFoods.forEach(food => {
        initialStatuses.set(food.id, 'none');
      });

      // Update with existing selections from the document
      doc.ingredients.forEach(ingredient => {
        let status: FoodStatus = 'none';
        
        if (ingredient.isSelected && ingredient.colorCode === 'blue') {
          status = 'approved';
        } else if (ingredient.colorCode === 'yellow') {
          status = 'neutral';
        } else if (ingredient.colorCode === 'red') {
          status = 'avoid';
        }
        
        initialStatuses.set(ingredient.foodId, status);
      });

      setFoodStatuses(initialStatuses);
    } catch (error) {
      console.error('Error loading document and food data:', error);
      setError('Failed to load document data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Convert our data to the format expected by FoodSelectionGuide
  const getFoodItemData = (): FoodItemData[] => {
    return foods.map(food => {
      // Use the 'category' field (not 'categoryId') - this is auto-categorized by AI
      // @ts-ignore - Food type has 'category' field from FoodItem interface
      const categoryId = food.category || 'other';
      
      return {
        id: food.id,
        name: food.name,
        status: foodStatuses.get(food.id) || 'none',
        categoryId,
        nutritionalHighlights: food.nutritionalHighlights
      };
    });
  };

  const getCategoryData = (): CategoryData[] => {
    // Use the same categories as the create page (not from Firestore)
    // These match the AI categorization system
    const coachCategories: CategoryData[] = [
      { id: 'meat', title: 'Meat & Poultry', order: 1 },
      { id: 'seafood', title: 'Seafood', order: 2 },
      { id: 'plant-proteins', title: 'Plant Proteins', order: 3 },
      { id: 'vegetables', title: 'Vegetables', order: 4 },
      { id: 'healthy-carbs', title: 'Healthy Carbs', order: 5 },
      { id: 'healthy-fats', title: 'Healthy Fats', order: 6 },
      { id: 'fruits', title: 'Fruits', order: 7 },
      { id: 'dairy', title: 'Dairy', order: 8 },
      { id: 'other', title: 'Other Foods', order: 9 }
    ];
    
    return coachCategories;
  };

  const handleStatusChange = (foodId: string, status: FoodStatus) => {
    setFoodStatuses(prev => {
      const newStatuses = new Map(prev);
      newStatuses.set(foodId, status);
      return newStatuses;
    });
  };

  // Handle AI recommendations
  const handleAIRecommendations = (results: AIRecommendationResponse) => {
    const categoryToStatusMap: Record<string, FoodStatus> = {
      'blue': 'approved',
      'yellow': 'neutral',
      'red': 'avoid'
    };

    setFoodStatuses(prev => {
      const newStatuses = new Map(prev);
      results.recommendations.forEach(rec => {
        const status = categoryToStatusMap[rec.category];
        if (status) {
          newStatuses.set(rec.foodId, status);
        }
      });
      return newStatuses;
    });

    setTimeout(() => {
      const foodListElement = document.querySelector('[data-food-list]');
      if (foodListElement) {
        foodListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  const updateDocument = async () => {
    if (!user || !clientName || !document) {
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
        let isSelected = false;
        
        if (status === 'approved') {
          colorCode = 'blue';
          isSelected = true;
        } else if (status === 'neutral') {
          colorCode = 'yellow';
          isSelected = true;
        } else if (status === 'avoid') {
          colorCode = 'red';
          isSelected = true;
        }

        return {
          foodId: food.id,
          categoryId: food.categoryId || '',
          colorCode,
          isSelected,
          notes: `Coach marked as: ${status}`
        };
      });

      console.log('Updating document with data:', {
        clientName: clientName,
        ingredients: ingredients,
        status: 'published'
      });

      const updatedDocument = await ingredientDocumentService.updateDocument(
        documentId, 
        user.uid, 
        {
          clientName: clientName,
          ingredients: ingredients,
          status: 'published' as const
        }
      );

      if (updatedDocument) {
        router.push(`/dashboard/plans/${documentId}`);
      } else {
        alert('Failed to update document. Please try again.');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document. Please try again.');
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
          <p className="text-brand-dark/60 font-prompt">Loading plan for editing...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-prompt font-bold text-2xl">!</span>
          </div>
          <h2 className="font-prompt font-bold text-xl text-brand-dark mb-2">
            Cannot Edit Plan
          </h2>
          <p className="text-brand-dark/60 font-prompt mb-4">
            {error}
          </p>
          <Link href="/dashboard">
            <Button variant="primary">
              Back to Dashboard
            </Button>
          </Link>
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
              <Link 
                href={`/dashboard/plans/${documentId}`} 
                className="text-brand-white/70 hover:text-brand-white"
              >
                ← Back to Plan
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-white font-prompt font-bold text-lg">I</span>
              </div>
              <h1 className="text-brand-white font-prompt font-bold text-2xl">
                Edit Nutrition Plan
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
                <div className="w-3 h-3 bg-[#81D4FA] rounded-full" />
                <span className="text-brand-dark">Approved: {statusSummary.approved}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FFC000] rounded-full" />
                <span className="text-brand-dark">Neutral: {statusSummary.neutral}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FF5252] rounded-full" />
                <span className="text-brand-dark">Avoid: {statusSummary.avoid}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => router.push(`/dashboard/plans/${documentId}`)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={updateDocument}
                isLoading={saving}
                disabled={!clientName || (statusSummary.approved + statusSummary.neutral + statusSummary.avoid) === 0}
              >
                {saving ? 'Saving...' : 'Update Plan'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AIRecommendationPanel
          onRecommendationsGenerated={handleAIRecommendations}
        />
      </div>

      {/* Food Selection Guide */}
      <div data-food-list>
        <FoodSelectionGuide
          foods={getFoodItemData()}
          categories={getCategoryData()}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
