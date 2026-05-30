import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trắc nghiệm Big Five (OCEAN) miễn phí — 5 chiều tính cách',
  description:
    'Làm trắc nghiệm tính cách Big Five (OCEAN) online theo thang IPIP-NEO: đo Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc. 20 câu, có kết quả và giải thích ngay.',
  alternates: { canonical: 'https://hieu.asia/big-five' },
  openGraph: {
    title: 'Trắc nghiệm Big Five (OCEAN)',
    description: '5 chiều tính cách theo mô hình khoa học Big Five — kết quả tức thì, miễn phí.',
    url: 'https://hieu.asia/big-five',
    type: 'website',
  },
};

export default function BigFiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
