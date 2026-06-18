/**
 * Clamp a feature-flag rollout percentage entered in the admin UI to an integer
 * in [0, 100]. Mirrors the Worker-side clamp so the optimistic value matches
 * what the server will persist. Non-finite input falls back to 0.
 */
export function clampRolloutPct(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  return Math.min(Math.max(Math.round(raw), 0), 100);
}
