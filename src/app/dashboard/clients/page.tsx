'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useClients } from '@/lib/hooks/useClients';
import { useAuth } from '@/lib/hooks/useAuth';
import { AddClientForm } from '@/components/forms/AddClientForm';
import { ClientCard } from '@/components/client/ClientCard';
import type { CreateClientData, Client } from '@/lib/types';

export default function ClientsPage() {
  const { clients, isLoading, error, createClient, deleteClient } = useClients();
  const { user, loading: authLoading } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClient = async (clientData: CreateClientData) => {
    setIsSubmitting(true);
    try {
      await createClient(clientData);
      setShowAddForm(false);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
      try {
        await deleteClient(client.id);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.goals.some(goal => goal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                My Clients
              </h1>
            </div>
            
            <Button 
              variant="primary"
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm}
            >
              Add New Client
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm font-prompt">
              Debug: showAddForm={showAddForm ? 'true' : 'false'}, isLoading={isLoading ? 'true' : 'false'}, 
              clients.length={clients.length}, error={error || 'none'}, 
              user={user ? 'authenticated' : 'not authenticated'}, authLoading={authLoading ? 'true' : 'false'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm font-prompt">{error}</p>
          </div>
        )}

        {/* Add Client Form */}
        {showAddForm && (
          <div className="mb-8">
            <h2 className="font-prompt font-bold text-xl text-brand-dark mb-4">
              Add New Client
            </h2>
            <AddClientForm
              onSubmit={handleAddClient}
              onCancel={() => setShowAddForm(false)}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && !showAddForm && (
          <div className="bg-brand-white rounded-xl p-12 shadow-sm border border-brand-gold/20 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-brand-dark/60 font-prompt">Loading your clients...</p>
          </div>
        )}

        {/* Clients List */}
        {!isLoading && !showAddForm && (
          <>
            {clients.length === 0 ? (
              /* Empty State */
              <div className="bg-brand-white rounded-xl p-12 shadow-sm border border-brand-gold/20 text-center">
                <div className="w-24 h-24 bg-brand-cream rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-brand-gold text-4xl">👥</span>
                </div>
                <h2 className="font-prompt font-bold text-2xl text-brand-dark mb-4">
                  No Clients Yet
                </h2>
                <p className="text-brand-dark/60 mb-8 max-w-md mx-auto">
                  Start building your coaching practice by adding your first client. 
                  You'll be able to create personalized nutrition plans for each client.
                </p>
                <div className="space-y-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => {
                      console.log('Add client button clicked');
                      setShowAddForm(true);
                    }}
                  >
                    Add Your First Client
                  </Button>
                  <div className="text-sm text-brand-dark/60">
                    or <Link href="/dashboard" className="text-brand-gold hover:underline">return to dashboard</Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Clients Grid */
              <>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="max-w-md">
                    <input
                      type="text"
                      placeholder="Search clients by name, email, or goals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-focus focus:border-transparent font-prompt"
                    />
                  </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-brand-dark/60 font-prompt">
                    {filteredClients.length} of {clients.length} clients
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>

                {/* Clients Grid */}
                {filteredClients.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                      <ClientCard
                        key={client.id}
                        client={client}
                        onDelete={handleDeleteClient}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-brand-white rounded-xl p-8 shadow-sm border border-brand-gold/20 text-center">
                    <p className="text-brand-dark/60 font-prompt">
                      No clients found matching "{searchTerm}"
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
