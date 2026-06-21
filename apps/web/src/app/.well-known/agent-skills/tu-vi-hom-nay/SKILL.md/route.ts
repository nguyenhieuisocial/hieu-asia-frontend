import { NextResponse } from 'next/server';
import { AGENT_SKILLS } from '../../skills-data';

/**
 * SKILL.md for the "Tử Vi 12 con giáp hôm nay" public free tool.
 * Returns the shared `body` VERBATIM so its sha256 matches the index digest.
 */
export const dynamic = 'force-static';

const SKILL = AGENT_SKILLS.find((s) => s.slug === 'tu-vi-hom-nay')!;

export function GET() {
  return new NextResponse(SKILL.body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
