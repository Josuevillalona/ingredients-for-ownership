'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AddFoodForm } from '@/components/food/AddFoodForm';
import { useFoods } from '@/lib/hooks/useFoods';
import { CreateFoodData } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function NewFoodPage() {
    const router = useRouter();
    const { createFood } = useFoods();
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    return (
        <div className="max-w-3xl mx-auto py-8 font-prompt">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/dashboard/foods">
                    <Button variant="ghost" size="sm" className="rounded-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-brand-dark">Add Custom Food</h1>
            </div>

            <div className="bg-white rounded-[32px] shadow-card p-8 border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-brand-dark mb-2">Food Details</h2>
                    <p className="text-gray-500 text-sm">Fill in the nutritional information below to add a custom food to your database.</p>
                </div>

                <AddFoodForm
                    onSubmit={handleCreateFood}
                    onCancel={() => router.push('/dashboard/foods')}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
}
