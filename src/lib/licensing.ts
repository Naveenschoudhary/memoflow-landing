import 'server-only';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { db } from './db';
import type { TierId } from './pricing';

/**
 * Purchase and licence records, written by the Dodo webhook and read by the
 * licence proxy and the superadmin. Tables are in schema.sql. Every function
 * throws if the database is not configured — the webhook must fail loudly
 * (so Dodo retries) rather than silently drop a purchase.
 */

function conn() {
  if (!db) throw new Error('Database is not configured — set DATABASE_URL');
  return db;
}

// ---------------------------------------------------------------------------
// Webhook idempotency
// ---------------------------------------------------------------------------

/**
 * Claims a webhook event. Returns false when it was already processed to
 * completion; a row whose processing failed last time is claimed again, so a
 * bug fixed between retries still lands the event.
 */
export async function claimEvent(id: string, type: string, payload: unknown): Promise<boolean> {
  const c = conn();
  await c.execute(
    `INSERT IGNORE INTO dodo_events (id, type, payload) VALUES (?, ?, ?)`,
    [id, type, JSON.stringify(payload)]
  );
  const [rows] = await c.execute<RowDataPacket[]>(
    `SELECT processed_at FROM dodo_events WHERE id = ?`,
    [id]
  );
  return !rows[0]?.processed_at;
}

export async function markEventProcessed(id: string): Promise<void> {
  await conn().execute(`UPDATE dodo_events SET processed_at = NOW() WHERE id = ?`, [id]);
}

// ---------------------------------------------------------------------------
// Purchases
// ---------------------------------------------------------------------------

export type PurchaseRow = {
  payment_id: string;
  customer_id: string | null;
  email: string | null;
  product_id: string | null;
  tier: TierId | null;
  amount: number | null;
  currency: string | null;
  status: string;
  source: string | null;
  metadata: unknown;
};

export async function upsertPurchase(p: PurchaseRow): Promise<void> {
  await conn().execute(
    `INSERT INTO purchases
       (payment_id, customer_id, email, product_id, tier, amount, currency, status, source, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       customer_id = COALESCE(VALUES(customer_id), customer_id),
       email       = COALESCE(VALUES(email), email),
       product_id  = COALESCE(VALUES(product_id), product_id),
       tier        = COALESCE(VALUES(tier), tier),
       amount      = COALESCE(VALUES(amount), amount),
       currency    = COALESCE(VALUES(currency), currency),
       status      = VALUES(status),
       source      = COALESCE(VALUES(source), source),
       metadata    = COALESCE(VALUES(metadata), metadata)`,
    [
      p.payment_id, p.customer_id, p.email, p.product_id, p.tier, p.amount, p.currency,
      p.status, p.source, p.metadata == null ? null : JSON.stringify(p.metadata),
    ]
  );
}

export async function setPurchaseStatus(paymentId: string, status: string): Promise<void> {
  await conn().execute(`UPDATE purchases SET status = ? WHERE payment_id = ?`, [status, paymentId]);
}

export async function purchaseEmail(paymentId: string | null | undefined): Promise<string | null> {
  if (!paymentId) return null;
  const [rows] = await conn().execute<RowDataPacket[]>(
    `SELECT email FROM purchases WHERE payment_id = ?`,
    [paymentId]
  );
  return (rows[0]?.email as string | undefined) ?? null;
}

// ---------------------------------------------------------------------------
// Licences
// ---------------------------------------------------------------------------

export type LicenseStatus = 'active' | 'expired' | 'disabled' | 'revoked';

export type LicenseRow = {
  license_key_id: string;
  key_hash: string;
  key_last4: string;
  customer_id: string | null;
  email: string | null;
  product_id: string;
  tier: TierId | null;
  payment_id: string | null;
  activations_limit: number | null;
  status: LicenseStatus;
};

