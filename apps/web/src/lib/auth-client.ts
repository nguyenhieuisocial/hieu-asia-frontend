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

/**
 * Wave 44.2 — Cookie hint for SSR partner-gate.
 *
 * The real Supabase JWT lives in localStorage (`hieu.auth.session`) and is
 * NOT readable from the server. We mirror its presence into a non-httpOnly
 * cookie so Next.js server components can decide whether to render the
 * partner shell or 302-redirect to /signin BEFORE shipping HTML.
 *
 * Security model:
 *   - Cookie contains NO token — value is the constant string `1`.
 *   - SSR uses it only as a hint to render shell vs redirect.
 *   - Real auth boundary remains the worker JWT verify on /api/partner/*.
 *   - Defense-in-depth: client-side `usePartnerGuard()` still runs and
 *     enforces the affiliate_partner role check post-hydration.
 *
 * Full cookie-session migration (httpOnly JWT cookie + ssr-helpers) is
 * deferred to Wave 52+ when full SSG/ISR partner pages are needed.
 */
const AUTH_MARKER_COOKIE = 'hieu_authed';
const AUTH_MARKER_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function setAuthMarkerCookie(): void {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${AUTH_MARKER_COOKIE}=1; Path=/; Max-Age=${AUTH_MARKER_MAX_AGE}; SameSite=Lax${secure}`;
}

function clearAuthMarkerCookie(): void {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${AUTH_MARKER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

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

  // Wave 44.2 — sync `hieu_authed` cookie with session lifecycle so SSR
  // partner-gate can short-circuit unauthenticated requests.
  // Initial state: if there's already a restored session (page reload after
  // sign-in), set the cookie. Otherwise leave it absent.
  _client.auth
    .getSession()
    .then(({ data }) => {
      if (data.session) setAuthMarkerCookie();
      else clearAuthMarkerCookie();
    })
    .catch(() => {
      /* ignore — best-effort cookie sync */
    });
  // Reactive updates: SIGNED_IN / TOKEN_REFRESHED / SIGNED_OUT all flow here.
  // Wave 58 — also fire Meta CAPI `Lead` on the user's first SIGNED_IN of
  // the device. Uses localStorage flag so we don't fire on every reload (which
  // would also fire SIGNED_IN as Supabase restores the session). User clearing
  // localStorage re-fires once — acceptable noise; FB dedups by event_id +
  // email_hash anyway.
  _client.auth.onAuthStateChange(async (event, session) => {
    if (session) setAuthMarkerCookie();
    else clearAuthMarkerCookie();
    if (event === 'SIGNED_IN' && session?.user) {
      try {
        const FIRED_KEY = 'hieu:capi:lead-fired:v1';
        if (typeof window !== 'undefined' && !localStorage.getItem(FIRED_KEY)) {
          localStorage.setItem(FIRED_KEY, '1');
          const { trackPixelLead } = await import('./marketing-pixels');
          // hash email for CAPI matching (FB requires sha256 lowercase)
          const email = session.user.email?.trim().toLowerCase();
          let emailHash: string | undefined;
          if (email && typeof crypto !== 'undefined' && crypto.subtle) {
            const bytes = new TextEncoder().encode(email);
            const buf = await crypto.subtle.digest('SHA-256', bytes);
            emailHash = Array.from(new Uint8Array(buf))
              .map((b) => b.toString(16).padStart(2, '0'))
              .join('');
          }
          trackPixelLead(
            { content_name: 'signin-first-time' },
            { emailHash, eventId: `lead-${session.user.id}` },
          );
        }
      } catch {
        /* never block auth on telemetry failure */
      }
    }
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

/**
 * Append `?next=<encoded>` to a callback URL when `next` is a same-origin
 * relative path. Defends against open-redirect by requiring `/`-prefix.
 * Wave 44.4 (#251): closes /ultrareview P1#1 — magic-link/OAuth roundtrips
 * now carry the original signin `next` param all the way to /auth/callback.
 */
function withNextParam(callbackUrl: string | undefined, next: string | null | undefined): string | undefined {
  if (!callbackUrl) return undefined;
  if (!next || typeof next !== 'string' || !next.startsWith('/')) return callbackUrl;
  const sep = callbackUrl.includes('?') ? '&' : '?';
  return `${callbackUrl}${sep}next=${encodeURIComponent(next)}`;
}

export async function sendMagicLink(
  email: string,
  next?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAuth();
  if (!supabase) return { ok: false, error: 'auth_unavailable' };

  const origin = resolveSiteOrigin();
  const redirectTo = withNextParam(origin ? `${origin}/auth/callback` : undefined, next);

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
  next?: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabaseAuth();
  if (!supabase) return { ok: false, error: 'auth_unavailable' };

  const origin = resolveSiteOrigin();
  const redirectTo = withNextParam(origin ? `${origin}/auth/callback` : undefined, next);

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
  if (!supabase) {
    // Wave 44.2 — clear SSR hint even when no client (lingers from prior session).
    clearAuthMarkerCookie();
    return;
  }
  await supabase.auth.signOut();
  // Wave 44.2 — explicit cookie clear. onAuthStateChange should also fire
  // SIGNED_OUT but we don't rely on listener ordering for the redirect that
  // typically follows sign-out.
  clearAuthMarkerCookie();
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
