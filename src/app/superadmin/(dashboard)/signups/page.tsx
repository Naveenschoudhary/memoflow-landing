import Link from 'next/link';
import { Empty, PageHeader, Panel, StatusPill, compact, stamp } from '@/components/superadmin/ui';
import { STATUSES, getSignups } from '@/lib/superadmin/stats';

export const dynamic = 'force-dynamic';

/**
 * The full signup list.
 *
 * Filters live in the URL rather than component state, so a filtered view is
 * linkable and survives a refresh — and the whole page stays a server
 * component with no client-side data fetching. The form uses GET for the same
 * reason: submitting it just navigates.
 */

type Search = { q?: string; status?: string; page?: string };

export default async function SignupsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || '';
  const status = params.status && (STATUSES as readonly string[]).includes(params.status)
    ? params.status
    : '';
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const result = await getSignups({ q, status, page, perPage: 50 });
  const filtered = Boolean(q || status);

  const pageHref = (target: number) => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (status) next.set('status', status);
    if (target > 1) next.set('page', String(target));
    const query = next.toString();
    return query ? `/superadmin/signups?${query}` : '/superadmin/signups';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Signups"
        subtitle={`${compact(result.total)} row${result.total === 1 ? '' : 's'}${
          filtered ? ' matching this filter' : ''
        } · newest first`}
        action={
          /* One filter row above everything it scopes. */
          <form method="GET" className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search email…"
            aria-label="Search by email address"
            className="h-9 w-56 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
          />
          <select
            name="status"
            defaultValue={status}
            aria-label="Filter by status"
            className="h-9 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            <option value="">Any status</option>
            {STATUSES.map((option) => (
              <option key={option} value={option}>
                {option.replace('_', ' ')}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-9 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Filter
          </button>
            {filtered && (
              <Link
                href="/superadmin/signups"
                className="h-9 rounded-lg border border-[var(--line)] px-3 text-sm leading-9 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                Clear
              </Link>
            )}
          </form>
        }
      />

      {result.rows.length === 0 ? (
        <Empty>
          {filtered
            ? 'No signups match that filter.'
            : 'No signups recorded yet — or the database is unreachable.'}
        </Empty>
      ) : (
        <Panel className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr className="border-b border-[var(--line)]">
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Platform</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Delivery</th>
                  <th className="px-5 py-3 font-medium">Signed up (UTC)</th>
                  <th className="px-5 py-3 font-medium">Downloaded (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--line)] last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3">{row.email}</td>
                    <td className="px-5 py-3 text-[var(--muted)]">{row.os}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-5 py-3 text-[var(--muted)]">{row.email_status}</td>
                    <td className="px-5 py-3 tabular-nums text-[var(--muted)]">
                      {stamp(row.created_at)}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-[var(--muted)]">
                      {stamp(row.downloaded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {result.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">
            Page {result.page} of {result.pages}
          </span>
          <div className="flex gap-2">
            <PageLink href={pageHref(result.page - 1)} disabled={result.page <= 1}>
              ← Newer
            </PageLink>
            <PageLink href={pageHref(result.page + 1)} disabled={result.page >= result.pages}>
              Older →
            </PageLink>
          </div>
        </div>
      )}
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-[var(--muted)] opacity-40">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-lg border border-[var(--line)] px-3 py-1.5 transition-colors hover:border-[var(--accent)]"
    >
      {children}
    </Link>
  );
}
