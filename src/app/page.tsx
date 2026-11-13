import Link from "next/link";
import { pageMetadata } from '@/lib/pageMetadata';
import CTAButton from "@/components/CTAButton";
import TierCard from "@/components/TierCard";
import { TIERS, TRIAL_DAYS } from "@/lib/pricing";
import { latestRelease } from "@/lib/releaseNotes";
import {
  RecordingWindow,
  SummaryFrame,
  ChatFrame,
  DictationFrame,
  HinglishFrame,
} from "@/components/ui-frames";

export const metadata = pageMetadata(
  '/',
  "AI Meeting Notes for Mac with Hinglish | MemoFlow",
  "Transcribe Hindi, English, and Hinglish meetings on your Mac. Record Zoom, Google Meet, and Teams without a bot and get local AI summaries.",
);

const faqs = [
  {
    q: "Is anything uploaded to the cloud?",
    a: "Recording, transcription, summaries, and chat run on your Mac by default. Audio stays on your device. If you configure a cloud model with your own API key, transcript text can be sent to that provider.",
  },
  {
    q: "Can I transcribe Zoom, Google Meet, or Teams without a bot?",
    a: "Yes. MemoFlow records your microphone and Mac system audio during the call and labels the two sides You and Others. The app runs on your Mac, so no meeting bot joins the call. You can optionally link the recording to a calendar event.",
  },
  {
    q: "Can MemoFlow transcribe Hindi and English in the same meeting?",
    a: "Yes. MemoFlow supports Hinglish, including switches between Hindi and English within a sentence. The on-device Whisper model can write Hindi in Devanagari and keep English words in Latin script.",
  },
  {
    q: "How is this different from Otter, Fireflies, or Granola?",
    a: "MemoFlow captures your microphone and system audio without joining the call as a bot. It transcribes English, Hindi, and Hinglish locally and can generate summaries offline after setup.",
  },
  {
    q: "Can I dictate in Hindi or Hinglish on my Mac?",
    a: "Hold a hotkey in any app, speak, and release — clean text is typed into whatever field has focus. MemoFlow removes filler words, fixes punctuation, and applies your self-corrections: say “at 6 o'clock — no, at 7” and it types “at 7 o'clock.” Works in English, Hindi, and Hinglish.",
  },
  {
    q: "Does meeting transcription work offline on a Mac?",
    a: "Yes. After the one-time model download, MemoFlow can transcribe audio without sending it to a server. Online calls still need an internet connection for Zoom, Google Meet, or Teams.",
  },
  {
    q: "What are the system requirements?",
    a: "An Apple Silicon Mac running macOS 26 (Tahoe). Summaries and chat use Apple Intelligence; transcription models download once and run offline afterward.",
  },
  {
    q: "How much does it cost?",
    a: "Free for 7 days, everything included. After that it's a one-time licence, yours for life: $20 for one person (Mac + iPhone), $40 for three people, $300 for a team of up to twenty. Never a subscription.",
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
          <a href="#pricing" className="hover:text-[var(--text)]">Pricing</a>
          <a href="/blog" className="hover:text-[var(--text)]">Blog</a>
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
        For macOS · On-device by default
      </p>
      <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        Private AI meeting notes for Mac
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
        Record Zoom, Google Meet, and Teams without a meeting bot. MemoFlow
        transcribes both sides on your Mac, even when speakers switch between
        Hindi and English, then turns the conversation into summaries and
        action items.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <CTAButton>Download for macOS — free 7-day trial</CTAButton>
        <a
          href="#features"
          className="px-4 py-3 text-sm text-[var(--muted)] hover:text-[var(--text)]"
        >
          See how it works ↓
        </a>
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]/70">
        macOS 26 · Apple Silicon · recordings stay on your Mac
      </p>
      <a
        href="/release-notes"
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 py-1.5 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
      >
        <span className="font-medium text-[var(--accent)]">New in {latestRelease.version}</span>
        <span className="hidden sm:inline">{latestRelease.headline}</span>
        <span aria-hidden="true">→</span>
      </a>

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
          MemoFlow runs speech recognition on your Mac. Your audio, transcripts,
          summaries, and chat history are stored locally. If you configure a cloud
          model with your own API key, transcript text can be sent to that provider.
          {" "}<Link href="/privacy" className="underline underline-offset-4">Read the privacy policy</Link>.
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
  guide,
  visual,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  guide?: { href: string; label: string };
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
        {guide && (
          <Link href={guide.href} className="mt-5 inline-block text-sm underline underline-offset-4">
            {guide.label}
          </Link>
        )}
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
        title="Bot-free transcription for Zoom, Meet, and Teams"
        body="MemoFlow captures your microphone and Mac system audio in Zoom, Google Meet, and Microsoft Teams without sending a bot into the call."
        bullets={[
          "Live transcript while you talk, labeled You / Others",
          "Filler words removed, punctuation fixed — original always kept",
          "Summaries, action items, and smart titles on every meeting",
        ]}
        guide={{
          href: "/blog/best-meeting-notes-app-mac-india",
          label: "Compare meeting notes apps for Mac",
        }}
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
        title="Offline dictation for Mac"
        body="Hold your dictation shortcut and speak in English, Hindi, or Hinglish. MemoFlow inserts the text into the Mac app you are using, with punctuation and spoken corrections applied."
        bullets={[
          "“at 6 o'clock — no, at 7” types “at 7 o'clock.”",
          "Fillers stripped, punctuation and casing fixed",
          "Any shortcut you like — hold-to-talk or toggle",
        ]}
        guide={{
          href: "/compare/dictation-without-subscription",
          label: "Compare Mac dictation apps without a subscription",
        }}
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
            Hinglish meeting transcription on Mac
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            When a teammate says <span lang="hi">“कल client के साथ meeting है”</span>,
            MemoFlow can keep the Hindi in Devanagari and the English words in
            Latin script. Whisper large-v3 turbo runs on your Mac.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
            <li>— Hindi in <span lang="hi">देवनागरी</span>, English words kept in English</li>
            <li>— Auto language detection per meeting and per dictation</li>
            <li>— Hindi dictation into any app</li>
          </ul>
          <Link href="/blog/best-hinglish-transcription-apps-indian-teams-2026" className="mt-5 inline-block text-sm underline underline-offset-4">
            See the Hinglish transcription demo and comparison
          </Link>
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
    ["Grant the permissions", "Microphone, Accessibility and system audio, on one screen — so both sides of calls are captured and dictation can type."],
    ["Record from anywhere", "Menu bar, ⌘N, or fn ⇥ in any app. Hold fn to dictate. Notes appear when you stop."],
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

function Pricing() {
  return (
    <section id="pricing" className="border-y border-[var(--line)] bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-center text-sm font-medium text-[var(--accent)]">Pricing</p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Free for {TRIAL_DAYS} days. Then one payment, for life.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          Everything is free for {TRIAL_DAYS} days — no card, no account. Keep it with a
          licence you buy once. There is no subscription, and there never will be.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} source="web" />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[var(--muted)]/80">
          US dollars; local taxes added at checkout · card, Apple Pay, Google Pay · 14-day full
          refund ·{" "}
          <a href="/pricing" className="text-[var(--accent)] hover:underline">
            How the licence works →
          </a>
        </p>
      </div>
    </section>
  );
}

