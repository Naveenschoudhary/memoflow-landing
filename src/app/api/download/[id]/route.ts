import { sql, DownloadRow } from '@/lib/db';
import { redirect } from 'next/navigation';

const EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!sql) {
      return Response.json({ error: 'Database is not configured' }, { status: 500 });
    }

    const rows = await sql<DownloadRow[]>`
      SELECT * FROM downloads WHERE id = ${id}
    `;
    const data = rows[0];

    if (!data) {
      return Response.json({ error: 'Download link not found' }, { status: 404 });
    }

    // Check if the link has expired
    const createdAt = new Date(data.created_at).getTime();
    if (Date.now() - createdAt > EXPIRATION_TIME) {
      await sql`UPDATE downloads SET status = 'expired' WHERE id = ${id}`;
      return redirect('/download/expired');
    }

    await sql`
      UPDATE downloads
      SET status = 'downloaded', downloaded_at = now()
      WHERE id = ${id}
    `;

    return Response.redirect(data.download_link);
  } catch (error) {
    console.error('Download error:', error);
    return redirect('/download/expired');
  }
}
