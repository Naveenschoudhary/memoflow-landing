import Link from 'next/link';
import LoginForm from '@/components/superadmin/LoginForm';
import { safeNext } from '@/lib/superadmin/session';

export const dynamic = 'force-dynamic';

/**
 * The sign-in screen.
 *
 * Lives outside the (dashboard) route group so it does not inherit the
 * sidebar — there is nothing to navigate to until you are through.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  // Sanitised here as well as on submit: the value is rendered into the form,
  // so it must already be a local dashboard path by the time it gets there.
  const next = safeNext(params.next);

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex h-6 items-center gap-[3px]" aria-hidden="true">
            {[10, 18, 26, 18, 10].map((height, index) => (
              <span
                key={index}
                className="w-[3px] rounded-full bg-[var(--accent)]"
                style={{ height }}
              />
            ))}
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">MemoFlow superadmin</h1>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            Sign in to see signup and download numbers.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
          <LoginForm next={next} />
        </div>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            ← Back to memoflow.app
          </Link>
        </p>
      </div>
    </div>
  );
}
