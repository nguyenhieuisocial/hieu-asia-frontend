import type { Metadata } from 'next';
import Link from 'next/link';
import { ZodiacCard } from '@/components/daily/ZodiacCard';
import { SubscribePush } from '@/components/daily/SubscribePush';
import { ReflectCard } from '@/components/daily/ReflectCard';
import { StreakCard } from '@/components/account/StreakCard';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { getVietnamTodayISO } from '@/lib/vn-date';
import { resolveDailySummaries } from '@/lib/zodiac-blurb';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
// Gộp (B) 2026-06-21: bê lá số THẬT (Mệnh, Phúc Đức + đại vận) từ
// /lo-trinh/hang-ngay (nay redirect về đây).
import { LoTrinhChart } from '@/components/lo-trinh/LoTrinhChart';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

const ZODIACS: { key: string; label: string; icon: string }[] = [
  { key: 'ty', label: 'Tý', icon: '🐭' },
  { key: 'suu', label: 'Sửu', icon: '🐂' },
  { key: 'dan', label: 'Dần', icon: '🐯' },
  { key: 'mao', label: 'Mão', icon: '🐰' },
  { key: 'thin', label: 'Thìn', icon: '🐲' },
  { key: 'ti', label: 'Tỵ', icon: '🐍' },
  { key: 'ngo', label: 'Ngọ', icon: '🐴' },
  { key: 'mui', label: 'Mùi', icon: '🐐' },
  { key: 'than', label: 'Thân', icon: '🐵' },
  { key: 'dau', label: 'Dậu', icon: '🐓' },
  { key: 'tuat', label: 'Tuất', icon: '🐶' },
  { key: 'hoi', label: 'Hợi', icon: '🐷' },
];

function formatToday(): string {
  // Robust VN-tz date via Intl. Replaces the old +7h shift which fails on
  // hosts whose process tz isn't VN if combined with `.toISOString()` later.
  return getVietnamTodayISO();
}

export const metadata: Metadata = {
  title: 'Tử Vi 12 con giáp hôm nay',
  description:
    'Tử Vi hàng ngày cho 12 con giáp: tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe. Đăng ký nhận thông báo mỗi sáng 6h.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-hom-nay' },
  // Wave 60.96.1 — route-level openGraph REPLACES root-layout openGraph
  // (Next.js merge semantics), so we must re-declare `images` here or Zalo/
  // Facebook/Telegram/Slack previews render blank. Same for `twitter`.
  openGraph: {
    title: 'Tử Vi 12 con giáp hôm nay',
    description:
      'Tử Vi hàng ngày 12 con giáp — tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe.',
    url: 'https://hieu.asia/tu-vi-hom-nay',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi hôm nay cho 12 con giáp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi 12 con giáp hôm nay',
    description: 'Tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe — cập nhật mỗi ngày.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tử Vi hôm nay cho 12 con giáp',
      },
    ],
  },
};

const JSONLD = [
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tử Vi hôm nay', url: '/tu-vi-hom-nay' },
  ]),
  webPage({
    name: 'Tử Vi 12 con giáp hôm nay',
    description:
      'Tử Vi hàng ngày cho 12 con giáp — tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe. Đăng ký push notification mỗi sáng 6h.',
    url: '/tu-vi-hom-nay',
  }),
];

interface DailyHoroscope {
  zodiac_key: string;
  zodiac: string;
  zodiac_icon: string;
  overall: { score: number; summary: string };
}

interface AllResponse {
  ok: boolean;
  date?: string;
  horoscopes?: DailyHoroscope[];
}

