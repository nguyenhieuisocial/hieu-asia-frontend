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
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';
import { savePersonalityResult, buildDiscSummary } from '@/lib/personality-store';
import { EXTENDED_SURVEY_SCHEMA, type DiscDimension } from '@/lib/survey-schema-extended';
import { scoreDisc, type DiscScoreWithMeta } from '@/lib/scoring/disc';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

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

interface FeatureLockedPayload {
  ok: false;
  error: 'feature_locked';
  slug: string;
  price: number;
  message?: string;
  checkout?: { tier: string; tool_slug: string };
}

export default function DiscPage() {
  const [result, setResult] = React.useState<DiscScoreWithMeta | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [readingLoading, setReadingLoading] = React.useState(false);
  const [paywall, setPaywall] = React.useState<FeatureLockedPayload | null>(null);

  // Bản đọc sâu cá nhân hoá từ điểm DISC (backend /tools/disc-read). Fallback an
  // toàn: endpoint chưa có / lỗi → ẩn mục đọc, trang vẫn giữ thanh điểm + mô tả.
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

      const res = await fetch(`${API_BASE}/tools/disc-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ scores: result.scores }),
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
      setReading(null);
    } finally {
      setReadingLoading(false);
    }
  }, [result]);

  React.useEffect(() => {
    if (!result) return;
    void runReading();
  }, [result, runReading]);

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
    setPaywall(null);
    const scored = scoreDisc(answers);
    setResult(scored);
    savePersonalityResult('disc', buildDiscSummary(scored.primary_style, scored.secondary_style));
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
        relatedSlug="/disc"
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

              <Button asChild variant="outline" className="w-full">
                <Link href={`/learn/disc/${DIM_META[result.primary_style].letter.toLowerCase()}`}>
                  Tìm hiểu sâu về nhóm {DIM_META[result.primary_style].letter} —{' '}
                  {DIM_META[result.primary_style].label} →
                </Link>
              </Button>

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

              {paywall && (
                <FeaturePaywall
                  slug={paywall.slug}
                  price={paywall.price}
                  label="DISC"
                  onUnlocked={() => {
                    setPaywall(null);
                    void runReading();
                  }}
                />
              )}

              {!paywall && (readingLoading || reading) && (
                <Card className="relative overflow-hidden border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      Luận giải sâu
                    </div>
                    {readingLoading && !reading ? (
                      <ReadingRitual
                        messages={[
                          'Đang đọc 16 câu trả lời của bạn…',
                          'Phân tích 4 chiều hành vi D-i-S-C…',
                          'Tìm phong cách giao tiếp chủ đạo…',
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
                      Cơ sở: mô hình DISC (Marston, miền công cộng). Mô tả xu hướng hành vi, không phán định mệnh.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <ShareResultButton
                  path={`/disc?r=${result.scores.dominance}-${result.scores.influence}-${result.scores.steadiness}-${result.scores.compliance}`}
                  title="Kết quả DiSC của tôi — hieu.asia"
                  text={`Phong cách hành vi của tôi là ${styleCode} (DiSC). Bạn thử xem mình thế nào?`}
                  trackId="disc"
                />
                <DownloadToolPdfButton
                  payload={() => {
                    if (!result) return null;
                    const code = `${DIM_META[result.primary_style].letter}/${DIM_META[result.secondary_style].letter}`;
                    return {
                      title: 'Kết quả DiSC của tôi — hieu.asia',
                      subtitle: `Phong cách chính: ${code} · ${DIM_META[result.primary_style].label} · ${DIM_META[result.secondary_style].label}`,
                      hero: {
                        big: code,
                        small: `${DIM_META[result.primary_style].label} · ${DIM_META[result.secondary_style].label}`,
                      },
                      sections: [
                        {
                          heading: 'Điểm 4 phong cách hành vi',
                          rows: DIM_ORDER.map((dim) => ({
                            label: `${DIM_META[dim].letter} · ${DIM_META[dim].label}`,
                            value: `${result.scores[dim]}/100`,
                            bar: result.scores[dim],
                          })),
                        },
                        ...DIM_ORDER.map((dim) => ({
                          heading: `${DIM_META[dim].letter} · ${DIM_META[dim].label}`,
                          text: DIM_META[dim].desc,
                        })),
                        // Luận giải sâu (AI) đã sinh — đưa vào PDF (dùng lại, 0 phí AI).
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
