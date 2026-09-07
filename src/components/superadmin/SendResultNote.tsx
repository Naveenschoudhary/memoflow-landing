import type { SendResult } from '@/lib/superadmin/email-actions';

/** Shared success/failure note for both send forms. */
export default function SendResultNote({ state }: { state: SendResult | null }) {
  if (!state?.message) return null;

  const tone = state.ok
    ? { border: '#0ca30c66', bg: '#0ca30c1a', text: '#4ade80' }
    : { border: '#d03b3b66', bg: '#d03b3b1a', text: '#f87171' };

  return (
    <div
      role="status"
      className="rounded-lg border px-3 py-2.5 text-sm"
      style={{ borderColor: tone.border, background: tone.bg, color: tone.text }}
    >
      <p>{state.message}</p>
      {state.failures?.length ? (
        <ul className="mt-2 space-y-0.5 text-xs opacity-90">
          {state.failures.map((failure) => (
            <li key={failure}>{failure}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
