'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { resendOne, type SendResult } from '@/lib/superadmin/email-actions';

/**
 * Per-row re-send, for chasing one person rather than a group.
 *
 * Single-click with no confirmation, unlike the bulk sends: one email to one
 * address that the operator picked out of a table is a small enough action
 * that a confirmation step would only be in the way.
 */
export default function ResendButton({ email, os }: { email: string; os: string }) {
  const [state, action] = useActionState<SendResult, FormData>(resendOne, {
    ok: false,
    message: '',
  });

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="os" value={os} />
      <Button />
      {state.message && (
        <span
          className="text-xs"
          style={{ color: state.ok ? '#4ade80' : '#f87171' }}
          title={state.message}
        >
          {state.ok ? 'Sent' : 'Failed'}
        </span>
      )}
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)] disabled:opacity-50"
    >
      {pending ? 'Sending…' : 'Resend'}
    </button>
  );
}
