import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { db, isInitialized } from './db';
import { EmailTemplate } from '@/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

// MemoFlow is a native macOS app — one notarized DMG, hosted as a GitHub
// release asset. Bump both constants together on each release.
const APP_VERSION = '0.3.0';
const MAC_DMG_URL = `https://github.com/Naveenschoudhary/memoflow-models/releases/download/v${APP_VERSION}/MemoFlow-${APP_VERSION}.dmg`;

const getDownloadLink = (_os: 'mac' | 'windows' | 'linux') => MAC_DMG_URL;

// Resend's shared address works without domain verification (but only
// delivers to the Resend account owner). Once memoflow.app is verified on
// https://resend.com/domains, set EMAIL_FROM="MemoFlow <naveen@memoflow.app>"
// in Vercel — no code change needed.
const EMAIL_FROM = process.env.EMAIL_FROM || 'MemoFlow <onboarding@resend.dev>';

export async function sendWelcomeEmail(email: string, os: 'mac' | 'windows' | 'linux') {
  if (!db || !isInitialized()) {
    throw new Error('Database is not configured — set DATABASE_URL');
  }

  const downloadId = uuidv4();
  const actualDownloadLink = getDownloadLink(os);

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
  }

  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download/${downloadId}`;

  await db.execute(
    `INSERT INTO downloads (id, email, os, download_link, status, email_status)
     VALUES (?, ?, ?, ?, 'pending', 'pending')`,
    [downloadId, email, os, actualDownloadLink]
  );

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [email],
    subject: 'Welcome to MemoFlow! Download Your App',
    react: EmailTemplate({ downloadUrl, os }) as React.ReactElement,
    // A plain-text part improves spam-filter scores over HTML-only mail.
    text: `Welcome to MemoFlow!\n\nDownload MemoFlow for macOS: ${downloadUrl}\n\nRequires macOS 26 or later. This link expires in 10 minutes.\nNothing you record ever leaves your Mac.`
  });

  if (emailError) {
    console.error('Resend error:', emailError);
    await db.execute(
      `UPDATE downloads SET status = 'email_failed', email_status = 'failed' WHERE id = ?`,
      [downloadId]
    );
    throw new Error(`Email delivery failed: ${emailError.message || emailError.name}`);
  }

  await db.execute(`UPDATE downloads SET email_status = 'sent' WHERE id = ?`, [downloadId]);

  return { success: true, data: emailData };
}
