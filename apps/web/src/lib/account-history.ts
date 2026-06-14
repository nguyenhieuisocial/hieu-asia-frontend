/**
 * Same-origin client helpers for reading history + consent audit.
 *
 * These replace the direct anon-key Edge Function calls (`listReadings` /
 * `logAudit` in @hieu-asia/supabase) which now 401 because the `reading-list`
 * and `audit-log` EFs were gated behind a service token (Wave 64 P0). Instead
 * we call our own same-origin /api/* routes, which attach the service token
 * server-side and derive the user/actor from the verified session — so the
 * caller never holds a privileged token and can never scope to another user.
 *
 * Auth: we forward the Supabase access_token as `Authorization: Bearer` exactly
 * like DataExportSection does for /api/account/export. The server re-verifies it
 * (getSessionFromRequest); the token is the ONLY identity input it trusts.
 */

import { getSupabaseAuth } from '@/lib/auth-client';
import type { ReadingSessionRow } from '@hieu-asia/supabase';

export type { ReadingSessionRow };

async function authHeader(): Promise<Record<string, string>> {
  try {
    const sb = getSupabaseAuth();
    if (!sb) return {};
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    return token ? { authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

/**
 * Reading history for the signed-in user (+ their claimed anon id), via the
 * secure same-origin route. Returns [] when signed out or on any error — the
 * dashboard treats an empty history as "nothing yet", same as before.
 */
export async function listMyReadings(): Promise<ReadingSessionRow[]> {
  const headers = await authHeader();
  if (!headers.authorization) return []; // not signed in → nothing to show
  try {
    const res = await fetch('/api/reading/list', {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { sessions?: ReadingSessionRow[] };
    return Array.isArray(data.sessions) ? data.sessions : [];
  } catch {
    return [];
  }
}

export interface AuditLogInput {
  action: string;
  resource_id?: string | null;
  audit_metadata?: Record<string, unknown>;
}

/**
 * Record a consent/privacy audit entry via the secure same-origin route.
 *
 * The actor is forced server-side (verified uid if signed in, else a
 * server-minted anon id) — we deliberately do NOT send a user_id. Fire-and-
 * forget friendly: returns {ok:false} instead of throwing so callers can keep
 * their existing non-blocking try/catch.
 */
export async function logAuditEvent(
  entry: AuditLogInput,
): Promise<{ ok: boolean; id?: string | number }> {
  const headers = await authHeader();
  try {
    const res = await fetch('/api/audit/log', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({
        action: entry.action,
        resource_id: entry.resource_id ?? null,
        audit_metadata: entry.audit_metadata ?? {},
      }),
      cache: 'no-store',
    });
    if (!res.ok) return { ok: false };
    return (await res.json()) as { ok: boolean; id?: string | number };
  } catch {
    return { ok: false };
  }
}
