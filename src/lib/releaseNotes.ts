import type { ReactNode } from 'react';

/**
 * Every release, newest first. Mirrors the GitHub releases on memoflow-models.
 * The release-notes page renders all of it; the home page shows `latest`.
 */
export type Release = {
  version: string;
  date: string;
  headline?: string;
  groups: { title: string; items: ReactNode[] }[];
};

/** Newest first. Mirrors the GitHub releases on memoflow-models. */
export const releases: Release[] = [
  {
    version: '0.6.0',
    date: '8 September 2026',
    headline:
      'A 7-day trial and a one-time licence, shortcuts you learn by doing, and Parakeet for English.',
    groups: [
      {
        title: 'Trial and licence',
        items: [
          'Everything is free for 7 days from the first launch of this version. After that, recording, dictation, transcription and Ask need a licence key; everything already recorded stays readable and exportable.',
          'One-time licence, never a subscription: Personal $20 (one Mac and one iPhone), Team $40 (three people), Organisation $300 (up to twenty). Keys are issued by Dodo Payments at checkout and entered in Settings › License.',
          'The app re-checks the key on launch and daily; a refunded or disabled key locks at the next launch. Deactivate this Mac from Settings to move the key to another.',
        ],
      },
      {
        title: 'Onboarding, redesigned',
        items: [
          'Four screens in their own window instead of six inside the main window.',
          'All permissions on one screen — Microphone, Accessibility and System Audio — with status that updates the moment you grant them, and a Relaunch button when macOS needs one for system audio.',
          'The System Audio request now actually registers MemoFlow in System Settings; before, the pane opened with no MemoFlow row to switch on.',
          'Model downloads show real progress and each phase — downloading, optimizing, ready — in onboarding and in Settings.',
          'Shortcuts are learned by doing: hold fn to dictate, double-tap fn to lock hands-free, fn ⇥ to start a meeting, rehearsed live. New installs get these defaults; existing shortcuts are unchanged.',
        ],
      },
      {
        title: 'Parakeet v3',
        items: [
          'A second local engine: English plus 25 European languages and Japanese, around 180× faster than real time, with nothing to optimize after the download. Recommended by default on English-first Macs; Hindi and Hinglish stay with the Apex model.',
          'Parakeet-TDT 0.6B v3 is by NVIDIA (CC BY 4.0), run through FluidAudio’s Core ML conversion.',
        ],
      },
      {
        title: 'Updates',
        items: [
          'A new version shows in the sidebar and the menu bar with an Install button, and once as a popup.',
          'A version that has to be retired asks you to update before continuing; nothing already recorded is affected.',
        ],
      },
      {
        title: 'Fixes',
        items: [
          'fn+Tab as a shortcut no longer hijacks the plain Tab key system-wide.',
          'Deleting a model updates the card immediately, and a delete no longer triggers a re-download.',
          'The Parakeet download shows a progress bar rather than sitting on “Loading…”.',
          'The meeting-recording shortcut re-arms itself when the Accessibility permission is granted.',
        ],
      },
    ],
  },
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

export const latestRelease = releases[0];
