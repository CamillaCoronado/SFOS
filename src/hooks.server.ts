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
  // verify session cookie
  const sessionCookie = event.cookies.get('session');
  
  if (sessionCookie) {
    try {
      const decodedClaims = await getAuth().verifySessionCookie(sessionCookie, true);
      event.locals.user = {
        uid: decodedClaims.uid,
        email: decodedClaims.email || null
      };
    } catch (err) {
      // invalid/expired cookie
      event.cookies.delete('session', { path: '/' });
    }
  }
  
  // check protected routes
  const protectedRoutes = ['/dashboard', '/create'];
  const isProtectedRoute = protectedRoutes.some(route => 
    event.url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !event.locals.user) {
    throw redirect(302, `/auth?redirect=${encodeURIComponent(event.url.pathname)}`);
  }
  
  return resolve(event);
};