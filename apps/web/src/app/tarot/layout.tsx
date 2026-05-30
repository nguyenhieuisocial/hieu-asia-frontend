import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Rút bài Tarot — gợi ý phản tư | hieu.asia',
  description:
    'Rút lá Tarot (78 lá) cho câu hỏi bạn đang phân vân — mỗi lá là một lăng kính để tự suy ngẫm. Miễn phí, không bói toán, không tiên đoán.',
  alternates: { canonical: 'https://hieu.asia/tarot' },
  openGraph: {
    title: 'Rút bài Tarot — gợi ý phản tư | hieu.asia',
    description: 'Rút lá Tarot cho điều bạn đang phân vân — gợi ý để tự suy ngẫm, không bói toán.',
    url: 'https://hieu.asia/tarot',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function TarotLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
