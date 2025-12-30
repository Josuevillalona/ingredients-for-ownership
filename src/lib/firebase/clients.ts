import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { Client, CreateClientData } from '@/lib/types';

export class ClientService {
  private collectionName = 'clients';

  /**
   * Create a new client for a coach
   */
  async createClient(coachId: string, clientData: CreateClientData): Promise<string> {
    try {
      const clientRef = doc(collection(db, this.collectionName));
      const clientId = clientRef.id;

      const client: Omit<Client, 'id'> = {
        coachId,
        name: clientData.name.trim(),
        sessionNotes: clientData.sessionNotes?.trim() || '',
        goals: clientData.goals.filter(goal => goal.trim().length > 0),
        restrictions: clientData.restrictions.filter(restriction => restriction.trim().length > 0),
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now(),
      };

      // Only add email if it exists and is not empty
      if (clientData.email?.trim()) {
        (client as any).email = clientData.email.trim();
      }

      await setDoc(clientRef, client);
      return clientId;
    } catch (error: any) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  /**
   * Get all clients for a specific coach
   */
  async getClientsForCoach(coachId: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('coachId', '==', coachId),
        orderBy('lastUpdated', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
    } catch (error: any) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
  }

  /**
   * Get a specific client by ID (with coach ownership verification)
   */
  async getClient(clientId: string, coachId: string): Promise<Client | null> {
    try {
      const clientDoc = await getDoc(doc(db, this.collectionName, clientId));

      if (!clientDoc.exists()) {
        return null;
      }

      const clientData = clientDoc.data() as Omit<Client, 'id'>;

      // Verify coach ownership
      if (clientData.coachId !== coachId) {
        throw new Error('Access denied: Client belongs to different coach');
      }

      return {
        id: clientDoc.id,
        ...clientData
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch client: ${error.message}`);
    }
  }

  /**
   * Update client information
   */
  async updateClient(
    clientId: string,
    coachId: string,
    updates: Partial<CreateClientData>
  ): Promise<void> {
    try {
      // First verify ownership
      const existingClient = await this.getClient(clientId, coachId);
      if (!existingClient) {
        throw new Error('Client not found or access denied');
      }

      const updateData: Partial<Omit<Client, 'id'>> = {
        lastUpdated: Timestamp.now(),
      };

      if (updates.name?.trim()) {
        updateData.name = updates.name.trim();
      }

      if (updates.email !== undefined) {
        updateData.email = updates.email?.trim() || '';
      }

      if (updates.sessionNotes !== undefined) {
        updateData.sessionNotes = updates.sessionNotes?.trim() || '';
      }

      if (updates.goals) {
        updateData.goals = updates.goals.filter(goal => goal.trim().length > 0);
      }

      if (updates.restrictions) {
        updateData.restrictions = updates.restrictions.filter(restriction => restriction.trim().length > 0);
      }

      await updateDoc(doc(db, this.collectionName, clientId), updateData);
    } catch (error: any) {
      throw new Error(`Failed to update client: ${error.message}`);
    }
  }

  /**
   * Delete a client (with ownership verification)
   */
  async deleteClient(clientId: string, coachId: string): Promise<void> {
    try {
      // First verify ownership
      const existingClient = await this.getClient(clientId, coachId);
      if (!existingClient) {
        throw new Error('Client not found or access denied');
      }

      await deleteDoc(doc(db, this.collectionName, clientId));
    } catch (error: any) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }

  /**
   * Search clients by name for a specific coach
   */
  async searchClients(coachId: string, searchTerm: string): Promise<Client[]> {
    try {
      const allClients = await this.getClientsForCoach(coachId);

      if (!searchTerm.trim()) {
        return allClients;
      }

      const term = searchTerm.toLowerCase();
      return allClients.filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.goals.some(goal => goal.toLowerCase().includes(term))
      );
    } catch (error: any) {
      throw new Error(`Failed to search clients: ${error.message}`);
    }
  }
}

export const clientService = new ClientService();
