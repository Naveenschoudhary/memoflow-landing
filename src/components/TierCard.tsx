import { checkoutURL, type Tier } from '@/lib/pricing';

/** One pricing tier, used by /pricing and the home page so they never drift. */
export default function TierCard({ tier, source }: { tier: Tier; source: 'web' | 'app' }) {
  const href = checkoutURL(tier, source);
  return (
    <div
      className={
        tier.featured
          ? 'relative flex flex-col rounded-2xl border border-[var(--accent)]/50 bg-[var(--panel)] p-6 shadow-lg shadow-[var(--accent)]/10'
          : 'flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6'
      }
    >
      {tier.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      )}
      <h2 className="text-lg font-semibold tracking-tight">{tier.name}</h2>
      <p className="mt-1 text-3xl font-semibold text-[var(--text)]">
        ${tier.priceUsd}
        <span className="ml-1 text-sm font-normal text-[var(--muted)]">once</span>
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {tier.seats} · {tier.devices}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
        {tier.includes.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-[var(--accent)]">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        {href ? (
          <a
            href={href}
            className={
              tier.featured
                ? 'block whitespace-nowrap rounded-xl bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110'
                : 'block whitespace-nowrap rounded-xl border border-[var(--line)] px-5 py-3 text-center text-sm font-medium text-[var(--text)] transition hover:bg-white/5'
            }
          >
            Buy for ${tier.priceUsd}
          </a>
        ) : (
          <span className="block rounded-xl border border-[var(--line)] px-5 py-3 text-center text-sm text-[var(--muted)]">
            Available soon
          </span>
        )}
        <p className="mt-2 text-center text-xs text-[var(--muted)]/80">
          One-time · key by email in a minute · 14-day refund
        </p>
      </div>
    </div>
  );
}
