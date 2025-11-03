'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/lib/firebase/auth';
import type { Coach } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  coach: Coach | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshCoachProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch coach profile when user signs in
        try {
          const coachProfile = await authService.getCoachProfile(firebaseUser.uid);
          setCoach(coachProfile);
        } catch (error) {
          console.error('Error fetching coach profile:', error);
          setCoach(null);
        }
      } else {
        setCoach(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
      // Auth state change will handle setting user and coach
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await authService.createCoach(email, password, name);
      // Sign in after successful registration
      await authService.signIn(email, password);
      // Auth state change will handle setting user and coach
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      // Auth state change will handle clearing user and coach
    } catch (error) {
      throw error;
    }
  };

  const refreshCoachProfile = async () => {
    if (user) {
      try {
        const coachProfile = await authService.getCoachProfile(user.uid);
        setCoach(coachProfile);
      } catch (error) {
        console.error('Error refreshing coach profile:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    coach,
    loading,
    signIn,
    signUp,
    signOut,
    refreshCoachProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
