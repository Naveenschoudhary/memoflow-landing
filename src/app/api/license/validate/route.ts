import { NextResponse } from 'next/server';
import { dodo, licenseErrorCode } from '@/lib/dodo';
import { error, readLicenseBody } from '@/lib/license-api';
import { licenseStatusByHash, logActivation } from '@/lib/licensing';

export const dynamic = 'force-dynamic';

/** POST { key, instanceID? } → { valid } */
export async function POST(req: Request) {
  const body = await readLicenseBody(req);
  if (body instanceof NextResponse) return body;

  const known = await licenseStatusByHash(body.keyHash).catch(() => null);
  if (known === 'revoked' || known === 'disabled') {
    return NextResponse.json({ valid: false });
  }

  try {
    const r = await dodo().licenses.validate({
      license_key: body.key,
      license_key_instance_id: body.instanceID,
    });
    if (!r.valid) {
      await logActivation({
        key_hash: body.keyHash, action: 'validate', instance_id: body.instanceID,
        device_name: body.deviceName, app_version: body.appVersion, outcome: 'invalid',
        ip_country: body.ipCountry,
      });
    }
    return NextResponse.json({ valid: !!r.valid });
  } catch (e) {
    const { code, status } = licenseErrorCode(e);
    if (code === 'invalid') return NextResponse.json({ valid: false });
    console.error('validate: provider error', e);
    return error('server', 'The licence server had a problem. Try again in a minute.', status >= 500 ? 502 : status);
  }
}
