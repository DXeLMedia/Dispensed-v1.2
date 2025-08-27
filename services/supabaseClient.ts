import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Hardcoded Supabase credentials to ensure connection in the simple
// module-based environment where process.env is not available.
// These values are based on the user's provided credentials.
export const supabaseUrl = 'https://ivhqfwktgaoktdxqznhx.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2aHFmd2t0Z2Fva3RkeHF6bmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzUxNjEsImV4cCI6MjA2ODg1MTE2MX0.6Bbrbtg-sfKYKwfM1WhKVwxIlYKrIamAUfWO4PlpNDk';


if (!supabaseUrl || !supabaseAnonKey) {
  // This check is now redundant but kept for safety.
  throw new Error("Supabase credentials are not set.");
}

/**
 * The Supabase client instance.
 *
 * In a full TypeScript application, you would typically generate types from your database
 * schema and pass them to createClient for full type-safety, e.g., createClient<Database>(...).
 */
// FIX: Added <Database> generic to createClient to enable TypeScript type safety for all Supabase operations.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);