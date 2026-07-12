import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { EOSIDIN } from '@/components/learn/EOSIDIN';
import { JsonLd } from '@/components/seo/JsonLd';
import { itemList, breadcrumb } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Học huyền học & khoa học tính cách',
  description:
    'Tử Vi, Bát Tự, Kinh Dịch, chiêm tinh, Tarot, thần số cùng MBTI, Big Five, DISC, Enneagram — 18 chủ đề chia 4 nhóm, đọc ba tầng độ sâu và tự kiểm tra bằng quiz.',
  alternates: { canonical: 'https://hieu.asia/learn' },
};

interface LearnTopic {
  href: string;
  title: string;
  subtitle: string;
  blurb: string;
}

interface LearnCluster {
  id: string;
  heading: string;
  /** Một câu định vị trung thực cho cả nhóm (huyền học ≠ tâm lý học). */
  positioning: string;
  topics: readonly LearnTopic[];
}

// 4 cụm phân theo BẢN CHẤT bộ môn, không gộp chung nhãn. Điểm mấu chốt: nhóm
// tâm lý là mô hình khoa học hành vi, KHÔNG phải huyền học — nhãn phải nói đúng.
const CLUSTERS: readonly LearnCluster[] = [
  {
    id: 'dong-phuong',
    heading: 'Đông phương',
    positioning:
      'Các bộ môn gốc Trung Hoa, tính trên can chi, ngũ hành và âm dương. Đọc như truyền thống văn hóa và cách soi mình, không phải phép đo khoa học.',
    topics: [
      {
        href: '/learn/tu-vi',
        title: 'Tử Vi 12 cung',
        subtitle: 'Đông phương · Trung Hoa',
        blurb: 'Lá số 12 cung phản ánh các lĩnh vực đời sống: Mệnh, Tài, Phu Thê, Quan Lộc...',
      },
      {
        href: '/learn/bat-tu',
        title: 'Bát Tự Tứ Trụ',
        subtitle: 'Đông phương · Tứ Trụ',
        blurb: '4 trụ (Năm/Tháng/Ngày/Giờ) với Thiên Can + Địa Chi xác định mệnh cách.',
      },
      {
        href: '/learn/kinh-dich',
        title: 'Kinh Dịch (I Ching)',
        subtitle: 'Đông phương · 64 quẻ',
        blurb: 'Gieo quẻ soi tình huống: 64 quẻ, 384 hào, luật hào động Chu Hy.',
      },
      {
        href: '/learn/phong-thuy',
        title: 'Phong Thủy ứng dụng',
        subtitle: 'Đông phương · Bát Trạch',
        blurb: 'Hướng hợp tuổi (Bát Trạch), ngũ hành, chọn ngày giờ, thước Lỗ Ban.',
      },
      {
        href: '/learn/hop-tuoi',
        title: 'Hợp tuổi (12 con giáp)',
        subtitle: 'Đông phương · Can Chi',
        blurb: 'Tam Hợp / Lục Hợp / Xung / Hại + nạp âm; giọng dung hòa, không phán khắc.',
      },
      {
        href: '/learn/con-giap',
        title: '12 Con Giáp',
        subtitle: 'Đông phương · Địa Chi',
        blurb: 'Tính cách, sở trường, tam hợp & tứ hành xung của 12 con giáp — tham khảo, không phán.',
      },
      {
        href: '/learn/sao-han',
        title: 'Sao Hạn (Cửu Diệu)',
        subtitle: 'Đông phương · Cửu Diệu',
        blurb: '9 sao chiếu mệnh theo tuổi + giới tính; góc nhìn tham khảo, không mê tín.',
      },
      {
        href: '/learn/trach-cat',
        title: 'Trạch Cát — chọn ngày giờ',
        subtitle: 'Đông phương · Chọn ngày',
        blurb: 'Chọn ngày giờ tốt cho cưới hỏi, động thổ, khai trương: hoàng đạo, 12 trực, giờ đẹp — tham khảo.',
      },
      {
        href: '/learn/can-xuong',
        title: 'Cân Xương Đoán Số',
        subtitle: 'Đông phương · Viên Thiên Cang',
        blurb: 'Cân “trọng lượng” năm–tháng–ngày–giờ sinh ra bài thơ vận số; đọc như lời động viên, không phán.',
      },
      {
        href: '/learn/dat-ten-ngu-hanh',
        title: 'Đặt Tên Theo Ngũ Hành',
        subtitle: 'Đông phương · Ngũ hành',
        blurb: 'Chọn tên bổ hành còn thiếu trong Bát Tự của bé; nghĩa đẹp + âm hay là chính, không máy móc.',
      },
    ],
  },
  {
    id: 'phuong-tay',
    heading: 'Phương Tây',
    positioning:
      'Chiêm tinh dựng bản đồ thiên thể, thần số học rút từ con số, Tarot đọc qua biểu tượng. Dùng để phản tư, không phải để tiên tri.',
    topics: [
      {
        href: '/learn/chiem-tinh',
        title: 'Chiêm tinh phương Tây',
        subtitle: 'Phương Tây · Bản đồ sao',
        blurb: '12 cung hoàng đạo, hành tinh, cung Mọc, 12 nhà và các góc hợp.',
      },
      {
        href: '/learn/tarot',
        title: 'Tarot — 78 lá',
        subtitle: 'Phương Tây · 78 lá',
        blurb: '22 Ẩn Chính + 56 Ẩn Phụ; lăng kính phản tư bản thân, không phán số mệnh.',
      },
      {
        href: '/learn/than-so-hoc',
        title: 'Thần Số Học',
        subtitle: 'Phương Tây · Pythagoras',
        blurb: 'Phép tính số chủ đạo từ ngày sinh và tên — bản đồ tính cách & sứ mệnh.',
      },
    ],
  },
  {
    id: 'tam-ly-hien-dai',
    heading: 'Tâm lý hiện đại',
    positioning:
      'Đây là mô hình tâm lý học, không phải huyền học. Chúng đo thiên hướng qua bảng hỏi: Big Five có nền học thuật vững, còn MBTI và DISC bị phê bình về độ ổn định khi làm lại nhiều lần.',
    topics: [
      {
        href: '/learn/mbti',
        title: 'MBTI 16 loại tính cách',
        subtitle: 'Tâm lý · Carl Jung',
        blurb: '4 trục: I/E, N/S, T/F, J/P tạo nên 16 nhóm tính cách phân loại tâm lý.',
      },
      {
        href: '/learn/big-five',
        title: 'Big Five (OCEAN)',
        subtitle: 'Tâm lý · OCEAN',
        blurb: '5 chiều liên tục: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc.',
      },
      {
        href: '/learn/disc',
        title: 'DISC — 4 nhóm hành vi',
        subtitle: 'Tâm lý · William Marston',
        blurb: '4 thiên hướng: Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C).',
      },
      {
        href: '/learn/enneagram',
        title: 'Enneagram — 9 nhóm',
        subtitle: 'Tâm lý · 9 nhóm',
        blurb: '9 nhóm theo động lực sâu (điều bạn sợ & khao khát), chia 3 trung tâm.',
      },
    ],
  },
  {
    id: 'tuong-hoc',
    heading: 'Tướng học',
    positioning:
      'Xem chỉ tay là tập tục quan sát lâu đời, chưa có bằng chứng khoa học. Trình bày để bạn hiểu hệ hình tượng của nó và đọc như văn hóa dân gian.',
    topics: [
      {
        href: '/learn/palm',
        title: 'Xem chỉ tay',
        subtitle: 'Tướng học · Chiromancy',
        blurb: '7 đường chính: tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ tinh, kim tinh.',
      },
    ],
  },
];

