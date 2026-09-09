import type { Metadata } from 'next';
import PageShell, { Section, Panel } from '@/components/PageShell';
import { faqJsonLd, JsonLd, type Faq } from '@/lib/jsonld';
import { TIERS } from '@/lib/pricing';
import { latestRelease } from '@/lib/releaseNotes';

export const metadata: Metadata = {
  title: 'Is MemoFlow legit? How to check for yourself — MemoFlow',
  description:
    'MemoFlow is a Mac app by an independent developer, signed and notarized by Apple, with nothing uploaded from your Mac. Here is who makes it, what it connects to, how paying works, and the commands that let you verify every claim yourself.',
  alternates: { canonical: 'https://memoflow.app/is-memoflow-legit' },
};

const SUPPORT = 'hello@naveenschoudhary.com';

const faqs: Faq[] = [
  {
    q: 'Is MemoFlow safe to install?',
    a: 'Yes. The download is signed with an Apple Developer ID and notarized by Apple, so macOS Gatekeeper checks it before the first launch. You can confirm the signature yourself with the codesign command shown on this page; it prints "Developer ID Application: Naveen S Choudhary".',
  },
  {
    q: 'Does MemoFlow upload my recordings or transcripts?',
    a: 'No. Recording, transcription, summaries and search all run on your Mac. Recordings and transcripts live in a local database in your Library folder. The app connects to the internet only to check for updates, download speech models once, verify a licence key, and — only if you add your own API key — reach a cloud model you chose.',
  },
  {
    q: 'Is MemoFlow a subscription?',
    a: 'No. Everything is free for 7 days, then a single one-time licence: $20 for one person, $40 for three, $300 for up to twenty. There is no renewal and nothing to cancel.',
  },
  {
    q: 'Who takes the payment, and can I get a refund?',
    a: 'Dodo Payments handles the checkout, the invoice and any sales tax as merchant of record; MemoFlow never sees your card. A full refund within 14 days of purchase is available by email, no questions asked.',
  },
  {
    q: 'Who makes MemoFlow?',
    a: 'Naveen S Choudhary, an independent developer in India. There is no company behind it beyond his Apple Developer account, and he answers the support address personally.',
  },
  {
    q: 'Is this the same MemoFlow as the apps on Google Play or the iPhone App Store?',
    a: 'No. Several unrelated products share the name. This page is about the macOS app distributed from memoflow.app; it is not on any app store and has no Android or iPhone version.',
  },
  {
    q: 'Why does MemoFlow ask for Screen Recording permission?',
    a: 'To hear the other side of a call. macOS only offers system audio through the Screen & System Audio Recording permission, so MemoFlow configures the smallest possible video frame, discards it, and keeps only the audio. It never captures your screen. Recording works without this permission using the microphone alone.',
  },
];

/** Every claim beside the thing that lets you check it without trusting us. */
const CHECKS: { claim: string; how: React.ReactNode }[] = [
  {
    claim: 'The download is signed and notarized by Apple.',
    how: (
      <>
        <p>After installing, run this in Terminal:</p>
        <Code>codesign -dv --verbose=2 /Applications/MemoFlow.app</Code>
        <p>
          The output includes <code className="inline">Authority=Developer ID Application: Naveen S Choudhary (J96MH3SSPT)</code>.
          Gatekeeper performs the same check before the first launch; a tampered or unsigned build would be blocked.
        </p>
      </>
    ),
  },
  {
    claim: 'Nothing you record leaves your Mac.',
    how: (
      <>
        <p>
          Watch the app&apos;s network activity with Little Snitch, LuLu, or Apple&apos;s own{' '}
          <code className="inline">nettop</code>. You will see connections only to the hosts listed below, and none of them
          carry audio or text — the largest transfers are model files coming <em>in</em>, once.
        </p>
        <p>
          Your data sits in{' '}
          <code className="inline">~/Library/Application Support/MemoFlow</code>: a SQLite database and a Recordings
          folder you can open in Finder.
        </p>
      </>
    ),
  },
  {
    claim: 'Every version is public, with dates and notes.',
    how: (
      <p>
        Builds are published as{' '}
        <a href="https://github.com/Naveenschoudhary/memoflow-models/releases" className="text-[var(--accent)] hover:underline" rel="noopener">
          GitHub releases
        </a>{' '}
        with release notes, and the app updates through Sparkle from that same feed. The current version is{' '}
        {latestRelease.version} ({latestRelease.date}); the full history is on the{' '}
        <a href="/release-notes" className="text-[var(--accent)] hover:underline">release notes</a> page.
      </p>
    ),
  },
  {
    claim: 'The price is one payment, and it is written down.',
    how: (
      <p>
        <a href="/pricing" className="text-[var(--accent)] hover:underline">The pricing page</a> lists the three tiers
        ({TIERS.map((t) => `$${t.priceUsd}`).join(', ')}) and the 7-day trial. Checkout is run by Dodo Payments, a
        merchant of record, which issues the invoice and handles tax; the{' '}
        <a href="/refunds" className="text-[var(--accent)] hover:underline">refund policy</a> is 14 days, no questions.
      </p>
    ),
  },
  {
    claim: 'There is no account, and no tracking on the app.',
    how: (
      <p>
        Open the app: there is no sign-up, no login, and no analytics library in it. What the website and the app
        collect is described in plain words on the{' '}
        <a href="/privacy" className="text-[var(--accent)] hover:underline">privacy page</a>.
      </p>
    ),
  },
];

