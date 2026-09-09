import { NextResponse } from 'next/server';
import { dodo, licenseErrorCode } from '@/lib/dodo';
import { error, readLicenseBody } from '@/lib/license-api';
import { licenseStatusByHash, logActivation } from '@/lib/licensing';

export const dynamic = 'force-dynamic';

/** What Dodo answers to an activation (the fields we pass on). */
type ActivateWire = {
  id: string;
  license_key_id?: string;
  name?: string;
  product?: { product_id?: string; name?: string | null } | null;
  customer?: { customer_id?: string; email?: string | null; name?: string | null } | null;
};

/** POST { key, deviceName, appVersion, platform } → { instanceID, email, customerName, productName } */
export async function POST(req: Request) {
  const body = await readLicenseBody(req);
  if (body instanceof NextResponse) return body;

  // A key we know was refunded is refused before Dodo is even asked.
  const known = await licenseStatusByHash(body.keyHash).catch(() => null);
  if (known === 'revoked' || known === 'disabled') {
    await logActivation({ ...forLog(body, null), action: 'activate', outcome: 'inactive' });
    return error('inactive', 'This key has been deactivated.', 403);
  }

  try {
    const r = (await dodo().licenses.activate({
      license_key: body.key,
      name: body.deviceName ?? 'Mac',
    })) as unknown as ActivateWire;
    await logActivation({ ...forLog(body, r.id), action: 'activate', outcome: 'ok' });
    return NextResponse.json({
      instanceID: r.id,
      email: r.customer?.email ?? null,
      customerName: r.customer?.name ?? null,
      productName: r.product?.name ?? null,
    });
  } catch (e) {
    const { code, status } = licenseErrorCode(e);
    await logActivation({ ...forLog(body, null), action: 'activate', outcome: code });
    if (code === 'server') console.error('activate: provider error', e);
    return error(code, messageFor(code), status);
  }
}

function forLog(body: Awaited<ReturnType<typeof readLicenseBody>> & object, instanceId: string | null) {
  const b = body as Exclude<typeof body, NextResponse>;
  return {
    key_hash: b.keyHash,
    instance_id: instanceId,
    device_name: b.deviceName,
    app_version: b.appVersion,
    ip_country: b.ipCountry,
  };
}

function messageFor(code: string): string {
  switch (code) {
    case 'not_found': return "That key wasn't found. Check it against your purchase email.";
    case 'inactive': return 'This key has been deactivated.';
    case 'limit_reached': return 'This key is already used on its maximum number of devices.';
    case 'invalid': return "That doesn't look like a MemoFlow licence key.";
    default: return 'The licence server had a problem. Try again in a minute.';
  }
}
