'use server';

import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { sendWelcomeEmail } from '@/lib/email';
import { renderPromoHtml, renderPromoText, unsubscribeUrlFor } from './promo-email';
import {
  type PromoAudience,
  type ResendAudience,
  getPromoRecipients,
  getResendRecipients,
  getUnsubscribeToken,
  recordCampaign,
} from './outreach';

/**
 * Every action that puts mail in someone's inbox.
 *
 * All of them are irreversible from the recipient's point of view, so each one
 * requires the caller to type CONFIRM — a mis-click in the dashboard should
 * not be able to mail the whole list.
 */

export type SendResult = {
  ok: boolean;
  message: string;
  /** Per-address outcomes, so a partial failure names who missed out. */
  failures?: string[];
};

const CONFIRM = 'CONFIRM';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Resend's default limit is 2 requests/second; 600ms keeps a margin. */
const SEND_GAP_MS = 600;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Nothing here should ever mail more than this in one action. */
const MAX_PER_RUN = 500;

// ---------------------------------------------------------------------------
// Re-sending download links
// ---------------------------------------------------------------------------

/**
 * One person, one fresh link.
 *
 * sendWelcomeEmail writes a new downloads row with a new id, so this is a
 * genuinely new link rather than a revival of the expired one — which is what
 * the recipient needs, since the old id is burnt.
 */
export async function resendOne(_prev: SendResult, formData: FormData): Promise<SendResult> {
  const email = String(formData.get('email') ?? '').trim();
  const os = String(formData.get('os') ?? 'mac');

  if (!EMAIL_PATTERN.test(email)) return { ok: false, message: 'That is not a valid address.' };

  try {
    await sendWelcomeEmail(email, normaliseOs(os));
    revalidatePath('/superadmin/signups');
    revalidatePath('/superadmin/emails');
    return { ok: true, message: `New link sent to ${email}.` };
  } catch (error) {
    return { ok: false, message: describe(error) };
  }
}

export async function resendBulk(_prev: SendResult, formData: FormData): Promise<SendResult> {
  if (String(formData.get('confirm') ?? '').trim().toUpperCase() !== CONFIRM) {
    return { ok: false, message: `Type ${CONFIRM} to send.` };
  }

  const audience = String(formData.get('audience') ?? 'stuck') as ResendAudience;
  const recipients = await getResendRecipients(audience);

  if (!recipients.length) return { ok: false, message: 'Nobody matches that group right now.' };
  if (recipients.length > MAX_PER_RUN) {
    return { ok: false, message: `That is ${recipients.length} people — over the ${MAX_PER_RUN} cap.` };
  }

  const failures: string[] = [];
  let sent = 0;

  // Sequential, not batched: every recipient needs their own download id, and
  // each send also writes a row. At this volume the extra seconds are cheaper
  // than the complexity of pre-minting ids for a batch call.
  for (const [index, person] of recipients.entries()) {
    try {
      await sendWelcomeEmail(person.email, normaliseOs(person.os));
      sent += 1;
    } catch (error) {
      failures.push(`${person.email}: ${describe(error)}`);
    }
    if (index < recipients.length - 1) await wait(SEND_GAP_MS);
  }

  revalidatePath('/superadmin/signups');
  revalidatePath('/superadmin/emails');

  return {
    ok: failures.length === 0,
    message: failures.length
      ? `Sent ${sent} of ${recipients.length}. ${failures.length} failed.`
      : `Sent a fresh link to ${sent} ${sent === 1 ? 'person' : 'people'}.`,
    failures: failures.slice(0, 20),
  };
}

// ---------------------------------------------------------------------------
// Promotional campaigns
// ---------------------------------------------------------------------------

export async function sendCampaign(_prev: SendResult, formData: FormData): Promise<SendResult> {
  const subject = String(formData.get('subject') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const audience = String(formData.get('audience') ?? 'all') as PromoAudience;
  const testTo = String(formData.get('testTo') ?? '').trim();
  const isTest = String(formData.get('mode') ?? '') === 'test';

  if (!subject) return { ok: false, message: 'The subject is empty.' };
  if (!body) return { ok: false, message: 'The message is empty.' };

  const resend = client();
  if (!resend) return { ok: false, message: 'RESEND_API_KEY is not set.' };

  // A test goes to exactly one typed address and is not recorded as a campaign.
  if (isTest) {
    if (!EMAIL_PATTERN.test(testTo)) {
      return { ok: false, message: 'Enter a valid address to send the test to.' };
    }
    const result = await sendOne(resend, testTo, subject, body);
    return result.ok
      ? { ok: true, message: `Test sent to ${testTo}.` }
      : { ok: false, message: `Test failed: ${result.error}` };
  }

  if (String(formData.get('confirm') ?? '').trim().toUpperCase() !== CONFIRM) {
    return { ok: false, message: `Type ${CONFIRM} to send to the whole list.` };
  }

  const recipients = await getPromoRecipients(audience);
  if (!recipients.length) return { ok: false, message: 'That audience is empty.' };
  if (recipients.length > MAX_PER_RUN) {
    return { ok: false, message: `That is ${recipients.length} people — over the ${MAX_PER_RUN} cap.` };
  }

  const failures: string[] = [];
  let sent = 0;

  // Sent one at a time rather than through the batch endpoint: each message
  // carries that person's own unsubscribe link, so the bodies differ and a
  // single failure should not take the rest of the batch with it.
  for (const [index, email] of recipients.entries()) {
    const result = await sendOne(resend, email, subject, body);
    if (result.ok) sent += 1;
    else failures.push(`${email}: ${result.error}`);
    if (index < recipients.length - 1) await wait(SEND_GAP_MS);
  }

  await recordCampaign({
    subject,
    body,
    audience,
    recipients: recipients.length,
    sent,
    failed: failures.length,
  });

  revalidatePath('/superadmin/emails');

  return {
    ok: failures.length === 0,
    message: failures.length
      ? `Sent ${sent} of ${recipients.length}. ${failures.length} failed.`
      : `Sent to ${sent} ${sent === 1 ? 'person' : 'people'}.`,
    failures: failures.slice(0, 20),
  };
}

async function sendOne(resend: Resend, email: string, subject: string, body: string) {
  try {
    // Minted per recipient, and reused forever after — the same address always
    // gets the same link, so an old email's unsubscribe still works.
    const token = await getUnsubscribeToken(email);
    if (!token) return { ok: false as const, error: 'could not create an unsubscribe link' };

    const unsubscribeUrl = unsubscribeUrlFor(token);

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MemoFlow <onboarding@resend.dev>',
      to: [email],
      subject,
      html: renderPromoHtml({ body, unsubscribeUrl }),
      text: renderPromoText({ body, unsubscribeUrl }),
      // The header Gmail and Apple Mail use to show their own unsubscribe
      // control, which materially improves deliverability for bulk mail.
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    });

    if (error) return { ok: false as const, error: error.message || error.name };
    return { ok: true as const, error: '' };
  } catch (error) {
    return { ok: false as const, error: describe(error) };
  }
}

function client() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function normaliseOs(value: string): 'mac' | 'windows' | 'linux' {
  return value === 'windows' || value === 'linux' ? value : 'mac';
}

function describe(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
