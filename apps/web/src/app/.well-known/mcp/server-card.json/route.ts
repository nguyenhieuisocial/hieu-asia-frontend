import { NextResponse } from 'next/server';

/**
 * MCP Server Card (SEP-1649 well-known discovery).
 *
 * Served at /.well-known/mcp/server-card.json so AI agents and registries can
 * discover the public, read-only MCP server for hieu.asia's free Vietnamese
 * astrology tools without prior configuration.
 *
 * The card advertises the streamable-http transport endpoint on the API worker
 * (api.hieu.asia/mcp). `capabilities.tools` is an empty object: the concrete
 * tool list is negotiated at runtime via the MCP `tools/list` call against the
 * endpoint, per the MCP spec — the card only declares that the tools capability
 * is supported.
 *
 * SAFETY: this describes a PUBLIC, read-only surface (the free tools). No auth,
 * payment, admin, or PII-write capability is advertised.
 */
export const dynamic = 'force-static';

const SERVER_CARD = {
  serverInfo: {
    name: 'hieu.asia',
    version: '1.0.0',
  },
  transport: {
    type: 'streamable-http',
    endpoint: 'https://api.hieu.asia/mcp',
  },
  capabilities: {
    tools: {},
  },
  description:
    'Public read-only MCP server for hieu.asia free Vietnamese astrology tools (Tử Vi, Bát Tự, xem ngày).',
};

export function GET() {
  return NextResponse.json(SERVER_CARD, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
