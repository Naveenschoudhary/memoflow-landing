import { NextResponse } from 'next/server';
import { createCheckout, isDodoConfigured, productIdFor } from '@/lib/dodo';
import type { TierId } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

const TIERS: TierId[] = ['personal', 'team', 'organisation'];
const SITE = process.env.NEXT_PUBLIC_APP_URL || 'https://memoflow.app';

/**
 * GET /api/checkout?tier=personal|team|organisation&source=web|app[&email=]
 *
 * Creates a Dodo checkout session server-side and sends the browser there.
 * Product ids and the API key never leave the server; the Buy buttons are
 * plain links to this route. Anything that goes wrong lands the person back
 * on /pricing with a notice rather than on a blank error.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const tier = url.searchParams.get('tier') as TierId | null;
  const source = url.searchParams.get('source') === 'app' ? 'app' : 'web';
  const email = url.searchParams.get('email');

  if (!tier || !TIERS.includes(tier)) {
    return NextResponse.redirect(`${SITE}/pricing`, 303);
  }
  if (!isDodoConfigured() || !productIdFor(tier)) {
    console.error(`checkout: Dodo not configured for tier ${tier}`);
    return NextResponse.redirect(`${SITE}/pricing?checkout=unavailable`, 303);
  }

  try {
    const checkoutUrl = await createCheckout({
      tier,
      source,
      email: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
    });
    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error('checkout: session creation failed:', error);
    return NextResponse.redirect(`${SITE}/pricing?checkout=error`, 303);
  }
}
