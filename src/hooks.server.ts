import { redirect, type Handle } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { currentUser } from '$lib/stores/auth/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const protectedRoutes = ['/dashboard', '/create'];
  const isProtectedRoute = protectedRoutes.some(route => 
    event.url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !get(currentUser)) {
    throw redirect(302, `/auth?redirect=${encodeURIComponent(event.url.pathname)}`);
  }
  
  return resolve(event);
};