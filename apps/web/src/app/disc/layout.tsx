import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trắc nghiệm DiSC miễn phí — 4 phong cách hành vi D/i/S/C',
  description:
    'Làm trắc nghiệm DiSC online: xác định phong cách hành vi Quyết đoán (D), Ảnh hưởng (i), Ổn định (S), Tuân thủ (C) để hiểu cách bạn giao tiếp và làm việc. 16 câu, kết quả ngay.',
  alternates: { canonical: 'https://hieu.asia/disc' },
  openGraph: {
    title: 'Trắc nghiệm DiSC',
    description: '4 phong cách hành vi D/i/S/C — kết quả tức thì, miễn phí.',
    url: 'https://hieu.asia/disc',
    type: 'website',
  },
};

export default function DiscLayout({ children }: { children: React.ReactNode }) {
  return children;
}
