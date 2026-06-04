import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { PURPOSES } from './purposes';

const DESC =
  'Xem ngày tốt cho cưới hỏi, khai trương, động thổ, nhập trạch, xuất hành, mua xe, ký hợp đồng. Chấm điểm theo Hoàng đạo, trực ngày, sao tốt xấu và cảnh báo Tam Tai, Kim Lâu, Hoang Ốc theo tuổi.';

export const metadata: Metadata = {
  title: 'Xem ngày tốt theo mục đích — Lịch Vạn Niên',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/xem-ngay' },
  openGraph: {
    title: 'Xem ngày tốt theo mục đích',
    description: DESC,
    url: 'https://hieu.asia/xem-ngay',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Xem ngày tốt dựa trên những yếu tố nào?',
    a: 'Hệ thống chấm điểm 0–100 cho mỗi ngày dựa trên: ngày Hoàng đạo hay Hắc đạo, trực ngày (Kiến, Trừ, Mãn…), các sao tốt – sao xấu của ngày, và cảnh báo theo tuổi (Tam Tai, Kim Lâu, Hoang Ốc) tính từ năm sinh. Tổng hợp lại thành điểm kèm lý do cụ thể.',
  },
  {
    q: 'Ngày Hoàng đạo, Hắc đạo là gì?',
    a: 'Theo lịch pháp, mỗi ngày có một trong 12 vị thần luân phiên trực. Sáu ngày có cát tinh trực gọi là ngày Hoàng đạo (thuận cho việc lớn), sáu ngày còn lại là Hắc đạo (nên thận trọng). Đây là một trong nhiều yếu tố được cân nhắc, không phải tất cả.',
  },
  {
    q: 'Tam Tai, Kim Lâu, Hoang Ốc là gì?',
    a: 'Là các cách tính kiêng theo tuổi: Tam Tai là 3 năm hạn theo nhóm tam hợp; Kim Lâu và Hoang Ốc thường được xét khi cưới hỏi, làm nhà. Khi bạn nhập năm sinh, hệ thống nhắc các cảnh báo này để bạn cân nhắc — đây là tập tục dân gian, không khẳng định đúng – sai.',
  },
  {
    q: 'Vì sao mỗi việc lại xem ngày khác nhau?',
    a: 'Mỗi việc trọng các yếu tố khác nhau: cưới hỏi chú trọng sao Thiên Hỷ, Tam Hợp và tránh Cô Thần – Quả Tú; khai trương chú trọng sao Tài – Lộc và tránh ngày hao tài; động thổ, nhập trạch xét thêm Kim Lâu, Hoang Ốc theo tuổi gia chủ. Vì vậy hãy chọn đúng mục đích để chấm điểm sát hơn.',
  },
  {
    q: 'Xem ngày tốt có đảm bảo mọi việc suôn sẻ không?',
    a: 'Không. Đây là công cụ tham khảo theo lịch pháp truyền thống, giúp bạn an tâm và chọn thời điểm đẹp. Sự chuẩn bị kỹ lưỡng và quyết tâm của bạn mới là điều quan trọng nhất.',
  },
];

export default function XemNgayHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: 'Xem ngày tốt theo mục đích', description: DESC, url: '/xem-ngay' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem ngày tốt', url: '/xem-ngay' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Lịch Vạn Niên · Xem ngày"
        icon={<span aria-hidden="true">📅</span>}
        title={
          <>
            <GoldAccent>Xem ngày tốt</GoldAccent> theo mục đích
          </>
        }
        description="Chọn việc bạn dự định làm để xem ngày đẹp phù hợp — chấm điểm theo Hoàng/Hắc đạo, trực ngày, sao tốt xấu và cảnh báo Tam Tai, Kim Lâu, Hoang Ốc theo tuổi. Tham khảo theo lịch pháp truyền thống, không phải lời phán số mệnh."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
          { label: 'Xem ngày tốt' },
        ]}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PURPOSES.map((p) => (
            <Link
              key={p.slug}
              href={`/xem-ngay/${p.slug}`}
              className="group rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm transition-colors hover:border-gold/40"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="text-2xl">
                  {p.emoji}
                </span>
                <span className="font-heading text-lg font-semibold text-foreground group-hover:text-gold">
                  Xem ngày {p.h1Suffix}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.seoDescription}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Muốn kiểm tra nhanh nhiều loại việc trong một form?{' '}
          <Link href="/lich-van-nien/ngay-tot-xau" className="text-gold hover:underline">
            Dùng công cụ Kiểm tra ngày tốt tổng hợp
          </Link>
          .
        </p>

        {/* Cách chấm điểm ngày — nội dung giáo dục */}
        <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Xem ngày tốt dựa trên những gì?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Khác với xem lịch chung, công cụ chấm điểm 0–100 cho đúng ngày bạn chọn theo việc dự
            định, dựa trên các yếu tố của lịch pháp truyền thống:
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Hoàng đạo / Hắc đạo:</strong> ngày có cát tinh
              trực thì cộng điểm, có hung tinh thì trừ điểm.
            </li>
            <li>
              <strong className="text-foreground">Trực ngày:</strong> 12 trực (Kiến, Trừ, Mãn,
              Bình, Định, Chấp, Phá, Nguy, Thành, Thâu, Khai, Bế) — mỗi trực hợp hoặc kỵ những việc
              nhất định.
            </li>
            <li>
              <strong className="text-foreground">Sao tốt – sao xấu:</strong> sao như Thiên Đức,
              Nguyệt Đức, Tam Hợp cộng điểm; sao như Cô Thần, Quả Tú, Lục Xung, Tam Sát trừ điểm.
            </li>
            <li>
              <strong className="text-foreground">Cảnh báo theo tuổi:</strong> nếu nhập năm sinh,
              hệ thống nhắc các năm/tuổi phạm Tam Tai, Kim Lâu, Hoang Ốc để bạn cân nhắc.
            </li>
          </ul>
        </section>

        {/* Một lời nhắn */}
        <section className="mt-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Một lời nhắn
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Chọn ngày tốt là một nét văn hoá giúp ta khởi sự với tâm thế an tâm và trân trọng thời
            khắc. Nhưng ngày đẹp không làm thay phần chuẩn bị, và lỡ ngày đẹp cũng không có nghĩa
            việc sẽ hỏng. hieu.asia trình bày để bạn <strong>tham khảo</strong> — không phán số
            mệnh, không bán lễ.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
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

        <RelatedTools
          links={[
            { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
            { href: '/sao-han', label: 'Xem sao hạn' },
            { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
            { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
          ]}
        />
      </ToolPageShell>
    </>
  );
}
