import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { TarotTool } from '@/components/tools/TarotTool';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';

const FAQS = [
  {
    q: 'Tarot có đoán được tương lai không?',
    a: 'Không có bằng chứng khoa học nào cho thấy Tarot tiên đoán được tương lai — lá bạn rút ra là ngẫu nhiên thật sự. Giá trị của Tarot nằm ở chỗ khác: mỗi lá là một bộ biểu tượng đủ rộng để bạn soi điều mình đang bận tâm vào đó, và chính quá trình tự hỏi ấy giúp bạn nhìn rõ vấn đề hơn. Quyết định vẫn luôn ở bạn.',
  },
  {
    q: 'Bộ Tarot 78 lá gồm những gì?',
    a: '22 lá Ẩn chính (Major Arcana) kể một hành trình lớn từ Gã Khờ đến Thế Giới, và 56 lá Ẩn phụ (Minor Arcana) chia 4 chất: Gậy (hành động, động lực), Cốc (cảm xúc, quan hệ), Kiếm (suy nghĩ, quyết định) và Tiền (vật chất, công việc). Công cụ này rút từ đủ bộ 78 lá.',
  },
  {
    q: 'Lá ngược (reversed) nghĩa là gì?',
    a: 'Theo cách đọc truyền thống, lá ngược thường được hiểu là mặt trầm của nghĩa xuôi — năng lượng đó đang bị chặn, thái quá hoặc thiếu hụt. Ở đây lá ngược chỉ là một góc nhìn ngược lại để bạn tự soi, không phải "điềm xấu".',
  },
  {
    q: 'Rút bài online có "kém linh" hơn rút bài giấy không?',
    a: 'Cả hai cách đều là ngẫu nhiên — không có cơ chế nào khiến lá rút tay "linh" hơn lá rút máy. Khác biệt thật nằm ở nghi thức: rút bài giấy chậm rãi giúp một số người tập trung hơn. Còn phần có giá trị nhất — dừng lại suy ngẫm sau khi rút — thì ở đâu cũng giống nhau.',
  },
  {
    q: 'Rút phải lá Death hay The Tower có đáng sợ không?',
    a: 'Không. Trong truyền thống Tarot, Death (Tử Thần) nói về việc một giai đoạn khép lại để giai đoạn khác bắt đầu, còn The Tower (Tòa Tháp) nói về thứ cũ kỹ sụp xuống buộc ta nhìn lại nền móng. Không lá nào là lời phán về tai ương có thật — và nơi nào dùng những lá này để hù dọa rồi bán lễ "hóa giải" thì bạn nên rời đi.',
  },
  {
    q: 'Tarot ở hieu.asia khác gì nơi khác?',
    a: 'Không phán định mệnh, không hù dọa, không bán "giải hạn". Bạn rút lá, đọc gợi ý phản tư, và nếu muốn có thể đọc sâu cùng AI dựa trên chính bối cảnh bạn mô tả — AI đặt câu hỏi giúp bạn nghĩ, không phán thay bạn.',
  },
];

export default function TarotPage() {
  return (
    <ToolPageShell
      eyebrow="TAROT PHẢN TƯ"
        relatedSlug="/tarot"
      icon="🃏"
      title={<>Rút lá <GoldAccent>Tarot</GoldAccent></>}
      description="Đặt một câu hỏi đang phân vân, rút lá — mỗi lá là một lăng kính để bạn nhìn quyết định từ góc khác. Không bói toán, không tiên đoán: bạn vẫn là người quyết."
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Tarot' }]}
    >
      <div className="mx-auto mb-6 max-w-3xl">
        <Link
          href="/tarot/hom-nay"
          className="flex items-center justify-between gap-3 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm transition-colors hover:bg-gold/10"
        >
          <span className="text-foreground/85">🌅 <b className="text-foreground">Lá Tarot hôm nay</b> — mỗi ngày một lá để dừng lại ngẫm</span>
          <span className="shrink-0 text-gold">Xem →</span>
        </Link>
        <Link
          href="/tarot/y-nghia"
          className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-card/40 px-4 py-3 text-sm transition-colors hover:border-gold/40 hover:bg-gold/5"
        >
          <span className="text-foreground/85">📖 <b className="text-foreground">Ý nghĩa 22 lá Ẩn chính</b> — tra cứu nghĩa xuôi &amp; ngược từng lá</span>
          <span className="shrink-0 text-gold">Mở →</span>
        </Link>
      </div>
      <TarotTool />

      <div className="mx-auto mt-14 max-w-3xl space-y-8">
        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Tarot là gì — và vì sao mình không dùng nó để &ldquo;bói&rdquo;?
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              Tarot khởi đầu là một <b className="text-foreground/85">bộ bài chơi</b> ở Ý thế kỷ 15; phải đến thế kỷ
              18–19 nó mới được dùng phổ biến để chiêm nghiệm, và bộ hình ảnh thông dụng nhất ngày nay là hệ
              Rider–Waite–Smith (1909). Bộ bài đủ gồm <b className="text-foreground/85">78 lá</b>: 22 Ẩn chính kể một
              hành trình lớn của đời người, 56 Ẩn phụ chia 4 chất Gậy – Cốc – Kiếm – Tiền ứng với hành động, cảm xúc,
              suy nghĩ và vật chất. Muốn hiểu một lá cụ thể, bạn có thể tra trong{' '}
              <Link href="/tarot/y-nghia" className="text-gold hover:underline">thư viện ý nghĩa 22 lá Ẩn chính</Link>.
            </p>
            <p>
              Mình nói thẳng: <b className="text-foreground/85">không có bằng chứng nào cho thấy lá bài đoán được
              tương lai</b> — lá bạn rút là ngẫu nhiên. Nhưng Tarot vẫn hữu ích theo một cách rất con người: biểu
              tượng trên lá đủ rộng để bạn <i>chiếu</i> điều mình đang bận tâm vào đó. Cùng một lá, người đang phân vân
              chuyện nghề sẽ thấy chuyện nghề, người đang trục trặc tình cảm sẽ thấy tình cảm. Cái bạn &ldquo;đọc&rdquo;
              được chính là tấm gương phản chiếu suy nghĩ của bạn — và đó là lý do mỗi lá ở đây đi kèm câu hỏi phản tư
              thay vì lời phán.
            </p>
            <p>
              Vì vậy quy tắc của mình: lá bài <b className="text-foreground/85">gợi câu hỏi, bạn giữ câu trả lời</b>.
              Không lá nào là điềm dữ, không ai phải mua lễ để &ldquo;hóa giải&rdquo; một lá bài.{' '}
              <Link href="/tu-kiem" className="text-gold hover:underline">Vì sao mình chọn cách này? →</Link>
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
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

      <JsonLd data={faqPage(FAQS)} />
      <StickyMobileCta trackId="tarot" />
    </ToolPageShell>
  );
}
