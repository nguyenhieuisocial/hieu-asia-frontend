import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  Star,
  Database,
  Brain,
  Shield,
  Cpu,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title:
    'Methodology Tử Vi — Trường phái, an sao, đại vận, lưu niên · hieu.asia',
  description:
    'Chi tiết phương pháp Tử Vi Bắc phái dùng tại hieu.asia: 24+ sao chính/phụ, cách an Mệnh-Thân-Cục, đại vận, lưu niên, và đường phân định engine vs AI.',
  alternates: { canonical: 'https://hieu.asia/methodology/tu-vi' },
  openGraph: {
    title: 'Methodology Tử Vi · hieu.asia',
    description:
      'Tử Vi Bắc phái: cách an sao, đại vận, lưu niên — và lằn ranh engine deterministic vs AI/LLM.',
    url: 'https://hieu.asia/methodology/tu-vi',
    type: 'article',
  },
};

const CHINH_TINH: { name: string; slug: string }[] = [
  { name: 'Tử Vi', slug: 'tu-vi' },
  { name: 'Thiên Cơ', slug: 'thien-co' },
  { name: 'Thái Dương', slug: 'thai-duong' },
  { name: 'Vũ Khúc', slug: 'vu-khuc' },
  { name: 'Thiên Đồng', slug: 'thien-dong' },
  { name: 'Liêm Trinh', slug: 'liem-trinh' },
  { name: 'Thiên Phủ', slug: 'thien-phu' },
  { name: 'Thái Âm', slug: 'thai-am' },
  { name: 'Tham Lang', slug: 'tham-lang' },
  { name: 'Cự Môn', slug: 'cu-mon' },
  { name: 'Thiên Tướng', slug: 'thien-tuong' },
  { name: 'Thiên Lương', slug: 'thien-luong' },
  { name: 'Thất Sát', slug: 'that-sat' },
  { name: 'Phá Quân', slug: 'pha-quan' },
];

const PHU_TINH: { name: string; slug: string }[] = [
  { name: 'Tả Phụ', slug: 'ta-phu' },
  { name: 'Hữu Bật', slug: 'huu-bat' },
  { name: 'Văn Xương', slug: 'van-xuong' },
  { name: 'Văn Khúc', slug: 'van-khuc' },
  { name: 'Khôi Việt', slug: 'khoi-viet' },
  { name: 'Lộc Tồn', slug: 'loc-ton' },
  { name: 'Kình Đà', slug: 'kinh-da' },
  { name: 'Hỏa Linh', slug: 'hoa-linh' },
  { name: 'Hoá Lộc', slug: 'hoa-loc' },
  { name: 'Hoá Kỵ', slug: 'hoa-ky' },
];

const SAO_NHO: string[] = [
  'Thiên Mã',
  'Long Trì',
  'Phượng Các',
  'Thiên Hỉ',
  'Hồng Loan',
  'Đào Hoa',
  'Thiên Khốc',
  'Thiên Hư',
  'Cô Thần',
  'Quả Tú',
  'Phục Binh',
  'Quan Phù',
  'Thanh Long',
  'Tiểu Hao',
  'Đại Hao',
  'Tử Phù',
  'Tang Môn',
  'Bạch Hổ',
  'Thiên Đức',
  'Nguyệt Đức',
  'Giải Thần',
  'Thiên Khôi',
  'Thiên Việt',
  'Thiên Quan',
  'Thiên Phúc',
  'Thai Phụ',
  'Phong Cáo',
  'Tam Thai',
  'Bát Toạ',
  'Ân Quang',
  'Thiên Quý',
  'Long Đức',
  'Nguyệt Đức quý nhân',
  'Hoa Cái',
  'Kiếp Sát',
  'Đại Sát',
  'Phi Liêm',
  'Hỉ Thần',
  'Bệnh Phù',
  'Điếu Khách',
  'Trực Phù',
  'Lưu Hà',
  'Thiên Không',
  'Địa Không',
  'Địa Kiếp',
  'Thiên Hình',
  'Thiên Diêu',
  'Đẩu Quân',
  'Tướng Quân',
  'Tấu Thư',
];

const TODAY_ISO = '2026-05-22';

