import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { clientService } from '@/lib/firebase/clients';
import type { Client, CreateClientData } from '@/lib/types';

interface UseClientsResult {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  createClient: (clientData: CreateClientData) => Promise<string>;
  updateClient: (clientId: string, updates: Partial<CreateClientData>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  searchClients: (searchTerm: string) => Promise<Client[]>;
  refetch: () => Promise<void>;
}

export function useClients(): UseClientsResult {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedClients = await clientService.getClientsForCoach(user.uid);
      setClients(fetchedClients);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createClient = async (clientData: CreateClientData): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const clientId = await clientService.createClient(user.uid, clientData);
      await fetchClients(); // Refresh the list
      return clientId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<CreateClientData>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await clientService.updateClient(clientId, user.uid, updates);
      await fetchClients(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteClient = async (clientId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      await clientService.deleteClient(clientId, user.uid);
      await fetchClients(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const searchClients = async (searchTerm: string): Promise<Client[]> => {
    if (!user) return [];

    try {
      return await clientService.searchClients(user.uid, searchTerm);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    searchClients,
    refetch: fetchClients,
  };
}
