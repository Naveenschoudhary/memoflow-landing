import { db } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

/// Health check: confirms DATABASE_URL is set, reachable, and the downloads
/// table exists. Returns counts only — no emails or links.
export async function GET() {
  if (!db) {
    return Response.json(
      { error: 'DATABASE_URL is not set' },
      { status: 500 }
    );
  }

  try {
    const [rows] = await db.execute<({ total: number; downloaded: number } & RowDataPacket)[]>(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(status = 'downloaded'), 0) AS downloaded
       FROM downloads`
    );
    return Response.json({
      success: true,
      signups: Number(rows[0].total),
      downloaded: Number(rows[0].downloaded),
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Database query failed — is the server reachable and schema.sql applied?',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
