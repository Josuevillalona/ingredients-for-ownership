'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AddFoodForm } from '@/components/food/AddFoodForm';
import { FDCFoodSearch } from '@/components/food/FDCFoodSearch';
import { useFoods } from '@/lib/hooks/useFoods';
import { CreateFoodData, FoodItem } from '@/lib/types';
import { ArrowLeft, Search, PenTool, X } from 'lucide-react';

type Tab = 'search' | 'manual';

export default function NewFoodPage() {
    const router = useRouter();
    const { createFood, loadFoods } = useFoods();
    const [activeTab, setActiveTab] = useState<Tab>('search');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewFood, setPreviewFood] = useState<Omit<FoodItem, 'id'> | null>(null);

    // Manual Form Submission
    const handleCreateFood = async (data: CreateFoodData) => {
        setIsSubmitting(true);
        try {
            const success = await createFood(data);
            if (success) {
                router.push('/dashboard/foods');
            }
        } catch (error) {
            console.error('Error creating food:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Quick Save from Search
    const handleQuickSave = async (foodItem: Omit<FoodItem, 'id'>) => {
        setIsSubmitting(true);
        try {
            const createData: CreateFoodData = {
                name: foodItem.name,
                description: foodItem.description,
                servingSize: foodItem.servingSize,
                portionGuidelines: foodItem.portionGuidelines,
                nutritionalInfo: foodItem.nutritionalInfo,
                fdcId: foodItem.fdcId,
                source: foodItem.source || 'fdc-api',
                tags: foodItem.tags || []
            };

            const success = await createFood(createData);
            if (success) {
                // Determine next step: maybe stay on search to add more? 
                // For now, let's redirect to list to confirm
                await loadFoods();
                router.push('/dashboard/foods');
            }
        } catch (error) {
            console.error('Error saving FDC food:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreviewSave = () => {
        if (previewFood) {
            handleQuickSave(previewFood);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 font-prompt">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/foods">
                        <Button variant="ghost" size="sm" className="rounded-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-brand-dark">Add New Food</h1>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'search' ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20' : 'bg-white text-brand-dark border border-gray-100 hover:bg-gray-50'}`}
                >
                    <Search className="w-4 h-4" />
                    Search USDA Database
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20' : 'bg-white text-brand-dark border border-gray-100 hover:bg-gray-50'}`}
                >
                    <PenTool className="w-4 h-4" />
                    Enter Manually
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[32px] shadow-card p-6 md:p-8 border border-gray-100 min-h-[400px]">
                {activeTab === 'search' ? (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-brand-dark mb-1">Search USDA Database</h2>
                            <p className="text-gray-500 text-sm">Find and add generic foods verified by the USDA.</p>
                        </div>
                        <FDCFoodSearch
                            onFoodQuickSave={handleQuickSave}
                            onFoodSelect={setPreviewFood}
                            // We can add detail view logic if needed, but simple quick save is fast
                            className="max-w-xl"
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-brand-dark mb-2">Manual Entry</h2>
                            <p className="text-gray-500 text-sm">Fill in the nutritional information below to add a custom food.</p>
                        </div>

                        <AddFoodForm
                            onSubmit={handleCreateFood}
                            onCancel={() => router.push('/dashboard/foods')}
                            isLoading={isSubmitting}
                        />
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewFood && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark pr-4">{previewFood.name}</h3>
                            </div>
                            <button onClick={() => setPreviewFood(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-brand-dark">{previewFood.nutritionalInfo?.calories || 0}</div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Calories</div>
                                </div>
                                <div className="bg-brand-gold/10 p-4 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-brand-gold">{previewFood.nutritionalInfo?.protein || 0}g</div>
                                    <div className="text-xs font-semibold text-brand-gold/80 uppercase tracking-wider">Protein</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-blue-600">{previewFood.nutritionalInfo?.carbs || 0}g</div>
                                    <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Carbs</div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-2xl text-center">
                                    <div className="text-2xl font-bold text-orange-600">{previewFood.nutritionalInfo?.fat || 0}g</div>
                                    <div className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Fat</div>
                                </div>
                            </div>

                            {/* Serving Info */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-brand-dark">Serving Information</h4>
                                <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Serving Size:</span>
                                        <span className="font-medium text-brand-dark">{previewFood.servingSize || 'As specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Source:</span>
                                        <span className="font-medium text-brand-dark">{previewFood.source === 'fdc-api' ? 'USDA Database' : 'Manual'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            <Button
                                variant="secondary"
                                className="flex-1 rounded-full bg-white border-transparent shadow-sm hover:bg-gray-100"
                                onClick={() => setPreviewFood(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 rounded-full text-white"
                                onClick={handlePreviewSave}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Add to Database'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
