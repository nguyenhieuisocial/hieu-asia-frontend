import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { DeskDirectionChecker } from '@/components/huong-ban/DeskDirectionChecker';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { webPage, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { DESK_USE } from '@/lib/huong-ban-data';

const url = 'https://hieu.asia/huong-ban-lam-viec';
const title = 'Hướng bàn làm việc, bàn học hợp tuổi: tra theo năm sinh';
const description =
  'Bạn nên ngồi quay mặt về hướng nào khi làm việc và khi học? Nhập năm sinh và giới tính để tra theo Bát Trạch (cung phi) — minh bạch cách tính, để tham khảo, không phán số mệnh.';

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
    q: 'Hướng bàn làm việc tính theo cái gì?',
    a: 'Theo Bát Trạch (phái Tám Cung), từ năm sinh và giới tính sẽ ra cung phi (mệnh quái) của bạn, rồi suy ra 8 hướng — 4 hướng tốt và 4 hướng nên tránh. Với bàn làm việc hay bàn học, người ta xét hướng mà người ngồi quay mặt về (hướng nhìn). Đây là tập tục phong thủy để tham khảo, không phải quy luật khoa học.',
  },
  {
    q: 'Hướng làm việc và hướng học có khác nhau không?',
    a: 'Cùng dựa trên cung phi của bạn, nhưng ưu tiên khác nhau: khi làm việc nên hướng về Sinh Khí (chủ công danh, tài lộc, thăng tiến); khi học hoặc cần tập trung nên hướng về Phục Vị (chủ ổn định, tĩnh tâm). Công cụ ở trên chỉ rõ cả hai hướng này cho riêng bạn.',
  },
  {
    q: 'Tôi không xoay được bàn đúng hướng tốt thì sao?',
    a: 'Không sao. Phong thủy chỉ là một yếu tố tham khảo. Quan trọng hơn là những điều thực dụng: bàn đủ ánh sáng, lưng có điểm tựa (tường), không quay lưng ra cửa hay lối đi lại, màn hình không bị chói. Chọn được hướng tốt thì hay, không thì ưu tiên sự thoải mái và tập trung.',
  },
  {
    q: 'Hướng bàn dùng chung cung phi với hướng nhà phải không?',
    a: 'Đúng. Cùng một cung phi (tính từ năm sinh + giới tính) áp dụng cho cả hướng nhà, cửa chính, giường, bếp và bàn làm việc. Bạn có thể xem hướng nhà ở công cụ Xem hướng nhà — cùng nền tảng Bát Trạch.',
  },
];

export default function HuongBanHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: title, description, url: '/huong-ban-lam-viec' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Hướng bàn làm việc', url: '/huong-ban-lam-viec' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Phong thủy · Bát Trạch"
        relatedSlug="/huong-ban-lam-viec"
        icon={<span aria-hidden="true">🪑</span>}
        title={
          <>
            <GoldAccent>Hướng bàn làm việc</GoldAccent>, bàn học hợp tuổi
          </>
        }
        description="Nhập năm sinh và giới tính để biết bạn nên ngồi quay mặt về hướng nào khi làm việc và khi học — theo Bát Trạch (cung phi), minh bạch cách tính, để tham khảo."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Hướng bàn làm việc' }]}
      >
        <section className="space-y-8">
          <DeskDirectionChecker />

          {/* Giải thích */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Hiểu đúng về hướng bàn làm việc
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                Theo <strong>Bát Trạch</strong>, từ năm sinh và giới tính, mỗi người có một{' '}
                <strong>cung phi</strong> (mệnh quái). Cung phi chia ra <strong>Đông tứ mệnh</strong>{' '}
                hoặc <strong>Tây tứ mệnh</strong>, và quy định 8 hướng — 4 hướng tốt, 4 hướng nên
                tránh. Khi đặt bàn, người ta xét hướng người ngồi <strong>quay mặt về</strong>.
              </p>
              <p>
                Mỗi hướng tốt mang một ý nghĩa riêng, nên chọn theo việc bạn làm trên bàn: làm việc ưu
                tiên <strong>Sinh Khí</strong>, học hành ưu tiên <strong>Phục Vị</strong>. Đây là{' '}
                <strong>tập tục để tham khảo</strong>, không phải lời phán thành bại.
              </p>
              <p className="text-muted-foreground">
                Một lưu ý thực dụng: yếu tố ảnh hưởng năng suất rõ nhất không phải hướng, mà là bàn đủ
                sáng, lưng có điểm tựa, không quay lưng ra cửa/lối đi và màn hình không chói. Hãy ưu
                tiên những điều đó trước, rồi mới tinh chỉnh theo hướng nếu thuận tiện.
              </p>
            </div>
          </section>

          {/* Bảng ý nghĩa 4 hướng tốt */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              4 hướng tốt nên dùng cho bàn (theo loại việc)
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Sao (du niên)</th>
                    <th className="py-2 font-medium">Hợp loại việc gì trên bàn</th>
                  </tr>
                </thead>
                <tbody>
                  {DESK_USE.map((d) => (
                    <tr key={d.star} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium text-foreground">{d.name}</td>
                      <td className="py-2 text-muted-foreground">{d.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Hướng cụ thể của từng sao tùy cung phi mỗi người — nhập năm sinh ở công cụ trên để biết
              hướng của riêng bạn.
            </p>
          </section>

          {/* CTA sang công cụ liên quan */}
          <section className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">Cùng nền tảng cung phi</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Cung phi của bạn còn dùng để xem hướng nhà, cửa, giường, bếp — và phối với ngũ hành bản
              mệnh. Khám phá thêm:
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/huong-nha" className="text-gold hover:underline">
                Xem hướng nhà hợp tuổi →
              </Link>
              <Link href="/ban-menh" className="text-gold hover:underline">
                Ngũ hành bản mệnh →
              </Link>
              <Link href="/mau-xe-hop-menh" className="text-gold hover:underline">
                Màu xe hợp mệnh →
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
                source="huong-ban-lam-viec"
                capturedEvent="lead_capture_huong_ban"
                blurb="Để lại email, chúng tôi gửi nội dung mới hữu ích về phong thủy nhà cửa, bàn làm việc, hướng tốt theo tuổi. Thi thoảng thôi, không spam."
                cta="Nhận nội dung"
              />
            </div>
          </section>
        </section>
      </ToolPageShell>
    </>
  );
}
