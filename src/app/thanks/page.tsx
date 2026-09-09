import type { Metadata } from 'next';
import PageShell, { Section, Panel, Bullets } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Thank you — MemoFlow',
  description: 'Your MemoFlow licence key is on its way.',
  robots: { index: false, follow: false },
};

/** Where Dodo sends people after checkout. */
export default function Thanks() {
  return (
    <PageShell eyebrow="Thank you" title="Your licence key is on its way">
      <Panel>
        Dodo Payments is emailing your licence key now — it usually arrives within a
        minute. The email also links to a portal where you can see the key and the
        devices it is active on.
      </Panel>

      <Section title="Unlock MemoFlow">
        <Bullets
          items={[
            'Open MemoFlow on your Mac.',
            'Go to Settings › License.',
            'Paste the key and click Activate.',
          ]}
        />
        <p>That is it — the app unlocks for life on that Mac.</p>
      </Section>

      <Section title="Didn't get the email?">
        <p>
          Check spam first; it comes from Dodo Payments, not from memoflow.app. If it is
          not there after ten minutes, write to{' '}
          <a href="mailto:hello@naveenschoudhary.com" className="text-[var(--accent)] hover:underline">
            hello@naveenschoudhary.com
          </a>{' '}
          with the address you bought with and we will send the key by hand.
        </p>
      </Section>

      <Section title="Don't have MemoFlow installed yet?">
        <p>
          <a href="/" className="text-[var(--accent)] hover:underline">
            Download it from the home page
          </a>
          , then enter your key in Settings › License.
        </p>
      </Section>
    </PageShell>
  );
}
