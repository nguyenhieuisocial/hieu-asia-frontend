import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEqual,
  encodeSession,
  fetchAdminUsersFull,
  sha256Hex,
  type AdminRole,
} from '@/lib/auth';

/**
 * POST /api/admin/login  { email, password }
 *
 * Validates against the KV-backed admin user list (fetched via Worker
 * /admin/users?with_hash=1). Constant-time hash comparison.
 *
 * Break-glass: if `ADMIN_PASSWORD` env is set AND the KV fetch fails, allow
 *   `admin@hieu.asia` to log in with that password (role=owner). This keeps
 *   the site recoverable if the Worker is down or KV is corrupted.
 */

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

  const passwordHash = await sha256Hex(password);
  let matchedRole: AdminRole | null = null;
  let kvError: string | null = null;

  try {
    const users = await fetchAdminUsersFull();
    const user = users.find((u) => u.email.toLowerCase() === email);
    if (user && constantTimeEqual(passwordHash, user.password_hash)) {
      matchedRole = user.role;
    } else if (user) {
      return NextResponse.json({ error: 'Sai mật khẩu.' }, { status: 401 });
    } else {
      return NextResponse.json({ error: 'Email không có quyền truy cập admin.' }, { status: 403 });
    }
  } catch (err) {
    kvError = (err as Error).message;
  }

  // Break-glass: only kicks in if KV fetch failed AND env password is set
  if (!matchedRole && kvError) {
    const breakGlassPw = process.env.ADMIN_PASSWORD;
    if (breakGlassPw && email === 'admin@hieu.asia' && constantTimeEqual(password, breakGlassPw)) {
      matchedRole = 'owner';
    } else {
      return NextResponse.json(
        { error: `Không thể xác thực: ${kvError}` },
        { status: 503 },
      );
    }
  }

  if (!matchedRole) {
    return NextResponse.json({ error: 'Đăng nhập thất bại.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, email, role: matchedRole });
  // encodeSession is async now (uses Web Crypto HMAC). Await before setting cookie.
  const signed = await encodeSession(email, matchedRole);
  res.cookies.set(ADMIN_SESSION_COOKIE, signed, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
