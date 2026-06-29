'use client';

import * as React from 'react';
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
import {
  computeHuongNha,
  groupLabel,
  STAR_INFO,
  type Gender,
  type HuongNhaResult,
} from '@/lib/huong-nha';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { track } from '@/lib/analytics';

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1930 && y <= 2025 ? y : null;
}

function DirRow({ direction, starName, blurb, good }: { direction: string; starName: string; blurb: string; good: boolean }) {
  return (
    <li className="flex flex-col gap-0.5 rounded-lg border border-border bg-card/40 p-3 sm:flex-row sm:items-baseline sm:gap-3">
      <div className="flex shrink-0 items-baseline gap-2 sm:w-44">
        <span className="font-semibold text-foreground">{direction}</span>
        <span className={good ? 'text-sm text-emerald-700 dark:text-emerald-300' : 'text-sm text-rose-700 dark:text-rose-300'}>
          {starName}
        </span>
      </div>
      <span className="text-sm leading-relaxed text-muted-foreground">{blurb}</span>
    </li>
  );
}

export function HuongNhaChecker({
  defaultYear,
  defaultGender = 'nam',
}: {
  defaultYear?: number;
  defaultGender?: Gender;
} = {}) {
  const [yearValue, setYearValue] = React.useState(defaultYear ? String(defaultYear) : '');
  const [gender, setGender] = React.useState<Gender>(defaultGender);
  const [reportInterest, setReportInterest] = React.useState(false);

  const year = parseYear(yearValue);
  const result = React.useMemo<HuongNhaResult | null>(
    () => (year ? computeHuongNha(year, gender) : null),
    [year, gender],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra hướng nhà hợp tuổi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="hnYear">Năm sinh (dương lịch)</Label>
            <Input
              id="hnYear"
              type="number"
              inputMode="numeric"
              placeholder="Ví dụ: 1990"
              value={yearValue}
              onChange={(e) => setYearValue(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hnGender">Giới tính</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger id="hnGender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nam">Nam</SelectItem>
                <SelectItem value="nu">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!result && (
          <p className="text-sm text-muted-foreground">
            Nhập năm sinh (dương lịch) và giới tính của gia chủ để xem mệnh quái (cung phi) và 4 hướng
            tốt — 4 hướng nên tránh, kèm hướng nên đặt cửa chính, giường, bếp.
          </p>
        )}

        {result && (
          <div className="space-y-5">
            <div className="rounded-lg border bg-card/40 p-4">
              <p className="text-sm text-muted-foreground">
                Gia chủ sinh năm <strong className="text-foreground">{result.year}</strong> ({gender === 'nam' ? 'nam' : 'nữ'}) thuộc{' '}
                <strong className="text-gold">cung {result.cungPhi}</strong> —{' '}
                <strong className="text-foreground">{groupLabel(result.group)}</strong>.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {result.group === 'Đông'
                  ? 'Đông tứ mệnh hợp 4 hướng: Bắc, Đông, Đông Nam, Nam.'
                  : 'Tây tứ mệnh hợp 4 hướng: Tây, Tây Bắc, Tây Nam, Đông Bắc.'}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                4 hướng tốt (xếp theo mức tốt)
              </h3>
              <ul className="mt-2 space-y-1.5">
                {result.good.map((d) => (
                  <DirRow key={d.direction} direction={d.direction} starName={STAR_INFO[d.star].name} blurb={STAR_INFO[d.star].blurb} good />
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-rose-700 dark:text-rose-300">
                4 hướng nên tránh
              </h3>
              <ul className="mt-2 space-y-1.5">
                {result.bad.map((d) => (
                  <DirRow key={d.direction} direction={d.direction} starName={STAR_INFO[d.star].name} blurb={STAR_INFO[d.star].blurb} good={false} />
                ))}
              </ul>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Bát Trạch (hướng nhà theo cung phi) là <strong>tập tục phong thủy</strong> để tham khảo,
              không phải quy luật khoa học. &ldquo;Hướng nhà&rdquo; thường tính theo hướng lưng nhà (tọa)
              hoặc hướng cửa chính — tùy trường phái. Chúng tôi nêu rõ quy tắc để bạn tự cân nhắc, không
              phán giàu nghèo và không bán &ldquo;hóa giải&rdquo;.
            </p>

            <div className="rounded-xl border border-gold/30 bg-gold/[0.04] p-4">
              {reportInterest ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">
                    Để lại email — chúng tôi báo bạn khi có bản đầy đủ 🌱
                  </div>
                  <OccasionLeadCapture
                    source="occasion:huong-nha"
                    capturedEvent="huong_nha_lead_captured"
                    capturedProps={{ cungPhi: result.cungPhi, group: result.group }}
                    blurb="Bản đầy đủ sẽ gợi ý bố trí cửa chính, giường, bếp, bàn làm việc theo mệnh cả nhà — kèm cách chọn hướng khi nhà có sẵn. Để email, chúng tôi gửi bạn khi ra mắt."
                    cta="Báo tôi khi có"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Cần bố trí chi tiết cho cả nhà?</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Bản đầy đủ sẽ phối hướng hợp <strong>cả vợ chồng</strong>, gợi ý đặt cửa, giường,
                      bếp, bàn thờ theo từng phòng — vẫn là tham khảo, không phán số mệnh.
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setReportInterest(true);
                      track('huong_nha_report_intent', { cungPhi: result.cungPhi, group: result.group });
                    }}
                  >
                    Tôi quan tâm
                  </Button>
                </div>
              )}
            </div>

            <DownloadToolPdfButton
              source="pdf-huong-nha"
              payload={() => {
                if (!result) return null;
                const groupHint =
                  result.group === 'Đông'
                    ? 'Đông tứ mệnh hợp 4 hướng: Bắc, Đông, Đông Nam, Nam.'
                    : 'Tây tứ mệnh hợp 4 hướng: Tây, Tây Bắc, Tây Nam, Đông Bắc.';
                return {
                  title: 'Xem Hướng Nhà hợp tuổi — hieu.asia',
                  subtitle: `Gia chủ sinh năm ${result.year} (${result.gender === 'nam' ? 'nam' : 'nữ'}) · Bát Trạch theo cung phi`,
                  hero: {
                    big: `Cung ${result.cungPhi} — ${groupLabel(result.group)}`,
                    small: groupHint,
                  },
                  sections: [
                    {
                      heading: '4 hướng tốt (xếp theo mức tốt)',
                      rows: result.good.map((d) => {
                        const info = STAR_INFO[d.star];
                        return { label: `${d.direction} — ${info.name}`, value: info.blurb };
                      }),
                    },
                    {
                      heading: '4 hướng nên tránh',
                      rows: result.bad.map((d) => {
                        const info = STAR_INFO[d.star];
                        return { label: `${d.direction} — ${info.name}`, value: info.blurb };
                      }),
                    },
                    {
                      heading: 'Áp dụng cho cửa chính, giường, bếp',
                      text: `Cửa chính nên mở về một trong các hướng tốt — ưu tiên ${result.good[0]?.direction ?? 'hướng Sinh Khí'} (Sinh Khí) hoặc ${result.good[1]?.direction ?? 'hướng Thiên Y'} (Thiên Y).\nGiường ngủ nên đặt đầu giường quay về hướng tốt, hợp nhất là ${result.good[1]?.direction ?? 'hướng Thiên Y'} (Thiên Y) hoặc ${result.good[2]?.direction ?? 'hướng Diên Niên'} (Diên Niên) cho sức khỏe và hòa hợp.\nBếp theo quan niệm "tọa hung hướng cát": đặt ở vùng hướng xấu nhưng mặt bếp (người nấu nhìn về) quay về hướng tốt — thường là ${result.good[0]?.direction ?? 'hướng Sinh Khí'} (Sinh Khí).\nNên tránh đặt cửa, giường, bếp về ${result.bad[0]?.direction ?? 'hướng Tuyệt Mệnh'} (${result.bad[0] ? STAR_INFO[result.bad[0].star].name : 'Tuyệt Mệnh'}) nếu còn lựa chọn tốt hơn.`,
                    },
                    {
                      heading: 'Lưu ý',
                      text: 'Bát Trạch (hướng nhà theo cung phi) là tập tục phong thủy để tham khảo, không phải quy luật khoa học. "Hướng nhà" thường tính theo hướng lưng nhà (tọa) hoặc hướng cửa chính — tùy trường phái. Đây là gợi ý để bạn tự cân nhắc; chúng tôi không phán giàu nghèo và không bán "hóa giải".',
                    },
                  ],
                };
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
