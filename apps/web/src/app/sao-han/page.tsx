import type { Metadata } from 'next';
import Link from 'next/link';
import { SaoHanCalculator } from '@/components/sao-han/SaoHanCalculator';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { SAO_ORDER, SAO_INFO, TYPE_LABEL, type SaoType } from '@/lib/sao-han';

const DESC =
  'Xem sao hạn (sao chiếu mệnh Cửu Diệu) theo tuổi và giới tính: La Hầu, Kế Đô, Thái Bạch, Thái Dương, Thái Âm, Mộc Đức, Thổ Tú, Thủy Diệu, Vân Hớn. Tra cứu nhanh kèm ý nghĩa từng sao — tham khảo theo phong tục, không bói toán.';

export const metadata: Metadata = {
  title: 'Xem sao hạn — sao chiếu mệnh theo tuổi (Cửu Diệu)',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/sao-han' },
  openGraph: {
    title: 'Xem sao hạn — sao chiếu mệnh theo tuổi',
    description: DESC,
    url: 'https://hieu.asia/sao-han',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Sao hạn (sao chiếu mệnh) là gì?',
    a: 'Theo phong tục phương Đông, mỗi năm có một trong 9 sao Cửu Diệu "chiếu" vào mỗi người tuỳ theo tuổi âm và giới tính. 9 sao gồm 3 sao tốt (Thái Dương, Thái Âm, Mộc Đức), 3 trung tính (Thổ Tú, Thủy Diệu, Vân Hớn) và 3 sao xấu (La Hầu, Kế Đô, Thái Bạch). Đây là nét văn hoá tín ngưỡng, mang tính tham khảo.',
  },
  {
    q: 'Cách tính sao hạn theo tuổi như thế nào?',
    a: 'Lấy tuổi mụ (tuổi âm ≈ năm xem trừ năm sinh cộng 1), rồi đối chiếu theo bảng riêng cho nam và nữ — vì cùng một tuổi, sao chiếu mệnh của nam và nữ khác nhau. Công cụ này tự tính giúp bạn khi nhập năm sinh và giới tính.',
  },
  {
    q: 'Năm nay gặp sao xấu (La Hầu, Kế Đô, Thái Bạch) thì sao?',
    a: 'Sao xấu không có nghĩa là chắc chắn gặp xui. Theo quan niệm dân gian, đó là năm nên cẩn trọng hơn — giữ lời nói, thận trọng tiền bạc – giấy tờ, chú ý sức khoẻ. Sống cẩn thận và chủ động vẫn là điều quan trọng nhất, hơn mọi điềm báo.',
  },
  {
    q: 'Có cần cúng sao giải hạn không?',
    a: 'Tuỳ niềm tin mỗi người. Một số gia đình làm lễ dâng sao đầu năm để cầu an — đó là nét văn hoá tín ngưỡng. hieu.asia chỉ giúp bạn tra cứu để tham khảo, không phán số mệnh và không bán lễ giải hạn.',
  },
  {
    q: 'La Hầu, Kế Đô có phải sao thật trên trời không?',
    a: 'Không. Trong 9 "sao" Cửu Diệu có 7 thiên thể thật (Mặt Trời, Mặt Trăng và 5 hành tinh Kim – Mộc – Thủy – Hỏa – Thổ), còn La Hầu (Rahu) và Kế Đô (Ketu) là hai giao điểm nơi quỹ đạo Mặt Trăng cắt đường hoàng đạo — đúng vùng trời xảy ra nhật thực, nguyệt thực. Người xưa thấy Mặt Trời, Mặt Trăng "bị nuốt" ở đó nên hình dung thành thần thoại, và hai "sao" này mang nghĩa che khuất, xáo trộn từ đó. Hiểu nguồn gốc để tham khảo phong tục một cách bình tĩnh — không cần sợ một giao điểm hình học.',
  },
];

const TYPE_DOT: Record<SaoType, string> = {
  tot: 'bg-emerald-500',
  trung: 'bg-amber-500',
  xau: 'bg-rose-500',
};

