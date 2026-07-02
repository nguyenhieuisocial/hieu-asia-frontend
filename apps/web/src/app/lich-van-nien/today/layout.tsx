import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch vạn niên hôm nay',
  description:
    'Lịch vạn niên hôm nay: giờ Hoàng đạo/Hắc đạo, Can Chi, ngày âm–dương, sao tốt xấu và việc nên làm/nên tránh — cập nhật mỗi ngày.',
  alternates: { canonical: 'https://hieu.asia/lich-van-nien/today' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
