import { db, DownloadRow } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getLatestRelease } from '@/lib/release';
import type { RowDataPacket } from 'mysql2';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!db) {
      return Response.json({ error: 'Database is not configured' }, { status: 500 });
    }

    // Expiry is computed on the database server — its clock stamped
    // created_at, so comparing there is immune to timezone differences.
    const [rows] = await db.execute<(DownloadRow & { expired: number } & RowDataPacket)[]>(
      `SELECT *, (created_at < NOW() - INTERVAL 10 MINUTE) AS expired
       FROM downloads WHERE id = ?`,
      [id]
    );
    const data = rows[0];

    if (!data) {
      return Response.json({ error: 'Download link not found' }, { status: 404 });
    }

    if (data.expired) {
      await db.execute(`UPDATE downloads SET status = 'expired' WHERE id = ?`, [id]);
      return redirect('/download/expired');
    }

    // Email tokens can predate a release. Choose the current build at click
    // time rather than redirecting to the URL saved when the email was sent.
    const { dmgUrl } = await getLatestRelease();
    await db.execute(
      `UPDATE downloads SET status = 'downloaded', downloaded_at = NOW(), download_link = ? WHERE id = ?`,
      [dmgUrl, id]
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: dmgUrl,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return redirect('/download/expired');
  }
}
