import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { sql, isInitialized } from './db';
import { EmailTemplate } from '@/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

// MemoFlow is a native macOS app — one notarized DMG, hosted as a GitHub
// release asset. Bump both constants together on each release.
const APP_VERSION = '0.2.0';
const MAC_DMG_URL = `https://github.com/Naveenschoudhary/memoflow-models/releases/download/v${APP_VERSION}/MemoFlow-${APP_VERSION}.dmg`;

const getDownloadLink = (_os: 'mac' | 'windows' | 'linux') => MAC_DMG_URL;

export async function sendWelcomeEmail(email: string, os: 'mac' | 'windows' | 'linux') {
  if (!sql || !isInitialized()) {
    throw new Error('Database is not configured — set DATABASE_URL');
  }

  const downloadId = uuidv4();
  const actualDownloadLink = getDownloadLink(os);

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
  }

  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download/${downloadId}`;

  await sql`
    INSERT INTO downloads (id, email, os, download_link, status, email_status)
    VALUES (${downloadId}, ${email}, ${os}, ${actualDownloadLink}, 'pending', 'pending')
  `;

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: 'MemoFlow <naveen@memoflow.app>',
    to: [email],
    subject: 'Welcome to MemoFlow! Download Your App',
    react: EmailTemplate({ downloadUrl, os }) as React.ReactElement
  });

  if (emailError) {
    console.error('Resend error:', emailError);
    await sql`
      UPDATE downloads SET status = 'email_failed', email_status = 'failed'
      WHERE id = ${downloadId}
    `;
    throw new Error('Failed to send email');
  }

  await sql`UPDATE downloads SET email_status = 'sent' WHERE id = ${downloadId}`;

  return { success: true, data: emailData };
}
