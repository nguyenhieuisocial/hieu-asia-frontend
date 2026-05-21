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

async function json<T>(path: string, init: RequestInit = {}, timeoutMs = 30_000): Promise<T> {
  // Bumped 10s → 30s: Vercel serverless cold-start can be 5-15s; worker
  // itself is <1s. Pass abort reason for clear UX ("signal is aborted
  // without reason" replaced by explicit timeout message).
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(new DOMException(`Request timed out after ${timeoutMs}ms`, 'TimeoutError')), timeoutMs);
  try {
    const res = await fetch(`${PROXY}${path}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      ...init,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    });
    // 401 unauthenticated → admin-proxy rejected the session. Bounce to login
    // so user re-auths rather than staring at "Không kết nối được backend".
    if (res.status === 401 && typeof window !== 'undefined') {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
      throw new Error('Phiên đăng nhập đã hết hạn — đang chuyển hướng đến /login…');
    }
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string } & T;
    if (!res.ok || data.ok === false) {
      throw new Error(data.error ?? `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    // Re-throw with a UX-friendly message for the timeout case.
    if ((err as Error).name === 'TimeoutError' || (err as Error).name === 'AbortError') {
      throw new Error(`Backend không phản hồi trong ${timeoutMs / 1000}s. Thử lại sau vài giây.`);
    }
    throw err;
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
