import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { TamTaiFinder } from '@/components/tam-tai/TamTaiFinder';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { webPage, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { listTamHopGroups, listTamTai, CALENDAR_FROM, CALENDAR_TO } from '@/lib/tam-tai-data';

const url = 'https://hieu.asia/tam-tai';
const title = 'Tam Tai là gì? Tra tuổi phạm Tam Tai theo năm sinh';
const description =
  'Tam Tai là gì, tuổi nào phạm Tam Tai và vào những năm nào? Nhập năm sinh để tra theo phong tục Can Chi — minh bạch cách tính, không hù dọa, không bán giải hạn.';

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
    q: 'Tam Tai là gì?',
    a: 'Tam Tai (nghĩa đen là "ba tai") là một quan niệm dân gian: cứ 12 năm, mỗi nhóm tam hợp (ba con giáp) lại trải qua 3 năm liền nhau được xem là giai đoạn nên thận trọng hơn. Đây là tập tục để tham khảo khi cân nhắc việc trọng đại, không phải lời phán số mệnh.',
  },
  {
    q: 'Làm sao biết tuổi tôi có phạm Tam Tai không?',
    a: 'Tam Tai xét theo địa chi (con giáp) của năm sinh. Nhập năm sinh dương lịch vào ô tra ở trên — bạn sẽ biết mình thuộc nhóm nào, gặp Tam Tai vào các năm nào, và năm nay có rơi vào Tam Tai không.',
  },
  {
    q: 'Phạm Tam Tai có cần cúng giải hạn không?',
    a: 'Không bắt buộc. hieu.asia trình bày cách tính minh bạch để bạn tham khảo và không bán lễ "giải hạn". Ý nghĩa thực dụng của Tam Tai là nhắc bạn cẩn trọng hơn với việc lớn — cưới hỏi, làm nhà, khai trương, đầu tư — chứ không phải điềm gở cố định.',
  },
  {
    q: 'Tam Tai khác Kim Lâu và xung Thái Tuế thế nào?',
    a: 'Cả ba đều là cách xem tuổi theo phong tục nhưng khác nhau: Tam Tai tính theo nhóm tam hợp năm sinh (3 năm/chu kỳ 12 năm); Kim Lâu tính theo tuổi mụ chia 9 (thường xét cô dâu khi cưới); xung Thái Tuế là khi con giáp của bạn xung với con giáp của năm. Công cụ Xem tuổi cưới / làm nhà của hieu.asia tính cả ba cùng lúc.',
  },
];

export default function TamTaiHubPage() {
  const groups = listTamHopGroups();
  const zodiacs = listTamTai();

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: title, description, url: '/tam-tai' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tam Tai', url: '/tam-tai' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Phong tục · Can Chi"
        relatedSlug="/tam-tai"
        icon={<span aria-hidden="true">🗓️</span>}
        title={
          <>
            <GoldAccent>Tam Tai</GoldAccent> là gì? Tra tuổi phạm Tam Tai
          </>
        }
        description="Tam Tai là quan niệm dân gian về 3 năm nên thận trọng của mỗi nhóm tam hợp. Nhập năm sinh để tra — minh bạch cách tính, để tham khảo, không hù dọa."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Tam Tai' }]}
      >
        <section className="space-y-8">
          <TamTaiFinder />

          {/* Giải thích */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Hiểu đúng về Tam Tai
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>
                Theo Can Chi, 12 con giáp chia thành 4 nhóm <strong>Tam Hợp</strong> (mỗi nhóm 3 con
                giáp cách nhau 4 năm). Cứ trong một vòng 12 năm, mỗi nhóm lại gặp <strong>3 năm Tam
                Tai</strong> liền nhau — dân gian gọi vui là năm &ldquo;vào&rdquo;, năm
                &ldquo;giữa&rdquo; và năm &ldquo;ra&rdquo; Tam Tai.
              </p>
              <p>
                Tập tục xem đây là giai đoạn nên <strong>giữ nhịp, cẩn trọng hơn</strong> với việc
                trọng đại như cưới hỏi, làm nhà, khai trương hay đầu tư lớn: nên cân nhắc kỹ và
                chuẩn bị chu đáo thay vì quyết định vội vàng. Đây là{' '}
                <strong>lời nhắc tham khảo</strong>, không phải điềm gở cố định và không định đoạt cả
                năm của bạn.
              </p>
              <p className="text-muted-foreground">
                hieu.asia trình bày cách tính minh bạch để bạn tự cân nhắc — không doạ vận hạn, không
                bán bùa hay lễ &ldquo;giải hạn&rdquo;. Phạm Tam Tai không có nghĩa là không được làm
                việc lớn; nhiều người vẫn tiến hành sau khi cân nhắc kỹ.
              </p>
            </div>
          </section>

          {/* 4 nhóm tam hợp */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              4 nhóm tam hợp & năm Tam Tai
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Nhóm 3 con giáp</th>
                    <th className="py-2 pr-4 font-medium">Năm Tam Tai (địa chi)</th>
                    <th className="py-2 font-medium">
                      Năm dương lịch ({CALENDAR_FROM}–{CALENDAR_TO})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => (
                    <tr key={g.tamTaiChis.join()} className="border-b border-border/50 align-top">
                      <td className="py-2 pr-4">
                        {g.members.map((m, i) => (
                          <span key={m.slug}>
                            <Link href={`/tam-tai/${m.slug}`} className="text-gold hover:underline">
                              {m.ten}
                            </Link>
                            {i < g.members.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </td>
                      <td className="py-2 pr-4 text-foreground/85">{g.tamTaiChis.join(', ')}</td>
                      <td className="py-2 tabular-nums text-muted-foreground">
                        {g.calendarYears.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Lưới 12 con giáp */}
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
              Tra Tam Tai theo từng tuổi
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {zodiacs.map((z) => (
                <Link
                  key={z.slug}
                  href={`/tam-tai/${z.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card/40 px-4 py-3 text-sm text-foreground/85 transition hover:border-gold/40 hover:text-gold"
                >
                  <span aria-hidden="true" className="text-lg">
                    {z.emoji}
                  </span>
                  Tuổi {z.ten}{' '}
                  <span className="text-xs text-muted-foreground">({z.animal})</span>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA công cụ xem tuổi */}
          <section className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Đang tính chuyện trọng đại?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Tam Tai chỉ là một yếu tố. Các công cụ dưới đây xét cả Tam Tai, Kim Lâu và xung năm
              cùng lúc theo năm sinh — minh bạch từng bước.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/xem-tuoi-cuoi" className="text-gold hover:underline">
                Xem tuổi cưới →
              </Link>
              <Link href="/xem-tuoi-lam-nha" className="text-gold hover:underline">
                Xem tuổi làm nhà →
              </Link>
              <Link href="/khai-truong" className="text-gold hover:underline">
                Xem tuổi khai trương →
              </Link>
            </p>
          </section>

          {/* FAQ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="tam-tai"
                capturedEvent="lead_capture_tam_tai"
                blurb="Để lại email, chúng tôi báo khi có nội dung mới theo mùa: xem tuổi, ngày tốt, sao hạn. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>
        </section>
      </ToolPageShell>
    </>
  );
}
