'use client';

/**
 * /signin — Magic-link sign-in page.
 *
 * Email-only. We send a one-time link via Supabase Auth; the user clicks
 * the link and lands on `/auth/callback` which completes the session
 * exchange and redirects to `/dashboard`.
 */

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { sendMagicLink } from '@/lib/auth-client';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const initialError = searchParams.get('error');

  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(initialError);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await sendMagicLink(email.trim());
    setLoading(false);
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error);
    }
  }

  return (
    <main className="min-h-screen bg-ink text-cream flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-gold/20 bg-ink/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-gold">
            Đăng nhập hieu.asia
          </CardTitle>
          <p className="mt-2 text-sm text-cream/70">
            Nhập email để nhận liên kết đăng nhập. Không cần mật khẩu.
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 text-sm text-emerald-200">
              <p className="font-medium">Đã gửi liên kết đăng nhập</p>
              <p className="mt-1 text-emerald-200/80">
                Kiểm tra hộp thư <strong>{email}</strong> và nhấp vào liên kết
                để hoàn tất đăng nhập. Liên kết có hiệu lực trong 15 phút.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-cream/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ban@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="rounded-md border border-rose-500/40 bg-rose-950/30 p-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gold text-ink hover:bg-gold/90"
              >
                {loading ? 'Đang gửi…' : 'Gửi liên kết đăng nhập'}
              </Button>

              <p className="text-center text-xs text-cream/50">
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <a href="/terms" className="underline hover:text-gold">
                  Điều khoản
                </a>{' '}
                và{' '}
                <a href="/privacy" className="underline hover:text-gold">
                  Chính sách bảo mật
                </a>
                .
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
