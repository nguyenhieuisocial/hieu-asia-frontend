/**
 * GET  /api/admin/tuvi-content/[slug] — đọc đầy đủ 1 mục (kèm cột `data`).
 * PUT  /api/admin/tuvi-content/[slug] — lưu 1 mục.
 *
 * ⚠️ CHỐNG MẤT TRƯỜNG — lý do PUT ở đây MERGE thay vì ghi đè thẳng:
 * `data` là jsonb ghi-cả-cục. Nếu client gửi thiếu một trường (form chưa có ô
 * cho nó, hoặc code sau này thêm trường mới mà form chưa biết) thì ghi đè thẳng
 * sẽ XOÁ SẠCH trường đó. Nên: đọc bản hiện tại → spread → chỉ ghi các khoá
 * client gửi. Founder sửa 1 ô không bao giờ làm mất phần còn lại.
 *
 * Cũng vì vậy KHÔNG cho tạo mục mới qua endpoint này: slug phải tồn tại. Thêm
 * mục mới thuộc việc code (`tuvi-content.ts` + chạy lại workflow seed) vì còn
 * phải có trang web tương ứng — tạo slug rời sẽ thành mục không ai đọc được.
 */

import { NextResponse } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Row {
  slug: string;
  kind: 'palace' | 'star';
  title: string;
  data: Record<string, unknown>;
  sort_order: number | null;
  updated_at: string | null;
}

const SLUG_RE = /^[a-z0-9-]{1,80}$/;

async function readOne(slug: string) {
  const r = await sbServer<Row[]>(
    `tuvi_content?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
  );
  return { r, row: r.ok && Array.isArray(r.body) ? r.body[0] : undefined };
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  const { slug } = await ctx.params;
  if (!SLUG_RE.test(slug)) return NextResponse.json({ ok: false, error: 'slug không hợp lệ' }, { status: 400 });

  const { r, row } = await readOne(slug);
  if (!r.ok) {
    return NextResponse.json({ ok: false, error: r.error ?? 'Supabase error' }, { status: r.status === 503 ? 503 : 502 });
  }
  if (!row) return NextResponse.json({ ok: false, error: 'không tìm thấy mục này' }, { status: 404 });
  return NextResponse.json({ ok: true, item: row });
}

export async function PUT(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  const { slug } = await ctx.params;
  if (!SLUG_RE.test(slug)) return NextResponse.json({ ok: false, error: 'slug không hợp lệ' }, { status: 400 });

  let body: { title?: unknown; data?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'body không phải JSON' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const patch = body.data;
  if (!title) return NextResponse.json({ ok: false, error: 'thiếu tiêu đề' }, { status: 400 });
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    return NextResponse.json({ ok: false, error: 'data phải là object' }, { status: 400 });
  }

  // Mục phải tồn tại (xem ghi chú đầu file) + lấy bản hiện tại để merge.
  const { r: readRes, row } = await readOne(slug);
  if (!readRes.ok) {
    return NextResponse.json({ ok: false, error: readRes.error ?? 'Supabase error' }, { status: readRes.status === 503 ? 503 : 502 });
  }
  if (!row) return NextResponse.json({ ok: false, error: 'không tìm thấy mục này' }, { status: 404 });

  const merged = { ...(row.data ?? {}), ...(patch as Record<string, unknown>) };

  const up = await sbServer<Row[]>(`tuvi_content?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ title, data: merged, updated_at: new Date().toISOString() }),
  });
  if (!up.ok) {
    return NextResponse.json({ ok: false, error: up.error ?? 'lưu thất bại' }, { status: up.status === 503 ? 503 : 502 });
  }
  return NextResponse.json({ ok: true, item: Array.isArray(up.body) ? up.body[0] : null });
}
