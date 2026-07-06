import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { EOSIDIN } from '@/components/learn/EOSIDIN';
import { JsonLd } from '@/components/seo/JsonLd';
import { itemList, breadcrumb } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Học huyền học hiện đại',
  description:
    'Tử Vi, Bát Tự, MBTI, Big Five, DISC, Enneagram, Tarot, Kinh Dịch, chiêm tinh, thần số, con giáp, sao hạn… 18 chủ đề, infographic trực quan, ngôn ngữ Việt.',
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
    href: '/learn/disc',
    title: 'DISC — 4 nhóm hành vi',
    subtitle: 'Tâm lý — William Marston',
    blurb: '4 thiên hướng: Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C).',
  },
  {
    href: '/learn/enneagram',
    title: 'Enneagram — 9 nhóm',
    subtitle: 'Tâm lý — 3 trung tâm',
    blurb: '9 nhóm theo động lực sâu (điều bạn sợ & khao khát), chia 3 trung tâm.',
  },
  {
    href: '/learn/palm',
    title: 'Xem chỉ tay',
    subtitle: 'Phổ quát',
    blurb: '7 đường chính: tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, kim tinh.',
  },
  {
    href: '/learn/kinh-dich',
    title: 'Kinh Dịch (I Ching)',
    subtitle: 'Đông phương — 64 quẻ',
    blurb: 'Gieo quẻ soi tình huống: 64 quẻ, 384 hào, luật hào động Chu Hy.',
  },
  {
    href: '/learn/tarot',
    title: 'Tarot — 78 lá',
    subtitle: 'Tây phương — phản tư',
    blurb: '22 Ẩn Chính + 56 Ẩn Phụ; lăng kính phản tư bản thân, không phán số mệnh.',
  },
  {
    href: '/learn/phong-thuy',
    title: 'Phong Thủy ứng dụng',
    subtitle: 'Đông phương — Bát Trạch',
    blurb: 'Hướng hợp tuổi (Bát Trạch), ngũ hành, chọn ngày giờ, thước Lỗ Ban.',
  },
  {
    href: '/learn/chiem-tinh',
    title: 'Chiêm tinh phương Tây',
    subtitle: 'Tây phương — bản đồ sao',
    blurb: '12 cung hoàng đạo, hành tinh, cung Mọc, 12 nhà và các góc hợp.',
  },
  {
    href: '/learn/hop-tuoi',
    title: 'Hợp tuổi (12 con giáp)',
    subtitle: 'Đông phương — Can Chi',
    blurb: 'Tam Hợp / Lục Hợp / Xung / Hại + nạp âm; giọng dung hòa, không phán khắc.',
  },
  {
    href: '/learn/con-giap',
    title: '12 Con Giáp',
    subtitle: 'Đông phương — Địa Chi',
    blurb: 'Tính cách, sở trường, tam hợp & tứ hành xung của 12 con giáp — tham khảo, không phán.',
  },
  {
    href: '/learn/sao-han',
    title: 'Sao Hạn (Cửu Diệu)',
    subtitle: 'Đông phương — 9 sao',
    blurb: '9 sao chiếu mệnh theo tuổi + giới tính; góc nhìn tham khảo, không mê tín.',
  },
  {
    href: '/learn/trach-cat',
    title: 'Trạch Cát — chọn ngày giờ',
    subtitle: 'Đông phương — Trạch cát',
    blurb: 'Chọn ngày giờ tốt cho cưới hỏi, động thổ, khai trương: hoàng đạo, 12 trực, giờ đẹp — tham khảo.',
  },
  {
    href: '/learn/can-xuong',
    title: 'Cân Xương Đoán Số',
    subtitle: 'Đông phương — Viên Thiên Cang',
    blurb: 'Cân “trọng lượng” năm–tháng–ngày–giờ sinh ra bài thơ vận số; đọc như lời động viên, không phán.',
  },
  {
    href: '/learn/dat-ten-ngu-hanh',
    title: 'Đặt Tên Theo Ngũ Hành',
    subtitle: 'Đông phương — Ngũ hành',
    blurb: 'Chọn tên bổ hành còn thiếu trong Bát Tự của bé; nghĩa đẹp + âm hay là chính, không máy móc.',
  },
];

export default function LearnLandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <JsonLd
        data={[
          itemList(TOPICS.map((t) => ({ name: t.title, url: t.href }))),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Học huyền học', url: '/learn' },
          ]),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <span className="text-muted-foreground">Học huyền học</span>
      </nav>

      <section className="text-center">
        <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
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
          và bạn xứng đáng biết góc nhìn đó được dựng nên từ đâu. Các khái niệm dưới đây là nền
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
                <CardDescription className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
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
            7 bước hieu.asia dùng để chuyển dữ liệu thô thành góc nhìn bạn có thể hành động.
          </p>
        </div>
        <EOSIDIN />
      </section>

      {/* Đóng vòng học → làm: hiểu cội nguồn rồi thì áp lên chính mình.
          CTA lập lá số + link sang các công cụ thật (chống trang chỉ-đọc). */}
      <section className="mt-16 rounded-2xl border border-gold/25 bg-card/40 px-6 py-10 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Hiểu rồi — giờ soi vào{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">chính bạn</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Lập lá số miễn phí trong 30 giây và đọc báo cáo của mình với đúng những khái niệm
          bạn vừa tìm hiểu — không cần tài khoản.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/onboarding"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold-gradient px-8 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Lập lá số miễn phí
          </Link>
          <Link
            href="/cong-cu"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold/30 px-8 py-3 text-sm font-semibold text-gold-700 transition-colors hover:border-gold/60 hover:text-gold"
          >
            Xem tất cả công cụ
          </Link>
        </div>
        <nav aria-label="Công cụ liên quan" className="mt-6 text-sm text-muted-foreground">
          Thử ngay:{' '}
          <Link href="/la-so-tu-vi" className="text-gold-700 hover:text-gold hover:underline">
            Lá số Tử Vi
          </Link>
          {' · '}
          <Link href="/mbti" className="text-gold-700 hover:text-gold hover:underline">
            Trắc nghiệm MBTI
          </Link>
          {' · '}
          <Link href="/xem-tuong" className="text-gold-700 hover:text-gold hover:underline">
            Xem chỉ tay
          </Link>
        </nav>
      </section>
    </main>
  );
}
