'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { ArrowRight } from 'lucide-react';
import { buildBanMenh, COLOR_HEX, FROM_YEAR, TO_YEAR, type BanMenhData } from '@/lib/ban-menh-data';
import { readBirthProfile, saveBirthProfile } from '@/lib/birth-profile';
import { SavedBirthInfoHint } from '@/components/tools/SavedBirthInfoHint';

function Chips({ colors }: { colors: string[] }) {
  return (
    <span className="inline-flex flex-wrap gap-1.5 align-middle">
      {colors.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-0.5 text-xs text-foreground/85"
        >
          <span
            aria-hidden
            className="h-3 w-3 rounded-full border border-border"
            style={{ backgroundColor: COLOR_HEX[c] ?? '#888' }}
          />
          {c}
        </span>
      ))}
    </span>
  );
}

/**
 * Công cụ "Tra mệnh theo năm sinh" — nhập năm → tính nạp âm + ngũ hành + màu hợp
 * bằng engine THẬT (yearProfile/computeBanMenh). Thuần client, không gọi mạng.
 */
export function BanMenhFinder() {
  const [year, setYear] = useState('');
  const [result, setResult] = useState<BanMenhData | null>(null);
  const [error, setError] = useState('');
  const [prefilled, setPrefilled] = useState(false);

  // PROFILE-CARRY — tự điền từ hồ sơ ngày sinh dùng chung (localStorage) để
  // khách đã nhập ở công cụ khác không phải gõ lại. Đọc trong effect (không
  // phải lúc render) để tránh lệch hydrate giữa server và client.
  useEffect(() => {
    const p = readBirthProfile();
    if (!p.year) return;
    const d = buildBanMenh(p.year);
    if (!d) return;
    setYear(String(p.year));
    setResult(d);
    setPrefilled(true);
  }, []);

  function handleCheck() {
    setError('');
    const y = Number(year);
    if (!Number.isInteger(y) || y < FROM_YEAR || y > TO_YEAR) {
      setError(`Hãy nhập năm sinh từ ${FROM_YEAR} đến ${TO_YEAR}.`);
      setResult(null);
      return;
    }
    const d = buildBanMenh(y);
    if (!d) {
      setError(`Hãy nhập năm sinh từ ${FROM_YEAR} đến ${TO_YEAR}.`);
      setResult(null);
      return;
    }
    setResult(d);
    saveBirthProfile({ year: y });
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-card/40 p-6">
      <h2 className="font-heading text-xl font-semibold text-foreground">Tra mệnh theo năm sinh</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Nhập năm sinh (dương lịch) — chúng tôi tính nạp âm và ngũ hành bản mệnh theo chu kỳ 60 Giáp
        Tý.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="ban-menh-year">
          Năm sinh
        </label>
        <input
          id="ban-menh-year"
          type="number"
          inputMode="numeric"
          placeholder="Ví dụ: 1990"
          value={year}
          min={FROM_YEAR}
          max={TO_YEAR}
          aria-invalid={!!error}
          aria-describedby={error ? 'ban-menh-year-err' : undefined}
          onChange={(e) => setYear(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCheck();
          }}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold/60"
        />
        <Button type="button" onClick={handleCheck} size="lg">
          Xem mệnh của tôi
        </Button>
      </div>

      {error && (
        <p id="ban-menh-year-err" role="alert" className="mt-3 text-sm text-rose-400">
          {error}
        </p>
      )}

      {prefilled && (
        <div className="mt-3">
          <SavedBirthInfoHint show onClear={() => setPrefilled(false)} />
        </div>
      )}

      {result && (
        <div className="mt-5 rounded-lg border border-border bg-background/60 p-4">
          <p className="text-sm text-muted-foreground">
            Sinh năm {result.year} (tuổi {result.canChi}, con {result.zodiac.ten})
          </p>
          <p className="mt-1 font-heading text-2xl font-bold text-foreground">
            Mệnh {result.elementName}
            <span className="ml-2 align-middle text-sm font-normal text-muted-foreground">
              — nạp âm {result.napAmName}
            </span>
          </p>
          <div className="mt-3 space-y-1.5 text-sm text-foreground/85">
            <p className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground">Màu hợp:</span>{' '}
              <Chips colors={[...result.banMenhColors, ...result.hopColors]} />
            </p>
            <p className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground">Nên hạn chế:</span>{' '}
              <Chips colors={result.avoidColors} />
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button asChild size="sm">
              <Link href={`/ban-menh/${result.year}`}>
                Xem chi tiết năm {result.year} <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Link
              href="/la-so-bat-tu"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
            >
              Lập lá số Bát Tự đầy đủ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
