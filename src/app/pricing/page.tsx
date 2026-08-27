import type { Metadata } from 'next';
import PageShell, { Section, Panel, Bullets } from '@/components/PageShell';
import { Answer } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import { PRICING, paidPriceLabel } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Pricing — MemoFlow',
  description:
    'Dictation is free forever. Meetings, summaries and Ask unlock with a single one-time payment — never a subscription.',
  alternates: { canonical: 'https://memoflow.app/pricing' },
};

export default function Pricing() {
  return (
    <PageShell
      eyebrow="Pricing"
      title="Dictation is free. Everything else is one payment."
      updated="27 August 2026"
    >
      <Panel>
        Unlimited on-device dictation is free forever — not a trial, not a word
        cap. The meeting side of MemoFlow unlocks with a single one-time payment.
        There is no subscription, and there never will be.
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
          <h2 className="text-lg font-semibold tracking-tight">{PRICING.free.name}</h2>
          <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
            {PRICING.free.price}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{PRICING.free.tagline}</p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
            {PRICING.free.includes.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[var(--accent)]">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--accent)]/40 bg-[var(--panel)] p-6">
          <h2 className="text-lg font-semibold tracking-tight">{PRICING.paid.name}</h2>
          <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
            {paidPriceLabel()}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">{PRICING.paid.tagline}</p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
            {PRICING.paid.includes.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-[var(--accent)]">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {PRICING.freeDuringBeta && (
            <p className="mt-5 text-xs text-[var(--muted)]/80">
              Free for everyone during the beta. Beta users keep access when the
              paid tier ships.
            </p>
          )}
        </div>
      </div>

      <Section title="Why is MemoFlow a one-time payment and not a subscription?">
        <Answer>
          Because MemoFlow costs almost nothing to run. Transcription, summaries
          and search all execute on your own Mac, so there is no per-user server
          bill that has to be covered every month. A subscription would be
          charging rent for compute you are already paying for.
        </Answer>
        <p>
          Cloud notetakers price monthly because they genuinely have a monthly
          cost — every minute of your audio is uploaded, transcribed and stored on
          someone else&apos;s hardware. MemoFlow never uploads any of it, which
          removes that cost entirely and, more to the point, removes the reason
          your recordings would ever sit on a server in the first place.
        </p>
      </Section>

      <Section title="Is a cheap lifetime price sustainable?">
        <Answer>
          It is sustainable for the same reason it is cheap: no servers to fund.
          The ongoing cost of MemoFlow is development time and an Apple developer
          account, not infrastructure that scales with how much you talk.
        </Answer>
        <p>
          It is a fair thing to ask — cheap lifetime deals have a reputation, and
          usually the reason is that the maths never worked. Here the maths is
          unusually simple. A free dictation user costs nothing to serve, so the
          free tier can stay free without being subsidised by anyone, and a
          one-time payment goes toward continued work on the app rather than
          covering last month&apos;s inference bill.
        </p>
        <p>
          MemoFlow is built by one developer. Paying once is what keeps that
          possible.
        </p>
      </Section>

      <Section title="What happens to my meetings if I stop paying?">
        <Answer>
          Nothing. There is nothing to stop paying. You buy once, and your
          recordings, transcripts and summaries are files on your own disk that
          stay readable whether or not MemoFlow is still installed.
        </Answer>
        <p>
          This is the practical difference between local software and a service.
          A subscription that lapses usually takes your archive with it, or holds
          it behind a re-subscribe wall. Your MemoFlow library lives in{' '}
          <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[13px] text-[var(--text)]">
            ~/Library/Application Support/MemoFlow
          </code>{' '}
          and belongs to you.
        </p>
      </Section>

      <Section title="What do I get for free, exactly?">
        <Answer>
          Unlimited system-wide dictation, on-device, in English, Hindi and
          Hinglish, with no account and no word limit. It is the whole dictation
          product, not a sample of it.
        </Answer>
        <Bullets
          items={[
            'No time limit and no monthly word cap.',
            'No account or sign-in — the app has no login at all.',
            'Works with no network connection once a model has downloaded.',
            'Custom dictation modes, word replacements and per-app behaviour included.',
          ]}
        />
      </Section>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
        <p className="text-lg font-medium text-[var(--text)]">
          Start with free dictation. Decide about the rest later.
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
