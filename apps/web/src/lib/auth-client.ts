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
import { getPostHog } from './posthog';
import { clearAnonState } from './anon-cleanup';

let _client: SupabaseClient | null = null;
let _disabled = false;

export function getSupabaseAuth(): SupabaseClient | null {
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
/**
 * Resolve the public site origin for auth redirects.
 *
 * Order:
 *   1. `NEXT_PUBLIC_SITE_URL` env (preferred, set on Vercel = https://hieu.asia)
 *   2. `window.location.origin` (falls back to current host — works on previews)
 *
 * Note: The actual link inside the email is built by Supabase from its
 * dashboard "Site URL" + this `redirectTo` as a query param. So Supabase
 * Auth → URL Configuration → Site URL must ALSO be set to `https://hieu.asia`,
 * else emails ship with `http://localhost:3000` links regardless of what we
 * pass here.
 */
function resolveSiteOrigin(): string | undefined {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.startsWith('http')) return envUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return undefined;
}

export async function sendMagicLink(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAuth();
  if (!supabase) return { ok: false, error: 'auth_unavailable' };

  const origin = resolveSiteOrigin();
  const redirectTo = origin ? `${origin}/auth/callback` : undefined;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Sign in with a third-party OAuth provider. Supported in Wave 14:
 *  - google
 *  - facebook
 *  - apple
 *
 * Provider must be enabled + credentials set in Supabase dashboard
 * (Auth → Providers). Returns immediately after triggering the redirect —
 * the user will land back on `/auth/callback` post-OAuth.
 */
export async function signInWithOAuth(
  provider: 'google' | 'facebook' | 'apple',
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAuth();
  if (!supabase) return { ok: false, error: 'auth_unavailable' };

  const origin = resolveSiteOrigin();
  const redirectTo = origin ? `${origin}/auth/callback` : undefined;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      // Force account selection so users on shared devices can pick.
      queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseAuth();
  if (!supabase) return;
  await supabase.auth.signOut();
  // Reset PostHog distinct_id so the next anonymous session is a new visitor.
  try {
    const ph = getPostHog();
    if (ph) ph.reset();
  } catch {
    /* ignore */
  }
  // P1 audit fix (Wave 14): clear anonymous-state localStorage so the next
  // user on this device doesn't inherit prior anon data (persona, referrer,
  // session_id, onboarding draft, etc.).
  clearAnonState();
}
