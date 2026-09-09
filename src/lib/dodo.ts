import 'server-only';
import DodoPayments from 'dodopayments';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { TierId } from './pricing';

/**
 * Everything that touches Dodo Payments, server-side only. The API key, the
 * mode and the product ids come from the environment and never reach the
 * client bundle; the pages and the Mac app talk to /api/* on memoflow.app.
 *
 *   DODO_API_KEY            live key in Production, test key in Preview
 *   DODO_MODE               live | test
 *   DODO_WEBHOOK_SECRET     from Developer › Webhooks, whsec_…
 *   DODO_PRODUCT_PERSONAL   pdt_… ids matching the mode
 *   DODO_PRODUCT_TEAM
 *   DODO_PRODUCT_ORG
 */

export const dodoMode: 'live' | 'test' = process.env.DODO_MODE === 'test' ? 'test' : 'live';

const SITE = process.env.NEXT_PUBLIC_APP_URL || 'https://memoflow.app';

let client: DodoPayments | null = null;

export function isDodoConfigured(): boolean {
  return !!process.env.DODO_API_KEY;
}

export function dodo(): DodoPayments {
  if (!client) {
    const bearerToken = process.env.DODO_API_KEY;
    if (!bearerToken) throw new Error('DODO_API_KEY is not set');
    client = new DodoPayments({
      bearerToken,
      environment: dodoMode === 'test' ? 'test_mode' : 'live_mode',
    });
  }
  return client;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const PRODUCT_ENV: Record<TierId, string | undefined> = {
  personal: process.env.DODO_PRODUCT_PERSONAL,
  team: process.env.DODO_PRODUCT_TEAM,
  organisation: process.env.DODO_PRODUCT_ORG,
};

export function productIdFor(tier: TierId): string | null {
  return PRODUCT_ENV[tier] || null;
}

export function tierForProduct(productId: string | null | undefined): TierId | null {
  if (!productId) return null;
  for (const [tier, id] of Object.entries(PRODUCT_ENV) as [TierId, string | undefined][]) {
    if (id === productId) return tier;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------------

export type CheckoutSource = 'web' | 'app';

/** A hosted checkout for one tier; the caller redirects to the returned URL. */
export async function createCheckout(opts: {
  tier: TierId;
  source: CheckoutSource;
  email?: string | null;
}): Promise<string> {
  const productId = productIdFor(opts.tier);
  if (!productId) throw new Error(`No product configured for tier ${opts.tier} (${dodoMode})`);

  const session = await dodo().checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1 }],
    customer: opts.email ? { email: opts.email } : undefined,
    return_url: `${SITE}/thanks`,
    metadata: { tier: opts.tier, source: opts.source },
    feature_flags: { allow_discount_code: true, allow_currency_selection: true },
    customization: { theme: 'dark', show_order_details: true },
  });
  if (!session.checkout_url) throw new Error('Dodo returned a session without a checkout_url');
  return session.checkout_url;
}

// ---------------------------------------------------------------------------
// Keys: hashing and display
// ---------------------------------------------------------------------------

/** Keys are stored hashed; the plaintext lives only with Dodo and the buyer. */
export function hashKey(key: string): string {
  return createHash('sha256').update(key.trim()).digest('hex');
}

export function last4(key: string): string {
  const k = key.trim();
  return k.slice(-4);
}

// ---------------------------------------------------------------------------
// Webhooks — Standard Webhooks signature
// ---------------------------------------------------------------------------

const REPLAY_WINDOW_SECONDS = 5 * 60;

/**
 * Verifies `webhook-id`, `webhook-timestamp` and `webhook-signature` against
 * DODO_WEBHOOK_SECRET (Standard Webhooks: HMAC-SHA256 over
 * `${id}.${timestamp}.${body}` with the base64 secret after `whsec_`).
 * Returns the event id and timestamp, or null when the request is not ours.
 */
export function verifyWebhook(
  rawBody: string,
  headers: Headers
): { id: string; timestamp: number } | null {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  const id = headers.get('webhook-id');
  const ts = headers.get('webhook-timestamp');
  const signatureHeader = headers.get('webhook-signature');
  if (!secret || !id || !ts || !signatureHeader) return null;

  const timestamp = Number(ts);
  if (!Number.isFinite(timestamp)) return null;
  if (Math.abs(Date.now() / 1000 - timestamp) > REPLAY_WINDOW_SECONDS) return null;

  const keyBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', keyBytes).update(`${id}.${ts}.${rawBody}`).digest();

  // The header may carry several space-separated "v1,<base64>" entries.
  for (const entry of signatureHeader.split(' ')) {
    const [version, value] = entry.split(',');
    if (version !== 'v1' || !value) continue;
    const candidate = Buffer.from(value, 'base64');
    if (candidate.length === expected.length && timingSafeEqual(candidate, expected)) {
      return { id, timestamp };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Wire shapes we read from webhook payloads (subset of Dodo's types)
// ---------------------------------------------------------------------------

export type WebhookEnvelope = {
  business_id: string;
  type: string;
  timestamp: string;
  data: Record<string, unknown> & { payload_type?: string };
};

export type PaymentData = {
  payment_id: string;
  total_amount: number;
  currency: string;
  status?: string | null;
  customer?: { customer_id?: string; email?: string; name?: string | null } | null;
  product_cart?: Array<{ product_id: string; quantity: number }> | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
};

export type LicenseKeyData = {
  id: string;
  key: string;
  status: 'active' | 'expired' | 'disabled';
  product_id: string;
  customer_id: string;
  payment_id?: string | null;
  activations_limit?: number | null;
  instances_count?: number;
  expires_at?: string | null;
  created_at?: string;
};

export type RefundData = {
  refund_id: string;
  payment_id: string;
  status: string;
  amount?: number | null;
  is_partial?: boolean;
  customer?: { customer_id?: string; email?: string } | null;
};

export type DisputeData = {
  dispute_id?: string;
  payment_id: string;
  amount?: string | number;
  dispute_status?: string;
  dispute_stage?: string;
};

// ---------------------------------------------------------------------------
// Licence API errors → our codes
// ---------------------------------------------------------------------------

export type LicenseErrorCode = 'not_found' | 'inactive' | 'limit_reached' | 'invalid' | 'server';

/** Maps a Dodo API error to the code the Mac app understands. */
export function licenseErrorCode(error: unknown): { code: LicenseErrorCode; status: number } {
  const status = (error as { status?: number })?.status ?? 500;
  switch (status) {
    case 404: return { code: 'not_found', status: 404 };
    case 403: return { code: 'inactive', status: 403 };
    case 422: return { code: 'limit_reached', status: 422 };
    case 400: return { code: 'invalid', status: 400 };
    default: return { code: 'server', status: status >= 500 ? 502 : status };
  }
}
