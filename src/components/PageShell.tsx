import Link from 'next/link';

/// The app's mark: a waveform mirrored around the centerline, matching the
/// home page.
const WaveMark = () => (
  <span className="flex h-5 items-center gap-[2px]" aria-hidden="true">
    {[8, 14, 20, 14, 8].map((h, i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-[var(--accent)]"
        style={{ height: h }}
      />
    ))}
  </span>
);

/**
 * Chrome for the sub-pages (terms, privacy, release notes).
 *
 * These used light Tailwind greys and a yellow accent from an older design,
 * which looked like a different product than the home page. This puts them on
 * the same tokens: --page, --panel, --line, --muted, --accent.
 *
 * Server-rendered on purpose — it is static text, so there is nothing to
 * hydrate and the content is indexable.
 */
export default function PageShell({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--page)]/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <WaveMark />
            MemoFlow
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            ← Back to home
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-14">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium text-[var(--accent)]">{eyebrow}</p>
        )}
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {updated && (
          <p className="mt-3 text-sm text-[var(--muted)]">Last updated {updated}</p>
        )}
        <div className="mt-12 space-y-10">{children}</div>
      </main>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-[var(--muted)] sm:flex-row">
          <div className="flex items-center gap-2">
            <WaveMark />
            <span>MemoFlow — private AI meeting notes for Mac</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/pricing" className="hover:text-[var(--text)]">Pricing</Link>
            <Link href="/compare" className="hover:text-[var(--text)]">Compare</Link>
            <Link href="/privacy" className="hover:text-[var(--text)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text)]">Terms</Link>
            <Link href="/release-notes" className="hover:text-[var(--text)]">Release notes</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** A titled block of legal or explanatory prose. */
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-[var(--muted)]">{children}</div>
    </section>
  );
}

/** The panel treatment used for feature cards on the home page. */
export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 leading-relaxed text-[var(--muted)]">
      {children}
    </div>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[var(--accent)]">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
