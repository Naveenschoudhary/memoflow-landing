import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell, { Section, Panel } from '@/components/PageShell';
import CompareTable, { Answer, WhereTheyWin } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import { COMPETITORS } from '@/lib/pricing';
import { faqJsonLd, JsonLd, type Faq } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'A free Wispr Flow alternative for Mac — MemoFlow',
  description:
    'Wispr Flow costs $15/month, or $900 over five years. MemoFlow gives you unlimited on-device dictation free, with meetings unlocked by one payment. An honest comparison, including where Wispr Flow wins.',
  alternates: { canonical: 'https://memoflow.app/compare/wispr-flow-alternative' },
};

const faqs: Faq[] = [
  {
    q: 'Is there a free alternative to Wispr Flow?',
    a: 'Yes. Handy, OpenWhispr and FluidVoice are free, open source and cross-platform. MemoFlow is free for 7 days and then a $20 one-time licence on macOS, with no account. Wispr Flow itself is $15/month after its limited free tier.',
  },
  {
    q: 'How much does Wispr Flow cost over time?',
    a: 'Wispr Flow is $15 per month, which is $180 per year and $900 over five years. Because it is a subscription, that cost continues for as long as you use it. One-time alternatives such as superwhisper at $249 or MemoFlow cost the same in year five as in year one.',
  },
  {
    q: 'Does Wispr Flow work offline?',
    a: 'No. Wispr Flow processes speech in the cloud, which means it needs a connection and your audio leaves your machine. MemoFlow, superwhisper, Handy and FluidVoice all transcribe on your own device and keep working with no network.',
  },
  {
    q: 'What does MemoFlow do that Wispr Flow does not?',
    a: 'MemoFlow records meetings as well as dictating — capturing both sides of a call as separate tracks, writing summaries and action items, and answering questions across your meeting history. It also transcribes Hindi and Hinglish on-device. Wispr Flow is dictation only.',
  },
];

export default function WisprFlowAlternative() {
  return (
    <PageShell
      eyebrow="Comparison"
      title="A free Wispr Flow alternative that runs on your Mac"
      updated="27 August 2026"
    >
      <JsonLd data={faqJsonLd(faqs)} />

      <Panel>
        Wispr Flow is a good product with one structural problem: it is a
        subscription for something your Mac can already do locally. This page lays
        out what that costs over time, what the free alternatives actually are,
        and where Wispr Flow is still the right call.
      </Panel>

      <Section title="Is there a free alternative to Wispr Flow?">
        <Answer>
          Yes — several. Handy, OpenWhispr and FluidVoice are free, open source
          and cross-platform. MemoFlow is free for 7 days, then a $20 one-time
          licence on macOS, with no account. Wispr Flow itself is $15/month once
          you pass its limited free tier.
        </Answer>
        <p>
          The useful distinction is not free versus paid, it is{' '}
          <em>local versus cloud</em>. Every free option here transcribes on your
          own hardware, which is exactly why they can afford to be free: there is
          no server bill to recover. Wispr Flow sends your speech to its servers,
          which is a real recurring cost and the honest reason it charges monthly.
        </p>
      </Section>

      <Section title="What does Wispr Flow cost over five years?">
        <Answer>
          $900. At $15 a month it is $180 a year, and a subscription does not stop
          accruing. That is the number worth comparing against, because one-time
          and free alternatives cost the same in year five as in year one.
        </Answer>
        <CompareTable competitors={COMPETITORS} />
        <p>
          Monthly pricing makes the gap hard to see. $15 reads as small next to
          superwhisper&apos;s $249 until you extend both out and find the
          subscription costs roughly three and a half times more.
        </p>
      </Section>

      <Section title="Does MemoFlow replace Wispr Flow?">
        <Answer>
          For dictation on a Mac, yes — hold a hotkey, speak, release, and clean
          text is typed into whatever has focus, with filler words removed and
          self-corrections applied. For dictation on Windows, Android or iPhone,
          no. MemoFlow is Mac-only.
        </Answer>
        <p>
          MemoFlow also covers ground Wispr Flow does not: it records meetings with
          both sides captured as separate tracks, writes summaries and action
          items, and answers questions across everything you have recorded. That
          part is the paid tier — one payment, described on the{' '}
          <Link href="/pricing" className="text-[var(--text)] underline decoration-[var(--line)] underline-offset-4">
            pricing page
          </Link>
          . Dictation stays free regardless.
        </p>
      </Section>

      <Section title="Which one handles Hindi and Hinglish?">
        <Answer>
          MemoFlow transcribes Hindi in Devanagari and handles Hinglish
          code-switching on-device, using Whisper large-v3 turbo. English words
          dropped into Hindi sentences come out as written rather than being
          forced into one language or the other.
        </Answer>
      </Section>

      <WhereTheyWin>
        <p>
          <strong className="text-[var(--text)]">Wispr Flow wins if you work across devices.</strong>{' '}
          It runs on Mac, Windows, iPhone and Android with one account behind all of
          them. MemoFlow is Mac-only and will not help you dictate on a phone. If
          that is your workflow, the subscription buys something real.
        </p>
        <p>
          <strong className="text-[var(--text)]">Handy or OpenWhispr win if you want zero cost and open source.</strong>{' '}
          Handy has roughly 20k GitHub stars and runs on Mac, Windows and Linux;
          OpenWhispr is MIT licensed. Both are free forever with no paid tier at
          all, and you can read every line of what they run. If you want a free
          dictation tool and nothing else, they are excellent and MemoFlow&apos;s
          meeting features are irrelevant to you.
        </p>
        <p>
          <strong className="text-[var(--text)]">superwhisper wins on maturity.</strong>{' '}
          It has the deepest Mac dictation workflow of anything listed and a longer
          track record than MemoFlow. At $249 it is not cheap, but it is a
          one-time cost and it is very good at the one thing it does.
        </p>
      </WhereTheyWin>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
        <p className="text-lg font-medium text-[var(--text)]">
          Dictation on your Mac, with nothing uploaded. Free for 7 days.
        </p>
        <div className="mt-5">
          <CTAButton>Download MemoFlow for macOS</CTAButton>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]/70">
          macOS 26 · Apple Silicon · no account, no word cap
        </p>
      </div>
    </PageShell>
  );
}
