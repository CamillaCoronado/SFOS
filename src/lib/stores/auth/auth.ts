// src/lib/stores/auth.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: Date;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: '/default-avatar.jpg',
    bio: 'Full-stack developer passionate about civic tech.',
    joinedAt: new Date('2024-01-15')
  },
  {
    id: 'user2',
    username: 'sarah_chen',
    email: 'sarah@example.com',
    avatar: '/default-avatar.jpg',
    bio: 'UX designer focused on accessibility.',
    joinedAt: new Date('2024-02-10')
  },
  {
    id: 'user3',
    username: 'alex_rivera',
    email: 'alex@example.com',
    avatar: '/default-avatar.jpg',
    bio: 'Policy researcher and data analyst.',
    joinedAt: new Date('2024-01-20')
  }
];

// Current user store
export const currentUser = writable<User | null>(null);

// Load user from localStorage on init
if (browser) {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      // Convert joinedAt back to Date
      user.joinedAt = new Date(user.joinedAt);
      currentUser.set(user);
    } catch (e) {
      localStorage.removeItem('currentUser');
    }
  }
}

// Subscribe to changes and save to localStorage
if (browser) {
  currentUser.subscribe(user => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  });
}

export function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        resolve({ success: false, error: 'User not found' });
        return;
      }
      
      // Mock password check (password should be "password" for all users)
      if (password !== 'password') {
        resolve({ success: false, error: 'Invalid password' });
        return;
      }
      
      currentUser.set(user);
      resolve({ success: true });
    }, 500);
  });
}

export function register(username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if user already exists
      if (mockUsers.find(u => u.email === email)) {
        resolve({ success: false, error: 'Email already exists' });
        return;
      }
      
      if (mockUsers.find(u => u.username === username)) {
        resolve({ success: false, error: 'Username already taken' });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: `user${Date.now()}`,
        username,
        email,
        avatar: '/default-avatar.jpg',
        bio: '',
        joinedAt: new Date()
      };
      
      mockUsers.push(newUser);
      currentUser.set(newUser);
      resolve({ success: true });
    }, 500);
  });
}

export function logout(): void {
  currentUser.set(null);
}

export function updateProfile(updates: Partial<Omit<User, 'id' | 'joinedAt'>>): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser.update(user => {
        if (!user) return user;
        
        const updatedUser = { ...user, ...updates };
        
        // Update in mock database
        const index = mockUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          mockUsers[index] = updatedUser;
        }
        
        return updatedUser;
      });
      
      resolve({ success: true });
    }, 300);
  });
}

// Helper to get user by id (for displaying other users)
export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  let authenticated = false;
  currentUser.subscribe(user => {
    authenticated = !!user;
  })();
  return authenticated;
}