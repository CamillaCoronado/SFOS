// src/lib/stores/firebase-projects.ts
import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
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
      console.error('User not authenticated');
      return;
    }

    // update in firestore
    const projectRef = doc(db, 'projects', projectId);
    
    // get current project data to calculate new score
    const currentProjects = get(projects);
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;

    await updateDoc(projectRef, {
      upvotes: project.upvotes + 1,
      score: project.score + 1,
      updatedAt: Timestamp.now()
    });

    // update local store immediately for better UX
    projects.update(current => 
      current.map(p => 
        p.id === projectId 
          ? { ...p, upvotes: p.upvotes + 1, score: p.score + 1 }
          : p
      )
    );
  } catch (error) {
    console.error('Error upvoting project:', error);
  }
}

export async function downvoteProject(projectId: string) {
  try {
    const user = get(currentUser);
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // update in firestore
    const projectRef = doc(db, 'projects', projectId);
    
    // get current project data to calculate new score
    const currentProjects = get(projects);
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;

    await updateDoc(projectRef, {
      downvotes: project.downvotes + 1,
      score: project.score - 1,
      updatedAt: Timestamp.now()
    });

    // update local store immediately for better UX
    projects.update(current => 
      current.map(p => 
        p.id === projectId 
          ? { ...p, downvotes: p.downvotes + 1, score: p.score - 1 }
          : p
      )
    );
  } catch (error) {
    console.error('Error downvoting project:', error);
  }
}