import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Debug log to check environment variables
console.log('Supabase Config:', {
  url: supabaseUrl ? 'Set' : 'Not Set',
  key: supabaseKey ? 'Set' : 'Not Set'
});

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Test the connection with explicit schema
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('downloads')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (err) {
    console.error('Supabase connection test error:', err);
  }
};

// Run the test
testConnection();

export const isInitialized = () => {
  return !!supabase && !!supabaseUrl && !!supabaseKey;
}; 