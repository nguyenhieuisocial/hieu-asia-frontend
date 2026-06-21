'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { ArrowRight } from 'lucide-react';
import { sunSignFromDate } from '@/lib/cung-hoang-dao-data';

interface Result {
  name: string;
  symbol: string;
  slug: string;
  element: string;
  nearCusp: boolean;
}

/**
 * Công cụ "Bạn là cung gì?" — nhập ngày sinh → tính cung Mặt Trời bằng ENGINE THẬT
 * (vị trí Mặt Trời theo Meeus), nên ranh giới cung luôn đúng theo từng năm thay vì
 * tra bảng cứng. Thuần client, không gọi mạng.
 */
export function SunSignFinder() {
  const [date, setDate] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  function handleCheck() {
    setError('');
    const parts = date.split('-').map(Number);
    const [y, m, dd] = parts;
    if (!y || !m || !dd || parts.length !== 3) {
      setError('Hãy chọn ngày sinh của bạn.');
      setResult(null);
      return;
    }
    if (y < 1900 || y > 2100) {
      setError('Năm sinh nằm ngoài khoảng hỗ trợ (1900–2100).');
      setResult(null);
      return;
    }
    const r = sunSignFromDate(y, m, dd);
    setResult({
      name: r.sign.name,
      symbol: r.sign.symbol,
      slug: r.slug,
      element: r.sign.element,
      nearCusp: r.nearCusp,
    });
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-card/40 p-6">
      <h2 className="font-heading text-xl font-semibold text-foreground">Bạn là cung gì?</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Nhập ngày sinh — chúng tôi tính theo vị trí Mặt Trời thật, đúng cả với ngày sát ranh giới.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="sun-sign-date">
          Ngày sinh
        </label>
        <input
          id="sun-sign-date"
          type="date"
          value={date}
          min="1900-01-01"
          max="2100-12-31"
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold/60"
        />
        <Button type="button" onClick={handleCheck} size="lg">
          Xem cung của tôi
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-400">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 rounded-lg border border-border bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">Bạn thuộc cung</p>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            <span aria-hidden className="mr-2 text-gold">
              {result.symbol}
            </span>
            {result.name}
            <span className="ml-2 align-middle text-sm font-normal text-muted-foreground">
              (nguyên tố {result.element})
            </span>
          </p>
          {result.nearCusp && (
            <p className="mt-2 text-xs text-amber-400">
              Bạn sinh sát ranh giới giữa hai cung — kết quả này dựa trên giờ trưa. Nếu biết giờ sinh
              chính xác, hãy lập bản đồ sao để chắc chắn.
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button asChild size="sm">
              <Link href={`/cung-hoang-dao/${result.slug}`}>
                Tìm hiểu cung {result.name} <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Link
              href="/ban-do-sao"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
            >
              Lập bản đồ sao đầy đủ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
