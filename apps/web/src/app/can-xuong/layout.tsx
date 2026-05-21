import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cân Xương Đoán Số miễn phí theo ngày giờ sinh',
  description:
    'Cân xương đoán số tự động theo ngày giờ năm sinh — bài Cân Xương cổ truyền của Đường tướng Quân Khổng Minh, có giải thích chi tiết từng lượng.',
  alternates: { canonical: 'https://hieu.asia/can-xuong' },
  openGraph: {
    title: 'Cân Xương Đoán Số · hieu.asia',
    description: 'Tính lượng xương theo Can Chi giờ–ngày–tháng–năm; bài cân và lời giải đầy đủ.',
    url: 'https://hieu.asia/can-xuong',
    type: 'website',
  },
};

export default function CanXuongLayout({ children }: { children: React.ReactNode }) {
  return children;
}
