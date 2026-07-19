import { sql } from '@/lib/db';

/// Health check: confirms DATABASE_URL is set, reachable, and the downloads
/// table exists. Returns counts only — no emails or links.
export async function GET() {
  if (!sql) {
    return Response.json(
      { error: 'DATABASE_URL is not set' },
      { status: 500 }
    );
  }

  try {
    const [row] = await sql<{ total: string; downloaded: string }[]>`
      SELECT count(*) AS total,
             count(*) FILTER (WHERE status = 'downloaded') AS downloaded
      FROM downloads
    `;
    return Response.json({
      success: true,
      signups: Number(row.total),
      downloaded: Number(row.downloaded),
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
