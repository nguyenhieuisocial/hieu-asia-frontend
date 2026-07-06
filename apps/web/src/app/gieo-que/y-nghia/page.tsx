import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, itemList, webPage } from '@/lib/seo/jsonld';
import { QUE_PAGES, TRIGRAMS } from '@/lib/que-kinh-dich';

export const metadata: Metadata = {
  // SEO-FIX: absolute (79 → 48 chars) + description shortened (182 → ~155).
  title: { absolute: 'Ý nghĩa 64 quẻ Kinh Dịch — đủ bộ | hieu.asia' },
  description:
    'Ý nghĩa đủ 64 quẻ Kinh Dịch: tượng quẻ, ý chính thế cục, gợi ý ứng xử, góc tình cảm – công việc và câu hỏi tự soi. Quẻ mô tả thế cục — không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/gieo-que/y-nghia' },
  openGraph: {
    title: 'Ý nghĩa 64 quẻ Kinh Dịch — đủ bộ | hieu.asia',
    description: 'Thư viện 64 quẻ viết theo lối phản tư: hiểu thế cục để tự hỏi đúng câu — không phải để được phán.',
    url: 'https://hieu.asia/gieo-que/y-nghia',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Ý nghĩa các quẻ Kinh Dịch có cố định không?',
    a: 'Mỗi quẻ có một lõi nghĩa truyền thống (thoán từ, tượng truyện) được giữ qua hàng nghìn năm — nhưng nghĩa của quẻ trong từng lần gieo luôn phụ thuộc câu hỏi và hoàn cảnh của người gieo. Vì vậy mỗi trang ở đây kết bằng câu hỏi tự soi thay vì một lời phán cố định.',
  },
  {
    q: 'Quẻ "xấu" như Bĩ, Khốn, Truân có đáng sợ không?',
    a: 'Không. Kinh Dịch là sách về CHU KỲ: 64 quẻ mô tả 64 thế cục mà đời người luân phiên đi qua — có thịnh có suy, có tắc có thông. Quẻ "xấu" chỉ mô tả một giai đoạn khó và kèm luôn cách ứng xử khôn ngoan trong giai đoạn đó; chính các quẻ khó lại chứa những lời khuyên giá trị nhất.',
  },
  {
    q: 'Thứ tự 64 quẻ ở đây theo hệ nào?',
    a: 'Theo trình tự Văn Vương (King Wen) — thứ tự chuẩn của Chu Dịch được dùng phổ biến nhất: mở đầu bằng Thuần Càn – Thuần Khôn (trời đất) và kết bằng Ký Tế – Vị Tế (đã xong – chưa xong), như một vòng đời không khép hẳn.',
  },
];

export default function KinhDichMeaningsHubPage() {
  const thuongKinh = QUE_PAGES.filter((q) => q.id <= 30);
  const haKinh = QUE_PAGES.filter((q) => q.id > 30);

  return (
    <ToolPageShell
      eyebrow="KINH DỊCH · THƯ VIỆN"
      relatedSlug="/gieo-que"
      icon="📖"
      title={<>Ý nghĩa <GoldAccent>64 quẻ Kinh Dịch</GoldAccent></>}
      description="Đủ bộ 64 quẻ theo trình tự Văn Vương, mỗi quẻ một trang: tượng quẻ, ý chính của thế cục, gợi ý ứng xử, góc tình cảm – công việc và câu hỏi để bạn tự soi. Quẻ mô tả thế cục — bạn giữ quyết định."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Gieo quẻ', href: '/gieo-que' },
        { label: 'Ý nghĩa 64 quẻ' },
      ]}
    >
      <div className="mx-auto max-w-3xl">
        <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          64 quẻ là 64 <b className="text-foreground/85">thế cục điển hình</b> của đời người — từ{' '}
          <b className="text-foreground/85">Thuần Càn</b> (sức khởi đầu) qua thịnh suy tắc thông, đến{' '}
          <b className="text-foreground/85">Vị Tế</b> (chưa xong — vì đời không khép hẳn bao giờ). Chọn quẻ bạn vừa gieo
          được, hoặc quẻ đang khiến bạn tò mò.
        </p>

        {[
          { ten: 'Thượng Kinh — 30 quẻ đầu: trật tự của trời đất', ds: thuongKinh },
          { ten: 'Hạ Kinh — 34 quẻ sau: chuyện của con người', ds: haKinh },
        ].map((nhom) => (
          <section key={nhom.ten} className="mt-8">
            <h2 className="font-heading text-xl font-semibold text-foreground">{nhom.ten}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {nhom.ds.map((q) => {
                const up = TRIGRAMS[q.binary.slice(0, 3)];
                const down = TRIGRAMS[q.binary.slice(3)];
                return (
                  <li key={q.slug}>
                    <Link
                      href={`/gieo-que/y-nghia/${q.slug}`}
                      className="flex h-full items-baseline justify-between gap-3 rounded-lg border border-border bg-card/40 px-4 py-2.5 transition-colors hover:border-gold/40 hover:bg-gold/5"
                    >
                      <span className="font-medium text-foreground">
                        <span className="font-mono text-[13px] text-gold/80">{String(q.id).padStart(2, '0')}</span>{' '}
                        {q.nameVi}
                      </span>
                      <span className="shrink-0 text-right text-[13px] leading-snug text-muted-foreground">
                        {up && down ? `${up.tuong}/${down.tuong}` : ''} · {q.keyTags[0]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/gieo-que"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Gieo quẻ cho câu hỏi của bạn →
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
            url: '/gieo-que/y-nghia',
            name: 'Ý nghĩa 64 quẻ Kinh Dịch — đủ bộ theo trình tự King Wen',
            description:
              'Thư viện ý nghĩa 64 quẻ Kinh Dịch: tượng quẻ, ý chính thế cục, gợi ý ứng xử, góc tình cảm – công việc và câu hỏi tự soi.',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Gieo quẻ', url: '/gieo-que' },
            { name: 'Ý nghĩa 64 quẻ', url: '/gieo-que/y-nghia' },
          ]),
          faqPage(FAQS),
          itemList(
            QUE_PAGES.map((q) => ({
              name: q.nameVi,
              url: `/gieo-que/y-nghia/${q.slug}`,
            })),
          ),
        ]}
      />
    </ToolPageShell>
  );
}
