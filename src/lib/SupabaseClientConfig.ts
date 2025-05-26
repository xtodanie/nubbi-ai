import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key environment variables.');
  // Depending on your application's needs, you might want to throw an error here
  // throw new Error('Missing Supabase URL or Anon Key environment variables.');
}

// Create a single Supabase client for the app
// Using the inferred type for better type safety
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
