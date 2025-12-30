'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { Client } from '@/lib/types';

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';

    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-brand-white rounded-xl p-6 shadow-sm border border-brand-gold/20 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-prompt font-semibold text-xl text-brand-dark mb-1">
            {client.name}
          </h3>
          {client.email && (
            <p className="text-brand-dark/60 text-sm font-prompt">
              {client.email}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(client)}
              className="text-brand-gold border-brand-gold/30 hover:bg-brand-gold/10"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(client)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Goals Preview */}
      {client.goals.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-brand-dark mb-2 font-prompt">Goals:</h4>
          <div className="space-y-1">
            {client.goals.slice(0, 2).map((goal, index) => (
              <div key={index} className="text-sm text-brand-dark/70 flex items-center">
                <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2 flex-shrink-0"></span>
                {goal}
              </div>
            ))}
            {client.goals.length > 2 && (
              <p className="text-xs text-brand-dark/50 font-prompt">
                +{client.goals.length - 2} more goals
              </p>
            )}
          </div>
        </div>
      )}

      {/* Restrictions Preview */}
      {client.restrictions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-brand-dark mb-2 font-prompt">Restrictions:</h4>
          <div className="flex flex-wrap gap-1">
            {client.restrictions.slice(0, 3).map((restriction, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs font-prompt"
              >
                {restriction}
              </span>
            ))}
            {client.restrictions.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-prompt">
                +{client.restrictions.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Session Notes Preview */}
      {client.sessionNotes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-brand-dark mb-1 font-prompt">Notes:</h4>
          <p className="text-sm text-brand-dark/70 line-clamp-2">
            {client.sessionNotes.length > 100
              ? `${client.sessionNotes.substring(0, 100)}...`
              : client.sessionNotes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-xs text-brand-dark/50 font-prompt">
          Created: {formatDate(client.createdAt)}
        </div>

        <Link href={`/dashboard/clients/${client.id}`}>
          <Button variant="primary" size="sm">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
