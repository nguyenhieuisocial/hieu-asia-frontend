/**
 * Pure JSON-detect + value-formatting helpers for the /infra/kv value pane,
 * kept in a plain `.ts` module (no React) so they're importable in the node
 * vitest environment. The JsonTree component re-exports `tryParseJson` for
 * rendering decisions.
 */

/**
 * Parse a string as JSON, but ONLY accept results worth rendering as a tree (an
 * object or array). Bare scalars ("42", '"hi"', "true") parse fine but a tree
 * adds nothing over the raw string, so they return `{ ok: false }` and the
 * caller shows the flat view.
 */
export function tryParseJson(
  raw: string,
): { ok: true; value: unknown } | { ok: false } {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return { ok: false };
  try {
    const value = JSON.parse(trimmed);
    if (value !== null && typeof value === 'object') return { ok: true, value };
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

/**
 * Format a UTF-8 byte count as a human string: "812 B", "1.6 KB", "2.3 MB".
 * Used for the value pane's "Kích thước: …" line.
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}
