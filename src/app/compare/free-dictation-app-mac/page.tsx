import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import PageShell, { Panel, Section } from '@/components/PageShell';
import { ArticleFaq, DataTable } from '@/components/article';
import { pageMetadata } from '@/lib/pageMetadata';
import { PRICING, TRIAL_DAYS } from '@/lib/pricing';

export const metadata = pageMetadata(
  '/compare/free-dictation-app-mac',
  'Best Free Dictation Apps for Mac: OpenWhispr vs Handy',
  'Compare OpenWhispr, Handy and FluidVoice for free offline Mac dictation. Use the same English and Hinglish samples to find the right app for you.',
);

const faqs = [
  {
    q: 'Which free Mac dictation app should I try first?',
    a: 'Try Handy for a simple offline shortcut. Choose OpenWhispr if you want local dictation with optional cloud features, or FluidVoice if you want to try several Mac speech models and local text cleanup.',
  },
  {
    q: 'Does multilingual dictation handle Hinglish?',
    a: 'It depends on the model. Test a sentence that switches between Hindi and English, with a name, a number and a deadline. Check whether the words and their meaning survive the switch.',
  },
  {
    q: 'Is MemoFlow dictation free?',
    a: `MemoFlow includes dictation and meeting notes in a ${TRIAL_DAYS}-day trial. A one-time licence starts at $${PRICING.priceUsd} after the trial.`,
  },
];

export default function FreeDictationAppMac() {
  return (
    <PageShell eyebrow="Comparison" title="Best free dictation apps for Mac" updated="14 November 2026">
      <Panel>
        Start with Handy if you want a free offline shortcut that types into the active
        app. Try OpenWhispr if you want to choose between local and cloud processing,
        or FluidVoice if you want more control over speech models and local text
        cleanup. If you also need bot-free meeting notes, try MemoFlow for {TRIAL_DAYS} days.
      </Panel>

      <Section title="OpenWhispr vs Handy vs FluidVoice">
        <DataTable
          columns={['App', 'Free use', 'Offline setup on Mac', 'Choose it for']}
          rows={[
            ['Handy', 'Free and open source', 'Download a local speech model and set a shortcut', 'A small, cross-platform dictation app'],
            ['OpenWhispr', 'Unlimited local dictation. Cloud and meeting features have plan limits.', 'Select and download a local model. Check whether cleanup uses the cloud.', 'Local dictation with optional cloud features'],
            ['FluidVoice', 'Free core dictation', 'Select a local speech model. Check enhancement settings separately.', 'Mac model choice and optional local cleanup'],
            ['MemoFlow', `${TRIAL_DAYS}-day trial, then a one-time licence from $${PRICING.priceUsd}`, 'Prepare the Apex model for Hindi or Hinglish', 'Dictation and local meeting notes in one Mac app'],
          ]}
          caption="Feature and price information comes from the vendors’ documentation. The table does not report measured accuracy or speed."
        />
        <p>
          Handy documents offline transcription on Mac, Windows and Linux.
          OpenWhispr lists unlimited local dictation, separate cloud allowances and
          meeting recording. FluidVoice documents several on-device speech models and
          a separate text enhancement layer. Check the mode actually selected before
          trying any app offline.
        </p>
        <p>
          Sources{' '}
          <a href="https://github.com/cjpais/Handy" className="underline underline-offset-4">Handy’s README</a>,{' '}
          <a href="https://openwhispr.com/pricing" className="underline underline-offset-4">OpenWhispr’s pricing and feature limits</a>,{' '}
          <a href="https://github.com/altic-dev/FluidVoice" className="underline underline-offset-4">FluidVoice’s model documentation</a>, and{' '}
          <Link href="/pricing" className="underline underline-offset-4">MemoFlow’s pricing</Link>.
        </p>
      </Section>

      <Section title="Try the same English and Hinglish samples">
        <p>
          Dictate into the same text editor with the same microphone. Write down the
          app version, speech model, language setting and any cleanup option. Try the
          samples with a connection first, then disable Wi-Fi after the models have
          downloaded and repeat both lines.
        </p>
        <blockquote className="space-y-3 border-l-2 border-[var(--accent)] pl-4">
          <p><strong>English</strong> “Send Priya the revised deck by Wednesday at four.”</p>
          <p><strong>Hinglish</strong> <span lang="hi">“Priya, revised deck Wednesday को चार बजे तक भेज देना।”</span></p>
        </blockquote>
        <p>
          Check whether the text inserts into the correct field, and whether the
          person, deadline and number survive. Note if you have to correct the script,
          punctuation or words before sending it. If you want formatting or cleanup,
          test that feature separately while offline so you can tell which stage
          needs a connection.
        </p>
        <p>
          Keep each raw result beside its source sentence. Two short lines can expose
          setup problems, but use a longer sample from your own work before judging
          accuracy across languages or accents.
        </p>
      </Section>

      <Section title="When to choose a paid Mac dictation app">
        <p>
          If you just want to speak into a text field, start with the free tools.
          If you also want a recording, transcript and action items from the same
          workflow, evaluate meeting capture as well as dictation. OpenWhispr lists
          meeting recording among its features. MemoFlow captures your microphone and
          system audio directly on your Mac and includes summaries in the trial.
        </p>
        <p>
          Compare <Link href="/compare/dictation-without-subscription" className="underline underline-offset-4">Mac dictation apps with one-time licences</Link>{' '}
          for more pricing options, or try the <Link href="/blog/transcribe-hinglish-meeting-mac" className="underline underline-offset-4">two-person Hinglish meeting exercise</Link>{' '}
          if meeting notes matter to you.
        </p>
      </Section>

      <ArticleFaq faqs={faqs} />

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="mb-4">Try MemoFlow’s Mac dictation and meeting notes free for {TRIAL_DAYS} days.</p>
        <CTAButton>Try MemoFlow for macOS</CTAButton>
      </div>
    </PageShell>
  );
}
