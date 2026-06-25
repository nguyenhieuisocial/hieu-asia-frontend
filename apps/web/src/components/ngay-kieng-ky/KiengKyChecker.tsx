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
  cn,
} from '@hieu-asia/ui';
import {
  checkKiengKy,
  kiengKyInSolarMonth,
  KIENG_KY_INFO,
  type KiengKyKey,
} from '@/lib/ngay-kieng-ky';
import { getVietnamTodayISO } from '@/lib/vn-date';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';

const HIT_BADGE: Record<KiengKyKey, string> = {
  tam_nuong:
    'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  nguyet_ky:
    'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  duong_cong:
    'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  nguyet_tan:
    'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-300',
};

function parseISO(value: string): { d: number; m: number; y: number } | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts as [number, number, number];
  return { d, m, y };
}

export function KiengKyChecker() {
  // Để trống khi render trên máy chủ, set "hôm nay" theo GIỜ VIỆT NAM (không
  // phụ thuộc đồng hồ thiết bị) sau khi mount → tránh lệch ngày.
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (!value) setValue(getVietnamTodayISO());
  }, [value]);

  const parsed = React.useMemo(() => parseISO(value), [value]);
  const result = React.useMemo(
    () => (parsed ? checkKiengKy(parsed.d, parsed.m, parsed.y) : null),
    [parsed],
  );
  const monthList = React.useMemo(
    () => (parsed ? kiengKyInSolarMonth(parsed.y, parsed.m) : []),
    [parsed],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra ngày kiêng kỵ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="kkDate">Chọn ngày (dương lịch)</Label>
            <Input
              id="kkDate"
              type="date"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
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
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ngày{' '}
              <strong className="text-foreground">
                {result.solar.day}/{result.solar.month}/{result.solar.year}
              </strong>{' '}
              dương lịch — tức{' '}
              <strong className="text-foreground">
                ngày {result.lunar.day} tháng {result.lunar.month}
                {result.lunar.leap ? ' (nhuận)' : ''} âm lịch
              </strong>
              .
            </p>

            {result.hits.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Ngày này được xem là:</span>
                  {result.hits.map((k) => (
                    <span
                      key={k}
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        HIT_BADGE[k],
                      )}
                    >
                      {KIENG_KY_INFO[k].name}
                    </span>
                  ))}
                </div>
                {result.hits.map((k) => {
                  const info = KIENG_KY_INFO[k];
                  return (
                    <div key={k} className="rounded-lg border bg-card/40 p-4">
                      <div className="font-medium text-foreground">{info.name}</div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {info.summary}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">Gợi ý: </span>
                        {info.advice}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
                Ngày này <strong>không</strong> rơi vào các ngày kiêng kỵ phổ biến (Tam Nương,
                Nguyệt Kỵ, Dương Công Kỵ Nhật). Bạn có thể yên tâm cho các việc thường ngày.
              </div>
            )}

            {monthList.length > 0 && (
              <div className="rounded-md border bg-card/40 p-3 text-sm">
                <div className="font-medium">
                  Các ngày kiêng kỵ trong tháng {result.solar.month}/{result.solar.year} (dương lịch)
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                  {monthList.map((r) => (
                    <span
                      key={r.solar.day}
                      className={cn(
                        'tabular-nums',
                        r.solar.day === result.solar.day && 'font-semibold text-foreground',
                      )}
                    >
                      <span className="text-muted-foreground">
                        {r.solar.day}/{r.solar.month}
                      </span>{' '}
                      {r.hits.map((k) => KIENG_KY_INFO[k].name).join(', ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là cách tra cứu theo phong tục dân gian, mang tính <strong>tham khảo</strong> —
              không phải lời phán số mệnh. Ngày kiêng chủ yếu để cân nhắc với việc trọng đại (cưới
              hỏi, khai trương, động thổ, đi xa); việc thường ngày không cần kiêng. Sự chuẩn bị kỹ
              và cái tâm khi làm việc vẫn là điều quan trọng nhất.
            </p>

            <div className="pt-1">
              <DownloadToolPdfButton
                source="pdf-ngay-kieng-ky"
                payload={() => {
                  if (!result) return null;
                  const dateStr = `${result.solar.day}/${result.solar.month}/${result.solar.year}`;
                  const lunarStr = `ngày ${result.lunar.day} tháng ${result.lunar.month}${
                    result.lunar.leap ? ' (nhuận)' : ''
                  } âm lịch`;
                  const hasHits = result.hits.length > 0;

                  const sections: ToolPdfPayload['sections'] = [];

                  // Đối chiếu từng loại ngày kiêng phổ biến — ngày này có rơi vào không.
                  sections.push({
                    heading: 'Đối chiếu các ngày kiêng kỵ phổ biến',
                    rows: (Object.keys(KIENG_KY_INFO) as KiengKyKey[]).map((k) => ({
                      label: KIENG_KY_INFO[k].name,
                      value: result.hits.includes(k) ? 'Có rơi vào' : 'Không',
                    })),
                  });

                  // Giải thích chi tiết các loại mà ngày này rơi vào.
                  for (const k of result.hits) {
                    const info = KIENG_KY_INFO[k];
                    sections.push({
                      heading: info.name,
                      text: `${info.summary}\n\nÁp dụng: ${info.days}\n\nGợi ý: ${info.advice}`,
                    });
                  }

                  // Các ngày kiêng kỵ khác trong cùng tháng dương lịch (nếu có).
                  if (monthList.length > 0) {
                    sections.push({
                      heading: `Các ngày kiêng kỵ trong tháng ${result.solar.month}/${result.solar.year} (dương lịch)`,
                      text: monthList
                        .map(
                          (r) =>
                            `${r.solar.day}/${r.solar.month}: ${r.hits
                              .map((k) => KIENG_KY_INFO[k].name)
                              .join(', ')}`,
                        )
                        .join('\n'),
                    });
                  }

                  // Ghi chú phong tục — tham khảo, không hù dọa.
                  sections.push({
                    heading: 'Lưu ý',
                    text: 'Đây là cách tra cứu theo phong tục dân gian, mang tính tham khảo — không phải lời phán số mệnh. Ngày kiêng chủ yếu để cân nhắc với việc trọng đại (cưới hỏi, khai trương, động thổ, đi xa); việc thường ngày không cần kiêng. Sự chuẩn bị kỹ và cái tâm khi làm việc vẫn là điều quan trọng nhất.',
                  });

                  return {
                    title: 'Tra ngày kiêng kỵ',
                    subtitle: `${dateStr} dương lịch — tức ${lunarStr}`,
                    hero: hasHits
                      ? {
                          big: 'Ngày có kiêng kỵ',
                          small: `Rơi vào: ${result.hits
                            .map((k) => KIENG_KY_INFO[k].name)
                            .join(', ')}`,
                        }
                      : {
                          big: 'Ngày thường',
                          small:
                            'Không rơi vào các ngày kiêng kỵ phổ biến (Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật).',
                        },
                    sections,
                  };
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
