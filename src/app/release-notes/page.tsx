import type { Metadata } from 'next';
import PageShell, { Bullets } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Release notes — MemoFlow',
  description: 'What changed in each version of MemoFlow.',
  alternates: { canonical: 'https://memoflow.app/release-notes' },
};

type Release = {
  version: string;
  date: string;
  headline?: string;
  groups: { title: string; items: React.ReactNode[] }[];
};

/** Newest first. Mirrors the GitHub releases on memoflow-models. */
const releases: Release[] = [
  {
    version: '0.5.0',
    date: '27 August 2026',
    headline:
      'Recordings that survive the real world, and a home screen that shows what you have captured.',
    groups: [
      {
        title: 'Dashboard',
        items: [
          'MemoFlow opens on a summary of what it has captured — words dictated and transcribed, meetings recorded, action items extracted, when you dictate, and activity over time.',
        ],
      },
      {
        title: 'Recording keeps going when your mic does not',
        items: [
          'Unplug a headset mid-meeting and the recording moves to another input instead of ending.',
          'Set a preferred order of microphones, so it falls back the way you want rather than to whatever macOS picks.',
          'A warning when your microphone is clipping — clipped audio silently transcribes to nothing.',
          'A short tone when recording starts and stops, often the only confirmation you get when dictating into another app.',
        ],
      },
      {
        title: 'Dictation modes you define',
        items: [
          'Per-app and per-site modes, each with their own engine, prompt and style rules.',
          'Say a mode’s trigger phrase to switch on the fly.',
          'Auto-send: have Return pressed for you after insertion, per mode.',
          'Word replacements, so names and jargon come out spelled your way every time.',
        ],
      },
      {
        title: 'Better answers in Ask',
        items: [
          'Answers render as Markdown — headings, lists, bold.',
          'A question about a standup on a date, or across a range, is answered day by day.',
          'OpenRouter joins Gemini as a cloud provider: one key, any model.',
        ],
      },
      {
        title: 'Transcription and reliability fixes',
        items: [
          'The Hinglish model’s confidence gates are genuinely disabled now — they were gated behind a flag that was never set.',
          'The start tone no longer lands at the head of the dictation buffer, where it made the model return nothing.',
          '“nan” no longer appears in transcripts.',
          'A retention policy that deletes old meeting audio on a schedule while keeping transcripts and summaries.',
          'A diagnostics report, for bug reports.',
        ],
      },
      {
        title: 'Housekeeping',
        items: [
          'What’s New appears once after an update, and any time from Help ▸ What’s New.',
          'Settings fills the window instead of sitting in a narrow column.',
        ],
      },
    ],
  },
  {
    version: '0.4.4',
    date: '23 July 2026',
    groups: [
      {
        title: 'Changes',
        items: [
          'Meeting reminders from Apple Calendar, with a Start Recording button on the card.',
          'A Reminders tab, and Live Activity-style reminder cards.',
          'Hover-to-remove tag chips, and custom tags.',
        ],
      },
    ],
  },
  {
    version: '0.4.2',
    date: '20 July 2026',
    groups: [
      {
        title: 'Changes',
        items: [
          'Optional Gemini cloud intelligence, with your own key, off by default.',
          'Context-aware dictation that matches the app you are writing into.',
          'File @-tagging in Cursor, Windsurf, Antigravity and VS Code.',
        ],
      },
    ],
  },
  {
    version: '0.4.0',
    date: '19 July 2026',
    groups: [
      {
        title: 'Changes',
        items: [
          'MemoFlow updates itself — the first self-updating build.',
        ],
      },
    ],
  },
  {
    version: '0.2.0',
    date: '19 July 2026',
    groups: [
      {
        title: 'Changes',
        items: [
          'Hindi, English and Hinglish transcription with a locally converted Whisper model.',
          'Dictation anywhere on your Mac with a global shortcut.',
          'Ask, for questions across everything you have recorded.',
        ],
      },
    ],
  },
];

export default function ReleaseNotes() {
  return (
    <PageShell eyebrow="Release notes" title="What changed">
      {releases.map((release, index) => (
        <section key={release.version}>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {release.version}
            </h2>
            {index === 0 && (
              <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                Latest
              </span>
            )}
            <span className="text-sm text-[var(--muted)]">{release.date}</span>
          </div>

          {release.headline && (
            <p className="mt-3 text-[var(--muted)]">{release.headline}</p>
          )}

          <div className="mt-5 space-y-5">
            {release.groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium text-[var(--text)]">
                  {group.title}
                </h3>
                <div className="mt-2 text-[var(--muted)]">
                  <Bullets items={group.items} />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm">
            <a
              href={`https://github.com/Naveenschoudhary/memoflow-models/releases/tag/v${release.version}`}
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Download {release.version} →
            </a>
          </p>

          {index < releases.length - 1 && (
            <hr className="mt-10 border-[var(--line)]" />
          )}
        </section>
      ))}
    </PageShell>
  );
}
