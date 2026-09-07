'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { WarningCircle } from '@phosphor-icons/react';
import { signIn, type SignInState } from '@/lib/superadmin/auth-actions';

/**
 * The sign-in form.
 *
 * A client component only so the server action's error message can be shown
 * in place. The form itself is ordinary HTML posting to a server action, so it
 * still submits if the JavaScript never arrives — the error just costs a full
 * page load in that case.
 */
export default function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState<SignInState, FormData>(signIn, { error: null });

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {/*
        React 19 resets an uncontrolled form once its action resolves, which
        would wipe a correctly-typed username every time the password was
        wrong. Re-keying the field on each attempt remounts it with the value
        the server echoed back; the password is deliberately not restored, and
        takes focus instead since it is the half that needs retyping.
      */}
      <Field
        key={`username-${state.attempt ?? 0}`}
        label="Username"
        name="username"
        type="text"
        autoComplete="username"
        defaultValue={state.username ?? ''}
        autoFocus={!state.username}
      />
      <Field
        key={`password-${state.attempt ?? 0}`}
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus={Boolean(state.username)}
      />

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-[#d03b3b]/40 bg-[#d03b3b]/10 px-3 py-2.5 text-sm text-[#f87171]"
        >
          <WarningCircle size={17} weight="fill" className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  autoFocus,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  autoFocus?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-[var(--muted)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        required
        className="h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
      />
    </div>
  );
}

/**
 * useFormStatus reads the pending state of the enclosing form, so the button
 * has to be its own component — inside LoginForm it would always read false.
 */
function Submit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-lg bg-[var(--accent)] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}
