import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { AGENT_SKILLS, skillMdUrl } from '../skills-data';

/**
 * Agent Skills Discovery index (RFC v0.2.0).
 *
 * Served at /.well-known/agent-skills/index.json. Lists each PUBLIC, read-only
 * free tool as a skill pointing at its SKILL.md, with the HEX sha256 of that
 * SKILL.md's exact served bytes.
 *
 * The sha256 is computed at request time over the SAME `body` string each
 * SKILL.md route returns verbatim, so the digest always matches the served
 * bytes. node:crypto requires the Node.js runtime.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-static';

function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export function GET() {
  const index = {
    $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
    skills: AGENT_SKILLS.map((s) => ({
      name: s.name,
      type: 'skill' as const,
      description: s.description,
      url: skillMdUrl(s.slug),
      sha256: sha256Hex(s.body),
    })),
  };

  return NextResponse.json(index, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
