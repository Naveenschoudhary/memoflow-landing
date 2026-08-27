import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell, { Section, Panel } from '@/components/PageShell';
import CompareTable, { Answer, WhereTheyWin } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import { COMPETITORS } from '@/lib/pricing';
import { faqJsonLd, JsonLd, type Faq } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'A cheaper superwhisper alternative for Mac — MemoFlow',
  description:
    'superwhisper is $249 one-time. MemoFlow gives unlimited on-device dictation free, with meetings unlocked by a single small payment. Honest comparison, including what superwhisper still does better.',
  alternates: { canonical: 'https://memoflow.app/compare/superwhisper-alternative' },
};

const faqs: Faq[] = [
  {
    q: 'Is there a free superwhisper alternative?',
    a: 'Yes. MemoFlow offers unlimited on-device dictation free forever on macOS. Handy, OpenWhispr and FluidVoice are free and open source. superwhisper itself is a $249 one-time purchase, with no permanently free tier.',
  },
  {
    q: 'How much does superwhisper cost?',
    a: 'superwhisper is $249 as a one-time lifetime purchase. Unlike a subscription that figure does not grow, so it is $249 whether you use it for one year or ten. It is the most expensive option listed here up front and among the cheapest over a long enough horizon.',
  },
  {
    q: 'Is superwhisper or MemoFlow better for dictation?',
    a: 'superwhisper has the more mature dictation workflow, with a deeper modes and hotkey system and a longer track record. MemoFlow matches the core loop — hotkey, speak, clean text typed into any app — adds Hindi and Hinglish on-device, and is free.',
  },
  {
    q: 'Does superwhisper record meetings?',
    a: 'No. superwhisper is a dictation tool. MemoFlow also records meetings, capturing your microphone and system audio as separate tracks, then produces summaries, action items and searchable answers across your meeting history.',
  },
];

export default function SuperwhisperAlternative() {
  return (
    <PageShell
      eyebrow="Comparison"
      title="A superwhisper alternative that starts free"
      updated="27 August 2026"
    >
      <JsonLd data={faqJsonLd(faqs)} />

      <Panel>
        superwhisper is the most mature Mac dictation app available and $249 is a
        fair price for it. This page is for people who want to know whether they
        need to spend that, and what they give up if they do not.
      </Panel>

      <Section title="Is there a free superwhisper alternative?">
        <Answer>
          Yes. MemoFlow gives unlimited on-device dictation free forever on macOS
          — no account, no word cap, no trial clock. Handy, OpenWhispr and
          FluidVoice are free and open source. superwhisper has no permanently
          free tier; it is $249 once.
        </Answer>
        <p>
          All of these run the same class of speech model on your own hardware, so
          the accuracy gap between them is far smaller than the price gap. What
          $249 buys at superwhisper is depth and polish in the dictation workflow,
          not fundamentally better transcription.
        </p>
      </Section>

      <Section title="What does each option cost?">
        <Answer>
          superwhisper is $249 once. MacWhisper is around €59 once. Wispr Flow is
          $15 a month, which passes superwhisper&apos;s total in under 17 months.
          MemoFlow, Handy, OpenWhispr and FluidVoice all start at zero.
        </Answer>
        <CompareTable competitors={COMPETITORS} />
        <p>
          Worth noting in superwhisper&apos;s favour: its column does not move.
          Against a $15/month subscription, a one-time $249 is the cheaper choice
          from year two onward — the pricing model is right, it is the entry
          number that is high.
        </p>
      </Section>

      <Section title="What does MemoFlow add that superwhisper does not have?">
        <Answer>
          Meetings. MemoFlow records both sides of a call as separate tracks,
          transcribes live, writes summaries and action items, and answers
          questions across everything you have recorded. superwhisper is dictation
          only, by design.
        </Answer>
        <p>
          It also transcribes Hindi in Devanagari and handles Hinglish
          code-switching on-device, which nothing else in this comparison does.
          The meeting features are the paid tier — a single payment, no
          subscription, laid out on the{' '}
          <Link href="/pricing" className="text-[var(--text)] underline decoration-[var(--line)] underline-offset-4">
            pricing page
          </Link>
          . Dictation is free either way.
        </p>
      </Section>

      <WhereTheyWin title="Where superwhisper is still the better buy">
        <p>
          <strong className="text-[var(--text)]">It is more mature.</strong>{' '}
          superwhisper has been refined over far longer than MemoFlow has existed,
          and it shows in the depth of its modes, its provider options and the
          edges of its workflow. If dictation is the entire job and you want the
          most finished tool, buy it.
        </p>
        <p>
          <strong className="text-[var(--text)]">It has a longer track record.</strong>{' '}
          MemoFlow is new. That is a real consideration when you are choosing
          software you intend to rely on daily for years, and no comparison table
          resolves it in our favour.
        </p>
        <p>
          <strong className="text-[var(--text)]">If you want open source, neither of us qualifies.</strong>{' '}
          Handy and OpenWhispr do. If auditability matters more than features,
          start there rather than with either paid app.
        </p>
      </WhereTheyWin>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
        <p className="text-lg font-medium text-[var(--text)]">
          Try free dictation before spending $249.
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
