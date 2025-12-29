'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Plus, Users, User, Trash2 } from 'lucide-react';
import { useClients } from '@/lib/hooks/useClients';
import Link from 'next/link';

export default function ClientsPage() {
  const router = useRouter();
  const { clients, isLoading, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (confirm(`Are you sure you want to delete ${clientName}? This action cannot be undone.`)) {
      try {
        await deleteClient(clientId);
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-prompt pb-24">
      {/* Pill Header */}
      <div className="bg-brand-white rounded-full shadow-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20 border border-white">
        <div className="flex items-center gap-4 w-full md:w-auto px-2">
          <div className="p-2 bg-brand-gold/10 rounded-full text-brand-gold">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-brand-dark">My Clients</h1>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-500 hidden md:inline-block">
            {clients.length}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-gold transition-colors" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none"
            />
          </div>
          <Button
            onClick={() => router.push('/dashboard/clients/new')}
            className="rounded-full shadow-lg shadow-brand-gold/20 flex px-6 text-white"
            size="md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">No clients found</h2>
          <p className="text-gray-400 max-w-sm">
            {searchTerm ? `No results for "${searchTerm}"` : "Start building your coaching practice by adding your first client."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => router.push('/dashboard/clients/new')}
              className="mt-6 rounded-full text-white"
              size="md"
            >
              Add Your First Client
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="p-2 pr-6 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 group rounded-[32px] border border-transparent hover:border-gray-100">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center shrink-0 text-gray-500 font-bold text-xl group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                {client.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-brand-dark truncate group-hover:text-brand-gold transition-colors">{client.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{client.email || 'No email'}</span>
                  {client.goals.length > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{client.goals[0]}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                <Link href={`/dashboard/clients/${client.id}`}>
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-brand-gold/10 hover:text-brand-gold">
                    View Profile
                  </Button>
                </Link>
                <button
                  onClick={() => handleDeleteClient(client.id, client.name)}
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
