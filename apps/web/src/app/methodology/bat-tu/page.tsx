import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  BookOpen,
  Columns3,
  Sparkles,
  Flame,
  Wrench,
  Map,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Bát Tự — Beta · hieu.asia',
  description:
    'Bát Tự ở hieu.asia hiện ở trạng thái beta — engine tính được 4 trụ, thập thần và ngũ hành nhưng chỉ đóng vai trò lớp đối chiếu phụ với Tử Vi, không tự quyết định kết luận.',
  alternates: { canonical: 'https://hieu.asia/methodology/bat-tu' },
  openGraph: {
    title: 'Bát Tự — Beta · hieu.asia',
    description:
      'Trạng thái beta, khái niệm cơ bản, limitations cụ thể và roadmap graduation.',
    url: 'https://hieu.asia/methodology/bat-tu',
    type: 'article',
  },
};

const CURRENT_STATUS = [
  'Engine đã tính được: 4 trụ (năm/tháng/ngày/giờ), thập thần, ngũ hành mệnh nạp âm.',
  'Vai trò hiện tại: lớp đối chiếu phụ với Tử Vi.',
  'KHÔNG dùng để quyết định kết luận chính.',
  'Khi nào graduate sang production: cần golden dataset 100 lá số được validate bởi chuyên gia Bát Tự.',
];

const BASICS = [
  'Bát Tự (八字) = "Tám chữ" = bộ Can-Chi của 4 trụ năm/tháng/ngày/giờ sinh.',
  'Khác Tử Vi: Bát Tự không có 12 cung + sao, mà phân tích qua quan hệ ngũ hành + thập thần (10 vai trò xã hội của trụ ngày).',
  'Trục thời gian: đại vận 10 năm bắt đầu từ trụ tháng (chiều thuận/nghịch theo giới + can năm).',
];

const PILLARS: { pillar: string; represents: string; relation: string }[] = [
  {
    pillar: 'Trụ năm',
    represents: 'Tổ tiên, bối cảnh sinh',
    relation: 'Gốc rễ',
  },
  {
    pillar: 'Trụ tháng',
    represents: 'Cha mẹ, anh chị',
    relation: 'Thân tộc gần',
  },
  {
    pillar: 'Trụ ngày',
    represents: 'Bản thân (can ngày = nhật can, là "chủ")',
    relation: 'Trung tâm',
  },
  {
    pillar: 'Trụ giờ',
    represents: 'Con cái, hậu vận, năng lượng cuối ngày',
    relation: 'Phái sinh',
  },
];

const TEN_GODS: { name: string; meaning: string }[] = [
  {
    name: 'Tỉ Kiên',
    meaning: 'Cùng hành cùng âm dương với nhật can — anh em, đồng nghiệp ngang hàng.',
  },
  {
    name: 'Kiếp Tài',
    meaning: 'Cùng hành khác âm dương — bạn cạnh tranh, tranh tài.',
  },
  {
    name: 'Thực Thần',
    meaning: 'Nhật can sinh ra, cùng âm dương — sáng tạo ôn hoà, hưởng thụ.',
  },
  {
    name: 'Thương Quan',
    meaning: 'Nhật can sinh ra, khác âm dương — tài năng phá cách, biểu đạt mạnh.',
  },
  {
    name: 'Chính Tài',
    meaning: 'Nhật can khắc, khác âm dương — tài sản ổn định, vợ chính.',
  },
  {
    name: 'Thiên Tài',
    meaning: 'Nhật can khắc, cùng âm dương — tài lộc bất ngờ, cơ hội.',
  },
  {
    name: 'Chính Quan',
    meaning: 'Khắc nhật can, khác âm dương — kỷ luật, chức vụ, chồng chính.',
  },
  {
    name: 'Thất Sát',
    meaning: 'Khắc nhật can, cùng âm dương — áp lực, đối thủ, võ nghiệp.',
  },
  {
    name: 'Chính Ấn',
    meaning: 'Sinh nhật can, khác âm dương — học vấn, người đỡ đầu, mẹ.',
  },
  {
    name: 'Thiên Ấn',
    meaning: 'Sinh nhật can, cùng âm dương — chuyên môn hẹp, dưỡng nuôi không chính.',
  },
];

