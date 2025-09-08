'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="text-brand-white/60 hover:text-brand-white">
                ← Back
              </Link>
              <h1 className="text-brand-white font-prompt font-bold text-2xl">
                Nutrition Plans
              </h1>
            </div>
            
            <Button variant="primary">
              Create New Plan
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Empty State */}
        <div className="bg-brand-white rounded-xl p-12 shadow-sm border border-brand-gold/20 text-center">
          <div className="w-24 h-24 bg-brand-cream rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-brand-gold text-4xl">📋</span>
          </div>
          <h2 className="font-prompt font-bold text-2xl text-brand-dark mb-4">
            No Plans Created Yet
          </h2>
          <p className="text-brand-dark/60 mb-8 max-w-md mx-auto">
            Create your first nutrition plan to replace those time-consuming PDFs. 
            You'll be able to share interactive plans with your clients instantly.
          </p>
          <div className="space-y-4">
            <Button variant="primary" size="lg">
              Create Your First Plan
            </Button>
            <div className="text-sm text-brand-dark/60">
              or <Link href="/dashboard/clients" className="text-brand-gold hover:underline">add a client first</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
