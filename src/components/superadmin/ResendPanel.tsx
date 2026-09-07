'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { resendBulk, type SendResult } from '@/lib/superadmin/email-actions';
import { RESEND_AUDIENCES, type ResendAudience } from '@/lib/superadmin/audiences';
import SendResultNote from './SendResultNote';

/**
 * Bulk re-send of download links.
 *
 * The counts are people, not rows — someone who requested the link four times
 * and never opened it is one email, not four.
 */
export default function ResendPanel({ counts }: { counts: Record<ResendAudience, number> }) {
  const [state, action] = useActionState<SendResult, FormData>(resendBulk, {
    ok: false,
    message: '',
  });
  const [audience, setAudience] = useState<ResendAudience>('stuck');

  const selected = RESEND_AUDIENCES.find((option) => option.value === audience);
  const count = counts[audience] ?? 0;

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        {RESEND_AUDIENCES.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
              audience === option.value
                ? 'border-[var(--accent)] bg-white/[0.03]'
                : 'border-[var(--line)] hover:bg-white/[0.02]'
            }`}
          >
            <input
              type="radio"
              name="audience"
              value={option.value}
              checked={audience === option.value}
              onChange={() => setAudience(option.value)}
              className="mt-1 accent-[var(--accent)]"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-sm">{option.label}</span>
                <span className="shrink-0 text-sm tabular-nums text-[var(--muted)]">
                  {counts[option.value] ?? 0}
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-[var(--muted)]">{option.hint}</span>
            </span>
          </label>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)]">
        Anyone who downloaded on a later attempt, or has unsubscribed, is already excluded.
      </p>

      <ConfirmAndSend
        count={count}
        label={`Send ${count} new link${count === 1 ? '' : 's'}`}
        summary={selected?.label ?? ''}
      />

      <SendResultNote state={state.message ? state : null} />
    </form>
  );
}

/**
 * The typed confirmation. Sending mail cannot be undone, so the button alone
 * is not enough of a gate for an action that reaches real inboxes.
 */
export function ConfirmAndSend({
  count,
  label,
  summary,
  extra,
}: {
  count: number;
  label: string;
  summary: string;
  extra?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  const [confirmed, setConfirmed] = useState('');
  const ready = confirmed.trim().toUpperCase() === 'CONFIRM' && count > 0;

  return (
    <div className="space-y-3 border-t border-[var(--line)] pt-4">
      {extra}
      <label className="block">
        <span className="mb-1.5 block text-xs text-[var(--muted)]">
          {count > 0 ? (
            <>
              This emails <strong className="text-[var(--text)]">{count}</strong>{' '}
              {count === 1 ? 'person' : 'people'} ({summary}). Type CONFIRM to enable the button.
            </>
          ) : (
            'Nobody matches this group right now.'
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
        disabled={pending || !ready}
        className="h-10 w-full rounded-lg bg-[var(--accent)] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {pending ? 'Sending…' : label}
      </button>
    </div>
  );
}