const ELEMENTS: { name: string; sinh: string; khac: string }[] = [
  {
    name: 'Kim',
    sinh: 'Kim sinh Thuỷ',
    khac: 'Kim khắc Mộc',
  },
  {
    name: 'Mộc',
    sinh: 'Mộc sinh Hoả',
    khac: 'Mộc khắc Thổ',
  },
  {
    name: 'Thuỷ',
    sinh: 'Thuỷ sinh Mộc',
    khac: 'Thuỷ khắc Hoả',
  },
  {
    name: 'Hoả',
    sinh: 'Hoả sinh Thổ',
    khac: 'Hoả khắc Kim',
  },
  {
    name: 'Thổ',
    sinh: 'Thổ sinh Kim',
    khac: 'Thổ khắc Thuỷ',
  },
];

const WHAT_WE_DO = [
  'Tính 4 trụ + thập thần + ngũ hành.',
  'Đối chiếu chéo với Tử Vi (vd: nếu Tử Vi cho thấy chủ đề Tài Bạch và Bát Tự cho thấy thiếu Chính Tài → tăng confidence).',
  'KHÔNG tự sinh kết luận Bát Tự thuần — chờ chuyên gia Bát Tự validate.',
];

const LIMITATIONS = [
  'Tiết khí: engine dùng vị trí mặt trời theo lịch trung bình, chưa dùng vị trí thiên văn chính xác → có thể lệch ±1 ngày quanh ranh tiết khí.',
  'Đại vận Bát Tự: hiện chưa expose ra UI, chỉ tính nội bộ.',
  'Sinh trước/sau giao thời (tý/sửu) cần xác định kỹ — UI hiện chưa hỏi rõ.',
];

const ROADMAP = [
  '100 lá số Bát Tự validate bởi 2+ chuyên gia.',
  'Đại vận Bát Tự expose ra dashboard.',
  'Cross-check với Tử Vi dataset chung.',
  'Khi đạt → cập nhật algorithm changelog v2.0 + chuyển badge sang production.',
];

const REFERENCES: { label: string; href: string }[] = [
  {
    label: 'Methodology Tử Vi (so sánh phương pháp)',
    href: '/methodology/tu-vi',
  },
  {
    label: 'Algorithm changelog (theo dõi engine version)',
    href: '/methodology/algorithm-changelog',
  },
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Trang chủ',
      item: 'https://hieu.asia/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Phương pháp luận',
      item: 'https://hieu.asia/methodology',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Bát Tự',
      item: 'https://hieu.asia/methodology/bat-tu',
    },
  ],
};

