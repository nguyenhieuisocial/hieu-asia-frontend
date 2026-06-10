'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import {
  computeChart,
  chartBalance,
  ELEMENT_TENDENCY,
  type SignPosition,
  type NatalChart,
  type ChartBalance,
} from '@/lib/western-astrology';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { ReadingRitual } from '@/components/tools/ReadingRitual';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

interface FeatureLockedPayload {
  ok: false;
  error: 'feature_locked';
  slug: string;
  price: number;
  message?: string;
  checkout?: { tier: string; tool_slug: string };
}

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

const CITIES: ReadonlyArray<{ name: string; lat: number; lon: number }> = [
  { name: 'Hà Nội', lat: 21.03, lon: 105.85 },
  { name: 'TP. Hồ Chí Minh', lat: 10.82, lon: 106.63 },
  { name: 'Đà Nẵng', lat: 16.05, lon: 108.22 },
  { name: 'Hải Phòng', lat: 20.86, lon: 106.68 },
  { name: 'Cần Thơ', lat: 10.03, lon: 105.79 },
  { name: 'Huế', lat: 16.46, lon: 107.59 },
  { name: 'Nha Trang', lat: 12.24, lon: 109.19 },
  { name: 'Buôn Ma Thuột', lat: 12.67, lon: 108.04 },
  { name: 'Đà Lạt', lat: 11.94, lon: 108.46 },
  { name: 'Vinh', lat: 18.68, lon: 105.68 },
  { name: 'Quy Nhơn', lat: 13.78, lon: 109.22 },
  { name: 'Biên Hoà', lat: 10.95, lon: 106.82 },
];

