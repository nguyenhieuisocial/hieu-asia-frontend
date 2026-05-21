/**
 * /affiliate/signup — affiliate signup form.
 * Submit → POST /api/affiliate/signup → set cookie via POST /api/affiliate/me
 * → show confirmation screen with code, share link, QR.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

type PayoutMethod = 'bank' | 'momo' | 'zalo';

interface SignupSuccess {
  ok: true;
  affiliate_id: string;
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
  const [displayName, setDisplayName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [method, setMethod] = React.useState<PayoutMethod>('bank');
  const [destination, setDestination] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<SignupSuccess | null>(null);
  const [copied, setCopied] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/affiliate/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          email,
          payout_method: method,
          payout_destination: destination,
        }),
      });
      // Guard against HTML error pages.
      const ct = res.headers.get('content-type') ?? '';
      if (!/\bjson\b/i.test(ct)) {
        setError(`Phản hồi không phải JSON (HTTP ${res.status})`);
        return;
      }
      const data: SignupSuccess | SignupError = await res.json();
      if (!data.ok) {
        setError(data.error);
        return;
      }
      // Set affiliate cookie so /dashboard works
      await fetch('/api/affiliate/me', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ affiliate_id: data.affiliate_id }),
      });
      setResult(data);
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
      <div className="min-h-screen bg-ink text-cream">
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
                <Label className="text-xs uppercase text-cream/60">Mã affiliate của bạn</Label>
                <div className="mt-1 rounded border border-gold/30 bg-gold/10 p-3 text-center font-mono text-2xl font-bold text-gold">
                  {result.code}
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase text-cream/60">Link giới thiệu</Label>
                <div className="mt-1 flex gap-2">
                  <Input value={result.share_url} readOnly className="font-mono text-xs" />
                  <Button onClick={copyLink} type="button">
                    {copied ? 'Đã copy' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase text-cream/60">QR Code</Label>
                <div className="mt-1 flex justify-center rounded border border-cream/10 bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.qr_url} alt="QR code" width={256} height={256} className="block" />
                </div>
                <a
                  href={result.qr_url}
                  download={`hieu-asia-${result.code}.png`}
                  className="mt-2 block text-center text-sm text-gold hover:underline"
                >
                  Tải QR code
                </a>
              </div>

              <div className="rounded border border-cream/10 bg-cream/5 p-3 text-sm text-cream/70">
                Mẹo: kết hợp link + QR khi đăng Facebook để chuyển đổi tốt hơn. Theo dõi
                clicks/conversions trong dashboard.
              </div>

              <Link href="/affiliate/dashboard">
                <Button className="w-full bg-gold text-ink hover:bg-gold/90" size="lg">
                  Vào dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden bg-ink-radial pt-20 pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-xl px-4">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
          <span className="mx-1.5">/</span>
          <span className="text-cream/70">Đăng ký</span>
        </nav>
        <Card className="mt-4 border-cream/10">
          <CardHeader>
            <CardTitle className="text-2xl">Đăng ký affiliate</CardTitle>
            <p className="text-sm text-cream/70">
              Hoa hồng 30% tháng đầu / 10% recurring · Cookie 30 ngày
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ban@example.com"
                />
              </div>

              <div>
                <Label htmlFor="method">Phương thức nhận tiền</Label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PayoutMethod)}
                  className="mt-1 w-full rounded border border-cream/20 bg-ink p-2 text-cream"
                >
                  <option value="bank">Chuyển khoản ngân hàng</option>
                  <option value="momo">Ví MoMo</option>
                  <option value="zalo">ZaloPay</option>
                </select>
              </div>

              <div>
                <Label htmlFor="destination">
                  {method === 'bank' ? 'Số TK (kèm tên ngân hàng + chủ TK)' : 'Số điện thoại ví'}
                </Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  placeholder={
                    method === 'bank'
                      ? '1234567890 - Vietcombank - NGUYEN VAN A'
                      : '09xxxxxxxx'
                  }
                />
              </div>

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

              <p className="text-xs text-cream/70">
                Khi đăng ký bạn đồng ý với{' '}
                <Link href="/terms" className="text-gold hover:underline">
                  Điều khoản
                </Link>{' '}
                và{' '}
                <Link href="/affiliate/terms" className="text-gold hover:underline">
                  quy chế Affiliate
                </Link>{' '}
                (không spam, không mạo danh, hoa hồng có thể điều chỉnh).
              </p>
            </form>
          </CardContent>
        </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
