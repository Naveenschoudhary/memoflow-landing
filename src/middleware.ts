import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, safeEqual, verifySession } from '@/lib/superadmin/session';

/**
 * The gate in front of the dashboard.
 *
 * Browsers get a real login page and a signed session cookie. Scripts hitting
 * /api/debug/* may still use HTTP Basic Auth, because redirecting curl to an
 * HTML login form is useless — an API needs a status code, not a page.
 *
 * Set in Vercel (Project Settings -> Environment Variables) and in .env.local:
 *   SUPERADMIN_USER
 *   SUPERADMIN_PASSWORD
 */
const REALM = 'MemoFlow superadmin';
const LOGIN_PATH = '/superadmin/login';

export const config = {
  matcher: ['/superadmin/:path*', '/api/debug/:path*'],
};

/**
 * Matcher notes:
 *
 * '/superadmin/:path*' covers the bare /superadmin and everything beneath it,
 * so a new sub-page is protected the moment it is added — there is no
 * per-route opt-in to forget.
 *
 * '/api/debug/:path*' is included because /api/debug/db returns live signup
 * and download counts: the same numbers the dashboard exists to protect.
 *
 * Deliberately NOT matched: /api/signup and /api/download/[id]. The signup
 * form posts to the first from a logged-out browser, and the second IS the
 * emailed download link — gating either would break the product.
 */
export async function middleware(req: NextRequest) {
  const user = process.env.SUPERADMIN_USER;
  const password = process.env.SUPERADMIN_PASSWORD;

  // Fail closed. An unconfigured deployment must not serve the dashboard to
  // anyone — an empty expected password would otherwise match empty input.
  if (!user || !password) {
    return new NextResponse(
      'Superadmin is not configured — set SUPERADMIN_USER and SUPERADMIN_PASSWORD.',
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const { pathname, search } = req.nextUrl;
  const signedIn = await verifySession(
    req.cookies.get(SESSION_COOKIE)?.value,
    user,
    password
  );

  // The login page is the one route inside /superadmin that must stay
  // reachable while signed out, or the redirect below would loop forever.
  if (pathname === LOGIN_PATH) {
    return signedIn ? NextResponse.redirect(new URL('/superadmin', req.url)) : pass();
  }

  if (signedIn) return pass();

  if (pathname.startsWith('/api/debug')) {
    const credentials = readBasicAuth(req.headers.get('authorization'));
    if (credentials) {
      // Both compared every time — never short-circuit on the username, or the
      // response time reveals whether a guessed username exists.
      const [userOk, passwordOk] = await Promise.all([
        safeEqual(credentials.user, user),
        safeEqual(credentials.password, password),
      ]);
      if (userOk && passwordOk) return pass();
    }

    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  // Carry the requested path across the login so the visitor lands where they
  // were going, not always on the overview.
  const login = new URL(LOGIN_PATH, req.url);
  if (pathname !== '/superadmin') login.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(login);
}

/** Nothing behind this gate belongs in a shared or browser cache. */
function pass() {
  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return res;
}

function readBasicAuth(header: string | null) {
  if (!header) return null;

  const [scheme, encoded] = header.split(' ');
  if (scheme?.toLowerCase() !== 'basic' || !encoded) return null;

  let decoded: string;
  try {
    // atob alone yields latin-1, which mangles a non-ASCII password.
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    decoded = new TextDecoder('utf-8').decode(bytes);
  } catch {
    return null;
  }

  // Only the FIRST colon separates the fields, so a password may contain
  // colons (RFC 7617). Splitting on every colon would reject valid passwords.
  const separator = decoded.indexOf(':');
  if (separator === -1) return null;

  return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
}
