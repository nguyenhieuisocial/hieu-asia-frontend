import { NextResponse } from 'next/server';
import { AGENT_SKILLS } from '../../skills-data';

/**
 * SKILL.md for the "Xem ngày tốt theo mục đích" public free tool.
 * Returns the shared `body` VERBATIM so its sha256 matches the index digest.
 */
export const dynamic = 'force-static';

const SKILL = AGENT_SKILLS.find((s) => s.slug === 'xem-ngay')!;

export function GET() {
  return new NextResponse(SKILL.body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
