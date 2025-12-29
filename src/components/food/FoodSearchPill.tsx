'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FoodSearchPillProps {
    onSearch: (term: string) => void;
    onAddManual: () => void;
    isLoading?: boolean;
}

export function FoodSearchPill({ onSearch, onAddManual, isLoading }: FoodSearchPillProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'saved' | 'usda'>('saved');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    return (
        <div className="bg-brand-white rounded-full shadow-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20 border border-white">
            <div className="flex items-center gap-4 w-full md:w-auto px-2">
                <div className="p-2 bg-brand-gold/10 rounded-full text-brand-gold">
                    <span className="text-xl">🥗</span>
                </div>
                <h1 className="text-xl font-bold text-brand-dark hidden sm:block">Food Database</h1>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-1 justify-end">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search saved foods..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none"
                    />
                    {isLoading && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold animate-spin" />
                    )}
                </div>

                <Button
                    onClick={onAddManual}
                    className="rounded-full shadow-lg shadow-brand-gold/20 flex px-4 md:px-6 text-white shrink-0"
                    size="md"
                >
                    <Plus className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Add Food</span>
                </Button>
            </div>
        </div>
    );
}
