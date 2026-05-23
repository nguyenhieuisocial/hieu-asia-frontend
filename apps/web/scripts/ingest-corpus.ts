/**
 * Wave 56 Phase 2.1 — RAG ingest script.
 *
 * Reads .md / .txt files from a corpus directory, chunks each into
 * ~500-token blocks with 50-token overlap, embeds via Vercel AI Gateway,
 * and upserts into Supabase `reading_corpus` table.
 *
 * Usage:
 *   pnpm -F web tsx scripts/ingest-corpus.ts <dir> --source <slug> [--tags a,b,c]
 *
 * Example:
 *   pnpm -F web tsx scripts/ingest-corpus.ts \
 *     ../../corpus/tu-vi-dau-so-toan-thu \
 *     --source tu-vi-dau-so-toan-thu \
 *     --tags tu-vi,classic
 *
 * Cost estimate:
 *   - openai/text-embedding-3-small = $0.02 / M tokens
 *   - 1 average book ≈ 80k tokens → 160 chunks @ 500 tokens
 *   - Embedding cost ≈ $0.0016 per book (negligible)
 *
 * Idempotency: re-running on the same corpus DELETEs the source's prior rows
 * first then re-ingests. Source slug = primary identity. Safe to re-run after
 * editing source files.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { embedChunk, RAG_CONFIG } from '../src/lib/reasoning/rag';

interface CliArgs {
  dir: string;
  source: string;
  tags: string[];
  chapter?: string;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2);
  const dir = args[0];
  if (!dir || dir.startsWith('--')) {
    throw new Error('Usage: ingest-corpus <dir> --source <slug> [--tags a,b] [--chapter X] [--dry-run]');
  }
  let source: string | undefined;
  let tags: string[] = [];
  let chapter: string | undefined;
  let dryRun = false;
  for (let i = 1; i < args.length; i++) {
    const a = args[i];
    if (a === '--source') source = args[++i];
    else if (a === '--tags') tags = args[++i].split(',').map((t) => t.trim()).filter(Boolean);
    else if (a === '--chapter') chapter = args[++i];
    else if (a === '--dry-run') dryRun = true;
  }
  if (!source) throw new Error('--source <slug> required');
  return { dir, source, tags, chapter, dryRun };
}

/**
 * Token-aware chunker. We use a rough heuristic of 4 chars/token (English/
 * Vietnamese mix). Splits on paragraph boundaries first, then sentence,
 * then hard-wrap. Preserves overlap by carrying the last N tokens forward.
 *
 * Output: each chunk targets ~500 tokens (~2000 chars) with ~50 tokens
 * (~200 chars) overlap with the previous chunk.
 */
const TARGET_CHARS = 2000;
const OVERLAP_CHARS = 200;
const MIN_CHARS = 100;

function chunkText(text: string): string[] {
  const clean = text.replace(/\r\n/g, '\n').trim();
  if (clean.length <= TARGET_CHARS) {
    return clean.length >= MIN_CHARS ? [clean] : [];
  }
  const chunks: string[] = [];
  let cursor = 0;
  while (cursor < clean.length) {
    let end = Math.min(cursor + TARGET_CHARS, clean.length);
    if (end < clean.length) {
      // Prefer a paragraph boundary, then sentence, then space
      const slice = clean.slice(cursor, end + 200);
      const paragraphBreak = slice.lastIndexOf('\n\n');
      const sentenceBreak = slice.lastIndexOf('. ');
      const wordBreak = slice.lastIndexOf(' ');
      if (paragraphBreak > TARGET_CHARS - 400) {
        end = cursor + paragraphBreak;
      } else if (sentenceBreak > TARGET_CHARS - 200) {
        end = cursor + sentenceBreak + 1;
      } else if (wordBreak > TARGET_CHARS - 100) {
        end = cursor + wordBreak;
      }
    }
    const chunk = clean.slice(cursor, end).trim();
    if (chunk.length >= MIN_CHARS) chunks.push(chunk);
    // Advance with overlap
    cursor = end - OVERLAP_CHARS;
    if (cursor < 0) cursor = 0;
    if (end >= clean.length) break;
  }
  return chunks;
}

function walkCorpusDir(dir: string): { path: string; chapter: string | null }[] {
  const out: { path: string; chapter: string | null }[] = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // Subdirectory name becomes default chapter prefix for files inside
      const chapter = entry;
      for (const sub of readdirSync(full)) {
        const subFull = join(full, sub);
        if (statSync(subFull).isFile() && ['.md', '.txt'].includes(extname(sub))) {
          out.push({ path: subFull, chapter });
        }
      }
    } else if (['.md', '.txt'].includes(extname(entry))) {
      out.push({ path: full, chapter: basename(entry, extname(entry)) });
    }
  }
  return out;
}

async function main() {
  const { dir, source, tags, chapter: cliChapter, dryRun } = parseArgs(process.argv);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY required');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const files = walkCorpusDir(dir);
  if (files.length === 0) {
    console.error(`No .md or .txt files in ${dir}`);
    process.exit(1);
  }

  console.log(`Source: ${source}`);
  console.log(`Tags: ${JSON.stringify(tags)}`);
  console.log(`Files: ${files.length}`);
  console.log(`Embedding model: ${RAG_CONFIG.model} (${RAG_CONFIG.dim}-dim)`);
  console.log(`Dry-run: ${dryRun}`);
  console.log('');

  if (!dryRun) {
    // Idempotency: clear prior rows for this source before re-ingest
    const { error: delErr } = await supabase
      .from('reading_corpus')
      .delete()
      .eq('source', source);
    if (delErr) {
      console.error(`Failed to delete prior rows for source ${source}: ${delErr.message}`);
      process.exit(1);
    }
    console.log(`Cleared prior rows for source=${source}`);
  }

  let totalChunks = 0;
  let totalTokensEstimate = 0;
  let totalCharsEstimate = 0;

  for (const { path, chapter: fileChapter } of files) {
    const raw = readFileSync(path, 'utf-8');
    const chapter = cliChapter ?? fileChapter;
    const chunks = chunkText(raw);
    console.log(`  ${basename(path)} → ${chunks.length} chunks (chapter=${chapter})`);

    if (dryRun) {
      totalChunks += chunks.length;
      totalCharsEstimate += chunks.reduce((s, c) => s + c.length, 0);
      continue;
    }

    // Embed + upsert one chunk at a time. Could batch via Gateway but
    // simplicity > marginal speed gain at <10k total chunks.
    for (const chunk of chunks) {
      const tokenEst = Math.ceil(chunk.length / 4);
      const embedding = await embedChunk(chunk);
      const { error: insErr } = await supabase.from('reading_corpus').insert({
        source,
        chapter,
        content: chunk,
        embedding,
        tags,
        token_count: tokenEst,
      });
      if (insErr) {
        console.error(`Insert failed for ${basename(path)} chunk: ${insErr.message}`);
        process.exit(1);
      }
      totalChunks++;
      totalTokensEstimate += tokenEst;
    }
  }

  const costUsd = (totalTokensEstimate / 1_000_000) * 0.02;
  console.log('');
  console.log(`Total chunks ingested: ${totalChunks}`);
  console.log(`Total tokens estimated: ${totalTokensEstimate.toLocaleString()}`);
  console.log(`Estimated embedding cost: $${costUsd.toFixed(4)}`);
  if (dryRun) {
    console.log(`(dry-run — no rows written, no embeddings called)`);
    console.log(`Estimated chars: ${totalCharsEstimate.toLocaleString()}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