export async function upsertLicense(l: LicenseRow): Promise<void> {
  await conn().execute(
    `INSERT INTO licenses
       (license_key_id, key_hash, key_last4, customer_id, email, product_id, tier, payment_id, activations_limit, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       customer_id       = COALESCE(VALUES(customer_id), customer_id),
       email             = COALESCE(VALUES(email), email),
       tier              = COALESCE(VALUES(tier), tier),
       payment_id        = COALESCE(VALUES(payment_id), payment_id),
       activations_limit = COALESCE(VALUES(activations_limit), activations_limit),
       status            = VALUES(status)`,
    [
      l.license_key_id, l.key_hash, l.key_last4, l.customer_id, l.email, l.product_id, l.tier,
      l.payment_id, l.activations_limit, l.status,
    ]
  );
}

export async function setLicenseStatusByPayment(paymentId: string, status: LicenseStatus): Promise<string[]> {
  const c = conn();
  const [rows] = await c.execute<RowDataPacket[]>(
    `SELECT license_key_id FROM licenses WHERE payment_id = ?`,
    [paymentId]
  );
  const ids = rows.map((r) => r.license_key_id as string);
  if (ids.length) {
    await c.execute(
      `UPDATE licenses SET status = ?, revoked_at = COALESCE(?, revoked_at) WHERE payment_id = ?`,
      [status, revokedAtFor(status), paymentId]
    );
  }
  return ids;
}

export async function setLicenseStatus(licenseKeyId: string, status: LicenseStatus): Promise<void> {
  await conn().execute(
    `UPDATE licenses SET status = ?, revoked_at = COALESCE(?, revoked_at) WHERE license_key_id = ?`,
    [status, revokedAtFor(status), licenseKeyId]
  );
}

/** Decided in code, not SQL: a bound string compared with literals in `IN` trips MySQL's collation rules. */
function revokedAtFor(status: LicenseStatus): Date | null {
  return status === 'revoked' || status === 'disabled' ? new Date() : null;
}

/** What we know about a key, by hash; null when we have never seen it. */
export async function licenseStatusByHash(keyHash: string): Promise<LicenseStatus | null> {
  const [rows] = await conn().execute<RowDataPacket[]>(
    `SELECT status FROM licenses WHERE key_hash = ?`,
    [keyHash]
  );
  return (rows[0]?.status as LicenseStatus | undefined) ?? null;
}

export async function markWelcomeEmailSent(licenseKeyId: string): Promise<void> {
  await conn().execute(
    `UPDATE licenses SET welcome_email_at = NOW() WHERE license_key_id = ?`,
    [licenseKeyId]
  );
}

export async function welcomeEmailSent(licenseKeyId: string): Promise<boolean> {
  const [rows] = await conn().execute<RowDataPacket[]>(
    `SELECT welcome_email_at FROM licenses WHERE license_key_id = ?`,
    [licenseKeyId]
  );
  return !!rows[0]?.welcome_email_at;
}

// ---------------------------------------------------------------------------
// Activations log (from the proxy)
// ---------------------------------------------------------------------------

export async function logActivation(a: {
  key_hash: string;
  action: 'activate' | 'validate' | 'deactivate';
  instance_id: string | null;
  device_name: string | null;
  app_version: string | null;
  outcome: string;
  ip_country: string | null;
}): Promise<void> {
  // Best effort — a logging failure must never fail the activation itself.
  try {
    await conn().execute(
      `INSERT INTO license_activations
         (key_hash, action, instance_id, device_name, app_version, outcome, ip_country)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [a.key_hash, a.action, a.instance_id, a.device_name, a.app_version, a.outcome, a.ip_country]
    );
  } catch (error) {
    console.error('license_activations insert failed:', error);
  }
}

// ---------------------------------------------------------------------------
// Rate limiting: fixed one-minute windows, one row per bucket
// ---------------------------------------------------------------------------

/** True when the bucket is still within `limit` calls this minute. */
export async function withinRateLimit(bucket: string, limit: number): Promise<boolean> {
  if (!db) return true; // never lock people out because the counter is down
  try {
    const windowStart = Math.floor(Date.now() / 60_000);
    await db.execute<ResultSetHeader>(
      `INSERT INTO rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE
         count = IF(window_start = VALUES(window_start), count + 1, 1),
         window_start = VALUES(window_start)`,
      [bucket, windowStart]
    );
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT count FROM rate_limits WHERE bucket = ?`,
      [bucket]
    );
    return Number(rows[0]?.count ?? 0) <= limit;
  } catch (error) {
    console.error('rate limit check failed:', error);
    return true;
  }
}
