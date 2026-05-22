'use client';

/**
 * Self-contained section that fetches a Tử Vi chart from `birth_date` +
 * `birth_time` + `gender` inputs and renders the interactive 12-palace grid.
 *
 * Used at the top of /reading/[id]/report so the user sees their actual chart
 * structure before reading the AI narrative.
 *
 * Defensive:
 *   - Returns null when inputs are insufficient (no birth date).
 *   - Renders a soft error card on fetch failure — never crashes the report.
 *   - Cache-keyed on birth inputs, so revisiting is instant.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { TuViChart12Palaces } from './TuViChart12Palaces';
import { castTuViChart, type CastChartInput } from '@/lib/tuvi-client';

export interface TuViChartSectionProps {
  birthDate?: string | null; // YYYY-MM-DD
  birthTime?: string | null; // HH:MM (24h)
  gender?: string | null;
}

/**
 * Parse a "HH:MM" or "HH:MM:SS" string to an integer hour 0–23.
 * Returns 12 (noon) when missing — explicitly noted as "low confidence" later.
 */
function parseHour(raw: string | null | undefined): { hour: number; hasTime: boolean } {
  if (!raw) return { hour: 12, hasTime: false };
  const m = /^(\d{1,2})(?::\d{1,2})?/.exec(raw.trim());
  if (!m || !m[1]) return { hour: 12, hasTime: false };
  const h = Number(m[1]);
  if (!Number.isFinite(h) || h < 0 || h > 23) return { hour: 12, hasTime: false };
  return { hour: h, hasTime: true };
}

/**
 * Normalize a Vietnamese gender string to the worker's enum.
 */
function normalizeGender(raw: string | null | undefined): 'male' | 'female' {
  if (!raw) return 'male';
  const v = raw.toLowerCase().trim();
  if (v === 'nữ' || v === 'nu' || v === 'female' || v === 'f') return 'female';
  return 'male';
}

export function TuViChartSection({
  birthDate,
  birthTime,
  gender,
}: TuViChartSectionProps) {
  // Compute inputs first; useQuery must always be called for hook-order safety.
  const isValid = !!birthDate && /^\d{4}-\d{1,2}-\d{1,2}$/.test(birthDate);
  const parsed = parseHour(birthTime);
  const input: CastChartInput = {
    birthSolarDate: birthDate ?? '',
    birthHour: parsed.hour,
    gender: normalizeGender(gender),
    language: 'vi-VN',
  };

  // useQuery handles caching, error states, and re-fetches; localStorage cache
  // inside castTuViChart() makes the second visit instant.
  const query = useQuery({
    queryKey: ['tuvi', 'v2', input.birthSolarDate, input.birthHour, input.gender],
    queryFn: () => castTuViChart(input),
    retry: 1,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    enabled: isValid,
  });

  // Skip entirely if no birth date — chart cannot be computed.
  if (!isValid) return null;

  if (query.isLoading) {
    return (
      <Card className="border-gold/15 bg-card/40">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold"
            />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Đang dựng lá số 12 cung…
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-muted/5" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Card className="border-amber-700/40 bg-amber-900/10">
        <CardContent className="flex items-start gap-3 pt-6 text-sm leading-relaxed text-amber-100/90">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
          <div>
            <p className="font-semibold text-amber-100">
              Chưa dựng được lá số 12 cung từ dữ liệu này.
            </p>
            <p className="mt-1 text-amber-100/80">
              Báo cáo văn bản phía dưới vẫn dùng được. Để xem chart tương tác, hãy
              kiểm tra lại ngày–giờ sinh ở phần Cài đặt.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/80">
            Lá số 12 cung · Bắc phái 114 sao
          </p>
          <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Bản đồ thiên hướng của bạn
          </h2>
        </div>
        {!parsed.hasTime && (
          <p className="inline-flex items-center gap-1.5 rounded-md border border-amber-700/40 bg-amber-900/10 px-3 py-1.5 text-xs text-amber-200">
            <AlertTriangle className="h-3 w-3" aria-hidden /> Không có giờ sinh — kết quả dùng giờ Ngọ mặc định, độ chính xác thấp.
          </p>
        )}
      </div>

      <TuViChart12Palaces chart={query.data} initialPalaceIndex={0} />

      <Card className="border-border bg-card/40">
        <CardContent className="flex items-start gap-3 pt-5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden />
          <p>
            Đây là phần cấu trúc lá số do hệ thống an theo trường phái Bắc phái 114 sao
            (deterministic, không phải AI sinh). Phần luận giải bằng văn bản phía dưới
            được AI Mentor tạo dựa trên chart này — bấm từng cung để thấy bộ sao + tam
            phương tứ chính.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
