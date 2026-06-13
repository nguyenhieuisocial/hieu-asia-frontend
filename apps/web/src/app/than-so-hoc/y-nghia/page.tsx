import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, webPage } from '@/lib/seo/jsonld';
import { SO_CHU_DAO } from '@/lib/than-so-hoc-numbers';

export const metadata: Metadata = {
  title: 'Ý nghĩa 12 số chủ đạo trong thần số học — 1–9 & 11, 22, 33 | hieu.asia',
  description:
    'Tra cứu ý nghĩa từng số chủ đạo (đường đời) theo thần số học Pythagoras: chân dung khuynh hướng, điểm mạnh, bài học, góc tình cảm – công việc và câu hỏi tự soi. Con số mô tả khuynh hướng — không phán số phận.',
  alternates: { canonical: 'https://hieu.asia/than-so-hoc/y-nghia' },
  openGraph: {
    title: 'Ý nghĩa 12 số chủ đạo — thần số học | hieu.asia',
    description: 'Thư viện số chủ đạo viết theo lối phản tư: hiểu khuynh hướng để tự hỏi đúng câu — không phải để được phán.',
    url: 'https://hieu.asia/than-so-hoc/y-nghia',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Số chủ đạo được tính như thế nào?',
    a: 'Theo phương pháp Pythagoras: rút gọn riêng ngày sinh, tháng sinh và năm sinh về một chữ số (giữ nguyên nếu ra 11, 22, 33), cộng ba kết quả lại rồi rút gọn lần cuối — cũng giữ nguyên nếu ra số master. Công cụ thần số học trên hieu.asia tính tự động đúng quy tắc này và hiển thị từng bước để bạn kiểm chứng.',
  },
  {
    q: 'Số master (11, 22, 33) có "cao cấp" hơn các số khác không?',
    a: 'Không. Số master không phải đẳng cấp cao hơn — nó là phiên bản cường độ cao của một năng lượng gốc (11 của số 2, 22 của số 4, 33 của số 6): tiềm năng lớn hơn đi kèm bài tập khó hơn, dễ quá tải hơn. Mỗi số đều có vẻ đẹp và bài học riêng; không có số tốt, số xấu.',
  },
  {
    q: 'Con số có quyết định số phận của tôi không?',
    a: 'Không. Số chủ đạo là một cách mô tả khuynh hướng tính cách dựa trên quy ước của thần số học — nó giống một tấm gương gợi ý để tự quan sát, không phải bản án. Cùng một con số, mỗi người sống một đời hoàn toàn khác nhau; quyết định luôn ở bạn.',
  },
];

export default function ThanSoHocMeaningsHubPage() {
  const numsBase = SO_CHU_DAO.filter((n) => !n.master);
  const numsMaster = SO_CHU_DAO.filter((n) => n.master);

  return (
    <ToolPageShell
      eyebrow="THẦN SỐ HỌC · THƯ VIỆN"
      relatedSlug="/than-so-hoc"
      icon="🔢"
      title={<>Ý nghĩa <GoldAccent>12 số chủ đạo</GoldAccent></>}
      description="Mỗi số một trang: chân dung khuynh hướng, điểm mạnh, bài học lớn, góc tình cảm – công việc và câu hỏi để bạn tự soi. Con số mô tả khuynh hướng — bạn giữ quyết định."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Thần số học', href: '/than-so-hoc' },
        { label: 'Ý nghĩa số chủ đạo' },
      ]}
    >
      <div className="mx-auto max-w-3xl">
        <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Số chủ đạo (đường đời) tính từ ngày sinh theo phương pháp Pythagoras — rút gọn ngày, tháng, năm riêng rẽ rồi
          cộng lại, giữ nguyên các số master 11 · 22 · 33. Chưa biết số của mình?{' '}
          <Link href="/than-so-hoc" className="text-gold hover:underline">Tính miễn phí tại đây</Link>.
        </p>

        <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">Chín số cơ bản</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {numsBase.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/than-so-hoc/y-nghia/${n.slug}`}
                className="flex h-full flex-col items-center rounded-xl border border-border bg-card/40 p-4 text-center transition-colors hover:border-gold/40 hover:bg-gold/5"
              >
                <span className="font-heading text-3xl font-bold text-gold">{n.number}</span>
                <span className="mt-1 font-medium text-foreground">{n.archetype}</span>
                <span className="mt-1 text-xs text-muted-foreground">{n.keyTags.slice(0, 2).join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-heading text-xl font-semibold text-foreground">
          Ba số master <span className="text-sm font-normal text-muted-foreground">— cường độ cao hơn, bài tập khó hơn</span>
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {numsMaster.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/than-so-hoc/y-nghia/${n.slug}`}
                className="flex h-full flex-col items-center rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-4 text-center transition-colors hover:border-gold/50 hover:bg-gold/10"
              >
                <span className="font-heading text-3xl font-bold text-gold">{n.number}</span>
                <span className="mt-1 font-medium text-foreground">{n.archetype}</span>
                <span className="mt-1 text-xs text-muted-foreground">{n.keyTags.slice(0, 2).join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/than-so-hoc"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Tính số chủ đạo của bạn →
          </Link>
          <Link
            href="/tu-kiem"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            Vì sao mình không bói mù?
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-gold/25 bg-gold/5 p-4">
          <p className="text-xs text-muted-foreground">Ngoài số chủ đạo, thần số học còn 4 loại số khác — mỗi loại tiết lộ một khía cạnh riêng:</p>
          <Link
            href="/than-so-hoc/cac-loai-so"
            className="mt-2 inline-block text-sm font-medium text-gold hover:underline"
          >
            Khám phá Số Vận Mệnh, Số Linh Hồn, Số Nhân Cách & Số Ngày Sinh →
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
            url: '/than-so-hoc/y-nghia',
            name: 'Ý nghĩa 12 số chủ đạo trong thần số học',
            description:
              'Thư viện ý nghĩa số chủ đạo 1–9 và 11, 22, 33: khuynh hướng, điểm mạnh, bài học, tình cảm – công việc và câu hỏi tự soi.',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Thần số học', url: '/than-so-hoc' },
            { name: 'Ý nghĩa số chủ đạo', url: '/than-so-hoc/y-nghia' },
          ]),
          faqPage(FAQS),
        ]}
      />
    </ToolPageShell>
  );
}
