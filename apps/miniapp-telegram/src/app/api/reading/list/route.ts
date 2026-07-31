/**
 * POST /api/reading/list — danh sách lá số của CHÍNH người gọi, cho mini-app.
 *
 * Vì sao tồn tại (31/07/2026): `dashboard/page.tsx` gọi THẲNG Edge Function
 * `reading-list` từ trình duyệt bằng anon key ⇒ 401 âm thầm từ Wave 64 (lỗi bị
 * nuốt bằng `console.warn`) ⇒ bảng điều khiển mini-app LUÔN trống.
 *
 * BẢO MẬT — vì sao POST + `init_data` chứ không phải GET + `user_id`:
 *   Route này trả về TOÀN BỘ lịch sử lá số của một người. Nếu nhận `user_id`
 *   do client khai (kể cả id ẩn danh), ai cầm được một id là đọc sạch lịch sử
 *   người đó — đúng lỗ IDOR mà Wave 64/65 đã bịt.
 *   apps/web cho endpoint TƯƠNG ĐƯƠNG bắt buộc JWT đã xác minh, và CHỈ chấp
 *   nhận `x-anon-id` ở đường xem-một-lá-số (nơi còn phải biết thêm session_id).
 *   Mini-app không có JWT, nhưng có thứ tương đương: `initData` được Telegram
 *   ký HMAC. Server tự xác minh rồi tự suy `tg_<id>` ⇒ mạnh ngang JWT, không
 *   IDOR. Không chứng minh được → 401, fail closed.
 *
 * KHÔNG hạ chuẩn của web xuống cho tiện — nâng mini-app lên cùng chuẩn.
 */
import { NextResponse } from 'next/server';
import { verifiedUserIdFrom } from '@/lib/verify-init-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://fvftbqairezsybasqsek.supabase.co';
const READING_PROXY_TOKEN = process.env.READING_PROXY_TOKEN;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

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

  // Danh tính suy hoàn toàn ở server. Không có đường nào nhận id từ client.
  const userId = verifiedUserIdFrom(body.init_data, BOT_TOKEN);
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }

  const query = new URLSearchParams({ user_id: userId });
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/reading-list?${query.toString()}`, {
      method: 'GET',
      headers: { 'x-service-token': READING_PROXY_TOKEN },
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
