"use client";

import type { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import * as React from 'react';
import { auth } from '@/lib/firebase';
import type { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole | null; // SOLO ESTE CAMBIO
  signIn: (email: string, pass: string, asRole?: UserRole) => Promise<void>;
  signUp: (email: string, pass: string, asRole?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: UserRole) => void; // Allow manual role override for demo
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [role, setRoleState] = React.useState<UserRole | null>(null); // SOLO ESTE CAMBIO
  const { toast } = useToast();

  React.useEffect(() => {
    if (!auth || Object.keys(auth).length === 0) {
      console.warn("Auth service is not available. Skipping onAuthStateChanged listener.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // In a real app, fetch role from Firestore or custom claims
        const mockRole = localStorage.getItem('mockUserRole') as UserRole || 'new-hire';
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          role: mockRole, 
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(appUser);
        setRoleState(appUser.role);
      } else {
        setUser(null);
        setRoleState(null);
        localStorage.removeItem('mockUserRole');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, asRole: UserRole = 'new-hire') => {
    if (!auth || Object.keys(auth).length === 0) {
      toast({ title: "Authentication Error", description: "Firebase Auth is not configured.", variant: "destructive" });
      // Mock login for UI testing if Firebase isn't set up
      const mockUser: User = { id: 'mock-user', email, role: asRole };
      setUser(mockUser);
      setRoleState(asRole);
      localStorage.setItem('mockUserRole', asRole || ''); // Persist mock role
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // Role will be set by onAuthStateChanged, or set it explicitly here for demo
      localStorage.setItem('mockUserRole', asRole || ''); // Persist mock role for onAuthStateChanged
      setRoleState(asRole); // Set role immediately for UI update
      toast({ title: "Signed In", description: `Welcome back! You are signed in as ${asRole}.` });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Sign in error:", firebaseError);
      toast({ title: "Sign In Failed", description: firebaseError.message, variant: "destructive" });
      setUser(null);
      setRoleState(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, asRole: UserRole = 'new-hire') => {
     if (!auth || Object.keys(auth).length === 0) {
      toast({ title: "Authentication Error", description: "Firebase Auth is not configured.", variant: "destructive" });
       // Mock signup
      const mockUser: User = { id: 'mock-user-signup', email, role: asRole };
      setUser(mockUser);
      setRoleState(asRole);
      localStorage.setItem('mockUserRole', asRole || ''); // Ensure non-null value
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // Role will be set by onAuthStateChanged
      localStorage.setItem('mockUserRole', asRole || '');
      setRoleState(asRole);
      toast({ title: "Signed Up", description: "Account created successfully." });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Sign up error:", firebaseError);
      toast({ title: "Sign Up Failed", description: firebaseError.message, variant: "destructive" });
      setUser(null);
      setRoleState(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth || Object.keys(auth).length === 0) {
      // Mock signout
      setUser(null);
      setRoleState(null);
      localStorage.removeItem('mockUserRole');
      toast({ title: "Signed Out", description: "You have been signed out." });
      return;
    }
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      setRoleState(null);
      localStorage.removeItem('mockUserRole');
      toast({ title: "Signed Out", description: "You have been signed out successfully." });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Sign out error:", firebaseError);
      toast({ title: "Sign Out Failed", description: firebaseError.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  // Allow manual role override for demo purposes
  const setManualRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (user) {
      setUser({...user, role: newRole });
    }
    if (newRole) {
      localStorage.setItem('mockUserRole', newRole || ''); // Ensure non-null value
    } else {
      localStorage.removeItem('mockUserRole');
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, role, signIn, signUp, signOut, setRole: setManualRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
