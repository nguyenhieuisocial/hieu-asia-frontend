'use client';

/**
 * Tra hướng ngồi bàn làm việc / bàn học hợp tuổi — tính NGAY trên client từ
 * deskDirections (grounded: computeHuongNha Bát Trạch). Không phụ thuộc thời
 * gian nên trang SSG không stale.
 */
import * as React from 'react';
import {
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
import { deskDirections, type DeskDirections, type Gender } from '@/lib/huong-ban-data';
import { STAR_INFO } from '@/lib/huong-nha';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { track } from '@/lib/analytics';

function parseYear(value: string): number | null {
  const y = Number(value);
  return Number.isInteger(y) && y >= 1930 && y <= 2025 ? y : null;
}

function DirRow({
  direction,
  starName,
  blurb,
  good,
}: {
  direction: string;
  starName: string;
  blurb: string;
  good: boolean;
}) {
  return (
    <li className="flex flex-col gap-0.5 rounded-lg border border-border bg-card/40 p-3 sm:flex-row sm:items-baseline sm:gap-3">
      <div className="flex shrink-0 items-baseline gap-2 sm:w-44">
        <span className="font-semibold text-foreground">{direction}</span>
        <span
          className={
            good
              ? 'text-sm text-emerald-700 dark:text-emerald-300'
              : 'text-sm text-rose-700 dark:text-rose-300'
          }
        >
          {starName}
        </span>
      </div>
      <span className="text-sm leading-relaxed text-muted-foreground">{blurb}</span>
    </li>
  );
}

export function DeskDirectionChecker({
  defaultYear,
  defaultGender = 'nam',
}: {
  defaultYear?: number;
  defaultGender?: Gender;
} = {}) {
  const [yearValue, setYearValue] = React.useState(defaultYear ? String(defaultYear) : '');
  const [gender, setGender] = React.useState<Gender>(defaultGender);

  const year = parseYear(yearValue);
  const result = React.useMemo<DeskDirections | null>(
    () => (year ? deskDirections(year, gender) : null),
    [year, gender],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra hướng ngồi bàn làm việc / bàn học hợp tuổi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="hbYear">Năm sinh (dương lịch)</Label>
            <Input
              id="hbYear"
              type="number"
              inputMode="numeric"
              placeholder="Ví dụ: 1990"
              value={yearValue}
              onChange={(e) => setYearValue(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hbGender">Giới tính</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger id="hbGender">
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
            Nhập năm sinh (dương lịch) và giới tính để biết bạn nên ngồi quay mặt về hướng nào khi làm
            việc và khi học — theo Bát Trạch (cung phi).
          </p>
        )}

        {result && (
          <div className="space-y-5">
            <div className="rounded-lg border bg-card/40 p-4">
              <p className="text-sm text-muted-foreground">
                Bạn sinh năm <strong className="text-foreground">{result.year}</strong> (
                {gender === 'nam' ? 'nam' : 'nữ'}) thuộc{' '}
                <strong className="text-gold">cung {result.cungPhi}</strong> —{' '}
                <strong className="text-foreground">
                  {result.group === 'Đông' ? 'Đông tứ mệnh' : 'Tây tứ mệnh'}
                </strong>
                .
              </p>
            </div>

            {/* 2 gợi ý chính: làm việc & học */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Ngồi làm việc — quay mặt về
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">{result.workDir.direction}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Hướng {STAR_INFO[result.workDir.star].name} — chủ công danh, tài lộc, thăng tiến.
                </p>
              </div>
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/[0.06] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                  Ngồi học — quay mặt về
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">{result.studyDir.direction}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Hướng {STAR_INFO[result.studyDir.star].name} — chủ ổn định, tĩnh tâm, tập trung.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
                4 hướng tốt (nên quay mặt về — xếp theo mức tốt)
              </h3>
              <ul className="mt-2 space-y-1.5">
                {result.good.map((d) => (
                  <DirRow
                    key={d.direction}
                    direction={d.direction}
                    starName={STAR_INFO[d.star].name}
                    blurb={STAR_INFO[d.star].blurb}
                    good
                  />
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-rose-700 dark:text-rose-300">
                4 hướng nên tránh ngồi quay mặt về
              </h3>
              <ul className="mt-2 space-y-1.5">
                {result.bad.map((d) => (
                  <DirRow
                    key={d.direction}
                    direction={d.direction}
                    starName={STAR_INFO[d.star].name}
                    blurb={STAR_INFO[d.star].blurb}
                    good={false}
                  />
                ))}
              </ul>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Bát Trạch (hướng theo cung phi) là <strong>tập tục phong thủy</strong> để tham khảo,
              không phải quy luật khoa học. Với bàn làm việc/học, người ta xét hướng người ngồi quay{' '}
              <strong>mặt</strong> về (hướng nhìn). Quan trọng hơn cả là bàn đủ sáng, lưng có điểm
              tựa, không bị lối đi sau lưng — chúng tôi nêu rõ quy tắc để bạn tự cân nhắc, không phán
              thành bại và không bán &ldquo;hóa giải&rdquo;.
            </p>

            <DownloadToolPdfButton
              source="pdf-huong-ban"
              payload={() => {
                if (!result) return null;
                return {
                  title: 'Hướng bàn làm việc / bàn học hợp tuổi — hieu.asia',
                  subtitle: `Sinh năm ${result.year} (${result.gender === 'nam' ? 'nam' : 'nữ'}) · Bát Trạch theo cung phi`,
                  hero: {
                    big: `Làm việc: quay mặt về ${result.workDir.direction} · Học: ${result.studyDir.direction}`,
                    small: `Cung ${result.cungPhi} — ${result.group === 'Đông' ? 'Đông tứ mệnh' : 'Tây tứ mệnh'}.`,
                  },
                  sections: [
                    {
                      heading: '4 hướng tốt (nên quay mặt về)',
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
                      heading: 'Áp dụng cho bàn làm việc & bàn học',
                      text:
                        `Khi làm việc, nên ngồi quay mặt về ${result.workDir.direction} (hướng Sinh Khí — công danh, tài lộc).\n` +
                        `Khi học hoặc cần tập trung, quay mặt về ${result.studyDir.direction} (hướng Phục Vị — ổn định, tĩnh tâm).\n` +
                        'Nguyên tắc thực dụng đặt trên phong thủy: bàn đủ ánh sáng, lưng có tường/điểm tựa, ' +
                        'không quay lưng ra cửa hay lối đi, màn hình không chói. Đây là gợi ý tham khảo, không phải lời phán.',
                    },
                  ],
                };
              }}
            />

            <p className="text-[11px] text-muted-foreground">
              <button
                type="button"
                className="underline decoration-dotted underline-offset-2 hover:text-foreground"
                onClick={() => track('huong_ban_view_house', { cungPhi: result.cungPhi })}
              >
                Mẹo: cùng cung phi này áp dụng được cho hướng nhà, cửa, giường, bếp.
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
