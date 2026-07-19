import CTAButton from "@/components/CTAButton";
import {
  RecordingWindow,
  SummaryFrame,
  ChatFrame,
  DictationFrame,
  HinglishFrame,
} from "@/components/ui-frames";

const faqs = [
  {
    q: "Is anything uploaded to the cloud?",
    a: "No. Recording, transcription, summaries, and chat all run on your Mac using Apple Intelligence and Whisper on the Neural Engine. Your recordings and transcripts live in a local database on your disk. MemoFlow needs no account and works fully offline.",
  },
  {
    q: "Does it work with Zoom, Google Meet, and Teams?",
    a: "Yes — with any meeting app. MemoFlow captures your microphone and your Mac's system audio, so it hears both sides of any call, labels who said what (You vs. Others), and needs no bots or calendar integrations.",
  },
  {
    q: "Does it really support Hindi and Hinglish?",
    a: "Yes. MemoFlow runs Whisper large-v3 turbo on-device, transcribing Hindi in Devanagari and handling Hinglish code-switching — English words mixed into Hindi sentences come out naturally. Auto-detection picks the right language per meeting.",
  },
  {
    q: "How is this different from Otter, Fireflies, or Granola?",
    a: "Those services process your meetings on their servers. MemoFlow processes everything on your Mac — nothing is uploaded, so nothing can leak, be subpoenaed from a third party, or become training data. It's also the only one with local Hindi and Hinglish support.",
  },
  {
    q: "What does dictation do?",
    a: "Hold a hotkey in any app, speak, and release — clean text is typed into whatever field has focus. MemoFlow removes filler words, fixes punctuation, and applies your self-corrections: say “at 6 o'clock — no, at 7” and it types “at 7 o'clock.” Works in English, Hindi, and Hinglish.",
  },
  {
    q: "What are the system requirements?",
    a: "An Apple Silicon Mac running macOS 26 (Tahoe). Summaries and chat use Apple Intelligence; transcription models download once and run offline afterward.",
  },
  {
    q: "How much does it cost?",
    a: "MemoFlow is free during the beta. No account, no credit card.",
  },
  {
    q: "Can I ask questions about old meetings?",
    a: "Yes — Ask works across your whole library. Answers come only from your transcripts and carry citations; click one and MemoFlow jumps to that exact moment in the recording.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// The app's mark: a waveform mirrored around the centerline (items-center),
// not a bar chart sitting on a baseline.
const WaveMark = () => (
  <span className="flex h-5 items-center gap-[2px]" aria-hidden="true">
    {[8, 14, 20, 14, 8].map((h, i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-[var(--accent)]"
        style={{ height: h }}
      />
    ))}
  </span>
);

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--page)]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <WaveMark />
          MemoFlow
        </a>
        <div className="hidden items-center gap-8 text-sm text-[var(--muted)] sm:flex">
          <a href="#features" className="hover:text-[var(--text)]">Features</a>
          <a href="#privacy" className="hover:text-[var(--text)]">Privacy</a>
          <a href="#hinglish" className="hover:text-[var(--text)]">हिन्दी + English</a>
          <a href="#faq" className="hover:text-[var(--text)]">FAQ</a>
        </div>
        <CTAButton variant="ghost">Download</CTAButton>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-24">
      <p className="mb-4 text-sm font-medium text-[var(--accent)]">
        For macOS · 100% on-device
      </p>
      <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        AI meeting notes that never leave your Mac.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
        MemoFlow records both sides of your meetings, transcribes live, writes
        summaries and action items, and answers questions about what was said —
        in English, हिन्दी, and Hinglish. No cloud. No account. No bots in your
        calls.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <CTAButton>Download for macOS — free beta</CTAButton>
        <a
          href="#features"
          className="px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--text)]"
        >
          See how it works ↓
        </a>
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]/70">
        macOS 26 · Apple Silicon · nothing is ever uploaded
      </p>

      <div className="mt-14">
        <RecordingWindow />
      </div>

      <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--muted)]">
        <li>Apple Intelligence</li>
        <li>Whisper on the Neural Engine</li>
        <li>Local database, your disk</li>
        <li>No account needed</li>
      </ul>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className="border-y border-[var(--line)] bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your meetings are not training data.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
          Cloud notetakers send every word your team says to someone else&apos;s
          servers. MemoFlow runs Apple&apos;s speech models and Whisper directly
          on your Mac&apos;s Neural Engine. The audio, transcripts, summaries,
          and chat history live in a local database you can open in Finder —
          and delete whenever you want.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
          {[
            ["On-device AI", "Apple Intelligence + Whisper, accelerated by the Neural Engine."],
            ["Works offline", "Transcribe and summarize on a plane. Models download once."],
            ["You hold the keys", "No account, no sync, no telemetry on your conversations."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
              <div className="font-semibold">{title}</div>
              <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  visual,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 lg:gap-16 ${
        flip ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      <div className="w-full max-w-md shrink-0">
        <p className="text-sm font-medium text-[var(--accent)]">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 text-[var(--muted)]">{body}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-[var(--accent)]">—</span>
              <span className="text-[var(--muted)]">{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full min-w-0">{visual}</div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-8">
      <FeatureRow
        eyebrow="Meetings"
        title="Both sides of the call, transcribed live."
        body="MemoFlow hears your mic and your Mac's system audio, so every Zoom, Meet, or Teams call is captured with who-said-what — no bot joining your meeting."
        bullets={[
          "Live transcript while you talk, labeled You / Others",
          "Filler words removed, punctuation fixed — original always kept",
          "Summaries, action items, and smart titles on every meeting",
        ]}
        visual={<SummaryFrame />}
      />
      <FeatureRow
        flip
        eyebrow="Ask"
        title="Ask your meetings anything."
        body="A chat that answers only from your transcripts — with citations. Click one and MemoFlow jumps to the exact moment in the recording, so you can hear it said."
        bullets={[
          "Grounded answers — “not discussed” instead of guesses",
          "Works across one meeting or your entire library",
          "Everything indexed locally, searchable in the sidebar",
        ]}
        visual={<ChatFrame />}
      />
      <FeatureRow
        eyebrow="Dictation"
        title="Speak into any app. Corrections included."
        body="Hold ⌥Space, talk, release — polished text is typed into whatever field has focus. Change your mind mid-sentence and MemoFlow keeps only what you meant."
        bullets={[
          "“at 6 o'clock — no, at 7” types “at 7 o'clock.”",
          "Fillers stripped, punctuation and casing fixed",
          "Any shortcut you like — hold-to-talk or toggle",
        ]}
        visual={<DictationFrame />}
      />
    </section>
  );
}

function Hinglish() {
  return (
    <section id="hinglish" className="border-y border-[var(--line)] bg-black/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20 lg:flex-row lg:gap-16">
        <div className="w-full max-w-md shrink-0">
          <p className="text-sm font-medium text-[var(--accent)]">
            Made for how India actually talks
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            <span lang="hi">मीटिंग</span> हो या meeting —<br />
            MemoFlow <span lang="hi">दोनों समझता है।</span>
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            The only private notetaker that transcribes Hindi, English, and the
            Hinglish in between — code-switching mid-sentence, the way real
            meetings sound. Powered by Whisper large-v3 turbo running entirely
            on your Mac.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
            <li>— Hindi in <span lang="hi">देवनागरी</span>, English words kept in English</li>
            <li>— Auto language detection per meeting and per dictation</li>
            <li>— Hindi dictation into any app</li>
          </ul>
        </div>
        <div className="w-full min-w-0">
          <HinglishFrame />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["Install", "Download the notarized app, drag to Applications. No account."],
    ["Grant two permissions", "Microphone and system audio — so both sides of calls are captured."],
    ["Record from anywhere", "Menu bar, ⌘N, or hold fn⇧ in any app. Notes appear when you stop."],
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        Running in two minutes
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map(([title, body], i) => (
          <div key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
            <div className="text-sm font-semibold text-[var(--accent)]">{i + 1}</div>
            <div className="mt-1 font-semibold">{title}</div>
            <p className="mt-1.5 text-sm text-[var(--muted)]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        Questions, answered
      </h2>
      <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {faqs.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="pr-8 font-medium">{f.q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="border-t border-[var(--line)] bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mx-auto mb-8 flex h-12 w-64 items-center">
          <span className="wave w-full" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => (
              <i key={i} />
            ))}
          </span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Your next meeting deserves a private notetaker.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[var(--muted)]">
          Free during beta. macOS 26, Apple Silicon. Nothing you say ever
          leaves your Mac.
        </p>
        <div className="mt-8">
          <CTAButton>Download MemoFlow for macOS</CTAButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-[var(--muted)] sm:flex-row">
        <div className="flex items-center gap-2">
          <WaveMark />
          <span>MemoFlow — private AI meeting notes for Mac</span>
        </div>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-[var(--text)]">Privacy</a>
          <a href="/terms" className="hover:text-[var(--text)]">Terms</a>
          <a href="/release-notes" className="hover:text-[var(--text)]">Release notes</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Nav />
      <Hero />
      <Privacy />
      <Features />
      <Hinglish />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
