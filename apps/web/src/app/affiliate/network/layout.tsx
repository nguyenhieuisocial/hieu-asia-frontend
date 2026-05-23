import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mạng lưới affiliate (L1/L2/L3)',
  description:
    'Xem mạng lưới affiliate đa tầng của bạn — L1 30%, L2 5%, L3 2%. Tuân thủ Nghị định 40/2018/NĐ-CP.',
  alternates: { canonical: 'https://hieu.asia/affiliate/network' },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
