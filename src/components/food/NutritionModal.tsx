'use client';

import React from 'react';
import { FoodItemData } from './types';
import { X, Flame, Beef, Wheat, Droplets, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NutritionModalProps {
    food: FoodItemData;
    isOpen: boolean;
    onClose: () => void;
}

export function NutritionModal({ food, isOpen, onClose }: NutritionModalProps) {
    if (!isOpen) return null;

    const { nutritionalInfo } = food;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-brand-cream/30 p-6 border-b border-gray-100 flex items-start justify-between">
                    <div>
                        <h3 className="font-prompt font-bold text-xl text-brand-dark mb-1">
                            {food.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                            {food.categoryId.replace('-', ' ')}
                            {food.servingSize && <span className="text-gray-400"> • {food.servingSize}</span>}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 rounded-full hover:bg-black/5 text-gray-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <Flame className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Calories</p>
                                <p className="font-prompt font-bold text-xl text-brand-dark">
                                    {nutritionalInfo?.calories || '--'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Beef className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Protein</p>
                                <p className="font-prompt font-bold text-xl text-brand-dark">
                                    {nutritionalInfo?.protein || 0}g
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                <Wheat className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider">Carbs</p>
                                <p className="font-prompt font-bold text-xl text-brand-dark">
                                    {nutritionalInfo?.carbs || 0}g
                                </p>
                            </div>
                        </div>

                        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-rose-600 font-bold uppercase tracking-wider">Fats</p>
                                <p className="font-prompt font-bold text-xl text-brand-dark">
                                    {nutritionalInfo?.fat || 0}g
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {(nutritionalInfo?.fiber || food.nutritionalHighlights) && (
                        <div className="space-y-3 pt-2">
                            <h4 className="font-prompt font-bold text-sm text-brand-dark">Highlights</h4>
                            <div className="flex flex-wrap gap-2">
                                {nutritionalInfo?.fiber && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                        <Leaf className="w-3.5 h-3.5" />
                                        {nutritionalInfo.fiber}g Fiber
                                    </span>
                                )}
                                {food.nutritionalHighlights?.map((highlight, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button variant="secondary" className="w-full rounded-xl" onClick={onClose}>
                            Close
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
