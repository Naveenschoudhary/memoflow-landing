import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import GuideArticle, { guideMetadata } from '@/components/GuideArticle';
import { ArticleSection, Figure, TableOfContents } from '@/components/article';
import { getPost } from '@/lib/posts';

const post = getPost('transcribe-hinglish-meeting-mac')!;
const toc = [
  { id: 'setup', label: 'Set up Hinglish transcription' },
  { id: 'test-call', label: 'Run a two-person test call' },
  { id: 'review', label: 'Review the transcript and action items' },
  { id: 'fixes', label: 'Fix missing audio or language errors' },
];

export const metadata = guideMetadata(post);

export default function TranscribeHinglishMeeting() {
  return (
    <GuideArticle post={post} topics={['Hinglish transcription', 'macOS', 'Meeting notes']}>
      <p className="text-lg leading-relaxed text-[var(--muted)]">
        To transcribe a Hinglish meeting on Mac, select MemoFlow’s Apex transcription model,
        grant microphone and system-audio permissions, and start recording before the call.
        Try it first with a colleague who switches between Hindi and English in the same sentence.
        Check both sides of the conversation and review names, dates and decisions before sharing the notes.
      </p>

      <TableOfContents items={toc} />

      <ArticleSection id="setup" title="Set up Hinglish transcription on your Mac">
        <ol className="list-decimal space-y-3 pl-6">
          <li>
            Install MemoFlow on an Apple Silicon Mac running macOS 26 or later. Open
            <strong> Settings › AI</strong>, select Apex for meeting transcription, and finish
            downloading the model. Allow time for the first optimisation before your call.
          </li>
          <li>
            Open <strong>Settings › Permissions</strong> in MemoFlow. Enable Microphone for your
            voice and Screen &amp; System Audio Recording for the other side. If MemoFlow prompts
            you to relaunch, do so before starting the test.
          </li>
          <li>
            Ask the other participant if you can record. Join the call on the Mac running MemoFlow,
            then start recording in MemoFlow. The app captures microphone and system audio locally
            without adding a participant to the call.
          </li>
        </ol>
        <p>
          MemoFlow uses the local <a href="https://huggingface.co/Oriserve/Whisper-Hindi2Hinglish-Apex" className="underline underline-offset-4">Oriserve Apex speech model</a> for this workflow.
          See <Link href="/support#transcription" className="underline underline-offset-4">MemoFlow’s model setup help</Link> if
          the download is still preparing. For a browser-based call, follow the
          {' '}<Link href="/blog/transcribe-google-meet-mac-without-bot" className="underline underline-offset-4">Google Meet setup and audio checks</Link>.
        </p>
      </ArticleSection>

      <ArticleSection id="test-call" title="Run a short Hinglish test call">
        <p>
          Read one line each, leaving a pause between speakers. The script below is a practice
          exercise using fictitious details. Compare your actual transcript with the script and
          keep the original result so you can see where it needs editing.
        </p>
        <blockquote className="space-y-3 border-l-2 border-[var(--accent)] pl-4">
          <p><strong>You</strong> <span lang="hi">“कल की client demo का scope freeze कर दो। Priya, Tuesday को revised deck भेज देना।”</span></p>
          <p><strong>Other participant</strong> <span lang="hi">“Tuesday नहीं, Wednesday। मैं revised deck Wednesday को भेज दूँगी।”</span></p>
        </blockquote>
        <p>
          Check that the transcript kept <strong>Priya</strong> and <strong>revised deck</strong>,
          and that the correction from Tuesday to Wednesday is visible. Hindi may appear in
          Devanagari or in Latin script depending on the output. Choose the script your team
          can review comfortably and check that the words still carry the same meaning.
        </p>
        <p>
          MemoFlow’s published demo shows a mixed-language sentence typed into a Mac app.
          It shows what dictation output looks like. Use the two-person exercise above to
          evaluate meeting capture and transcription on your own setup.
        </p>
        <Figure
          src="/blog/hinglish-transcription-2026/hinglish-dictation-poster.webp"
          alt="A still from MemoFlow’s Hinglish dictation demo on macOS."
          width={1600}
          height={280}
          caption={<Link href="/blog/best-hinglish-transcription-apps-indian-teams-2026#what-to-look-for" className="underline underline-offset-4">Watch the published Hinglish dictation demo</Link>}
        />
      </ArticleSection>

      <ArticleSection id="review" title="Review the transcript and action items">
        <p>
          Stop the recording and open the saved meeting. Check a line from each audio source.
          <strong> You</strong> refers to the microphone track. <strong>Others</strong> refers
          to system audio and can contain multiple remote speakers. Confirm the owner in the
          conversation before assigning an action item.
        </p>
        <p>
          The example above should result in an action item for Priya to send the revised
          deck on Wednesday. If a summary repeats Tuesday, check the transcript against the
          audio and correct the date before sharing. Do the same for prices, times and
          names, especially when someone corrects themselves or talks over another person.
        </p>
        <p>
          MemoFlow stores recordings locally and can transcribe without an internet connection
          once the model is ready. The video call itself still needs internet access. If you
          explicitly configure a cloud model with your own API key, transcript text may be sent
          to that provider. See <Link href="/privacy" className="underline underline-offset-4">how MemoFlow handles recordings and transcript text</Link>.
        </p>
      </ArticleSection>

      <ArticleSection id="fixes" title="Fix missing audio or language errors">
        <ul className="list-disc space-y-3 pl-6">
          <li><strong>Only your voice appears.</strong> Check Screen &amp; System Audio Recording, relaunch MemoFlow if prompted, and record a fresh clip with the other person speaking.</li>
          <li><strong>Only the other voice appears.</strong> Check the microphone permission, the selected input and its level. Test with the mic you plan to use on the call.</li>
          <li><strong>Hindi words are skipped.</strong> Confirm Apex is selected for meeting transcription and has finished preparing. Try a clean sample without overlapping speakers before testing a noisy call.</li>
          <li><strong>The transcript is right but the action item is wrong.</strong> Check the original audio around the correction and fix the notes before circulating them.</li>
        </ul>
      </ArticleSection>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="mb-4">Try the script on a short practice call with the seven-day Mac trial.</p>
        <CTAButton>Try MemoFlow for macOS</CTAButton>
      </div>
    </GuideArticle>
  );
}
