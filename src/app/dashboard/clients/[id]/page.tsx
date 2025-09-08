'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { clientService } from '@/lib/firebase/clients';
import type { Client } from '@/lib/types';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!user || !id) return;

      setIsLoading(true);
      setError(null);

      try {
        const clientData = await clientService.getClient(id as string, user.uid);
        setClient(clientData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [user, id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-brand-white rounded-xl p-12 shadow-sm border border-brand-gold/20 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-brand-dark/60 font-prompt">Loading client details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-brand-white rounded-xl p-12 shadow-sm border border-brand-gold/20 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="font-prompt font-bold text-xl text-brand-dark mb-4">
              Client Not Found
            </h2>
            <p className="text-brand-dark/60 mb-6">
              {error || 'The client you are looking for does not exist or you do not have access to it.'}
            </p>
            <Link href="/dashboard/clients">
              <Button variant="primary">
                Back to Clients
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/clients" className="text-brand-white/60 hover:text-brand-white">
                ← Back to Clients
              </Link>
              <h1 className="text-brand-white font-prompt font-bold text-2xl">
                {client.name}
              </h1>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="text-brand-white border-brand-white/30">
                Edit Client
              </Button>
              <Button variant="primary">
                Create Plan
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Client Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
              <h2 className="font-prompt font-bold text-xl text-brand-dark mb-4">
                Client Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark/60 mb-1">Full Name</label>
                  <p className="text-brand-dark font-prompt text-lg">{client.name}</p>
                </div>
                
                {client.email && (
                  <div>
                    <label className="block text-sm font-medium text-brand-dark/60 mb-1">Email</label>
                    <p className="text-brand-dark font-prompt">{client.email}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark/60 mb-1">Client Since</label>
                    <p className="text-brand-dark font-prompt text-sm">{formatDate(client.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark/60 mb-1">Last Updated</label>
                    <p className="text-brand-dark font-prompt text-sm">{formatDate(client.lastUpdated)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Notes */}
            {client.sessionNotes && (
              <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
                <h2 className="font-prompt font-bold text-xl text-brand-dark mb-4">
                  Session Notes
                </h2>
                <p className="text-brand-dark/80 whitespace-pre-wrap leading-relaxed">
                  {client.sessionNotes}
                </p>
              </div>
            )}

            {/* Plans Section (Placeholder) */}
            <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-prompt font-bold text-xl text-brand-dark">
                  Nutrition Plans
                </h2>
                <Button variant="primary" size="sm">
                  Create New Plan
                </Button>
              </div>
              
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-brand-cream rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-brand-gold text-2xl">📋</span>
                </div>
                <p className="text-brand-dark/60 font-prompt">
                  No nutrition plans created yet. Create the first plan to get started.
                </p>
              </div>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Goals */}
            <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
              <h3 className="font-prompt font-bold text-lg text-brand-dark mb-4">
                Health Goals
              </h3>
              
              {client.goals.length > 0 ? (
                <div className="space-y-3">
                  {client.goals.map((goal, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-brand-gold rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <p className="text-brand-dark/80 text-sm leading-relaxed">{goal}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-brand-dark/60 text-sm font-prompt">No goals specified</p>
              )}
            </div>

            {/* Restrictions */}
            <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
              <h3 className="font-prompt font-bold text-lg text-brand-dark mb-4">
                Dietary Restrictions
              </h3>
              
              {client.restrictions.length > 0 ? (
                <div className="space-y-2">
                  {client.restrictions.map((restriction, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm font-prompt mr-2 mb-2"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-brand-dark/60 text-sm font-prompt">No restrictions specified</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20">
              <h3 className="font-prompt font-bold text-lg text-brand-dark mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  📧 Send Email
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  📝 Add Session Notes
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  🎯 Update Goals
                </Button>
                <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200">
                  🗑️ Delete Client
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
