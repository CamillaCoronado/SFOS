// src/lib/stores/auth.ts (replace the whole file)
import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: Date;
  userType: 'civic-hacker' | 'government' | 'resident-org';
}

export const currentUser = writable<User | null>(null);

// map firebase user to your interface
function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    username: firebaseUser.email?.split('@')[0] || 'user',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || undefined,
    bio: '',
    joinedAt: new Date(firebaseUser.metadata.creationTime || Date.now())
  };
}

// listen for auth changes
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    currentUser.set(mapFirebaseUser(firebaseUser));
  } else {
    currentUser.set(null);
  }
});

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('attempting login with:', email);
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    console.error('full firebase error:', error); // debug
    return { success: false, error: error.message };
  }
}

export async function register(username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
     // TODO: later save username to firestore user profile
    return { success: true };
  } catch (error: any) {
    console.log('Firebase error details:');
    console.log('- code:', error.code);
    console.log('- message:', error.message);
    console.log('- full error:', error);
    return { success: false, error: error.message };
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

// keep these for compatibility (can implement later with firestore)
export async function updateProfile(updates: Partial<Omit<User, 'id' | 'joinedAt'>>): Promise<{ success: boolean; error?: string }> {
  // TODO: implement with firestore user profiles
  console.log('updateProfile not implemented yet');
  return { success: false, error: 'Not implemented' };
}

export function getUserById(id: string): User | undefined {
  // TODO: implement with firestore user profiles  
  return undefined;
}

export function isAuthenticated(): boolean {
  let authenticated = false;
  currentUser.subscribe(user => {
    authenticated = !!user;
  })();
  return authenticated;
}