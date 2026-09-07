import Link from 'next/link';
import DailyChart from '@/components/superadmin/DailyChart';
import {
  BarList,
  Empty,
  Funnel,
  Hero,
  PageHeader,
  Panel,
  Stat,
  StatusPill,
  TableView,
  compact,
  percent,
  stamp,
} from '@/components/superadmin/ui';
import { getByDomain, getByOs, getDaily, getOverview, getSignups } from '@/lib/superadmin/stats';
import { getReleaseDownloads } from '@/lib/superadmin/releases';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  // Independent reads, so they run together rather than stacking their
  // latencies — the MySQL host is remote and the GitHub call is a network hop.
  const [overview, daily, byOs, byDomain, recent, releases] = await Promise.all([
    getOverview(),
    getDaily(30),
    getByOs(),
    getByDomain(6),
    getSignups({ perPage: 10 }),
    getReleaseDownloads(),
  ]);

  if (!overview) {
    return (
      <Empty>
        Could not read the database. Check that <code>DATABASE_URL</code> is set and that
        <code> schema.sql</code> has been applied.
      </Empty>
    );
  }

  const emailedNeverOpened = overview.signups - overview.downloaded;
  // The stable release people are actually landing on, ignoring pre-releases.
  const latestRelease =
    releases.releases.find((release) => !release.prerelease) ?? releases.releases[0] ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle={
          overview.firstSignupAt
            ? `Collecting signups since ${stamp(overview.firstSignupAt)} UTC.`
            : 'No signups recorded yet.'
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/*
          The lead number is the GitHub asset count, not the click count on
          emailed links: it is the only figure that counts everyone who
          actually fetched the DMG, including forwarded links and the release
          page. The email funnel is the narrower, attributable story and gets
          its own panel below.
        */}
        <Panel className="lg:col-span-1">
          <Hero
            label="App downloads"
            value={releases.error ? '—' : compact(releases.total)}
            sub={
              releases.error ? (
                <span className="text-[#fbbf24]">{releases.error}</span>
              ) : (
                <>
                  Every DMG fetched from GitHub, across{' '}
                  {releases.releases.length} release
                  {releases.releases.length === 1 ? '' : 's'} — including forwarded links and
                  in-app updates.
                </>
              )
            }
          />

          {latestRelease && (
            <dl className="mt-6 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Latest version</dt>
                <dd className="tabular-nums">{latestRelease.version}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Downloads of it</dt>
                <dd className="tabular-nums">
                  {compact(latestRelease.downloads)}{' '}
                  <span className="text-[var(--muted)]">
                    ({percent(latestRelease.downloads, releases.total)})
                  </span>
                </dd>
              </div>
              <div className="pt-1">
                <Link
                  href="/superadmin/releases"
                  className="text-[var(--muted)] underline transition-colors hover:text-[var(--text)]"
                >
                  Every version →
                </Link>
              </div>
            </dl>
          )}
        </Panel>

        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          <Stat
            label="Email signups"
            value={compact(overview.signups)}
            sub={`${compact(overview.uniqueEmails)} unique address${overview.uniqueEmails === 1 ? '' : 'es'}`}
          />
          <Stat
            label="Download links opened"
            value={compact(overview.downloaded)}
            sub={`${percent(overview.downloaded, overview.signups)} of signups · ${compact(overview.uniqueDownloaders)} distinct people`}
          />
          <Stat
            label="Signups, last 7 days"
            value={compact(overview.signups7d)}
            sub={`${compact(overview.signups24h)} in the last 24 hours`}
          />
          <Stat
            label="Needs attention"
            value={compact(overview.expired + overview.emailFailed)}
            sub={`${compact(overview.expired)} link${overview.expired === 1 ? '' : 's'} expired · ${compact(overview.emailFailed)} email${overview.emailFailed === 1 ? '' : 's'} failed to send`}
          />
        </div>
      </div>

      <Panel
        title="Signups per day"
        hint="Last 30 days, bucketed by the database server's clock."
      >
        <DailyChart data={daily} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="From signup to download"
          hint="Where the emailed-link flow loses people."
        >
          <Funnel
            stages={[
              { label: 'Signed up', value: overview.signups },
              {
                label: 'Email delivered',
                value: overview.emailsSent,
                note:
                  overview.emailFailed > 0
                    ? `${overview.emailFailed} rejected by Resend`
                    : undefined,
              },
              {
                label: 'Opened the link',
                value: overview.downloaded,
                note:
                  emailedNeverOpened > 0
                    ? `${compact(emailedNeverOpened)} never opened it — links expire after 10 minutes`
                    : undefined,
              },
            ]}
          />

          <div className="mt-6 border-t border-[var(--line)] pt-4">
            <p className="text-xs text-[var(--muted)]">Platform picked on the signup form</p>
            {byOs.length <= 1 ? (
              <p className="mt-2 text-sm">
                {byOs.length === 0
                  ? 'No signups yet.'
                  : `All ${compact(byOs[0].count)} chose ${byOs[0].label} — no Windows or Linux requests yet.`}
              </p>
            ) : (
              <ul className="mt-3 space-y-1.5 text-sm">
                {byOs.map((row) => (
                  <li key={row.label} className="flex justify-between gap-4">
                    <span>{row.label}</span>
                    <span className="tabular-nums">
                      {compact(row.count)}{' '}
                      <span className="text-[var(--muted)]">
                        ({percent(row.count, overview.signups)})
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        <Panel
          title="Top mailbox domains"
          hint="Distinct addresses per provider — company domains signal team interest."
        >
          <BarList rows={byDomain} />
          <TableView summary="View as table">
            <SmallTable
              head={['Domain', 'Signups', 'Downloaded']}
              rows={byDomain.map((row) => [row.label, String(row.count), String(row.downloaded)])}
            />
          </TableView>
        </Panel>
      </div>

      <Panel
        title="Latest signups"
        hint={
          overview.lastSignupAt
            ? `Most recent ${stamp(overview.lastSignupAt)} UTC.`
            : undefined
        }
        action={
          <Link
            href="/superadmin/signups"
            className="whitespace-nowrap text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            All {compact(overview.signups)} →
          </Link>
        }
      >
        {recent.rows.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No signups yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr>
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 pr-4 font-medium">Platform</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Signed up (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {recent.rows.map((row) => (
                  <tr key={row.id} className="border-t border-[var(--line)]">
                    <td className="py-2.5 pr-4">{row.email}</td>
                    <td className="py-2.5 pr-4 text-[var(--muted)]">{row.os}</td>
                    <td className="py-2.5 pr-4">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="py-2.5 tabular-nums text-[var(--muted)]">
                      {stamp(row.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

    </div>
  );
}

function SmallTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="w-full text-left text-xs">
      <thead className="text-[var(--muted)]">
        <tr>
          {head.map((cell, index) => (
            <th key={cell} className={`py-1.5 font-medium ${index ? 'text-right' : ''}`}>
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="tabular-nums">
        {rows.map((row) => (
          <tr key={row[0]} className="border-t border-[var(--line)]">
            {row.map((cell, index) => (
              <td key={index} className={`py-1.5 ${index ? 'text-right' : ''}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
