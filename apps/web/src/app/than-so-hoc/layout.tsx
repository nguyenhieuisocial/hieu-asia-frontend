import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thần Số Học miễn phí: tính số chủ đạo, vận mệnh, linh hồn',
  description:
    'Tính số chủ đạo, số vận mệnh, số linh hồn và năm cá nhân 2026 miễn phí — phân tích AI dựa trên ngày sinh và họ tên đầy đủ.',
  alternates: { canonical: 'https://hieu.asia/than-so-hoc' },
  openGraph: {
    title: 'Thần Số Học miễn phí · hieu.asia',
    description: 'Số chủ đạo, vận mệnh, linh hồn, năm cá nhân — phân tích AI miễn phí.',
    url: 'https://hieu.asia/than-so-hoc',
    type: 'website',
  },
};

export default function ThanSoHocLayout({ children }: { children: React.ReactNode }) {
  return children;
}
