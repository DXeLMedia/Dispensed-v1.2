import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Hardcoded Supabase credentials to ensure connection in the simple
// module-based environment where process.env is not available.
// These values are based on the user's provided credentials.
export const supabaseUrl = 'https://lkxebvjbbskdbhkfgdip.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreGVidmpiYnNrZGJoa2ZnZGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTE3NjIsImV4cCI6MjA2OTUyNzc2Mn0.GBZ3yCa17dTAT-yDMgKfLuIQEtbB8qYENab9ppN4224';


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
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
