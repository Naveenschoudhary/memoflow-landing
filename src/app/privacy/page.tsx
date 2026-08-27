import type { Metadata } from 'next';
import PageShell, { Section, Panel, Bullets } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Privacy — MemoFlow',
  description:
    'What MemoFlow records, where it is stored, and the one case where text leaves your Mac.',
};

export default function Privacy() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Your recordings stay on your Mac."
      updated="27 August 2026"
    >
      <Panel>
        The short version: MemoFlow records and transcribes entirely on your Mac. Your
        audio is never uploaded — not for transcription, not for backup, not ever. The
        only thing that can leave your machine is transcript <em>text</em>, and only if
        you turn on a cloud model yourself.
      </Panel>

      <Section title="What MemoFlow records">
        <Bullets
          items={[
            'Microphone audio, and — if you grant Screen Recording — the audio other participants are producing, saved as two separate tracks.',
            'Transcripts, summaries, action items and tags derived from those recordings.',
            'Text you dictate, along with how long each dictation took.',
          ]}
        />
        <p>
          All of it is written to{' '}
          <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[13px] text-[var(--text)]">
            ~/Library/Application Support/MemoFlow
          </code>{' '}
          — audio as files, everything else in a SQLite database.
        </p>
      </Section>

      <Section title="How that data is protected">
        <p>
          MemoFlow does not add its own encryption layer. Your recordings and database
          are ordinary files, protected by your macOS user account and by FileVault if
          you have it switched on — we recommend you do. Anyone with access to your
          unlocked Mac can read them, exactly as they could read your Documents folder.
        </p>
        <p>
          API keys are the exception: those are stored in the macOS Keychain rather than
          in the database or preferences.
        </p>
      </Section>

      <Section title="Transcription happens on your Mac">
        <p>
          Speech becomes text using models that run locally — Apple&apos;s on-device speech
          recognition, or a Whisper model downloaded to your Mac. Both work with no
          network connection. Audio is never sent anywhere for transcription.
        </p>
      </Section>

      <Section title="Cloud models are optional, and off by default">
        <p>
          You can choose to use Google Gemini or OpenRouter for summaries, chat answers
          and transcript cleanup. This is off unless you enable it and supply your own
          API key. When it is on:
        </p>
        <Bullets
          items={[
            'Transcript text — never audio — is sent to that provider to produce the answer.',
            'Your API key is stored in the macOS Keychain and used only to make those requests.',
            "That provider's own privacy and retention policy then applies to the text you send. With OpenRouter, the text is also passed on to whichever model you select.",
            'If a request fails, MemoFlow falls back to the on-device model rather than retrying elsewhere.',
          ]}
        />
        <p>
          Turning it off in Settings stops it immediately. Dictation polish always runs
          on-device, regardless of this setting.
        </p>
      </Section>

      <Section title="Permissions, and why each is asked for">
        <Bullets
          items={[
            <><strong className="text-[var(--text)]">Microphone</strong> — to record you.</>,
            <><strong className="text-[var(--text)]">Screen Recording</strong> — macOS requires it to capture system audio, which is how other participants are recorded. No video or screenshots are captured.</>,
            <><strong className="text-[var(--text)]">Accessibility</strong> — to type dictated text into the app you are using, and to watch for a modifier-only shortcut.</>,
            <><strong className="text-[var(--text)]">Calendar</strong> — read-only, to show reminders before a meeting starts. Events are read on your Mac and never transmitted.</>,
            <><strong className="text-[var(--text)]">Automation</strong> — only if you create a dictation mode that targets a website, to read the current tab&apos;s address from your browser.</>,
          ]}
        />
      </Section>

      <Section title="What MemoFlow sends us">
        <p>
          Nothing. The app has no account, no sign-in, and no analytics or telemetry. It
          contacts the network only to download a transcription model, to check for
          updates, and to reach a cloud provider you have configured.
        </p>
      </Section>

      <Section title="This website">
        <p>
          If you ask for a download link, we store the email address you give us and
          which platform you asked about, so we can send you the link and let you know
          about updates. There are no third-party analytics or advertising trackers on
          this site.
        </p>
        <p>
          Email us to have that address removed and we will delete it.
        </p>
      </Section>

      <Section title="Deleting your data">
        <p>
          Deleting a meeting in the app removes its recording and transcript. Settings ▸
          Reset removes every meeting, transcript, dictation, chat and setting from your
          Mac. You can also delete the MemoFlow folder in Application Support directly.
          Because none of it was uploaded, that is the whole of it.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If this policy changes in a way that affects what leaves your Mac, the release
          notes will say so plainly rather than pointing at a revised date.
        </p>
      </Section>
    </PageShell>
  );
}
