import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { XongDatGuideBuilder } from '@/components/tai-lieu/XongDatGuideBuilder';
import { yearProfile } from '@/lib/sinh-con';
import { defaultTargetYear, tetMoc } from '@/lib/xong-dat';
import {
  howToChoose,
  DO_AND_DONT,
  XONG_DAT_DISCLAIMER,
} from '@/lib/tai-lieu/xong-dat-guide';

/**
 * /tai-lieu/tuoi-xong-dat — tài liệu tặng "Tuổi xông đất Tết <can chi> <năm>".
 *
 * Khác /xong-dat (công cụ tra cứu nhanh): trang này là TÀI LIỆU — dạy cách
 * chọn, rồi mới tính danh sách riêng cho gia chủ và đóng gói thành PDF mang về.
 * Số liệu tính bằng engine `lib/xong-dat.ts`; phần chữ ở `lib/tai-lieu/
 * xong-dat-guide.ts` để trang đọc và PDF không bao giờ lệch nhau.
 *
 * Mốc mùa vụ KHÔNG còn gõ tay: năm Tết lấy từ `defaultTargetYear()` nên tự lật
 * vào mùng 1 Tết. Vì vậy mọi chỗ dùng năm phải tính lúc render và route phải
 * khai `revalidate`.
 */

// SEO-FIX: DESC 208 → 160 ký tự — dài nhất toàn site, Google cắt mất gần 50 ký
// tự. Gộp "nhóm tuổi nên cân nhắc kèm lý do" vào "kèm lý do" và rút câu cuối.
const DESC = (canChi: string, y: number) =>
  `Tài liệu miễn phí về tuổi xông đất Tết ${canChi} ${y}: 5 bước chọn người xông đất, danh sách tuổi hợp theo tuổi gia chủ, kèm lý do. Tham khảo theo tập tục.`;

// SEO-FIX: 51 ký tự + hậu tố ' · hieu.asia' = 63 → bị Google cắt.
const TITLE = (canChi: string, y: number) => `Tuổi xông đất Tết ${canChi} ${y} — miễn phí`;

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const y = defaultTargetYear();
  const canChi = yearProfile(y)!.canChi;
  return {
    title: TITLE(canChi, y),
    description: DESC(canChi, y),
    alternates: { canonical: 'https://hieu.asia/tai-lieu/tuoi-xong-dat' },
    openGraph: {
      title: `Tuổi xông đất Tết ${canChi} ${y} — hieu.asia`,
      description: DESC(canChi, y),
      url: 'https://hieu.asia/tai-lieu/tuoi-xong-dat',
      type: 'article' as const,
      images: OG_DEFAULT_IMAGES,
    },
  };
}

const FAQS = (canChi: string, ngayMung1: string) => [
  {
    q: `Mùng 1 Tết ${canChi} là ngày nào dương lịch?`,
    a: `Mùng 1 Tết ${canChi} nhằm ngày ${ngayMung1} dương lịch. Tục xông đất diễn ra từ sau giao thừa đến sáng mùng 1 — người đầu tiên bước vào nhà được xem là người mở đầu năm mới cho gia đình.`,
  },
  {
    q: 'Mời sai tuổi xông đất thì có xui cả năm không?',
    a: 'Không. Đây là tập tục để tham khảo, không phải quy luật. Người xông đất quý nhất vẫn là người vui vẻ, xởi lởi và thật lòng quý gia đình bạn. Nếu ai đó doạ bạn rằng mời sai tuổi sẽ xui cả năm rồi đề nghị bán lễ giải hạn, thì thứ đang được bán là nỗi sợ.',
  },
  {
    q: 'Tuổi trong bảng tra tính theo lịch nào?',
    a: 'Theo năm âm lịch, đúng quy ước dân gian. Người sinh vào tháng 1 hoặc đầu tháng 2 dương lịch, tức trước mùng 1 Tết, thuộc năm âm liền trước. Đây là chỗ nhiều người tra nhầm rồi lo lắng vô ích.',
  },
  {
    q: 'Danh sách tuổi hợp được tính ra sao?',
    a: 'Ba lớp, đều là quy tắc cổ điển và được nêu công khai: quan hệ giữa chi người xông đất với chi năm; quan hệ với chi gia chủ; và quan hệ mệnh nạp âm giữa hai bên. Nhập cùng dữ liệu thì luôn ra cùng kết quả — không có phần đoán.',
  },
  {
    q: 'Người trong nhà xông đất được không?',
    a: 'Được. Nhiều gia đình để chính người nhà hợp tuổi bước ra rồi vào lại sau giao thừa. Không có kiêng kỵ nào cấm việc này.',
  },
];

