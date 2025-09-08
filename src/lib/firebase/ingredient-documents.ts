import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  writeBatch,
  DocumentReference,
  QuerySnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { 
  IngredientDocument, 
  IngredientSelection,
  isValidIngredientDocument,
  isValidIngredientSelection 
} from '@/lib/types/ingredient-document';
import { generateShareToken } from '@/lib/services/share-token';

/**
 * Firestore service for managing ingredient documents
 * Handles CRUD operations with proper coach isolation and security
 */
export class IngredientDocumentService {
  private readonly COLLECTION_NAME = 'ingredient-documents';

  /**
   * Create a new ingredient document
   * 
   * @param coachId - ID of the coach creating the document
   * @param data - Document data without metadata
   * @returns Promise resolving to the created document with ID
   */
  async createDocument(
    coachId: string,
    data: Omit<IngredientDocument, 'id' | 'coachId' | 'createdAt' | 'updatedAt' | 'shareToken'>
  ): Promise<IngredientDocument> {
    try {
      const shareToken = generateShareToken();
      const now = serverTimestamp();
      
      const documentData = {
        ...data,
        coachId,
        shareToken,
        createdAt: now,
        updatedAt: now,
      };

      console.log('Creating ingredient document with data:', {
        clientName: documentData.clientName,
        coachId: documentData.coachId,
        status: documentData.status,
        ingredientsCount: documentData.ingredients.length,
        shareToken: documentData.shareToken
      });
      
      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), documentData);
      console.log('✅ Document created with ID:', docRef.id);
      
      // Fetch the created document to get server timestamps converted to Timestamp objects
      const createdDoc = await this.getDocumentById(docRef.id);
      
      if (!createdDoc) {
        throw new Error('Failed to retrieve created document - document was created but retrieval failed');
      }
      
