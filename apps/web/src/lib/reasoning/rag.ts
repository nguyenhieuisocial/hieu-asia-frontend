/**
 * Wave 56 Phase 2.1 — RAG retrieval helper.
 *
 * Embeds a query string via Vercel AI Gateway (`openai/text-embedding-3-small`,
 * 1536-dim, ~$0.02/M tokens) and calls the `public.retrieve_context()` RPC
 * on Supabase Postgres (pgvector HNSW index, cosine distance).
 *
 * Used by LangGraph nodes (Phase 2.2+) to pull top-k corpus chunks per palace
 * or pillar before generating analysis. Stays out of the LLM hot path —
 * caller awaits this once per node and passes the result into prompt context.
 *
 * Failure mode: throws on Gateway embed error OR Supabase RPC error. Callers
 * must catch + degrade (analyze without RAG context rather than block).
 */

import { embed } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@hieu-asia/types/database.types';

const EMBEDDING_MODEL = 'openai/text-embedding-3-small';
const EMBEDDING_DIM = 1536;

// Reuse one Gateway client + one Supabase service-role client across requests.
// Both are stateless and safe to share. Service-role bypasses RLS on the
// reading_corpus table (anon has no SELECT grant — only the SECURITY DEFINER
// RPC `retrieve_context` is exposed).
const gateway = createGateway({
  headers: { 'http-referer': 'https://hieu.asia', 'x-title': 'hieu.asia' },
});

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('rag: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY required');
  }
  _supabase = createClient<Database>(url, key, { auth: { persistSession: false } });
  return _supabase;
}

export interface CorpusChunk {
  id: number;
  source: string;
  chapter: string | null;
  content: string;
  tags: string[];
  similarity: number;
}

export interface RetrieveContextOpts {
  /** Natural-language query — will be embedded then matched against corpus. */
  query: string;
  /** Number of chunks to return (server clamps to 1-20). Default 5. */
  k?: number;
  /** Optional tag filter — only chunks tagged with ANY of these are returned. */
  tags?: string[];
}

/**
 * Embed `query` then fetch top-k similar chunks from reading_corpus.
 * Returns chunks ordered by similarity descending (closest first).
 *
 * Cost per call: ~$0.00002 for embed (avg query 20 tokens × $0.02/M) +
 * Supabase free (no compute charge under Pro tier). HNSW index makes the
 * RPC <10ms at 100k chunks.
 */
export async function retrieveContext(opts: RetrieveContextOpts): Promise<CorpusChunk[]> {
  const query = opts.query.trim();
  if (!query) return [];

  // 1. Embed query via Gateway
  const { embedding } = await embed({
    model: gateway.textEmbeddingModel(EMBEDDING_MODEL),
    value: query,
  });
  if (embedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `rag: embedding dim mismatch (got ${embedding.length}, expected ${EMBEDDING_DIM})`,
    );
  }

  // 2. RPC call to Postgres — Wave 60.49.b: generated Database types now
  // include `retrieve_context`, so the cast that lived here pre-regen is gone.
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('retrieve_context', {
    query_embedding: embedding as unknown as string,
    match_count: opts.k ?? 5,
    filter_tags: opts.tags ?? undefined,
  });
  if (error) {
    throw new Error(`rag: retrieve_context RPC failed — ${error.message}`);
  }
  return (data ?? []) as CorpusChunk[];
}

/**
 * Embed a chunk for ingest. Returns the vector — caller upserts into Postgres.
 * Exposed as a separate export so the ingest script can batch embeddings
 * (the Gateway supports batched calls but `ai` SDK's `embed()` is per-call).
 */
export async function embedChunk(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: gateway.textEmbeddingModel(EMBEDDING_MODEL),
    value: text,
  });
  return embedding;
}

export const RAG_CONFIG = {
  model: EMBEDDING_MODEL,
  dim: EMBEDDING_DIM,
  defaultK: 5,
  maxK: 20,
} as const;
