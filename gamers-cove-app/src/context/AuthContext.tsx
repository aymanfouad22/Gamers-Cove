import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { httpPublic, httpAuth } from '@/lib/http';

interface LoginResponse {
  token: string;
  needsUsername?: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<LoginResponse>;
  signOut: () => Promise<void>;
  needsUsername: boolean;
  setNeedsUsername: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsUsername, setNeedsUsername] = useState(false);

  const exchangeToken = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      console.log('=== TOKEN EXCHANGE START ===');
      const idToken = await firebaseUser.getIdToken();
      console.log('Firebase ID Token obtained');
      
      // First, try to exchange the Firebase token for a backend JWT
      console.log('Exchanging Firebase token for backend JWT...');
      const { data } = await httpPublic.post<{ token: string; needsUsername?: boolean }>(
        '/auth/login',
        { idToken }
      );
      
      console.log('Backend login response:', { hasToken: !!data?.token, needsUsername: data?.needsUsername });
      
      // If we get a token, store it
      if (data?.token) {
        console.log('Saving JWT to localStorage with key: backend_jwt');
        localStorage.setItem('backend_jwt', data.token);
        
        // Check if the user needs to set a username
        if (data.needsUsername) {
          console.log('User needs to set a username');
          setNeedsUsername(true);
          return data;
        }
        
        // If no username is needed, try to fetch the user profile
        try {
          const { data: userProfile } = await httpAuth.get<{ username?: string }>('/users/me');
          setNeedsUsername(!userProfile?.username);
        } catch (profileError) {
          console.warn('Could not fetch user profile, assuming username is needed');
          setNeedsUsername(true);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error in token exchange:', error);
      // Clear any invalid token
      localStorage.removeItem('backend_jwt');
      throw error;
    }
  }, []);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed, user:', user ? 'Logged in' : 'Not logged in');
      if (user) {
        console.log('User is signed in, exchanging tokens...');
        setUser(user);
        try {
          // Exchange Firebase token for backend JWT
          await exchangeToken(user);
          console.log('Token exchange successful');
        } catch (error) {
          console.error('Auth state change - could not exchange token:', error);
          // Don't log out the user if token exchange fails
          // This allows the app to work in read-only mode
        }
      } else {
        // User signed out
        setUser(null);
        setNeedsUsername(false);
        localStorage.removeItem('backend_jwt');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [exchangeToken]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const response = await exchangeToken(result.user);
      if (response?.needsUsername) {
        setNeedsUsername(true);
      }
      return response;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [exchangeToken]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      localStorage.removeItem('backend_jwt');
      setNeedsUsername(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    needsUsername,
    setNeedsUsername,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
