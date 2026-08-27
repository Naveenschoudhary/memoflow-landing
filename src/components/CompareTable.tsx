import { type Competitor, memoflowFiveYear, paidPriceLabel, PRICES_CHECKED } from '@/lib/pricing';

/**
 * The pricing comparison, shared by every /compare page.
 *
 * The five-year column is the point of the table. A $15/mo subscription and a
 * $249 one-time purchase look comparable in a feature list and do not look
 * remotely comparable once you extend them, and that difference is the honest
 * argument for how MemoFlow is priced.
 *
 * Wrapped in its own overflow-x container so the page body never scrolls
 * sideways on a phone.
 */
export default function CompareTable({
  competitors,
  caption,
}: {
  competitors: Competitor[];
  caption?: string;
}) {
  return (
    <figure className="not-prose">
      <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--panel)]">
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">App</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">Pricing model</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">1 year</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">5 years</th>
              <th scope="col" className="px-4 py-3 font-semibold text-[var(--text)]">On-device</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)] bg-[var(--accent)]/[0.07]">
              <th scope="row" className="px-4 py-3 font-semibold text-[var(--text)]">MemoFlow</th>
              <td className="px-4 py-3 text-[var(--muted)]">
                Free dictation forever, then {paidPriceLabel().toLowerCase()}
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">{memoflowFiveYear()}</td>
              <td className="px-4 py-3 text-[var(--muted)]">{memoflowFiveYear()}</td>
              <td className="px-4 py-3 text-[var(--muted)]">Yes</td>
            </tr>
            {competitors.map((c) => (
              <tr key={c.name} className="border-b border-[var(--line)] last:border-b-0">
                <th scope="row" className="px-4 py-3 font-medium text-[var(--text)]">
                  <a
                    href={c.url}
                    rel="noopener nofollow"
                    className="underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--muted)]"
                  >
                    {c.name}
                  </a>
                </th>
                <td className="px-4 py-3 text-[var(--muted)]">{c.model}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{c.yearOne}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{c.fiveYear}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{c.local}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-xs text-[var(--muted)]/80">
        {caption ? `${caption} ` : ''}Prices verified {PRICES_CHECKED} and shown in USD;
        vendors change them without notice, so check before you buy.
      </figcaption>
    </figure>
  );
}

/**
 * The 40–60 word direct answer that opens each section.
 *
 * Answer engines retrieve at passage level, so every section has to resolve its
 * own heading before it elaborates — a reader who only sees this block should
 * already have the answer.
 */
export function Answer({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-[var(--accent)] pl-4 text-[var(--text)]">
      {children}
    </p>
  );
}

/**
 * Where a competitor is genuinely the better buy. Every comparison page carries
 * one of these.
 *
 * This is not modesty. Pages that only ever conclude in the author's favour read
 * as promotional and get discounted accordingly, by readers and by the engines
 * summarising them.
 */
export function WhereTheyWin({
  title = 'Where the alternatives are the better choice',
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-[var(--muted)]">{children}</div>
    </section>
  );
}