export function SunMoonChecker() {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('12:00');
  const [placeIdx, setPlaceIdx] = React.useState<number | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [readingLoading, setReadingLoading] = React.useState(false);
  const [paywall, setPaywall] = React.useState<FeatureLockedPayload | null>(null);

  const parsedDate = React.useMemo(() => parseDate(date), [date]);
  const chart = React.useMemo<NatalChart | null>(() => {
    if (!parsedDate) return null;
    const { h, min } = parseTime(time);
    const place = placeIdx !== null ? CITIES[placeIdx] : undefined;
    return computeChart({
      year: parsedDate.y,
      month: parsedDate.m,
      day: parsedDate.d,
      hour: h,
      minute: min,
      tzOffsetMinutes: 420, // giả định sinh tại VN (GMT+7)
      latitude: place?.lat,
      longitude: place?.lon,
    });
  }, [parsedDate, time, placeIdx]);

  const balance = React.useMemo<ChartBalance | null>(() => (chart ? chartBalance(chart) : null), [chart]);

  // Reset reading khi chart thay đổi (đổi ngày/giờ/nơi sinh)
  React.useEffect(() => {
    setReading(null);
    setPaywall(null);
    setReadingLoading(false);
  }, [chart]);

  const onDeepRead = React.useCallback(async () => {
    if (!chart) return;
    setReading(null);
    setPaywall(null);
    setReadingLoading(true);
    try {
      const sb = getSupabaseAuth();
      let token: string | undefined;
      if (sb) {
        const { data } = await sb.auth.getSession();
        token = data.session?.access_token;
      }
      const res = await fetch(`${API_BASE}/tools/natal-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          sun: chart.sun.sign.name,
          moon: chart.moon.sign.name,
          ascendant: chart.ascendant?.sign.name ?? null,
          planets: chart.planets.map((p) => ({ name: p.planet.name, sign: p.position.sign.name })),
          dominantElement: balance?.dominantElement,
          dominantModality: balance?.dominantModality,
        }),
      });

      if (res.status === 402) {
        const locked = await safeJson<FeatureLockedPayload>(res);
        if (locked.ok && locked.data.error === 'feature_locked') {
          setPaywall(locked.data);
          return;
        }
      }

      const parsed = await safeJson<{ ok: true; reading: string } | { ok: false; error: string }>(res);
      if (!parsed.ok) throw new Error(`HTTP ${parsed.status}`);
      const json = parsed.data as { ok: true; reading: string } | { ok: false; error: string };
      if (!json.ok || !json.reading) throw new Error('empty reading');
      setReading(json.reading);
    } catch {
      setReading(null);
    } finally {
      setReadingLoading(false);
    }
  }, [chart, balance]);

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
        <div className="space-y-1">
          <Label htmlFor="smPlace">Nơi sinh (để tính cung Mọc — không bắt buộc)</Label>
          <select
            id="smPlace"
            value={placeIdx ?? ''}
            onChange={(e) => setPlaceIdx(e.target.value === '' ? null : Number(e.target.value))}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">— Chọn tỉnh/thành —</option>
            {CITIES.map((c, i) => (
              <option key={c.name} value={i}>
                {c.name}
              </option>
            ))}
          </select>
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
            <div className={chart.ascendant ? 'grid gap-3 sm:grid-cols-3' : 'grid gap-3 sm:grid-cols-2'}>
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
              {chart.ascendant && (
                <PositionCard
                  icon="↗️"
                  title="Cung Mọc"
                  subtitle="Vẻ ngoài & cách bạn bước vào đời — 'lớp áo' đầu tiên người khác thấy."
                  pos={chart.ascendant}
                />
              )}
            </div>
            {!chart.ascendant && (
              <p className="text-xs text-muted-foreground">
                💡 Chọn <strong>nơi sinh</strong> ở trên để xem thêm <strong>cung Mọc</strong> (Ascendant) —
                mảnh thứ ba của bộ &ldquo;tam trụ&rdquo; (Mặt Trời · Mặt Trăng · Mọc).
              </p>
            )}

            <div className="rounded-lg border border-border bg-card/40 p-4">
              <p className="text-sm text-foreground/85">
                <strong>Mặt Trời {chart.sun.sign.name}</strong> &amp;{' '}
                <strong>Mặt Trăng {chart.moon.sign.name}</strong> — hai &ldquo;vầng sáng&rdquo; nền tảng của
                bản đồ sao. Mặt Trời là con người bạn thể hiện ra; Mặt Trăng là con người bạn cảm nhận bên
                trong. Khi hai cung khác hành/khác tính chất, đó thường là điểm thú vị để hiểu chính mình.
              </p>
            </div>

            {/* 7 hành tinh */}
            <div className="rounded-xl border border-border bg-card/40 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">Bảy hành tinh</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {chart.planets.map(({ planet, position }) => (
                  <div
                    key={planet.key}
                    className="flex items-start gap-2 rounded-lg border border-border bg-background/40 p-2.5"
                  >
                    <span className="text-lg leading-none text-gold" aria-hidden>
                      {planet.symbol}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {planet.name} ở {position.sign.symbol} {position.sign.name}
                        <span className="ml-1 font-mono text-xs text-muted-foreground">
                          {position.degreeInSign.toFixed(0)}°
                        </span>
                        {position.nearCusp && (
                          <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">(sát ranh giới)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{planet.represents}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {balance && (
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">Cân bằng nguyên tố</p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {(['Lửa', 'Đất', 'Khí', 'Nước'] as const).map((el) => (
                    <div key={el} className="rounded-lg border border-border bg-background/40 p-2.5 text-center">
                      <p className="text-xs text-muted-foreground">{el}</p>
                      <p className="font-mono text-lg text-gold">{balance.elements[el]}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-foreground/85">
                  Nổi trội: <strong>nguyên tố {balance.dominantElement}</strong> (
                  {balance.elements[balance.dominantElement]}/{balance.total} thiên thể) ·{' '}
                  <strong>{balance.dominantModality}</strong>. Bạn {ELEMENT_TENDENCY[balance.dominantElement]}
                </p>
              </div>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              Vị trí hành tinh được tính bằng thuật toán thiên văn (Meeus + Schlyter), đối chiếu với thư viện chuẩn —
              <strong> con số là thật</strong>. Phần diễn giải mang tính <strong>tham khảo để hiểu mình</strong>,
              không phải tiên đoán số mệnh. Bạn vẫn là người quyết định.
            </p>

            {/* Lớp đọc sâu AI */}
            {paywall ? (
              <FeaturePaywall
                slug={paywall.slug}
                price={paywall.price}
                label="Bản đồ sao"
                onUnlocked={() => {
                  setPaywall(null);
                  void onDeepRead();
                }}
              />
            ) : reading ? (
              <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Đọc sâu cùng AI
                </div>
                <article className="markdown-report mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h2 className="mt-4 font-heading text-xl text-gold" {...props} />,
                      h2: ({ ...props }) => <h3 className="mt-3 font-heading text-lg text-foreground" {...props} />,
                      h3: ({ ...props }) => <h4 className="mt-3 font-heading text-base text-foreground" {...props} />,
                      p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
                      ul: ({ ...props }) => <ul className="ml-5 list-disc space-y-1" {...props} />,
                      ol: ({ ...props }) => <ol className="ml-5 list-decimal space-y-1" {...props} />,
                      strong: ({ ...props }) => <strong className="text-gold" {...props} />,
                    }}
                  >
                    {reading}
                  </ReactMarkdown>
                </article>
              </div>
            ) : readingLoading ? (
              <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-5">
                <ReadingRitual
                  messages={[
                    'Đang đọc vị trí các thiên thể…',
                    'Phân tích tổ hợp cung & hành…',
                    'Nối các mảnh thành một bức tranh…',
                    'Soạn luận giải để bạn tự soi…',
                  ]}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void onDeepRead()}
                className="w-full rounded-md border border-gold/40 px-6 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/10 sm:w-auto sm:px-10"
              >
                🔮 Đọc sâu cùng AI →
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
