// src/lib/stores/firebase-projects.ts
import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { currentUser } from '$lib/stores/auth/auth';
import { get } from 'svelte/store';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  updateDoc, 
  doc,
  Timestamp
} from 'firebase/firestore';

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
}

export const projects = writable<Project[]>([]);
export type VoteType = 'up' | 'down' | null;

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
    const user = get(currentUser);
    if (!user) {
      console.error('user not authenticated');
      return;
    }

    const currentProjects = get(projects);
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;

    const existingVote = await getUserVote(user.id, projectId);
    const projectRef = doc(db, 'projects', projectId);

    if (existingVote === 'up') {
      // already upvoted, do nothing
      return;
    } else if (existingVote === 'down') {
      // switch from down to up
      await updateDoc(projectRef, {
        upvotes: project.upvotes + 1,
        downvotes: project.downvotes - 1,
        score: project.score + 2, // +1 for removing down, +1 for adding up
        updatedAt: Timestamp.now()
      });
      await setUserVote(user.id, projectId, 'up');
      
      projects.update(current => 
        current.map(p => 
          p.id === projectId 
            ? { ...p, upvotes: p.upvotes + 1, downvotes: p.downvotes - 1, score: p.score + 2 }
            : p
        )
      );
    } else {
      // add new upvote
      await updateDoc(projectRef, {
        upvotes: project.upvotes + 1,
        score: project.score + 1,
        updatedAt: Timestamp.now()
      });
      await setUserVote(user.id, projectId, 'up');
      
      projects.update(current => 
        current.map(p => 
          p.id === projectId 
            ? { ...p, upvotes: p.upvotes + 1, score: p.score + 1 }
            : p
        )
      );
    }
  } catch (error) {
    console.error('error upvoting project:', error);
  }
}

export async function downvoteProject(projectId: string) {
  try {
    const user = get(currentUser);
    if (!user) {
      console.error('user not authenticated');
      return;
    }

    const currentProjects = get(projects);
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;

    const existingVote = await getUserVote(user.id, projectId);
    const projectRef = doc(db, 'projects', projectId);

    if (existingVote === 'down') {
      // already downvoted, do nothing
      return;
    } else if (existingVote === 'up') {
      // switch from up to down
      await updateDoc(projectRef, {
        upvotes: project.upvotes - 1,
        downvotes: project.downvotes + 1,
        score: project.score - 2, // -1 for removing up, -1 for adding down
        updatedAt: Timestamp.now()
      });
      await setUserVote(user.id, projectId, 'down');
      
      projects.update(current => 
        current.map(p => 
          p.id === projectId 
            ? { ...p, upvotes: p.upvotes - 1, downvotes: p.downvotes + 1, score: p.score - 2 }
            : p
        )
      );
    } else {
      // add new downvote
      await updateDoc(projectRef, {
        downvotes: project.downvotes + 1,
        score: project.score - 1,
        updatedAt: Timestamp.now()
      });
      await setUserVote(user.id, projectId, 'down');
      
      projects.update(current => 
        current.map(p => 
          p.id === projectId 
            ? { ...p, downvotes: p.downvotes + 1, score: p.score - 1 }
            : p
        )
      );
    }
  } catch (error) {
    console.error('error downvoting project:', error);
  }
}

async function getUserVote(userId: string, projectId: string): Promise<VoteType | null> {
  const voteRef = doc(db, 'userVotes', `${userId}_${projectId}`);
  const voteSnap = await getDoc(voteRef);
  return voteSnap.exists() ? voteSnap.data().voteType : null;
}

// update or create user vote record
async function setUserVote(userId: string, projectId: string, voteType: VoteType) {
  const voteRef = doc(db, 'userVotes', `${userId}_${projectId}`);
  await setDoc(voteRef, {
    userId,
    projectId,
    voteType,
    timestamp: Timestamp.now()
  });
}

// remove user vote record
async function removeUserVote(userId: string, projectId: string) {
  const voteRef = doc(db, 'userVotes', `${userId}_${projectId}`);
  await deleteDoc(voteRef);
}

export async function getCurrentUserVote(projectId: string): Promise<VoteType | null> {
  const user = get(currentUser);
  if (!user) return null;
  return getUserVote(user.id, projectId);
}