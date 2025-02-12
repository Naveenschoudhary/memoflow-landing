import { NextResponse } from 'next/server';
import { supabase, isInitialized } from '@/lib/supabase';

export async function GET() {
  try {
    const initialized = isInitialized();
    
    if (!initialized) {
      return NextResponse.json({
        error: 'Supabase not initialized',
        config: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: !!process.env.SUPABASE_SERVICE_KEY
        }
      }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({
        error: 'Supabase query failed',
        details: error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      initialized,
      data
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error.message
    }, { status: 500 });
  }
} 