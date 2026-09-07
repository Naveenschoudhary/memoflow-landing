'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSession,
  safeEqual,
  safeNext,
} from './session';

export type SignInState = {
  error: string | null;
  /** Echoed back so a failed attempt does not make the user retype it. */
  username?: string;
  /** Bumped per attempt; the form uses it to remount the prefilled field. */
  attempt?: number;
};

/**
 * Throttle, keyed by client IP.
 *
 * In-memory on purpose. A shared store would be the rigorous answer, but this
 * dashboard has one user and adding Redis for it is not a trade worth making.
 * The honest limitation: each serverless instance keeps its own counter, so
 * the effective limit is per-instance rather than global. It still turns an
 * online password guess from thousands of tries a minute into a handful,
 * which is the attack this is for.
 */
const ATTEMPT_LIMIT = 8;
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return { allowed: true, retryInMinutes: 0 };
  }

  record.count += 1;
  if (record.count > ATTEMPT_LIMIT) {
    return {
      allowed: false,
      retryInMinutes: Math.max(1, Math.ceil((record.resetAt - now) / 60000)),
    };
  }
  return { allowed: true, retryInMinutes: 0 };
}

/** Successful sign-in clears the counter so a typo does not linger. */
function clearRateLimit(key: string) {
  attempts.delete(key);
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const user = process.env.SUPERADMIN_USER;
  const password = process.env.SUPERADMIN_PASSWORD;

  const attempt = (_prev.attempt ?? 0) + 1;
  const typedUsername = String(formData.get('username') ?? '');
  const fail = (error: string): SignInState => ({ error, username: typedUsername, attempt });

  if (!user || !password) {
    return fail('Superadmin is not configured on this deployment.');
  }

  const headerList = await headers();
  // x-forwarded-for is the client IP on Vercel; the first entry is the client,
  // the rest are proxies. Falls back to a constant so a missing header means
  // one shared bucket rather than no limit at all.
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return fail(
      `Too many attempts. Try again in ${limit.retryInMinutes} minute${
        limit.retryInMinutes === 1 ? '' : 's'
      }.`
    );
  }

  const suppliedUser = typedUsername;
  const suppliedPassword = String(formData.get('password') ?? '');
  const next = safeNext(String(formData.get('next') ?? ''));

  // Both compared every time — never short-circuit on the username, or the
  // response time reveals whether a guessed username exists.
  const [userOk, passwordOk] = await Promise.all([
    safeEqual(suppliedUser, user),
    safeEqual(suppliedPassword, password),
  ]);

  if (!userOk || !passwordOk) {
    // One message for both cases: saying which half was wrong would confirm a
    // valid username to someone guessing.
    return fail('Incorrect username or password.');
  }

  clearRateLimit(ip);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSession(user, password), {
    httpOnly: true,
    // Off on localhost, or the browser would refuse the cookie over plain http.
    secure: process.env.NODE_ENV === 'production',
    // 'lax' still sends the cookie on the top-level navigation that follows
    // sign-in, while keeping it off cross-site POSTs.
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  // Outside the checks above: redirect() signals by throwing, so it must not
  // sit inside a try/catch that would swallow it.
  redirect(next);
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/superadmin/login');
}
