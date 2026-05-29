import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch vạn niên hôm nay',
  description:
    'Lịch hôm nay: ngày giờ Hoàng đạo/Hắc đạo, Can Chi, sao tốt xấu — cập nhật mỗi ngày.',
  alternates: { canonical: 'https://hieu.asia/lich-van-nien/today' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
