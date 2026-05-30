'use client';

import * as React from 'react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { PersonalityQuiz, type QuizPage } from '@/components/tools/PersonalityQuiz';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { EXTENDED_SURVEY_SCHEMA, type DiscDimension } from '@/lib/survey-schema-extended';
import { scoreDisc, type DiscScoreWithMeta } from '@/lib/scoring/disc';

const DISC_PAGES = EXTENDED_SURVEY_SCHEMA.pages.filter((p) =>
  p.name.startsWith('disc'),
) as QuizPage[];

const DIM_META: Record<DiscDimension, { letter: string; label: string; desc: string }> = {
  dominance: { letter: 'D', label: 'Quyết đoán', desc: 'Hướng kết quả, quyết nhanh, đối diện thách thức một cách trực diện.' },
  influence: { letter: 'i', label: 'Ảnh hưởng', desc: 'Truyền cảm hứng, cởi mở cảm xúc, mạnh ở kết nối và thuyết phục.' },
  steadiness: { letter: 'S', label: 'Ổn định', desc: 'Kiên nhẫn, nhất quán, coi trọng hoà hợp và sự đáng tin.' },
  compliance: { letter: 'C', label: 'Tuân thủ', desc: 'Chính xác, theo quy trình, phân tích kỹ trước khi quyết định.' },
};
const DIM_ORDER: DiscDimension[] = ['dominance', 'influence', 'steadiness', 'compliance'];

export default function DiscPage() {
  const [result, setResult] = React.useState<DiscScoreWithMeta | null>(null);

  // Mở link chia sẻ "/disc?r=d-i-s-c" → dựng lại kết quả để hiển thị ngay.
  React.useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('r');
    if (!r) return;
    const p = r.split('-').map((x) => parseInt(x, 10));
    if (p.length !== 4 || p.some((n) => !Number.isFinite(n) || n < 0 || n > 100)) return;
    const [d, i, s, c] = p;
    const scores = { dominance: d ?? 0, influence: i ?? 0, steadiness: s ?? 0, compliance: c ?? 0 };
    const sorted = (Object.entries(scores) as Array<[DiscDimension, number]>).sort((a, b) => b[1] - a[1]);
    setResult({
      scores,
      primary_style: sorted[0]?.[0] ?? 'dominance',
      secondary_style: sorted[1]?.[0] ?? 'influence',
      items_per_dimension: { dominance: 4, influence: 4, steadiness: 4, compliance: 4 },
      total_items: 16,
      total_answered: 16,
    });
  }, []);

  const onComplete = (answers: Record<string, number>) => {
    setResult(scoreDisc(answers));
    track('tool_used', { tool: 'disc', result: 'ok' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const styleCode = result
    ? `${DIM_META[result.primary_style].letter}/${DIM_META[result.secondary_style].letter}`
    : '';

  return (
    <>
      <ToolPageShell
        eyebrow="Trắc nghiệm hành vi · DiSC"
        icon={<span aria-hidden="true">🎯</span>}
        title={
          <>
            Trắc nghiệm <GoldAccent>DiSC</GoldAccent>
          </>
        }
        description="DiSC đo 4 phong cách hành vi — Quyết đoán (D), Ảnh hưởng (i), Ổn định (S), Tuân thủ (C) — hữu ích cho giao tiếp, làm việc nhóm và lãnh đạo. 16 câu, khoảng 3 phút."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Trắc nghiệm DiSC' },
        ]}
      >
        <section className="mt-6">
          {!result && (
            <div className="mx-auto max-w-2xl">
              <PersonalityQuiz pages={DISC_PAGES} onComplete={onComplete} ctaLabel="Xem kết quả DiSC →" />
            </div>
          )}

          {result && (
            <div className="mx-auto max-w-2xl space-y-4">
              <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                <CardContent className="p-6 text-center sm:p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Phong cách chính của bạn
                  </div>
                  <div className="my-2 bg-gold-gradient bg-clip-text font-heading text-5xl font-bold text-transparent">
                    {styleCode}
                  </div>
                  <p className="text-sm text-foreground/85">
                    {DIM_META[result.primary_style].label} · {DIM_META[result.secondary_style].label}
                  </p>
                  {result.total_answered < result.total_items && (
                    <p className="mt-2 text-xs text-amber-300">
                      Mới trả lời {result.total_answered}/{result.total_items} câu — kết quả có thể
                      chưa chính xác.
                    </p>
                  )}
                </CardContent>
              </Card>

              {DIM_ORDER.map((dim) => {
                const score = result.scores[dim];
                const isPrimary = dim === result.primary_style;
                const isSecondary = dim === result.secondary_style;
                const m = DIM_META[dim];
                return (
                  <Card
                    key={dim}
                    className={`bg-card/50 ${isPrimary ? 'border-gold/40' : 'border-border'}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <div>
                          <span className="font-heading text-base text-foreground">
                            {m.letter} · {m.label}
                          </span>
                          {isPrimary && <span className="ml-2 text-xs text-gold-700">Chính</span>}
                          {isSecondary && <span className="ml-2 text-xs text-muted-foreground">Phụ</span>}
                        </div>
                        <span className="font-heading text-lg font-semibold text-gold-700">{score}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${score}%` }} />
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-foreground/80">{m.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex flex-wrap gap-3 pt-1">
                <ShareResultButton
                  path={`/disc?r=${result.scores.dominance}-${result.scores.influence}-${result.scores.steadiness}-${result.scores.compliance}`}
                  title="Kết quả DiSC của tôi — hieu.asia"
                  text={`Phong cách hành vi của tôi là ${styleCode} (DiSC). Bạn thử xem mình thế nào?`}
                  trackId="disc"
                />
                <Button variant="outline" onClick={() => setResult(null)}>
                  Làm lại
                </Button>
                <Button asChild>
                  <a href="/onboarding">Luận giải sâu cùng AI Mentor →</a>
                </Button>
              </div>

              <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                Bản DiSC rút gọn mã nguồn mở (không phải Wiley DiSC® có bản quyền). Kết quả mang
                tính định hướng để hiểu phong cách giao tiếp của bạn.
              </p>
            </div>
          )}
        </section>
      </ToolPageShell>
      <StickyMobileCta trackId="disc" />
    </>
  );
}
