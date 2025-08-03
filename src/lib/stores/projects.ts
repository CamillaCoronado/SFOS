
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

const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Code Review Tool',
    description: 'Building an intelligent code review system that uses machine learning to catch bugs and suggest improvements automatically.',
    tags: ['ai', 'machine-learning', 'dev-tools'],
    contributors: 5,
    comments: 12,
    avatars: [],
    githubUrl: 'https://github.com/example/code-review-ai',
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2025-07-20'),
    status: 'published',
    authorId: 'user1',
    authorName: 'Sarah Chen',
    upvotes: 24,
    downvotes: 3,
    score: 21,
    views: 156,
    userVote: null,
    experienceLevel: 'advanced',
    timeCommitment: '10-15 hours/week',
    duration: '3-4 months',
    contactMethod: 'discord',
    contactInfo: 'sarahc#1234'
  },
  {
    id: '2', 
    title: 'Local Food Waste Tracker',
    description: 'Mobile app to help restaurants and cafes track food waste and connect with local charities for donation pickup.',
    tags: ['mobile', 'sustainability', 'social-impact'],
    contributors: 3,
    comments: 8,
    avatars: [],
    createdAt: new Date('2025-07-18'),
    updatedAt: new Date('2025-07-18'),
    status: 'published',
    authorId: 'user2',
    authorName: 'Marcus Johnson',
    upvotes: 18,
    downvotes: 1,
    score: 17,
    views: 89,
    userVote: null,
    experienceLevel: 'intermediate',
    timeCommitment: '5-8 hours/week',
    duration: '2 months',
    contactMethod: 'email',
    contactInfo: 'marcus.j@email.com'
  },
  {
    id: '3',
    title: 'Open Source Design System',
    description: 'Creating a comprehensive design system with components, tokens, and guidelines for non-profit organizations.',
    tags: ['design', 'open-source', 'ui/ux'],
    contributors: 7,
    comments: 23,
    avatars: [],
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-07-22'),
    status: 'published',
    authorId: 'user3',
    authorName: 'Alex Rivera',
    upvotes: 32,
    downvotes: 2,
    score: 30,
    views: 234,
    userVote: null,
    experienceLevel: 'beginner',
    timeCommitment: '3-5 hours/week',
    duration: 'ongoing',
    contactMethod: 'github',
    contactInfo: 'github.com/alexr'
  }
];

export const projects = writable<Project[]>(dummyProjects);

//export const projects = writable<Project[]>([]);

export function addProject(projectData: Omit<Project, 'id' | 'contributors' | 'comments' | 'avatars' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'upvotes' | 'downvotes' | 'score' | 'views' | 'userVote' | 'status'>) {
  const project: Project = {
    ...projectData,
    id: crypto.randomUUID(),
    contributors: 1,
    comments: 0,
    avatars: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'published',
    authorId: 'temp-user', // mock for now
    authorName: 'Anonymous', // mock for now
    upvotes: 0,
    downvotes: 0,
    score: 0,
    views: 0,
    userVote: null
  };
  
  projects.update(current => [project, ...current]);
  return project.id;
}



