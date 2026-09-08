import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell, { Section, Panel } from '@/components/PageShell';
import CompareTable, { Answer, WhereTheyWin } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import { COMPETITORS, PAID_COMPETITORS } from '@/lib/pricing';
import { faqJsonLd, JsonLd, type Faq } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Mac dictation without a subscription — the pay-once options',
  description:
    'Wispr Flow is $900 over five years. superwhisper, MacWhisper and MemoFlow are one-time purchases. Every Mac dictation app that does not charge monthly, compared.',
  alternates: {
    canonical: 'https://memoflow.app/compare/dictation-without-subscription',
  },
};

const faqs: Faq[] = [
  {
    q: 'Is there a Mac dictation app without a subscription?',
    a: 'Yes, several. superwhisper is $249 one-time, MacWhisper is around €59 one-time, and MemoFlow is free for dictation with a single one-time payment for meeting features. Handy, OpenWhispr and FluidVoice are free and open source with no paid tier at all.',
  },
  {
    q: 'Why do some dictation apps charge monthly?',
    a: 'Because they transcribe in the cloud. Sending audio to a server and running a model on it costs money every time, so that cost has to be recovered monthly. Apps that transcribe on your own device have no such per-use cost, which is why they can charge once or nothing.',
  },
  {
    q: 'Which is cheaper long term, a subscription or a one-time purchase?',
    a: 'A one-time purchase, on almost any horizon. Wispr Flow at $15 a month reaches $180 in year one and $900 by year five. superwhisper at $249 stays $249. The subscription passes the one-time purchase in under 17 months.',
  },
  {
    q: 'Are lifetime licences for software trustworthy?',
    a: 'It depends on the cost structure behind them. A lifetime price is sustainable when the software has no per-user running cost, which is the case for apps that transcribe on your own hardware. It is riskier when the vendor pays for cloud compute on every use, because that bill continues after the payment stops.',
  },
];

export default function DictationWithoutSubscription() {
  return (
    <PageShell
      eyebrow="Comparison"
      title="Mac dictation without a subscription"
      updated="27 August 2026"
    >
      <JsonLd data={faqJsonLd(faqs)} />

      <Panel>
        Most people searching for a &ldquo;free&rdquo; dictation app do not
        literally mean zero. They mean they do not want to rent their keyboard.
        This page covers every Mac option that charges once — or not at all.
      </Panel>

      <Section title="Is there a Mac dictation app without a subscription?">
        <Answer>
          Yes, several. superwhisper is $249 once. MacWhisper is around €59 once.
          MemoFlow is free for unlimited dictation, with a single one-time payment
          for meetings. Handy, OpenWhispr and FluidVoice are free and open source
          with no paid tier at all.
        </Answer>
        <p>
          Only one widely-recommended Mac dictation app is subscription-only, and
          that is Wispr Flow. The rest of the category has settled on paying once,
          which is a direct consequence of where the transcription runs.
        </p>
      </Section>

      <Section title="Why do some dictation apps charge monthly?">
        <Answer>
          Because they transcribe in the cloud. Uploading audio and running a
          model on a server costs the vendor money every single time you speak, so
          that has to be recovered monthly. Apps that transcribe on your own
          device carry no per-use cost at all.
        </Answer>
        <p>
          This is worth understanding before comparing prices, because it explains
          which business models are structural and which are choices. A cloud
          transcription service genuinely cannot be a one-time purchase. A local
          one genuinely can — and if a local app still charges monthly, that is a
          decision rather than a necessity.
        </p>
      </Section>

      <Section title="What does a subscription actually cost over five years?">
        <Answer>
          $900 at $15 a month. That is roughly three and a half times
          superwhisper&apos;s one-time $249, and fourteen times MacWhisper&apos;s
          €59. The crossover point where the subscription becomes the more
          expensive choice arrives in under 17 months.
        </Answer>
        <CompareTable competitors={COMPETITORS} />
      </Section>

      <Section title="Which pay-once app should I choose?">
        <Answer>
          superwhisper if you want the deepest Mac dictation workflow and the
          $249 is not an obstacle. MacWhisper if you mainly transcribe recorded
          audio files. MemoFlow if you want dictation and meeting recording
          together for one small payment, after a 7-day trial.
        </Answer>
        <CompareTable competitors={PAID_COMPETITORS} caption="Pay-once options only." />
        <p>
          MemoFlow&apos;s dictation is free with no cap, so the comparison costs
          nothing to run yourself — see the{' '}
          <Link href="/pricing" className="text-[var(--text)] underline decoration-[var(--line)] underline-offset-4">
            pricing page
          </Link>{' '}
          for what the paid tier covers and why it is priced the way it is.
        </p>
      </Section>

      <Section title="Are lifetime licences trustworthy?">
        <Answer>
          It depends on the cost structure behind the promise. A lifetime price is
          sustainable when the software has no per-user running cost — which is
          true of anything transcribing on your own hardware. It is riskier when
          the vendor pays for cloud compute every time you use it.
        </Answer>
        <p>
          That is the question worth asking of any pay-once app, including this
          one. If a vendor is absorbing a recurring bill in exchange for a
          single payment, the arithmetic eventually forces a change. If there is
          no recurring bill, there is nothing to force.
        </p>
      </Section>

      <WhereTheyWin title="When a subscription is genuinely the better deal">
        <p>
          <strong className="text-[var(--text)]">When you need every platform.</strong>{' '}
          Wispr Flow covers Mac, Windows, iPhone and Android under one account.
          None of the pay-once options here do that — MemoFlow, superwhisper and
          MacWhisper are all Mac-only. Paying monthly for genuine cross-device
          coverage is a reasonable trade.
        </p>
        <p>
          <strong className="text-[var(--text)]">When you want the vendor on the hook continuously.</strong>{' '}
          A subscription funds ongoing development in a way a one-time payment
          does not, and there is a real argument that it aligns incentives better
          over a long period.
        </p>
        <p>
          <strong className="text-[var(--text)]">When you will only use it briefly.</strong>{' '}
          For a two-month project, $30 of subscription beats $249 up front.
        </p>
      </WhereTheyWin>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
        <p className="text-lg font-medium text-[var(--text)]">
          Dictate free. Pay once, if you ever want the rest.
        </p>
        <div className="mt-5">
          <CTAButton>Download MemoFlow for macOS</CTAButton>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]/70">
          macOS 26 · Apple Silicon · no subscription, ever
        </p>
      </div>
    </PageShell>
  );
}
