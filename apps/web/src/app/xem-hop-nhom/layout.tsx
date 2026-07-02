import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xem hợp nhóm & gia đình (3–6 người)',
  description:
    'Thêm 3–6 người (gia đình, nhóm bạn, đội nhóm) để xem điểm hoà hợp chung, mức hợp từng cặp, vai trò mỗi người và cặp nên chú ý giao tiếp.',
  alternates: { canonical: 'https://hieu.asia/xem-hop-nhom' },
  openGraph: {
    title: 'Xem hợp cả nhóm — hieu.asia',
    description:
      'Hoà hợp nhóm/gia đình 3–6 người: điểm chung, từng cặp, vai trò và gợi ý phối hợp.',
    url: 'https://hieu.asia/xem-hop-nhom',
    type: 'website',
  },
};

export default function XemHopNhomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
