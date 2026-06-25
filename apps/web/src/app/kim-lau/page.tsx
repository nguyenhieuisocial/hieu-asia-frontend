import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { KimLauFinder } from '@/components/kim-lau/KimLauFinder';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { webPage, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { KIM_LAU_TYPES, KIM_LAU_FAQS, phamAges } from '@/lib/kim-lau-data';

const url = 'https://hieu.asia/kim-lau';
const title = 'Kim Lâu là gì? Tra tuổi Kim Lâu cô dâu theo năm sinh';
const description =
  'Kim Lâu là gì, tuổi nào phạm Kim Lâu khi cưới? Nhập năm sinh cô dâu để tra các năm tới năm nào phạm — tính theo phong tục (tuổi mụ chia 9), minh bạch, không hù dọa, không bán giải hạn.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/og-image.jpg', alt: title }],
  },
};

export default function KimLauHubPage() {
  const ages = phamAges(49);

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: title, description, url: '/kim-lau' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Kim Lâu', url: '/kim-lau' },
          ]),
          faqPage(KIM_LAU_FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Phong tục cưới hỏi"
        relatedSlug="/kim-lau"
        icon={<span aria-hidden="true">💍</span>}
        title={
          <>
            <GoldAccent>Kim Lâu</GoldAccent> là gì? Tra tuổi Kim Lâu cô dâu
          </>
        }
        description="Kim Lâu xét tuổi mụ cô dâu (chia 9, dư 1/3/6/8) trong năm dự định cưới. Nhập năm sinh để biết các năm tới năm nào phạm — phong tục để tham khảo, không hù dọa."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Kim Lâu' }]}
      >
        <section className="space-y-8">
          <KimLauFinder />

          {/* Giải thích */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-xl font-semibold text-foreground">Hiểu đúng về Kim Lâu</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                Kim Lâu là một nét trong phong tục cưới hỏi của người Việt: người ta xét{' '}
                <strong>tuổi mụ</strong> (tuổi âm) của <strong>cô dâu</strong> trong năm định cưới.
                Lấy tuổi mụ chia 9, nếu số dư rơi vào <strong>1, 3, 6 hoặc 8</strong> thì gọi là phạm
                Kim Lâu, dân gian khuyên cân nhắc thêm.
              </p>
              <p>
                Đây là <strong>tục lệ để tham khảo</strong>, không phải lời phán số mệnh và không phải
                điều cấm. Cách nhẹ nhàng nhất là chọn một năm cô dâu không phạm Kim Lâu — công cụ ở
                trên liệt kê sẵn các năm tới. hieu.asia trình bày cách tính minh bạch để bạn tự quyết,{' '}
                <strong>không doạ vận hạn, không bán lễ &ldquo;giải hạn&rdquo;</strong>.
              </p>
            </div>
          </section>

          {/* 4 loại Kim Lâu */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              4 loại Kim Lâu (theo số dư tuổi mụ chia 9)
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Số dư</th>
                    <th className="py-2 pr-4 font-medium">Tên gọi</th>
                    <th className="py-2 font-medium">Theo quan niệm dân gian</th>
                  </tr>
                </thead>
                <tbody>
                  {KIM_LAU_TYPES.map((t) => (
                    <tr key={t.remainder} className="border-b border-border/50">
                      <td className="py-2 pr-4 tabular-nums text-foreground/85">{t.remainder}</td>
                      <td className="py-2 pr-4 font-medium text-foreground">{t.type}</td>
                      <td className="py-2 text-muted-foreground">{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Các tên gọi trên là cách dân gian phân loại, dùng để tham khảo — không phải dự báo điều
              sẽ xảy ra.
            </p>
          </section>

          {/* Bảng tuổi mụ phạm */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Các tuổi mụ phạm Kim Lâu (1–49)
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tuổi mụ phạm Kim Lâu là các tuổi có số dư chia 9 bằng 1, 3, 6 hoặc 8:
            </p>
            <p className="mt-2 font-mono text-sm tabular-nums text-foreground/85">{ages.join(' · ')}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Nhập năm sinh ở công cụ trên để khỏi tự tính — hệ quy đổi sang năm dương lịch giúp bạn.
            </p>
          </section>

          {/* CTA xem tuổi cưới */}
          <section className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">Đang chọn năm cưới?</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Kim Lâu chỉ là một yếu tố. Công cụ Xem tuổi cưới xét cả Kim Lâu, Tam Tai và xung năm
              cùng lúc theo năm sinh — minh bạch từng bước.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/xem-tuoi-cuoi" className="text-gold hover:underline">
                Xem tuổi cưới →
              </Link>
              <Link href="/tam-tai" className="text-gold hover:underline">
                Tam Tai →
              </Link>
              <Link href="/xem-ngay" className="text-gold hover:underline">
                Xem ngày tốt →
              </Link>
            </p>
          </section>

          {/* FAQ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {KIM_LAU_FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Email */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Nhận nhắc theo mùa cưới
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="kim-lau"
                capturedEvent="lead_capture_kim_lau"
                blurb="Để lại email, chúng tôi báo khi có nội dung mới theo mùa: xem tuổi cưới, ngày tốt, phong tục. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>
        </section>
      </ToolPageShell>
    </>
  );
}
