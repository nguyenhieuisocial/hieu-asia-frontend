import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { InfographicTuVi } from '@/components/learn/InfographicTuVi';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { PALACE_READINGS } from '@/lib/palace-readings';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Tử Vi 12 cung — Học huyền học',
  description:
    'Tìm hiểu 12 cung Tử Vi: Mệnh, Tài Bạch, Phu Thê, Quan Lộc... Mỗi cung phản ánh một lĩnh vực đời sống cụ thể.',
  alternates: { canonical: 'https://hieu.asia/learn/tu-vi' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (native <details>) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Tử Vi đến từ đâu?',
    a: 'Tử Vi Đẩu Số khởi nguồn từ Trung Hoa thời Tống (thế kỷ 10), do Trần Đoàn lão tổ hệ thống hóa. Nguyên lý chính: vị trí các sao quanh sao Tử Vi (Polaris) tại thời khắc sinh phản ánh cấu trúc số mệnh.',
  },
  {
    q: 'Cung là gì?',
    a: 'Cung là một trong 12 ô trên lá số, ứng với một khu vực của đời sống. Ví dụ cung Tài Bạch phản ánh dòng tiền, cung Phu Thê phản ánh hôn nhân. Sao đóng trong cung nào sẽ ảnh hưởng đến khu vực đó.',
  },
  {
    q: 'Có bao nhiêu sao?',
    a: 'Hệ thống tiêu chuẩn dùng 14 chính tinh (Tử Vi, Thiên Phủ, Vũ Khúc, Liêm Trinh...) cộng các phụ tinh — tổng cộng hơn 100 sao. hieu.asia dùng engine Iztro để tính đầy đủ chính tinh và phụ tinh.',
  },
  {
    q: 'Đọc lá số để làm gì?',
    a: 'Không phải để biết tương lai cố định. Mà để nhận diện thiên hướng, điểm mạnh, điểm dễ vấp — từ đó có quyết định phù hợp hơn. Lá số là bản đồ, không phải kịch bản.',
  },
  {
    q: 'Giới hạn của Tử Vi?',
    a: 'Tử Vi không dự đoán được trúng số, không thay thế lời khuyên y tế/pháp lý/tài chính. Đây là công cụ tự nhận thức, dùng kết hợp với suy nghĩ tỉnh táo và hành động thực tế.',
  },
];

const JSONLD = [
  article({
    headline: 'Tử Vi 12 cung — nền tảng cho người mới',
    description:
      'Tìm hiểu 12 cung Tử Vi: Mệnh, Tài Bạch, Phu Thê, Quan Lộc... Mỗi cung phản ánh một lĩnh vực đời sống cụ thể.',
    url: '/learn/tu-vi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tử Vi 12 cung', url: '/learn/tu-vi' },
  ]),
  faqPage(FAQS),
];

export default function LearnTuViPage() {
  return (
    <LearnArticle
      eyebrow="Đông phương · Trung Hoa"
      title={
        <>
          Tử Vi <span className="bg-gold-gradient bg-clip-text text-transparent">12 cung</span>
        </>
      }
      standfirst={
        <>
          Lá số Tử Vi chia đời người thành 12 lĩnh vực (gọi là "cung"), mỗi cung chứa các sao
          ảnh hưởng đến một mặt cụ thể của cuộc sống — từ sức khỏe, tài chính, tình cảm đến
          sự nghiệp.{' '}
          <Link
            href="/methodology/tu-vi"
            className="text-gold-700 underline-offset-4 hover:underline"
          >
            Xem phương pháp luận →
          </Link>
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026 · Đối chiếu cổ thư"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tử Vi 12 cung' },
      ]}
      relatedLenses={relatedLearnLenses('tu-vi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh, hệ thống dựng lá số Tử Vi 12 cung trong khoảng 30 giây. Bạn xem lá số đầy đủ trước khi quyết định mở khóa luận giải sâu.',
        href: '/reading/new?method=tu-vi',
        label: 'Lập lá số Tử Vi của bạn',
      }}
      sections={[
        {
          id: 'so-do-12-cung',
          tocLabel: '12 cung trên lá số',
          heading: '12 cung trên lá số',
          children: (
            <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
              <InfographicTuVi />
            </div>
          ),
        },
        {
          id: 'tung-cung',
          tocLabel: 'Bấm vào cung bạn quan tâm',
          heading: '12 cung — bấm vào cung bạn quan tâm',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Mỗi cung là một trang riêng: bạn sẽ thấy cung đó quản lĩnh vực nào, các sao đáng để
                ý, cách một buổi luận đi từ sao sang quyết định, và những câu hỏi đời thực mà cung
                này thực sự trả lời được.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PALACE_READINGS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/learn/tu-vi/${p.slug}`}
                    className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-700">
                      {p.domain}
                    </p>
                    <p className="mt-1.5 font-heading text-base font-semibold text-foreground group-hover:text-gold">
                      Cung {p.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {p.governs.split('.')[0]}.
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <dl className="space-y-2">
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  open={i === 0}
                  className="group rounded border border-border px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <span>{f.q}</span>
                    <ChevronDown
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </dl>
          ),
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
