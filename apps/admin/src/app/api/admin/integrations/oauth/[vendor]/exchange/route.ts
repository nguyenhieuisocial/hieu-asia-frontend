/**
 * POST /api/admin/integrations/oauth/[vendor]/exchange → worker /oauth/:vendor/exchange.
 * Bind AI-provider OAuth credentials (privileged mutation) → admin+. Vendor is
 * validated before interpolation so an unknown vendor can't forge a path.
 */
import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';
import { proxyToGateway } from '@/lib/proxy-gateway';

const OAUTH_VENDORS = new Set(['anthropic', 'openai', 'google']);

export async function POST(
  req: Request,
  ctx: { params: Promise<{ vendor: string }> },
) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  const { vendor } = await ctx.params;
  if (!OAUTH_VENDORS.has(vendor)) {
    return NextResponse.json({ ok: false, error: 'unknown vendor' }, { status: 400 });
  }
  return proxyToGateway(req, { path: `oauth/${vendor}/exchange`, adminEmail: auth.session.email });
}
