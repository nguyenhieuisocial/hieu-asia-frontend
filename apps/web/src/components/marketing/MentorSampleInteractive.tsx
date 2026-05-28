'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquareQuote, ArrowRight } from 'lucide-react';

/**
 * Wave 60.95.i P2 — MentorSampleInteractive (vault 130 §interaction designer).
 *
 * Companion to SampleOutputShowcase (Wave 60.95.c), which shows a STATIC Mentor
 * Q&A card. This block adds an INTERACTIVE 3-question demo: user clicks a
 * question pill, the Mentor's pre-written response expands below. Zero LLM
 * cost — all responses hard-coded so user can feel "what does Mentor feel
 * like?" without paying or signing up.
 *
 * Why interactive after static? The static showcase says "this is what you'll
 * get"; the interactive sample says "go ahead, try it" — closes the click-gap
 * between curiosity and onboarding without burning a Mentor turn on the
 * backend. Calibrates expectation: Mentor reframes first, then suggests.
 *
 * Response copy register (matches /sample-report Mentor block + Mentor channel
 * UX on Telegram):
 *   - Open with a clarifying question (reframe, not prescribe)
 *   - Give 2-3 specific considerations (not generic advice)
 *   - End with one concrete next action
 *   - 100-150 words VN, calm-editorial, no fortune-telling vocabulary
 *
 * A11y: each pill has aria-pressed reflecting the active question; the
 * response panel uses aria-expanded + role=region with aria-labelledby
 * pointing at the active pill. Only one answer is visible at a time —
 * clicking a different question replaces the previous reveal; clicking the
 * same question collapses it.
 *
 * Brand tokens (vault 108 Option E, matching SampleOutputShowcase):
 *   bg-background / text-cream-{50,300,500} / text-gold / text-gold-soft
 *   border-border / border-gold/40 / rounded-card-editorial
 *   font-marketing-display Instrument Serif italics for emphasis spans
 *
 * Pure CSS transitions — no Motion runtime added. Reveal uses height/opacity
 * via grid-template-rows trick so the panel can be animated without measuring.
 */

type SampleQuestion = {
  id: string;
  question: string;
  /** Mentor's pre-written response — 100-150 words, calm-editorial register. */
  response: React.ReactNode;
};

const QUESTIONS: SampleQuestion[] = [
  {
    id: 'q1-two-jobs',
    question: 'Tôi đang phân vân giữa 2 công việc',
    response: (
      <>
        <p>
          Trước khi so sánh hai lựa chọn, bạn hãy thử trả lời:{' '}
          <em className="font-marketing-display italic text-gold-soft">
            cái nào bạn thấy nhẹ lòng khi tưởng tượng mình đã chọn nó rồi?
          </em>{' '}
          Cảm giác đầu tiên thường nói thật hơn lập luận về sau.
        </p>
        <p>
          Ba điểm nên cân nhắc cùng lúc: (1) công việc nào cho bạn cơ hội học
          một kỹ năng còn thiếu, không chỉ lặp lại điều đã giỏi; (2) môi trường
          nào có người bạn muốn trở nên giống — đồng nghiệp định hình mình hơn
          ta tưởng; (3) lương cao hơn 15% trở xuống thường không đủ bù cho một
          văn hoá lệch tone với bạn.
        </p>
        <p>
          Việc cụ thể: viết ra 1 trang A4, mỗi công việc một cột, ba dòng —
          điều mình học, người mình gặp, điều mình hy sinh. Đọc lại sau 48 giờ
          rồi quyết.
        </p>
      </>
    ),
  },
  {
    id: 'q2-improve-2026',
    question: 'Tôi nên cải thiện điều gì năm 2026?',
    response: (
      <>
        <p>
          Câu hỏi nên đổi một chút trước:{' '}
          <em className="font-marketing-display italic text-gold-soft">
            năm 2026 bạn muốn cuối năm nhìn lại và tự hào về điều gì?
          </em>{' '}
          “Cải thiện” dễ trở thành một danh sách dài không ai làm hết — chọn
          một chủ đề thì khả thi hơn.
        </p>
        <p>
          Ba hướng thường có sức nặng cao nhất: (1) một thói quen sức khoẻ duy
          trì được 90 ngày liên tiếp — nền tảng của mọi thứ khác; (2) một mối
          quan hệ bạn muốn đầu tư hơn, có thể là bố mẹ, bạn cũ, hoặc cộng sự;
          (3) một kỹ năng chuyên môn đủ sâu để được giới thiệu khi không có
          mặt.
        </p>
        <p>
          Việc cụ thể: chọn 1 trong 3 ở trên, viết ra giấy, dán nơi bạn nhìn
          hằng ngày. Quý 1 chỉ làm điều đó.
        </p>
      </>
    ),
  },
  {
    id: 'q3-relationship',
    question: 'Mối quan hệ này có nên giữ không?',
    response: (
      <>
        <p>
          Trước khi trả lời nên hay không,{' '}
          <em className="font-marketing-display italic text-gold-soft">
            bạn đang ở thời điểm nào trong mối quan hệ — đang yêu nhưng mệt,
            đã hết yêu nhưng quen, hay vẫn còn hy vọng?
          </em>{' '}
          Mỗi tình huống có câu trả lời khác.
        </p>
        <p>
          Ba dấu hiệu đáng giữ lại: (1) bạn vẫn cười khi nghĩ về người ấy ở
          một khoảnh khắc cụ thể, không phải ý tưởng chung chung; (2) sau cãi
          nhau, cả hai cùng quay lại bàn — không phải chỉ một bên; (3) bạn
          được là phiên bản mình thấy đáng quý khi ở cạnh họ. Thiếu cả ba, kéo
          dài sẽ làm cả hai mòn hơn.
        </p>
        <p>
          Việc cụ thể: viết một lá thư cho chính mình 5 năm tới — bạn muốn người
          ấy có còn trong đó không? Câu trả lời thường rõ hơn ta nghĩ.
        </p>
      </>
    ),
  },
];

