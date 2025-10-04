import { auth } from './firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the Firebase ID token (JWT)
    const idToken = await user.getIdToken();
    
    console.log('User signed in:', user.uid);
    return { user, idToken };
  } catch (error) {
    console.error('Sign in error:', error.message);
    throw error;
  }
};

// Sign up with email and password
export const signUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the Firebase ID token (JWT)
    const idToken = await user.getIdToken();
    
    // Create user in your backend database
    await createUserInBackend(user.uid, email, username, idToken);
    
    console.log('User created:', user.uid);
    return { user, idToken };
  } catch (error) {
    console.error('Sign up error:', error.message);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Get the Firebase ID token (JWT)
    const idToken = await user.getIdToken();
    
    console.log('User signed in with Google:', user.uid);
    return { user, idToken };
  } catch (error) {
    console.error('Google sign in error:', error.message);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Sign out error:', error.message);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, get fresh token
      const idToken = await user.getIdToken();
      callback({ user, idToken });
    } else {
      // User is signed out
      callback(null);
    }
  });
};

// Helper function to create user in your Spring Boot backend
const createUserInBackend = async (firebaseUid, email, username, idToken) => {
  try {
    const response = await fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}` // Send JWT token
      },
      body: JSON.stringify({
        firebaseUid,
        email,
        username
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user in backend');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Backend user creation error:', error);
    throw error;
  }
};

// Helper function to get current user's token
export const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};
