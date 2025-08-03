
import { writable } from 'svelte/store';

type ProjectCategory = 'idea' | 'fleshed-out' | 'policy-proposal';

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    contributors: number;
    comments: number;
    avatars: string[];
    githubUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
    authorId: string;
    authorName: string;
    upvotes: number;
    downvotes: number;
    score: number;
    views: number; //can implement later
    imageUrl?: string;
    userVote?: 'up' | 'down' | null;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    timeCommitment: string;
    duration: string;
    contactMethod: 'discord' | 'email' | 'github' | 'other';
    contactInfo: string;
}

export const projects = writable<Project[]>([]);




