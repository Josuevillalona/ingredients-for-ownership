'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import type { IngredientDocument } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { PlanMenu } from '@/components/dashboard/PlanMenu';
import { Search, Plus, User, Activity, FileText, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, coach } = useAuth();
  const [plans, setPlans] = useState<IngredientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const ingredientDocumentService = new IngredientDocumentService();

  useEffect(() => {
    if (user) loadPlans();
  }, [user]);

  // Reload on focus
  useEffect(() => {
    const handleFocus = () => { if (user) loadPlans(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const loadPlans = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const documents = await ingredientDocumentService.getCoachDocuments(user.uid, 50);
      setPlans(documents);
    } catch (error) {
      console.error('Error loading plans:', error);
      setError('Failed to load plans.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalPlans: plans.length,
    publishedPlans: plans.filter(p => p.status === 'published').length,
    draftPlans: plans.filter(p => p.status === 'draft').length,
  };

  return (
    <div className="flex flex-col gap-8">

      {/* 1. TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-brand-dark mb-1">
            Dashboard
          </h1>
          <p className="text-brand-dark/50 text-sm font-light">
            Welcome back, {coach?.name || 'Coach'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Pill */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients..."
              className="bg-gray-50 rounded-full pl-10 pr-4 py-3 text-sm w-64 border border-gray-200 focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all placeholder:font-light"
            />
          </div>

          {/* Create Button Pill */}
          <Link href="/dashboard/plans/new">
            <button className="bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-lg shadow-brand-dark/20 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>New Plan</span>
            </button>
          </Link>

          {/* Avatar */}
          <Link href="/dashboard/profile">
            <div className="w-12 h-12 bg-gray-100 rounded-full border border-gray-200 shadow-sm overflow-hidden hover:border-brand-gold/20 transition-colors cursor-pointer flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Plans */}
        <div className="bg-brand-gold text-white rounded-[32px] p-6 relative overflow-hidden shadow-card group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-3xl mb-1">{isLoading ? '-' : stats.totalPlans}</h3>
            <p className="text-white/80 text-sm font-light">Total Nutrition Plans</p>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white border border-gray-200 rounded-[32px] p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              Active
            </span>
          </div>
          <h3 className="font-bold text-3xl text-brand-dark mb-1">{isLoading ? '-' : stats.publishedPlans}</h3>
          <p className="text-brand-dark/40 text-sm font-light">Published Plans</p>
        </div>

        {/* Drafts */}
        <div className="bg-white border border-gray-200 rounded-[32px] p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
              Work in Progress
            </span>
          </div>
          <h3 className="font-bold text-3xl text-brand-dark mb-1">{isLoading ? '-' : stats.draftPlans}</h3>
          <p className="text-brand-dark/40 text-sm font-light">Draft Plans</p>
        </div>
      </div>

      {/* 3. RECENT PLANS LIST */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-semibold text-brand-dark">Recent Activity</h2>
          <Link href="/dashboard/plans" className="text-sm text-brand-gold font-medium hover:underline">
            View All
          </Link>
        </div>

        <Card padding="none" className="overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="p-12 text-center text-brand-dark/40 font-light">Loading plans...</div>
          ) : filteredPlans.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-brand-dark/40 font-light mb-4">No plans found.</p>
              <Link href="/dashboard/plans/new">
                <Button variant="primary" size="sm" className="rounded-full">Create New Plan</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPlans.map((plan) => (
                <div key={plan.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 font-bold text-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                      {plan.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-dark">{plan.clientName}</h4>
                      <p className="text-xs text-brand-dark/40 font-light">
                        {plan.updatedAt ? (plan.updatedAt as any).toDate().toLocaleDateString() : 'Just now'} • {plan.ingredients.length} foods
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${plan.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                      {plan.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <Link href={`/dashboard/plans/${plan.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-brand-gold/10 text-brand-gold">
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
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
