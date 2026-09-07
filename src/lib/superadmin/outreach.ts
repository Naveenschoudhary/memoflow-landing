import { randomUUID, randomBytes } from 'node:crypto';
import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import {
  PROMO_AUDIENCES,
  RESEND_AUDIENCES,
  type PromoAudience,
  type ResendAudience,
} from './audiences';

export type { PromoAudience, ResendAudience };
export type Recipient = { email: string; os: string };
export { PROMO_AUDIENCES, RESEND_AUDIENCES };

/**
 * Audiences, opt-outs, and campaign records.
 *
 * The download flow writes one `downloads` row per emailed link, so the same
 * person appears many times — 57 rows are 18 people. Everything here works in
 * people, not rows: audiences are DISTINCT on email, so nobody is emailed
 * twice because they asked for the link twice.
 */

/**
 * Who to re-send a download link to.
 *
 * Two rules do the real work. DISTINCT collapses a person's repeat attempts
 * into one email. The NOT EXISTS drops anyone who succeeded on a later try —
 * without it, "resend to everyone whose link expired" would mail people who
 * have been running the app for weeks.
 */
export async function getResendRecipients(audience: ResendAudience): Promise<Recipient[]> {
  if (!db) return [];

  const statusClause =
    audience === 'stuck'
      ? `d.status IN ('email_failed', 'expired', 'pending')`
      : `d.status = ?`;
  const params = audience === 'stuck' ? [] : [audience];

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT d.email,
              -- Their most recent platform choice, not an arbitrary one.
              SUBSTRING_INDEX(GROUP_CONCAT(d.os ORDER BY d.created_at DESC), ',', 1) AS os
       FROM downloads d
       WHERE ${statusClause}
         AND NOT EXISTS (
           SELECT 1 FROM downloads done
           WHERE done.email = d.email AND done.status = 'downloaded'
         )
         AND NOT EXISTS (
           SELECT 1 FROM email_contacts c
           WHERE c.email = d.email AND c.unsubscribed_at IS NOT NULL
         )
       GROUP BY d.email
       ORDER BY MAX(d.created_at) DESC`,
      params
    );
    return rows.map((row) => ({ email: String(row.email), os: String(row.os || 'mac') }));
  } catch (error) {
    console.error('outreach/getResendRecipients:', error);
    return [];
  }
}

/** Promotional audiences always exclude anyone who has unsubscribed. */
export async function getPromoRecipients(audience: PromoAudience): Promise<string[]> {
  if (!db) return [];

  const having =
    audience === 'downloaded'
      ? `HAVING SUM(d.status = 'downloaded') > 0`
      : audience === 'never_downloaded'
        ? `HAVING SUM(d.status = 'downloaded') = 0`
        : '';

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT d.email
       FROM downloads d
       WHERE NOT EXISTS (
         SELECT 1 FROM email_contacts c
         WHERE c.email = d.email AND c.unsubscribed_at IS NOT NULL
       )
       GROUP BY d.email
       ${having}
       ORDER BY d.email`
    );
    return rows.map((row) => String(row.email));
  } catch (error) {
    console.error('outreach/getPromoRecipients:', error);
    return [];
  }
}

export async function countResendAudiences(): Promise<Record<ResendAudience, number>> {
  const entries = await Promise.all(
    RESEND_AUDIENCES.map(async ({ value }) => {
      const people = await getResendRecipients(value);
      return [value, people.length] as const;
    })
  );
  return Object.fromEntries(entries) as Record<ResendAudience, number>;
}

export async function countPromoAudiences(): Promise<Record<PromoAudience, number>> {
  const entries = await Promise.all(
    PROMO_AUDIENCES.map(async ({ value }) => {
      const people = await getPromoRecipients(value);
      return [value, people.length] as const;
    })
  );
  return Object.fromEntries(entries) as Record<PromoAudience, number>;
}

/**
 * The address's permanent unsubscribe token, created on first use.
 *
 * INSERT ... ON DUPLICATE KEY UPDATE keeps this a single round trip and is
 * safe under concurrency: two campaigns sending at once cannot mint two
 * different tokens for one address.
 */
export async function getUnsubscribeToken(email: string): Promise<string | null> {
  if (!db) return null;

  try {
    const token = randomBytes(16).toString('hex');
    await db.execute(
      `INSERT INTO email_contacts (email, unsubscribe_token) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE email = email`,
      [email, token]
    );
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT unsubscribe_token FROM email_contacts WHERE email = ?`,
      [email]
    );
    return rows[0] ? String(rows[0].unsubscribe_token) : null;
  } catch (error) {
    console.error('outreach/getUnsubscribeToken:', error);
    return null;
  }
}

/** Returns the address that was unsubscribed, or null if the token is unknown. */
export async function unsubscribeByToken(token: string): Promise<string | null> {
  if (!db || !/^[0-9a-f]{32}$/.test(token)) return null;

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT email FROM email_contacts WHERE unsubscribe_token = ?`,
      [token]
    );
    if (!rows[0]) return null;

    await db.execute(
      `UPDATE email_contacts SET unsubscribed_at = NOW()
       WHERE unsubscribe_token = ? AND unsubscribed_at IS NULL`,
      [token]
    );
    return String(rows[0].email);
  } catch (error) {
    console.error('outreach/unsubscribeByToken:', error);
    return null;
  }
}

export type Campaign = {
  id: string;
  subject: string;
  body: string;
  audience: string;
  recipients: number;
  sent: number;
  failed: number;
  created_at: Date;
};

export async function recordCampaign(campaign: {
  subject: string;
  body: string;
  audience: string;
  recipients: number;
  sent: number;
  failed: number;
}): Promise<void> {
  if (!db) return;

  try {
    await db.execute(
      `INSERT INTO email_campaigns (id, subject, body, audience, recipients, sent, failed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        campaign.subject.slice(0, 255),
        campaign.body,
        campaign.audience,
        campaign.recipients,
        campaign.sent,
        campaign.failed,
      ]
    );
  } catch (error) {
    console.error('outreach/recordCampaign:', error);
  }
}

export async function getCampaigns(limit = 20): Promise<Campaign[]> {
  if (!db) return [];

  const cap = Math.min(100, Math.max(1, Math.floor(limit)));
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, subject, body, audience, recipients, sent, failed, created_at
       FROM email_campaigns ORDER BY created_at DESC LIMIT ${cap}`
    );
    return rows as Campaign[];
  } catch (error) {
    console.error('outreach/getCampaigns:', error);
    return [];
  }
}

export async function countUnsubscribed(): Promise<number> {
  if (!db) return 0;
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS n FROM email_contacts WHERE unsubscribed_at IS NOT NULL`
    );
    return Number(rows[0]?.n ?? 0);
  } catch {
    return 0;
  }
}
