/**
 * Typed wrappers for the worker's `/admin/secrets/*` routes.
 * All calls go through the existing admin proxy → no token exposure in browser.
 */

const PROXY = '/api/admin-proxy';

export type SecretTarget = 'worker' | 'vercel';
export type VercelProject = 'web' | 'admin' | 'miniapp';
export type VercelTarget = 'production' | 'preview' | 'development';

export interface SecretAuditRecord {
  name: string;
  target: SecretTarget;
  project?: string;
  vercel_target?: string;
  set_at: string;
  by_admin: string;
  action: 'set' | 'delete';
}

export interface BootstrapStatus {
  cf_token_set: boolean;
  vercel_token_set: boolean;
  cli_hints: { cf: string; vercel: string };
}

export interface SecretsListResponse {
  ok: boolean;
  entries: SecretAuditRecord[];
  bootstrap: BootstrapStatus;
}

async function json<T>(path: string, init: RequestInit = {}, timeoutMs = 10_000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${PROXY}${path}`, {
      cache: 'no-store',
      ...init,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string } & T;
    if (!res.ok || data.ok === false) {
      throw new Error(data.error ?? `HTTP ${res.status}`);
    }
    return data;
  } finally {
    clearTimeout(t);
  }
}

export function fetchSecretsList(): Promise<SecretsListResponse> {
  return json<SecretsListResponse>('/admin/secrets/list');
}

export function fetchBootstrapStatus(): Promise<{ ok: boolean } & BootstrapStatus> {
  return json<{ ok: boolean } & BootstrapStatus>('/admin/secrets/bootstrap-status');
}

export interface SetWorkerSecretResult {
  ok: boolean;
  name: string;
  target: 'worker';
  set_at: string;
  by_admin: string;
}

export function setWorkerSecret(name: string, value: string): Promise<SetWorkerSecretResult> {
  return json<SetWorkerSecretResult>('/admin/secrets/worker', {
    method: 'POST',
    body: JSON.stringify({ name, value }),
  });
}

export function deleteWorkerSecret(name: string): Promise<{ ok: boolean; name: string; deleted: boolean }> {
  return json(`/admin/secrets/worker/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

export interface SetVercelEnvResult {
  ok: boolean;
  name: string;
  target: 'vercel';
  project: VercelProject;
  vercel_target: VercelTarget;
  set_at: string;
  by_admin: string;
}

export function setVercelEnv(args: {
  name: string;
  value: string;
  project: VercelProject;
  target: VercelTarget;
}): Promise<SetVercelEnvResult> {
  return json<SetVercelEnvResult>('/admin/secrets/vercel', {
    method: 'POST',
    body: JSON.stringify(args),
  });
}
