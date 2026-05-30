import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Trắc nghiệm DISC & Big Five — hieu.asia',
  description:
    'Đo 4 phong cách hành vi DISC (Quyết đoán · Ảnh hưởng · Kiên định · Tuân thủ) kèm Big Five trong một bài 36 câu. Miễn phí, không cần đăng ký.',
  alternates: { canonical: 'https://hieu.asia/disc' },
  openGraph: {
    title: 'Trắc nghiệm DISC & Big Five — hieu.asia',
    description: 'Đo 4 phong cách hành vi DISC kèm Big Five trong một bài 36 câu. Rõ ràng, không định mệnh.',
    url: 'https://hieu.asia/disc',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function DiscLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
