import type { Metadata } from 'next';
import Link from 'next/link';
import { unsubscribeByToken } from '@/lib/superadmin/outreach';

/**
 * The public unsubscribe landing page.
 *
 * Deliberately outside /superadmin so the middleware never sees it — the
 * recipient is not signed in and never will be.
 */
export const metadata: Metadata = {
  title: 'Unsubscribe — MemoFlow',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const email = token ? await unsubscribeByToken(token) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--page)] px-5 py-12 text-[var(--text)]">
      <div className="w-full max-w-md text-center">
        <span className="inline-flex h-6 items-center gap-[3px]" aria-hidden="true">
          {[10, 18, 26, 18, 10].map((height, index) => (
            <span
              key={index}
              className="w-[3px] rounded-full bg-[var(--accent)]"
              style={{ height }}
            />
          ))}
        </span>

        {email ? (
          <>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">You&apos;re unsubscribed</h1>
            <p className="mt-3 text-[var(--muted)]">
              We won&apos;t send any more MemoFlow news to <strong>{email}</strong>.
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Download links you ask for yourself will still arrive — those aren&apos;t
              marketing.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">Link not recognised</h1>
            <p className="mt-3 text-[var(--muted)]">
              This unsubscribe link is invalid or has already been used. If you keep hearing
              from us, reply to any email and we&apos;ll take you off the list by hand.
            </p>
          </>
        )}

        <p className="mt-8">
          <Link
            href="/"
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            ← memoflow.app
          </Link>
        </p>
      </div>
    </div>
  );
}