/** Exactly what the app connects to, so the claim above can be checked. */
const HOSTS: { host: string; why: string }[] = [
  { host: 'memoflow.app', why: 'Licence key activation and its occasional re-check. Sends the key and your Mac’s name, nothing else.' },
  { host: 'github.com', why: 'The update feed and downloads of new versions. Also a mirror for the Hindi/English speech model.' },
  { host: 'pub-…r2.dev (Cloudflare)', why: 'The primary download of the Hindi/English speech model, about 1.6 GB, once.' },
  { host: 'huggingface.co', why: 'The Parakeet English speech model, about 600 MB, once, if you choose that engine.' },
  { host: 'Apple', why: 'The on-device speech and language model assets macOS downloads for Apple Intelligence.' },
  { host: 'live.dodopayments.com', why: 'Fallback for the licence check if memoflow.app is unreachable.' },
  { host: 'openrouter.ai, generativelanguage.googleapis.com', why: 'Only if you add your own OpenRouter or Gemini key in Settings for cloud summaries. Off by default; transcript text is sent to the provider you chose, under their terms.' },
];

export default function IsMemoFlowLegit() {
  return (
    <PageShell eyebrow="Trust" title="Is MemoFlow legit?" updated="9 September 2026">
      <JsonLd data={faqJsonLd(faqs)} />

      <Panel>
        Yes — and you should not have to take our word for it. MemoFlow is a macOS app made by one independent
        developer, signed and notarized by Apple, sold for a single payment through a merchant of record, and built so
        that nothing you record leaves your Mac. Each of those claims can be checked without trusting this page, and
        the checks are below.
      </Panel>

      <Section title="Check it yourself">
        <div className="overflow-hidden rounded-2xl border border-[var(--line)]">
          {CHECKS.map((row, i) => (
            <div
              key={row.claim}
              className={`grid gap-3 p-5 sm:grid-cols-[1fr_1.6fr] sm:gap-8 ${i > 0 ? 'border-t border-[var(--line)]' : ''}`}
            >
              <p className="min-w-0 font-medium text-[var(--text)]">{row.claim}</p>
              <div className="min-w-0 space-y-3 text-sm leading-relaxed text-[var(--muted)] [&_code.inline]:rounded [&_code.inline]:bg-[var(--panel-2)] [&_code.inline]:px-1.5 [&_code.inline]:py-0.5 [&_code.inline]:text-[13px] [&_code.inline]:text-[var(--text)]">
                {row.how}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Who makes it">
        <p>
          Naveen S Choudhary, an independent developer in India, working alone. The Apple Developer ID on every
          build carries his name, the support address is his, and he answers it himself — usually within a business
          day, Indian time. There is no company, no investors, and no plan to move the product to a subscription:
          the app costs almost nothing to run because the work happens on your Mac, which is what makes a one-time
          price sustainable.
        </p>
        <p>
          MemoFlow started as a tool for meetings in Hindi, English and Hinglish, which cloud notetakers handle poorly,
          and grew from there. The Hindi model is a fine-tune of OpenAI&apos;s Whisper by Oriserve; English uses
          NVIDIA&apos;s Parakeet. Both run locally, credited in the app under Help › Acknowledgements.
        </p>
      </Section>

      <Section title="What the app connects to, exactly">
        <p>
          This is the complete list. Anything not here is something the app does not do.
        </p>
        <dl className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)]">
          {HOSTS.map((h) => (
            <div key={h.host} className="grid gap-1 p-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
              <dt className="min-w-0 break-words font-mono text-[13px] text-[var(--text)]">{h.host}</dt>
              <dd className="min-w-0 text-sm leading-relaxed">{h.why}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="What MemoFlow is not">
        <p>
          <strong className="text-[var(--text)]">Not the other MemoFlows.</strong> Several unrelated products use the
          name — note-taking apps on Google Play, an iPhone voice-notes app, a learning tool. This site, memoflow.app,
          is the macOS app only. It is not on any app store, and it has no Android or iPhone version yet.
        </p>
        <p>
          <strong className="text-[var(--text)]">Not a bot in your calls.</strong> Nothing joins your meeting or
          appears to other participants. MemoFlow records the audio your Mac already plays and picks up.
        </p>
        <p>
          <strong className="text-[var(--text)]">Not a subscription.</strong> A 7-day trial, then one payment. Your
          recordings and notes stay readable on your disk whether you buy or not.
        </p>
      </Section>

      <Section title="Questions people ask before installing">
        <div className="space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-medium text-[var(--text)]">{f.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8">
        <p className="text-lg font-medium text-[var(--text)]">Still unsure? Ask a person.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Write to{' '}
          <a href={`mailto:${SUPPORT}`} className="text-[var(--accent)] hover:underline">{SUPPORT}</a>. Naveen reads
          every message. If a question here is unanswered, it will be added to this page.
        </p>
      </div>
    </PageShell>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="max-w-full overflow-x-auto rounded-xl bg-[var(--panel-2)] px-4 py-3 font-mono text-[13px] leading-relaxed text-[var(--text)]">
      {children}
    </pre>
  );
}
