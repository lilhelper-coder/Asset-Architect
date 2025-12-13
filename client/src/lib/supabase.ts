/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Realtime features will be unavailable.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type-safe database schema (expand as needed)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: string;
          is_subscriber: boolean;
          subscription_tier: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: string;
          is_subscriber?: boolean;
          subscription_tier?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
        };
        Update: {
          full_name?: string | null;
          is_subscriber?: boolean;
          subscription_tier?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          senior_id: string | null;
          status: string;
          last_transcript: string | null;
          current_view: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          senior_id?: string | null;
          status?: string;
          last_transcript?: string | null;
          current_view?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          senior_id?: string | null;
          status?: string;
          last_transcript?: string | null;
          current_view?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};

// Helper function to check if Supabase is available
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

