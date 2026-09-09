import Link from 'next/link';
import ResendButton from '@/components/superadmin/ResendButton';
import { Empty, PageHeader, Panel, StatusPill, compact, stamp } from '@/components/superadmin/ui';
import { STATUSES, getSignups, type SignupView } from '@/lib/superadmin/stats';

export const dynamic = 'force-dynamic';

/**
 * The signup list, one row per person by default.
 *
 * The download flow writes a `downloads` row per emailed link, so a per-row
 * list shows the same person up to ten times — each repeat carrying its own
 * Resend button, including on people who downloaded on a later attempt. This
 * page collapses to one row per address and keeps the per-attempt history one
 * click away.
 *
 * Filters and the view live in the URL rather than component state, so a
 * filtered view is linkable and survives a refresh — and the whole page stays
 * a server component with no client-side data fetching. The form uses GET for
 * the same reason: submitting it just navigates.
 */

type Search = { q?: string; status?: string; page?: string; view?: string };

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
  const view: SignupView = params.view === 'attempts' ? 'attempts' : 'people';
  const people = view === 'people';

  const result = await getSignups({ q, status, page, perPage: 50, view });
  const filtered = Boolean(q || status);

  /** Every link on this page keeps the filters that are already applied. */
  const href = (over: { page?: number; view?: SignupView; q?: string; status?: string } = {}) => {
    const next = new URLSearchParams();
    const email = over.q ?? q;
    const state = over.status ?? status;
    const target = over.view ?? view;
    const number = over.page ?? 1;
    if (email) next.set('q', email);
    if (state) next.set('status', state);
    if (target !== 'people') next.set('view', target);
    if (number > 1) next.set('page', String(number));
    const query = next.toString();
    return query ? `/superadmin/signups?${query}` : '/superadmin/signups';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Signups"
        subtitle={
          people
            ? `${compact(result.total)} ${result.total === 1 ? 'person' : 'people'}${
                status ? ` with at least one ${status.replace('_', ' ')} link` : ''
              }${q ? ' matching that search' : ''} · one row each, newest activity first`
            : `${compact(result.total)} link${result.total === 1 ? '' : 's'} sent${
                filtered ? ' matching this filter' : ''
              } · newest first`
        }
        action={
          /* One filter row above everything it scopes. */
          <form method="GET" className="flex flex-wrap items-center gap-2">
            {view !== 'people' && <input type="hidden" name="view" value={view} />}
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
                href={href({ q: '', status: '' })}
                className="h-9 rounded-lg border border-[var(--line)] px-3 text-sm leading-9 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                Clear
              </Link>
            )}
          </form>
        }
      />

      {/* People or every attempt — the same filters, a different grain. */}
      <div className="flex gap-1 text-sm" role="group" aria-label="Grouping">
        <ViewTab href={href({ view: 'people' })} active={people}>
          People
        </ViewTab>
        <ViewTab href={href({ view: 'attempts' })} active={!people}>
          Every link sent
        </ViewTab>
      </div>

      {result.rows.length === 0 ? (
        <Empty>
          {filtered
            ? 'No signups match that filter.'
            : 'No signups recorded yet — or the database is unreachable.'}
        </Empty>
      ) : (
        <Panel className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="text-xs text-[var(--muted)]">
                <tr className="border-b border-[var(--line)]">
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Platform</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Delivery</th>
                  {people && <th className="px-5 py-3 font-medium">Links</th>}
                  <th className="px-5 py-3 font-medium">
                    {people ? 'Last request (UTC)' : 'Signed up (UTC)'}
                  </th>
                  <th className="px-5 py-3 font-medium">Downloaded (UTC)</th>
                  <th className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
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
                    {people && (
                      <td className="px-5 py-3 tabular-nums">
                        {/* The count doubles as the way into that person's history. */}
                        <Link
                          href={href({ q: row.email, status: '', view: 'attempts' })}
                          className="text-[var(--muted)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--text)]"
                          title={`Every link sent to ${row.email}`}
                        >
                          {row.attempts ?? 1}
                        </Link>
                      </td>
                    )}
                    <td className="px-5 py-3 tabular-nums text-[var(--muted)]">
                      {stamp(row.created_at)}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-[var(--muted)]">
                      {stamp(row.downloaded_at)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {/*
                        Offered only where a new link is the fix. Someone who
                        downloaded needs nothing, and in the people view that
                        covers every one of their earlier failed attempts too.
                      */}
                      {row.status !== 'downloaded' && (
                        <div className="flex justify-end">
                          <ResendButton email={row.email} os={row.os} />
                        </div>
                      )}
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
            <PageLink href={href({ page: result.page - 1 })} disabled={result.page <= 1}>
              ← Newer
            </PageLink>
            <PageLink href={href({ page: result.page + 1 })} disabled={result.page >= result.pages}>
              Older →
            </PageLink>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={`rounded-lg border px-3 py-1.5 transition-colors ${
        active
          ? 'border-[var(--accent)] text-[var(--text)]'
          : 'border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
      }`}
    >
      {children}
    </Link>
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
