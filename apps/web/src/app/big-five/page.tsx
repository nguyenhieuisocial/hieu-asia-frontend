'use client';

import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { ReadingRitual } from '@/components/tools/ReadingRitual';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { PersonalityQuiz, type QuizPage } from '@/components/tools/PersonalityQuiz';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { aiReadingToSections } from '@/lib/pdf/ai-reading-sections';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { savePersonalityResult, buildBigFiveSummary } from '@/lib/personality-store';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';
import { EXTENDED_SURVEY_SCHEMA, type BigFiveTrait } from '@/lib/survey-schema-extended';
import { scoreBigFive, type BigFiveScoreWithMeta } from '@/lib/scoring/big-five';
import { submitBigFive } from '@/lib/scoring/submit-personality';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

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

interface FeatureLockedPayload {
  ok: false;
  error: 'feature_locked';
  slug: string;
  price: number;
  message?: string;
  checkout?: { tier: string; tool_slug: string };
}

export default function BigFivePage() {
  const [result, setResult] = React.useState<BigFiveScoreWithMeta | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [readingLoading, setReadingLoading] = React.useState(false);
  const [paywall, setPaywall] = React.useState<FeatureLockedPayload | null>(null);

  // Part 3 — bản đọc sâu cá nhân hoá từ điểm số (backend `/tools/bigfive-read`,
  // contract ở corpus/big-five/README.md). Fallback an toàn: endpoint chưa có /
  // lỗi → ẩn mục đọc, trang vẫn giữ nguyên thanh điểm + mô tả như cũ.
  const runReading = React.useCallback(async () => {
    if (!result) return;
    setReading(null);
    setPaywall(null);
    setReadingLoading(true);
    try {
      const sb = getSupabaseAuth();
      let token: string | undefined;
      if (sb) {
        const { data } = await sb.auth.getSession();
        token = data.session?.access_token;
      }

      const res = await fetch(`${API_BASE}/tools/bigfive-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          scores: result.scores,
          confidence: result.total_answered / result.total_items,
        }),
      });

      if (res.status === 402) {
        const parsed = await safeJson<FeatureLockedPayload>(res);
        if (parsed.ok && parsed.data.error === 'feature_locked') {
          setPaywall(parsed.data);
          return;
        }
      }

      const parsed = await safeJson<{ ok: true; reading: string } | { ok: false; error: string }>(res);
      if (!parsed.ok) throw new Error(`HTTP ${parsed.status}`);
      const json = parsed.data as { ok: true; reading: string } | { ok: false; error: string };
      if (!json.ok || !json.reading) throw new Error('empty reading');
      setReading(json.reading);
    } catch {
      // Silent fallback — thanh điểm + mô tả vẫn là trải nghiệm cho tới khi endpoint sống.
      setReading(null);
    } finally {
      setReadingLoading(false);
    }
  }, [result]);

  React.useEffect(() => {
    if (!result) return;
    void runReading();
  }, [result, runReading]);

  // Mở link chia sẻ "/big-five?r=o-c-e-a-n" → dựng lại kết quả để hiển thị ngay.
  React.useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('r');
    if (!r) return;
    const p = r.split('-').map((x) => parseInt(x, 10));
    if (p.length !== 5 || p.some((n) => !Number.isFinite(n) || n < 0 || n > 100)) return;
    const [o, c, e, a, n] = p;
    setResult({
      scores: { openness: o ?? 0, conscientiousness: c ?? 0, extraversion: e ?? 0, agreeableness: a ?? 0, neuroticism: n ?? 0 },
      items_per_trait: { openness: 4, conscientiousness: 4, extraversion: 4, agreeableness: 4, neuroticism: 4 },
      total_items: 20,
      total_answered: 20,
    });
  }, []);

  const onComplete = (answers: Record<string, number>) => {
    setPaywall(null);
    const scored = scoreBigFive(answers);
    setResult(scored);
    savePersonalityResult('big-five', buildBigFiveSummary(scored.scores));
    // Persist to the server (personality_scores) for the Cẩm Nang report. Only
    // fires the full submit once the DiSC half is also present + user signed in;
    // otherwise caches this half in localStorage. Fire-and-forget.
    submitBigFive(scored, answers);
    track('tool_used', { tool: 'big-five', result: 'ok' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ToolPageShell
        eyebrow="Trắc nghiệm tính cách · IPIP-NEO"
        relatedSlug="/big-five"
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
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
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
                      <Link
                        href={`/learn/big-five/${t.key}`}
                        className="mt-2.5 inline-block text-xs font-semibold text-gold-700 hover:text-gold"
                      >
                        Tìm hiểu sâu chiều {t.label} →
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}

              {paywall && (
                <FeaturePaywall
                  slug={paywall.slug}
                  price={paywall.price}
                  label="Big Five"
                  onUnlocked={() => {
                    setPaywall(null);
                    void runReading();
                  }}
                />
              )}

              {!paywall && (readingLoading || reading) && (
                <Card className="relative overflow-hidden border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Luận giải sâu
                    </div>
                    {readingLoading && !reading ? (
                      <ReadingRitual
                        messages={[
                          'Đang đọc 20 câu trả lời của bạn…',
                          'Đo 5 chiều tính cách OCEAN…',
                          'Tìm điểm mạnh và điểm mù của bạn…',
                          'Soạn bản đọc cá nhân hoá cho bạn…',
                        ]}
                      />
                    ) : reading ? (
                      <article className="markdown-report mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">
                        <ReactMarkdown
                          components={{
                            h1: ({ ...props }) => <h2 className="mt-4 font-heading text-xl text-gold" {...props} />,
                            h2: ({ ...props }) => <h3 className="mt-3 font-heading text-lg text-foreground" {...props} />,
                            h3: ({ ...props }) => <h4 className="mt-3 font-heading text-base text-foreground" {...props} />,
                            p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
                            ul: ({ ...props }) => <ul className="ml-5 list-disc space-y-1" {...props} />,
                            ol: ({ ...props }) => <ol className="ml-5 list-decimal space-y-1" {...props} />,
                            strong: ({ ...props }) => <strong className="text-gold" {...props} />,
                          }}
                        >
                          {reading}
                        </ReactMarkdown>
                      </article>
                    ) : null}
                    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                      Cơ sở: mô hình Big Five (IPIP, miền công cộng). Mô tả xu hướng, không phán định mệnh.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <ShareResultButton
                  path={`/big-five?r=${result.scores.openness}-${result.scores.conscientiousness}-${result.scores.extraversion}-${result.scores.agreeableness}-${result.scores.neuroticism}`}
                  title="Kết quả Big Five của tôi — hieu.asia"
                  text="Tôi vừa làm trắc nghiệm tính cách Big Five (OCEAN). Bạn thử xem mình thế nào?"
                  trackId="big-five"
                />
                <DownloadToolPdfButton
                  payload={() => {
                    if (!result) return null;
                    return {
                      title: 'Kết quả Big Five (OCEAN) của tôi — hieu.asia',
                      subtitle: `Đã trả lời ${result.total_answered}/${result.total_items} câu · thang IPIP-NEO`,
                      sections: [
                        ...TRAIT_META.map((t) => {
                          const score = result.scores[t.key];
                          const lv = level(score);
                          return {
                            heading: `${t.label} (${t.en})`,
                            rows: [
                              { label: 'Điểm', value: `${score}/100`, bar: score },
                              { label: 'Mức', value: lv },
                              { label: 'Mô tả', value: lv === 'Thấp' ? t.low : t.high },
                            ],
                          };
                        }),
                        // Luận giải sâu (AI) — đã sinh khi khách dùng công cụ; đưa vào
                        // PDF (dùng lại, không gọi AI thêm) thay vì bỏ rơi.
                        ...aiReadingToSections(reading),
                      ],
                    };
                  }}
                />
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
