/**
 * Signed session cookies for the superadmin dashboard.
 *
 * Web Crypto only — no Node built-ins — because this module is imported by
 * both the Edge middleware and Node-side server actions, and must behave
 * identically in each.
 *
 * The signing key is derived from SUPERADMIN_PASSWORD rather than configured
 * separately. That keeps deployment to two variables, and gives a useful
 * property for free: changing the password invalidates every existing
 * session, so rotating it actually logs everyone out.
 */

export const SESSION_COOKIE = 'memoflow_admin';

/** Long enough to work a full day without re-typing, short enough to expire overnight. */
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

type Payload = { u: string; exp: number };

async function signingKey(password: string) {
  const material = new TextEncoder().encode(`memoflow.superadmin.session.v1:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', material);
  return crypto.subtle.importKey('raw', digest, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
}

async function sign(body: string, password: string) {
  const key = await signingKey(password);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return base64UrlEncode(new Uint8Array(signature));
}

/** `<base64url payload>.<base64url HMAC>` — the payload is readable, not secret. */
export async function createSession(user: string, password: string): Promise<string> {
  const payload: Payload = {
    u: user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${await sign(body, password)}`;
}

/**
 * True only for a token this server signed, for the configured user, that has
 * not expired. Any malformed input is a plain false — never a throw, so a
 * mangled cookie logs the visitor out instead of 500-ing the middleware.
 */
export async function verifySession(
  token: string | undefined,
  user: string,
  password: string
): Promise<boolean> {
  if (!token) return false;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return false;

  const body = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  // Compared before the payload is trusted at all — an unsigned token never
  // gets as far as being parsed.
  const expected = await sign(body, password);
  if (!timingSafeEqual(signature, expected)) return false;

  const decoded = base64UrlDecode(body);
  if (!decoded) return false;

  let payload: Payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(decoded));
  } catch {
    return false;
  }

  if (typeof payload?.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
    return false;
  }

  // A token signed for a username that is no longer the configured one is
  // rejected even though the signature still checks out.
  return payload.u === user;
}

/**
 * Constant-time credential comparison.
 *
 * Both sides are hashed first, so they are always the same 32 bytes: neither
 * the length of the real value nor the position of the first wrong character
 * shows up in the response time. A plain `===` leaks both.
 */
export async function safeEqual(supplied: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(supplied)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);

  const left = new Uint8Array(a);
  const right = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}

/** Same idea for two already-hex/base64 strings of equal expected length. */
function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Where to send someone after signing in.
 *
 * Only same-origin dashboard paths are honoured. Without this an attacker
 * could hand out /superadmin/login?next=https://evil.example and borrow the
 * site's credibility for the hop — the classic open redirect.
 */
export function safeNext(value: string | undefined | null): string {
  if (!value) return '/superadmin';
  // "//evil.com" and "/\evil.com" are protocol-relative URLs, not local paths.
  if (!value.startsWith('/superadmin') || value.startsWith('//') || value.includes('\\')) {
    return '/superadmin';
  }
  return value === '/superadmin/login' ? '/superadmin' : value;
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): Uint8Array | null {
  try {
    const standard = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = standard.padEnd(Math.ceil(standard.length / 4) * 4, '=');
    return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}
