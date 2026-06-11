'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hieu-asia/ui';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { yearProfile, type RelationTone } from '@/lib/sinh-con';
import {
  checkXongDat,
  topCandidates,
  DEFAULT_TARGET_YEAR,
  TARGET_YEARS,
  TIER_META,
  type XongDatResult,
} from '@/lib/xong-dat';
import { track } from '@/lib/analytics';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';

const TONE_CLASS: Record<RelationTone, string> = {
  hop: 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20',
  'luu-y': 'border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20',
  'trung-tinh': 'border-border bg-card/40',
};

const TONE_TEXT: Record<RelationTone, string> = {
  hop: 'text-emerald-700 dark:text-emerald-400',
  'luu-y': 'text-amber-700 dark:text-amber-400',
  'trung-tinh': 'text-muted-foreground',
};

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1900 && y <= 2100 ? y : null;
}

/** Các điểm cộng của 1 gợi ý — cho dòng tóm tắt trong thẻ. */
function plusLabels(r: XongDatResult): string {
  const labels = [r.chiNam, r.chiChu, r.menhChu].filter((a) => a.score > 0).map((a) => a.label);
  return labels.length ? labels.join(' · ') : 'Không phạm xung, hại';
}

function GuestDetail({ check }: { check: XongDatResult }) {
  const meta = TIER_META[check.tier];
  return (
    <div className={`rounded-md border p-3 ${TONE_CLASS[meta.tone]}`}>
      <div className="text-sm font-medium text-foreground">
        Người xông đất sinh {check.guest.year} — {check.guest.canChi}, tuổi{' '}
        {check.guest.zodiac.ten} <span aria-hidden="true">{check.guest.zodiac.emoji}</span> · mệnh{' '}
        {ELEMENTS[check.guest.element].name} ({check.guest.napAmName}) ·{' '}
        <span className={TONE_TEXT[meta.tone]}>{meta.label}</span>
      </div>
      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
        <li>{check.chiNam.text}</li>
        <li>{check.chiChu.text}</li>
        <li>{check.menhChu.text}</li>
      </ul>
    </div>
  );
}

