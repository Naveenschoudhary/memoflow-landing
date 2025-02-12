import { supabase, isInitialized } from '@/lib/supabase';

export async function GET() {
  try {
    const initialized = isInitialized();
    
    if (!initialized) {
      return Response.json({
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
      return Response.json({
        error: 'Supabase query failed',
        details: error
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      initialized,
      data
    });
  } catch (error) {
    return Response.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 