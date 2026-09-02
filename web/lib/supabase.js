import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase client (singleton)
let client;

export function getSupabase() {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Auth and DB features will not work.');
    return null;
  }
  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

// Server-side Supabase client (for API routes)
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) {
    console.warn('Supabase server credentials not configured.');
    return null;
  }
  return createClient(url, serviceKey);
}
