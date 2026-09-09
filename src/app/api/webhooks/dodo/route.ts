import { NextResponse } from 'next/server';
import {
  dodo,
  hashKey,
  last4,
  tierForProduct,
  verifyWebhook,
  type DisputeData,
  type LicenseKeyData,
  type PaymentData,
  type RefundData,
  type WebhookEnvelope,
} from '@/lib/dodo';
import {
  claimEvent,
  markEventProcessed,
  purchaseEmail,
  setLicenseStatus,
  setLicenseStatusByPayment,
  setPurchaseStatus,
  upsertLicense,
  upsertPurchase,
  markWelcomeEmailSent,
  welcomeEmailSent,
} from '@/lib/licensing';
import { sendLicenseEmail } from '@/lib/license-email';

export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/dodo
 *
 * Signature-verified, idempotent by webhook-id. Records purchases and licence
 * keys, marks refunds and disputes, and sends the "here is your key, here is
 * how to activate" email. Any handler error returns 500 so Dodo retries (8
 * attempts over ~10 hours); a retry of an event that already completed is
 * acknowledged without doing anything twice.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const verified = verifyWebhook(rawBody, req.headers);
  if (!verified) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  let event: WebhookEnvelope;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  try {
    const fresh = await claimEvent(verified.id, event.type, event);
    if (!fresh) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    await handle(event);
    await markEventProcessed(verified.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`webhook ${event.type} (${verified.id}) failed:`, error);
    return NextResponse.json({ error: 'handler failed' }, { status: 500 });
  }
}

async function handle(event: WebhookEnvelope) {
  switch (event.type) {
    case 'payment.succeeded':
    case 'payment.failed':
    case 'payment.cancelled':
    case 'payment.processing':
      return onPayment(event.type, event.data as unknown as PaymentData);
    case 'license_key.created':
      return onLicenseKeyCreated(event.data as unknown as LicenseKeyData);
    case 'refund.succeeded':
      return onRefund(event.data as unknown as RefundData);
    case 'dispute.opened':
    case 'dispute.lost':
    case 'dispute.won':
    case 'dispute.accepted':
    case 'dispute.cancelled':
    case 'dispute.challenged':
    case 'dispute.expired':
      return onDispute(event.type, event.data as unknown as DisputeData);
    default:
      // Stored in dodo_events for the record; nothing to do.
      return;
  }
}

async function onPayment(type: string, p: PaymentData) {
  const productId = p.product_cart?.[0]?.product_id ?? null;
  const metadata = (p.metadata ?? {}) as Record<string, unknown>;
  await upsertPurchase({
    payment_id: p.payment_id,
    customer_id: p.customer?.customer_id ?? null,
    email: p.customer?.email ?? null,
    product_id: productId,
    tier: (typeof metadata.tier === 'string' ? (metadata.tier as never) : null) ?? tierForProduct(productId),
    amount: p.total_amount ?? null,
    currency: p.currency ?? null,
    status: type.replace('payment.', ''),
    source: typeof metadata.source === 'string' ? metadata.source : null,
    metadata,
  });
}

async function onLicenseKeyCreated(k: LicenseKeyData) {
  // The licence payload carries a customer id, not an address. The payment
  // webhook usually got here first; if not, ask Dodo.
  let email = await purchaseEmail(k.payment_id);
  if (!email) {
    try {
      email = (await dodo().customers.retrieve(k.customer_id)).email ?? null;
    } catch (error) {
      console.error('customer lookup failed:', error);
    }
  }
  const tier = tierForProduct(k.product_id);
  await upsertLicense({
    license_key_id: k.id,
    key_hash: hashKey(k.key),
    key_last4: last4(k.key),
    customer_id: k.customer_id,
    email,
    product_id: k.product_id,
    tier,
    payment_id: k.payment_id ?? null,
    activations_limit: k.activations_limit ?? null,
    status: k.status,
  });

  if (email && !(await welcomeEmailSent(k.id))) {
    await sendLicenseEmail({ to: email, key: k.key, tier });
    await markWelcomeEmailSent(k.id);
  }
}

async function onRefund(r: RefundData) {
  if (r.status !== 'succeeded') return;
  await setPurchaseStatus(r.payment_id, r.is_partial ? 'partially_refunded' : 'refunded');
  if (r.is_partial) return;
  // Dodo revokes the entitlement on refund as well; disabling the key here
  // makes it certain and immediate. The app locks at its next check.
  const ids = await setLicenseStatusByPayment(r.payment_id, 'revoked');
  for (const id of ids) {
    try {
      await dodo().licenseKeys.update(id, { disabled: true });
    } catch (error) {
      console.error(`disable licence ${id} after refund failed:`, error);
    }
  }
}

async function onDispute(type: string, d: DisputeData) {
  await setPurchaseStatus(d.payment_id, type.replace('dispute.', 'dispute_'));
  if (type === 'dispute.lost') {
    const ids = await setLicenseStatusByPayment(d.payment_id, 'revoked');
    for (const id of ids) {
      try {
        await dodo().licenseKeys.update(id, { disabled: true });
        await setLicenseStatus(id, 'revoked');
      } catch (error) {
        console.error(`disable licence ${id} after lost dispute failed:`, error);
      }
    }
  }
  console.error(`dispute: ${type} on ${d.payment_id}`);
}
