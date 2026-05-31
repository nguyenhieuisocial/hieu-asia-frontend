'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';

export default function AdminLoginPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  return (
    <React.Suspense fallback={null}>
      <AdminLoginPageInner />
    </React.Suspense>
  );
}

function AdminLoginPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') ?? '/';
  const reason = search.get('reason');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    reason === 'session_invalid'
      ? 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ (cookie cũ trước khi bật HMAC). Vui lòng đăng nhập lại.'
      : null,
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Đăng nhập thất bại.');
        return;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi mạng.');
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-16">
      <h1 className="sr-only">Đăng nhập admin.hieu.asia</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">admin.hieu.asia</CardTitle>
          <CardDescription>
            Đăng nhập bằng tài khoản admin (lưu trong Cloudflare KV).
            Quản lý user list tại <code className="mx-1 rounded bg-muted/30 px-1.5 py-0.5 font-mono text-xs">/users</code> sau khi đăng nhập.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email admin</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hieu.asia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={pending || !email || !password}>
              {pending ? 'Đang xác thực…' : 'Đăng nhập'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Cookie-based session 7 ngày. Constant-time password compare. Failed-closed
              nếu <code className="rounded bg-muted/30 px-1 font-mono">ADMIN_PASSWORD</code> chưa set.
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
