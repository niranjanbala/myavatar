import { createClient } from '@supabase/supabase-js';
import { Avatar, Vote } from '@/types';

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      niranjan_avatars: {
        Row: Avatar;
        Insert: Omit<Avatar, 'id' | 'created_at'>;
        Update: Partial<Omit<Avatar, 'id' | 'created_at'>>;
      };
      niranjan_votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Omit<Vote, 'id' | 'created_at'>>;
      };
    };
  };
}

// Function to get Supabase client (only creates when needed)
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Function to get typed Supabase client
export function getTypedSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing');
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Legacy exports for backward compatibility (will throw if not configured)
export const supabase = (() => {
  try {
    return getSupabaseClient();
  } catch {
    return null;
  }
})();

export const typedSupabase = (() => {
  try {
    return getTypedSupabaseClient();
  } catch {
    return null;
  }
})();