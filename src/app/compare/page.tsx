import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell, { Panel } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'MemoFlow compared — dictation and meeting apps for Mac',
  description:
    'Honest comparisons between MemoFlow and the alternatives: Wispr Flow, superwhisper, MacWhisper, and the free open-source options.',
  alternates: { canonical: 'https://memoflow.app/compare' },
};

const pages = [
  {
    href: '/compare/wispr-flow-alternative',
    title: 'A free Wispr Flow alternative',
    blurb: 'Wispr Flow is $15/month — $900 over five years. What the free and pay-once alternatives are.',
  },
  {
    href: '/compare/superwhisper-alternative',
    title: 'A superwhisper alternative that starts free',
    blurb: 'superwhisper is $249 once, and it is very good. Whether you need to spend that.',
  },
  {
    href: '/compare/free-dictation-app-mac',
    title: 'The best free dictation apps for Mac',
    blurb: 'MemoFlow, Handy, OpenWhispr and FluidVoice compared — including when to pick one of the others.',
  },
  {
    href: '/compare/dictation-without-subscription',
    title: 'Mac dictation without a subscription',
    blurb: 'Every pay-once option, why some apps must charge monthly, and when a subscription still wins.',
  },
];

export default function CompareIndex() {
  return (
    <PageShell
      eyebrow="Comparisons"
      title="How MemoFlow compares"
      updated="27 August 2026"
    >
      <Panel>
        These pages name the cases where a competitor is the better buy, because a
        comparison that always concludes in our favour is not worth reading. Prices
        are checked against vendor sites and dated.
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 transition hover:border-[var(--accent)]/40"
          >
            <h2 className="font-semibold tracking-tight text-[var(--text)]">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{p.blurb}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
