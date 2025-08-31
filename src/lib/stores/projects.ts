// src/lib/stores/firebase-projects.ts
import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { currentUser } from './auth/auth';
import { get } from 'svelte/store';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  updateDoc, 
  doc,
  Timestamp,
  serverTimestamp,
  where,
  onSnapshot,
  increment
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Needs } from '$lib/components/NeedsEditor.svelte';

type ProjectCategory = 'idea' | 'fleshed-out' | 'policy-proposal';

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    comments: number;
    avatars: string[];
    githubUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
    authorId: string;
    authorName: string;
    authorType: 'civic-hacker' | 'government' | 'resident-org';
    upvotes: number;
    downvotes: number;
    score: number;
    views: number;
    imageUrl?: string;
    userVote?: 'up' | 'down' | null;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    timeCommitment: string;
    duration: string;
    contactMethod: 'discord' | 'email' | 'github' | 'other';
    contactInfo: string;
    needs?: Needs | null;
}

export const projects = writable<Project[]>([]);
export type VoteType = 'up' | 'down' | null;
const toNum = (v: VoteType) => v === 'up' ? 1 : v === 'down' ? -1 : 0;


// load projects from firestore
export async function loadProjects() {
  try {
    const q = query(collection(db, 'projects'), orderBy('score', 'desc'));
    const snapshot = await getDocs(q);
    const projectsData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // convert firestore timestamps back to dates
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }) as Project[];
    
    projects.set(projectsData);
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

export async function addProject(projectData: Omit<Project, 'id' | 'comments' | 'avatars' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'upvotes' | 'downvotes' | 'score' | 'views' | 'userVote' | 'status' | 'authorType'> & { authorType: string }) {
  try {
    const user = get(currentUser);
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    const project = {
      ...projectData,
      comments: 0,
      avatars: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'published',
      authorId: user.id,
      authorName: user.username,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      views: 0,
      userVote: null,
      githubUrl: projectData.githubUrl || null, // ← Convert undefined to null
      imageUrl: projectData.imageUrl || null,
      needs: projectData.needs ?? null,
    };
    
    const docRef = await addDoc(collection(db, 'projects'), project);
    await loadProjects(); // refresh the store
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    return null;
  }
}

export async function upvoteProject(projectId: string) {
  try {
    const uid = getAuth().currentUser?.uid;
    if (!uid) { console.error('user not authenticated'); return; }

    const list = get(projects);
    const project = list.find(p => p.id === projectId);
    if (!project) return;

    const projectRef = doc(db, 'projects', projectId);
    const existing = await getUserVote(uid, projectId);

    console.log('auth uid:', getAuth().currentUser?.uid);
    console.log('project id:', projectId);

    if (existing === 'up') return;

    if (existing === 'down') {
      await updateDoc(projectRef, {
        upvotes: project.upvotes + 1,
        downvotes: project.downvotes - 1,
        score: project.score + 2,
        updatedAt: serverTimestamp()
      });
      await setUserVote(uid, projectId, 'up');

      projects.update(cur => cur.map(p =>
        p.id === projectId
          ? { ...p, upvotes: p.upvotes + 1, downvotes: p.downvotes - 1, score: p.score + 2 }
          : p
      ));
    } else {
      await updateDoc(projectRef, {
        upvotes: project.upvotes + 1,
        score: project.score + 1,
        updatedAt: serverTimestamp()
      });
      await setUserVote(uid, projectId, 'up');

      projects.update(cur => cur.map(p =>
        p.id === projectId
          ? { ...p, upvotes: p.upvotes + 1, score: p.score + 1 }
          : p
      ));
    }
  } catch (err) {
    console.error('error upvoting project:', err);
  }
}

export async function downvoteProject(projectId: string) {
  try {
    const uid = getAuth().currentUser?.uid;
    if (!uid) { console.error('user not authenticated'); return; }

    const list = get(projects);
    const project = list.find(p => p.id === projectId);
    if (!project) return;

    const projectRef = doc(db, 'projects', projectId);
    const existing = await getUserVote(uid, projectId);

    if (existing === 'down') return;

    if (existing === 'up') {
      await updateDoc(projectRef, {
        upvotes: project.upvotes - 1,
        downvotes: project.downvotes + 1,
        score: project.score - 2,
        updatedAt: serverTimestamp()
      });
     
      await setUserVote(uid, projectId, 'down');

      projects.update(cur => cur.map(p =>
        p.id === projectId
          ? { ...p, upvotes: p.upvotes - 1, downvotes: p.downvotes + 1, score: p.score - 2 }
          : p
      ));
    } else {
      await updateDoc(projectRef, {
        downvotes: project.downvotes + 1,
        score: project.score - 1,
        updatedAt: serverTimestamp()
      });

      await setUserVote(uid, projectId, 'down');

      projects.update(cur => cur.map(p =>
        p.id === projectId
          ? { ...p, downvotes: p.downvotes + 1, score: p.score - 1 }
          : p
      ));
    }
  } catch (err) {
    console.error('error downvoting project:', err);
  }
}

