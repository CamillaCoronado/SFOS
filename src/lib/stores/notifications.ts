// Firestore-backed notifications store
import { writable, derived } from 'svelte/store';
import { serverTimestamp } from 'firebase/firestore'; 
import { db } from '../firebase';
import {
  collection, doc, onSnapshot, orderBy, query, limit, updateDoc, writeBatch, addDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

type Actor = { uid: string; name?: string; avatarUrl?: string };

export type Notification = {
  id: string;
  type: 'upvote' | 'comment' | 'reply' | 'mention' | 'system';
  message: string;
  projectId?: string;
  read: boolean;
  createdAt: any; // Firestore Timestamp
  actor?: Actor;
};

export const notifications = writable<Notification[]>([]);
export const unreadCount = derived(notifications, ($n) => $n.filter(n => !n.read).length);

let unsub: (() => void) | null = null;

export function listenToNotifications(uid: string, take: number = 50) {
  if (unsub) unsub();
  const ref = collection(db, 'users', uid, 'notifications');
  const qy = query(ref, orderBy('createdAt', 'desc'), limit(take));
  unsub = onSnapshot(qy, (snap) => {
    const items: Notification[] = [];
    snap.forEach((d) => items.push({ id: d.id, ...(d.data() as Omit<Notification, 'id'>) }));
    notifications.set(items);
  });
  return () => { unsub?.(); unsub = null; };
}

export async function markRead(uid: string, id: string) {
  await updateDoc(doc(db, 'users', uid, 'notifications', id), { read: true, readAt: serverTimestamp() });
}

export async function markAllRead(uid: string) {
  // batch the first 100 unread
  const batch = writeBatch(db);
  let count = 0;
  const unsubTmp = onSnapshot(
    query(collection(db, 'users', uid, 'notifications'), orderBy('createdAt', 'desc'), limit(100)),
    (snap) => {
      snap.forEach((d) => {
        const data = d.data() as Notification;
        if (!data.read && count < 100) {
          batch.update(d.ref, { read: true, readAt: serverTimestamp() });
          count++;
        }
      });
    }
  );
  await new Promise((r) => setTimeout(r, 50));
  unsubTmp();
  if (count > 0) await batch.commit();
}

// Optional helper to create a notification somewhere in your app:
export async function pushNotification(
  recipientUid: string,
  payload: { type: 'comment'|'reply'|'upvote'; projectId: string; message: string; actor?: Actor; }
) {
  const authUid = getAuth().currentUser?.uid; // must be Firebase auth UID
  if (!authUid) throw new Error('Not signed in');

  const ref = collection(db, 'users', recipientUid, 'notifications');
  await addDoc(ref, {
    recipientId: recipientUid,     // REQUIRED by rules
    createdBy: authUid,            // REQUIRED: must equal request.auth.uid
    type: payload.type,
    projectId: payload.projectId,
    message: payload.message,
    createdAt: serverTimestamp(),  // REQUIRED key
    read: false,
    ...(payload.actor ? { actor: payload.actor } : {})                    // REQUIRED: must be false on create
  });
}