/**
 * Keystore API surface — Wave 60.81.A.v2 (vault 107 §5.6).
 *
 * Vendor key + token + credential CRUD for /admin/keystore. Implemented
 * fresh (not reusing the old subtree) because the legacy lib path is
 * blocked by the current sandbox immutable rule. The eventual backend
 * endpoint is `/admin/keystore/*` (proxied via `/api/admin-proxy`); until
 * the worker ships them, this module returns deterministic mock rows so
 * the page renders end-to-end. Compliance flow (reveal writes audit_log)
 * is preserved on the call signature so wiring the real fetch is a
 * one-line swap inside each helper.
 *
 * Helper compat: keep return shapes parallel to other admin-api list
 * helpers so KpiCard / MockBanner can read `_source.isMock`.
 */

export type VaultStatus = 'active' | 'expiring' | 'expired';

export interface VaultEntry {
  id: string;
  /** Vendor slug, lowercase. Maps to icon + label. */
  vendor: string;
  /** Public human-readable key name (env-var style). */
  key_name: string;
  /** Masked preview; the real token is fetched on-demand via reveal. */
  masked_preview: string;
  /** ISO timestamp of last rotation. */
  last_rotated_at: string;
  /** ISO timestamp when this credential becomes invalid (or null if non-expiring). */
  expires_at: string | null;
  status: VaultStatus;
}

export interface DataSource {
  isMock: boolean;
  reason?: string;
}

const VENDORS: Array<{ slug: string; label: string }> = [
  { slug: 'openai', label: 'OpenAI' },
  { slug: 'anthropic', label: 'Anthropic' },
  { slug: 'supabase', label: 'Supabase' },
  { slug: 'stripe', label: 'Stripe' },
  { slug: 'sepay', label: 'SePay' },
  { slug: 'telegram', label: 'Telegram' },
  { slug: 'cloudflare', label: 'Cloudflare' },
  { slug: 'posthog', label: 'PostHog' },
  { slug: 'sentry', label: 'Sentry' },
];

export function vendorLabel(slug: string): string {
  return VENDORS.find((v) => v.slug === slug)?.label ?? slug;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isoDaysAhead(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function classify(expiresAt: string | null): VaultStatus {
  if (!expiresAt) return 'active';
  const ms = new Date(expiresAt).getTime() - Date.now();
  const days = ms / (1000 * 60 * 60 * 24);
  if (days < 0) return 'expired';
  if (days < 30) return 'expiring';
  return 'active';
}

// Mock rows — deterministic so visual regression baselines stay stable.
const MOCK_VAULT_ROWS: VaultEntry[] = VENDORS.flatMap((v, i): VaultEntry[] => {
  const base: Array<Omit<VaultEntry, 'status'>> = [
    {
      id: `vault_${v.slug}_prod`,
      vendor: v.slug,
      key_name: `API_KEY_${v.slug.toUpperCase()}_PROD`,
      masked_preview: `sk-${v.slug.slice(0, 3)}_prod_***`,
      last_rotated_at: isoDaysAgo(((i * 13) % 90) + 1),
      expires_at: i % 3 === 0 ? isoDaysAhead(((i * 7) % 14) + 1) : isoDaysAhead(180),
    },
    {
      id: `vault_${v.slug}_dev`,
      vendor: v.slug,
      key_name: `API_KEY_${v.slug.toUpperCase()}_DEV`,
      masked_preview: `sk-${v.slug.slice(0, 3)}_dev_***`,
      last_rotated_at: isoDaysAgo(((i * 17) % 120) + 1),
      expires_at: null,
    },
  ];
  return base.map((row) => ({ ...row, status: classify(row.expires_at) }));
});

const MOCK_LATENCY_MS = 40;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

/** List all vault entries. Returns shape parallel to other admin-api list helpers. */
export async function listVaultEntries(): Promise<VaultEntry[] & { _source: DataSource }> {
  const rows = [...MOCK_VAULT_ROWS];
  return delay(
    Object.assign(rows, {
      _source: { isMock: true, reason: '/admin/keystore not shipped' } as DataSource,
    }),
  );
}

/** Reveal a single entry's plaintext token. Backend writes audit_log on hit. */
export async function revealVaultEntry(
  id: string,
): Promise<{ id: string; token: string; isMock: boolean }> {
  // Backend (when shipped) writes `audit_log` row with
  //   action='keystore.reveal', actor=session.user, ip=request.ip
  // before returning the plaintext token. Mock returns a deterministic
  // pseudo-token so QA flows can verify copy + auto-hide.
  return delay({ id, token: `mock_revealed_${id}_*****`, isMock: true });
}

/** Trigger a rotation (backend regenerates + stores + invalidates old). */
export async function rotateVaultEntry(
  id: string,
): Promise<{ id: string; new_masked: string; isMock: boolean }> {
  return delay({ id, new_masked: `sk-rot_${id.slice(-4)}_***`, isMock: true });
}

/** Soft-delete a vault entry. Returns confirmation only. */
export async function deleteVaultEntry(
  id: string,
): Promise<{ id: string; deleted: true; isMock: boolean }> {
  return delay({ id, deleted: true, isMock: true });
}
