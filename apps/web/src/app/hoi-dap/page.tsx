import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';

const TITLE = 'Hỏi đáp về hieu.asia — Tử Vi AI, Bát Tự, MBTI & các phương pháp';
const DESCRIPTION =
  'Giải đáp ngắn gọn, trung thực: hieu.asia là gì, có phải xem bói không, có chính xác không, Tử Vi / Bát Tự / MBTI / Big Five / DISC là gì và nên bắt đầu từ đâu.';

interface QA {
  q: string;
  a: string;
}

const VE_HIEU_ASIA: QA[] = [
  {
    q: 'hieu.asia là gì?',
    a: 'hieu.asia là nền tảng "hiểu mình" bằng AI, kết hợp các lăng kính phương Đông (Tử Vi, Bát Tự) và tâm lý học hiện đại (MBTI, Big Five, DISC). Mục tiêu là giúp bạn tự hiểu bản thân và ra quyết định tốt hơn — không phán định số mệnh.',
  },
  {
    q: 'hieu.asia có phải xem bói không?',
    a: 'Không. hieu.asia trình bày mọi kết quả như công cụ tham khảo và chiêm nghiệm để hiểu bản thân, không khẳng định định mệnh và không hù doạ. Định vị xuyên suốt là "credible, không bói toán, không mê tín".',
  },
  {
    q: 'Kết quả có chính xác không?',
    a: 'Phần tính toán (lập lá số, ngày giờ, ngũ hành) chính xác theo thuật toán. Phần luận giải là góc nhìn tham khảo, có đối chiếu cổ thư và cá nhân hoá bằng AI. Giá trị nằm ở sự chiêm nghiệm, không phải "tiên tri".',
  },
  {
    q: 'hieu.asia có miễn phí không?',
    a: 'Nhiều công cụ miễn phí và cho kết quả ngay: MBTI, Big Five, DISC, Lịch Vạn Niên, hợp tuổi, xem ngày tốt… Một số phần đọc chuyên sâu có gói trả phí.',
  },
  {
    q: 'Cần cung cấp thông tin gì?',
    a: 'Tử Vi và Bát Tự cần ngày và giờ sinh chính xác. Các trắc nghiệm tâm lý (MBTI, Big Five, DISC) chỉ cần bạn trả lời bộ câu hỏi.',
  },
  {
    q: 'Dữ liệu của tôi có an toàn không?',
    a: 'Thông tin bạn nhập được dùng để tạo kết quả cho chính bạn. Bạn có thể xem chi tiết tại trang Chính sách quyền riêng tư (hieu.asia/privacy).',
  },
];

const VE_PHUONG_PHAP: QA[] = [
  {
    q: 'Tử Vi (Đẩu Số) là gì?',
    a: 'Tử Vi Đẩu Số là phương pháp luận mệnh phương Đông, lập một lá số gồm 12 cung và hàng chục sao dựa trên ngày, giờ sinh để mô tả các khía cạnh cuộc đời.',
  },
  {
    q: 'Bát Tự (Tứ Trụ) là gì?',
    a: 'Bát Tự là "tám chữ" Can - Chi của bốn trụ giờ, ngày, tháng, năm sinh. Người xem xét sự cân bằng Ngũ Hành và dụng thần để hiểu cốt cách và chu kỳ vận.',
  },
  {
    q: 'MBTI là gì?',
    a: 'MBTI phân loại tính cách thành 16 nhóm dựa trên bốn cặp xu hướng (hướng nội/ngoại, giác quan/trực giác, lý trí/cảm xúc, nguyên tắc/linh hoạt). Dễ nhớ và phổ biến để bắt đầu hiểu mình.',
  },
  {
    q: 'Big Five là gì?',
    a: 'Big Five (OCEAN) đo 5 chiều tính cách theo thang liên tục: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Bất ổn cảm xúc. Đây là mô hình có nền nghiên cứu tâm lý vững nhất.',
  },
  {
    q: 'DISC là gì?',
    a: 'DISC mô tả 4 phong cách hành vi và giao tiếp: Quyết đoán (D), Ảnh hưởng (i), Ổn định (S), Tuân thủ (C). Rất hữu ích cho làm việc nhóm và giao tiếp.',
  },
  {
    q: '"Tử Vi AI" khác gì xem tử vi thông thường trên mạng?',
    a: 'hieu.asia tính lá số chuẩn bằng thuật toán, rồi luận giải cá nhân hoá bằng AI có đối chiếu nguồn cổ thư — thay vì những bài "văn mẫu" chung chung. Bạn cũng có thể so sánh nhiều lăng kính để có góc nhìn đa chiều.',
  },
  {
    q: 'Tôi nên bắt đầu từ đâu?',
    a: 'Tuỳ mục tiêu: muốn nhanh thì làm một trắc nghiệm tâm lý (không cần giờ sinh); muốn chiều sâu phương Đông thì xem Tử Vi hoặc Bát Tự (cần giờ sinh). Xem tất cả công cụ tại hieu.asia/cong-cu.',
  },
];

const ALL_QA = [...VE_HIEU_ASIA, ...VE_PHUONG_PHAP];

function QaList({ items }: { items: QA[] }) {
  return (
    <div className="mt-4 space-y-4">
      {items.map((f) => (
        <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
          <h3 className="font-semibold text-foreground">{f.q}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
        </div>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/hoi-dap' },
  openGraph: {
    title: 'Hỏi đáp về hieu.asia',
    description: 'Tử Vi AI, Bát Tự, MBTI, Big Five, DISC — giải đáp ngắn gọn, trung thực.',
    url: 'https://hieu.asia/hoi-dap',
    type: 'website' as const,
  },
};

export default function HoiDapPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/hoi-dap' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Hỏi đáp', url: '/hoi-dap' },
          ]),
          faqPage(ALL_QA),
        ]}
      />
      <ToolPageShell
        eyebrow="Hỏi đáp"
        icon={<span aria-hidden="true">💬</span>}
        title={
          <>
            Câu hỏi <GoldAccent>thường gặp</GoldAccent>
          </>
        }
        description={DESCRIPTION}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hỏi đáp' },
        ]}
      >
        <section className="mt-8" aria-label="Về hieu.asia">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Về hieu.asia
          </h2>
          <QaList items={VE_HIEU_ASIA} />
        </section>

        <section className="mt-10" aria-label="Về các phương pháp">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Về các phương pháp
          </h2>
          <QaList items={VE_PHUONG_PHAP} />
        </section>

        <section className="mt-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              Bắt đầu khám phá
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              Thử một công cụ miễn phí, hoặc xem so sánh các lăng kính để chọn cái phù hợp với bạn.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/cong-cu"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Tất cả công cụ
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/so-sanh"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                So sánh các lăng kính
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-foreground/40">
          hieu.asia — Hiểu mình. Quyết định mình. Tham khảo, không bói toán.
        </p>
      </ToolPageShell>
    </>
  );
}
