'use client';

/**
 * useAdminRole — current admin's role, read from GET /api/admin/me (the same
 * HMAC-cookie-derived profile ProfileTab uses). Used to hide/disable owner-only
 * UI (e.g. the Supabase row browser drawer). This is a UX gate only — the real
 * authorization is the owner-rank check in the admin-proxy + the backend. Never
 * rely on this for security; it just avoids showing a control that would 403.
 */

import { useQuery } from '@tanstack/react-query';

export type AdminRole = 'owner' | 'admin' | 'viewer';

async function fetchRole(): Promise<AdminRole | null> {
  try {
    const r = await fetch('/api/admin/me', { cache: 'no-store' });
    if (!r.ok) return null;
    const data = (await r.json()) as { profile?: { role?: AdminRole } };
    return data.profile?.role ?? null;
  } catch {
    return null;
  }
}

export function useAdminRole(): { role: AdminRole | null; isOwner: boolean; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'me', 'role'],
    queryFn: fetchRole,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
  return { role: data ?? null, isOwner: data === 'owner', isLoading };
}
