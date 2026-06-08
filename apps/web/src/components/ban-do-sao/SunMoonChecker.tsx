'use client';

import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { computeSunMoonChart, type SignPosition, type SunMoonChart } from '@/lib/western-astrology';

function parseDate(value: string): { y: number; m: number; d: number } | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts as [number, number, number];
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return { y, m, d };
}

function parseTime(value: string): { h: number; min: number } {
  const parts = value.split(':').map(Number);
  if (parts.length < 2 || parts.some((n) => !Number.isFinite(n))) return { h: 12, min: 0 };
  return { h: parts[0] ?? 12, min: parts[1] ?? 0 };
}

function PositionCard({
  icon,
  title,
  subtitle,
  pos,
}: {
  icon: string;
  title: string;
  subtitle: string;
  pos: SignPosition;
}) {
  return (
    <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-gold/80">{title}</p>
          <p className="font-heading text-xl text-foreground">
            {pos.sign.symbol} {pos.sign.name}
          </p>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-muted-foreground">
          Hành: <span className="text-foreground">{pos.sign.element}</span>
        </span>
        <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-muted-foreground">
          Tính chất: <span className="text-foreground">{pos.sign.quality}</span>
        </span>
        <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 font-mono text-muted-foreground">
          {pos.degreeInSign.toFixed(1)}° trong cung
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/85">{pos.sign.blurb}</p>
      {pos.nearCusp && (
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          ⚠️ Sát ranh giới cung — nếu không chắc giờ sinh, cung này có thể lệch sang cung kề.
        </p>
      )}
    </div>
  );
}

export function SunMoonChecker() {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('12:00');

  const parsedDate = React.useMemo(() => parseDate(date), [date]);
  const chart = React.useMemo<SunMoonChart | null>(() => {
    if (!parsedDate) return null;
    const { h, min } = parseTime(time);
    return computeSunMoonChart({
      year: parsedDate.y,
      month: parsedDate.m,
      day: parsedDate.d,
      hour: h,
      minute: min,
      tzOffsetMinutes: 420, // giả định sinh tại VN (GMT+7)
    });
  }, [parsedDate, time]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập ngày & giờ sinh</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="smDate">Ngày sinh (dương lịch)</Label>
            <Input id="smDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="smTime">Giờ sinh</Label>
            <Input id="smTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Giả định sinh tại Việt Nam (GMT+7). Không nhớ giờ? Để <strong>12:00</strong> — cung Mặt Trời gần
          như không đổi, nhưng cung <strong>Mặt Trăng</strong> đổi nhanh theo giờ nên có thể lệch.
        </p>

        {!parsedDate && (
          <p className="text-sm text-muted-foreground">Chọn ngày sinh để xem cung Mặt Trời & Mặt Trăng.</p>
        )}

        {chart && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <PositionCard
                icon="☀️"
                title="Mặt Trời"
                subtitle="Bản ngã cốt lõi — cách bạn toả sáng & điều thật sự thúc đẩy bạn."
                pos={chart.sun}
              />
              <PositionCard
                icon="🌙"
                title="Mặt Trăng"
                subtitle="Thế giới cảm xúc — nhu cầu nội tâm & điều khiến bạn thấy an toàn."
                pos={chart.moon}
              />
            </div>

            <div className="rounded-lg border border-border bg-card/40 p-4">
              <p className="text-sm text-foreground/85">
                <strong>Mặt Trời {chart.sun.sign.name}</strong> &amp;{' '}
                <strong>Mặt Trăng {chart.moon.sign.name}</strong> — hai &ldquo;vầng sáng&rdquo; nền tảng của
                bản đồ sao. Mặt Trời là con người bạn thể hiện ra; Mặt Trăng là con người bạn cảm nhận bên
                trong. Khi hai cung khác hành/khác tính chất, đó thường là điểm thú vị để hiểu chính mình.
              </p>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Vị trí hành tinh được tính bằng thuật toán thiên văn (Meeus), đối chiếu với thư viện chuẩn —
              <strong> con số là thật</strong>. Phần diễn giải mang tính <strong>tham khảo để hiểu mình</strong>,
              không phải tiên đoán số mệnh. Bạn vẫn là người quyết định.
            </p>

            <div className="rounded-lg border border-dashed border-gold/30 bg-gold/5 p-4 text-sm text-muted-foreground">
              🔭 <strong className="text-foreground">Sắp có:</strong> cung Mọc (Ascendant), vị trí các hành tinh
              (Sao Thuỷ → Diêm Vương) theo cung &amp; nhà, và bản luận giải chuyên sâu cho bản đồ sao đầy đủ.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