async function fetchAll(): Promise<AllResponse | null> {
  try {
    const base = process.env.PUBLIC_SITE_URL ?? 'https://hieu.asia';
    const res = await fetch(`${base}/api/daily/horoscope?all=1`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return (await res.json()) as AllResponse;
  } catch {
    return null;
  }
}

export default async function Page() {
  const data = await fetchAll();
  // Always show today's VN date in the header — never echo a stale upstream
  // `date`. If a degraded SWR/CDN snapshot returns an old payload, the eyebrow
  // must still read today (the per-zodiac cards are matched by key, not date).
  const today = formatToday();
  const byKey = new Map<string, DailyHoroscope>();
  if (data?.horoscopes) {
    for (const h of data.horoscopes) {
      // Normalize legacy upstream slug `ty2` → canonical `ti`.
      const key = h.zodiac_key === 'ty2' ? 'ti' : h.zodiac_key;
      byKey.set(key, h);
    }
  }
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  // Resolve all 12 summaries together: swaps exact upstream generics AND
  // near-duplicate phrasing (the LLM generates each sign independently and
  // converges on similar wording) for a distinct deterministic per-zodiac blurb.
  // Keeps every card unique; deterministic by (zodiac, date, score) so SSR==CSR==cache.
  const dailySummaries = resolveDailySummaries(
    ZODIACS.map((z) => {
      const h = byKey.get(z.key);
      return { key: z.key, summary: h?.overall.summary, score: h?.overall.score };
    }),
    today,
  );

  return (
    <>
      <JsonLd data={JSONLD} />
    <ToolPageShell
      eyebrow={`Tử Vi · ${today}`}
        relatedSlug="/tu-vi-hom-nay"
      icon={<span aria-hidden="true">🐲</span>}
      title={
        <>
          Tử Vi <GoldAccent>12 con giáp</GoldAccent> hôm nay
        </>
      }
      description="Tổng quan, sự nghiệp, tình duyên, tài lộc và sức khỏe cho từng tuổi. Đăng ký để nhận thông báo mỗi sáng 6h."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tử Vi hôm nay' },
      ]}
      heroAction={<SubscribePush vapidPublicKey={vapidKey} />}
    >
      {/* Daily-return habit loop: returning signed-in users can keep their
          streak right where the daily ritual happens. Self-hides for anonymous
          / signed-out visitors (the SEO-traffic majority). */}
      <StreakCard variant="compact" />

      {/* Brand honesty disclaimer — clarify this is general horoscope by zodiac sign,
          NOT a personal Tử Vi Đẩu Số chart (which requires exact birth date/time/place). */}
      <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
        <p className="text-sm text-foreground/80">
          <span className="font-semibold text-foreground">Lưu ý:</span>{' '}
          Đây là dự báo chung theo <strong>12 con giáp</strong>, không phải lá số Tử Vi cá nhân của bạn.{' '}
          <Link
            href="/la-so-tu-vi"
            className="font-medium text-gold underline-offset-2 hover:underline"
          >
            Muốn bản cá nhân hoá theo lá số thật? Lập lá số ngay →
          </Link>
        </p>
      </div>

      {/* Reflective prompt — calm editorial card, private textarea (localStorage). */}
      <div className="mt-6">
        <ReflectCard date={today} />
      </div>

      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Chọn tuổi của bạn
          </h2>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/75 sm:block">
            12 con giáp · điểm 1–10
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ZODIACS.map((z, i) => {
            const h = byKey.get(z.key);
            return (
              <ZodiacCard
                key={z.key}
                zodiacKey={z.key}
                zodiacName={z.label}
                icon={z.icon}
                overallScore={h?.overall.score}
                summary={dailySummaries[i]}
              />
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
          Nhận nhắc theo mùa qua email
        </h2>
        <div className="mt-4">
          <OccasionLeadCapture
            source="tu-vi-hom-nay"
            capturedEvent="lead_capture_tu_vi_hom_nay"
            blurb="Để lại email, chúng tôi báo khi có nội dung mới theo mùa: tử vi năm mới, sao hạn, ngày tốt theo việc. Thi thoảng thôi, không spam."
            cta="Nhận nhắc"
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Lá số của bạn hôm nay</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Trên là vận chung theo con giáp. Dưới đây đọc đúng lá số THẬT của bạn — cung Mệnh, Phúc Đức
          cùng đại vận hiện tại — để soi ngày hôm nay sát hơn.
        </p>
        <div className="mt-5">
          <LoTrinhChart topic="general" focusPalaces={['Mệnh', 'Phúc Đức']} />
        </div>
      </section>
    </ToolPageShell>
    <StickyMobileCta trackId="tu-vi-hom-nay" />
    </>
  );
}
