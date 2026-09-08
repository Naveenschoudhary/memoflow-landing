import type { Metadata } from 'next';
import PageShell, { Bullets } from '@/components/PageShell';
import { releases } from '@/lib/releaseNotes';

export const metadata: Metadata = {
  title: 'Release notes — MemoFlow',
  description: 'What changed in each version of MemoFlow.',
  alternates: { canonical: 'https://memoflow.app/release-notes' },
};

export default function ReleaseNotes() {
  return (
    <PageShell eyebrow="Release notes" title="What changed">
      {releases.map((release, index) => (
        <section key={release.version}>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {release.version}
            </h2>
            {index === 0 && (
              <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                Latest
              </span>
            )}
            <span className="text-sm text-[var(--muted)]">{release.date}</span>
          </div>

          {release.headline && (
            <p className="mt-3 text-[var(--muted)]">{release.headline}</p>
          )}

          <div className="mt-5 space-y-5">
            {release.groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium text-[var(--text)]">
                  {group.title}
                </h3>
                <div className="mt-2 text-[var(--muted)]">
                  <Bullets items={group.items} />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm">
            <a
              href={`https://github.com/Naveenschoudhary/memoflow-models/releases/tag/v${release.version}`}
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Download {release.version} →
            </a>
          </p>

          {index < releases.length - 1 && (
            <hr className="mt-10 border-[var(--line)]" />
          )}
        </section>
      ))}
    </PageShell>
  );
}
