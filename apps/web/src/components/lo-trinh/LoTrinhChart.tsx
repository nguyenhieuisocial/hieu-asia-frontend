/**
 * LoTrinhChart — personalises a /lo-trinh editorial page with the reader's
 * REAL Tử Vi chart, read from the saved profile (`hieu:profile:v1`).
 *
 * Brand contract ("không bói mù"): stars and palaces are shown as REFERENCE
 * DATA pulled from the user's own chart — never as fate-telling, never as a
 * threat. The component degrades gracefully:
 *   - No valid saved profile → an invite card pointing at /decisions/new
 *     (where the birth-data form + cast live). We never force input in place.
 *   - Network/cast error → falls back to the same invite card, page never breaks.
 *
 * SSR-safe: localStorage is only touched inside useEffect, guarded by
 * `typeof window`.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Stars } from 'lucide-react';
import { Button, Skeleton } from '@hieu-asia/ui';
import { readSavedProfile, isProfileComplete } from '@/lib/saved-profile';
import {
  castTuViChart,
  findPalaceByName,
  type CastChartInput,
  type TuViChart,
  type TuViPalace,
} from '@/lib/tuvi-client';

/**
 * Kho lá số CHÍNH (snake_case): form `birth-data-form`, `/decisions/new` và
 * trang account đều ghi vào đây. (`hieu:profile:v1` của saved-profile chỉ được
 * ghi bởi luồng rectify giờ sinh — dùng làm fallback.)
 */
const CHART_PROFILE_KEY = 'hieu:chart:profile:v1';

export interface LoTrinhChartProps {
  /** Topic slug forwarded to /decisions/new?topic=… (must be a value the
   *  decisions form accepts — career | relationship | finance | family | general). */
  topic: string;
  /** Vietnamese palace names to surface, e.g. ['Quan Lộc','Tài Bạch']. */
  focusPalaces: string[];
  /** Optional heading override. */
  heading?: string;
}

/** Parse "HH:MM" → 0–23 hour. Falls back to 12 on bad input. */
function parseHour(raw: string): number {
  const m = /^(\d{1,2})/.exec(raw.trim());
  if (!m || !m[1]) return 12;
  const h = Number(m[1]);
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : 12;
}

/** Birth year from "YYYY-MM-DD". Returns null on parse failure. */
function birthYearOf(birthDate: string): number | null {
  const m = /^(\d{4})-/.exec(birthDate);
  if (!m || !m[1]) return null;
  const y = Number(m[1]);
  return Number.isFinite(y) ? y : null;
}

/**
 * Đọc lá số đã lưu → input để cast. Ưu tiên kho CHÍNH (`hieu:chart:profile:v1`,
 * snake_case — nơi form/decisions/account ghi); nếu trống thì thử kho rectify
 * (`hieu:profile:v1`, camelCase). Trả null nếu thiếu ngày/giờ/giới hợp lệ.
 */
function readChartInput(): CastChartInput | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CHART_PROFILE_KEY);
    if (raw) {
      const o = JSON.parse(raw) as Record<string, unknown>;
      const bd = typeof o.birth_date === 'string' ? o.birth_date : '';
      const bt = typeof o.birth_time === 'string' ? o.birth_time : '';
      const g = o.gender === 'female' ? 'female' : o.gender === 'male' ? 'male' : '';
      if (bd && bt && g && /^\d{4}-\d{1,2}-\d{1,2}$/.test(bd)) {
        return { birthSolarDate: bd, birthHour: parseHour(bt), gender: g, language: 'vi-VN' };
      }
    }
  } catch {
    /* malformed JSON → fall through to legacy store */
  }
  const p = readSavedProfile();
  if (isProfileComplete(p) && p?.birthDate && p.birthTime && p.gender) {
    return {
      birthSolarDate: p.birthDate,
      birthHour: parseHour(p.birthTime),
      gender: p.gender,
      language: 'vi-VN',
    };
  }
  return null;
}

type State =
  | { kind: 'loading' }
  | { kind: 'invite' }
  | { kind: 'chart'; chart: TuViChart; age: number | null };

