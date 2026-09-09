import type { Metadata } from 'next';
import PageShell, { Section, Panel } from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'Support — MemoFlow',
  description:
    'Get help with MemoFlow: licence keys, permissions, transcription, dictation, updates and refunds. A person answers within one business day.',
  alternates: { canonical: 'https://memoflow.app/support' },
};

const SUPPORT = 'hello@naveenschoudhary.com';

/** Opens a message that already asks for the two things that make a reply fast. */
const MAILTO =
  `mailto:${SUPPORT}?subject=${encodeURIComponent('MemoFlow support')}&body=${encodeURIComponent(
    [
      'What happened:',
      '',
      '',
      'What I expected:',
      '',
      '',
      'macOS version (Apple menu › About This Mac):',
      'MemoFlow version (Settings › About):',
      '',
      'Diagnostics report (Settings › Diagnostics › Copy Report — paste below):',
      '',
    ].join('\n')
  )}`;

type QA = { q: string; a: React.ReactNode };
type Group = { title: string; id: string; items: QA[] };

const GROUPS: Group[] = [
  {
    title: 'Buying and licence keys',
    id: 'licence',
    items: [
      {
        q: 'I paid but no key arrived.',
        a: 'Two emails go out within a minute of paying: a receipt from Dodo Payments and a message from us with the key and the three activation steps. Check spam for both. If neither is there after ten minutes, write to us from the address you paid with and we will send the key by hand.',
      },
      {
        q: 'It says the key is used on its maximum number of devices.',
        a: 'Personal covers one Mac and one iPhone, Team six devices, Organisation forty. Free a slot with Settings › License › Deactivate on the Mac you no longer use, or from the portal linked in your Dodo receipt. If a Mac was wiped before you could deactivate it, email us and we will clear it.',
      },
      {
        q: 'How do I move MemoFlow to a new Mac?',
        a: 'Settings › License › Deactivate on the old one, then activate with the same key on the new one. Recordings and notes are in ~/Library/Application Support/MemoFlow; copy that folder across if you want them on the new machine.',
      },
      {
        q: 'I want a refund.',
        a: (
          <>
            Within 14 days of purchase, email us with the address you paid with and it is done, no questions asked. Details
            on the <a href="/refunds" className="text-[var(--accent)] hover:underline">refund policy</a> page.
          </>
        ),
      },
      {
        q: 'I need an invoice or a tax receipt.',
        a: 'Dodo Payments issues it. The receipt email links to your customer portal, where invoices can be downloaded and a business name or tax ID added.',
      },
    ],
  },
  {
    title: 'Permissions and setup',
    id: 'setup',
    items: [
      {
        q: 'The other side of my calls is not recorded.',
        a: 'System audio needs the Screen & System Audio Recording permission. Open Settings › Permissions in MemoFlow and press Enable; macOS will list MemoFlow in System Settings › Privacy & Security › Screen & System Audio Recording. Switch it on, then use the Relaunch button if MemoFlow shows one — macOS sometimes applies this permission only to a fresh launch.',
      },
      {
        q: 'Dictation types nothing, or copies to the clipboard instead.',
        a: 'Typing into other apps needs the Accessibility permission. Grant it in System Settings › Privacy & Security › Accessibility; MemoFlow notices within a second and re-arms the shortcut, no relaunch needed.',
      },
      {
        q: 'Pressing fn opens the emoji picker.',
        a: 'That is macOS. In System Settings › Keyboard, set “Press 🌐 key to” to “Do Nothing”. MemoFlow shows this reminder in Settings › Shortcuts while it applies.',
      },
      {
        q: 'Which permissions does MemoFlow use, and why?',
        a: 'Microphone for your voice; Screen & System Audio Recording for the other participants, audio only; Accessibility so dictation can type and the fn shortcut can work in any app; Calendar, optionally, for meeting reminders; Automation for a browser, optionally, so a dictation mode can recognise the site you are on. Each is asked for when first needed and explained on the spot.',
      },
    ],
  },
  {
    title: 'Recording and transcription',
    id: 'transcription',
    items: [
      {
        q: 'Which engine should I pick?',
        a: 'Hindi, Hinglish or any Hindi-English mix: the Apex model, the only one that understands Hindi. English and European languages: Parakeet, faster and with nothing to optimize. Apple Intelligence gives an instant live transcript for single-language speech with no download. Switch anytime in Settings › AI.',
      },
      {
        q: 'The model download seems stuck.',
        a: 'Settings › AI shows each model with its phase — downloading with a percentage, then, for Apex only, a one-time optimisation that can take up to 30 minutes on first load. Both keep running while you use the app. If a download fails, Delete and Download again; partial downloads resume.',
      },
      {
        q: 'Transcripts are wrong or empty.',
        a: 'Check the microphone level in the recording view; a clipping or silent input transcribes to nothing, and MemoFlow warns about both. Then check the engine matches the language spoken. If it still looks wrong, send us the Diagnostics report and a few seconds of the recording if you are comfortable sharing it.',
      },
      {
        q: 'Where are my recordings?',
        a: '~/Library/Application Support/MemoFlow — a Recordings folder and a SQLite database. Settings › Storage shows the size and can reveal the folder in Finder. Nothing is stored anywhere else.',
      },
    ],
  },
  {
    title: 'Updates and reinstalling',
    id: 'updates',
    items: [
      {
        q: 'How do I update?',
        a: 'MemoFlow checks daily and shows “Update available” in the sidebar and the menu bar; press Install. Or Settings › About › Check for Updates. Updates come from the same signed GitHub feed as the download.',
      },
      {
        q: 'It says an update is required.',
        a: 'A version had to be retired, usually because something in it no longer works. Press Update Now; everything you recorded is untouched.',
      },
      {
        q: 'I want to start over.',
        a: 'Settings › Reset removes every meeting, recording, transcript and setting and runs onboarding again. Downloaded models and your licence stay. To remove the app entirely, drag it to the Trash and delete ~/Library/Application Support/MemoFlow.',
      },
    ],
  },
  {
    title: 'Privacy',
    id: 'privacy',
    items: [
      {
        q: 'Does anything I record leave my Mac?',
        a: (
          <>
            No. Transcription, summaries and search run locally. The only connections are for updates, one-time model
            downloads, the licence check, and, if you add your own key, a cloud model you chose. The full list is on{' '}
            <a href="/is-memoflow-legit" className="text-[var(--accent)] hover:underline">Is MemoFlow legit?</a> and the{' '}
            <a href="/privacy" className="text-[var(--accent)] hover:underline">privacy page</a>.
          </>
        ),
      },
    ],
  },
];

