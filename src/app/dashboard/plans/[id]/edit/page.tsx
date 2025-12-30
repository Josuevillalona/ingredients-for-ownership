'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { foodService } from '@/lib/firebase/foods';
import { FoodSelectionGuide, FoodItemData, CategoryData, FoodStatus } from '@/components/food';
import { AIRecommendationPanel } from '@/components/plans/AIRecommendationPanel';
import type { IngredientDocument, FoodItem } from '@/lib/types';
import type { AIRecommendationResponse } from '@/lib/types/ai-recommendations';
import { ArrowLeft, Save, User, CheckCircle, AlertCircle, MinusCircle } from 'lucide-react';

interface FoodCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

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

  // RENAMED to avoid shadowing global document
  const [planDoc, setPlanDoc] = useState<IngredientDocument | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);
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

      // 1. Load the document
      const doc = await ingredientDocumentService.getDocument(documentId, user.uid);
      if (!doc) {
        setError('Document not found or you do not have permission to edit it.');
        return;
      }

      setPlanDoc(doc);
      setClientName(doc.clientName);

      // 2. Load all foods (using foodService for consistency)
      const allFoods = await foodService.getGlobalFoods();

      // 3. Setup Categories (matching NewPlanPage)
      const coachCategories: FoodCategory[] = [
        { id: 'meat', name: 'Meat & Poultry', description: 'Chicken, beef, pork, lamb, eggs', order: 1 },
        { id: 'seafood', name: 'Seafood', description: 'Fish, shellfish, marine proteins', order: 2 },
        { id: 'plant-proteins', name: 'Plant Proteins', description: 'Tofu, beans, lentils, protein powders', order: 3 },
        { id: 'vegetables', name: 'Vegetables', description: 'Fresh vegetables and leafy greens', order: 4 },
        { id: 'healthy-carbs', name: 'Healthy Carbs', description: 'Whole grains, quinoa, sweet potatoes', order: 5 },
        { id: 'healthy-fats', name: 'Healthy Fats', description: 'Nuts, seeds, avocado, olive oil', order: 6 },
        { id: 'fruits', name: 'Fruits', description: 'Fresh and dried fruits', order: 7 },
        { id: 'dairy', name: 'Dairy', description: 'Milk, cheese, yogurt products', order: 8 },
        { id: 'other', name: 'Other Foods', description: 'Processed and miscellaneous foods', order: 9 }
      ];
      setFoodCategories(coachCategories);
      setFoods(allFoods);

      // 4. Initialize food statuses
      const initialStatuses = new Map<string, FoodStatus>();

      // Set all to none first
      allFoods.forEach(food => {
        initialStatuses.set(food.id, 'none');
      });

      // Apply saved statuses from document
      doc.ingredients.forEach(ingredient => {
        let status: FoodStatus = 'none';

        if (ingredient.isSelected && ingredient.colorCode === 'blue') {
          status = 'approved';
        } else if (ingredient.colorCode === 'yellow') {
          status = 'neutral';
        } else if (ingredient.colorCode === 'red') {
          status = 'avoid';
        }

        // Only set if food still exists in DB
        if (allFoods.some(f => f.id === ingredient.foodId)) {
          initialStatuses.set(ingredient.foodId, status);
        }
      });

      setFoodStatuses(initialStatuses);
    } catch (error) {
      console.error('Error loading document and food data:', error);
      setError('Failed to load document data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Convert our data to the format expected by FoodSelectionGuide (with Rich Highlights)
  const getFoodItemData = (): FoodItemData[] => {
    return foods.map(food => {
      const categoryId = food.category || 'other';

      // Generate nutritional highlights
      const nutritionalHighlights: string[] = [];
      if (food.nutritionalInfo) {
        const { calories, protein, fiber } = food.nutritionalInfo;
        if (protein && protein > 10) nutritionalHighlights.push('High Protein');
        if (fiber && fiber > 3) nutritionalHighlights.push('High Fiber');
        if (calories && calories < 100) nutritionalHighlights.push('Low Calorie');
      }

      // Add category confidence as a highlight if available
      if (food.categoryConfidence && food.categoryConfidence > 0.8) {
        const confidence = (food.categoryConfidence * 100).toFixed(0);
        const method = food.categoryMethod === 'regex' ? 'Keyword' :
          food.categoryMethod === 'huggingface-ai' ? 'AI' : 'Auto';
        nutritionalHighlights.push(`${method}: ${confidence}%`);
      }

      return {
        id: food.id,
        name: food.name,
        servingSize: food.servingSize,
        status: foodStatuses.get(food.id) || 'none',
        categoryId,
        nutritionalHighlights,
        nutritionalInfo: food.nutritionalInfo
      };
    });
  };

  const getCategoryData = (): CategoryData[] => {
    return foodCategories.map(c => ({
      id: c.id,
      title: c.name,
      order: c.order
    }));
  };

  const handleStatusChange = (foodId: string, status: FoodStatus) => {
    setFoodStatuses(prev => {
      const newStatuses = new Map(prev);
      newStatuses.set(foodId, status);
      return newStatuses;
    });
  };

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
      // Global document is now accessible because local var is planDoc
      const foodListElement = document.querySelector('[data-food-list]');
      if (foodListElement) {
        foodListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  const updateDocument = async () => {
    if (!user || !clientName || !planDoc) {
      alert('Please enter a client name before saving.');
      return;
    }

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
      const ingredients = selectedFoods.map(food => {
        const status = foodStatuses.get(food.id) || 'none';

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
          categoryId: food.category || 'other',
          colorCode,
          isSelected,
          notes: `Coach marked as: ${status}`
        };
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <img src="/icons/icon-192x192.svg" alt="Loading" className="w-10 h-10" />
          </div>
          <p className="text-brand-dark/60 font-prompt">Loading plan...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !planDoc) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-prompt font-bold text-2xl">!</span>
          </div>
          <h2 className="font-prompt font-bold text-xl text-brand-dark mb-2">Cannot Edit Plan</h2>
          <p className="text-brand-dark/60 font-prompt mb-4">{error}</p>
          <Link href="/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusSummary = getStatusSummary();

  return (
    <div className="min-h-full">
      {/* 1. Full-Width Sticky Header Container */}
      <div className="sticky top-0 z-[100] bg-white border-b border-gray-100/50 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-8 pb-4">
          <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md border-brand-gold/10 relative z-20">
            <div className="flex items-center gap-4 flex-1">
              {/* Back Button */}
              <Link href={`/dashboard/plans/${documentId}`}>
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Button>
              </Link>

              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

              {/* Client Name Input */}
              <div className="flex-1 max-w-sm">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block ml-1">Client Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-gold/50 rounded-full text-brand-dark font-medium placeholder:text-gray-400 focus:outline-none transition-all"
                    placeholder="Enter client name..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Counters */}
              <div className="flex items-center gap-2 mr-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusSummary.approved > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{statusSummary.approved}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusSummary.neutral > 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{statusSummary.neutral}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusSummary.avoid > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{statusSummary.avoid}</span>
                </div>
              </div>

              {/* Save Button */}
              <Button
                variant="primary"
                onClick={updateDocument}
                isLoading={saving}
                disabled={!clientName || (statusSummary.approved + statusSummary.neutral + statusSummary.avoid) === 0}
                className="rounded-full shadow-lg shadow-brand-gold/20"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="max-w-7xl mx-auto px-8 pt-6 pb-8 space-y-6">

        {/* AI Recommendations */}
        <AIRecommendationPanel
          onRecommendationsGenerated={handleAIRecommendations}
        />

        {/* Food Guide */}
        <div data-food-list className="bg-white rounded-[32px] shadow-card p-4 md:p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Edit Selection</h2>
            <p className="text-gray-500 mt-1 max-w-2xl">
              Modify the food choices for this plan.
            </p>
          </div>

          <FoodSelectionGuide
            foods={getFoodItemData()}
            categories={getCategoryData()}
            onStatusChange={handleStatusChange}
            showActionIcon={false}
          />
        </div>
      </div>
    </div>
  );
}
