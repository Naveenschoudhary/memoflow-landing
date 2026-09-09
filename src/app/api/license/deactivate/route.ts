import { NextResponse } from 'next/server';
import { dodo, licenseErrorCode } from '@/lib/dodo';
import { error, readLicenseBody } from '@/lib/license-api';
import { logActivation } from '@/lib/licensing';

export const dynamic = 'force-dynamic';

/** POST { key, instanceID } → 200 {} */
export async function POST(req: Request) {
  const body = await readLicenseBody(req);
  if (body instanceof NextResponse) return body;
  if (!body.instanceID) return error('invalid', 'instanceID is required', 400);

  try {
    await dodo().licenses.deactivate({
      license_key: body.key,
      license_key_instance_id: body.instanceID,
    });
    await logActivation({
      key_hash: body.keyHash, action: 'deactivate', instance_id: body.instanceID,
      device_name: body.deviceName, app_version: body.appVersion, outcome: 'ok',
      ip_country: body.ipCountry,
    });
    return NextResponse.json({});
  } catch (e) {
    const { code, status } = licenseErrorCode(e);
    if (code === 'server') console.error('deactivate: provider error', e);
    return error(code, code === 'not_found' ? 'That activation was not found.' : 'Could not deactivate right now.', status);
  }
}
