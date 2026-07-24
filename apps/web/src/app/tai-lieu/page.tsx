import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { TAI_LIEU } from '@/lib/tai-lieu/registry';

/**
 * /tai-lieu — hub tài liệu tặng miễn phí (lead magnet).
 *
 * Mỗi tài liệu có trang đích riêng: đọc được trọn nội dung trên web (không
 * tường email), và một nút tải PDF đi qua cổng email dùng lại hạ tầng sẵn có
 * (<DownloadToolPdfButton> → /email/subscribe → double opt-in Resend).
 *
 * Chủ ý: KHÔNG khoá nội dung sau email. Người đọc thấy giá trị thật trước rồi
 * mới quyết để lại email cho bản mang về — đúng thứ tự "cho trước, mời sau".
 */

const DESC =
  'Bốn tài liệu miễn phí của hieu.asia: sách điện tử đọc lá số không mê tín, tuổi xông đất Tết Đinh Mùi 2027, lịch ngày tốt trong tháng và bộ 3 câu hỏi tự soi trước quyết định lớn.';

export const metadata: Metadata = {
  title: 'Tài liệu tặng miễn phí',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/tai-lieu' },
  openGraph: {
    title: 'Tài liệu tặng miễn phí — hieu.asia',
    description: DESC,
    url: 'https://hieu.asia/tai-lieu',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

export default function TaiLieuHubPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: 'Tài liệu tặng miễn phí', description: DESC, url: '/tai-lieu' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tài liệu tặng', url: '/tai-lieu' },
          ]),
        ]}
      />
      <ToolPageShell
        eyebrow="Tài liệu tặng · Miễn phí"
        icon={<span aria-hidden="true">🎁</span>}
        title={
          <>
            Bốn tài liệu <GoldAccent>tặng bạn</GoldAccent>
          </>
        }
        description="Đọc trọn trên web, không phải để lại email. Muốn bản PDF mang về hoặc in ra thì để lại email — chúng tôi gửi thẳng vào hộp thư, không spam, huỷ bất cứ lúc nào."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài liệu tặng' }]}
      >
        <section className="grid gap-4 sm:grid-cols-2">
          {TAI_LIEU.map((doc) => (
            <Link
              key={doc.slug}
              href={`/tai-lieu/${doc.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-xl"
                >
                  {doc.emoji}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {doc.cadence}
                </span>
              </div>
              <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {doc.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{doc.blurb}</p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {doc.gets.map((g) => (
                  <li key={g}>· {g}</li>
                ))}
              </ul>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                Mở tài liệu
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-focus-within:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.04] p-5">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Vì sao tặng không?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Vì phần lớn công cụ trên hieu.asia vốn đã miễn phí, và chúng tôi muốn bạn thấy cách
            chúng tôi làm việc trước khi cân nhắc trả tiền cho bất cứ thứ gì. Các tài liệu này nói
            rõ chỗ nào là phép tính kiểm chứng được, chỗ nào là tập tục để tham khảo — kể cả khi
            điều đó khiến chúng nghe kém chắc chắn hơn nơi khác.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
            >
              Lập lá số miễn phí →
            </Link>
            <Link
              href="/cong-cu"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-gold"
            >
              Xem toàn bộ công cụ →
            </Link>
          </div>
        </section>
      </ToolPageShell>
    </>
  );
}
