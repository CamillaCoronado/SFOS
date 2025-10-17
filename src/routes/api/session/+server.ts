import { json } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import type { RequestHandler } from './$types';
import { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } from '$env/static/private';

// console.log('env check:', {
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   has_key: !!process.env.FIREBASE_PRIVATE_KEY
// });

// console.log('SERVER ENV CHECK:', {
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   has_private_key: !!process.env.FIREBASE_PRIVATE_KEY
// });

if (!admin.apps.length) {
  admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { idToken } = await request.json();
  const expiresIn = 1000 * 60 * 60 * 24 * 5;

  const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });

  cookies.set('session', sessionCookie, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: expiresIn / 1000
  });

  return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete('session', { path: '/' });
  return json({ ok: true });
};
