import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import GuideArticle, { guideMetadata } from '@/components/GuideArticle';
import { ArticleSection, Figure, TableOfContents } from '@/components/article';
import { getPost } from '@/lib/posts';

const post = getPost('transcribe-google-meet-mac-without-bot')!;
const toc = [
  { id: 'options', label: 'Choose built-in or local transcription' },
  { id: 'start', label: 'Start a Meet transcript with MemoFlow' },
  { id: 'audio', label: 'Troubleshoot missing audio' },
  { id: 'notes', label: 'Review and share meeting notes' },
];

export const metadata = guideMetadata(post);

export default function TranscribeGoogleMeet() {
  return (
    <GuideArticle post={post} topics={['Google Meet', 'Mac system audio', 'Meeting transcription']}>
      <p className="text-lg leading-relaxed text-[var(--muted)]">
        To transcribe Google Meet on Mac without a bot, you can use Meet’s built-in
        transcription if your account supports it, or capture the call audio on your
        Mac with MemoFlow. MemoFlow records your microphone and the audio Meet plays
        through your Mac, so no separate participant needs to join.
      </p>

      <TableOfContents items={toc} />

      <ArticleSection id="options" title="Google Meet’s built-in transcript or a local Mac app?">
        <p>
          Use Meet’s built-in transcript if you want a Google Drive document and your
          Workspace edition and meeting permissions support it. In Meet, open Meeting
          tools and select Transcribe. Google displays a transcription indicator and
          saves the result in the organiser’s Drive. Check
          {' '}<a href="https://support.google.com/meet/answer/12849897?hl=en" className="underline underline-offset-4">Google’s current Transcripts requirements</a>{' '}
          for eligible plans, supported languages and who can start it.
        </p>
        <p>
          Use MemoFlow when your team allows local recording and you want a transcript on
          your own Mac. The capture works on the audio played by your browser. Use Meet’s built-in feature if you also
          need a transcript saved in Drive. MemoFlow
          needs an Apple Silicon Mac running macOS 26 or later.
        </p>
        <p>
          Let people know before recording and follow your team’s recording policy.
          Local capture starts in MemoFlow and does not turn on Google’s transcription
          indicator. This workflow captures spoken audio. Save relevant chat messages,
          links or slides separately through your normal meeting workflow.
        </p>
      </ArticleSection>

      <ArticleSection id="start" title="Start a Google Meet transcript on your Mac">
        <ol className="list-decimal space-y-3 pl-6">
          <li>
            Install MemoFlow and finish preparing the transcription model in Settings › AI.
            For calls that mix Hindi and English, choose Apex and follow the
            {' '}<Link href="/blog/transcribe-hinglish-meeting-mac" className="underline underline-offset-4">Hinglish test-call guide</Link>.
          </li>
          <li>
            Grant Microphone and Screen &amp; System Audio Recording from MemoFlow’s
            Settings › Permissions. macOS manages these controls in System Settings ›
            Privacy &amp; Security. Relaunch MemoFlow if requested.
          </li>
          <li>
            Join the call in the browser on the same Mac. Start recording in MemoFlow.
            For a test, say one line yourself and ask someone else to say a different one.
            Check that both lines turn up in the transcript before relying on the setup.
          </li>
          <li>
            Stop the recording when the call ends. Open the saved meeting and review its
            transcript before using the summary or action items.
          </li>
        </ol>
        <p>
          The permission names come from
          {' '}<a href="https://support.apple.com/guide/mac-help/control-access-screen-system-audio-recording-mchld6aa7d23/mac" className="underline underline-offset-4">Apple’s system-audio settings guide</a>.
          MemoFlow’s <Link href="/support#setup" className="underline underline-offset-4">permissions help</Link> covers relaunching and other setup issues.
        </p>
      </ArticleSection>

      <ArticleSection id="audio" title="What to check when one side of the call is missing">
        <ul className="list-disc space-y-3 pl-6">
          <li><strong>You can hear the other person, but they are missing from the transcript.</strong> Check that MemoFlow has system-audio permission. Relaunch and make a new test recording.</li>
          <li><strong>Their voice appears but yours does not.</strong> Check the input in MemoFlow as well as the input in Meet. A headset or USB microphone change can leave the apps using different inputs.</li>
          <li><strong>Neither side appears.</strong> Confirm recording started and the transcription model is ready. Replay the recording to distinguish missing audio from audio the model has yet to transcribe.</li>
          <li><strong>Multiple voices are grouped under Others.</strong> System audio can contain everyone on the remote side. Confirm individual names against the conversation before sharing assignments.</li>
        </ul>
      </ArticleSection>

      <ArticleSection id="notes" title="Review and share the notes">
        <p>
          Listen back at the point where a decision was made, check the owner and deadline
          and share the reviewed notes through your team’s usual tools. The recording and
          transcript stay on the Mac by default. If you choose a cloud model with your own
          API key, transcript text may go to that provider.
          {' '}<Link href="/privacy" className="underline underline-offset-4">Read MemoFlow’s privacy policy</Link>.
        </p>
        <p>
          If your team is still choosing a tool, see our
          {' '}<Link href="/blog/best-meeting-notes-app-mac-india" className="underline underline-offset-4">comparison of Mac meeting notes apps for teams in India</Link>.
        </p>
        <Figure {...post.hero} caption="MemoFlow’s meeting library and dashboard. This screenshot shows the app after meetings have been saved." />
      </ArticleSection>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="mb-4">Check both sides of a short Google Meet call in the seven-day Mac trial.</p>
        <CTAButton>Try MemoFlow for macOS</CTAButton>
      </div>
    </GuideArticle>
  );
}