export default function SaoHanPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: 'Xem sao hạn — sao chiếu mệnh theo tuổi', description: DESC, url: '/sao-han' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Lịch Vạn Niên', url: '/lich-van-nien' },
            { name: 'Xem sao hạn', url: '/sao-han' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Lịch Vạn Niên · Sao hạn"
        icon={<span aria-hidden="true">⭐</span>}
        title={
          <>
            Xem <GoldAccent>sao hạn</GoldAccent>
          </>
        }
        description="Tra sao chiếu mệnh (Cửu Diệu) của bạn trong năm theo tuổi âm và giới tính. Đây là cách tra cứu theo phong tục dân gian để tham khảo — không phán số mệnh, không bán lễ giải hạn."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
          { label: 'Xem sao hạn' },
        ]}
        relatedSlug="/sao-han"
      >
        <section className="space-y-8">
          <SaoHanCalculator />

          {/* 9 sao Cửu Diệu */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              9 sao Cửu Diệu
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SAO_ORDER.map((key) => {
                const s = SAO_INFO[key];
                return (
                  <div key={key} className="rounded-xl border border-border bg-background/40 p-4">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${TYPE_DOT[s.type]}`} />
                      <span className="font-heading text-base font-semibold text-foreground">
                        {s.name}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {TYPE_LABEL[s.type]}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground/60">
                      Thực chất: {s.origin}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Nguồn gốc Cửu Diệu — lớp "nói có sách": thiên văn thật đằng sau phong tục */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Từ thiên văn đến phong tục — Cửu Diệu là gì?
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cửu Diệu bắt nguồn từ <strong className="text-foreground">Navagraha</strong> — chín
                &quot;thiên thể&quot; trong thiên văn Ấn Độ cổ, theo dòng giao lưu văn hoá và Phật giáo
                truyền vào Đông Á rồi thành tục xem sao hạn. Trong đó có 7 thiên thể thật: Mặt Trời
                (Thái Dương), Mặt Trăng (Thái Âm) và 5 hành tinh nhìn được bằng mắt thường — Kim tinh
                (Thái Bạch), Mộc tinh (Mộc Đức), Thủy tinh (Thủy Diệu), Hỏa tinh (Vân Hớn), Thổ tinh
                (Thổ Tú).
              </p>
              <p>
                Điều thú vị nhất: <strong className="text-foreground">La Hầu và Kế Đô không phải sao</strong>.
                Đó là hai giao điểm nơi quỹ đạo Mặt Trăng cắt đường hoàng đạo — đúng vùng trời xảy ra
                nhật thực, nguyệt thực. Người xưa thấy Mặt Trời, Mặt Trăng &quot;bị nuốt&quot; ở đó nên
                hình dung thành thần La Hầu nuốt nhật nguyệt; hai &quot;sao&quot; này mang nghĩa che
                khuất, xáo trộn từ đó.
              </p>
              <p>
                Hiểu nguồn gốc rồi sẽ thấy: sao hạn là cách người xưa gửi lời nhắc &quot;năm nay nên
                cẩn trọng điều gì&quot; lên bầu trời — một di sản văn hoá đáng trân trọng, không phải
                án phạt. Vì vậy không cần sợ, càng không cần tốn tiền để &quot;giải&quot; một giao điểm
                hình học.
              </p>
            </div>
          </section>

          {/* Note về cúng sao — neutral framing */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Một lời nhắn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sao hạn là một nét văn hoá lâu đời, giúp người xưa nhắc nhau sống cẩn trọng theo từng năm.
              Gặp sao tốt không có nghĩa là buông lơi, gặp sao xấu cũng không phải điều đáng sợ — đó chỉ
              là một góc nhìn để bạn chủ động hơn. hieu.asia trình bày để bạn <strong>tham khảo</strong>,
              không phán số mệnh và không bán lễ giải hạn.
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

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Xem sao hạn theo tuổi (con giáp)
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
              {[
                ['ty', 'Tý'], ['suu', 'Sửu'], ['dan', 'Dần'], ['mao', 'Mão'],
                ['thin', 'Thìn'], ['ti', 'Tỵ'], ['ngo', 'Ngọ'], ['mui', 'Mùi'],
                ['than', 'Thân'], ['dau', 'Dậu'], ['tuat', 'Tuất'], ['hoi', 'Hợi'],
              ].map(([slug, ten]) => (
                <Link key={slug} href={`/sao-han/${slug}`} className="text-gold hover:underline">
                  Tuổi {ten}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="sao-han-hub"
                capturedEvent="lead_capture_sao_han_hub"
                cta="Nhận nhắc"
                blurb="Để lại email, chúng tôi sẽ báo bạn khi có bản đầy đủ về sao hạn năm mới và nhắc ngày tốt theo mùa. Thi thoảng thôi, không spam."
              />
            </div>
          </section>

          <RelatedTools
            links={[
              { href: '/xem-ngay', label: 'Xem ngày tốt' },
              { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
              { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
              { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
            ]}
          />
        </section>
      </ToolPageShell>
    </>
  );
}