export default function TaiLieuXongDatPage() {
  // Đọc một lần đầu hàm render rồi dùng lại — không gán ra cấp module.
  const TARGET_YEAR = defaultTargetYear();
  const target = yearProfile(TARGET_YEAR)!;
  const tet = tetMoc(TARGET_YEAR);
  const faqs = FAQS(target.canChi, tet.ngay);

  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: `Tuổi xông đất Tết ${target.canChi} ${TARGET_YEAR} — tài liệu miễn phí`,
            description: DESC(target.canChi, TARGET_YEAR),
            url: '/tai-lieu/tuoi-xong-dat',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tài liệu tặng', url: '/tai-lieu' },
            { name: `Tuổi xông đất ${TARGET_YEAR}`, url: '/tai-lieu/tuoi-xong-dat' },
          ]),
          faqPage(faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Tài liệu tặng · Tết ${target.canChi} ${TARGET_YEAR}`}
        icon={<span aria-hidden="true">🧧</span>}
        title={
          <>
            Tuổi <GoldAccent>xông đất</GoldAccent> Tết {target.canChi} {TARGET_YEAR}
          </>
        }
        description={`Mùng 1 nhằm ngày ${tet.ngay}. Tài liệu này chỉ cách chọn người xông đất, rồi tính danh sách tuổi hợp riêng cho tuổi gia chủ của bạn. Tham khảo theo tập tục — không có chuyện mời sai tuổi thì xui cả năm.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài liệu tặng', href: '/tai-lieu' },
          { label: `Tuổi xông đất ${TARGET_YEAR}` },
        ]}
      >
        <div className="mx-auto max-w-2xl space-y-8">
          <section>
            <h2 className="font-editorial-display text-2xl font-normal text-foreground">
              Năm bước chọn người xông đất
            </h2>
            <div className="mt-4 space-y-4">
              {howToChoose(target).map((s) => (
                <div key={s.heading} className="rounded-2xl border border-border bg-card/30 p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {s.heading}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground/90">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Phần cá nhân hoá — engine tính riêng theo tuổi gia chủ + cổng email tải PDF */}
          <section>
            <XongDatGuideBuilder />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {DO_AND_DONT.map((block) => (
              <div key={block.heading} className="rounded-2xl border border-border bg-card/30 p-5">
                <h2 className="font-heading text-base font-semibold text-foreground">
                  {block.heading}
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {block.items.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-5">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Câu hỏi hay gặp
            </h2>
            <dl className="mt-3 space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-sm leading-relaxed text-muted-foreground">{XONG_DAT_DISCLAIMER}</p>

          <nav aria-label="Trang liên quan" className="text-sm text-muted-foreground">
            Xem thêm:{' '}
            <Link href="/xong-dat" className="text-gold hover:underline">
              công cụ tra tuổi xông đất
            </Link>{' '}
            ·{' '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">
              giờ hoàng đạo mùng 1
            </Link>{' '}
            ·{' '}
            <Link href="/tai-lieu" className="text-gold hover:underline">
              các tài liệu tặng khác
            </Link>
          </nav>
        </div>
      </ToolPageShell>
    </>
  );
}
