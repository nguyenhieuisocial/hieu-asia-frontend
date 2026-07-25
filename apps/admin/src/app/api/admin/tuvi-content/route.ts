/**
 * GET /api/admin/tuvi-content — danh sách mục nội dung Tử Vi (12 cung + 47 sao).
 *
 * Bước 2/3 của CMS Tử Vi: cho founder tự sửa nội dung không cần lập trình viên.
 * Nguồn dữ liệu là `hieu_asia.tuvi_content` — cùng bảng mà worker API
 * `/content/public/tuvi/*` phục vụ ra web.
 *
 * KHÔNG trả cột `data` ở đây: danh sách 59 mục × ~1.800 ký tự = tải nặng vô ích.
 * Trang sửa gọi endpoint `[slug]` để lấy đầy đủ.
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
  sort_order: number | null;
  updated_at: string | null;
}

export async function GET() {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;

  const r = await sbServer<Row[]>(
    'tuvi_content?select=slug,kind,title,sort_order,updated_at&order=kind.asc,sort_order.asc',
  );
  if (!r.ok) {
    return NextResponse.json(
      { ok: false, error: r.error ?? 'Supabase error', items: [] },
      { status: r.status === 503 ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true, items: r.body ?? [] });
}
