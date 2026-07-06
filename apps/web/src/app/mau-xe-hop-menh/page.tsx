import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { MauXeFinder } from '@/components/mau-xe/MauXeFinder';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { webPage, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { listElementCarGuide } from '@/lib/mau-xe-data';

const url = 'https://hieu.asia/mau-xe-hop-menh';
const title = 'Màu xe hợp mệnh, hợp tuổi: tra theo năm sinh';
const description =
  'Sinh năm bao nhiêu hợp màu xe gì? Nhập năm sinh để biết màu xe hợp mệnh và màu nên cân nhắc — suy theo ngũ hành nạp âm, minh bạch cách tính, để tham khảo, không phán số mệnh.';

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

const FAQS = [
  {
    q: 'Chọn màu xe theo mệnh có cơ sở gì?',
    a: 'Đây là quan niệm phong thủy ngũ hành: mỗi người có một hành bản mệnh (tính từ năm sinh theo nạp âm 60 Giáp Tý), và mỗi màu sắc cũng quy về một hành. Người ta chọn màu thuộc hành bản mệnh hoặc hành tương sinh để cảm thấy hợp gu, hài hòa. Đây là gợi ý mang tính tham khảo, không phải quy luật khoa học.',
  },
  {
    q: 'Màu xe hợp mệnh và hợp tuổi có khác nhau không?',
    a: 'Về cơ bản là một. "Mệnh" (ngũ hành bản mệnh) được suy ra từ năm sinh, tức từ tuổi âm lịch. Nên dù bạn hỏi "hợp mệnh" hay "hợp tuổi", chỉ cần nhập năm sinh là tính được. Lưu ý: tuổi tính theo năm âm lịch, người sinh tháng 1 hoặc đầu tháng 2 dương (trước Tết) có thể thuộc năm âm liền trước.',
  },
  {
    q: 'Lỡ chọn màu xe "kỵ mệnh" thì có sao không?',
    a: 'Không sao cả. "Kỵ" chỉ là gợi ý nên cân nhắc theo phong thủy, không phải điều cấm và không định đoạt vận may. Nếu bạn thích một màu, thấy nó đẹp và an toàn, thì cứ chọn — sự tự tin và an toàn khi lái quan trọng hơn nhiều.',
  },
  {
    q: 'Màu xe nào an toàn nhất khi lái?',
    a: 'Theo các nghiên cứu giao thông, xe màu sáng (đặc biệt là trắng và vàng) dễ được nhận biết hơn trong điều kiện thiếu sáng hoặc thời tiết xấu, nên thường được xem là an toàn hơn xe màu tối. Đây là yếu tố thực dụng nên cân nhắc song song với việc chọn màu theo sở thích hay phong thủy.',
  },
];

export default function MauXeHubPage() {
  const guide = listElementCarGuide();

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: title, description, url: '/mau-xe-hop-menh' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Màu xe hợp mệnh', url: '/mau-xe-hop-menh' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Phong thủy · Ngũ hành"
        relatedSlug="/mau-xe-hop-menh"
        icon={<span aria-hidden="true">🚗</span>}
        title={
          <>
            <GoldAccent>Màu xe hợp mệnh</GoldAccent>, hợp tuổi theo năm sinh
          </>
        }
        description="Nhập năm sinh để biết màu xe hợp mệnh và màu nên cân nhắc, suy theo ngũ hành bản mệnh — minh bạch cách tính, để tham khảo, không hù dọa."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Màu xe hợp mệnh' }]}
      >
        <section className="space-y-8">
          <MauXeFinder />

          {/* Giải thích */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Hiểu đúng về &ldquo;màu xe hợp mệnh&rdquo;
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                Theo phong thủy ngũ hành, mỗi người có một <strong>hành bản mệnh</strong> (Kim, Mộc,
                Thủy, Hỏa hoặc Thổ) tính từ năm sinh theo bảng nạp âm 60 Giáp Tý. Mỗi màu sắc cũng
                quy về một hành. Người ta chọn màu xe thuộc <strong>hành bản mệnh</strong> hoặc{' '}
                <strong>hành tương sinh</strong> (hành sinh ra mệnh của mình) để cảm thấy hài hòa, và
                cân nhắc màu thuộc <strong>hành khắc mệnh</strong>.
              </p>
              <p>
                Đây là <strong>quan niệm để tham khảo</strong>, không phải quy luật khoa học và không
                định đoạt tài lộc hay may mắn của bạn. hieu.asia trình bày cách tính minh bạch để bạn
                tự quyết — <strong>không doạ vận hạn, không bán &ldquo;đổi mệnh&rdquo;</strong>.
              </p>
              <p className="text-muted-foreground">
                Một lưu ý thực dụng: khi mua xe, yếu tố <strong>an toàn</strong> nên đặt trước phong
                thủy. Các nghiên cứu giao thông cho thấy xe màu sáng (trắng, vàng) dễ được nhận biết
                hơn khi thiếu sáng. Hãy chọn màu bạn vừa thích, vừa thấy an tâm khi lái.
              </p>
            </div>
          </section>

          {/* Bảng tham chiếu màu xe theo hành */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Màu xe theo từng hành ngũ hành
            </h2>
            <div className="mt-4 space-y-4">
              {guide.map((g) => (
                <div key={g.key} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      Mệnh {g.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{g.blurb}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {g.carColors.map((c) => (
                      <span key={c.name} className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="inline-block h-4 w-4 rounded-full border border-border"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-sm text-foreground/85">{c.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Bảng quy ước màu – hành theo quan niệm ngũ hành phổ biến. Nhập năm sinh ở công cụ trên
              để biết màu xe hợp với riêng bạn (gồm cả màu tương sinh bổ trợ).
            </p>
          </section>

          {/* CTA sang công cụ liên quan */}
          <section className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">Tìm hiểu thêm về mệnh</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Màu xe chỉ là một ứng dụng nhỏ của ngũ hành bản mệnh. Xem mệnh đầy đủ của bạn — màu sắc,
              nghề nghiệp, hướng nhà — qua các công cụ dưới đây.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/ban-menh" className="text-gold hover:underline">
                Ngũ hành bản mệnh →
              </Link>
              <Link href="/huong-nha" className="text-gold hover:underline">
                Xem hướng nhà →
              </Link>
              <Link href="/la-so-bat-tu" className="text-gold hover:underline">
                Lập lá số Bát Tự →
              </Link>
            </p>
          </section>

          {/* FAQ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Email */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nội dung phong thủy hữu ích
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="mau-xe-hop-menh"
                capturedEvent="lead_capture_mau_xe"
                blurb="Để lại email, chúng tôi gửi nội dung mới hữu ích về ngũ hành, màu sắc, hướng nhà. Thi thoảng thôi, không spam."
                cta="Nhận nội dung"
              />
            </div>
          </section>
        </section>
      </ToolPageShell>
    </>
  );
}
