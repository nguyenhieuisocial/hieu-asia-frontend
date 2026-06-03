import type { Metadata } from 'next';
import Link from 'next/link';
import { DatTenNguHanhChecker } from '@/components/dat-ten-ngu-hanh/DatTenNguHanhChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { ELEMENTS, type Element } from '@/lib/dat-ten-ngu-hanh';

const DESC =
  'Tra mệnh ngũ hành của bé theo ngày sinh (nạp âm) và gợi ý tên hợp mệnh theo phong tục: tên thuộc hành tương sinh, tránh hành tương khắc. Gợi ý tham khảo theo nghĩa chữ — không phán số mệnh.';

export const metadata: Metadata = {
  title: 'Đặt tên con theo ngũ hành — tra mệnh & gợi ý tên hợp mệnh',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/dat-ten-ngu-hanh' },
  openGraph: {
    title: 'Đặt tên con theo ngũ hành — gợi ý tên hợp mệnh',
    description: DESC,
    url: 'https://hieu.asia/dat-ten-ngu-hanh',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Đặt tên con theo ngũ hành là gì?',
    a: 'Là phong tục chọn tên cho con sao cho hành của tên hài hoà với mệnh ngũ hành của bé (tính theo năm sinh âm lịch). Người xưa tin tên hợp mệnh mang lại sự cân bằng, gửi gắm mong ước của cha mẹ. Đây là tập tục tham khảo, không phải công thức định đoạt tương lai.',
  },
  {
    q: 'Mệnh ngũ hành của bé tính thế nào?',
    a: 'Theo nạp âm của năm sinh âm lịch — mỗi năm ứng với một trong 30 nạp âm (ví dụ năm Bính Ngọ 2026 là Thiên Hà Thủy, mệnh Thủy). Công cụ tự đổi ngày sinh dương lịch sang năm âm (đã tính cả mốc Tết) rồi tra mệnh.',
  },
  {
    q: 'Nên chọn tên thuộc hành nào?',
    a: 'Theo quan niệm tương sinh, người ta thường chọn tên thuộc hành sinh ra mệnh của bé hoặc cùng mệnh để bổ trợ; và tránh hành khắc với mệnh. Ví dụ bé mệnh Thủy thì tên hành Kim (Kim sinh Thủy) hoặc hành Thủy được xem là hợp.',
  },
  {
    q: 'Tên gợi ý dựa trên cơ sở nào?',
    a: 'Dựa trên nghĩa chữ Hán-Việt (ví dụ Minh, Quang, Nhật gợi hành Hỏa; Hà, Hải, Vân gợi hành Thủy). Đây là cách phổ biến nhất nhưng không phải chuẩn tuyệt đối — một số trường phái tính theo số nét chữ. Hãy xem đây là gợi ý để tham khảo.',
  },
  {
    q: 'Tên hợp mệnh có quyết định cuộc đời con không?',
    a: 'Không. Đây chỉ là một nét văn hoá để cha mẹ tham khảo. Một cái tên hay, ý nghĩa đẹp, dễ gọi và tình yêu thương cha mẹ dành cho con mới là điều quan trọng nhất.',
  },
];

const ORDER: Element[] = ['kim', 'moc', 'thuy', 'hoa', 'tho'];

export default function DatTenNguHanhPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Đặt tên con theo ngũ hành — tra mệnh & gợi ý tên hợp mệnh',
            description: DESC,
            url: '/dat-ten-ngu-hanh',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Đặt tên ngũ hành', url: '/dat-ten-ngu-hanh' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Ngũ hành · Đặt tên con"
        icon={<span aria-hidden="true">🌱</span>}
        title={
          <>
            Đặt tên con theo <GoldAccent>ngũ hành</GoldAccent>
          </>
        }
        description="Tra mệnh ngũ hành của bé theo ngày sinh và gợi ý tên hợp mệnh theo phong tục. Đây là gợi ý để tham khảo — không phán số mệnh; tên đẹp và ý nghĩa tốt mới là điều quan trọng nhất."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Đặt tên ngũ hành' },
        ]}
      >
        <section className="space-y-8">
          <DatTenNguHanhChecker />

          {/* Ngũ hành tương sinh tương khắc */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Ngũ hành &amp; quy luật tương sinh
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Năm hành sinh ra nhau theo vòng: Thủy → Mộc → Hỏa → Thổ → Kim → Thủy. Khi đặt tên, người
              xưa chọn hành <strong>sinh ra mệnh</strong> của bé (hoặc cùng mệnh) để bổ trợ.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ORDER.map((key) => {
                const e = ELEMENTS[key];
                return (
                  <div key={key} className="rounded-xl border border-border bg-background/40 p-4">
                    <div className="font-heading text-base font-semibold text-foreground">Mệnh {e.name}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.blurb}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Hợp tên hành <strong className="text-foreground">{ELEMENTS[e.sinhBy].name}</strong> &amp;{' '}
                      <strong className="text-foreground">{e.name}</strong> · tránh{' '}
                      {ELEMENTS[e.khac].name}, {ELEMENTS[e.khacBy].name}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lời nhắn */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Một lời nhắn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Đặt tên theo ngũ hành là cách cha mẹ gửi gắm mong ước vào tên con — một nét đẹp văn hoá.
              Nhưng ngũ hành chỉ là một trong nhiều cách tiếp cận, và cái tên không định đoạt cuộc đời.
              hieu.asia đưa ra <strong>gợi ý để tham khảo</strong>; quyết định cuối cùng, cùng tình yêu
              thương cha mẹ dành cho con, mới là điều quý nhất.
            </p>
          </section>

          {/* FAQ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {FAQS.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <nav aria-label="Công cụ liên quan" className="text-sm text-muted-foreground">
            Xem thêm:{' '}
            <Link href="/xem-ngay" className="text-gold hover:underline">
              Xem ngày tốt
            </Link>{' '}
            ·{' '}
            <Link href="/hop-tuoi" className="text-gold hover:underline">
              Xem hợp tuổi
            </Link>{' '}
            ·{' '}
            <Link href="/lich-van-nien" className="text-gold hover:underline">
              Lịch Vạn Niên
            </Link>
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
