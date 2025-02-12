import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import { supabase, isInitialized } from './supabase';
import { EmailTemplate } from '@/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

const getDownloadLink = (os: 'mac' | 'windows' | 'linux') => {
  switch (os) {
    case 'mac':
      return 'https://assets.naveenschoudhary.com/memoflow/macos/Memoflow-1.0.0-arm64.dmg';
    case 'windows':
      return 'https://assets.naveenschoudhary.com/memoflow/windows/Memoflow%20Setup%201.0.0.exe';
    case 'linux':
      return 'https://assets.naveenschoudhary.com/memoflow/ubantu/memoflow_1.0.0_arm64.deb';
    default:
      throw new Error(`Invalid OS: ${os}`);
  }
};

export async function sendWelcomeEmail(email: string, os: 'mac' | 'windows' | 'linux') {
  try {
    // Check if Supabase is properly initialized
    if (!isInitialized()) {
      throw new Error('Supabase is not properly initialized');
    }

    const downloadId = uuidv4();
    const actualDownloadLink = getDownloadLink(os);
    
    // Ensure NEXT_PUBLIC_APP_URL is set
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
    }
    
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download/${downloadId}`;

    console.log('Creating download record:', {
      id: downloadId,
      email,
      os,
      downloadUrl,
      actualDownloadLink
    });

    // First, check if the table exists
    const { error: tableCheckError } = await supabase
      .schema('public')
      .from('downloads')
      .select('id')
      .limit(1);

    if (tableCheckError) {
      console.error('Table check error:', tableCheckError);
      throw new Error('Downloads table not accessible. Please check database setup.');
    }

    // Store in Supabase with better error logging
    const { error: dbError, data } = await supabase
      .schema('public')
      .from('downloads')
      .insert([
        {
          id: downloadId,
          email,
          os,
          download_link: actualDownloadLink,
          created_at: new Date().toISOString(),
          status: 'pending',
          email_status: 'pending'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase error details:', {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        status: dbError.cause,
        error: JSON.stringify(dbError)
      });
      throw new Error(`Database error: ${dbError.message || 'Unknown error'}`);
    }

    console.log('Successfully stored in Supabase:', data);

    // Send email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'MemoFlow <naveen@memoflow.app>',
      to: [email],
      subject: 'Welcome to MemoFlow! Download Your App',
      react: EmailTemplate({ downloadUrl, os }) as React.ReactElement
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      await supabase
        .from('downloads')
        .update({ 
          status: 'email_failed',
          email_status: 'failed'
        })
        .eq('id', downloadId);
      throw new Error('Failed to send email');
    }

    // Update email status to sent
    await supabase
      .from('downloads')
      .update({ email_status: 'sent' })
      .eq('id', downloadId);

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    throw error;
  }
} 