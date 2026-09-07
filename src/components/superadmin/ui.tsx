import type { ReactNode } from 'react';

/**
 * The dashboard's shared pieces.
 *
 * Colours come from the site's own tokens (--page, --panel, --line, --muted,
 * --accent) plus two chart roles defined in the layout: --viz-primary (the
 * accent) and --viz-context (a de-emphasis grey). Those two were checked
 * against the panel surface rather than eyeballed: CVD ΔE 10.1 apart, both
 * over 3:1 contrast on #131318.
 *
 * One hue throughout, on purpose. Every chart here answers a magnitude
 * question about the same quantity — people — so a second hue would imply a
 * distinction that is not in the data. Grey carries context; the accent
 * carries the number being asked about.
 */

export const compact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: value >= 10_000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);

export const percent = (part: number, whole: number) =>
  whole > 0 ? `${Math.round((part / whole) * 100)}%` : '—';

/**
 * Rendered in UTC, and labelled as such wherever it appears. created_at is a
 * TIMESTAMP, so the alternative — the serverless region's local time — would
 * silently change meaning if the deployment region ever moved.
 */
export const stamp = (value: Date | string | null) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(date);
};

/**
 * The title block every dashboard page opens with. With the navigation moved
 * into the sidebar, each page has to name itself — otherwise the content
 * column starts with an unlabelled row of numbers.
 */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Panel({
  title,
  hint,
  action,
  children,
  className = '',
}: {
  title?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 ${className}`}
    >
      {(title || action) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-tight">{title}</h2>}
            {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/**
 * The one number the dashboard leads with. Proportional figures, not
 * tabular — equal-width digits make a large standalone number look loose.
 */
export function Hero({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-6xl font-semibold leading-none tracking-tight">{value}</p>
      {sub && <p className="mt-3 text-sm text-[var(--muted)]">{sub}</p>}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold leading-none tracking-tight">{value}</p>
      {sub && <p className="mt-2 text-xs text-[var(--muted)]">{sub}</p>}
    </div>
  );
}

/**
 * Status colours are reserved for state and always ship with their label, so
 * the colour never carries the meaning by itself.
 */
const STATUS_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  downloaded: { dot: '#0ca30c', text: '#4ade80', label: 'Downloaded' },
  pending: { dot: '#6b6b78', text: 'var(--muted)', label: 'Link unopened' },
  expired: { dot: '#fab219', text: '#fbbf24', label: 'Expired' },
  email_failed: { dot: '#d03b3b', text: '#f87171', label: 'Email failed' },
};

export function StatusPill({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? {
    dot: '#6b6b78',
    text: 'var(--muted)',
    label: status,
  };
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: style.dot }}
      />
      <span style={{ color: style.text }}>{style.label}</span>
    </span>
  );
}

/**
 * Nominal categories (mailbox domain, OS) — one colour for every bar. Shading
 * each bar by its own value would double-encode the length as hue and spend
 * the only free channel on information the bar already shows.
 */
export function BarList({
  rows,
  empty = 'No data yet.',
}: {
  rows: { label: string; count: number }[];
  empty?: string;
}) {
  if (!rows.length) return <p className="text-sm text-[var(--muted)]">{empty}</p>;

  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="truncate" title={row.label}>
              {row.label}
            </span>
            <span className="tabular-nums text-[var(--muted)]">{compact(row.count)}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--panel-2)]">
            <div
              className="h-full rounded-full"
              style={{
                // A floor so a value of 1 stays visible — but never for zero,
                // which must draw nothing rather than a misleading stub.
                width: row.count === 0 ? '0%' : `${Math.max(2, (row.count / max) * 100)}%`,
                background: 'var(--viz-primary)',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * The signup funnel as meters rather than a chart: three ordered stages of one
 * measure, each a ratio against the first. The unfilled track is a lighter
 * step of the fill's own ramp so the state reads across the whole bar.
 */
export function Funnel({
  stages,
}: {
  stages: { label: string; value: number; note?: string }[];
}) {
  const top = stages[0]?.value ?? 0;

  return (
    <ol className="space-y-4">
      {stages.map((stage, index) => (
        <li key={stage.label}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm">{stage.label}</span>
            <span className="text-sm tabular-nums">
              {compact(stage.value)}
              {index > 0 && (
                <span className="ml-2 text-[var(--muted)]">{percent(stage.value, top)}</span>
              )}
            </span>
          </div>
          <div
            className="mt-2 h-2 w-full rounded-full"
            style={{ background: 'rgba(255, 69, 58, 0.15)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width:
                  top > 0 && stage.value > 0
                    ? `${Math.max(1.5, (stage.value / top) * 100)}%`
                    : '0%',
                background: 'var(--viz-primary)',
              }}
            />
          </div>
          {stage.note && <p className="mt-1.5 text-xs text-[var(--muted)]">{stage.note}</p>}
        </li>
      ))}
    </ol>
  );
}

/** The table twin every chart on this dashboard carries, collapsed by default. */
export function TableView({
  summary = 'View as table',
  children,
}: {
  summary?: string;
  children: ReactNode;
}) {
  return (
    <details className="mt-5 border-t border-[var(--line)] pt-3">
      <summary className="cursor-pointer text-xs text-[var(--muted)] hover:text-[var(--text)]">
        {summary}
      </summary>
      <div className="mt-3 max-h-72 overflow-auto">{children}</div>
    </details>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">
      {children}
    </p>
  );
}