export function XongDatChecker({ defaultHostYear }: { defaultHostYear?: number } = {}) {
  const [hostYear, setHostYear] = React.useState(defaultHostYear ? String(defaultHostYear) : '');
  const [targetYear, setTargetYear] = React.useState(String(DEFAULT_TARGET_YEAR));
  const [guestYear, setGuestYear] = React.useState('');
  const [reportInterest, setReportInterest] = React.useState(false);

  const target = React.useMemo(() => yearProfile(Number(targetYear)), [targetYear]);
  const host = React.useMemo(() => {
    const y = parseYear(hostYear);
    return y ? yearProfile(y) : null;
  }, [hostYear]);
  const top = React.useMemo(() => {
    const y = parseYear(hostYear);
    return y ? topCandidates(y, Number(targetYear), 8) : [];
  }, [hostYear, targetYear]);
  const guest = React.useMemo(() => {
    const g = parseYear(guestYear);
    const h = parseYear(hostYear);
    return g && h ? checkXongDat(g, h, Number(targetYear)) : null;
  }, [guestYear, hostYear, targetYear]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gợi ý tuổi xông đất theo năm sinh gia chủ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="xdHostYear">Năm sinh gia chủ (âm lịch)</Label>
            <Input
              id="xdHostYear"
              type="number"
              inputMode="numeric"
              placeholder="vd 1988"
              value={hostYear}
              onChange={(e) => setHostYear(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="xdTargetYear">Xông đất Tết năm</Label>
            <Select value={targetYear} onValueChange={setTargetYear}>
              <SelectTrigger id="xdTargetYear">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TARGET_YEARS.map((y) => {
                  const p = yearProfile(y);
                  return (
                    <SelectItem key={y} value={String(y)}>
                      {y} — {p?.canChi}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="xdGuestYear">Năm sinh người định mời (tuỳ chọn)</Label>
            <Input
              id="xdGuestYear"
              type="number"
              inputMode="numeric"
              placeholder="vd 1995"
              value={guestYear}
              onChange={(e) => setGuestYear(e.target.value)}
            />
          </div>
        </div>

        {host && target && (
          <div className="rounded-lg border bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">
              Gia chủ sinh năm <strong className="text-foreground">{host.year}</strong> —{' '}
              <strong className="text-foreground">
                {host.canChi}, tuổi {host.zodiac.ten}{' '}
                <span aria-hidden="true">{host.zodiac.emoji}</span>
              </strong>
              , mệnh{' '}
              <strong className="text-gold">
                {ELEMENTS[host.element].name} — {host.napAmName}
              </strong>
              . Đón Tết <strong className="text-foreground">{target.canChi}</strong> (mùng 1 năm{' '}
              {target.year}).
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Lưu ý: tuổi tính theo <strong>năm âm lịch</strong> — người sinh tháng 1–2 dương
              (trước Tết) thuộc năm âm liền trước.
            </p>
          </div>
        )}

        {guest && <GuestDetail check={guest} />}

        {host && top.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Top tuổi gợi ý xông đất Tết {target?.canChi} cho gia chủ {host.year}
            </h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {top.map((r) => {
                const meta = TIER_META[r.tier];
                return (
                  <div
                    key={r.guest.year}
                    className={`rounded-md border p-3 text-sm ${TONE_CLASS[meta.tone]}`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-foreground">
                        {r.guest.year} — {r.guest.canChi}{' '}
                        <span aria-hidden="true">{r.guest.zodiac.emoji}</span>
                      </span>
                      <span className={`shrink-0 ${TONE_TEXT[meta.tone]}`}>{meta.label}</span>
                    </div>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      Mệnh {ELEMENTS[r.guest.element].name} ({r.guest.napAmName}) ·{' '}
                      {plusLabels(r)}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Đây là <strong>gợi ý theo quan niệm Can Chi &amp; ngũ hành để tham khảo</strong> —
              cách chấm công khai ở mục bên dưới, nhập cùng dữ liệu luôn ra cùng kết quả. Người
              xông đất quý nhất vẫn là người vui vẻ, xởi lởi, thật lòng quý gia đình — không có
              chuyện "mời sai tuổi thì xui cả năm".
            </p>
          </div>
        )}

        {host && (
          <>
            <nav aria-label="Công cụ liên quan" className="text-sm">
              <span className="text-muted-foreground">Bước tiếp theo: </span>
              <Link href="/gio-hoang-dao" className="text-gold hover:underline">
                giờ hoàng đạo mùng 1
              </Link>
              <span className="text-muted-foreground">{' · '}</span>
              <Link href="/xem-ngay" className="text-gold hover:underline">
                xem ngày tốt khai xuân
              </Link>
              <span className="text-muted-foreground">{' · '}</span>
              <Link href="/hop-tuoi" className="text-gold hover:underline">
                xem hợp tuổi hai người
              </Link>
            </nav>

            {/* Hạt giống đo nhu cầu "cẩm nang đón Tết" — không backend, chỉ ghi ý định. */}
            <div className="rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
              {reportInterest ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    Để lại email — chúng tôi báo bạn khi có bản đầy đủ 🌱
                  </div>
                  <OccasionLeadCapture
                    source="occasion:xong-dat"
                    capturedEvent="xong_dat_lead_captured"
                    capturedProps={{ year: Number(targetYear) }}
                    blurb="Bản đầy đủ sẽ gộp tuổi xông đất hợp cả nhà, ngày giờ đẹp khai xuân và những mốc nên biết theo phong tục. Để email, chúng tôi gửi bạn khi ra mắt."
                    cta="Báo tôi khi có"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Cần cẩm nang đón Tết đầy đủ cho cả nhà?
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Bản đầy đủ sẽ gộp: tuổi xông đất hợp <strong>cả nhà</strong> (không chỉ gia
                      chủ), ngày giờ đẹp khai xuân, và những mốc nên biết theo phong tục. Vẫn là
                      tham khảo — không phán số mệnh.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setReportInterest(true);
                      track('xong_dat_report_intent', {
                        year: Number(targetYear),
                        guest_tier: guest?.tier ?? null,
                      });
                    }}
                  >
                    Tôi quan tâm
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
