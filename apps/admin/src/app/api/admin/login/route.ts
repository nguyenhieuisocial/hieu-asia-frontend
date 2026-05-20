import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, isAdminEmail } from '@/lib/auth';

/**
 * POST /api/admin/login  { email, password }
 *
 * Email must be in ADMIN_EMAILS allowlist AND password must equal ADMIN_PASSWORD.
 * Constant-time string compare to avoid timing attacks.
 *
 * If ADMIN_PASSWORD is unset on the server, the route refuses to log anyone in
 * (no fallback to email-only) — fail closed.
 */

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: NextRequest) {
  let email = '';
  let password = '';
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = (body.email ?? '').trim().toLowerCase();
    password = body.password ?? '';
  } catch {
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Vui lòng nhập đủ email và mật khẩu.' }, { status: 400 });
  }

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: 'Email không có quyền truy cập admin.' }, { status: 403 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD chưa cấu hình trên server.' },
      { status: 503 },
    );
  }

  if (!constantTimeEqual(password, adminPassword)) {
    return NextResponse.json({ error: 'Sai mật khẩu.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, email });
  res.cookies.set(ADMIN_SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
