/**
 * /affiliate/signup — affiliate signup form (LOGIN-GATED).
 *
 * Becoming a paid affiliate requires a logged-in account: commission + payout
 * run on the System B tree whose rows are keyed by the auth user id. So this
 * page gates on a Supabase session — anonymous visitors see a sign-in prompt.
 *
 * Submit → POST /api/affiliate/signup with the Authorization bearer token →
 * worker derives identity from the JWT, creates the tree node + the linked
 * payout profile under one shared code → set cookie via /api/affiliate/me →
 * show confirmation (code, share link, QR).
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { getSupabaseAuth } from '@/lib/auth-client';

type PayoutMethod = 'bank' | 'momo' | 'zalo';
type AuthState = 'loading' | 'anon' | 'authed';

interface SignupSuccess {
  ok: true;
  affiliate_id: string;
  token: string;
  code: string;
  share_url: string;
  qr_url: string;
  dashboard_url: string;
}

interface SignupError {
  ok: false;
  error: string;
}

export default function AffiliateSignupPage() {
  const [authState, setAuthState] = React.useState<AuthState>('loading');
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  const [displayName, setDisplayName] = React.useState('');
  const [method, setMethod] = React.useState<PayoutMethod>('bank');
  const [bankName, setBankName] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');
  const [accountHolder, setAccountHolder] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<SignupSuccess | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Gate on a Supabase session. Commission/payout need an auth account.
  React.useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setAuthState('anon');
      return;
    }
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        const session = data.session;
        if (session?.access_token) {
          setUserEmail(session.user?.email ?? null);
          setAuthState('authed');
        } else {
          setAuthState('anon');
        }
      })
      .catch(() => {
        if (!cancelled) setAuthState('anon');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Fresh token at submit time (it may have refreshed since mount).
      const supabase = getSupabaseAuth();
      const { data } = supabase
        ? await supabase.auth.getSession()
        : { data: { session: null } };
      const token = data.session?.access_token;
      if (!token) {
        setAuthState('anon');
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      const res = await fetch('/api/affiliate/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          display_name: displayName,
          payout_method: method,
          ...(method === 'bank'
            ? {
                bank_name: bankName,
                account_number: accountNumber,
                account_holder: accountHolder,
              }
            : { phone }),
        }),
      });
      // Guard against HTML error pages.
      const ct = res.headers.get('content-type') ?? '';
      if (!/\bjson\b/i.test(ct)) {
        setError(`Phản hồi không phải JSON (HTTP ${res.status})`);
        return;
      }
      const respData: SignupSuccess | SignupError = await res.json();
      if (!respData.ok) {
        if (res.status === 401) setAuthState('anon');
        setError(respData.error);
        return;
      }
      // Set affiliate cookie so /dashboard works. If this fails we must NOT
      // show the success screen — the cookie wouldn't be set and the dashboard
      // would reject the user (false "you're an affiliate" state).
      const meRes = await fetch('/api/affiliate/me', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: respData.token }),
      });
      if (!meRes.ok) {
        throw new Error(
          'Tạo tài khoản thành công nhưng không thể đăng nhập affiliate. Vui lòng thử lại.',
        );
      }
      setResult(respData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setSubmitting(false);
    }
  }

  function copyLink() {
    if (!result) return;
    navigator.clipboard.writeText(result.share_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main id="main-content" className="relative overflow-hidden bg-ink-radial pt-24 pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-xl px-4">
          <Card className="border-gold/30">
            <CardHeader>
              <div className="mb-2 text-3xl">🎉</div>
              <CardTitle className="text-2xl">Bạn đã là affiliate hieu.asia!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Mã affiliate của bạn</Label>
                <div className="mt-1 rounded border border-gold/30 bg-gold/10 p-3 text-center font-mono text-2xl font-bold text-gold-700">
                  {result.code}
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase text-muted-foreground">Link giới thiệu</Label>
                <div className="mt-1 flex gap-2">
                  <Input value={result.share_url} readOnly className="font-mono text-xs" />
                  <Button onClick={copyLink} type="button">
                    {copied ? 'Đã copy' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase text-muted-foreground">QR Code</Label>
                <div className="mt-1 flex justify-center rounded border border-border bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.qr_url} alt="QR code" width={256} height={256} className="block" />
                </div>
                <a
                  href={result.qr_url}
                  download={`hieu-asia-${result.code}.png`}
                  className="mt-2 block text-center text-sm text-gold-700 hover:underline"
                >
                  Tải QR code
                </a>
              </div>

              <div className="rounded border border-border bg-muted/5 p-3 text-sm text-muted-foreground">
                Mẹo: kết hợp link + QR khi đăng Facebook để chuyển đổi tốt hơn. Theo dõi
                clicks/conversions trong dashboard.
              </div>

              <Button asChild className="w-full bg-gold text-ink hover:bg-gold/90" size="lg"><Link href="/affiliate/dashboard">

                  Vào dashboard

              </Link></Button>
            </CardContent>
          </Card>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden bg-ink-radial pt-20 pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-xl px-4">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Đăng ký</span>
        </nav>
        <Card className="mt-4 border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Đăng ký affiliate</CardTitle>
            <p className="text-sm text-muted-foreground">
              Hoa hồng 30% tháng đầu / 10% các tháng sau · Cookie 30 ngày
            </p>
          </CardHeader>
          <CardContent>
            {authState === 'loading' && (
              <p className="py-8 text-center text-sm text-muted-foreground">Đang kiểm tra đăng nhập…</p>
            )}

            {authState === 'anon' && (
              <div className="space-y-4 py-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Để nhận hoa hồng bằng tiền thật, bạn cần <strong>đăng nhập tài khoản hieu.asia</strong> trước
                  (để gắn hoa hồng + chi trả an toàn vào đúng người).
                </p>
                <Button asChild className="w-full bg-gold text-ink hover:bg-gold/90" size="lg">
                  <Link href="/signin?next=/affiliate/signup">Đăng nhập để đăng ký</Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Chưa có tài khoản? Trang đăng nhập sẽ tạo giúp bạn bằng email (magic link).
                </p>
              </div>
            )}

            {authState === 'authed' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {userEmail && (
                  <p className="rounded border border-border bg-muted/5 px-3 py-2 text-xs text-muted-foreground">
                    Đăng ký bằng tài khoản <span className="font-medium text-foreground">{userEmail}</span>
                  </p>
                )}

                <div>
                  <Label htmlFor="display_name">Tên hiển thị</Label>
                  <Input
                    id="display_name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    maxLength={64}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <Label htmlFor="method">Phương thức nhận tiền</Label>
                  <select
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PayoutMethod)}
                    className="mt-1 w-full rounded border border-border bg-background p-2 text-foreground"
                  >
                    <option value="bank">Chuyển khoản ngân hàng</option>
                    <option value="momo">Ví MoMo</option>
                    <option value="zalo">ZaloPay</option>
                  </select>
                </div>

                {method === 'bank' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bank_name">Tên ngân hàng</Label>
                      <Input
                        id="bank_name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                        placeholder="Vietcombank"
                      />
                    </div>
                    <div>
                      <Label htmlFor="account_number">Số tài khoản</Label>
                      <Input
                        id="account_number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        inputMode="numeric"
                        placeholder="1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="account_holder">Chủ tài khoản</Label>
                      <Input
                        id="account_holder"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        required
                        placeholder="NGUYEN VAN A"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="phone">Số điện thoại ví</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      inputMode="tel"
                      placeholder="09xxxxxxxx"
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-ink hover:bg-gold/90"
                  size="lg"
                >
                  {submitting ? 'Đang tạo tài khoản…' : 'Đăng ký'}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Khi đăng ký bạn đồng ý với{' '}
                  <Link href="/terms" className="text-gold-700 hover:underline">
                    Điều khoản
                  </Link>{' '}
                  và{' '}
                  <Link href="/affiliate/terms" className="text-gold-700 hover:underline">
                    quy chế Affiliate
                  </Link>{' '}
                  (không spam, không mạo danh, hoa hồng có thể điều chỉnh).
                </p>
              </form>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