export default function BatTuMethodologyPage() {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <main id="main-content" className="relative pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
          />
          <div className="relative mx-auto max-w-4xl px-6 pb-8 pt-12 sm:pt-16">
            <nav
              aria-label="Breadcrumb"
              className="mb-4 text-xs text-cream/55"
            >
              <Link href="/" className="hover:text-gold">
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <Link href="/methodology" className="hover:text-gold">
                Phương pháp luận
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-cream/70">Bát Tự</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
                Methodology
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                Beta
              </span>
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-5xl">
              Bát Tự
            </h1>
            <p className="mt-4 text-base leading-relaxed text-cream/75 sm:text-lg">
              Bát Tự hiện ở trạng thái beta. Engine đã tính được 4 trụ, thập
              thần và ngũ hành, nhưng trong báo cáo hiện tại, Tử Vi vẫn là
              phương pháp chính; Bát Tự chỉ đóng vai trò lớp đối chiếu, không
              tự quyết định kết luận.
            </p>
          </div>
        </section>

        {/* 1. Trạng thái hiện tại */}
        <section className="relative mx-auto max-w-4xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            1. Trạng thái hiện tại
          </h2>
          <Card className="mt-4 border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-amber-300">
                <AlertTriangle className="h-5 w-5" aria-hidden />
                Beta — đối chiếu phụ, không kết luận chính
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm leading-relaxed text-cream/85">
                {CURRENT_STATUS.map((item) => (
                  <li key={item} className="flex gap-2">
                    <ChevronRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/80"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 2. Khái niệm cơ bản */}
        <section className="relative mx-auto max-w-4xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            2. Khái niệm cơ bản
          </h2>
          <Card className="mt-4 border-cream/10 bg-ink/40">
            <CardContent className="p-5 sm:p-6">
              <ul className="space-y-2.5 text-sm leading-relaxed text-cream/80">
                {BASICS.map((item) => (
                  <li key={item} className="flex gap-2">
                    <BookOpen
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 3. 4 trụ */}
        <section className="relative mx-auto max-w-4xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            3. 4 trụ là gì
          </h2>
          <p className="mt-2 text-sm text-cream/65">
            Mỗi trụ là một cặp Can-Chi, phản ánh một lớp quan hệ.
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border border-cream/10 bg-ink/40">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-cream/10 text-left text-xs uppercase tracking-wider text-cream/55">
                  <th className="px-4 py-3 font-medium">Trụ</th>
                  <th className="px-4 py-3 font-medium">Đại diện</th>
                  <th className="px-4 py-3 font-medium">Quan hệ với chủ</th>
                </tr>
              </thead>
              <tbody>
                {PILLARS.map((p) => (
                  <tr
                    key={p.pillar}
                    className="border-b border-cream/5 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-cream">
                      <span className="inline-flex items-center gap-2">
                        <Columns3
                          className="h-4 w-4 text-gold/70"
                          aria-hidden
                        />
                        {p.pillar}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cream/75">
                      {p.represents}
                    </td>
                    <td className="px-4 py-3 text-cream/75">{p.relation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Thập thần */}
        <section className="relative mx-auto max-w-5xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            4. Thập thần
          </h2>
          <p className="mt-2 text-sm text-cream/65">
            10 vai trò xã hội của trụ ngày — tham chiếu nhanh, mỗi tên 1 câu
            nghĩa.
          </p>

          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {TEN_GODS.map((g, idx) => (
              <li key={g.name}>
                <div className="flex h-full gap-3 rounded-xl border border-cream/10 bg-ink/40 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-mono text-xs font-bold text-gold">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-semibold text-cream">
                      {g.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-cream/70">
                      {g.meaning}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 5. Ngũ hành */}
        <section className="relative mx-auto max-w-5xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            5. Ngũ hành
          </h2>
          <p className="mt-2 text-sm text-cream/65">
            5 nguyên tố với quan hệ tương sinh + tương khắc.
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border border-cream/10 bg-ink/40">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-cream/10 text-left text-xs uppercase tracking-wider text-cream/55">
                  <th className="px-4 py-3 font-medium">Hành</th>
                  <th className="px-4 py-3 font-medium">Tương sinh</th>
                  <th className="px-4 py-3 font-medium">Tương khắc</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENTS.map((e) => (
                  <tr
                    key={e.name}
                    className="border-b border-cream/5 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-cream">
                      <span className="inline-flex items-center gap-2">
                        <Flame
                          className="h-4 w-4 text-gold/70"
                          aria-hidden
                        />
                        {e.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-jade">{e.sinh}</td>
                    <td className="px-4 py-3 text-rose-300">{e.khac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-relaxed text-cream/80">
            <p className="flex items-start gap-2">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                aria-hidden
              />
              <span>
                <strong className="text-amber-200">Caveat:</strong> Mệnh nạp
                âm khác với ngũ hành của Can-Chi trụ ngày — đây là chỗ dễ
                nhầm.
              </span>
            </p>
          </div>
        </section>

        {/* 6. Hieu.asia làm gì */}
        <section className="relative mx-auto max-w-4xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            6. Hieu.asia làm gì với Bát Tự (beta)
          </h2>
          <Card className="mt-4 border-cream/10 bg-ink/40">
            <CardContent className="p-5 sm:p-6">
              <ul className="space-y-2.5 text-sm leading-relaxed text-cream/80">
                {WHAT_WE_DO.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Sparkles
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 7. Limitations */}
        <section className="relative mx-auto max-w-4xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            7. Limitations cụ thể của bản beta
          </h2>
          <Card className="mt-4 border-rose-500/30 bg-rose-950/15">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-rose-300">
                <Wrench className="h-5 w-5" aria-hidden />
                Những gì engine chưa làm tốt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm leading-relaxed text-cream/85">
                {LIMITATIONS.map((item) => (
                  <li key={item} className="flex gap-2">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-rose-300/80"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 8. Roadmap */}
        <section className="relative mx-auto max-w-4xl px-6 py-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            8. Roadmap graduation
          </h2>
          <Card className="mt-4 border-jade/25 bg-jade/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-jade">
                <Map className="h-5 w-5" aria-hidden />
                Điều kiện để chuyển sang production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm leading-relaxed text-cream/85">
                {ROADMAP.map((item) => (
                  <li key={item} className="flex gap-2">
                    <ChevronRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-jade/80"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 9. References */}
        <section className="relative mx-auto max-w-4xl px-6 pb-20 pt-8">
          <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            9. References
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-cream/80">
            {REFERENCES.map((r) => (
              <li key={r.href} className="flex gap-2">
                <BookOpen
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                  aria-hidden
                />
                <Link
                  href={r.href}
                  className="text-cream/85 hover:text-gold"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
