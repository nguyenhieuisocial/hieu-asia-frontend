import type { Metadata } from 'next';
import { ZodiacCard } from '@/components/daily/ZodiacCard';
import { SubscribePush } from '@/components/daily/SubscribePush';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { getVietnamTodayISO } from '@/lib/vn-date';
import { generateZodiacBlurb, isGenericSummary } from '@/lib/zodiac-blurb';

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
  title: 'Tử vi 12 con giáp hôm nay',
  description:
    'Tử vi hàng ngày cho 12 con giáp: tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe. Đăng ký nhận thông báo mỗi sáng 6h.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-hom-nay' },
};

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
  const today = data?.date ?? formatToday();
  const byKey = new Map<string, DailyHoroscope>();
  if (data?.horoscopes) {
    for (const h of data.horoscopes) {
      // Normalize legacy upstream slug `ty2` → canonical `ti`.
      const key = h.zodiac_key === 'ty2' ? 'ti' : h.zodiac_key;
      byKey.set(key, h);
    }
  }
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  return (
    <ToolPageShell
      eyebrow={`Tử vi · ${today}`}
      icon={<span aria-hidden="true">🐲</span>}
      title={
        <>
          Tử vi <GoldAccent>12 con giáp</GoldAccent> hôm nay
        </>
      }
      description="Tổng quan, sự nghiệp, tình duyên, tài lộc và sức khỏe cho từng tuổi. Đăng ký để nhận thông báo mỗi sáng 6h."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tử vi hôm nay' },
      ]}
      heroAction={<SubscribePush vapidPublicKey={vapidKey} />}
    >
      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Chọn tuổi của bạn
          </h2>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/40 sm:block">
            12 con giáp · điểm 1–10
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ZODIACS.map((z) => {
            const h = byKey.get(z.key);
            // Upstream sometimes ships the same fallback summary for all 12 signs
            // (e.g. "Ngày khá thuận, giữ năng lượng cho việc quan trọng."). When
            // that happens, fall back to a deterministic per-zodiac blurb keyed
            // by (zodiac, date, score). Keeps every card unique even if upstream
            // is degraded. Deterministic so SSR == CSR == cache.
            const upstream = h?.overall.summary;
            const summary = isGenericSummary(upstream)
              ? generateZodiacBlurb(z.key, h?.overall.score, today)
              : upstream;
            return (
              <ZodiacCard
                key={z.key}
                zodiacKey={z.key}
                zodiacName={z.label}
                icon={z.icon}
                overallScore={h?.overall.score}
                summary={summary}
              />
            );
          })}
        </div>
      </section>
    </ToolPageShell>
  );
}
