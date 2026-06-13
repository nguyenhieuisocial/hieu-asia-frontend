import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, webPage } from '@/lib/seo/jsonld';
import { SAO_GIO } from '@/lib/gio-hoang-dao-stars';

export const metadata: Metadata = {
  title: 'Ý nghĩa 12 sao giờ — 6 sao hoàng đạo & 6 sao hắc đạo | hieu.asia',
  description:
    'Tra cứu ý nghĩa 12 sao giờ: 6 sao hoàng đạo (Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh) và 6 sao hắc đạo (Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Huyền Vũ, Câu Trận) — mỗi sao kèm việc hợp/nên tránh và cách dùng tỉnh táo. Không bói mù.',
  alternates: { canonical: 'https://hieu.asia/gio-hoang-dao/y-nghia' },
  openGraph: {
    title: 'Ý nghĩa 12 sao giờ — hoàng đạo & hắc đạo | hieu.asia',
    description: 'Thư viện 12 sao giờ viết theo lối tỉnh táo: hiểu sao để chọn thời điểm, không phải để sợ.',
    url: 'https://hieu.asia/gio-hoang-dao/y-nghia',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Giờ hoàng đạo và giờ hắc đạo là gì?',
    a: 'Theo phong tục phương Đông, mỗi ngày có 12 khung giờ (mỗi giờ hai tiếng đồng hồ), lần lượt được một trong 12 sao "cai quản". Sáu sao lành gọi là sao hoàng đạo — khung giờ ấy là "giờ tốt"; sáu sao dữ gọi là sao hắc đạo — khung giờ ấy là "giờ xấu". Sao nào rơi vào giờ nào thay đổi theo từng ngày.',
  },
  {
    q: 'Giờ xấu (hắc đạo) có thật sự nguy hiểm không?',
    a: 'Không. "Giờ xấu" là một lời nhắc thận trọng của phong tục, không phải điềm tai hoạ chắc chắn. 12 sao luân phiên đều đặn mỗi ngày — ai cũng đi qua cả giờ tốt lẫn giờ xấu hằng ngày. Sống cẩn thận và chuẩn bị kỹ cho việc mình làm quan trọng hơn việc né một khung giờ.',
  },
  {
    q: 'Có nhất thiết phải chọn giờ hoàng đạo để làm việc lớn không?',
    a: 'Tuỳ niềm tin mỗi người. Chọn giờ đẹp giúp nhiều người bắt đầu việc với tâm thế tự tin, thoải mái — đó là giá trị tâm lý có thật. Nhưng kết quả cuối cùng do sự chuẩn bị và nỗ lực của bạn quyết định, không phải khung giờ. hieu.asia giúp bạn tra cứu để tham khảo, không phán định mệnh.',
  },
];

export default function SaoGioMeaningsHubPage() {
  const hoangDao = SAO_GIO.filter((s) => s.good);
  const hacDao = SAO_GIO.filter((s) => !s.good);

  return (
    <ToolPageShell
      eyebrow="GIỜ HOÀNG ĐẠO · THƯ VIỆN"
      relatedSlug="/gio-hoang-dao"
      icon="🕐"
      title={<>Ý nghĩa <GoldAccent>12 sao giờ</GoldAccent></>}
      description="Mỗi sao một trang: biểu tượng, việc thường hợp hoặc nên thận trọng, và gợi ý dùng giờ một cách tỉnh táo. Giờ tốt là cách chọn thời điểm để khởi sự cho vững tâm — không phải định mệnh."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Giờ hoàng đạo', href: '/gio-hoang-dao' },
        { label: 'Ý nghĩa 12 sao' },
      ]}
    >
      <div className="mx-auto max-w-3xl">
        <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Mỗi ngày, 12 sao này luân phiên cai quản 12 khung giờ — <b className="text-foreground/85">6 sao hoàng đạo</b>{' '}
          (giờ tốt) xen <b className="text-foreground/85">6 sao hắc đạo</b> (giờ xấu). Muốn biết hôm nay giờ nào tốt?{' '}
          <Link href="/gio-hoang-dao" className="text-gold hover:underline">Tra giờ hoàng đạo theo ngày tại đây</Link>.
        </p>

        <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
          6 sao hoàng đạo <span className="text-sm font-normal text-muted-foreground">— giờ tốt, thuận khởi sự</span>
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {hoangDao.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/gio-hoang-dao/y-nghia/${s.slug}`}
                className="flex h-full flex-col rounded-xl border border-gold/25 bg-gold/5 p-4 transition-colors hover:border-gold/50 hover:bg-gold/10"
              >
                <span className="font-heading text-lg font-semibold text-foreground">{s.name}</span>
                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.keyTags.join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-heading text-xl font-semibold text-foreground">
          6 sao hắc đạo <span className="text-sm font-normal text-muted-foreground">— giờ xấu, nên thận trọng</span>
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {hacDao.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/gio-hoang-dao/y-nghia/${s.slug}`}
                className="flex h-full flex-col rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-gold/40 hover:bg-gold/5"
              >
                <span className="font-heading text-lg font-semibold text-foreground">{s.name}</span>
                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.keyTags.join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/gio-hoang-dao"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Tra giờ hoàng đạo hôm nay →
          </Link>
          <Link
            href="/tu-kiem"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            Vì sao mình không bói mù?
          </Link>
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Câu hỏi thường gặp</h2>
          <dl className="mt-4 space-y-4">
            {FAQS.map((f, i) => (
              <div key={i}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <JsonLd
        data={[
          webPage({
            url: '/gio-hoang-dao/y-nghia',
            name: 'Ý nghĩa 12 sao giờ — hoàng đạo & hắc đạo',
            description:
              'Thư viện ý nghĩa 12 sao giờ: 6 sao hoàng đạo và 6 sao hắc đạo, mỗi sao kèm việc hợp/nên tránh và cách dùng tỉnh táo.',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Giờ hoàng đạo', url: '/gio-hoang-dao' },
            { name: 'Ý nghĩa 12 sao', url: '/gio-hoang-dao/y-nghia' },
          ]),
          faqPage(FAQS),
        ]}
      />
    </ToolPageShell>
  );
}
