"use client";
import { useSignupModal } from "@/context/SignupModalContext";

/**
 * Primary conversion action. Opens the existing email-capture modal
 * (Supabase/Resend flow) which delivers the download link.
 */
export default function CTAButton({
  variant = "primary",
  children,
}: {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
}) {
  const { openModal } = useSignupModal();

  if (variant === "ghost") {
    return (
      <button
        onClick={() => openModal("mac")}
        className="rounded-xl border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white/5"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={() => openModal("mac")}
      className="rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition hover:brightness-110"
    >
      {children}
    </button>
  );
}
