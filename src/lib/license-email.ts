import 'server-only';
import { Resend } from 'resend';
import type { TierId } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'MemoFlow <onboarding@resend.dev>';
const SITE = process.env.NEXT_PUBLIC_APP_URL || 'https://memoflow.app';

const TIER_NAME: Record<TierId, string> = {
  personal: 'Personal — one person, 1 Mac + 1 iPhone',
  team: 'Team — three people',
  organisation: 'Organisation — up to twenty people',
};

/**
 * The email that says what to do next. Dodo sends its own receipt with the
 * key; this one is from us, with the three steps and where to get help.
 */
export async function sendLicenseEmail(opts: { to: string; key: string; tier: TierId | null }) {
  const tier = opts.tier ? TIER_NAME[opts.tier] : 'MemoFlow';
  const text = [
    'Thank you for buying MemoFlow.',
    '',
    `Your licence key (${tier}):`,
    '',
    `    ${opts.key}`,
    '',
    'To unlock MemoFlow:',
    '  1. Open MemoFlow on your Mac.',
    '  2. Go to Settings › License.',
    '  3. Paste the key and click Activate.',
    '',
    'That is it — the app is yours for life on that Mac. Moving to a new Mac?',
    'Deactivate the old one in Settings › License and activate the new one with the same key.',
    '',
    `Don't have the app yet? Download it at ${SITE}`,
    `Refunds within 14 days, no questions asked: ${SITE}/refunds`,
    '',
    'Reply to this email if anything is unclear.',
    '— Naveen, MemoFlow',
  ].join('\n');

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#111">
  <p style="font-size:15px;margin:0 0 16px">Thank you for buying MemoFlow.</p>
  <p style="font-size:13px;color:#555;margin:0 0 8px">Your licence key (${escape(tier)}):</p>
  <p style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:16px;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:12px 14px;margin:0 0 24px;word-break:break-all">${escape(opts.key)}</p>
  <p style="font-size:15px;font-weight:600;margin:0 0 8px">To unlock MemoFlow</p>
  <ol style="font-size:14px;line-height:1.7;margin:0 0 20px;padding-left:20px">
    <li>Open MemoFlow on your Mac.</li>
    <li>Go to <strong>Settings › License</strong>.</li>
    <li>Paste the key and click <strong>Activate</strong>.</li>
  </ol>
  <p style="font-size:14px;line-height:1.6;color:#333;margin:0 0 20px">That is it — the app is yours for life on that Mac. Moving to a new Mac? Deactivate the old one in Settings › License and activate the new one with the same key.</p>
  <p style="font-size:13px;line-height:1.6;color:#555;margin:0 0 6px">Don't have the app yet? <a href="${SITE}" style="color:#e5442f">Download it here</a>.</p>
  <p style="font-size:13px;line-height:1.6;color:#555;margin:0 0 20px">Refunds within 14 days, no questions asked — <a href="${SITE}/refunds" style="color:#e5442f">refund policy</a>.</p>
  <p style="font-size:13px;color:#555;margin:0">Reply to this email if anything is unclear.<br>— Naveen, MemoFlow</p>
</div>`;

  // LICENSE_EMAIL_DRY_RUN=1 (local smoke tests, Preview) logs instead of sending.
  if (process.env.LICENSE_EMAIL_DRY_RUN === '1') {
    console.log(`[dry run] licence email to ${opts.to} (${tier})`);
    return;
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [opts.to],
    subject: 'Your MemoFlow licence key',
    html,
    text,
  });
  if (error) throw new Error(`licence email failed: ${error.message || error.name}`);
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}