function WhatsNew() {
  const release = latestRelease;
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-3xl font-semibold tracking-tight">
          New in MemoFlow {release.version}
        </h2>
        <span className="text-sm text-[var(--muted)]">{release.date}</span>
      </div>
      {release.headline && (
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{release.headline}</p>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {release.groups.slice(0, 6).map((group) => (
          <div key={group.title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <div className="font-semibold">{group.title}</div>
            <p className="mt-1.5 text-sm text-[var(--muted)]">{group.items[0]}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm">
        <a href="/release-notes" className="text-[var(--accent)] hover:underline">
          Full release notes, every version →
        </a>
      </p>
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
          Free for 7 days, then one payment for life. macOS 26, Apple Silicon.
          Recording and transcription run on your Mac.
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
        <div className="flex flex-wrap justify-center gap-6">
          <a href="/pricing" className="hover:text-[var(--text)]">Pricing</a>
          <a href="/compare" className="hover:text-[var(--text)]">Compare</a>
          <a href="/blog" className="hover:text-[var(--text)]">Blog</a>
          <a href="/privacy" className="hover:text-[var(--text)]">Privacy</a>
          <a href="/terms" className="hover:text-[var(--text)]">Terms</a>
          <a href="/refunds" className="hover:text-[var(--text)]">Refunds</a>
          <a href="/support" className="hover:text-[var(--text)]">Support</a>
          <a href="/is-memoflow-legit" className="hover:text-[var(--text)]">Is MemoFlow legit?</a>
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
      <Pricing />
      <WhatsNew />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
