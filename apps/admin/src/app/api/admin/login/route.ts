import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, isAdminEmail } from '@/lib/auth';

/**
 * POST /api/admin/login  { email: string }
 *
 * V1: trust the email if it matches `ADMIN_EMAILS` env. No password.
 * In V2, swap to a magic-link flow.
 */
export async function POST(request: NextRequest) {
  let email = '';
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Vui lòng nhập email.' }, { status: 400 });
  }

  if (!isAdminEmail(email)) {
    return NextResponse.json(
      { error: 'Email không có quyền truy cập admin.' },
      { status: 403 },
    );
  }

  const res = NextResponse.json({ ok: true, email });
  res.cookies.set(ADMIN_SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // 7 days
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
