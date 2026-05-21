import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HopTuoiClient } from './HopTuoiClient';

export const dynamic = 'force-dynamic';

const TYPES = ['wedding', 'business', 'birth-child', 'xong-dat'] as const;
export type HopTuoiType = (typeof TYPES)[number];

const META: Record<HopTuoiType, { title: string; description: string }> = {
  wedding: {
    title: 'Hợp tuổi vợ chồng (cưới hỏi)',
    description: 'Xem tương hợp giữa nam và nữ trước khi cưới — Thiên Can, Địa Chi, Cung Phi 8 trạch.',
  },
  business: {
    title: 'Hợp tuổi đối tác kinh doanh',
    description: 'Đánh giá tương hợp hai tuổi khi hợp tác, chú trọng tài lộc và tam hợp.',
  },
  'birth-child': {
    title: 'Chọn tuổi sinh con',
    description: 'Xem năm sinh con hợp với cả cha và mẹ, gợi ý các năm tốt nhất.',
  },
  'xong-dat': {
    title: 'Chọn người xông đất',
    description: 'Xếp hạng các ứng viên xông đất theo tuổi gia chủ.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!TYPES.includes(type as HopTuoiType)) return { title: 'Hợp Tuổi' };
  const m = META[type as HopTuoiType];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `https://hieu.asia/hop-tuoi/${type}` },
  };
}

export default async function HopTuoiTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!TYPES.includes(type as HopTuoiType)) notFound();
  const t = type as HopTuoiType;
  const m = META[t];

  return (
    <main className="min-h-screen bg-ink-radial">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/hop-tuoi" className="font-heading text-xl font-semibold text-gold">
          ← Hợp Tuổi
        </Link>
      </header>

      <section className="container mx-auto max-w-5xl px-6 pb-20 pt-6">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-semibold text-gold md:text-4xl">{m.title}</h1>
          <p className="mt-2 text-cream/70">{m.description}</p>
        </div>

        <HopTuoiClient type={t} />
      </section>
    </main>
  );
}
