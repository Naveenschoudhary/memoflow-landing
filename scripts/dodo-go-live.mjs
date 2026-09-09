#!/usr/bin/env node
/**
 * One-time go-live for Dodo Payments. Idempotent: re-running finds the
 * existing products and endpoint by name/URL instead of creating twins.
 *
 *   1. Creates the three products (Personal $20 / 2 activations, Team $40 / 6,
 *      Organisation $300 / 40) with licence keys on.
 *   2. Registers https://memoflow.app/api/webhooks/dodo for the events the
 *      handler understands and fetches its signing secret.
 *   3. Writes DODO_PRODUCT_* and DODO_WEBHOOK_SECRET into Vercel Production
 *      (and prints them for .env.local — the secret is never printed in full).
 *
 * Usage:
 *   vercel env pull .env.production.local --environment=production
 *   node scripts/dodo-go-live.mjs            # reads DODO_API_KEY, DODO_MODE from that file
 *   node scripts/dodo-go-live.mjs --dry-run  # shows what it would do
 *
 * Requires: DODO_API_KEY (live) in .env.production.local or the environment.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import DodoPayments from 'dodopayments';

const dryRun = process.argv.includes('--dry-run');
const envFile = ['.env.production.local', '.env.local'].find((f) => fs.existsSync(f));
const fileEnv = envFile
  ? Object.fromEntries(
      fs.readFileSync(envFile, 'utf8').split('\n')
        .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
        .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; })
    )
  : {};
const env = { ...fileEnv, ...process.env };

const apiKey = env.DODO_API_KEY;
if (!apiKey) { console.error('DODO_API_KEY missing — run: vercel env pull .env.production.local --environment=production'); process.exit(1); }
const mode = env.DODO_MODE === 'test' ? 'test' : 'live';
// The webhook URL must be the public site. A local NEXT_PUBLIC_APP_URL
// (http://localhost:3000 in .env.local) once registered a localhost endpoint;
// only an https value is trusted, and --site overrides.
const siteArg = process.argv.find((a) => a.startsWith('--site='))?.slice(7);
const site = siteArg || (env.NEXT_PUBLIC_APP_URL?.startsWith('https://') ? env.NEXT_PUBLIC_APP_URL : 'https://memoflow.app');
const client = new DodoPayments({ bearerToken: apiKey, environment: mode === 'test' ? 'test_mode' : 'live_mode' });

const PRODUCTS = [
  { env: 'DODO_PRODUCT_PERSONAL', name: 'MemoFlow Personal', description: '1 person · 1 Mac + 1 iPhone · lifetime licence', price: 2000, limit: 2 },
  { env: 'DODO_PRODUCT_TEAM', name: 'MemoFlow Team', description: '3 people · lifetime licence', price: 4000, limit: 6 },
  { env: 'DODO_PRODUCT_ORG', name: 'MemoFlow Organisation', description: 'Up to 20 people · lifetime licence', price: 30000, limit: 40 },
];
const WEBHOOK_URL = `${site}/api/webhooks/dodo`;
const EVENTS = ['payment.succeeded', 'payment.failed', 'payment.cancelled', 'license_key.created', 'refund.succeeded', 'refund.failed',
  'dispute.opened', 'dispute.challenged', 'dispute.won', 'dispute.lost', 'dispute.accepted', 'dispute.cancelled', 'dispute.expired'];

console.log(`Dodo ${mode} mode · site ${site} · ${dryRun ? 'DRY RUN' : 'live changes'}\n`);

// 1. Products — reuse by name.
const existing = [];
for await (const p of client.products.list({ page_size: 100 })) existing.push(p);
const results = {};
for (const spec of PRODUCTS) {
  let product = existing.find((p) => p.name === spec.name);
  if (product) {
    console.log(`✓ ${spec.name}: exists (${product.product_id})`);
  } else if (dryRun) {
    console.log(`· would create ${spec.name} at $${spec.price / 100}, ${spec.limit} activations`);
    continue;
  } else {
    product = await client.products.create({
      name: spec.name,
      description: spec.description,
      tax_category: 'digital_products',
      price: { type: 'one_time_price', currency: 'USD', price: spec.price, discount: 0, purchasing_power_parity: false, tax_inclusive: false },
      license_key_enabled: true,
      license_key_activations_limit: spec.limit,
      license_key_activation_message: 'Open MemoFlow › Settings › License and paste this key.',
    });
    console.log(`+ ${spec.name}: created (${product.product_id})`);
  }
  results[spec.env] = product.product_id;
}

// 2. Webhook endpoint — reuse by URL.
let endpoint = null;
for await (const w of client.webhooks.list({ limit: 100 })) if (w.url === WEBHOOK_URL) endpoint = w;
if (endpoint) {
  console.log(`✓ webhook endpoint exists (${endpoint.id})`);
} else if (dryRun) {
  console.log(`· would register ${WEBHOOK_URL} for ${EVENTS.length} event types`);
} else {
  endpoint = await client.webhooks.create({ url: WEBHOOK_URL, description: 'memoflow.app payments backend', filter_types: EVENTS });
  console.log(`+ webhook endpoint registered (${endpoint.id})`);
}
let secret = null;
if (endpoint && !dryRun) {
  secret = (await client.webhooks.retrieveSecret(endpoint.id)).secret;
  console.log(`✓ webhook secret fetched (${secret.slice(0, 6)}…${secret.slice(-4)})`);
}

// 3. Vercel Production env.
if (dryRun) { console.log('\nDry run complete.'); process.exit(0); }
const setEnv = (name, value) => {
  try { execFileSync('vercel', ['env', 'rm', name, 'production', '-y'], { stdio: 'ignore' }); } catch {}
  execFileSync('vercel', ['env', 'add', name, 'production'], { input: value, stdio: ['pipe', 'ignore', 'inherit'] });
  console.log(`  vercel: ${name} set`);
};
console.log('\nVercel Production:');
for (const [name, id] of Object.entries(results)) setEnv(name, id);
if (secret) setEnv('DODO_WEBHOOK_SECRET', secret);

console.log('\nAdd to .env.local for local runs (live!):');
for (const [name, id] of Object.entries(results)) console.log(`  ${name}=${id}`);
if (secret) console.log('  DODO_WEBHOOK_SECRET=<see Vercel; not printed>');
console.log('\nNext: git push (Vercel deploys), then the live smoke purchase.');
