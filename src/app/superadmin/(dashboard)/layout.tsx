import Link from 'next/link';
import { SignOut } from '@phosphor-icons/react/dist/ssr';
import Nav from '@/components/superadmin/Nav';
import { signOut } from '@/lib/superadmin/auth-actions';

/**
 * Chrome for the signed-in dashboard: a fixed sidebar beside a scrolling
 * content column.
 *
 * Access is enforced in src/middleware.ts, not here — a layout cannot gate a
 * route reliably, and putting the check in middleware means a new sub-page is
 * protected the moment it is created.
 *
 * Icons come from the package's /dist/ssr entry: this is a server component,
 * and the default entry is marked "use client".
 */

const WaveMark = () => (
  <span className="flex h-5 items-center gap-[2px]" aria-hidden="true">
    {[8, 14, 20, 14, 8].map((height, index) => (
      <span key={index} className="w-[3px] rounded-full bg-[var(--accent)]" style={{ height }} />
    ))}
  </span>
);

/** A plain form, so signing out still works with JavaScript disabled. */
const SignOutButton = ({ compact = false }: { compact?: boolean }) => (
  <form action={signOut}>
    <button
      type="submit"
      className={`flex items-center gap-2 rounded-lg text-sm text-[var(--muted)] transition-colors hover:bg-white/[0.03] hover:text-[var(--text)] ${
        compact ? 'px-2.5 py-1.5' : 'w-full gap-2.5 px-3 py-2'
      }`}
    >
      <SignOut size={17} />
      <span className={compact ? 'sr-only sm:not-sr-only' : undefined}>Sign out</span>
    </button>
  </form>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/*
        The sidebar is its own scroll context, pinned for the full viewport
        height, so the navigation stays put however long the content column
        gets. Below lg it is replaced by the bar underneath — a 240px rail
        costs too much of a narrow screen.
      */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--panel)] lg:flex">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <Link href="/superadmin" className="flex items-center gap-2 font-semibold">
            <WaveMark />
            MemoFlow
          </Link>
          <p className="mt-1.5 text-[11px] uppercase tracking-wider text-[var(--muted)]">
            Superadmin
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <Nav />
        </div>

        <div className="space-y-1 border-t border-[var(--line)] p-3">
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-white/[0.03] hover:text-[var(--text)]"
          >
            Back to site
            <span aria-hidden="true">↗</span>
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--page)]/85 backdrop-blur lg:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <Link href="/superadmin" className="flex items-center gap-2 font-semibold">
              <WaveMark />
              MemoFlow
            </Link>
            <div className="flex items-center gap-2">
              <Nav orientation="horizontal" />
              <SignOutButton compact />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
