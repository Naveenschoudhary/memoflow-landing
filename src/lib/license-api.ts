import 'server-only';
import { NextResponse } from 'next/server';
import { hashKey } from './dodo';
import { withinRateLimit } from './licensing';

/**
 * Shared plumbing for /api/license/*: parse and bound the body, rate-limit
 * per key and per IP, and answer in the shape the Mac app decodes.
 *
 *   errors: { code: not_found | inactive | limit_reached | invalid | server | rate_limited, message }
 */

export const MAX_BODY = 4 * 1024;
export const PER_KEY_PER_MINUTE = 30;
export const PER_IP_PER_MINUTE = 90;

export type LicenseBody = {
  key: string;
  keyHash: string;
  instanceID: string | null;
  deviceName: string | null;
  appVersion: string | null;
  ipCountry: string | null;
};

export function error(code: string, message: string, status: number) {
  return NextResponse.json({ code, message }, { status });
}

/** Reads and validates the request; returns a response to send instead when it is not usable. */
export async function readLicenseBody(req: Request): Promise<LicenseBody | NextResponse> {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return error('invalid', 'Request too large', 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return error('invalid', 'Body must be JSON', 400);
  }

  const key = typeof body.key === 'string' ? body.key.trim() : '';
  if (key.length < 8 || key.length > 128) {
    return error('invalid', "That doesn't look like a MemoFlow licence key", 400);
  }
  const str = (v: unknown, max: number) =>
    typeof v === 'string' && v.length > 0 ? v.slice(0, max) : null;

  const keyHash = hashKey(key);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!(await withinRateLimit(`key:${keyHash}`, PER_KEY_PER_MINUTE)) ||
      !(await withinRateLimit(`ip:${ip}`, PER_IP_PER_MINUTE))) {
    return error('rate_limited', 'Too many attempts — try again in a minute', 429);
  }

  return {
    key,
    keyHash,
    instanceID: str(body.instanceID, 64),
    deviceName: str(body.deviceName, 120),
    appVersion: str(body.appVersion, 32),
    ipCountry: req.headers.get('x-vercel-ip-country'),
  };
}
