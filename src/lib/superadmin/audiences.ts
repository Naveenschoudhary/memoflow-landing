/**
 * Audience names and labels, kept free of any server import.
 *
 * The composer and the resend panel are client components: importing these
 * from outreach.ts would drag mysql2 and node:crypto into the browser bundle,
 * which fails the build. Types and constants live here; the queries stay in
 * outreach.ts.
 */

export type ResendAudience = 'stuck' | 'email_failed' | 'expired' | 'pending';
export type PromoAudience = 'all' | 'downloaded' | 'never_downloaded';

export const RESEND_AUDIENCES: {
  value: ResendAudience;
  label: string;
  hint: string;
}[] = [
  {
    value: 'stuck',
    label: 'Everyone still without the app',
    hint: 'Any failed, expired or unopened link — excluding anyone who downloaded later.',
  },
  { value: 'email_failed', label: 'Email failed to send', hint: 'Resend rejected the message.' },
  { value: 'expired', label: 'Link expired', hint: 'Opened too late — links last 10 minutes.' },
  { value: 'pending', label: 'Link never opened', hint: 'Delivered, but never clicked.' },
];

export const PROMO_AUDIENCES: { value: PromoAudience; label: string }[] = [
  { value: 'all', label: 'Everyone who signed up' },
  { value: 'downloaded', label: 'People who downloaded' },
  { value: 'never_downloaded', label: 'People who never downloaded' },
];
