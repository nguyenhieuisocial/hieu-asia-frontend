/**
 * POST /api/audit/log — proxy nhật ký đồng ý / quyền riêng tư cho mini-app.
 *
 * Vì sao tồn tại (31/07/2026): `consent/page.tsx` gọi THẲNG Edge Function
 * `audit-log` từ trình duyệt bằng anon key. Nhưng EF gate đòi `x-service-token`
 * (khoá server) từ Wave 64 ⇒ mọi lần ghi đều 401 **âm thầm** — nhật ký đồng ý
 * của người dùng mini-app chưa từng được ghi, dù đây là nghĩa vụ NĐ 356/2025.
 * Comment trong `audit-log/index.ts` đã cảnh báo đúng điều này: *"route it
 * through the Worker/server before re-enabling that path"*. Đây chính là nó.
 *
 * BẢO MẬT — actor LUÔN suy ở server, KHÔNG BAO GIỜ tin client:
 *   - Có `initData` hợp lệ (HMAC Telegram) → actor = `tg_<id>`, loại "user".
 *   - Không chứng minh được → actor = id ẩn danh do SERVER đúc, loại "anon".
 *   Mọi `user_id`/`actor` client gửi lên đều bị BỎ QUA — client không thể gán
 *   một bản ghi nhật ký cho người khác. Giữ đúng ý đồ của gate Wave 64.
 *
 * Đối chiếu: apps/web/src/app/api/audit/log/route.ts (cùng mô hình).
 */
import { NextResponse } from 'next/server';
import { verifiedUserIdFrom } from '@/lib/verify-init-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://fvftbqairezsybasqsek.supabase.co';
// Gate của EF so với custom secret này (KHÔNG dùng biến platform-inject —
// xem sự cố 31/07: biến nền tảng đổi giá trị sau migration, gate chết âm thầm).
const READING_PROXY_TOKEN = process.env.READING_PROXY_TOKEN;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const MAX_ACTION_LEN = 128;
const MAX_METADATA_BYTES = 8 * 1024;

export async function POST(req: Request) {
  if (!READING_PROXY_TOKEN) {
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const verified = verifiedUserIdFrom(body.init_data, BOT_TOKEN);
  const actor = verified ?? `anon_${crypto.randomUUID()}`;
  const actorType: 'user' | 'anon' = verified ? 'user' : 'anon';

  const action = typeof body.action === 'string' ? body.action.trim() : '';
  if (!action) {
    return NextResponse.json({ ok: false, error: 'action_required' }, { status: 400 });
  }
  if (action.length > MAX_ACTION_LEN) {
    return NextResponse.json({ ok: false, error: 'action_too_long' }, { status: 400 });
  }

  const metadata =
    body.audit_metadata && typeof body.audit_metadata === 'object'
      ? (body.audit_metadata as Record<string, unknown>)
      : {};
  if (JSON.stringify(metadata).length > MAX_METADATA_BYTES) {
    return NextResponse.json({ ok: false, error: 'metadata_too_large' }, { status: 400 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/audit-log`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-service-token': READING_PROXY_TOKEN,
      },
      body: JSON.stringify({
        actor,
        actor_type: actorType,
        action,
        resource_id: null,
        metadata: { ...metadata, surface: 'miniapp-telegram' },
      }),
      cache: 'no-store',
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'upstream_fetch_failed' }, { status: 502 });
  }
}
