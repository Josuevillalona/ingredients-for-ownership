'use client';

import { PlanBuilder } from '@/components/plans/PlanBuilder';
import { useSearchParams } from 'next/navigation';

export default function NewPlanPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');

  const handlePlanCreated = (planId: string) => {
    // TODO: Redirect to plan details or plans list
    console.log('Plan created:', planId);
    // For now, just show success
    alert('Plan created successfully!');
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
              <span className="text-brand-white font-prompt font-bold text-lg">📋</span>
            </div>
            <div>
              <h1 className="text-brand-white font-prompt font-bold text-2xl">
                Create Nutrition Plan
              </h1>
              <p className="text-brand-white/80 text-sm">
                Build a comprehensive one-pager nutrition guide
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <PlanBuilder 
          selectedClientId={clientId || undefined}
          onPlanCreated={handlePlanCreated}
        />
      </main>
    </div>
  );
}
