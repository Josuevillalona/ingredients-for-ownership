'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { IngredientDocumentService } from '@/lib/firebase/ingredient-documents';
import type { IngredientDocument } from '@/lib/types';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, coach, signOut } = useAuth();
  const [plans, setPlans] = useState<IngredientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const ingredientDocumentService = new IngredientDocumentService();

  useEffect(() => {
    if (user) {
      loadPlans();
    }
  }, [user]);

  // Reload plans when window gains focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        loadPlans();
      }
    };

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
      setError('Failed to load plans. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      try {
        await ingredientDocumentService.deleteDocument(planId, user.uid);
        // Reload plans after deletion
        await loadPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Failed to delete plan. Please try again.');
      }
    }
  };

  // Filter plans based on search term
  const filteredPlans = plans.filter(plan =>
    plan.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    totalPlans: plans.length,
    publishedPlans: plans.filter(p => p.status === 'published').length,
    draftPlans: plans.filter(p => p.status === 'draft').length,
    recentActivity: plans.length > 0 ? 'Active' : 'No plans yet'
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-white font-prompt font-bold text-lg">I</span>
              </div>
              <div>
                <h1 className="text-brand-white font-prompt font-bold text-2xl">
                  Coach Dashboard
                </h1>
                {coach && (
                  <p className="text-brand-white/70 text-sm font-prompt">
                    Welcome back, {coach.name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/plans/create">
                <Button variant="primary">
                  Create New Plan
                </Button>
              </Link>
              <Link href="/dashboard/foods">
                <Button 
                  variant="secondary" 
                  className="text-brand-white border-brand-white/20 hover:bg-brand-white/10"
                >
                  Manage Foods
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button 
                  variant="secondary" 
                  className="text-brand-white border-brand-white/20 hover:bg-brand-white/10"
                >
                  Profile
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                onClick={handleSignOut}
                className="text-brand-white border-brand-white/20 hover:bg-brand-white/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
            <h3 className="font-prompt font-semibold text-brand-dark mb-2">Total Plans</h3>
            <p className="text-3xl font-prompt font-bold text-brand-gold">
              {isLoading ? '...' : stats.totalPlans}
            </p>
          </div>
          <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
            <h3 className="font-prompt font-semibold text-brand-dark mb-2">Published</h3>
            <p className="text-3xl font-prompt font-bold text-green-600">
              {isLoading ? '...' : stats.publishedPlans}
            </p>
          </div>
          <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
            <h3 className="font-prompt font-semibold text-brand-dark mb-2">Drafts</h3>
            <p className="text-3xl font-prompt font-bold text-yellow-600">
              {isLoading ? '...' : stats.draftPlans}
            </p>
          </div>
          <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
            <h3 className="font-prompt font-semibold text-brand-dark mb-2">Status</h3>
            <p className="text-lg font-prompt font-bold text-brand-gold">
              {isLoading ? 'Loading...' : stats.recentActivity}
            </p>
          </div>
        </div>

        {/* Plans Management */}
        <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gold/20">
          {/* Plans Header */}
          <div className="p-6 border-b border-brand-gold/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-prompt font-bold text-xl text-brand-dark">
                  Nutrition Plans ({filteredPlans.length})
                </h2>
                <p className="text-brand-dark/60 font-prompt text-sm">
                  Manage your client nutrition plans
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-brand-dark/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by client name..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-brand-gold/20 rounded-lg bg-brand-white
                               focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent
                               font-prompt text-brand-dark placeholder-brand-dark/40"
                  />
                </div>
                <Button onClick={loadPlans} variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Plans List */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <span className="text-brand-white font-prompt font-bold text-2xl">I</span>
                </div>
                <p className="text-brand-dark/60 font-prompt">Loading your plans...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-prompt font-bold text-2xl">!</span>
                </div>
                <h3 className="font-prompt font-bold text-xl text-brand-dark mb-2">
                  Error Loading Plans
                </h3>
                <p className="text-brand-dark/60 font-prompt mb-4">{error}</p>
                <Button onClick={loadPlans} variant="primary">
                  Try Again
                </Button>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-brand-gold text-2xl">📋</span>
                </div>
                <h3 className="font-prompt font-bold text-xl text-brand-dark mb-2">
                  {searchTerm ? 'No Plans Found' : 'No Plans Yet'}
                </h3>
                <p className="text-brand-dark/60 font-prompt mb-4">
                  {searchTerm 
                    ? `No plans found matching "${searchTerm}". Try a different search term.`
                    : 'Create your first nutrition plan to get started.'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/plans/create">
                    <Button variant="primary">
                      Create Your First Plan
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPlans.map((plan) => {
                  const selectedFoodsCount = plan.ingredients.filter(i => i.isSelected).length;
                  const totalFoodsCount = plan.ingredients.length;
                  
                  return (
                    <div
                      key={plan.id}
                      className="border border-brand-gold/20 rounded-lg p-4 hover:border-brand-gold hover:bg-brand-cream/30 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-prompt font-bold text-lg text-brand-dark">
                              {plan.clientName}'s Nutrition Plan
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-prompt font-medium ${
                              plan.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {plan.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-brand-dark/60 font-prompt">
                            <span>
                              Created: {plan.createdAt.toDate().toLocaleDateString()}
                            </span>
                            <span>
                              Updated: {plan.updatedAt.toDate().toLocaleDateString()}
                            </span>
                            <span>
                              Foods: {selectedFoodsCount} selected of {totalFoodsCount}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/plans/${plan.id}`}>
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/dashboard/plans/${plan.id}/edit`}>
                            <Button variant="primary" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => deletePlan(plan.id)}
                            className="text-red-600 hover:bg-red-50 border-red-200"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {!isLoading && filteredPlans.length > 0 && (
          <div className="mt-8 bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
            <h2 className="font-prompt font-bold text-xl text-brand-dark mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/dashboard/plans/create">
                <div className="p-4 border-2 border-dashed border-brand-gold/30 rounded-lg hover:border-brand-gold hover:bg-brand-cream/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-gold/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-brand-gold text-xl">�</span>
                    </div>
                    <h3 className="font-prompt font-medium text-brand-dark">Create New Plan</h3>
                    <p className="text-sm text-brand-dark/60 mt-1">Design a nutrition plan</p>
                  </div>
                </div>
              </Link>

              <div 
                onClick={() => {
                  const shareUrl = `${window.location.origin}/share/${filteredPlans[0]?.shareToken}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert('Latest plan share link copied to clipboard!');
                }}
                className="p-4 border-2 border-dashed border-brand-gold/30 rounded-lg hover:border-brand-gold hover:bg-brand-cream/50 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-brand-gold text-xl">🔗</span>
                  </div>
                  <h3 className="font-prompt font-medium text-brand-dark">Share Latest Plan</h3>
                  <p className="text-sm text-brand-dark/60 mt-1">Copy share link</p>
                </div>
              </div>

              <Link href="/dashboard/profile">
                <div className="p-4 border-2 border-dashed border-brand-gold/30 rounded-lg hover:border-brand-gold hover:bg-brand-cream/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-brand-gold/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-brand-gold text-xl">⚙️</span>
                    </div>
                    <h3 className="font-prompt font-medium text-brand-dark">Settings</h3>
                    <p className="text-sm text-brand-dark/60 mt-1">Manage your profile</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
