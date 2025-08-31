import { readable, type Readable } from 'svelte/store';
import { db } from '$lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '$lib/stores/auth/auth';

const cache = new Map<string, Readable<UserProfile | null>>();

export function userProfileStore(uid: string): Readable<UserProfile | null> {
  if (!uid) return readable<UserProfile | null>(null, () => {});
  if (cache.has(uid)) return cache.get(uid)!;

  const store = readable<UserProfile | null>(null, (set) => {
    const ref = doc(db, 'users', uid);
    const unsub = onSnapshot(ref, (snap) => set(snap.exists() ? (snap.data() as UserProfile) : null));
    return () => unsub();
  });

  cache.set(uid, store);
  return store;
}
