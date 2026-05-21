/**
 * Browser-side Supabase client singleton for admin.
 *
 * Mirrors `apps/web/src/lib/supabase-client.ts` — used for Realtime subscriptions
 * to `hieu_asia.llm_traces` so dashboards can refetch on INSERT without polling.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;
let _disabled = false;

export function getBrowserSupabase(): SupabaseClient | null {
  if (_disabled) return null;
  if (_client) return _client;
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    _disabled = true;
    return null;
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 5 } },
    db: { schema: 'hieu_asia' as never },
  });
  return _client;
}
