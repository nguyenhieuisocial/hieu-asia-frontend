import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@hieu-asia/ui';
import { ChevronRight, Sun, Moon, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

interface VanNienHour {
  name?: string;
  canChi?: string;
  type?: 'hoang_dao' | 'hac_dao' | string;
  star?: string;
  suggestions?: string[];
}

interface VanNienDay {
  solarDate?: { year?: number; month?: number; day?: number; weekday?: string; iso?: string };
  lunarDate?: { year?: number; month?: number; day?: number; isLeap?: boolean; chineseMonthName?: string; chineseDayName?: string };
  canChi?: { year?: string; month?: string; day?: string };
  trucNgay?: string;
  isHoangDao?: boolean;
  isHacDao?: boolean;
  // Worker returns starsToday/badStarsToday/suggestedActivities — alias kept for forward-compat.
  starsToday?: string[];
  badStarsToday?: string[];
  goodStars?: string[];
  badStars?: string[];
  suggestedActivities?: string[];
  goodActivities?: string[];
  avoidActivities?: string[];
  hours?: VanNienHour[];
  dayStar?: string;
  meaningSummary?: string;
}

interface ApiResponse {
  ok: boolean;
  day?: VanNienDay;
  error?: string;
}

const WORKER_BASE = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

function isValidDate(y: number, m: number, d: number): boolean {
  if (!Number.isFinite(y) || y < 1900 || y > 2100) return false;
  if (!Number.isFinite(m) || m < 1 || m > 12) return false;
  if (!Number.isFinite(d) || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

async function fetchDay(year: number, month: number, day: number): Promise<VanNienDay | null> {
  try {
    const res = await fetch(
      `${WORKER_BASE}/tools/lich-van-nien/day?year=${year}&month=${month}&day=${day}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ApiResponse;
    return data.ok ? data.day ?? null : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}): Promise<Metadata> {
  const { year, month, day } = await params;
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (!isValidDate(y, m, d)) return {};
  const url = `https://hieu.asia/lich-van-nien/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`;
  return {
    title: `Ngày ${d}/${m}/${y} — âm lịch, Can Chi, giờ hoàng đạo`,
    description: `Lịch vạn niên ngày ${d}/${m}/${y}: âm lịch, Thiên Can Địa Chi, Hoàng/Hắc đạo, Trực, sao tốt sao xấu, giờ hoàng đạo và việc nên/kiêng.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Lịch ngày ${d}/${m}/${y}`,
      description: 'Tra cứu âm lịch + Can Chi + giờ tốt cho ngày này.',
      url,
      type: 'article',
      images: OG_DEFAULT_IMAGES,
    },
  };
}

export default async function ArchiveDayPage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!isValidDate(y, m, d)) notFound();

  const data = await fetchDay(y, m, d);
  if (!data) notFound();

  const dateLabel = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  const goodStars = data.goodStars ?? data.starsToday ?? [];
  const badStars = data.badStars ?? data.badStarsToday ?? [];
  const goodActivities = data.goodActivities ?? data.suggestedActivities ?? [];
  const avoidActivities = data.avoidActivities ?? [];
  const hoangDaoHours = (data.hours ?? []).filter((h) => h.type === 'hoang_dao');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
      { '@type': 'ListItem', position: 2, name: 'Lịch Vạn Niên', item: 'https://hieu.asia/lich-van-nien' },
      { '@type': 'ListItem', position: 3, name: dateLabel, item: `https://hieu.asia/lich-van-nien/${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
            <Link href="/lich-van-nien" className="hover:text-gold">Lịch Vạn Niên</Link>
            <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
            <span className="text-muted-foreground">{dateLabel}</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            {data.solarDate?.weekday ?? '—'}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Lịch ngày {dateLabel}
          </h1>
          {data.lunarDate?.chineseDayName && data.lunarDate?.chineseMonthName && (
            <p className="mt-3 text-base leading-relaxed text-foreground/80 sm:text-lg">
              Âm lịch: {data.lunarDate.chineseDayName} {data.lunarDate.chineseMonthName}, năm{' '}
              {data.canChi?.year ?? ''}
            </p>
          )}
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Sun className="h-4 w-4 text-gold" aria-hidden /> Dương lịch
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-foreground/80">
                {dateLabel} · {data.solarDate?.weekday}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Moon className="h-4 w-4 text-purple-700 dark:text-purple-50" aria-hidden /> Âm lịch
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-foreground/80">
                {data.lunarDate?.chineseDayName} {data.lunarDate?.chineseMonthName} năm {data.canChi?.year}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.05] to-transparent">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Can Chi · Trực · Hoàng Hắc Đạo
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Stat label="Can Chi năm" value={data.canChi?.year ?? '—'} />
              <Stat label="Can Chi tháng" value={data.canChi?.month ?? '—'} />
              <Stat label="Can Chi ngày" value={data.canChi?.day ?? '—'} />
              <Stat label="Trực ngày" value={data.trucNgay ?? '—'} />
              <div className="sm:col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Phân loại
                </p>
                <p className="mt-1 font-heading text-lg font-semibold">
                  {data.isHoangDao && <span className="text-jade-50">Ngày Hoàng Đạo</span>}
                  {data.isHacDao && <span className="text-amber-300">Ngày Hắc Đạo</span>}
                  {!data.isHoangDao && !data.isHacDao && <span className="text-muted-foreground">Bình thường</span>}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {(goodActivities.length > 0 || avoidActivities.length > 0) && (
          <section className="relative mx-auto max-w-3xl px-6 pb-10">
            <div className="grid gap-3 md:grid-cols-2">
              {goodActivities.length > 0 && (
                <Card className="border-jade/30 bg-jade/[0.04]">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-heading text-base text-jade-50">
                      <Sparkles className="h-4 w-4" aria-hidden /> Việc nên làm
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-foreground/80">
                      {goodActivities.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-jade-50">+</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {avoidActivities.length > 0 && (
                <Card className="border-amber-700/40 bg-amber-900/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-heading text-base text-amber-200">
                      <AlertTriangle className="h-4 w-4" aria-hidden /> Việc nên kiêng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-foreground/80">
                      {avoidActivities.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-amber-300">!</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {(goodStars.length > 0 || badStars.length > 0) && (
          <section className="relative mx-auto max-w-3xl px-6 pb-10">
            <Card className="border-border bg-card/40">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                  Sao tốt — sao xấu
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {goodStars.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-jade-50">
                      Sao tốt
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {goodStars.map((s) => (
                        <span key={s} className="rounded bg-jade/15 px-2 py-0.5 font-mono text-xs text-jade-50">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {badStars.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-red-300">
                      Sao xấu
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {badStars.map((s) => (
                        <span key={s} className="rounded bg-red-500/15 px-2 py-0.5 font-mono text-xs text-red-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {hoangDaoHours.length > 0 && (
          <section className="relative mx-auto max-w-3xl px-6 pb-10">
            <Card className="border-jade/30 bg-jade/[0.04]">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                  Giờ hoàng đạo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {hoangDaoHours.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Sparkles className="h-3.5 w-3.5 text-jade-50" aria-hidden />
                      <span className="font-medium text-foreground">{h.name}</span>
                      {h.star && <span className="text-xs text-muted-foreground">· {h.star}</span>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {data.meaningSummary && (
          <section className="relative mx-auto max-w-3xl px-6 pb-10">
            <Card className="border-border bg-card/40">
              <CardContent className="text-sm leading-relaxed text-foreground/80">
                {data.meaningSummary}
              </CardContent>
            </Card>
          </section>
        )}

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Ngày {dateLabel} hợp với việc gì của BẠN?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Lịch chung dùng cho mọi người. Để biết ngày này có hợp với lá số riêng
              của bạn không (cung Mệnh, đại vận, lưu niên), lập lá số 2 phút.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số cá nhân hoá
              </Link></Button>
              <Link
                href="/lich-van-nien"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Quay về Lịch Vạn Niên <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

// ISR: revalidate daily (worker also caches 24h on edge).
export const revalidate = 86400;
