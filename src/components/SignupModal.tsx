"use client";
import { useEffect, useState } from "react";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  os: "mac" | "windows" | "linux";
}

const WaveMark = () => (
  <span className="flex h-6 items-end gap-[2.5px]" aria-hidden="true">
    {[10, 17, 24, 17, 10].map((h, i) => (
      <span
        key={i}
        className="w-[3.5px] rounded-full bg-[var(--accent)]"
        style={{ height: h }}
      />
    ))}
  </span>
);

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await onSubmit(email);
      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setEmail("");
      }, 2500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-7 shadow-2xl shadow-black/60">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md px-2 py-0.5 text-lg text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--text)]"
        >
          ×
        </button>

        <WaveMark />

        <h2 id="signup-title" className="mt-4 text-xl font-semibold tracking-tight">
          Get MemoFlow for macOS
        </h2>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          Enter your email and we&apos;ll send the download link. Free during
          beta — no account needed.
        </p>

        {status === "success" ? (
          <div className="mt-6 rounded-xl border border-[var(--line)] bg-black/30 px-4 py-5 text-center">
            <div className="text-2xl">✓</div>
            <p className="mt-1 font-medium">Link sent — check your inbox.</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Nothing you record ever leaves your Mac.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              required
              className="w-full rounded-xl border border-[var(--line)] bg-black/30 px-4 py-3 text-[var(--text)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/30"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {status === "loading" ? "Sending…" : "Send me the download link"}
            </button>

            {status === "error" && (
              <p className="text-center text-sm text-[var(--accent)]">{error}</p>
            )}

            <p className="text-center text-xs text-[var(--muted)]/70">
              Only the link and major updates — no spam. By downloading you
              agree to the{" "}
              <a href="/terms" className="underline hover:text-[var(--text)]">Terms</a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-[var(--text)]">Privacy Policy</a>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupModal;
