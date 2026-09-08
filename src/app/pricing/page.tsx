import type { Metadata } from 'next';
import PageShell, { Section, Panel, Bullets } from '@/components/PageShell';
import { Answer } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import {
  TIERS,
  TRIAL_DAYS,
  PAID_COMPETITORS,
  PRICES_CHECKED,
  checkoutURL,
  memoflowFiveYear,
  type Tier,
} from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Pricing — MemoFlow',
  description:
    'Free for 7 days, then one payment for life. $20 for one person, $40 for three, $300 for a team of up to twenty. Never a subscription.',
  alternates: { canonical: 'https://memoflow.app/pricing' },
};

/**
 * Where the visitor is coming from. The app sends people here with
 * `?from=app&state=expired|trial|revoked`, and the page speaks to that
 * instead of pitching a trial they have already had.
 */
type Arrival = 'web' | 'expired' | 'trial' | 'revoked' | 'unverified';

function arrivalFrom(params: Record<string, string | string[] | undefined>): Arrival {
  if (params.from !== 'app') return 'web';
  const state = Array.isArray(params.state) ? params.state[0] : params.state;
  switch (state) {
    case 'expired':
    case 'trial':
    case 'revoked':
    case 'unverified':
      return state;
    default:
      return 'expired';
  }
}

const HERO: Record<Arrival, { eyebrow: string; title: string; lead: string }> = {
  web: {
    eyebrow: 'Pricing',
    title: `Free for ${TRIAL_DAYS} days. Then one payment, for life.`,
    lead: `Install MemoFlow and use everything — meetings, transcripts, summaries, Ask and dictation — free for ${TRIAL_DAYS} days, no card and no account. If you want to keep going, buy a licence once. There is no subscription, and there never will be.`,
  },
  expired: {
    eyebrow: 'Your trial has ended',
    title: 'Keep MemoFlow. Pay once, own it for life.',
    lead: `Your ${TRIAL_DAYS} days are up, and everything you recorded is still on your Mac. One payment turns recording, dictation, transcription and Ask back on — for good. The key arrives by email within a minute; paste it into Settings › License and you are back where you left off.`,
  },
  trial: {
    eyebrow: 'Your trial',
    title: 'Liked it? Make it yours.',
    lead: `Buy once and MemoFlow is yours for life — no renewal, nothing to cancel. Your trial keeps running to its last day regardless; buying now just means you never see the paywall.`,
  },
  revoked: {
    eyebrow: 'Licence',
    title: 'Get a licence for this Mac.',
    lead: `The key on this Mac is no longer active. If you have a valid key, enter it in Settings › License. Otherwise buy once below and a fresh key arrives by email within a minute.`,
  },
  unverified: {
    eyebrow: 'Licence',
    title: 'Your licence just needs a moment online.',
    lead: `MemoFlow has not been able to reach the licence server for a while. Connect to the internet and open the app; it re-checks the key by itself. If the key has been refunded or disabled, buy once below to get a new one.`,
  },
};

