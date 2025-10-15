import { json } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import type { RequestHandler } from './$types';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'sfos-ba7a0'
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