const ARTICLE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'Methodology Tử Vi — Trường phái, an sao, đại vận, lưu niên · hieu.asia',
  description:
    'Phương pháp Tử Vi Bắc phái dùng tại hieu.asia: cách an Mệnh-Thân-Cục, 14 chính tinh, 10 phụ tinh, đại vận, lưu niên, lằn ranh engine vs AI.',
  inLanguage: 'vi-VN',
  datePublished: '2026-05-22',
  dateModified: TODAY_ISO,
  author: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
  publisher: {
    '@type': 'Organization',
    name: 'hieu.asia',
    url: 'https://hieu.asia',
  },
  mainEntity: {
    '@type': 'Thing',
    name: 'Tử Vi Đẩu Số (Bắc phái)',
    description:
      'Hệ thống an sao Tử Vi theo nhánh Bắc phái Trần Đoàn — Hi Di, có dị bản Tử Vân và Liễu Vô Cư Sĩ.',
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Phương pháp luận',
      item: 'https://hieu.asia/methodology',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Methodology Tử Vi',
      item: 'https://hieu.asia/methodology/tu-vi',
    },
  ],
};

export default function MethodologyTuViPage() {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/methodology" className="hover:text-gold">
              Phương pháp luận
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream/70">Methodology Tử Vi</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Methodology · Tử Vi
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-5xl">
            Tử Vi Bắc phái — cách hieu.asia an sao, tính đại vận, lưu niên
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/75 sm:text-lg">
            Trang này nói rõ trường phái Tử Vi mà engine hieu.asia dùng, danh sách sao,
            công thức an Mệnh-Thân-Cục, cách tính đại vận, lưu niên — và đường phân định
            phần nào do engine deterministic làm, phần nào do AI/LLM diễn giải.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-gold/90">
              <BookOpen className="h-3.5 w-3.5" aria-hidden /> Bắc phái Trần Đoàn
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-ink/40 px-3 py-1 text-cream/75">
              <Star className="h-3.5 w-3.5" aria-hidden /> 14 chính + 10 phụ + 90 sao nhỏ
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-ink/40 px-3 py-1 text-cream/75">
              <Cpu className="h-3.5 w-3.5" aria-hidden /> Engine deterministic
            </span>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl space-y-6 px-6 pb-20">
          {/* 1. Trường phái */}
          <Card id="truong-phai" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl text-cream sm:text-2xl">
                <BookOpen className="h-5 w-5 text-gold" aria-hidden /> Trường phái dùng
                tại hieu.asia
              </CardTitle>
              <CardDescription className="text-cream/60">
                Bắc phái — nhánh Trần Đoàn (Hi Di tiên sinh), có tham chiếu Tử Vân và Liễu
                Vô Cư Sĩ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              <p>
                Engine của hieu.asia chạy theo <strong>Bắc phái</strong> (Tử Vi Đẩu Số
                phương Bắc), nhánh chủ yếu theo <em>Trần Đoàn — Hi Di tiên sinh</em> và
                các nhánh tiếp nối như <em>Tử Vân</em>, <em>Liễu Vô Cư Sĩ</em>.
              </p>
              <p>
                Lý do chọn Bắc phái: hệ thống an sao chặt chẽ, có nhiều tư liệu để kiểm
                chứng được, ít phụ thuộc vào "khẩu quyết" truyền miệng — phù hợp với engine
                deterministic.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-cream/85">
                <strong className="text-gold">Caveat.</strong> Với một số luận điểm có dị
                biệt giữa <em>phái Trung Châu</em>, <em>Tử Vân</em>, <em>Liễu Vô</em> —
                chúng tôi ghi rõ ngay trong báo cáo, kèm chú thích chỗ nào engine theo
                Bắc phái mainstream và chỗ nào có dị bản.
              </p>
            </CardContent>
          </Card>

          {/* 2. Danh sách sao */}
          <Card id="danh-sach-sao" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl text-cream sm:text-2xl">
                <Star className="h-5 w-5 text-gold" aria-hidden /> Danh sách sao sử dụng
              </CardTitle>
              <CardDescription className="text-cream/60">
                14 chính tinh + 10 phụ tinh chính + ~90 sao phụ/sao nhỏ. Tổng 114 sao
                trong engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-cream/80 sm:text-base">
              <div>
                <h3 className="mb-2 font-heading text-base text-cream">
                  14 chính tinh
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {CHINH_TINH.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/tu-vi/sao/${s.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-xs text-gold/90 hover:bg-gold/10"
                      >
                        {s.name}
                        <ChevronRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-heading text-base text-cream">
                  10 phụ tinh chính
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {PHU_TINH.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/tu-vi/sao/${s.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-cream/20 bg-ink/40 px-3 py-1 text-xs text-cream/85 hover:border-gold/40 hover:text-gold"
                      >
                        {s.name}
                        <ChevronRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-heading text-base text-cream">
                  Các sao phụ và sao nhỏ
                </h3>
                <p className="text-cream/70">{SAO_NHO.join(' · ')}</p>
                <p className="mt-3 rounded-lg border border-cream/10 bg-ink/60 p-3 text-xs text-cream/65">
                  Đầy đủ 114 sao có trong engine; hiển thị tuỳ vào tầm quan trọng từng
                  cung — sao nào ảnh hưởng mạnh tới cung thì hiện rõ, sao "trang trí" thì
                  ẩn vào chi tiết.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. An Mệnh & Thân */}
          <Card id="menh-than" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-cream sm:text-2xl">
                Cách an cung Mệnh và Thân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              <p>
                <strong>Cung Mệnh:</strong> tính từ <em>tháng âm</em> sinh và <em>giờ</em>{' '}
                sinh, đếm theo trình tự 12 địa chi (Dần → Mão → Thìn → ...) theo bí quyết
                "tháng âm lùi, giờ tiến tới" — đếm ngược tháng từ cung Dần rồi tiến tới
                theo giờ sinh để xác định cung Mệnh.
              </p>
              <p>
                <strong>Cung Thân:</strong> tính theo công thức song hành tháng + giờ
                (tiến cả hai). Với người sinh tháng cuối hoặc giờ cuối, Thân thường khác
                Mệnh — và đây chính là khi "Mệnh nói một, Thân nói khác", dấu hiệu chia
                tách bản chất bên trong và biểu hiện bên ngoài.
              </p>
              <p>
                <strong>Cục</strong> (Kim / Mộc / Thủy / Hỏa / Thổ): xác định qua{' '}
                <em>thiên can năm sinh</em> kết hợp với <em>cung Mệnh</em> — bảng nạp âm
                Lục Thập Hoa Giáp. Cục quyết định <em>số ngày</em> dùng để an Tử Vi và
                tuổi khởi đại vận.
              </p>
            </CardContent>
          </Card>

          {/* 4. An chính tinh */}
          <Card id="an-chinh-tinh" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-cream sm:text-2xl">
                Cách an chính tinh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              <p>
                <strong>Tử Vi</strong> an theo <em>Cục + ngày âm</em>: số ngày sinh chia
                cho Cục số (Thủy 2 cục → chia 2, Mộc 3 cục → chia 3, ...), thương quyết
                định vị trí Tử Vi trên bảng 12 cung.
              </p>
              <p>
                Sau khi xác định Tử Vi, <strong>13 chính tinh còn lại</strong> an theo bảng
                cố định quanh Tử Vi: Thiên Cơ ngay trước Tử Vi, Thái Dương cách 2 cung,
                Vũ Khúc cách 3 cung, Thiên Đồng cách 4 cung, Liêm Trinh cách 5 cung; Thiên
                Phủ đối xứng với Tử Vi qua trục Dần-Thân, kéo theo Thái Âm, Tham Lang, Cự
                Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-cream/85">
                <strong className="text-gold">Caveat.</strong> Hệ thống không tự nội suy
                nếu ngày âm {'>'} 30 trong tháng nhuận — engine có check và sẽ trả lỗi
                yêu cầu user xác nhận lại ngày âm. Tránh trường hợp "đoán" ngày 31 thành
                ngày 1 tháng sau và sai toàn bộ lá số.
              </p>
            </CardContent>
          </Card>

          {/* 5. Phụ tinh + Tứ Hoá */}
          <Card id="phu-tinh-tu-hoa" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-cream sm:text-2xl">
                Cách an phụ tinh và Tứ Hoá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              <p>
                <strong>Phụ tinh</strong> an theo <em>can/chi năm</em>, <em>tháng âm</em>,
                hoặc <em>giờ</em> sinh, tuỳ từng nhóm sao. Ví dụ Tả Phụ – Hữu Bật an theo
                tháng âm; Văn Xương – Văn Khúc an theo giờ; Khôi – Việt an theo thiên can
                năm; Lộc Tồn – Kình – Đà an theo thiên can năm; Hoả – Linh an theo địa chi
                năm và giờ.
              </p>
              <p>
                <strong>Tứ Hoá</strong> (Hoá Lộc / Hoá Quyền / Hoá Khoa / Hoá Kỵ) — chỉ an
                theo <em>thiên can năm sinh</em>. Mỗi can có 4 sao tương ứng hoá, ví dụ
                can Giáp → Hoá Lộc tại Liêm Trinh, Hoá Quyền tại Phá Quân, Hoá Khoa tại
                Vũ Khúc, Hoá Kỵ tại Thái Dương.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-cream/85">
                <strong className="text-gold">Caveat — dị biệt giữa nhánh.</strong> Phái{' '}
                <em>Tử Vân</em> dùng <em>can ngày</em> để an Tứ Hoá (tạo ra "Tứ Hoá phi
                tinh"). Phái <em>Liễu Vô Cư Sĩ</em> dùng cả <em>can năm</em> và{' '}
                <em>can ngày</em> đối chiếu chéo. Engine hieu.asia mặc định dùng{' '}
                <em>can năm</em> (Bắc phái mainstream) và sẽ note rõ trong báo cáo nếu
                user muốn so sánh với cách của Tử Vân.
              </p>
            </CardContent>
          </Card>

          {/* 6. Đại vận */}
          <Card id="dai-van" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-cream sm:text-2xl">
                Cách tính Đại Vận
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              <p>
                Mỗi <strong>đại vận = 10 năm</strong>; vận đầu tiên bắt đầu từ{' '}
                <em>cung Mệnh</em>, sau đó di chuyển sang cung kế tiếp.
              </p>
              <p>
                <strong>Thuận / nghịch:</strong> chiều đi của đại vận dựa trên kết hợp
                âm-dương của thiên can năm sinh + giới tính. Nam Dương / Nữ Âm đi{' '}
                <em>thuận</em>; Nam Âm / Nữ Dương đi <em>nghịch</em>.
              </p>
              <p>
                <strong>Tuổi khởi đại vận:</strong> bằng <em>Cục số</em> (Thuỷ 2 → 2 tuổi,
                Mộc 3 → 3 tuổi, ..., Thổ 5 → 5 tuổi, Kim 4 → 4 tuổi, Hoả 6 → 6 tuổi).
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-cream/85">
                <strong className="text-gold">Caveat.</strong> Tuổi khởi đại vận có dị
                biệt giữa các phái: một số nhánh dùng 5/6/7 tuổi cố định. Engine
                hieu.asia dùng <em>Cục số ÷ 10</em> (chính xác hơn cho thời điểm chuyển
                vận, nhất là khi đối chiếu với tiểu vận).
              </p>
            </CardContent>
          </Card>

          {/* 7. Lưu niên */}
          <Card id="luu-nien" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-cream sm:text-2xl">
                Cách tính Lưu Niên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              <p>
                <strong>Lưu niên</strong> = cung mà <em>địa chi năm hiện tại</em> trùng
                với địa chi đặt tại cung đó trên lá số gốc. Ví dụ năm Ngọ — lưu niên rơi
                vào cung có địa chi Ngọ.
              </p>
              <p>
                <strong>Lưu nguyệt</strong> = cung mà <em>địa chi tháng âm hiện tại</em>{' '}
                trùng với địa chi cung. Lưu nhật, lưu thời tính tương tự nhưng độ ảnh
                hưởng giảm dần.
              </p>
              <p className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-cream/85">
                <strong className="text-gold">Caveat.</strong> Lưu niên chỉ <em>gợi mở
                chủ đề năm</em> — không quyết định cụ thể "việc gì xảy ra". Engine sẽ tô
                đậm chủ đề năm trong báo cáo, nhưng luôn kèm câu "đây là bối cảnh, không
                phải kết quả".
              </p>
            </CardContent>
          </Card>

          {/* 8. AI vs Engine */}
          <Card id="ai-vs-engine" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl text-cream sm:text-2xl">
                <Shield className="h-5 w-5 text-gold" aria-hidden /> AI làm gì, engine
                làm gì
              </CardTitle>
              <CardDescription className="text-cream/60">
                Lằn ranh rõ ràng — không có chuyện AI "an sao theo cảm hứng".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-cream/80 sm:text-base">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-cream/15 bg-ink/60 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-heading text-base text-cream">
                    <Database className="h-4 w-4 text-gold" aria-hidden /> Engine
                    deterministic
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-cream/80">
                    <li>Đổi dương lịch ↔ âm lịch</li>
                    <li>Tính Can Chi năm/tháng/ngày/giờ</li>
                    <li>An cung Mệnh, Thân, Cục</li>
                    <li>An 14 chính tinh + 10 phụ tinh + ~90 sao nhỏ</li>
                    <li>Tính Tứ Hoá theo can năm</li>
                    <li>Tính đại vận, lưu niên, lưu nguyệt</li>
                  </ul>
                  <p className="mt-3 text-xs text-cream/60">
                    Không có yếu tố LLM. Cùng input → cùng output, mọi lúc.
                  </p>
                </div>
                <div className="rounded-lg border border-cream/15 bg-ink/60 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-heading text-base text-cream">
                    <Brain className="h-4 w-4 text-gold" aria-hidden /> AI / LLM
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-cream/80">
                    <li>Diễn giải tổ hợp sao + cung</li>
                    <li>Ghép bối cảnh user (mục tiêu, tình huống)</li>
                    <li>Soạn báo cáo tiếng Việt mạch lạc</li>
                    <li>Trả lời Mentor: hỏi-đáp tự phản tư</li>
                    <li>Gợi ý câu hỏi kiểm chứng</li>
                  </ul>
                  <p className="mt-3 text-xs text-cream/60">
                    AI đọc chart JSON từ engine, không tự tạo ra sao.
                  </p>
                </div>
              </div>
              <p className="rounded-lg border border-amber-700/40 bg-amber-900/15 p-3 text-cream/90">
                <strong className="text-amber-200">Hard rule.</strong> AI không được tự
                an sao. Mọi mention sao trong output phải có trong chart JSON do engine
                xuất. Có một validator chặn output bịa sao — nếu AI gọi tên sao không
                tồn tại trong chart, response bị reject và regenerate.
              </p>
            </CardContent>
          </Card>

          {/* 9. Giới hạn */}
          <Card id="gioi-han" className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-cream sm:text-2xl">
                Giới hạn và sự thật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-cream/80 sm:text-base">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Tử Vi <strong>không tiên tri</strong> tai hoạ hay chết chóc. Mọi luận
                  về "sao Tử/Bệnh/Hung" đều là <em>chủ đề chú ý</em>, không phải sự kiện
                  cố định.
                </li>
                <li>
                  Giờ sinh không rõ → độ chắc chắn giảm. Engine sẽ giảm confidence và
                  Mentor sẽ ưu tiên hỏi lại thay vì đoán cứng. Xem trang{' '}
                  <Link
                    href="/onboarding/situation"
                    className="text-gold underline-offset-4 hover:underline"
                  >
                    /onboarding/situation
                  </Link>{' '}
                  cho cách hồi cứu giờ sinh từ ký ức gia đình.
                </li>
                <li>
                  Lá số <strong>không thay thế</strong> bác sĩ, luật sư, hay cố vấn tài
                  chính có chứng chỉ. Khi vấn đề nghiêm trọng, gặp chuyên gia.
                </li>
                <li>
                  <strong>Quyền tự quyết.</strong> Bạn quyết, không phải lá số. hieu.asia
                  chỉ cung cấp một góc nhìn để bạn đối chiếu với trực giác và dữ kiện
                  của mình.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/sample-report"
              className="group rounded-xl border border-cream/15 bg-ink/40 p-5 transition hover:border-gold/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
                Xem trước
              </p>
              <h3 className="mt-2 font-heading text-lg text-cream">
                Xem báo cáo mẫu
              </h3>
              <p className="mt-2 text-sm text-cream/70">
                Một lá số được luận đầy đủ — để bạn biết kết quả thật trông như thế nào.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold group-hover:underline">
                /sample-report <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href="/onboarding/topic"
              className="group rounded-xl border border-gold/30 bg-gold/10 p-5 transition hover:border-gold/60 hover:bg-gold/15"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
                Bắt đầu
              </p>
              <h3 className="mt-2 font-heading text-lg text-cream">
                Lập lá số của bạn
              </h3>
              <p className="mt-2 text-sm text-cream/75">
                Trả lời 4 câu hỏi ngắn để engine an sao và soạn báo cáo riêng cho bạn.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold group-hover:underline">
                /onboarding/topic <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
