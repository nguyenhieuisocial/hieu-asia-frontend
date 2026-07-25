import type { Metadata } from 'next';

const TITLE = 'Lịch vạn niên hôm nay';
const DESCRIPTION =
  'Lịch vạn niên hôm nay: giờ Hoàng đạo/Hắc đạo, Can Chi, ngày âm–dương, sao tốt xấu và việc nên làm/nên tránh — cập nhật mỗi ngày.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/lich-van-nien/today' },
  // Own OG title/desc — without this, og:title inherited the generic homepage
  // default ('hieu.asia — Tử Vi & MBTI bằng AI'), weakening social-share CTR.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://hieu.asia/lich-van-nien/today',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