export function MentorSampleInteractive() {
  // null = nothing revealed; otherwise the question id currently open.
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = QUESTIONS.find((q) => q.id === activeId) ?? null;

  const handleClick = (id: string) => {
    // Click same pill → collapse. Click different → switch.
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-label="Thử Mentor AI — ví dụ mẫu (không tốn lượt hỏi)"
      className="bg-background py-16 md:py-20"
    >
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-marketing-tight text-center">
          <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            — THỬ MENTOR AI
          </p>
          <h2 className="text-balance font-sans text-section-display font-bold tracking-tight leading-tight text-foreground">
            Chọn một câu hỏi để{' '}
            <em className="italic text-gold-soft">xem ví dụ</em>
            <span className="text-gold-dot">.</span>
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ba câu hỏi mẫu — bấm vào để xem Mentor trả lời thế nào. Không cần
            đăng ký, không tốn lượt hỏi.
          </p>
        </div>

        {/* Question pills */}
        <div
          role="group"
          aria-label="Ba câu hỏi mẫu"
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5 md:gap-3"
        >
          {QUESTIONS.map((q) => {
            const isActive = activeId === q.id;
            return (
              <button
                key={q.id}
                id={`mentor-q-${q.id}`}
                type="button"
                aria-pressed={isActive}
                aria-controls="mentor-sample-panel"
                onClick={() => handleClick(q.id)}
                // Wave 60.97.1 — `min-h-11 touch-manipulation` so chip reaches
                // 44px tap target on mobile (was 42px → just missed WCAG 2.5.5).
                // `active:bg-muted` adds touch feedback for iOS/Android.
                className={[
                  'rounded-pill border px-4 py-2.5 font-sans text-sm font-medium transition-all duration-300 ease-editorial min-h-11 touch-manipulation',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-dark-50',
                  isActive
                    ? 'border-gold bg-gold/[0.08] text-gold'
                    : 'border-gold/25 bg-card text-gold-soft hover:border-gold/45 hover:bg-muted hover:text-gold active:bg-muted',
                ].join(' ')}
              >
                {q.question}
              </button>
            );
          })}
        </div>

        {/* Reveal panel — grid trick lets us animate height without measurement. */}
        <div
          id="mentor-sample-panel"
          role="region"
          aria-live="polite"
          aria-expanded={active !== null}
          aria-labelledby={active ? `mentor-q-${active.id}` : undefined}
          className={[
            'mx-auto mt-6 grid max-w-marketing-tight transition-all duration-500 ease-editorial',
            active
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0',
          ].join(' ')}
        >
          <div className="overflow-hidden">
            {active && (
              <article className="rounded-card-editorial border border-gold/30 bg-muted/40 p-6 md:p-8">
                {/* User question label */}
                <div className="mb-4 flex items-start gap-2">
                  <MessageSquareQuote
                    className="mt-0.5 size-4 shrink-0 text-gold/70"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                      Bạn hỏi
                    </p>
                    <p className="mt-1 font-sans text-[15px] font-medium leading-snug text-foreground">
                      {active.question}
                    </p>
                  </div>
                </div>
                {/* Mentor response */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
                    Mentor
                  </p>
                  <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
                    {active.response}
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>

        {/* Footer note + CTA */}
        <div className="mx-auto mt-10 max-w-marketing-tight text-center">
          <p className="mb-5 text-pretty text-sm leading-relaxed text-muted-foreground/70">
            Đây là ví dụ mẫu. Mentor thật sẽ trả lời dựa trên lá số của bạn —
            cung mệnh, đại vận, ngũ hành cá nhân.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-ink transition-colors duration-200 hover:bg-gold-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-dark-50"
          >
            Lập lá số miễn phí
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
