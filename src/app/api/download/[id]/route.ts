import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

const EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id; // 'a', 'b', or 'c'

    // Get download info from Supabase
    const { data, error } = await supabase
      .schema('public')
      .from('downloads')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return Response.json(
        { error: 'Download link not found' },
        { status: 404 }
      );
    }

    // Check if the link has expired
    const createdAt = new Date(data.created_at).getTime();
    const now = Date.now();
    const timeDiff = now - createdAt;

    if (timeDiff > EXPIRATION_TIME) {
      // Update status to expired
      await supabase
        .schema('public')
        .from('downloads')
        .update({ status: 'expired' })
        .eq('id', id);

      // Redirect to expired page instead of JSON response
      return redirect('/download/expired');
    }

    // Update download status
    await supabase
      .schema('public')
      .from('downloads')
      .update({ 
        status: 'downloaded', 
        downloaded_at: new Date().toISOString() 
      })
      .eq('id', id);

    // Redirect to actual download URL
    return Response.redirect(data.download_link);
  } catch (error) {
    console.error('Download error:', error);
    return Response.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
} 