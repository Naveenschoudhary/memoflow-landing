import type { Metadata } from 'next';

/**
 * Everything under /superadmin, signed in or not.
 *
 * Deliberately thin: it carries only what the login page and the dashboard
 * both need — the robots policy, the no-prerender rule, and the chart colour
 * tokens. The sidebar lives one level down in (dashboard)/layout.tsx, so the
 * login page does not inherit navigation it cannot use yet.
 */

export const metadata: Metadata = {
  title: 'MemoFlow superadmin',
  // Belt and braces with the X-Robots-Tag the middleware sets: the route is
  // behind a login, so a crawler should never see it, but neither should it be
  // indexable if the gate is ever misconfigured.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Never prerendered and never cached: the numbers are the entire point, and a
 * statically rendered dashboard would show whatever was true at build time.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SuperadminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="superadmin min-h-screen bg-[var(--page)] text-[var(--text)]">
      {/*
        Chart roles, scoped to the dashboard so nothing here leaks into the
        marketing pages. Both were validated against the panel surface
        (#131318) rather than picked by eye — CVD ΔE 10.1 apart, each over
        3:1 contrast.
      */}
      <style>{`
        .superadmin {
          --viz-primary: var(--accent);
          --viz-context: #6b6b78;
        }
      `}</style>
      {children}
    </div>
  );
}
