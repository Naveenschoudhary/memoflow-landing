import type { Metadata } from 'next';
import PageShell, { Section, Panel, Bullets } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Terms — MemoFlow',
  description: 'The terms you agree to by using MemoFlow.',
};

export default function Terms() {
  return (
    <PageShell
      eyebrow="Terms"
      title="Terms of use"
      updated="27 August 2026"
    >
      <Panel>
        MemoFlow is a Mac app that records meetings, transcribes them on your own
        machine, and lets you dictate into other apps. It is early software, released
        while still in active development. These terms describe what you can expect from
        it and what we expect from you.
      </Panel>

      <Section title="Using MemoFlow">
        <p>
          You may install and use MemoFlow on Macs you own or control, for personal or
          business work. You may not redistribute it, resell it, or present it as your
          own product.
        </p>
        <p>
          MemoFlow requires macOS 26 or later.
        </p>
      </Section>

      <Section title="Recording other people is your responsibility">
        <p>
          This is the part that actually matters. Laws about recording conversations vary
          by country and by state, and in many places every participant must consent
          before a call is recorded.
        </p>
        <p>
          MemoFlow gives you the means to record; it cannot know who is in the room or
          what the law is where you are. Obtaining consent, and complying with the rules
          that apply to you and to anyone you record, is entirely your responsibility.
        </p>
      </Section>

      <Section title="Your content is yours">
        <p>
          Recordings, transcripts, summaries and notes you create with MemoFlow belong to
          you. They are stored on your Mac. We do not receive them, cannot access them,
          and claim no rights over them.
        </p>
        <p>
          If you enable a cloud model, transcript text is sent to that provider under
          their terms — see the{' '}
          <a href="/privacy" className="text-[var(--accent)] hover:underline">
            privacy page
          </a>
          . Anything you send is subject to their acceptable-use rules as well as these.
        </p>
      </Section>

      <Section title="What you agree not to do">
        <Bullets
          items={[
            'Record people without the consent the law requires where you are.',
            'Use MemoFlow to break the law, or to infringe anyone else’s rights.',
            'Attempt to redistribute, resell or relicense the app.',
          ]}
        />
      </Section>

      <Section title="Early software, and what that means">
        <p>
          MemoFlow is provided as is, without warranty of any kind. Speech recognition is
          imperfect: transcripts will contain mistakes, summaries can misread what was
          said, and some recordings will transcribe poorly or not at all.
        </p>
        <p>
          <strong className="text-[var(--text)]">
            Do not rely on MemoFlow as the only record of anything you cannot afford to
            lose.
          </strong>{' '}
          If a conversation matters — legally, financially, or otherwise — keep your own
          notes as well.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the fullest extent the law allows, MemoFlow and its developer are not liable
          for lost recordings, inaccurate transcripts, missed meetings, or any indirect,
          incidental or consequential damages arising from use of the app.
        </p>
      </Section>

      <Section title="Updates">
        <p>
          MemoFlow can check for and install updates. Features may change or be removed
          between versions while the app is in active development. Automatic update
          checks can be turned off in Settings.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          These terms may be revised as the app develops. Continuing to use MemoFlow
          after a change means you accept the revised terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms, or about MemoFlow generally, can go to{' '}
          <a
            href="mailto:naveen@bigpicturesoft.com"
            className="text-[var(--accent)] hover:underline"
          >
            naveen@bigpicturesoft.com
          </a>
          .
        </p>
      </Section>
    </PageShell>
  );
}