async function getUserVote(uid: string, projectId: string): Promise<VoteType | null> {
  const ref = doc(db, 'projects', projectId, 'votes', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const n = snap.data().value as -1 | 0 | 1;
  return n === 1 ? 'up' : n === -1 ? 'down' : null;
}

async function setUserVote(uid: string, projectId: string, voteType: VoteType) {
  const ref = doc(db, 'projects', projectId, 'votes', uid);
  await setDoc(ref, { value: toNum(voteType) });
}

async function removeUserVote(uid: string, projectId: string) {
  const ref = doc(db, 'projects', projectId, 'votes', uid);
  await deleteDoc(ref);
}

export async function getCurrentUserVote(projectId: string): Promise<VoteType | null> {
  const uid = getAuth().currentUser?.uid;
  if (!uid) return null;
  return getUserVote(uid, projectId);
}

export type Comment = {
  id?: string;
  text: string;
  authorId: string;
  authorName?: string | null;
  createdAt?: any;     // Firestore timestamp
  editedAt?: any | null;
  replyTo?: string | null;   // parent commentId for threads
  pinned?: boolean;
  status?: "open" | "resolved";
};

export const commentsCollection = (projectId: string) =>
  collection(db, "projects", projectId, "comments");

// Create
export async function addComment(
  projectId: string,
  data: Omit<Comment, "id" | "createdAt" | "editedAt" | "pinned" | "status">
) {
  const payload: Comment = {
    text: data.text.trim(),
    authorId: data.authorId,
    authorName: data.authorName ?? null,
    replyTo: data.replyTo ?? null,
    pinned: false,
    status: "open",
    createdAt: serverTimestamp(),
    editedAt: null
  };
  if (!payload.text) return;
  await addDoc(commentsCollection(projectId), payload as any);
  // increment project comment count only for top-level comments
  if (!payload.replyTo) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        comments: increment(1),
        updatedAt: serverTimestamp()
      });
      projects.update(current =>
        current.map(p =>
          p.id === projectId ? { ...p, comments: (p.comments ?? 0) + 1 } : p
        )
      );
    } catch {}
  }
}

// Update (edit text)
export async function editComment(projectId: string, commentId: string, newText: string) {
  const ref = doc(db, "projects", projectId, "comments", commentId);
  await updateDoc(ref, { text: newText.trim(), editedAt: serverTimestamp() });
}

// Delete
export async function deleteComment(projectId: string, commentId: string) {
  const ref = doc(db, "projects", projectId, "comments", commentId);
  // check if the comment is top-level before deleting
  const snap = await getDoc(ref);
  const isTopLevel = snap.exists() ? (snap.data()?.replyTo ?? null) === null : false;
  await deleteDoc(ref);
  if (isTopLevel) {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        comments: increment(-1),
        updatedAt: serverTimestamp()
      });
      projects.update(current =>
        current.map(p =>
          p.id === projectId ? { ...p, comments: Math.max(0, (p.comments ?? 0) - 1) } : p
        )
      );
    } catch {}
  }
}

// Pin / Unpin
export async function setPinned(projectId: string, commentId: string, pinned: boolean) {
  const ref = doc(db, "projects", projectId, "comments", commentId);
  await updateDoc(ref, { pinned });
}

// Set status ("open" | "resolved")
export async function setStatus(projectId: string, commentId: string, status: "open" | "resolved") {
  const ref = doc(db, "projects", projectId, "comments", commentId);
  await updateDoc(ref, { status });
}

// Listen: top-level comments (no replyTo)
export function listenToComments(projectId: string, cb: (rows: Comment[]) => void) {
  const q = query(
    commentsCollection(projectId),
    where("replyTo", "==", null),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)))
  );
}

// Listen: replies for a given parent comment
export function listenToReplies(projectId: string, parentId: string, cb: (rows: Comment[]) => void) {
  const q = query(
    commentsCollection(projectId),
    where("replyTo", "==", parentId),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)))
  );
}