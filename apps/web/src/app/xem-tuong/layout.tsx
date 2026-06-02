import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xem Chỉ Tay & Tướng Mặt miễn phí — AI phân tích ảnh thật',
  description:
    'Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách và ứng xử theo tướng số học. Không lưu ảnh, không bói toán.',
  alternates: { canonical: 'https://hieu.asia/xem-tuong' },
  openGraph: {
    title: 'Xem Chỉ Tay & Tướng Mặt · hieu.asia',
    description:
      'Phân tích chỉ tay và tướng mặt bằng AI — xu hướng tính cách, ứng xử, điểm mạnh. Ảnh không được lưu trữ.',
    url: 'https://hieu.asia/xem-tuong',
    type: 'website',
  },
};

export default function XemTuongLayout({ children }: { children: React.ReactNode }) {
  return children;
}
