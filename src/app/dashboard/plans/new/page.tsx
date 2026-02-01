'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { foodService } from '@/lib/firebase/foods';
import { useClients } from '@/lib/hooks/useClients';
import { FoodSelectionGuide, FoodItemData, CategoryData, FoodStatus } from '@/components/food';
import { AIRecommendationPanel } from '@/components/plans/AIRecommendationPanel';
import type { FoodItem } from '@/lib/types';
import type { AIRecommendationResponse } from '@/lib/types/ai-recommendations';
import { ArrowLeft, Save, User, CheckCircle, AlertCircle, MinusCircle, Info } from 'lucide-react';

interface FoodCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

function NewPlanContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdFromUrl = searchParams.get('clientId');

  // Fetch clients to pre-fill name if needed
  const { clients, createClient } = useClients();

  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [foodStatuses, setFoodStatuses] = useState<Map<string, FoodStatus>>(new Map());
  const [clientName, setClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ingredientDocumentService = new IngredientDocumentService();

  // Load client details if ID is present
  useEffect(() => {
    if (clientIdFromUrl && clients.length > 0) {
      const foundClient = clients.find(c => c.id === clientIdFromUrl);
      if (foundClient) {
        setClientName(foundClient.name);
        setSelectedClient(foundClient);
      }
    }
  }, [clientIdFromUrl, clients]);

  // Load food categories and foods from Firestore
  useEffect(() => {
    loadFoodData();
  }, []);

  const loadFoodData = async () => {
    try {
      setLoading(true);

      // Load all foods using the same service as the foods page
      const allFoods = await foodService.getGlobalFoods();

      // Create coach-friendly categories that match our AI service
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
    return foods.map(food => {
      // Use stored category if available, otherwise default to 'other'
      const categoryId = food.category || 'other';

      // Generate nutritional highlights from nutritionalInfo
      const nutritionalHighlights: string[] = [];
      if (food.nutritionalInfo) {
        const { calories, protein, carbs, fat, fiber } = food.nutritionalInfo;
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

  // Handle AI recommendations
  const handleAIRecommendations = (results: AIRecommendationResponse) => {
    // Map AI categories to food statuses
    const categoryToStatusMap: Record<string, FoodStatus> = {
      'blue': 'approved',
      'yellow': 'neutral',
      'red': 'avoid'
    };

    setFoodStatuses(prev => {
      const newStatuses = new Map(prev);

      // Apply all AI recommendations
      results.recommendations.forEach(rec => {
        const status = categoryToStatusMap[rec.category];
        if (status) {
          newStatuses.set(rec.foodId, status);
        }
      });

      return newStatuses;
    });

    // Scroll to food list so user can see the results
    setTimeout(() => {
      const foodListElement = document.querySelector('[data-food-list]');
      if (foodListElement) {
        foodListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };




  const handleFoodAdded = (newFood: FoodItem) => {
    // Add new food to list
    setFoods(prev => {
      // Double check not duplicate by ID
      if (prev.some(f => f.id === newFood.id)) return prev;
      return [newFood, ...prev]; // Add to top
    });

    // Auto-approve it (since it came from "Smart Discovery" which is beneficial/blue)
    setFoodStatuses(prev => {
      const newStatuses = new Map(prev);
      newStatuses.set(newFood.id, 'approved');
      return newStatuses;
    });

    // Optional: Scroll to it or show toast
    // For now, it will appear at top of list
  };

  // Updated saveDocument function
  const saveDocument = async () => {
    if (!user || !clientName.trim()) {
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
      // 1. Resolve Client ID (Find existing or Create new)
      const normalizedName = clientName.trim();
      let finalClientId: string | undefined;

      // Check if client already exists (case-insensitive name match)
      const existingClient = clients.find(
        c => c.name.toLowerCase() === normalizedName.toLowerCase()
      );

      if (existingClient) {
        finalClientId = existingClient.id;
        console.log(`Found existing client: ${existingClient.name} (${existingClient.id})`);
      } else {
        // Create new client
        console.log(`Creating new client: ${normalizedName}`);
        try {
          finalClientId = await createClient({
            name: normalizedName,
            email: '',
            sessionNotes: '',
            goals: [],
            restrictions: []
          });
        } catch (clientError) {
          console.error("Failed to auto-create client:", clientError);
          // Fallback: Proceed without client ID (legacy behavior) or alert user
          // For now, we'll alert but let them try again or maybe just proceed with name-only if your schema allows
          alert("Could not create new client profile automatically. Please try again or create client manually.");
          setSaving(false);
          return;
        }
      }

      // 2. Prepare ingredients data
      const ingredients = selectedFoods.map(food => {
        const status = foodStatuses.get(food.id) || 'none';
        let colorCode: 'blue' | 'yellow' | 'red' | null = null;
        let isSelected = true;

        if (status === 'approved') colorCode = 'blue';
        else if (status === 'neutral') colorCode = 'yellow';
        else if (status === 'avoid') colorCode = 'red';

        return {
          foodId: food.id,
          categoryId: getFoodItemData().find(f => f.id === food.id)?.categoryId || 'other',
          colorCode,
          isSelected,
          notes: `Coach marked as: ${status}`
        };
      });

      // 3. Create Document
      const document = await ingredientDocumentService.createDocument(user.uid, {
        clientName: normalizedName,
        ingredients: ingredients,
        status: 'published' as const
      });

      if (document && document.id) {
        router.push(`/dashboard/plans/${document.id}`);
      } else {
        throw new Error('Document was created but has no ID');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document. Please try again.');
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
      <div className="min-h-screen bg-brand-cream/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <img src="/icons/icon-192x192.svg" alt="Loading" className="w-10 h-10" />
          </div>
          <p className="text-brand-dark/60 font-prompt">
            Loading food database...
          </p>
        </div>
      </div>
    );
  }

  const statusSummary = getStatusSummary();

  return (
    <div className="min-h-full">

      {/* 1. Full-Width Sticky Header Container */}
      <div className="sticky top-0 z-[100] bg-white border-b border-gray-100/50 shadow-sm w-full">
        {/* Centered Content with Padding restored */}
        <div className="max-w-7xl mx-auto px-8 pt-8 pb-4">
          <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md border-brand-gold/10 relative z-20">
            <div className="flex items-center gap-4 flex-1">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Button>
              </Link>

              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

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

              <Button
                variant="primary"
                onClick={saveDocument}
                isLoading={saving}
                disabled={!clientName || (statusSummary.approved + statusSummary.neutral + statusSummary.avoid) === 0}
                className="rounded-full shadow-lg shadow-brand-gold/20"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Plan'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 2. Main Content - Centered with Padding restored */}
      <div className="max-w-7xl mx-auto px-8 pt-6 pb-8 space-y-6">

        {/* AI Panel */}
        <AIRecommendationPanel
          onRecommendationsGenerated={handleAIRecommendations}
          onFoodAdded={handleFoodAdded}
          clientData={selectedClient ? {
            name: selectedClient.name,
            goals: selectedClient.goals,
            restrictions: selectedClient.restrictions,
            sessionNotes: selectedClient.sessionNotes
          } : undefined}
        />

        {/* Food Guide */}
        <div data-food-list className="bg-white rounded-[32px] shadow-card p-4 md:p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Food Selection</h2>
            <p className="text-gray-500 mt-1 max-w-2xl">
              Select foods to include in the plan. Mark them as Approved (unlimited), Neutral (moderate), or Avoid.
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

export default function NewPlanPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-brand-cream/30 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full"></div>
        </div>
      }>
        <NewPlanContent />
      </Suspense>
    </ProtectedRoute>
  )
}
