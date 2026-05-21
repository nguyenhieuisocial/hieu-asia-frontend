/**
 * Supabase Auth client (magic link) — browser singleton.
 *
 * Distinct from `supabase-client.ts` which is configured for Realtime only
 * (persistSession: false). This client enables `persistSession` and
 * `detectSessionInUrl` so the magic-link callback can complete the exchange
 * and the user stays logged in across reloads.
 *
 * Returns `null` when public env vars are missing, so callers can fall back
 * to anonymous flows gracefully.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;
let _disabled = false;

export function getSupabaseAuth(): SupabaseClient | null {
  if (_disabled) return null;
  if (_client) return _client;
  if (typeof window === 'undefined') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    _disabled = true;
    return null;
  }

  _client = createClient(url, anon, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
      storageKey: 'hieu.auth.session',
    },
  });
  return _client;
}

/**
 * Send a magic link to `email`. The link redirects back to `/auth/callback`.
 * Returns `{ ok: true }` on success or `{ ok: false, error }` otherwise.
 */
export async function sendMagicLink(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAuth();
  if (!supabase) return { ok: false, error: 'auth_unavailable' };

  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseAuth();
  if (!supabase) return;
  await supabase.auth.signOut();
}
