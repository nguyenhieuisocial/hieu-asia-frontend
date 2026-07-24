'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Skeleton } from '@hieu-asia/ui';
import { type VanNienMonthDayDTO } from '@/components/lich-van-nien/CalendarMonth';
import { safeJson } from '@/lib/safe-json';
import { getVietnamDateParts } from '@/lib/vn-date';
import { describeApiError } from '@/lib/api-error';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import { LICH_HOW_TO_USE, LICH_DISCLAIMER } from '@/lib/tai-lieu/lich-ngay-tot';

/**
 * LichNgayTotBuilder — dựng tài liệu "Lịch ngày tốt tháng này".
 *
 * Lấy đúng dữ liệu engine Lịch Vạn Niên đang chạy ở /lich-van-nien/today
 * (POST /tools/lich-van-nien/month) rồi đóng gói cả tháng thành một bảng PDF
 * mang về. Mặc định là THÁNG HIỆN TẠI theo giờ Việt Nam; đổi tháng được nếu
 * người dùng muốn chuẩn bị trước.
 *
 * Không viết lại phép tính lịch pháp ở đây — chỉ trình bày lại kết quả engine.
 */

function getApiBase(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'https://api.hieu.asia';
}

const MONTH_NAMES = [
  'tháng 1',
  'tháng 2',
  'tháng 3',
  'tháng 4',
  'tháng 5',
  'tháng 6',
  'tháng 7',
  'tháng 8',
  'tháng 9',
  'tháng 10',
  'tháng 11',
  'tháng 12',
];

function dayLabel(d: VanNienMonthDayDTO, month: number): string {
  return `${d.weekday} ${String(d.solarDay).padStart(2, '0')}/${String(month).padStart(2, '0')} · âm ${d.lunarDay}/${d.lunarMonth}${d.isLeap ? ' (nhuận)' : ''}`;
}

function dayValue(d: VanNienMonthDayDTO): string {
  const tone = d.isHoangDao ? 'Hoàng đạo' : d.isHacDao ? 'Hắc đạo' : 'Bình thường';
  return `${tone} · ngày ${d.canChiDay} · trực ${d.trucNgay}${d.dayStar ? ` · sao ${d.dayStar}` : ''}`;
}

export function LichNgayTotBuilder() {
  const t = getVietnamDateParts();
  const [year, setYear] = React.useState(t.year);
  const [month, setMonth] = React.useState(t.month);
  const [days, setDays] = React.useState<VanNienMonthDayDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/tools/lich-van-nien/month`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ year, month }),
        });
        const parsed = await safeJson<{ ok: boolean; days?: VanNienMonthDayDTO[] }>(res);
        if (cancelled) return;
        if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
        if (!parsed.data.ok || !parsed.data.days) throw new Error('Không lấy được dữ liệu tháng');
        setDays(parsed.data.days);
      } catch (e) {
        if (!cancelled) {
          setDays([]);
          setError(describeApiError(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const hoangDao = days.filter((d) => d.isHoangDao);
  const hacDao = days.filter((d) => d.isHacDao);

  const buildPayload = (): ToolPdfPayload | null => {
    if (days.length === 0) return null;
    const monthLabel = `${MONTH_NAMES[month - 1]}/${year}`;
    return {
      title: `Lịch ngày tốt ${monthLabel}`,
      subtitle: 'Tài liệu tặng của hieu.asia — tính bằng engine Lịch Vạn Niên',
      hero: {
        big: `${hoangDao.length} ngày Hoàng đạo trong ${monthLabel}`,
        small: `${days.length} ngày · ${hacDao.length} ngày Hắc đạo · giờ Việt Nam (UTC+7)`,
      },
      sections: [
        {
          heading: `Ngày Hoàng đạo trong ${monthLabel}`,
          rows: hoangDao.map((d) => ({ label: dayLabel(d, month), value: dayValue(d) })),
        },
        {
          heading: `Ngày nên thận trọng (Hắc đạo) trong ${monthLabel}`,
          rows: hacDao.map((d) => ({ label: dayLabel(d, month), value: dayValue(d) })),
        },
        {
          heading: `Toàn bộ ${monthLabel}`,
          rows: days.map((d) => ({ label: dayLabel(d, month), value: dayValue(d) })),
        },
        {
          heading: 'Cách dùng bảng này',
          text: LICH_HOW_TO_USE.map((s, i) => `${i + 1}. ${s}`).join('\n'),
        },
        { heading: 'Giới hạn của tài liệu này', text: LICH_DISCLAIMER },
      ],
      cta: { text: 'Xem ngày tốt theo mục đích tại hieu.asia', url: 'https://hieu.asia/xem-ngay' },
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn tháng bạn muốn xem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid max-w-sm gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="tlYear">Năm</Label>
            <Input
              id="tlYear"
              type="number"
              inputMode="numeric"
              min={1900}
              max={2199}
              value={year}
              onChange={(e) => setYear(Number(e.target.value) || t.year)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tlMonth">Tháng</Label>
            <Input
              id="tlMonth"
              type="number"
              inputMode="numeric"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
            />
          </div>
        </div>

        {loading && <Skeleton className="h-40 w-full" />}

        {error && !loading && (
          <p role="status" className="text-sm text-amber-700 dark:text-amber-400">
            Chưa lấy được lịch tháng này: {error}. Bạn thử lại sau ít phút, hoặc xem trực tiếp ở
            trang Lịch Vạn Niên.
          </p>
        )}

        {!loading && !error && days.length > 0 && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
                <p className="text-sm font-medium text-foreground">
                  {hoangDao.length} ngày Hoàng đạo
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {hoangDao.map((d) => d.solarDay).join(', ') || 'không có'}
                </p>
              </div>
              <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                <p className="text-sm font-medium text-foreground">
                  {hacDao.length} ngày nên thận trọng
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {hacDao.map((d) => d.solarDay).join(', ') || 'không có'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <caption className="sr-only">
                  Bảng ngày {MONTH_NAMES[month - 1]}/{year}: ngày dương, ngày âm, can chi, trực và
                  tính chất Hoàng đạo hay Hắc đạo
                </caption>
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Ngày
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Âm lịch
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Can chi
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Trực
                    </th>
                    <th scope="col" className="py-2 font-medium">
                      Tính chất
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((d) => (
                    <tr key={d.solarDay} className="border-b border-border/50">
                      <td className="py-1.5 pr-3 text-foreground">
                        {d.weekday} {d.solarDay}
                      </td>
                      <td className="py-1.5 pr-3 text-muted-foreground">
                        {d.lunarDay}/{d.lunarMonth}
                        {d.isLeap ? ' (nhuận)' : ''}
                      </td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{d.canChiDay}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{d.trucNgay}</td>
                      <td className="py-1.5 text-muted-foreground">
                        {d.isHoangDao ? 'Hoàng đạo' : d.isHacDao ? 'Hắc đạo' : 'Bình thường'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-gold/25 bg-gold/[0.04] p-4">
              <p className="text-sm font-medium text-foreground">Tải bảng này về máy</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Bản PDF gồm: danh sách ngày Hoàng đạo, ngày nên thận trọng, bảng đầy đủ cả tháng
                và phần cách dùng. Để lại email, chúng tôi gửi thẳng vào hộp thư — không spam,
                huỷ bất cứ lúc nào.
              </p>
              <div className="mt-3">
                <DownloadToolPdfButton
                  source="pdf-tai-lieu-lich-thang"
                  label="Nhận bản PDF"
                  payload={buildPayload}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
