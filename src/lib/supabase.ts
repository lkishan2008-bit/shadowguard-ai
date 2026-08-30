import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate before creating client so the app never crashes due to missing env vars
const isConfigured =
  supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 10;

if (!isConfigured) {
  console.warn(
    '[ShadowGuard] Supabase not configured. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your root .env or .env.local file.'
  );
}

/** Supabase client — uses the public anon key only. Safe for frontend. */
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
