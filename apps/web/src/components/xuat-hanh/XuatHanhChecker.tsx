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
} from '@hieu-asia/ui';
import { computeXuatHanh, type XuatHanhResult } from '@/lib/xuat-hanh';
import { getVietnamTodayISO } from '@/lib/vn-date';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';

function parseISO(value: string): { d: number; m: number; y: number } | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts as [number, number, number];
  return { d, m, y };
}

export function XuatHanhChecker() {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (!value) setValue(getVietnamTodayISO());
  }, [value]);

  const parsed = React.useMemo(() => parseISO(value), [value]);
  const result = React.useMemo<XuatHanhResult | null>(
    () => (parsed ? computeXuatHanh(parsed.d, parsed.m, parsed.y) : null),
    [parsed],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra hướng &amp; giờ xuất hành theo ngày</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="xhDate">Chọn ngày (dương lịch)</Label>
            <Input id="xhDate" type="date" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setValue(getVietnamTodayISO())}
            >
              Về hôm nay
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {parsed && (
                <>
                  Ngày{' '}
                  <strong className="text-foreground">
                    {parsed.d}/{parsed.m}/{parsed.y}
                  </strong>{' '}
                </>
              )}
              — ngày <strong className="text-foreground">{result.dayCanChi.label}</strong>.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Hướng Hỷ Thần — cầu may mắn
                </div>
                <div className="mt-1 font-heading text-2xl font-bold text-gold">{result.hyThan}</div>
              </div>
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Hướng Tài Thần — cầu tài lộc
                </div>
                <div className="mt-1 font-heading text-2xl font-bold text-gold">{result.taiThan}</div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/40 p-4">
              <div className="text-sm font-medium text-foreground">
                Giờ hoàng đạo (giờ tốt để xuất hành)
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.goodHours.map((h) => (
                  <span
                    key={h.branch}
                    className="rounded-full border border-emerald-300 bg-emerald-50/60 px-3 py-1 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200"
                  >
                    Giờ {h.branch} <span className="text-muted-foreground">({h.range})</span>
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Xem ý nghĩa &amp; sao chiếu từng canh giờ ở{' '}
                <Link href="/gio-hoang-dao" className="text-gold hover:underline">
                  Giờ hoàng đạo
                </Link>
                .
              </p>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Hỷ Thần / Tài Thần tính theo <strong>thiên can của ngày</strong> (chu kỳ 10 ngày), không
              phụ thuộc tuổi người đi — ai tra cũng ra như nhau. Hướng Tài Thần có vài phái tính khác
              nhau; ở đây dùng bản phổ biến trong lịch vạn niên Việt Nam. Đây là{' '}
              <strong>phong tục cầu may</strong> để tham khảo, không phải lời phán số mệnh — đi đúng hướng
              để bắt đầu ngày với tâm thế tích cực, không đi được cũng không sao.
            </p>

            <DownloadToolPdfButton
              source="pdf-xuat-hanh"
              payload={() => {
                if (!result || !parsed) return null;
                const dateLabel = `${parsed.d}/${parsed.m}/${parsed.y}`;
                const hours = result.goodHours
                  .map((h) => `Giờ ${h.branch} (${h.canChi}) — ${h.range}`)
                  .join('\n');
                return {
                  title: 'Hướng & giờ xuất hành',
                  subtitle: `Ngày ${dateLabel} — ${result.dayCanChi.label}`,
                  hero: { big: dateLabel, small: `Ngày ${result.dayCanChi.label}` },
                  sections: [
                    {
                      heading: 'Hướng xuất hành theo thiên can của ngày',
                      rows: [
                        { label: 'Hỷ Thần — cầu may mắn, hỉ sự', value: result.hyThan },
                        { label: 'Tài Thần — cầu tài lộc', value: result.taiThan },
                      ],
                    },
                    {
                      heading: 'Giờ hoàng đạo (giờ tốt để xuất hành)',
                      text:
                        hours.length > 0
                          ? hours
                          : 'Ngày này không có giờ hoàng đạo nổi bật để xuất hành.',
                    },
                    {
                      heading: 'Cách dùng',
                      text:
                        'Hỷ Thần / Tài Thần tính theo thiên can của ngày (chu kỳ 10 ngày), không phụ thuộc tuổi người đi — ai tra cũng ra như nhau. Hướng Tài Thần có vài phái tính khác nhau; ở đây dùng bản phổ biến trong lịch vạn niên Việt Nam.\n\nĐây là phong tục cầu may để tham khảo, không phải lời phán số mệnh — đi đúng hướng để bắt đầu ngày với tâm thế tích cực, không đi được cũng không sao.',
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
