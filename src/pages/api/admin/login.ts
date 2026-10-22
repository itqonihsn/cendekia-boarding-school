import type { APIRoute } from 'astro';
import { createSessionCookie, verifyLogin } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const username = String(form.get('username') || '').trim();
  const password = String(form.get('password') || '');

  const user = verifyLogin(username, password);
  if (!user) {
    return redirect('/admin/login?error=Username%20atau%20password%20salah.');
  }

  createSessionCookie(cookies, user.id, user.username);
  return redirect('/admin');
};
