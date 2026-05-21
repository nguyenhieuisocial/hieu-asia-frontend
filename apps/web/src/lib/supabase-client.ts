/**
 * Browser-side Supabase client singleton.
 *
 * Used for Realtime subscriptions to `hieu_asia.reading_sessions` so the
 * processing page can react to worker progress updates without polling.
 *
 * Reads are still served by the server-side `/api/reading/[id]` proxy.
 */

import {
  createClient,
  type SupabaseClient,
} from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;
let _disabled = false;

/**
 * Returns the browser Supabase client, or `null` when the public env vars
 * are missing (e.g. during build-time SSR or misconfigured deploys).
 * Callers must fall back to polling in the null case.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  if (_disabled) return null;
  if (_client) return _client;
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer new `sb_publishable_*` key (Oct 2025+); fall back to legacy
  // `eyJ…` anon JWT during migration.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    _disabled = true;
    return null;
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
    realtime: {
      params: { eventsPerSecond: 5 },
    },
  });
  return _client;
}
