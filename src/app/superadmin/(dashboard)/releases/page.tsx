import { Empty, PageHeader, Panel, Stat, TableView, compact } from '@/components/superadmin/ui';
import { getReleaseDownloads } from '@/lib/superadmin/releases';

export const dynamic = 'force-dynamic';

/**
 * Real installer downloads, per shipped version.
 *
 * A magnitude comparison across a handful of named versions, so: horizontal
 * bars, one colour. Shading each bar by its own value would encode the length
 * twice and say nothing extra.
 */
export default async function ReleasesPage() {
  const { releases, total, error } = await getReleaseDownloads();

  if (error) {
    return <Empty>{error}</Empty>;
  }

  if (!releases.length) {
    return <Empty>No published releases with an installer attached.</Empty>;
  }

  const max = Math.max(...releases.map((release) => release.downloads), 1);
  const latest = releases.find((release) => !release.prerelease) ?? releases[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Releases"
        subtitle="Counted from each release's .dmg on GitHub, so this includes every fetch — emailed links, the release page, and Sparkle in-app updates. Model-weight releases are excluded."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Stat label="Total downloads" value={compact(total)} sub="All versions, all time" />
        <Stat
          label="Latest version"
          value={latest.version}
          sub={
            latest.publishedAt
              ? `Published ${new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(latest.publishedAt))}`
              : undefined
          }
        />
        <Stat
          label="On the latest version"
          value={compact(latest.downloads)}
          sub={`${Math.round((latest.downloads / Math.max(total, 1)) * 100)}% of all downloads`}
        />
      </div>

      <Panel title="Downloads by version" hint="Newest release first.">
        <ul className="space-y-4">
          {releases.map((release) => (
            <li key={release.tag}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <a
                    href={release.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {release.version}
                  </a>
                  {release.prerelease && (
                    <span className="rounded border border-[var(--line)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Pre-release
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-[var(--muted)]">
                  {compact(release.downloads)}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-[var(--panel-2)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width:
                      release.downloads === 0
                        ? '0%'
                        : `${Math.max(1.5, (release.downloads / max) * 100)}%`,
                    background: 'var(--viz-primary)',
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        <TableView summary="View every asset as a table">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[var(--panel)] text-[var(--muted)]">
              <tr>
                <th className="py-1.5 pr-4 font-medium">Version</th>
                <th className="py-1.5 pr-4 font-medium">Asset</th>
                <th className="py-1.5 pr-4 text-right font-medium">Size</th>
                <th className="py-1.5 text-right font-medium">Downloads</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {releases.flatMap((release) =>
                release.assets.map((asset) => (
                  <tr key={`${release.tag}-${asset.name}`} className="border-t border-[var(--line)]">
                    <td className="py-1.5 pr-4">{release.version}</td>
                    <td className="py-1.5 pr-4 text-[var(--muted)]">{asset.name}</td>
                    <td className="py-1.5 pr-4 text-right text-[var(--muted)]">
                      {megabytes(asset.size)}
                    </td>
                    <td className="py-1.5 text-right">{asset.downloads}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableView>
      </Panel>
    </div>
  );
}

const megabytes = (bytes: number) =>
  bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : '—';
