import { notFound } from 'next/navigation';
import { HopTuoiClient } from './HopTuoiClient';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';

export const dynamic = 'force-dynamic';

const TYPES = ['wedding', 'business', 'birth-child', 'xong-dat'] as const;
export type HopTuoiType = (typeof TYPES)[number];

const META: Record<HopTuoiType, {
  title: string;
  description: string;
  eyebrow: string;
  icon: string;
}> = {
  wedding: {
    title: 'Hợp tuổi vợ chồng (cưới hỏi)',
    description:
      'Xem tương hợp giữa nam và nữ trước khi cưới — Thiên Can, Địa Chi, Cung Phi 8 trạch.',
    eyebrow: 'Hợp tuổi · Cưới hỏi',
    icon: '💍',
  },
  business: {
    title: 'Hợp tuổi đối tác kinh doanh',
    description:
      'Đánh giá tương hợp hai tuổi khi hợp tác, chú trọng cung Tài Quan và tam hợp Ngũ Hành.',
    eyebrow: 'Hợp tuổi · Hợp tác',
    icon: '🤝',
  },
  'birth-child': {
    title: 'Chọn tuổi sinh con',
    description:
      'Xem năm sinh con hợp với cả cha và mẹ, gợi ý các năm Tam Hợp / Lục Hợp tốt nhất.',
    eyebrow: 'Hợp tuổi · Sinh con',
    icon: '👶',
  },
  'xong-dat': {
    title: 'Chọn người xông đất',
    description:
      'Xếp hạng các ứng viên xông đất đầu năm theo tuổi gia chủ, Can Chi và Ngũ Hành.',
    eyebrow: 'Hợp tuổi · Xông đất',
    icon: '🎋',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!TYPES.includes(type as HopTuoiType)) return { title: 'Hợp Tuổi' };
  const m = META[type as HopTuoiType];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `https://hieu.asia/hop-tuoi/${type}` },
    openGraph: {
      title: `${m.title}`,
      description: m.description,
      url: `https://hieu.asia/hop-tuoi/${type}`,
      type: 'website' as const,
    },
  };
}

export default async function HopTuoiTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!TYPES.includes(type as HopTuoiType)) notFound();
  const t = type as HopTuoiType;
  const m = META[t];

  return (
    <ToolPageShell
      eyebrow={m.eyebrow}
      icon={<span aria-hidden="true">{m.icon}</span>}
      title={
        <>
          <GoldAccent>{m.title.split(' ')[0]}</GoldAccent>{' '}
          {m.title.split(' ').slice(1).join(' ')}
        </>
      }
      description={m.description}
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Hợp tuổi', href: '/hop-tuoi' },
        { label: m.title },
      ]}
    >
      <HopTuoiClient type={t} />
    </ToolPageShell>
  );
}
