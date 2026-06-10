import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { SinhConChecker } from '@/components/sinh-con/SinhConChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { VARIANTS } from './variants';

const DESC =
  'Đối chiếu năm sinh dự kiến của bé với tuổi bố mẹ theo Can Chi (Tam Hợp, Lục Hợp…) và mệnh nạp âm (tương sinh – tương khắc). Quy tắc minh bạch, giọng dung hoà — tham khảo phong tục, không phán định; em bé nào cũng là phúc.';

export const metadata: Metadata = {
  title: 'Sinh con theo năm — bé mệnh gì, đối chiếu tuổi bố mẹ',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/sinh-con' },
  openGraph: {
    title: 'Sinh con theo năm — bé mệnh gì, đối chiếu tuổi bố mẹ',
    description: DESC,
    url: 'https://hieu.asia/sinh-con',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Công cụ này tính những gì?',
    a: 'Từ năm sinh (âm lịch), công cụ tra: con giáp và can chi của bé, mệnh nạp âm theo vòng 60 Giáp Tý (ví dụ 2027 Đinh Mùi — Thiên Hà Thủy, mệnh Thủy), rồi đối chiếu với tuổi của bố mẹ theo hai lớp: quan hệ 12 con giáp (Tam Hợp, Lục Hợp, Lục Xung, Lục Hại) và tương sinh – tương khắc giữa hai mệnh.',
  },
  {
    q: 'Kết quả "lưu ý" (xung, hại, khắc) nghĩa là gì?',
    a: 'Là cách người xưa mô tả hai tuổi "khác nhịp" — chúng tôi hiển thị đúng quy tắc kèm cách hiểu lành mạnh: cần thêm kiên nhẫn và thấu hiểu. Đây không phải điềm xấu, không phải lời phán, và tuyệt đối không có chuyện em bé "khắc" hay mang lỗi với cha mẹ.',
  },
  {
    q: 'Tuổi tính theo năm dương hay năm âm?',
    a: 'Theo năm ÂM lịch — đúng quy ước dân gian. Người (hoặc bé) sinh vào tháng 1–2 dương lịch, trước mùng 1 Tết, thuộc năm âm liền trước. Ví dụ: bé sinh ngày 10/02/2026 vẫn thuộc năm Ất Tỵ 2025 vì Tết Bính Ngọ rơi vào 17/02/2026.',
  },
  {
    q: 'Có nên dựa vào đây để quyết định năm sinh con?',
    a: 'Không nên xem đây là tiêu chí quyết định. Sức khoẻ của mẹ, lời khuyên y khoa và điều kiện gia đình quan trọng hơn mọi quan niệm tuổi tác. Bảng đối chiếu chỉ là một góc nhìn phong tục để gia đình tham khảo thêm khi đằng nào cũng đang cân nhắc giữa vài thời điểm.',
  },
  {
    q: 'Sau khi xem hợp tuổi thì làm gì tiếp?',
    a: 'Khi biết mệnh của bé, bạn có thể xem gợi ý đặt tên hợp mệnh (công cụ Đặt Tên Ngũ Hành), xem bức tranh cả nhà với công cụ Xem Hợp Nhóm, hoặc chọn ngày tốt cho các việc của gia đình bằng công cụ Xem Ngày.',
  },
];

export default function SinhConPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Sinh con theo năm — bé mệnh gì, đối chiếu tuổi bố mẹ',
            description: DESC,
            url: '/sinh-con',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Sinh con theo năm', url: '/sinh-con' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Gia đình · Sinh con"
        icon={<span aria-hidden="true">👶</span>}
        title={
          <>
            Sinh con theo năm — <GoldAccent>đối chiếu tuổi bố mẹ</GoldAccent>
          </>
        }
        description="Tra mệnh, con giáp của bé theo năm sinh dự kiến và đối chiếu với tuổi bố mẹ theo quan niệm Can Chi. Quy tắc minh bạch, giọng dung hoà — tham khảo phong tục, không phán định."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Sinh con theo năm' },
        ]}
      >
        <section className="space-y-8">
          <SinhConChecker />

          <nav aria-label="Sinh con theo nhu cầu cụ thể" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="text-muted-foreground">Xem theo nhu cầu:</span>
            {VARIANTS.map((v) => (
              <Link key={v.slug} href={`/sinh-con/${v.slug}`} className="text-gold hover:underline">
                {v.label}
              </Link>
            ))}
          </nav>

          {/* Phương pháp đối chiếu */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Cách đối chiếu — minh bạch từng quy tắc
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Lớp 1 — quan hệ 12 con giáp:</strong> Tam Hợp (4
                nhóm ba con giáp "cùng nhịp") và Lục Hợp (6 cặp bổ trợ) là tín hiệu tham khảo đẹp;
                Lục Xung và Lục Hại là lời nhắc "khác nhịp, cần dung hoà" — không phải điềm xấu.
              </p>
              <p>
                <strong className="text-foreground">Lớp 2 — mệnh nạp âm:</strong> mỗi năm âm lịch
                ứng một nạp âm trong vòng 60 Giáp Tý (ví dụ 2026 Bính Ngọ và 2027 Đinh Mùi cùng là
                Thiên Hà Thủy — mệnh Thủy). Mệnh bố mẹ và bé được đối chiếu theo vòng tương sinh
                Kim → Thủy → Mộc → Hỏa → Thổ.
              </p>
              <p>
                Cả hai lớp đều là quy tắc cổ điển, deterministic — nhập cùng năm sinh luôn ra cùng
                kết quả, không "bói mù".
              </p>
            </div>
          </section>

          {/* Một lời nhắn */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Một lời nhắn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Đối chiếu tuổi là một nét văn hoá để gia đình thêm góc nhìn khi đón tin vui — không
              phải cánh cửa sàng lọc. Em bé nào cũng là phúc; sức khoẻ của mẹ, lời khuyên của bác sĩ
              và tình thương của gia đình mới là điều quyết định. hieu.asia hiển thị đúng quy tắc
              phong tục kèm cách hiểu dung hoà, để bạn tham khảo có chừng mực.
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

          <RelatedTools
            links={[
              { href: '/dat-ten-ngu-hanh', label: 'Đặt tên ngũ hành' },
              { href: '/xem-tuoi-cuoi', label: 'Xem tuổi cưới' },
              { href: '/xem-hop-nhom', label: 'Xem hợp cả nhà' },
              { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
              { href: '/xem-ngay', label: 'Xem ngày tốt' },
            ]}
          />
        </section>
      </ToolPageShell>
    </>
  );
}
