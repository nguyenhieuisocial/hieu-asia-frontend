/**
 * /affiliate/poster — tấm poster QR có thể chụp màn hình / in ra để dán.
 * Trang CLIENT (không phải OG route): vì cần <img> QR động (qrserver), mà
 * next/og không fetch ảnh ngoài lúc render — nên QR sống ở đây.
 *
 * Đọc mã giới thiệu từ ?code= (useSearchParams, bọc trong <Suspense> theo đúng
 * mẫu các trang client khác trong repo để tránh soft-404). QR mã hoá
 * https://hieu.asia/?ref=<code> đúng pattern dashboard affiliate đang dùng.
 *
 * Brand: cream/gold/ink — khớp các trang affiliate.
 */

'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

// Chỉ giữ chữ–số an toàn, giới hạn độ dài để khớp regex mã CTV của app.
function sanitizeCode(raw: string | null): string {
  if (!raw) return '';
  return raw.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32);
}

function PosterInner() {
  const params = useSearchParams();
  const code = sanitizeCode(params.get('code'));
  const shareUrl = `https://hieu.asia/?ref=${code || ''}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="mx-auto max-w-md">
      {/* Tấm poster — khung kem/vàng, chụp màn hình hoặc in trực tiếp */}
      <Card className="overflow-hidden border-gold/30 bg-cream text-ink shadow-xl">
        <CardContent className="flex flex-col items-center px-8 py-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
            hieu.asia
          </p>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-ink">
            Khám phá lá số của bạn
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Tử Vi · Bát Tự · Thần số học. Minh bạch, không bói mù.
          </p>

          {code ? (
            <div className="mt-8 rounded-2xl border border-gold/40 bg-white p-4 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt={`Mã QR giới thiệu hieu.asia (${code})`}
                width={240}
                height={240}
                className="h-60 w-60"
              />
            </div>
          ) : (
            <div className="mt-8 flex h-60 w-60 items-center justify-center rounded-2xl border border-dashed border-gold/40 bg-white/60 px-6 text-sm text-ink/60">
              Thiếu mã giới thiệu. Mở trang này kèm <span className="mx-1 font-mono">?code=MÃ</span> của bạn.
            </div>
          )}

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ink/50">
            Quét để mở
          </p>
          <p className="mt-1 break-all font-mono text-base font-semibold text-gold-700">
            hieu.asia/?ref={code || '…'}
          </p>
          {code ? (
            <p className="mt-2 text-xs text-ink/60">Mã giới thiệu: {code}</p>
          ) : null}

          <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink/45">
            hieu.asia · Hiểu mình. Quyết định mình.
          </p>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Chụp màn hình tấm này để in/đăng.
      </p>
    </div>
  );
}

export default function AffiliatePosterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-ink-radial opacity-80"
        />
        <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-20 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Poster QR</span>
          </nav>

          <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Đang tải…</p>}>
            <PosterInner />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
