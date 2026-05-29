/**
 * Keystore API surface — Wave 63.10 rewire (was Wave 60.81.A.v2 mock).
 *
 * Previously returned deterministic MOCK "vendor secret" rows with
 * reveal/rotate/delete. That vision — serving plaintext vendor credentials and
 * mutating them from a web UI — is unsafe and was never backed by a real
 * endpoint. This now reads the REAL, already-deployed admin key registry:
 *
 *   GET /admin/api-keys  →  hieu_asia.admin_api_keys
 *
 * Those are admin-issued API keys stored as a SHA-256 hash + last-4 prefix; the
 * plaintext is shown exactly ONCE at creation and never persisted. So the page
 * is now READ-ONLY by design:
 *   - no reveal — the key is hashed, unrecoverable;
 *   - no rotate/delete here — revoking a credential is a security action,
 *     handled via /connect or the backend (avoids accidental lock-outs).
 */

export type VaultStatus = 'active' | 'expiring' | 'expired';

export interface VaultEntry {
  id: string;
  /** Public human-readable key name. */
  key_name: string;
  /** `••••` + last-4 prefix. Never the secret — the prefix is public metadata. */
  masked_preview: string;
  /** Who created the key. */
  created_by: string | null;
  /** Scopes granted to the key. */
  scopes: string[];
  /** ISO created timestamp. */
  created_at: string | null;
  /** True once revoked. */
  revoked: boolean;
  /** active = live · expired = revoked (mapped for StatusBadge compat). */
  status: VaultStatus;
}

export interface DataSource {
  isMock: boolean;
  reason?: string;
}

// Kept for component compat (VendorCell imports vendorLabel). Admin-issued keys
// are not vendor-scoped, so the page no longer renders a vendor column, but the
// helper stays exported so the shared component still type-checks.
const VENDORS: Array<{ slug: string; label: string }> = [
  { slug: 'openai', label: 'OpenAI' },
  { slug: 'anthropic', label: 'Anthropic' },
  { slug: 'supabase', label: 'Supabase' },
  { slug: 'cloudflare', label: 'Cloudflare' },
  { slug: 'admin', label: 'Admin' },
];

export function vendorLabel(slug: string): string {
  return VENDORS.find((v) => v.slug === slug)?.label ?? slug;
}

interface ApiKeyRow {
  id: string;
  name?: string | null;
  key_prefix?: string | null;
  scopes?: string[] | null;
  created_by?: string | null;
  created_at?: string | null;
  revoked_at?: string | null;
}

interface ApiKeysResponse {
  ok: boolean;
  keys?: ApiKeyRow[];
  note?: string;
  error?: string;
}

function mapRow(k: ApiKeyRow): VaultEntry {
  const revoked = !!k.revoked_at;
  return {
    id: k.id,
    key_name: k.name ?? k.id,
    masked_preview: k.key_prefix ? `••••${k.key_prefix}` : '••••',
    created_by: k.created_by ?? null,
    scopes: Array.isArray(k.scopes) ? k.scopes : [],
    created_at: k.created_at ?? null,
    revoked,
    status: revoked ? 'expired' : 'active',
  };
}

/**
 * List admin API keys (real, read-only). Returns shape parallel to other
 * admin-api list helpers so KpiCard / MockBanner read `_source`. On a gateway
 * error the helper throws so React Query surfaces it via ErrorBlock.
 */
export async function listVaultEntries(): Promise<VaultEntry[] & { _source: DataSource }> {
  const r = await fetch('/api/admin-proxy/admin/api-keys', { cache: 'no-store' });
  let body: ApiKeysResponse | null = null;
  try {
    body = (await r.json()) as ApiKeysResponse;
  } catch {
    throw new Error(`Gateway trả về dữ liệu không hợp lệ (HTTP ${r.status}).`);
  }
  if (!r.ok || !body?.ok) {
    throw new Error(body?.error ?? `Không tải được danh sách key (HTTP ${r.status}).`);
  }
  const rows = (body.keys ?? []).map(mapRow);
  return Object.assign(rows, {
    _source: { isMock: false } as DataSource,
  });
}
