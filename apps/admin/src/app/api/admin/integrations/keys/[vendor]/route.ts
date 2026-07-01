/**
 * Provider API keys (Anthropic/OpenAI/Google) — PRODUCTION secrets → owner only
 * (mirrors /admin/secrets). Worker is role-blind, so per-user role is enforced
 * here. POST → set, DELETE → remove. Worker path /ai/keys/:vendor.
 */
import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

type Ctx = { params: Promise<{ vendor: string }> };

async function handle(req: Request, ctx: Ctx) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  const { vendor } = await ctx.params;
  if (!['anthropic', 'openai', 'google'].includes(vendor)) {
    return NextResponse.json({ ok: false, error: 'unknown vendor' }, { status: 400 });
  }
  return proxyToGateway(req, { path: `ai/keys/${vendor}`, adminEmail: auth.session.email });
}

export const POST = (req: Request, ctx: Ctx) => handle(req, ctx);
export const DELETE = (req: Request, ctx: Ctx) => handle(req, ctx);