function TierCard({ tier, source }: { tier: Tier; source: 'web' | 'app' }) {
  const href = checkoutURL(tier, source);
  return (
    <div
      className={
        tier.featured
          ? 'relative rounded-2xl border border-[var(--accent)]/50 bg-[var(--panel)] p-6 shadow-lg shadow-[var(--accent)]/10'
          : 'rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6'
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
      <div className="mt-6">
        {href ? (
          <a
            href={href}
            className={
              tier.featured
                ? 'block rounded-xl bg-[var(--accent)] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110'
                : 'block rounded-xl border border-[var(--line)] px-5 py-3 text-center text-sm font-medium text-[var(--text)] transition hover:bg-white/5'
            }
          >
            Buy {tier.name} · ${tier.priceUsd}
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

const TRUST: { title: string; body: string }[] = [
  { title: 'Pay once. Yours for life.', body: 'No renewal, no plan to cancel, nothing that lapses.' },
  { title: '14-day full refund', body: 'Email us and the money comes back. No forms.' },
  { title: 'Card, Apple Pay, Google Pay', body: 'Secure checkout by Dodo Payments, taxes handled.' },
  { title: 'Nothing leaves your Mac', body: 'Recordings, transcripts and notes stay on your disk.' },
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: '1', title: 'Pay', body: 'Checkout takes a minute. No account to create.' },
  { n: '2', title: 'Key by email', body: 'Dodo Payments emails your licence key straight away.' },
  { n: '3', title: 'Paste it in', body: 'MemoFlow › Settings › License › Activate. Done, for life.' },
];

export default async function Pricing({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const arrival = arrivalFrom(await searchParams);
  const fromApp = arrival !== 'web';
  const hero = HERO[arrival];
  const source = fromApp ? 'app' : 'web';
  const personal = TIERS[0];
  const personalHref = checkoutURL(personal, source);

  return (
    <PageShell
      eyebrow={hero.eyebrow}
      title={hero.title}
      updated={fromApp ? undefined : '8 September 2026'}
    >
      <Panel>{hero.lead}</Panel>

      <div className="grid gap-4 pt-3 md:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} source={source} />
        ))}
      </div>
      <p className="-mt-6 text-xs text-[var(--muted)]/80">
        Prices in US dollars; local taxes are added at checkout where they apply.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((item) => (
          <div key={item.title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{item.body}</p>
          </div>
        ))}
      </div>

      <Section title="What happens after you pay">
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
              <p className="text-2xl font-semibold text-[var(--accent)]">{step.n}</p>
              <p className="mt-1 font-medium text-[var(--text)]">{step.title}</p>
              <p className="mt-1 text-sm">{step.body}</p>
            </div>
          ))}
        </div>
        <p className="text-sm">
          Personal covers one Mac and one iPhone. Team is one key for three people; Organisation is
          one key for up to twenty. Moving to a new Mac? Deactivate the old one in Settings and
          activate the new one — same key.
        </p>
      </Section>

      <Section title="What the alternatives cost over five years">
        <div className="overflow-x-auto rounded-2xl border border-[var(--line)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--panel)] text-left text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">App</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Five years</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[var(--line)] bg-[var(--accent)]/[0.07]">
                <th scope="row" className="px-4 py-3 text-left font-semibold text-[var(--text)]">
                  MemoFlow
                </th>
                <td className="px-4 py-3 text-[var(--muted)]">One-time, ${personal.priceUsd}</td>
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{memoflowFiveYear()}</td>
              </tr>
              {PAID_COMPETITORS.map((c) => (
                <tr key={c.name} className="border-t border-[var(--line)]">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--text)]">
                    {c.name}
                  </th>
                  <td className="px-4 py-3 text-[var(--muted)]">{c.model}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{c.fiveYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]/80">
          Competitor prices checked {PRICES_CHECKED}. Dictation tools only; meeting notetakers are
          compared on the blog.
        </p>
      </Section>

      <Section title={`What happens after the ${TRIAL_DAYS} days?`}>
        <Answer>
          Recording, dictation, transcription and Ask pause until you enter a licence key.
          Everything you recorded during the trial stays on your Mac, readable and exportable,
          whether you buy or not.
        </Answer>
      </Section>

      <Section title="Why one payment and not a subscription?">
        <Answer>
          Because MemoFlow costs almost nothing to run. Transcription, summaries and search all
          execute on your own Mac, so there is no per-user server bill to cover every month. A
          subscription would be charging rent for compute you are already paying for.
        </Answer>
        <p>
          That is also why a cheap lifetime price is sustainable: a licence costs nothing to serve
          after the day it is sold, so every payment goes toward continued work on the app.
          MemoFlow is built by one developer. Paying once is what keeps that possible.
        </p>
      </Section>

      <Section title="What if I stop paying, or MemoFlow goes away?">
        <Answer>
          There is nothing to stop paying. Your recordings, transcripts and summaries are files on
          your own disk that stay readable whether or not MemoFlow is still installed.
        </Answer>
        <p>
          Your library lives in{' '}
          <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[13px] text-[var(--text)]">
            ~/Library/Application Support/MemoFlow
          </code>{' '}
          and belongs to you.
        </p>
      </Section>

      <Section title="Refunds">
        <p>
          Full refund within 14 days of purchase, no questions asked — see the{' '}
          <a href="/refunds" className="text-[var(--accent)] hover:underline">
            refund policy
          </a>
          .
        </p>
      </Section>

      {fromApp ? (
        <div className="rounded-2xl border border-[var(--accent)]/40 bg-[var(--panel)] p-8 text-center">
          <p className="text-lg font-medium text-[var(--text)]">
            {arrival === 'trial' ? 'Make it yours.' : 'Pick up where you left off.'}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            One payment, a key by email, thirty seconds in Settings › License.
          </p>
          <div className="mt-5">
            {personalHref ? (
              <a
                href={personalHref}
                className="inline-block rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110"
              >
                Buy Personal · ${personal.priceUsd}
              </a>
            ) : (
              <span className="text-sm text-[var(--muted)]">Purchasing opens shortly.</span>
            )}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]/70">
            Already have a key? Open MemoFlow › Settings › License and paste it in.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
          <p className="text-lg font-medium text-[var(--text)]">
            Try everything free for {TRIAL_DAYS} days. Decide after.
          </p>
          <div className="mt-5">
            <CTAButton>Download MemoFlow for macOS</CTAButton>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]/70">
            macOS 26 · Apple Silicon · nothing is ever uploaded
          </p>
        </div>
      )}
    </PageShell>
  );
}
