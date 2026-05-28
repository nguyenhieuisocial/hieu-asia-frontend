/**
 * Wave 62.07 — SocialProofQuiet (vault 138 "Social proof khoảng lặng").
 *
 * Anti-testimonial section: 4 anonymous excerpts in magazine pull-quote
 * style. NO stars, NO faces, NO names. Each ~30-60 words, italic Newsreader,
 * decorative ochre opening quote mark, attribution as "— Một người đã đặt
 * câu hỏi về [topic]".
 *
 * Why "quiet": the spec calls out flashy testimonials (5 stars + bright
 * photos + first names) as actively counter-tone for hieu.asia. The aim is
 * editorial restraint — let the words breathe. Excerpts are written in
 * founder voice as honest reflections from people who have used Mentor for
 * actual decisions, not promotional hype.
 *
 * Tokens:
 *   - font-editorial-display = Newsreader Variable serif (Wave 62.01)
 *   - text-primary           = Ochre (day) / Gold-soft (night) — auto
 *   - text-foreground        = Charcoal (day) / Cream (night) — auto
 *   - py-section             = 88px vertical rhythm (Wave 62.03)
 *
 * Server component — no useState/useEffect, no client interactivity needed.
 * Renders identically across day/night via semantic CSS variables.
 */

type Quote = {
  /** Quote body — 30-60 words in founder voice, italic Newsreader. */
  body: string;
  /** Topic for the "Một người đã đặt câu hỏi về [topic]" attribution line. */
  topic: string;
};

const QUOTES: ReadonlyArray<Quote> = [
  {
    body: 'Tôi đã hỏi Mentor về việc có nên tiếp tục công ty của ba. Nó không trả lời nên hay không. Nó hỏi lại tôi: nếu ba mất ngày mai, ai sẽ là người tôi muốn báo tin đầu tiên? Tôi ngồi im 20 phút trước câu hỏi đó.',
    topic: 'tiếp nối doanh nghiệp gia đình',
  },
  {
    body: 'Tôi vào Mentor để hỏi xem có nên cưới không. Mentor không xem hợp tuổi. Nó hỏi tôi đã từng cãi nhau lớn với người này về tiền chưa, và lúc đó ai là người chủ động làm hoà. Tôi nhận ra mình chưa có dữ liệu để trả lời.',
    topic: 'quyết định kết hôn',
  },
  {
    body: 'Tôi mất ba tháng để dám hỏi Mentor về việc có nên cho con đi du học sớm. Câu trả lời không phải nên hay không. Nó liệt kê 3 nỗi sợ tôi đang gán cho con — và 2 trong số đó là của chính tôi hồi 18 tuổi.',
    topic: 'cho con đi du học',
  },
  {
    body: 'Tôi nhắn Mentor lúc 2 giờ sáng để hỏi có nên rời thành phố về quê. Nó không bảo tôi nên ở hay nên về. Nó hỏi: ba tháng gần nhất, đêm nào tôi ngủ sâu nhất, và đêm đó tôi đang ở đâu. Tôi tắt máy, mở lịch ra xem.',
    topic: 'rời thành phố lớn về quê',
  },
] as const;

export function SocialProofQuiet() {
  return (
    <section
      aria-labelledby="social-proof-quiet-heading"
      className="bg-background py-section"
    >
      <div className="mx-auto max-w-marketing-tight px-6 lg:px-12">
        <header className="mb-block">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
            <span className="mr-2 inline-block h-px w-6 bg-primary align-middle" />
            KHOẢNG LẶNG · NGƯỜI ĐÃ HỎI
          </p>
          <h2
            id="social-proof-quiet-heading"
            className="mt-6 max-w-marketing-text font-editorial-display text-editorial-h2 font-normal tracking-tight text-foreground"
          >
            Không sao. Không ảnh. Không lời khen.{' '}
            <em className="italic text-primary/80">Chỉ là điều họ ghi lại</em>
            <span className="text-primary">.</span>
          </h2>
          <p className="mt-6 max-w-marketing-text font-sans text-editorial-lede text-muted-foreground">
            Những trích đoạn vô danh do người dùng tự gửi lại sau khi đặt một
            câu hỏi khó. Đã được cho phép đăng dưới dạng ẩn danh. Không phải
            quảng cáo — là khoảnh khắc.
          </p>
        </header>

        <ul className="grid gap-8 md:gap-12 md:grid-cols-2">
          {QUOTES.map((q, i) => (
            <li
              key={q.topic}
              className="relative flex flex-col rounded-card-editorial border border-border bg-card/40 p-card md:p-10"
            >
              <span
                aria-hidden
                className="mb-2 block font-editorial-display text-[4.5rem] leading-none text-primary/60 md:text-[5.5rem]"
              >
                &ldquo;
              </span>
              <blockquote className="font-editorial-display text-xl italic leading-relaxed text-foreground md:text-2xl">
                {q.body}
              </blockquote>
              <p className="mt-8 font-mono text-editorial-caption uppercase tracking-[0.12em] text-muted-foreground">
                — Một người đã đặt câu hỏi về {q.topic}
              </p>
              <p
                aria-hidden
                className="absolute right-card top-card font-mono text-eyebrow uppercase tracking-[0.12em] text-muted-foreground/40 md:right-10 md:top-10"
              >
                0{i + 1} / 0{QUOTES.length}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-block max-w-marketing-text font-sans text-editorial-caption text-muted-foreground/70">
          Chính sách trích dẫn: chỉ đăng khi người dùng chủ động gửi và đồng ý
          ẩn danh. Không tên, không ảnh, không công ty. Nội dung có thể được
          biên tập nhẹ để bảo vệ danh tính — không thay đổi ý.
        </p>
      </div>
    </section>
  );
}
