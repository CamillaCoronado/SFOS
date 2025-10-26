import { redirect, type Handle } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } from '$env/static/private';

// init admin (same as your session endpoint)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

export const handle: Handle = async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get('session');
  
  console.log('Hook running for:', event.url.pathname);
  console.log('Session cookie exists?', !!sessionCookie);
  
  if (sessionCookie) {
    try {
      const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true);
      event.locals.user = {
        uid: decodedClaims.uid,
        email: decodedClaims.email || null
      };
      console.log('User verified:', event.locals.user.email);
    } catch (err) {
      console.error('Session verification failed:', err);
      event.cookies.delete('session', { path: '/' });
    }
  }
  
  const protectedRoutes = ['/dashboard', '/create', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => 
    event.url.pathname.startsWith(route)
  );
  
  console.log('Is protected?', isProtectedRoute, 'Has user?', !!event.locals.user);
  
  if (isProtectedRoute && !event.locals.user) {
    throw redirect(302, `/auth?redirect=${encodeURIComponent(event.url.pathname)}`);
  }
  
  return resolve(event);
};