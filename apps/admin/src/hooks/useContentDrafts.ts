'use client';

/**
 * Wave 60.98 — React Query hooks for the multi-LLM content engine.
 *
 * Backend endpoints (Worker, admin-token gated, proxied via /api/admin-proxy):
 *   GET   /admin/content/list
 *   GET   /admin/content/:id
 *   PATCH /admin/content/:id
 *   POST  /admin/content/generate
 *   POST  /admin/content/bulk-generate-pillars
 *
 * The proxy at `/api/admin-proxy/[...path]/route.ts` adds X-Admin-Token
 * server-side — never expose the token to the browser.
 *
 * Pattern matches useAdminDashboard.ts: 3 retries with exponential backoff,
 * 5-min stale time (founder rarely refreshes content list).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type ContentType = 'newsletter' | 'pillar';
export type ContentStatus = 'draft' | 'in_review' | 'published' | 'archived';
export type DraftKey = 'claude' | 'openai' | 'google';

export interface ContentDraftListRow {
  id: string;
  type: ContentType;
  topic: string;
  slug: string | null;
  judge_pick: DraftKey;
  judge_reasoning: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentDraftFull extends ContentDraftListRow {
  drafts: Partial<Record<DraftKey, string>>;
  judge_scores: Partial<Record<DraftKey, Record<string, number>>> | null;
  edited_content: string | null;
}

export interface ListResponse {
  ok: boolean;
  drafts?: ContentDraftListRow[];
  total?: number;
  limit?: number;
  offset?: number;
  note?: string;
  error?: string;
}

export interface DetailResponse {
  ok: boolean;
  draft?: ContentDraftFull;
  error?: string;
}

export interface GenerateInput {
  type: ContentType;
  topic: string;
  slug?: string;
}

export interface GenerateResponse {
  ok: boolean;
  id?: string;
  drafts?: Partial<Record<DraftKey, string>>;
  judge_pick?: DraftKey;
  judge_reasoning?: string;
  generation_errors?: Partial<Record<DraftKey, string>>;
  error?: string;
}

export interface PatchInput {
  edited_content?: string;
  status?: ContentStatus;
}

export interface PatchResponse {
  ok: boolean;
  draft?: ContentDraftFull;
  publish_result?: { ok: boolean; channel: string; externalId?: string; error?: string } | null;
  error?: string;
}

export interface BulkResponse {
  ok: boolean;
  queued?: number;
  slugs?: string[];
  note?: string;
  error?: string;
}

const BASE = '/api/admin-proxy/admin/content';
const STALE_MS = 5 * 60 * 1000; // 5 minutes — content rarely flips state mid-session.

async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { cache: 'no-store', ...init });
  const text = await r.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return { ok: false, error: `Phản hồi không hợp lệ (HTTP ${r.status})` } as unknown as T;
  }
}

// ---------------------------------------------------------------------------
// List hook — filters: type, status
// ---------------------------------------------------------------------------

export interface ListFilter {
  type?: ContentType;
  status?: ContentStatus;
  limit?: number;
  offset?: number;
}

export function useContentDrafts(filter: ListFilter = {}) {
  const params = new URLSearchParams();
  if (filter.type) params.set('type', filter.type);
  if (filter.status) params.set('status', filter.status);
  if (filter.limit) params.set('limit', String(filter.limit));
  if (filter.offset) params.set('offset', String(filter.offset));
  const qs = params.toString();
  const url = `${BASE}/list${qs ? `?${qs}` : ''}`;

  return useQuery({
    queryKey: ['admin', 'content', 'list', filter],
    queryFn: () => getJSON<ListResponse>(url),
    staleTime: STALE_MS,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  });
}

// ---------------------------------------------------------------------------
// Detail hook
// ---------------------------------------------------------------------------

export function useContentDraft(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'content', 'detail', id],
    queryFn: () => getJSON<DetailResponse>(`${BASE}/${id}`),
    enabled: Boolean(id),
    staleTime: STALE_MS,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useGenerateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: GenerateInput) => {
      return getJSON<GenerateResponse>(`${BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'content', 'list'] });
    },
  });
}

export function usePatchContent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PatchInput) => {
      return getJSON<PatchResponse>(`${BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'content', 'list'] });
      qc.invalidateQueries({ queryKey: ['admin', 'content', 'detail', id] });
    },
  });
}

export function useBulkGeneratePillars() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return getJSON<BulkResponse>(`${BASE}/bulk-generate-pillars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'content', 'list'] });
    },
  });
}
