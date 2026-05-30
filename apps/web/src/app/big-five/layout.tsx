import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Trắc nghiệm Big Five & DISC — hieu.asia',
  description:
    'Đo 5 chiều tính cách (Big Five / OCEAN) và 4 phong cách hành vi (DISC) trong một bài 36 câu. Miễn phí, không cần đăng ký, không định mệnh hoá.',
  alternates: { canonical: 'https://hieu.asia/big-five' },
  openGraph: {
    title: 'Trắc nghiệm Big Five & DISC — hieu.asia',
    description:
      'Một bài 36 câu đo 5 chiều tính cách Big Five và 4 phong cách hành vi DISC. Khoa học, rõ ràng.',
    url: 'https://hieu.asia/big-five',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function BigFiveLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
