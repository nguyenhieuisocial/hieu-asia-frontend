import { NextResponse } from 'next/server';

/**
 * API catalog (RFC 9727 — /.well-known/api-catalog).
 *
 * Served as `application/linkset+json` (RFC 9264 linkset format). Points agents
 * and registries at the public MCP server and the human/agent docs for it.
 *
 * Every href below resolves to a REAL, EXISTING public resource:
 *   - anchor       https://api.hieu.asia/mcp                                  (the MCP server)
 *   - service-desc https://hieu.asia/.well-known/mcp/server-card.json         (the SEP-1649 card)
 *   - service-doc  https://hieu.asia/.well-known/agent-skills/index.json      (the Agent Skills index)
 *   - status       https://status.hieu.asia/                                  (the Better Stack status page)
 *
 * No endpoints are invented here.
 */
export const dynamic = 'force-static';

const LINKSET = {
  linkset: [
    {
      anchor: 'https://api.hieu.asia/mcp',
      'service-desc': [
        {
          href: 'https://hieu.asia/.well-known/mcp/server-card.json',
          type: 'application/json',
        },
      ],
      'service-doc': [
        {
          href: 'https://hieu.asia/.well-known/agent-skills/index.json',
          type: 'application/json',
        },
      ],
      status: [
        {
          href: 'https://status.hieu.asia/',
          type: 'text/html',
        },
      ],
    },
  ],
};

export function GET() {
  return NextResponse.json(LINKSET, {
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
