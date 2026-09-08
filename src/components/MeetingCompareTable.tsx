import {
  MEETING_COMPETITORS,
  MEETING_PRICES_CHECKED,
  USD_INR_ASSUMED,
  meetingRateLabel,
  meetingTeamFiveYear,
  meetingTeamYear,
  paidPriceLabel,
} from '@/lib/pricing';

/**
 * Per-seat cost for a team of `seats`, which is the number the per-user
 * monthly figures hide.
 *
 * Seat minimums are applied, not glossed: Otter bills five seats whether or not
 * you have five people, so a three-person studio pays the ten-seat table's
 * middle column regardless. That is the kind of detail a pricing page states in
 * a footnote and a comparison table should state in the cell.
 */
export default function MeetingCompareTable({ seats = 10 }: { seats?: number }) {
  return (
    <figure className="not-prose">
      <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">
            Meeting notes apps for Mac compared on price, processing location and
            language support
          </caption>
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--panel)]">
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">App</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">Price</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">{seats} seats / yr</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">{seats} seats / 5 yr</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">Processing</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">Bot joins</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">Hinglish</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)] bg-[var(--accent)]/[0.07]">
              <th scope="row" className="px-4 py-3 align-top font-semibold text-[var(--text)]">
                MemoFlow
              </th>
              <td className="px-4 py-3 align-top text-[var(--muted)]">{paidPriceLabel()}</td>
              <td className="px-4 py-3 align-top text-[var(--muted)]">One-time</td>
              <td className="px-4 py-3 align-top text-[var(--muted)]">One-time</td>
              <td className="px-4 py-3 align-top text-[var(--muted)]">On your Mac</td>
              <td className="px-4 py-3 align-top text-[var(--muted)]">No</td>
              <td className="px-4 py-3 align-top text-[var(--muted)]">Yes</td>
            </tr>
            {MEETING_COMPETITORS.map((c) => (
              <tr key={c.name} className="border-b border-[var(--line)] last:border-b-0">
                <th scope="row" className="px-4 py-3 align-top font-medium text-[var(--text)]">
                  <a
                    href={c.url}
                    rel="noopener nofollow"
                    className="underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--muted)]"
                  >
                    {c.name}
                  </a>
                  <span className="mt-1 block text-xs font-normal text-[var(--muted)]/70">
                    {c.tier}
                  </span>
                </th>
                <td className="px-4 py-3 align-top text-[var(--muted)]">{meetingRateLabel(c)}</td>
                <td className="px-4 py-3 align-top text-[var(--muted)]">
                  {meetingTeamYear(c, seats)}
                  {c.minSeats && c.minSeats > 0 && (
                    <span className="mt-1 block text-xs text-[var(--muted)]/70">
                      min {c.minSeats} seats
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-[var(--muted)]">
                  {meetingTeamFiveYear(c, seats)}
                </td>
                <td className="px-4 py-3 align-top text-[var(--muted)]">{c.processing}</td>
                <td className="px-4 py-3 align-top text-[var(--muted)]">{c.bot}</td>
                <td className="px-4 py-3 align-top text-[var(--muted)]">{c.hinglish}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 space-y-1 text-xs leading-relaxed text-[var(--muted)]/80">
        <p>
          Annual billing, which is every vendor&apos;s cheaper number, so the comparison
          is against their best case. Prices verified {MEETING_PRICES_CHECKED} in USD from
          vendor pricing pages; vendors change them without notice.
        </p>
        <p>
          Vendors bill in USD, so the rupee cost moves with the exchange rate. INR figures
          elsewhere on this page are indicative at roughly ₹{USD_INR_ASSUMED} to the
          dollar.
        </p>
      </figcaption>
    </figure>
  );
}
