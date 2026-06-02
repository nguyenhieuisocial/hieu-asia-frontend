'use client';

// Cross-channel account linking — the page a Telegram user lands on after tapping
// "Kết nối" in @hieuasiabot. It reads the single-use ?token, and once the user is
// signed in, POSTs it to the worker /identity/link-telegram with their Supabase
// access token. The worker stamps telegram_id onto this (canonical) web account,
// so the Premium/Free plan is then shared across web + Telegram.

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { getSupabaseAuth } from '@/lib/auth-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

type State =
  | { kind: 'idle' }
  | { kind: 'working' }
  | { kind: 'need_signin'; returnTo: string }
  | { kind: 'done' }
  | { kind: 'error'; message: string };

function ConnectInner() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = React.useState<State>({ kind: 'idle' });

  const connect = React.useCallback(async () => {
    if (!token) {
      setState({
        kind: 'error',
        message: 'Thiếu mã liên kết. Hãy bấm "Kết nối tài khoản" trong bot Telegram rồi mở lại đường link.',
      });
      return;
    }
    setState({ kind: 'working' });
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setState({ kind: 'error', message: 'Không khởi tạo được đăng nhập. Tải lại trang giúp nhé.' });
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const access = sess.session?.access_token;
    if (!access) {
      setState({ kind: 'need_signin', returnTo: `/connect-telegram?token=${encodeURIComponent(token)}` });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/identity/link-telegram`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${access}` },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setState({ kind: 'done' });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      const msg =
        data.error === 'token_expired'
          ? 'Mã liên kết đã hết hạn (10 phút). Hãy bấm "Kết nối tài khoản" lại trong bot.'
          : data.error === 'telegram_already_linked'
            ? 'Tài khoản Telegram này đã được nối với một tài khoản khác.'
            : res.status === 401
              ? 'Phiên đăng nhập đã hết hạn — đăng nhập lại giúp nhé.'
              : 'Chưa kết nối được lúc này. Thử lại sau giúp nhé.';
      setState({ kind: 'error', message: msg });
    } catch {
      setState({ kind: 'error', message: 'Lỗi mạng. Thử lại sau giúp nhé.' });
    }
  }, [token]);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Kết nối Telegram với tài khoản</CardTitle>
        <CardDescription>
          Nối tài khoản Telegram với tài khoản hieu.asia để gói Premium/Free dùng chung cả hai nơi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.kind === 'done' ? (
          <p className="text-emerald-600">
            ✅ Đã kết nối! Gói cước của bạn giờ dùng chung cả web lẫn Telegram. Bạn có thể đóng trang này.
          </p>
        ) : state.kind === 'need_signin' ? (
          <>
            <p>Bạn cần đăng nhập tài khoản hieu.asia trước khi nối.</p>
            <Button
              onClick={() => {
                window.location.href = `/signin?return=${encodeURIComponent(state.returnTo)}`;
              }}
            >
              Đăng nhập
            </Button>
          </>
        ) : (
          <>
            {state.kind === 'error' && <p className="text-red-600">{state.message}</p>}
            <Button onClick={connect} disabled={state.kind === 'working' || !token}>
              {state.kind === 'working' ? 'Đang kết nối…' : 'Xác nhận kết nối'}
            </Button>
            {!token && (
              <p className="text-sm text-muted-foreground">
                Mở trang này từ nút "Kết nối tài khoản" trong bot Telegram.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function ConnectTelegramPage() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <div className="container mx-auto px-4 py-16">
        <Suspense fallback={<p className="text-center">Đang tải…</p>}>
          <ConnectInner />
        </Suspense>
      </div>
    </main>
  );
}