      console.log('✅ Document retrieved successfully with proper timestamps');
      return createdDoc;
      
    } catch (error) {
      console.error('❌ Error creating ingredient document:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw new Error(`Failed to create ingredient document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a document by ID (coach must own the document)
   * 
   * @param documentId - Document ID
   * @param coachId - Coach ID for ownership verification
   * @returns Promise resolving to the document or null if not found/unauthorized
   */
  async getDocument(documentId: string, coachId: string): Promise<IngredientDocument | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.log('Document not found:', documentId);
        return null;
      }
      
      const data = { id: docSnap.id, ...docSnap.data() } as IngredientDocument;
      
      // Verify coach ownership
      if (data.coachId !== coachId) {
        console.log('Access denied: Coach does not own document');
        return null;
      }
      
      if (!isValidIngredientDocument(data)) {
        console.error('Invalid document structure:', data);
        return null;
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Error getting document:', error);
      return null;
    }
  }

  /**
   * Get a document by ID without coach verification (internal use)
   * 
   * @param documentId - Document ID
   * @returns Promise resolving to the document or null if not found
   */
  async getDocumentById(documentId: string): Promise<IngredientDocument | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = { id: docSnap.id, ...docSnap.data() } as IngredientDocument;
      
      if (!isValidIngredientDocument(data)) {
        console.error('Invalid document structure:', data);
        return null;
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Error getting document by ID:', error);
      return null;
    }
  }

  /**
   * Get a document by share token (public access)
   * 
   * @param shareToken - Share token
   * @returns Promise resolving to the document or null if not found
   */
  async getDocumentByShareToken(shareToken: string): Promise<IngredientDocument | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('shareToken', '==', shareToken),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('Document not found for share token');
        return null;
      }
      
      const docSnap = querySnapshot.docs[0];
      const data = { id: docSnap.id, ...docSnap.data() } as IngredientDocument;
      
      if (!isValidIngredientDocument(data)) {
        console.error('Invalid document structure:', data);
        return null;
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Error getting document by share token:', error);
      return null;
    }
  }

  /**
   * Get all documents for a coach
   * 
   * @param coachId - Coach ID
   * @param limitCount - Maximum number of documents to return
   * @returns Promise resolving to array of documents
   */
  async getCoachDocuments(coachId: string, limitCount: number = 50): Promise<IngredientDocument[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('coachId', '==', coachId),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const documents: IngredientDocument[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() } as IngredientDocument;
        if (isValidIngredientDocument(data)) {
          documents.push(data);
        }
      });
      
      console.log(`📋 Retrieved ${documents.length} documents for coach ${coachId}`);
      return documents;
      
    } catch (error) {
      console.error('❌ Error getting coach documents:', error);
      return [];
    }
  }

  /**
   * Update an existing document
   * 
   * @param documentId - Document ID
   * @param coachId - Coach ID for ownership verification
   * @param updates - Partial document data to update
   * @returns Promise resolving to updated document or null if failed
   */
  async updateDocument(
    documentId: string,
    coachId: string,
    updates: Partial<Omit<IngredientDocument, 'id' | 'coachId' | 'createdAt' | 'shareToken'>>
  ): Promise<IngredientDocument | null> {
    try {
      // First verify ownership
      const existingDoc = await this.getDocument(documentId, coachId);
      if (!existingDoc) {
        console.log('Cannot update: Document not found or access denied');
        return null;
      }
      
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(docRef, updateData);
      
      // Return updated document
      return await this.getDocument(documentId, coachId);
      
    } catch (error) {
      console.error('❌ Error updating document:', error);
      return null;
    }
  }

  /**
   * Delete a document
   * 
   * @param documentId - Document ID
   * @param coachId - Coach ID for ownership verification
   * @returns Promise resolving to boolean indicating success
   */
  async deleteDocument(documentId: string, coachId: string): Promise<boolean> {
    try {
      // First verify ownership
      const existingDoc = await this.getDocument(documentId, coachId);
      if (!existingDoc) {
        console.log('Cannot delete: Document not found or access denied');
        return false;
      }
      
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      await deleteDoc(docRef);
      
      console.log('✅ Document deleted successfully:', documentId);
      return true;
      
    } catch (error) {
      console.error('❌ Error deleting document:', error);
      return false;
    }
  }

  /**
   * Regenerate share token for a document
   * 
   * @param documentId - Document ID
   * @param coachId - Coach ID for ownership verification
   * @returns Promise resolving to new share token or null if failed
   */
  async regenerateShareToken(documentId: string, coachId: string): Promise<string | null> {
    try {
      // First verify ownership
      const existingDoc = await this.getDocument(documentId, coachId);
      if (!existingDoc) {
        console.log('Cannot regenerate token: Document not found or access denied');
        return null;
      }
      
      const newToken = generateShareToken();
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      
      await updateDoc(docRef, {
        shareToken: newToken,
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ Share token regenerated successfully');
      return newToken;
      
    } catch (error) {
      console.error('❌ Error regenerating share token:', error);
      return null;
    }
  }

  /**
   * Search documents by client name or title
   * 
   * @param coachId - Coach ID
   * @param searchTerm - Search term
   * @param limitCount - Maximum results to return
   * @returns Promise resolving to matching documents
   */
  async searchDocuments(
    coachId: string, 
    searchTerm: string, 
    limitCount: number = 20
  ): Promise<IngredientDocument[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation that filters client-side
      // For production, consider using Algolia or similar service
      
      const allDocs = await this.getCoachDocuments(coachId, 100);
      const searchLower = searchTerm.toLowerCase();
      
      const filteredDocs = allDocs.filter(doc => 
        doc.clientName.toLowerCase().includes(searchLower)
      );
      
      return filteredDocs.slice(0, limitCount);
      
    } catch (error) {
      console.error('❌ Error searching documents:', error);
      return [];
    }
  }

  /**
   * Batch create multiple documents (useful for seeding)
   * 
   * @param coachId - Coach ID
   * @param documents - Array of document data
   * @returns Promise resolving to array of created document IDs
   */
  async batchCreateDocuments(
    coachId: string,
    documents: Array<Omit<IngredientDocument, 'id' | 'coachId' | 'createdAt' | 'updatedAt' | 'shareToken'>>
  ): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const docRefs: DocumentReference[] = [];
      const now = serverTimestamp();
      
      documents.forEach((docData) => {
        const docRef = doc(collection(db, this.COLLECTION_NAME));
        batch.set(docRef, {
          ...docData,
          coachId,
          shareToken: generateShareToken(),
          createdAt: now,
          updatedAt: now,
        });
        docRefs.push(docRef);
      });
      
      await batch.commit();
      
      const createdIds = docRefs.map(ref => ref.id);
      console.log(`✅ Batch created ${createdIds.length} documents`);
      
      return createdIds;
      
    } catch (error) {
      console.error('❌ Error batch creating documents:', error);
      throw new Error(`Failed to batch create documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update client tracking for a specific ingredient (public access via share token)
   * 
   * @param shareToken - Share token for document access
   * @param foodId - ID of the food item to update
   * @param clientChecked - New checked status
   * @returns Promise resolving to boolean indicating success
   */
  async updateClientTracking(
    shareToken: string,
    foodId: string,
    clientChecked: boolean
  ): Promise<boolean> {
    try {
      console.log('🔍 Updating client tracking:', { shareToken, foodId, clientChecked });

      // Get document by share token
      const document = await this.getDocumentByShareToken(shareToken);
      
      if (!document) {
        console.log('❌ Document not found for tracking update');
        return false;
      }

      if (document.status !== 'published') {
        console.log('❌ Cannot update tracking for unpublished document');
        return false;
      }

      // Find the ingredient to update
      const ingredientIndex = document.ingredients.findIndex(
        ingredient => ingredient.foodId === foodId
      );

      if (ingredientIndex === -1) {
        console.log('❌ Ingredient not found in document:', foodId);
        return false;
      }

      // Update the ingredient's clientChecked status
      const updatedIngredients = [...document.ingredients];
      updatedIngredients[ingredientIndex] = {
        ...updatedIngredients[ingredientIndex],
        clientChecked
      };

      // Update document in Firestore
      const docRef = doc(db, this.COLLECTION_NAME, document.id);
      await updateDoc(docRef, {
        ingredients: updatedIngredients,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Client tracking updated successfully');
      return true;

    } catch (error) {
      console.error('❌ Error updating client tracking:', error);
      return false;
    }
  }
}

// Export singleton instance
export const ingredientDocumentService = new IngredientDocumentService();
