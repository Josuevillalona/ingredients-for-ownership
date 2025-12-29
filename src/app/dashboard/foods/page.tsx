'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FoodSearchPill } from '@/components/food/FoodSearchPill';
import { useFoods } from '@/lib/hooks/useFoods';
import { FoodCard } from '@/components/food/FoodCard'; // Assuming we can use or adapt this, or prefer inline
import { Card } from '@/components/ui/Card';
import { Trash2, Edit2, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FoodsPage() {
  const router = useRouter();
  const { foods, loading, deleteFood } = useFoods();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      await deleteFood(id);
    }
  };

  return (
    <div className="space-y-8 font-prompt pb-24">
      {/* Header & Search */}
      <FoodSearchPill
        onSearch={setSearchTerm}
        onAddManual={() => router.push('/dashboard/foods/new')}
        isLoading={loading}
      />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6">
            <span className="text-4xl">🥗</span>
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">No foods found</h2>
          <p className="text-gray-400 max-w-sm mb-6">
            {searchTerm ? `No results for "${searchTerm}"` : "Your database is empty. Add some foods to get started."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => router.push('/dashboard/foods/new')}
              className="rounded-full text-white"
              size="md"
            >
              Add Your First Food
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-card-hover transition-all duration-300 group rounded-[32px] border border-transparent hover:border-gray-100">
              {/* Icon/Image Placeholder */}
              <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center shrink-0 text-2xl group-hover:bg-brand-gold/10 transition-colors">
                {food.category === 'protein' ? '🥩' : food.category === 'carb' ? '🍚' : '🥗'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-brand-dark truncate group-hover:text-brand-gold transition-colors">{food.name}</h3>
                  {food.source === 'fdc-api' && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">USDA</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>{food.servingSize || '1 serving'}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-gray-400">{food.nutritionalInfo?.calories || 0} cal</span>
                  {food.nutritionalInfo?.protein && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-brand-gold font-medium">{food.nutritionalInfo.protein}g P</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:pl-4 md:border-l md:border-gray-100 mt-2 md:mt-0 justify-end w-full md:w-auto">
                <Button variant="ghost" size="sm" className="rounded-full hover:bg-brand-gold/10 hover:text-brand-gold" onClick={() => router.push(`/dashboard/foods/${food.id}`)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <button
                  onClick={() => handleDelete(food.id, food.name)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
