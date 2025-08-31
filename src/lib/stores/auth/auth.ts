// src/lib/stores/auth.ts
import { writable, get } from 'svelte/store';
import { auth } from '$lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseAuthUser
} from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { User as AuthUser } from 'firebase/auth';
import { getEmailDomain, isGovernmentEmail } from '$lib/utils/gov';

// -------------------- Types --------------------
export type GovOrg = 'government' | 'private' | 'nonprofit' | 'education' | 'other';

export type GovInfo = {
  eligible: boolean;
  verified: boolean;
  showBadge: boolean;
  domain?: string;
  orgType?: GovOrg | null;
};

export type UserProfile = {
  uid: string;
  displayName?: string;
  email?: string;
  gov?: GovInfo; // optional on profile
};

export type AppUser = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: Date;
};
export type User = AppUser; // keep existing imports working

// -------------------- GOV helpers --------------------
export async function ensureGovFlags(user: AuthUser, orgType?: GovOrg) {
  const email = user.email ?? '';
  const domain = getEmailDomain(email);
  const eligible = !!email && isGovernmentEmail(email);
  const verified = eligible;

  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? (snap.data() as UserProfile) : null;
  const prev = existing?.gov;

  // final org type to store
  const org = (orgType ?? prev?.orgType ?? null) as GovOrg | null;
  const shouldDefaultShow = verified && org === 'government';

  // decide showBadge
  let showBadge: boolean;
  if (prev?.showBadge === undefined) {
    // first time writing the doc
    showBadge = shouldDefaultShow;
  } else if (prev.verified === false && verified && prev.showBadge === false && org === 'government') {
    // just became verified for the first time -> auto-enable
    showBadge = true;
  } else {
    // keep whatever the user had toggled
    showBadge = !!prev.showBadge;
  }

  await setDoc(ref, {
    uid: user.uid,
    email,
    gov: { eligible, verified, domain, orgType: org, showBadge }
  }, { merge: true });
}

export async function toggleGovBadge(uid: string, on: boolean) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { 'gov.showBadge': on });
}

// -------------------- Auth store --------------------
export const currentUser = writable<User | null>(null);

function mapFirebaseUser(firebaseUser: FirebaseAuthUser): User {
  return {
    id: firebaseUser.uid,
    username: firebaseUser.email?.split('@')[0] || 'user',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || undefined,
    bio: '',
    joinedAt: new Date(firebaseUser.metadata.creationTime || Date.now())
  };
}

// Keep store in sync + (optionally) refresh GOV flags
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    currentUser.set(mapFirebaseUser(firebaseUser));
    // Keep gov flags synced on session start
    try {
      await ensureGovFlags(firebaseUser);
    } catch (e) {
      console.warn('ensureGovFlags on auth state failed:', e);
    }
  } else {
    currentUser.set(null);
  }
});

// -------------------- API --------------------
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Sync gov flags after login
    await ensureGovFlags(cred.user);
    return { success: true };
  } catch (error: any) {
    console.error('login error:', error);
    return { success: false, error: error.message };
  }
}

// Optional orgType lets you default-show badge when user chose “government” at signup
export async function register(
  email: string,
  password: string,
  orgType?: GovOrg
): Promise<{ success: boolean; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await ensureGovFlags(cred.user, orgType);
    return { success: true };
  } catch (error: any) {
    console.log('Firebase error details:', { code: error.code, message: error.message, error });
    return { success: false, error: error.message };
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

// -------------------- Compatibility stubs --------------------
export async function updateProfile(
  _updates: Partial<Omit<User, 'id' | 'joinedAt'>>
): Promise<{ success: boolean; error?: string }> {
  // Implement if you add a Firestore-backed profile editor
  return { success: false, error: 'Not implemented' };
}

export function getUserById(_id: string): User | undefined {
  // Implement if you mirror profiles into Firestore
  return undefined;
}

export function isAuthenticated(): boolean {
  return !!get(currentUser);
}
