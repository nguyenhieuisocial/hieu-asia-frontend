import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thước Lỗ Ban online: tra cung tốt xấu theo kích thước cm',
  description:
    'Tra cứu thước Lỗ Ban 42.9cm / 38.8cm / 52.2cm online — nhập kích thước cửa, giường, bàn thờ để xem cung tốt xấu và ý nghĩa từng cung.',
  alternates: { canonical: 'https://hieu.asia/thuoc-lo-ban' },
  openGraph: {
    title: 'Thước Lỗ Ban online',
    description: 'Tra cung tốt xấu cho cửa, giường, bàn thờ theo 3 loại thước Lỗ Ban.',
    url: 'https://hieu.asia/thuoc-lo-ban',
    type: 'website',
  },
};

export default function ThuocLoBanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
