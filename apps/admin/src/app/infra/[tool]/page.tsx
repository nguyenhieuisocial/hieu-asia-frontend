import { notFound } from 'next/navigation';

/**
 * Hạ tầng → catch-all for unknown `/infra/<slug>` routes.
 *
 * Every tool in `INFRA_TOOLS` has its own static `/infra/<slug>/page.tsx`, and a
 * static segment always wins over this dynamic `[tool]` route — so this catch-all
 * only ever runs for slugs that aren't in the catalog, which all 404.
 */
export default function InfraToolCatchAll() {
  notFound();
}
