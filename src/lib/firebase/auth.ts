import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { Coach } from '@/lib/types';

export class AuthService {
  /**
   * Sign in existing coach
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Create new coach account
   */
  async createCoach(email: string, password: string, name: string): Promise<void> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create coach profile in Firestore
      const coachData: Omit<Coach, 'id'> = {
        email,
        name,
        createdAt: Timestamp.now(),
        preferences: {
          colorCodingStyle: 'standard'
        }
      };

      await setDoc(doc(db, 'coaches', result.user.uid), coachData);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  /**
   * Get coach profile data
   */
  async getCoachProfile(userId: string): Promise<Coach | null> {
    try {
      const docRef = doc(db, 'coaches', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Coach;
      }
      return null;
    } catch (error) {
      console.error('Error fetching coach profile:', error);
      return null;
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Convert Firebase auth errors to user-friendly messages
   */
  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
