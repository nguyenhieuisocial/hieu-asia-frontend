/**
 * Wave 58 Phase B — Email unsubscribe endpoint.
 *
 * GET /api/email/unsubscribe?token=<user_id>.<hmac-sha256-truncated-32>
 *
 * The dispatcher (`wave58-drip/route.ts`) signs a token per user with
 * UNSUBSCRIBE_HMAC_SECRET. Visiting the link sets
 * `hieu_asia.users.email_opted_out = true`, which the dispatcher's consent
 * gate respects on the next tick.
 *
 * Why GET (not POST):
 *   - Gmail/Apple Mail one-click unsubscribe issues a POST per RFC 8058,
 *     but inline footer links are GET. We accept GET here and let RFC-8058
 *     compliant clients fall back to GET silently. (If we want strict
 *     one-click later, add a POST handler that shares this logic.)
 *
 * Token format: `<user_id>.<sig>` where sig = first 32 hex chars of
 * HMAC-SHA256(user_id, UNSUBSCRIBE_HMAC_SECRET). 128-bit truncation is fine
 * for non-repudiation here — there's nothing valuable on the other side, just
 * a boolean flip.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('unsubscribe: SUPABASE env required');
  // `users` lives in hieu_asia schema (see migration 0012).
  return createClient(url, key, {
    auth: { persistSession: false },
    db: { schema: 'hieu_asia' },
  });
}

function verifyToken(token: string): string | null {
  const secret = process.env.UNSUBSCRIBE_HMAC_SECRET;
  if (!secret) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1 || dot === token.length - 1) return null;
  const userId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (sig.length !== 32) return null;
  const expected = createHmac('sha256', secret).update(userId).digest('hex').slice(0, 32);
  try {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return userId;
}

function htmlPage(message: string, ok: boolean): string {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>hieu.asia — Hủy nhận email</title>
    <style>
      body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
        background:#f6f5f1;color:#1a1a1a;margin:0;padding:48px 16px;text-align:center;}
      .card { background:#fff;border-radius:8px;max-width:480px;margin:0 auto;
        padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
      .bar { height:3px;background:#B8923D;border-radius:2px;margin-bottom:20px;}
      h1 { font-size:20px;margin:0 0 12px;color:${ok ? '#1a1a1a' : '#b34040'};}
      p { color:#6b6b6b;line-height:1.5;}
      a { color:#B8923D;}
    </style>
  </head>
  <body>
    <div class="card">
      <div class="bar"></div>
      <h1>${ok ? 'Đã hủy nhận email' : 'Liên kết không hợp lệ'}</h1>
      <p>${message}</p>
      <p><a href="https://hieu.asia">Về trang chủ</a></p>
    </div>
  </body>
</html>`;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return new NextResponse(
      htmlPage('Thiếu mã xác nhận trong link. Vui lòng dùng link trong email mới nhất.', false),
      { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } },
    );
  }
  const userId = verifyToken(token);
  if (!userId) {
    return new NextResponse(
      htmlPage('Liên kết đã hết hạn hoặc không đúng. Vui lòng dùng link gần nhất.', false),
      { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } },
    );
  }

  const supabase = getSupabase();
  // `email_opted_out` lives on hieu_asia.users — column added by migration
  // 0037. If migration hasn't been applied yet the UPDATE will error; we
  // surface a generic message and log so ops can spot it.
  const { error } = await supabase
    .from('users')
    .update({ email_opted_out: true })
    .eq('id', userId);
  if (error) {
    console.warn('[unsubscribe] update failed', { userId, err: error.message });
    return new NextResponse(
      htmlPage(
        'Hệ thống đang bảo trì — vui lòng thử lại sau ít phút, hoặc tắt email trong /account/profile.',
        false,
      ),
      { status: 503, headers: { 'content-type': 'text/html; charset=utf-8' } },
    );
  }

  return new NextResponse(
    htmlPage(
      'Bạn sẽ không nhận thêm email tiếp thị nào từ hieu.asia. Bạn vẫn nhận email giao dịch (xác nhận thanh toán, hoá đơn).',
      true,
    ),
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } },
  );
}

// RFC 8058 one-click unsubscribe — Gmail/Apple Mail prefers POST. Same logic
// as GET but returns JSON since the mail client doesn't render the body.
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const userId = verifyToken(token);
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 400 });
  }
  const supabase = getSupabase();
  const { error } = await supabase
    .from('users')
    .update({ email_opted_out: true })
    .eq('id', userId);
  if (error) {
    return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
