import type { Metadata } from 'next';
import PageShell, { Section, Panel, Bullets } from '@/components/PageShell';
import { Answer } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import { TIERS, TRIAL_DAYS, checkoutURL, type Tier } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Pricing — MemoFlow',
  description:
    'Free for 7 days, then one payment for life. $20 for one person, $40 for three, $300 for a team of up to twenty. Never a subscription.',
  alternates: { canonical: 'https://memoflow.app/pricing' },
};

function TierCard({ tier }: { tier: Tier }) {
  const href = checkoutURL(tier);
  return (
    <div
      className={
        tier.featured
          ? 'rounded-2xl border border-[var(--accent)]/40 bg-[var(--panel)] p-6'
          : 'rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6'
      }
    >
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
            Buy {tier.name}
          </a>
        ) : (
          <span className="block rounded-xl border border-[var(--line)] px-5 py-3 text-center text-sm text-[var(--muted)]">
            Available soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <PageShell
      eyebrow="Pricing"
      title={`Free for ${TRIAL_DAYS} days. Then one payment, for life.`}
      updated="8 September 2026"
    >
      <Panel>
        Install MemoFlow and use everything — meetings, transcripts, summaries, Ask and
        dictation — free for {TRIAL_DAYS} days, no card and no account. If you want to keep
        going, buy a licence once. There is no subscription, and there never will be.
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>
      <p className="-mt-6 text-xs text-[var(--muted)]/80">
        Prices in US dollars; local taxes are added at checkout where they apply. Checkout
        and invoicing by Dodo Payments. Card, Apple Pay and Google Pay.
      </p>

      <Section title={`What happens after the ${TRIAL_DAYS} days?`}>
        <Answer>
          Recording, dictation, transcription and Ask pause until you enter a licence
          key. Everything you recorded during the trial stays on your Mac, readable and
          exportable, whether you buy or not.
        </Answer>
        <p>
          There is no card to remove and no plan to cancel — the trial simply ends. Buy
          a licence and paste the key into Settings › License, and you are back where you
          left off.
        </p>
      </Section>

      <Section title="How does the licence work?">
        <Bullets
          items={[
            'You pay once on the Dodo Payments checkout and get a licence key by email within a minute.',
            'Paste the key into MemoFlow › Settings › License. That Mac is unlocked for life.',
            'Personal covers one Mac and one iPhone. Team is one key for three people; Organisation is one key for up to twenty.',
            'Moving to a new Mac? Deactivate the old one in Settings and activate the new one. Same key.',
            'No account, no login — the key is all there is.',
          ]}
        />
      </Section>

      <Section title="Why is MemoFlow a one-time payment and not a subscription?">
        <Answer>
          Because MemoFlow costs almost nothing to run. Transcription, summaries and
          search all execute on your own Mac, so there is no per-user server bill that
          has to be covered every month. A subscription would be charging rent for
          compute you are already paying for.
        </Answer>
        <p>
          Cloud notetakers price monthly because they genuinely have a monthly cost —
          every minute of your audio is uploaded, transcribed and stored on someone
          else&apos;s hardware. MemoFlow never uploads any of it, which removes that
          cost entirely and, more to the point, removes the reason your recordings would
          ever sit on a server in the first place.
        </p>
      </Section>

      <Section title="Is a cheap lifetime price sustainable?">
        <Answer>
          It is sustainable for the same reason it is cheap: no servers to fund. The
          ongoing cost of MemoFlow is development time and an Apple developer account,
          not infrastructure that scales with how much you talk.
        </Answer>
        <p>
          It is a fair thing to ask — cheap lifetime deals have a reputation, and usually
          the reason is that the maths never worked. Here the maths is unusually simple:
          a licence costs nothing to serve after the day it is sold, so every payment
          goes toward continued work on the app rather than last month&apos;s inference
          bill. MemoFlow is built by one developer. Paying once is what keeps that
          possible.
        </p>
      </Section>

      <Section title="What happens to my meetings if I stop paying?">
        <Answer>
          Nothing. There is nothing to stop paying. You buy once, and your recordings,
          transcripts and summaries are files on your own disk that stay readable whether
          or not MemoFlow is still installed.
        </Answer>
        <p>
          Your MemoFlow library lives in{' '}
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
          . The {TRIAL_DAYS}-day trial is there so you rarely need it.
        </p>
      </Section>

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
    </PageShell>
  );
}
