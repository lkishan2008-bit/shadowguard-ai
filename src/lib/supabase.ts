import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

const isConfigured =
  supabaseUrl.startsWith('https://') && supabaseKey.length > 10;

if (!isConfigured) {
  console.warn(
    '[ShadowGuard] Supabase not configured. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your root .env.local file.'
  );
}

/** Supabase client — uses only a public frontend key. */
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    );
