#!/usr/bin/env tsx
/**
 * Regenerate Supabase TypeScript types for the hieu.asia project.
 *
 * Wired to `pnpm types:gen` at the repo root. Outputs to
 * `packages/types/src/database.types.ts`, consumed by `@hieu-asia/supabase`
 * via `createClient<Database>(...)`.
 *
 * Re-run after every schema migration that lands in public or hieu_asia.
 */
import { execSync } from 'node:child_process';

const PROJECT_REF = 'fvftbqairezsybasqsek';
const OUT = 'packages/types/src/database.types.ts';

console.log(`Regenerating Supabase types for ${PROJECT_REF}...`);
execSync(
  `supabase gen types typescript --project-id ${PROJECT_REF} --schema public,hieu_asia > ${OUT}`,
  { stdio: 'inherit' },
);
console.log(`Wrote ${OUT}`);
