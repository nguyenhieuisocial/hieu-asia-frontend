/**
 * Type-safe client for hieu.asia backend (FastAPI).
 *
 * Endpoint surface mirrored from `backend/api/server.py`.
 * Base URL from `NEXT_PUBLIC_API_URL` (default http://localhost:8000).
 */

import type {
  ChatRequest,
  ChatResponse,
  CreateReadingResponse,
  InitialReadingRequest,
  PresignedUploadRequest,
  PresignedUploadResponse,
  RagSearchRequest,
  RagSearchResponse,
  ReadingStatusResponse,
} from '@hieu-asia/types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public detail: unknown,
    public url: string,
  ) {
    super(`[${status}] ${statusText} (${url})`);
    this.name = 'ApiError';
  }
}

export interface ApiClientConfig {
  baseUrl?: string;
  /** Optional bearer token producer. Called per-request. */
  getAuthToken?: () => string | null | Promise<string | null>;
  fetchImpl?: typeof fetch;
}

function resolveBaseUrl(explicit?: string): string {
  if (explicit) return explicit.replace(/\/$/, '');
  const envUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
    undefined;
  return (envUrl ?? 'http://localhost:8000').replace(/\/$/, '');
}

export function createApiClient(config: ApiClientConfig = {}) {
  const baseUrl = resolveBaseUrl(config.baseUrl);
  const fetchImpl = config.fetchImpl ?? fetch;

  async function request<T>(
    path: string,
    init: RequestInit & { json?: unknown } = {},
  ): Promise<T> {
    const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = new Headers(init.headers);
    if (init.json !== undefined && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    if (config.getAuthToken) {
      const token = await config.getAuthToken();
      if (token) headers.set('authorization', `Bearer ${token}`);
    }

    const res = await fetchImpl(url, {
      ...init,
      headers,
      body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
    });

    if (!res.ok) {
      let detail: unknown = null;
      try {
        detail = await res.json();
      } catch {
        try {
          detail = await res.text();
        } catch {
          /* ignore */
        }
      }
      throw new ApiError(res.status, res.statusText, detail, url);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  return {
    baseUrl,

    health(): Promise<{ status: string; mock_llm: string; use_celery: string; storage_backend: string }> {
      return request('/health');
    },

    // ---------- Uploads ----------
    getPresignedUpload(payload: PresignedUploadRequest): Promise<PresignedUploadResponse> {
      return request<PresignedUploadResponse>('/v1/uploads/hand-image-url', {
        method: 'POST',
        json: payload,
      });
    },

    // ---------- Reading lifecycle ----------
    createReading(payload: InitialReadingRequest): Promise<CreateReadingResponse> {
      return request<CreateReadingResponse>('/v1/readings', {
        method: 'POST',
        json: payload,
      });
    },

    getReading(taskId: string): Promise<ReadingStatusResponse> {
      return request<ReadingStatusResponse>(`/v1/readings/${encodeURIComponent(taskId)}`);
    },

    // ---------- Mentor chat ----------
    chatMentor(sessionId: string, message: string): Promise<ChatResponse> {
      const body: ChatRequest = { message };
      return request<ChatResponse>(`/v1/sessions/${encodeURIComponent(sessionId)}/chat`, {
        method: 'POST',
        json: body,
      });
    },

    deleteSession(sessionId: string): Promise<{ deleted: boolean; session_id: string }> {
      return request(`/v1/sessions/${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
      });
    },

    // ---------- RAG ----------
    searchRag(payload: RagSearchRequest): Promise<RagSearchResponse> {
      return request<RagSearchResponse>('/v1/rag/search', {
        method: 'POST',
        json: payload,
      });
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

/** Convenience default instance (env-configured). Apps may also call `createApiClient()` directly. */
export const api: ApiClient = createApiClient();
