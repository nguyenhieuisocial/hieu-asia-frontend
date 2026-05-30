'use client';

import * as React from 'react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { PersonalityQuiz, type QuizPage } from '@/components/tools/PersonalityQuiz';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { EXTENDED_SURVEY_SCHEMA, type BigFiveTrait } from '@/lib/survey-schema-extended';
import { scoreBigFive, type BigFiveScoreWithMeta } from '@/lib/scoring/big-five';

const BIG_FIVE_PAGES = EXTENDED_SURVEY_SCHEMA.pages.filter((p) =>
  p.name.startsWith('big_five'),
) as QuizPage[];

const TRAIT_META: { key: BigFiveTrait; label: string; en: string; high: string; low: string }[] = [
  { key: 'openness', label: 'Cởi mở', en: 'Openness', high: 'Tò mò, sáng tạo, thích ý tưởng và trải nghiệm mới.', low: 'Thực tế, ưa điều quen thuộc và đã được kiểm chứng.' },
  { key: 'conscientiousness', label: 'Tận tâm', en: 'Conscientiousness', high: 'Kỷ luật, có tổ chức, theo đuổi mục tiêu đến cùng.', low: 'Linh hoạt, tuỳ hứng, thoải mái với sự ngẫu hứng.' },
  { key: 'extraversion', label: 'Hướng ngoại', en: 'Extraversion', high: 'Năng động, thích giao tiếp, nạp năng lượng từ đám đông.', low: 'Trầm tĩnh, thích chiều sâu và không gian riêng.' },
  { key: 'agreeableness', label: 'Dễ chịu', en: 'Agreeableness', high: 'Tin tưởng, đồng cảm, đặt sự hoà hợp lên trước.', low: 'Thẳng thắn, cạnh tranh, đặt logic trước cảm xúc.' },
  { key: 'neuroticism', label: 'Nhạy cảm cảm xúc', en: 'Neuroticism', high: 'Nhạy cảm, dễ lo nghĩ, cảm xúc thay đổi nhanh.', low: 'Bình thản, ổn định, ít bị stress cuốn đi.' },
];

function level(score: number): 'Cao' | 'Trung bình' | 'Thấp' {
  if (score >= 60) return 'Cao';
  if (score <= 40) return 'Thấp';
  return 'Trung bình';
}

export default function BigFivePage() {
  const [result, setResult] = React.useState<BigFiveScoreWithMeta | null>(null);

  const onComplete = (answers: Record<string, number>) => {
    setResult(scoreBigFive(answers));
    track('tool_used', { tool: 'big-five', result: 'ok' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ToolPageShell
        eyebrow="Trắc nghiệm tính cách · IPIP-NEO"
        icon={<span aria-hidden="true">🧭</span>}
        title={
          <>
            Big Five <GoldAccent>(OCEAN)</GoldAccent>
          </>
        }
        description="Trắc nghiệm tính cách Big Five — mô hình có cơ sở khoa học vững nhất, đo 5 chiều: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu và Nhạy cảm cảm xúc. 20 câu, khoảng 4 phút."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Big Five (OCEAN)' },
        ]}
      >
        <section className="mt-6">
          {!result && (
            <div className="mx-auto max-w-2xl">
              <PersonalityQuiz pages={BIG_FIVE_PAGES} onComplete={onComplete} ctaLabel="Xem kết quả Big Five →" />
            </div>
          )}

          {result && (
            <div className="mx-auto max-w-2xl space-y-4">
              <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                <CardContent className="p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Hồ sơ Big Five của bạn
                  </div>
                  <p className="mt-2 text-sm text-foreground/80">
                    Năm chiều tính cách dưới đây là các xu hướng — không phải nhãn cố định. Điểm
                    cao/thấp đều có điểm mạnh riêng.
                  </p>
                  {result.total_answered < result.total_items && (
                    <p className="mt-2 text-xs text-amber-300">
                      Bạn mới trả lời {result.total_answered}/{result.total_items} câu — kết quả có
                      thể chưa thật chính xác.
                    </p>
                  )}
                </CardContent>
              </Card>

              {TRAIT_META.map((t) => {
                const score = result.scores[t.key];
                const lv = level(score);
                return (
                  <Card key={t.key} className="border-border bg-card/50">
                    <CardContent className="p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <div>
                          <span className="font-heading text-base text-foreground">{t.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{t.en}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-heading text-lg font-semibold text-gold-700">{score}</span>
                          <span className="ml-1 text-xs text-muted-foreground">/100 · {lv}</span>
                        </div>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${score}%` }} />
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-foreground/80">
                        {lv === 'Thấp' ? t.low : t.high}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex flex-wrap gap-3 pt-1">
                <Button variant="outline" onClick={() => setResult(null)}>
                  Làm lại
                </Button>
                <Button asChild>
                  <a href="/onboarding">Luận giải sâu cùng AI Mentor →</a>
                </Button>
              </div>

              <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                Dựa trên thang IPIP-NEO (miền công cộng). Bản rút gọn 20 câu cho kết quả định
                hướng; bản đầy đủ chính xác hơn.
              </p>
            </div>
          )}
        </section>
      </ToolPageShell>
      <StickyMobileCta trackId="big-five" />
    </>
  );
}
