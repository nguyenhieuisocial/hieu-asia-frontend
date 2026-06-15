import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEqual,
  encodeSession,
  type AdminRole,
} from '@/lib/auth';

/**
 * POST /api/admin/login  { email, password }
 *
 * Delegates password verification to the Worker `/admin/login` endpoint, which
 * does proper argon2id verification (with sha256-legacy fallback). The old
 * implementation pulled `/admin/users?with_hash=1` and did a raw sha256
 * comparison locally — that never matched the stored argon2id hashes, so
 * NO password could log in via the UI even when correct.
 *
 * Break-glass: if `ADMIN_PASSWORD` env is set AND the Worker call fails, allow
 *   `admin@hieu.asia` to log in with that password (role=owner). Keeps the
 *   site recoverable when the Worker is down or KV is corrupted.
 *
 * Runtime: Edge (0ms cold-start). All deps Edge-compat: fetch, Web Crypto HMAC.
 */
export const runtime = 'edge';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';

interface WorkerLoginResponse {
  ok: boolean;
  user?: { email: string; role: AdminRole };
  error?: string;
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

  const token = process.env.HIEU_API_ADMIN_TOKEN;
  let matchedRole: AdminRole | null = null;
  let workerError: string | null = null;

  // Primary path: ask the Worker to verify (handles argon2id + legacy sha256).
  if (token) {
    try {
      const r = await fetch(`${GATEWAY}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token,
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      });
      const data = (await r.json().catch(() => ({}))) as WorkerLoginResponse;
      if (r.status === 401) {
        return NextResponse.json({ error: 'Sai email hoặc mật khẩu.' }, { status: 401 });
      }
      if (!r.ok || !data.ok || !data.user) {
        workerError = data.error ?? `gateway HTTP ${r.status}`;
      } else if (data.user.email.toLowerCase() === email) {
        matchedRole = data.user.role;
      }
    } catch (err) {
      workerError = (err as Error).message;
    }
  } else {
    workerError = 'HIEU_API_ADMIN_TOKEN not configured';
  }

  // Break-glass: only kicks in if Worker call failed AND env password is set.
  if (!matchedRole && workerError) {
    const breakGlassPw = process.env.ADMIN_PASSWORD;
    if (breakGlassPw && email === 'admin@hieu.asia' && constantTimeEqual(password, breakGlassPw)) {
      matchedRole = 'owner';
    } else {
      // Log the real backend error server-side for debugging, but return a
      // generic message — don't leak gateway internals to the client.
      console.error('[admin/login] auth failed:', workerError);
      return NextResponse.json(
        { error: 'Không thể xác thực. Thử lại sau.' },
        { status: 503 },
      );
    }
  }

  if (!matchedRole) {
    return NextResponse.json({ error: 'Đăng nhập thất bại.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, email, role: matchedRole });
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
