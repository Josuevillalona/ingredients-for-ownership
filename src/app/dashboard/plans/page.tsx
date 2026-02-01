'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Search, FileText } from 'lucide-react';
import { ingredientDocumentService } from '@/lib/firebase/ingredient-documents';
import { useAuth } from '@/components/providers/AuthProvider';
import { IngredientDocument } from '@/lib/types'; // Ensure this type is exported correctly
import { PlanMenu } from '@/components/dashboard/PlanMenu';
import Link from 'next/link';

export default function PlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [plans, setPlans] = useState<IngredientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Renamed from loading to isLoading
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [error, setError] = useState<string | null>(null); // Added error state

  // Load plans content
  const loadPlans = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      // Fetch all documents for the coach
      const docs = await ingredientDocumentService.getCoachDocuments(user.uid, 50);
      setPlans(docs);
    } catch (error) {
      console.error('Error loading plans:', error);
      setError('Failed to load plans.');
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependency array for useCallback

  useEffect(() => {
    if (user) loadPlans();
  }, [user, loadPlans]); // Updated useEffect dependency array

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-prompt pb-24">
      {/* Pill Header */}
      <div className="bg-brand-white rounded-full shadow-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20 border border-white">
        <div className="flex items-center gap-4 w-full md:w-auto px-2">
          <div className="p-2 bg-brand-gold/10 rounded-full text-brand-gold">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-brand-dark">Nutrition Plans</h1>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500 hidden md:inline-block">
            {plans.length}
          </span>

          <div className="flex bg-gray-100 rounded-full p-1 ml-4">
            {(['all', 'published', 'draft'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-300 ${statusFilter === filter
                  ? 'bg-white text-brand-dark shadow-sm'
                  : 'text-gray-500 hover:text-brand-dark'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none"
            />
          </div>
          <Button
            onClick={() => router.push('/dashboard/plans/new')}
            className="rounded-full shadow-lg shadow-brand-gold/20 flex px-6 text-white"
            size="md"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Plan
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">No plans found</h2>
          <p className="text-gray-400 max-w-sm">
            {searchTerm ? `No results for "${searchTerm}"` : "Get started by creating your first nutrition plan for a client."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => router.push('/dashboard/plans/new')}
              className="mt-6 rounded-full"
            >
              Create First Plan
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="p-2 pr-6 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 group rounded-[32px] border border-transparent hover:border-gray-100">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center shrink-0 text-gray-500 font-bold text-xl group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                {plan.clientName.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-brand-dark truncate group-hover:text-brand-gold transition-colors">{plan.clientName}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{/* Timestamp Handling */}
                    {plan.updatedAt ? (plan.updatedAt as any).toDate().toLocaleDateString() : 'Unknown date'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{plan.ingredients.length} items</span>
                </div>
              </div>

              {/* Status */}
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${plan.status === 'published'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
                }`}>
                {plan.status}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                <Link href={`/dashboard/plans/${plan.id}`}>
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-brand-gold/10 hover:text-brand-gold">
                    Edit
                  </Button>
                </Link>
                <PlanMenu
                  planId={plan.id}
                  clientName={plan.clientName}
                  shareToken={plan.shareToken || null}
                  onDelete={loadPlans}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
