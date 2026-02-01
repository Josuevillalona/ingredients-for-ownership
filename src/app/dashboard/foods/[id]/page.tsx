'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AddFoodForm } from '@/components/food/AddFoodForm';
import { useFoods } from '@/lib/hooks/useFoods';
import { CreateFoodData, FoodItem } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function EditFoodPage() {
    const router = useRouter();
    const params = useParams();
    const { foods, updateFood, loading: foodsLoading } = useFoods();
    const [food, setFood] = useState<FoodItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Find the food item from the loaded list
    // In a production app with huge lists, we'd fetch specific ID, but here likely okay
    useEffect(() => {
        if (!foodsLoading && foods.length > 0 && params?.id) {
            const found = foods.find(f => f.id === params.id);
            if (found) {
                setFood(found);
            } else {
                // If loaded but not found, maybe redirect or show error
                // router.push('/dashboard/foods');
            }
        }
    }, [foods, foodsLoading, params?.id]);

    const handleUpdateFood = async (data: CreateFoodData) => {
        if (!food) return;

        setIsSubmitting(true);
        try {
            const success = await updateFood(food.id, data);
            if (success) {
                router.push('/dashboard/foods');
            }
        } catch (error) {
            console.error('Error updating food:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (foodsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!food && !foodsLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <div className="mb-8">
                    <Link href="/dashboard/foods">
                        <Button variant="ghost" size="sm" className="rounded-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Library
                        </Button>
                    </Link>
                </div>
                <div className="text-center py-12">
                    <h2 className="text-xl font-bold text-brand-dark mb-2">Food not found</h2>
                    <p className="text-gray-500">The food item you are trying to edit does not exist or you don&apos;t have permission.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 font-prompt">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard/foods">
                    <Button variant="ghost" size="sm" className="rounded-full mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark">Edit Food</h1>
                        <p className="text-gray-500 mt-1">Update nutritional info or details for {food?.name}</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-[32px] shadow-card p-6 md:p-8 border border-gray-100">
                {food && (
                    <AddFoodForm
                        initialData={food}
                        onSubmit={handleUpdateFood}
                        onCancel={() => router.push('/dashboard/foods')}
                        isLoading={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}
