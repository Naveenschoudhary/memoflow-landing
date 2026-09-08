import type { Metadata } from 'next';
import PageShell, { Section, Panel, Bullets } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Refunds — MemoFlow',
  description: 'How refunds work for MemoFlow: a full refund within 14 days of purchase, no questions asked.',
  alternates: { canonical: 'https://memoflow.app/refunds' },
};

export default function Refunds() {
  return (
    <PageShell eyebrow="Refunds" title="Refund and cancellation policy" updated="8 September 2026">
      <Panel>
        MemoFlow is a one-time purchase, so there is nothing to cancel. If it is not for
        you, ask for a refund within 14 days of buying and you get the full amount back.
        No questions, no forms.
      </Panel>

      <Section title="How to ask">
        <p>
          Email{' '}
          <a href="mailto:naveen@bigpicturesoft.com" className="text-[var(--accent)] hover:underline">
            naveen@bigpicturesoft.com
          </a>{' '}
          from the address you bought with, or reply to your purchase email. Include the
          order number or the licence key if you have it handy; if not, the email address
          is enough.
        </p>
      </Section>

      <Section title="What happens next">
        <Bullets
          items={[
            'We confirm the refund within two business days.',
            'Dodo Payments, our merchant of record, returns the money to the card or wallet you paid with. Banks usually show it within 5–10 business days.',
            'Your licence key is deactivated. The app returns to its locked state; everything you recorded stays on your Mac, readable and exportable.',
          ]}
        />
      </Section>

      <Section title="After 14 days">
        <p>
          Refund requests after 14 days are handled case by case. If the app has stopped
          working for you because of something on our side, write to us and we will sort
          it out.
        </p>
      </Section>

      <Section title="Your trial is the try-before-you-buy">
        <p>
          Every feature is free for the first 7 days, with nothing to enter and no card
          needed. Please use that time to make sure MemoFlow does what you need on your
          Mac before paying.
        </p>
      </Section>
    </PageShell>
  );
}
