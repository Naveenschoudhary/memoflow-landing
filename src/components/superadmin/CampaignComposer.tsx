'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendCampaign, type SendResult } from '@/lib/superadmin/email-actions';
import { PROMO_AUDIENCES, type PromoAudience } from '@/lib/superadmin/audiences';
import { renderPromoHtml } from '@/lib/superadmin/promo-email';
import SendResultNote from './SendResultNote';

/**
 * Compose a promotional email.
 *
 * Plain text in, branded HTML out. Accepting pasted HTML would be the usual
 * way a marketing email ends up broken in Outlook, so the composer supports a
 * deliberately small subset — blank lines split paragraphs, **bold**, and
 * [text](url) — and escapes everything else.
 */
export default function CampaignComposer({
  counts,
}: {
  counts: Record<PromoAudience, number>;
}) {
  const [state, action] = useActionState<SendResult, FormData>(sendCampaign, {
    ok: false,
    message: '',
  });

  const [audience, setAudience] = useState<PromoAudience>('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const count = counts[audience] ?? 0;
  const selected = PROMO_AUDIENCES.find((option) => option.value === audience);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm text-[var(--muted)]">Subject</span>
        <input
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          maxLength={255}
          placeholder="MemoFlow 0.6 is out"
          className="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 text-sm outline-none focus:border-[var(--accent)]"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-[var(--muted)]">Message</span>
        <textarea
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={10}
          placeholder={
            'Hi,\n\nMemoFlow 0.6 adds speaker labels to every recording.\n\n[Download it here](https://memoflow.app)\n\n— Naveen'
          }
          className="w-full resize-y rounded-lg border border-[var(--line)] bg-[var(--panel-2)] p-3 font-mono text-sm leading-relaxed outline-none focus:border-[var(--accent)]"
        />
        <span className="mt-1.5 block text-xs text-[var(--muted)]">
          Blank line for a new paragraph · <code>**bold**</code> ·{' '}
          <code>[text](https://…)</code>. The MemoFlow header and an unsubscribe link are
          added automatically.
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-[var(--muted)]">Send to</span>
        <select
          name="audience"
          value={audience}
          onChange={(event) => setAudience(event.target.value as PromoAudience)}
          className="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          {PROMO_AUDIENCES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} ({counts[option.value] ?? 0})
            </option>
          ))}
        </select>
      </label>

      <Preview subject={subject} body={body} />

      <TestSend />

      <Confirm count={count} summary={selected?.label ?? ''} />

      <SendResultNote state={state.message ? state : null} />
    </form>
  );
}

/**
 * What the copy will actually look like.
 *
 * Runs the real renderer rather than approximating it, so **bold** and
 * [links](…) appear here exactly as the recipient will see them — a preview
 * that showed the raw markup would be worse than none, since the composer's
 * whole premise is that you do not have to imagine the output.
 *
 * dangerouslySetInnerHTML is safe here specifically because renderPromoHtml
 * escapes the body before re-introducing its own markup; the preview is
 * rendering the same escaped string that goes out over SMTP.
 */
function Preview({ subject, body }: { subject: string; body: string }) {
  if (!subject && !body) return null;

  const html = renderPromoHtml({ body, unsubscribeUrl: '#preview' });

  return (
    <details className="rounded-lg border border-[var(--line)] p-3">
      <summary className="cursor-pointer text-xs text-[var(--muted)] hover:text-[var(--text)]">
        Preview
      </summary>
      <div className="mt-3 overflow-hidden rounded-lg bg-white">
        <p className="border-b border-[#e5e7eb] px-4 py-3 text-sm font-semibold text-[#1f2937]">
          {subject || '(no subject)'}
        </p>
        <div className="max-h-[420px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </details>
  );
}

/**
 * A test send bypasses the CONFIRM gate because it reaches exactly one address
 * the operator typed themselves. Always try this before the real send.
 */
function TestSend() {
  const { pending } = useFormStatus();

  return (
    <div className="rounded-lg border border-[var(--line)] p-3">
      <p className="mb-2 text-xs text-[var(--muted)]">
        Send yourself a copy first — this goes to one address and is not recorded as a
        campaign.
      </p>
      <div className="flex gap-2">
        <input
          name="testTo"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          name="mode"
          value="test"
          disabled={pending}
          className="h-9 shrink-0 rounded-lg border border-[var(--line)] px-4 text-sm transition-colors hover:border-[var(--accent)] disabled:opacity-50"
        >
          Send test
        </button>
      </div>
    </div>
  );
}

function Confirm({ count, summary }: { count: number; summary: string }) {
  const { pending } = useFormStatus();
  const [confirmed, setConfirmed] = useState('');
  const ready = confirmed.trim().toUpperCase() === 'CONFIRM' && count > 0;

  return (
    <div className="space-y-3 border-t border-[var(--line)] pt-4">
      <label className="block">
        <span className="mb-1.5 block text-xs text-[var(--muted)]">
          {count > 0 ? (
            <>
              This emails <strong className="text-[var(--text)]">{count}</strong>{' '}
              {count === 1 ? 'person' : 'people'} ({summary}). Type CONFIRM to enable the
              button.
            </>
          ) : (
            'That audience is empty.'
          )}
        </span>
        <input
          name="confirm"
          type="text"
          placeholder="CONFIRM"
          autoComplete="off"
          value={confirmed}
          onChange={(event) => setConfirmed(event.target.value)}
          disabled={count === 0}
          className="h-9 w-full rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-50"
        />
      </label>

      {/*
        The server checks CONFIRM too — that is the gate that matters. This
        only stops the button from looking armed when it is not.
      */}
      <button
        type="submit"
        name="mode"
        value="send"
        disabled={pending || !ready}
        className="h-10 w-full rounded-lg bg-[var(--accent)] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {pending ? 'Sending…' : `Send to ${count} ${count === 1 ? 'person' : 'people'}`}
      </button>
    </div>
  );
}
