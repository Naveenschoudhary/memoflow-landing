import type { DayPoint } from '@/lib/superadmin/stats';
import { TableView, percent } from './ui';

/**
 * Signups per day, with the share that actually opened the download link.
 *
 * An emphasis form, not two equal series: the question is "how many
 * downloaded", so downloads take the accent at the baseline and the rest of
 * the day's signups sit above them in the context grey. Reading a whole
 * column gives signups; reading the coloured part gives downloads.
 *
 * Built from divs rather than a charting library — 30 columns of two segments
 * does not justify a dependency, and this renders on the server with no
 * hydration cost. The hover layer is CSS-only for the same reason; every
 * value is also in the table view below, so nothing is gated behind a mouse.
 */

const PLOT_HEIGHT = 180;

export default function DailyChart({ data }: { data: DayPoint[] }) {
  if (!data.length) {
    return <p className="text-sm text-[var(--muted)]">No signups recorded yet.</p>;
  }

  const peak = Math.max(...data.map((point) => point.signups));
  const top = niceCeil(peak);
  const peakIndex = data.findIndex((point) => point.signups === peak);
  const lastIndex = data.length - 1;

  return (
    <div>
      <Legend />

      <div className="mt-4 flex gap-3">
        {/* Y ticks live outside the plot so a long number cannot push into it. */}
        <div className="relative w-8 shrink-0" style={{ height: PLOT_HEIGHT }}>
          {[top, Math.round(top / 2), 0].map((tick, index) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2 text-[10px] tabular-nums text-[var(--muted)]"
              style={{ top: `${index * 50}%` }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative pt-5">
            {/* Hairline gridlines, solid and one step off the surface. */}
            <div className="pointer-events-none absolute inset-x-0 top-5" style={{ height: PLOT_HEIGHT }}>
              {[0, 50, 100].map((offset) => (
                <div
                  key={offset}
                  className="absolute inset-x-0 h-px bg-[var(--line)]"
                  style={{ top: `${offset}%` }}
                />
              ))}
            </div>

            <div className="relative flex items-end gap-1" style={{ height: PLOT_HEIGHT }}>
              {data.map((point, index) => (
                <Column
                  key={point.day}
                  point={point}
                  top={top}
                  isPeak={index === peakIndex && peak > 0}
                  align={index < 3 ? 'left' : index > lastIndex - 3 ? 'right' : 'center'}
                />
              ))}
            </div>
          </div>

          <div className="mt-2 flex gap-1">
            {data.map((point, index) => (
              <div key={point.day} className="min-w-0 flex-1 text-center">
                {(lastIndex - index) % 5 === 0 && (
                  <span className="whitespace-nowrap text-[10px] text-[var(--muted)]">
                    {shortDay(point.day)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <TableView summary="View the daily numbers as a table">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-[var(--panel)] text-[var(--muted)]">
            <tr>
              <th className="py-1.5 pr-4 font-medium">Day</th>
              <th className="py-1.5 pr-4 text-right font-medium">Signups</th>
              <th className="py-1.5 pr-4 text-right font-medium">Downloaded</th>
              <th className="py-1.5 text-right font-medium">Rate</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {data.map((point) => (
              <tr key={point.day} className="border-t border-[var(--line)]">
                <td className="py-1.5 pr-4">{point.day}</td>
                <td className="py-1.5 pr-4 text-right">{point.signups}</td>
                <td className="py-1.5 pr-4 text-right">{point.downloaded}</td>
                <td className="py-1.5 text-right text-[var(--muted)]">
                  {percent(point.downloaded, point.signups)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableView>
    </div>
  );
}

function Column({
  point,
  top,
  isPeak,
  align,
}: {
  point: DayPoint;
  top: number;
  isPeak: boolean;
  align: 'left' | 'center' | 'right';
}) {
  const rest = Math.max(0, point.signups - point.downloaded);
  const height = (value: number) => `max(3px, ${(value / top) * 100}%)`;

  // Tooltips near the ends align to that edge instead of centring, so they
  // never hang outside the panel.
  const anchor =
    align === 'left'
      ? 'left-0'
      : align === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className="group relative flex h-full min-w-0 flex-1 items-end justify-center rounded-sm transition-colors hover:bg-white/[0.03]"
    >
      <div className="flex h-full w-full max-w-[18px] flex-col justify-end">
        {isPeak && point.signups > 0 && (
          <span className="mb-1 text-center text-[10px] tabular-nums text-[var(--muted)]">
            {point.signups}
          </span>
        )}

        {rest > 0 && (
          <div
            style={{
              height: height(rest),
              background: 'var(--viz-context)',
              // 2px of surface, not a stroke, is what separates the segments.
              marginBottom: point.downloaded > 0 ? 2 : 0,
              borderRadius: '4px 4px 0 0',
            }}
          />
        )}

        {point.downloaded > 0 && (
          <div
            style={{
              height: height(point.downloaded),
              background: 'var(--viz-primary)',
              borderRadius: rest > 0 ? 0 : '4px 4px 0 0',
            }}
          />
        )}
      </div>

      <div
        className={`pointer-events-none absolute top-0 z-20 hidden w-max rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-2.5 py-2 text-left shadow-lg group-hover:block ${anchor}`}
      >
        <p className="text-[11px] font-medium">{longDay(point.day)}</p>
        <p className="mt-1 text-[11px] text-[var(--muted)]">
          <span className="tabular-nums text-[var(--text)]">{point.signups}</span> signup
          {point.signups === 1 ? '' : 's'}
        </p>
        <p className="text-[11px] text-[var(--muted)]">
          <span className="tabular-nums text-[var(--text)]">{point.downloaded}</span> downloaded
          {point.signups > 0 && ` (${percent(point.downloaded, point.signups)})`}
        </p>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
      {[
        { color: 'var(--viz-primary)', label: 'Opened the download link' },
        { color: 'var(--viz-context)', label: 'Signed up, never opened it' },
      ].map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-sm"
            style={{ background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Round the axis top to 1/2/5 × 10ⁿ so the ticks read as clean numbers. */
function niceCeil(value: number) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 2.5, 5, 10]) {
    const candidate = step * magnitude;
    if (candidate >= value) return Math.round(candidate);
  }
  return Math.round(10 * magnitude);
}

const parseDay = (day: string) => {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date));
};

const shortDay = (day: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    parseDay(day)
  );

const longDay = (day: string) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseDay(day));
