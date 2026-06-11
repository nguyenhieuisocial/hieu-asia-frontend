import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { EOSIDIN } from '@/components/learn/EOSIDIN';

export const metadata: Metadata = {
  title: 'Học huyền học hiện đại',
  description:
    'Tìm hiểu Tử Vi, Bát Tự, Thần Số Học, MBTI và xem chỉ tay — kiến thức nền tảng cho người mới, infographic trực quan, ngôn ngữ Việt dễ hiểu.',
  alternates: { canonical: 'https://hieu.asia/learn' },
};

interface LearnTopic {
  href: string;
  title: string;
  subtitle: string;
  blurb: string;
}

const TOPICS: readonly LearnTopic[] = [
  {
    href: '/learn/tu-vi',
    title: 'Tử Vi 12 cung',
    subtitle: 'Đông phương — Trung Hoa',
    blurb: 'Lá số 12 cung phản ánh các lĩnh vực đời sống: Mệnh, Tài, Phu Thê, Quan Lộc...',
  },
  {
    href: '/learn/bat-tu',
    title: 'Bát Tự Tứ Trụ',
    subtitle: 'Đông phương — Trung Hoa',
    blurb: '4 trụ (Năm/Tháng/Ngày/Giờ) với Thiên Can + Địa Chi xác định mệnh cách.',
  },
  {
    href: '/learn/than-so-hoc',
    title: 'Thần Số Học',
    subtitle: 'Tây phương — Pythagoras',
    blurb: 'Phép tính số chủ đạo từ ngày sinh và tên — bản đồ tính cách & sứ mệnh.',
  },
  {
    href: '/learn/mbti',
    title: 'MBTI 16 loại tính cách',
    subtitle: 'Tây phương — Carl Jung',
    blurb: '4 trục: I/E, N/S, T/F, J/P tạo nên 16 nhóm tính cách phân loại tâm lý.',
  },
  {
    href: '/learn/big-five',
    title: 'Big Five (OCEAN)',
    subtitle: 'Tây phương — Khoa học tính cách',
    blurb: '5 chiều liên tục: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc.',
  },
  {
    href: '/learn/palm',
    title: 'Xem chỉ tay',
    subtitle: 'Phổ quát',
    blurb: '7 đường chính: tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, kim tinh.',
  },
];

export default function LearnLandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted-foreground">Học huyền học</span>
      </nav>

      <section className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-700">
          Học huyền học
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          Hiểu cội nguồn trước khi{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            hiểu chính mình
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Mỗi báo cáo tại hieu.asia không phải là phán quyết định mệnh. Đó là một góc nhìn —
          và bạn xứng đáng biết góc nhìn đó được dựng nên từ đâu. 5 khái niệm dưới đây là nền
          tảng tối thiểu để bạn đọc báo cáo của mình một cách có ý thức.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <Card className="h-full border-border bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/40 group-hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-gold-700 group-hover:text-gold">
                  {t.title}
                </CardTitle>
                <CardDescription className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {t.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                <span className="mt-4 inline-block whitespace-nowrap text-xs font-semibold text-gold-700 group-hover:text-gold">
                  Đọc giải thích →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <div className="mb-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Phương pháp EOSIDIN
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            7 bước hieu.asia dùng để chuyển dữ liệu thô thành insight có thể hành động.
          </p>
        </div>
        <EOSIDIN />
      </section>
    </main>
  );
}
