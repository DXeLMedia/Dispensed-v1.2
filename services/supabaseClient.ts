import { createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import { Database } from './supabase';

// Hardcoded Supabase credentials to ensure connection in the simple
// module-based environment where process.env is not available.
// These values are based on the user's provided credentials.
export const supabaseUrl = 'https://ivhqfwktgaoktdxqznhx.supabase.co';
// FIX: Replaced the Supabase `service_role` key with the correct `anon` key. The `service_role` key is a secret and must never be used in client-side code. Exposing it is a major security vulnerability that bypasses all Row Level Security policies. Its misuse was also the likely cause of the "TypeError: Failed to fetch" errors, as browsers and Supabase servers may block such requests for security reasons.
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2aHFmd2t0Z2Fva3RkeHF6bmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzUxNjEsImV4cCI6MjA2ODg1MTE2MX0.6Bbrbtg-sfKYKwfM1WhKVwxIlYKrIamAUfWO4PlpNDk';


if (!supabaseUrl || !supabaseAnonKey) {
  // This check is now redundant but kept for safety.
  throw new Error("Supabase credentials are not set.");
}

// Explicitly define client options to improve robustness in various environments.
const options: SupabaseClientOptions<'public'> = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
};


/**
 * The Supabase client instance.
 *
 * This instance is now created with explicit options to ensure consistent
 * behavior, particularly for session management and storage, which can be a
 * source of low-level network errors if not configured correctly for the
 * execution environment.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, options);