export default function Support() {
  return (
    <PageShell eyebrow="Support" title="Ask a person">
      <Panel>
        <p>
          Email{' '}
          <a href={`mailto:${SUPPORT}`} className="text-[var(--accent)] hover:underline">{SUPPORT}</a>. Naveen, who
          makes MemoFlow, reads every message and replies within one business day, Indian time — usually sooner.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={MAILTO}
            className="inline-block shrink-0 whitespace-nowrap rounded-xl bg-[var(--accent)] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110"
          >
            Email support
          </a>
          <p className="text-sm text-[var(--muted)]">
            Opens a message that asks for your macOS version and the Diagnostics report (Settings › Diagnostics), which
            is what turns a two-day exchange into a one-reply fix.
          </p>
        </div>
      </Panel>

      <nav aria-label="Topics" className="flex flex-wrap gap-2 text-sm">
        {GROUPS.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[var(--muted)] transition hover:border-[var(--muted)] hover:text-[var(--text)]"
          >
            {g.title}
          </a>
        ))}
      </nav>

      {GROUPS.map((g) => (
        <Section key={g.id} id={g.id} title={g.title}>
          <div className="space-y-6">
            {g.items.map((item) => (
              <div key={item.q}>
                <h3 className="font-medium text-[var(--text)]">{item.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <p className="text-sm text-[var(--muted)]">
        Not covered here? <a href={MAILTO} className="text-[var(--accent)] hover:underline">Write in</a>; the answer
        gets added to this page.
      </p>
    </PageShell>
  );
}
