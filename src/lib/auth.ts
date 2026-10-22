import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { AstroCookies } from 'astro';
import { getDb } from './db';

const COOKIE_NAME = 'cbs_admin_session';
const SESSION_DAYS = 7;

type SessionPayload = {
  uid: number;
  username: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (import.meta.env.PROD) {
      throw new Error('SESSION_SECRET must be set in production (min 16 chars).');
    }
    return 'dev-only-session-secret-change-me';
  }
  return secret;
}

function sign(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token: string): SessionPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionCookie(cookies: AstroCookies, userId: number, username: string) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const token = sign({ uid: userId, username, exp });
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  cookies.delete(COOKIE_NAME, { path: '/' });
}

export function getSession(cookies: AstroCookies): SessionPayload | null {
  const token = cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verify(token);
}

export function verifyLogin(username: string, password: string): { id: number; username: string } | null {
  const db = getDb();
  const row = db.prepare(`SELECT id, username, password_hash FROM users WHERE username = ?`).get(username) as
    | { id: number; username: string; password_hash: string }
    | undefined;
  if (!row) return null;
  if (!bcrypt.compareSync(password, row.password_hash)) return null;
  return { id: row.id, username: row.username };
}

export function requireSession(cookies: AstroCookies): SessionPayload {
  const session = getSession(cookies);
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}
