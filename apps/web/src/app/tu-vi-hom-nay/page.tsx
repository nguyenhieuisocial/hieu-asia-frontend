import type { Metadata } from 'next';
import Link from 'next/link';
import { ZodiacCard } from '@/components/daily/ZodiacCard';
import { SubscribePush } from '@/components/daily/SubscribePush';

export const dynamic = 'force-dynamic';
export const revalidate = 600;

const ZODIACS: { key: string; label: string; icon: string }[] = [
  { key: 'ty', label: 'Tý', icon: '🐭' },
  { key: 'suu', label: 'Sửu', icon: '🐂' },
  { key: 'dan', label: 'Dần', icon: '🐯' },
  { key: 'mao', label: 'Mão', icon: '🐰' },
  { key: 'thin', label: 'Thìn', icon: '🐲' },
  { key: 'ty2', label: 'Tỵ', icon: '🐍' },
  { key: 'ngo', label: 'Ngọ', icon: '🐴' },
  { key: 'mui', label: 'Mùi', icon: '🐐' },
  { key: 'than', label: 'Thân', icon: '🐵' },
  { key: 'dau', label: 'Dậu', icon: '🐓' },
  { key: 'tuat', label: 'Tuất', icon: '🐶' },
  { key: 'hoi', label: 'Hợi', icon: '🐷' },
];

function formatToday(): string {
  // ICT date.
  const now = new Date();
  const ict = new Date(now.getTime() + 7 * 3600 * 1000);
  const y = ict.getUTCFullYear();
  const m = String(ict.getUTCMonth() + 1).padStart(2, '0');
  const d = String(ict.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const metadata: Metadata = {
  title: 'Tử vi 12 con giáp hôm nay — hieu.asia',
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
    for (const h of data.horoscopes) byKey.set(h.zodiac_key, h);
  }
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  return (
    <main id="main-content" className="min-h-screen bg-ink text-cream">
      <section className="border-b border-cream/5 bg-ink/60">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link href="/" className="text-xs text-cream/60 hover:text-gold">
            ← Về trang chủ
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
            Tử vi 12 con giáp hôm nay
          </h1>
          <p className="mt-2 text-sm text-cream/60 sm:text-base">
            Ngày {today} — tổng quan, sự nghiệp, tình duyên, tài lộc, sức khỏe.
          </p>
          <div className="mt-6">
            <SubscribePush vapidPublicKey={vapidKey} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ZODIACS.map((z) => {
            const h = byKey.get(z.key);
            return (
              <ZodiacCard
                key={z.key}
                zodiacKey={z.key}
                zodiacName={z.label}
                icon={z.icon}
                overallScore={h?.overall.score}
                summary={h?.overall.summary}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
