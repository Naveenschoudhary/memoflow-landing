import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell, { Section, Panel } from '@/components/PageShell';
import CompareTable, { Answer, WhereTheyWin } from '@/components/CompareTable';
import CTAButton from '@/components/CTAButton';
import { COMPETITORS, FREE_COMPETITORS } from '@/lib/pricing';
import { faqJsonLd, JsonLd, type Faq } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'The best free dictation apps for Mac in 2026 — compared',
  description:
    'MemoFlow, Handy, OpenWhispr and FluidVoice all offer free on-device dictation on macOS. What each one is actually best at, and when a paid app is worth it instead.',
  alternates: { canonical: 'https://memoflow.app/compare/free-dictation-app-mac' },
};

const faqs: Faq[] = [
  {
    q: 'What is the best free dictation app for Mac?',
    a: 'It depends on what you need. Handy is the most popular free open-source option and runs on Mac, Windows and Linux. OpenWhispr is MIT licensed with multiple model choices. FluidVoice is fully on-device on macOS. MemoFlow is free for unlimited dictation and additionally records and summarises meetings.',
  },
  {
    q: 'Are free dictation apps as accurate as paid ones?',
    a: 'Largely yes, because most of them run the same underlying models — typically OpenAI Whisper — on your own hardware. Accuracy tracks the model and your microphone far more than the price. What paid apps usually buy is workflow depth, polish and support rather than better transcription.',
  },
  {
    q: 'Do free Mac dictation apps work offline?',
    a: 'The on-device ones do. MemoFlow, Handy, FluidVoice and superwhisper transcribe locally and keep working with no network connection once a model has downloaded. Cloud tools such as Wispr Flow require a connection because your audio is processed on their servers.',
  },
  {
    q: 'Is Apple Dictation good enough?',
    a: 'For short bursts it is fine and it is already installed. The common complaints are timeouts on longer passages and weaker punctuation and formatting. Whisper-based apps generally handle long-form dictation and self-corrections better, which is why this category exists.',
  },
];

export default function FreeDictationAppMac() {
  return (
    <PageShell
      eyebrow="Comparison"
      title="The best free dictation apps for Mac"
      updated="27 August 2026"
    >
      <JsonLd data={faqJsonLd(faqs)} />

      <Panel>
        There are several genuinely free Mac dictation apps, and most of them are
        good. MemoFlow is one of them — but it is not the right answer for
        everyone on this page, and this comparison says where it is not.
      </Panel>

      <Section title="What is the best free dictation app for Mac?">
        <Answer>
          It depends what you want. Handy is the most popular free open-source
          choice and runs on three platforms. OpenWhispr is MIT licensed with
          multiple model options. FluidVoice is fully on-device on macOS. MemoFlow
          is free for unlimited dictation and also records meetings.
        </Answer>
        <p>
          All four transcribe on your own hardware, so none of them charge you
          monthly and none of them send your voice anywhere. The differences are
          about scope and licence, not quality.
        </p>
      </Section>

      <Section title="How the free options compare">
        <Answer>
          Handy, OpenWhispr and FluidVoice are free and open source, dictation
          only, and cost nothing indefinitely. MemoFlow is free for unlimited
          dictation, closed source, Mac only, and adds paid meeting recording on
          top.
        </Answer>
        <CompareTable
          competitors={FREE_COMPETITORS}
          caption="Free options only."
        />
        <p>
          If your requirement is &ldquo;free dictation, nothing more&rdquo;, the
          open-source ones do the job and have the advantage of being auditable.
          MemoFlow is not free beyond its 7-day trial — it earns a mention here
          only if the meeting side is useful to you, or if you need Hindi and
          Hinglish, and it costs $20 once.
        </p>
      </Section>

      <Section title="Are free dictation apps as accurate as paid ones?">
        <Answer>
          Largely yes. Most run the same underlying Whisper models on your own
          machine, so accuracy tracks the model and your microphone far more than
          the price. What paid apps buy is workflow depth, polish and support
          rather than better transcription.
        </Answer>
      </Section>

      <Section title="What does MemoFlow add?">
        <Answer>
          Two things: on-device Hindi and Hinglish transcription, which nothing
          else here offers, and meeting recording — both sides of a call captured
          as separate tracks, with summaries, action items and searchable answers
          across your history.
        </Answer>
        <p>
          MemoFlow is free for 7 days, then one payment for everything — never a
          subscription — see{' '}
          <Link href="/pricing" className="text-[var(--text)] underline decoration-[var(--line)] underline-offset-4">
            pricing
          </Link>
          .
        </p>
      </Section>

      <Section title="When is a paid app worth it instead?">
        <Answer>
          When dictation is central to your work and you want the deepest
          available workflow. superwhisper at $249 is the most refined Mac
          dictation tool made. MacWhisper at around €59 is the best option for
          transcribing recorded audio files in bulk.
        </Answer>
        <CompareTable competitors={COMPETITORS} caption="All options, free and paid." />
      </Section>

      <WhereTheyWin title="Pick something else if…">
        <p>
          <strong className="text-[var(--text)]">…you need Windows or Linux.</strong>{' '}
          MemoFlow is Mac-only. Handy and OpenWhispr are not — either is a better
          answer for a mixed-platform setup.
        </p>
        <p>
          <strong className="text-[var(--text)]">…open source is a requirement.</strong>{' '}
          MemoFlow is closed source. If you need to read what is running on your
          machine, Handy, OpenWhispr and FluidVoice all qualify and MemoFlow does
          not.
        </p>
        <p>
          <strong className="text-[var(--text)]">…you only transcribe existing audio files.</strong>{' '}
          MacWhisper is built for that workflow and does it better.
        </p>
      </WhereTheyWin>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8 text-center">
        <p className="text-lg font-medium text-[var(--text)]">
          Free, unlimited, on-device dictation for your Mac.
        </p>
        <div className="mt-5">
          <CTAButton>Download MemoFlow for macOS</CTAButton>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]/70">
          macOS 26 · Apple Silicon · English, हिन्दी and Hinglish
        </p>
      </div>
    </PageShell>
  );
}