function InviteCard({ topic, heading }: { topic: string; heading?: string }) {
  return (
    <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 sm:p-7">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
        <Stars className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-heading text-xl font-semibold text-foreground">
        {heading ?? 'Xem lộ trình theo lá số của bạn'}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Lộ trình ở trên là khung chung. Nhập ngày giờ sinh một lần, hệ thống sẽ
        đọc đúng các cung trọng tâm trên lá số của riêng bạn — dữ liệu tham khảo,
        không phải lời phán số mệnh.
      </p>
      <div className="mt-5">
        <Button asChild size="lg">
          <Link href={`/decisions/new?topic=${topic}`}>
            Lập lá số của tôi
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function LoTrinhChart({ topic, focusPalaces, heading }: LoTrinhChartProps) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const input = readChartInput();
    if (!input) {
      setState({ kind: 'invite' });
      return;
    }

    const year = birthYearOf(input.birthSolarDate);
    const age = year ? new Date().getFullYear() - year : null;

    castTuViChart(input)
      .then((chart) => {
        if (cancelled) return;
        setState({ kind: 'chart', chart, age });
      })
      .catch(() => {
        // Network / cast failure → degrade to invite, never break the page.
        if (!cancelled) setState({ kind: 'invite' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === 'loading') {
    return (
      <div
        className="rounded-xl border border-border bg-card/40 p-6 sm:p-7"
        aria-busy="true"
      >
        <p className="text-sm text-muted-foreground">Đang đọc lá số…</p>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    );
  }

  if (state.kind === 'invite') {
    return <InviteCard topic={topic} heading={heading} />;
  }

  // state.kind === 'chart'
  const { chart, age } = state;

  const rows: { palace: TuViPalace; stars: string[] }[] = focusPalaces
    .map((name) => findPalaceByName(chart, name))
    .filter((p): p is TuViPalace => p !== null)
    .map((p) => ({
      palace: p,
      stars: p.majorStars.map((s) => s.name).filter(Boolean),
    }));

  // Current đại vận = palace whose decadal.range [start, end] contains current age.
  const currentDecadal =
    age !== null
      ? chart.palaces.find(
          (p) =>
            p.decadal &&
            p.decadal.range.length === 2 &&
            age >= p.decadal.range[0]! &&
            age <= p.decadal.range[1]!,
        ) ?? null
      : null;

  return (
    <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 sm:p-7">
      <div className="mb-1 flex items-center gap-2.5">
        <Sparkles className="h-5 w-5 text-gold" aria-hidden />
        <h3 className="font-heading text-xl font-semibold text-foreground">
          {heading ?? 'Lộ trình theo lá số của bạn'}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Dữ liệu tham khảo từ chính lá số của bạn — không phải lời phán số mệnh.
      </p>

      {currentDecadal && (
        <p className="mt-4 text-sm text-foreground/85">
          <span className="font-semibold text-foreground">Đại vận hiện tại:</span>{' '}
          cung {currentDecadal.name}
          {currentDecadal.decadal && (
            <>
              {' '}
              ({currentDecadal.decadal.range[0]}–{currentDecadal.decadal.range[1]} tuổi)
            </>
          )}
        </p>
      )}

      {rows.length > 0 ? (
        <ul className="mt-4 space-y-2.5">
          {rows.map(({ palace, stars }) => (
            <li
              key={palace.name}
              className="flex flex-wrap items-baseline gap-x-2 text-sm leading-relaxed"
            >
              <span className="font-semibold text-foreground">Cung {palace.name}:</span>
              <span className="text-muted-foreground">
                {stars.length > 0 ? stars.join(' · ') : 'Vô chính diệu (không có chính tinh)'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Không đọc được cung trọng tâm từ lá số này. Bạn có thể mở lộ trình đầy đủ
          để xem chi tiết.
        </p>
      )}

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Đây là vài cung nổi bật liên quan tới chủ đề này. Lộ trình đầy đủ sẽ luận
        giải sâu hơn theo đúng lá số của bạn.
      </p>

      <div className="mt-5">
        <Button asChild size="lg">
          <Link href={`/decisions/new?topic=${topic}`}>
            Xem lộ trình đầy đủ theo lá số
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}