// Phẳng hoá 18 chủ đề cho itemList JSON-LD (giữ đủ 18 để AI/Google đọc được
// cả danh mục, không rụng chủ đề nào khi chia nhóm hiển thị).
const ALL_TOPICS: readonly LearnTopic[] = CLUSTERS.flatMap((c) => c.topics);

export default function LearnLandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <JsonLd
        data={[
          itemList(ALL_TOPICS.map((t) => ({ name: t.title, url: t.href }))),
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
          Học huyền học & khoa học tính cách
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
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cách dùng khu Học: đọc bài, chỉnh độ sâu theo ba tầng (dễ hiểu đến chuyên sâu),
          rồi tự kiểm tra lại bằng phần hỏi đáp và câu hỏi ôn ở cuối mỗi bài.
        </p>
      </section>

      <section className="mt-12 space-y-12">
        {CLUSTERS.map((cluster) => (
          <div key={cluster.id}>
            <div className="mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                {cluster.heading}
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {cluster.positioning}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cluster.topics.map((t) => (
                <Link key={t.href} href={t.href} className="group">
                  <Card className="h-full border-border bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/40 group-hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)] group-focus-within:-translate-y-1 group-focus-within:border-gold/40">
                    <CardHeader>
                      <CardTitle className="font-heading text-lg text-gold-700 group-hover:text-gold group-focus-within:text-gold">
                        {t.title}
                      </CardTitle>
                      <CardDescription className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                        {t.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                      <span className="mt-4 inline-block whitespace-nowrap text-xs font-semibold text-gold-700 group-hover:text-gold group-focus-within:text-gold">
                        Đọc giải thích →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
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
