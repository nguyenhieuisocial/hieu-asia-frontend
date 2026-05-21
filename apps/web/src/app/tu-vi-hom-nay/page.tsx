import type { Metadata } from 'next';
import { ZodiacCard } from '@/components/daily/ZodiacCard';
import { SubscribePush } from '@/components/daily/SubscribePush';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';

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
    for (const h of data.horoscopes) byKey.set(h.zodiac_key, h);
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
          <h2 className="font-heading text-lg font-semibold text-cream">
            Chọn tuổi của bạn
          </h2>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40 sm:block">
            12 con giáp · điểm 1–10
          </p>
        </div>
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
    </ToolPageShell>
  );
}
