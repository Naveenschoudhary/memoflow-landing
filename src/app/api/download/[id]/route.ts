import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log('Fetching download with ID:', id);

    // Get download info from Supabase with schema specified
    const { data, error } = await supabase
      .schema('public')
      .from('downloads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch download information',
          details: error.message
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error('Download not found for ID:', id);
      return NextResponse.json(
        { error: 'Download link not found or expired' },
        { status: 404 }
      );
    }

    console.log('Found download data:', data);

    // Update download status
    const { error: updateError } = await supabase
      .schema('public')
      .from('downloads')
      .update({ 
        status: 'downloaded', 
        downloaded_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update download status:', updateError);
      // Continue with redirect even if status update fails
    }

    // Ensure we have a valid download link
    if (!data.download_link) {
      console.error('Download link is missing for ID:', id);
      return NextResponse.json(
        { error: 'Download link is invalid' },
        { status: 500 }
      );
    }

    console.log('Redirecting to:', data.download_link);

    // Redirect to actual download URL
    return NextResponse.redirect(data.download_link);
  } catch (error) {
    console.error('Download route error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 