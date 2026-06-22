'use client';

import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { PersonalityQuiz } from '@/components/tools/PersonalityQuiz';
import { ReadingRitual } from '@/components/tools/ReadingRitual';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { track } from '@/lib/analytics';
import { savePersonalityResult, buildMbtiSummary } from '@/lib/personality-store';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';
import {
  MBTI_PAGES,
  scoreMbti,
  scoreFromShare,
  type MbtiAxis,
  type MbtiScoreWithMeta,
} from '@/lib/scoring/mbti';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

const AXIS_META: { axis: MbtiAxis; label: string; pos: string; neg: string }[] = [
  { axis: 'EI', label: 'Năng lượng', pos: 'Hướng ngoại', neg: 'Hướng nội' },
  { axis: 'SN', label: 'Nhận thông tin', pos: 'Giác quan', neg: 'Trực giác' },
  { axis: 'TF', label: 'Ra quyết định', pos: 'Lý trí', neg: 'Cảm xúc' },
  { axis: 'JP', label: 'Tổ chức đời sống', pos: 'Nguyên tắc', neg: 'Linh hoạt' },
];

interface FeatureLockedPayload {
  ok: false;
  error: 'feature_locked';
  slug: string;
  price: number;
  message?: string;
  checkout?: { tier: string; tool_slug: string };
}

/** Standalone MBTI tool: 16-question quiz → 4-letter type → deep reading. */
export function MbtiTool() {
  const [result, setResult] = React.useState<MbtiScoreWithMeta | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [readingLoading, setReadingLoading] = React.useState(false);
  const [paywall, setPaywall] = React.useState<FeatureLockedPayload | null>(null);

  // Deep, personalised reading from the type (backend `/tools/mbti-read`,
  // contract in corpus/mbti/README.md). Silent fallback: endpoint missing / error
  // → hide the reading card, the type + axis breakdown stay as the experience.
  React.useEffect(() => {
    if (!result) return;
    let cancelled = false;
    setReading(null);
    setPaywall(null);
    setReadingLoading(true);
    void (async () => {
      try {
        const sb = getSupabaseAuth();
        let token: string | undefined;
        if (sb) {
          const { data } = await sb.auth.getSession();
          token = data.session?.access_token;
        }

        const res = await fetch(`${API_BASE}/tools/mbti-read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ type: result.type }),
        });

        if (res.status === 402) {
          const parsed = await safeJson<FeatureLockedPayload>(res);
          if (parsed.ok && parsed.data.error === 'feature_locked') {
            if (!cancelled) setPaywall(parsed.data);
            return;
          }
        }

        const parsed = await safeJson<{ ok: true; reading: string } | { ok: false; error: string }>(res);
        if (!parsed.ok) throw new Error(`HTTP ${parsed.status}`);
        const json = parsed.data as { ok: true; reading: string } | { ok: false; error: string };
        if (!json.ok || !json.reading) throw new Error('empty reading');
        if (!cancelled) setReading(json.reading);
      } catch {
        if (!cancelled) setReading(null);
      } finally {
        if (!cancelled) setReadingLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result]);

  // Open a shared link "/mbti?r=ei-sn-tf-jp" → rebuild the result to show at once.
  React.useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('r');
    if (!r) return;
    const parts = r.split('-').map((x) => parseInt(x, 10));
    const rebuilt = scoreFromShare(parts);
    if (rebuilt) setResult(rebuilt);
  }, []);

  const onComplete = (answers: Record<string, number>) => {
    setPaywall(null);
    const scored = scoreMbti(answers);
    setResult(scored);
    savePersonalityResult('mbti', buildMbtiSummary(scored.type));
    track('tool_used', { tool: 'mbti', result: 'ok' });
    if (typeof window !== 'undefined') {
      document.getElementById('mbti-test')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {!result && (
        <PersonalityQuiz pages={MBTI_PAGES} onComplete={onComplete} ctaLabel="Xem kết quả MBTI →" />
      )}

      {result && (
        <div className="space-y-4">
          <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
            <CardContent className="p-6 text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Kiểu của bạn
              </div>
              <div className="mt-2 font-heading text-5xl font-bold tracking-[0.15em] text-gold-700">
                {result.type}
              </div>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground/80">
                Bốn chữ là các <strong className="text-gold">xu hướng</strong> trên một dải — không phải
                nhãn cố định. Kiểu có thể đổi theo giai đoạn đời; đây là điểm khởi đầu để tự phản tư.
              </p>
              {result.total_answered < result.total_items && (
                <p className="mt-2 text-xs text-amber-300">
                  Bạn mới trả lời {result.total_answered}/{result.total_items} câu — kết quả có thể chưa
                  thật chính xác.
                </p>
              )}
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href={`/learn/mbti/${result.type.toLowerCase()}`}>
              Tìm hiểu sâu về {result.type} →
            </Link>
          </Button>

          {AXIS_META.map((m) => {
            const ax = result.axes[m.axis];
            const positiveChosen = ax.letter === ax.positive;
            const strength = Math.round(Math.abs(ax.score - 50) * 2); // 0–100 lean toward chosen pole
            const half = strength / 2; // width of the diverging fill (0–50% of track)
            return (
              <Card key={m.axis} className="border-border bg-card/50">
                <CardContent className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {m.label}
                    </span>
                    <span className="font-heading text-sm text-gold-700">
                      {ax.letter} · {positiveChosen ? m.pos : m.neg}{' '}
                      <span className="text-xs text-muted-foreground">· nghiêng {strength}%</span>
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className={positiveChosen ? 'font-medium text-foreground' : ''}>{m.pos} ({ax.positive})</span>
                    <span className={!positiveChosen ? 'font-medium text-foreground' : ''}>{m.neg} ({ax.negative})</span>
                  </div>
                  {/* Diverging bipolar bar: fill grows from centre toward the chosen pole. */}
                  <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-border">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-muted-foreground/40" />
                    <div
                      className="absolute top-0 h-full rounded-full bg-gold-gradient"
                      style={
                        positiveChosen
                          ? { right: '50%', width: `${half}%` }
                          : { left: '50%', width: `${half}%` }
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {paywall && (
            <FeaturePaywall
              slug={paywall.slug}
              price={paywall.price}
              label="MBTI"
              onUnlocked={() => setPaywall(null)}
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
                      'Đang đọc 24 câu trả lời của bạn…',
                      'Đối chiếu với 16 kiểu tính cách…',
                      'Tìm điểm mạnh và điểm mù riêng…',
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
                  Cơ sở: khung loại hình tâm lý (kiểu Jung). Mô tả xu hướng, không phán định mệnh.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <ShareResultButton
              path={`/mbti?r=${result.axes.EI.score}-${result.axes.SN.score}-${result.axes.TF.score}-${result.axes.JP.score}`}
              title={`Kiểu MBTI của tôi là ${result.type} — hieu.asia`}
              text="Tôi vừa làm trắc nghiệm MBTI ở hieu.asia. Bạn thử xem mình kiểu gì?"
              trackId="mbti"
            />
            <DownloadToolPdfButton
              payload={() => {
                if (!result) return null;
                return {
                  title: `Kết quả MBTI của tôi: ${result.type} — hieu.asia`,
                  subtitle: `Đã trả lời ${result.total_answered}/${result.total_items} câu`,
                  sections: [
                    {
                      heading: 'Kiểu tính cách',
                      rows: [{ label: 'Bốn chữ', value: result.type }],
                    },
                    {
                      heading: 'Bốn trục xu hướng',
                      rows: AXIS_META.map((m) => {
                        const ax = result.axes[m.axis];
                        const positiveChosen = ax.letter === ax.positive;
                        const strength = Math.round(Math.abs(ax.score - 50) * 2);
                        return {
                          label: m.label,
                          value: `${ax.letter} · ${positiveChosen ? m.pos : m.neg} · nghiêng ${strength}%`,
                        };
                      }),
                    },
                    {
                      heading: 'Lưu ý',
                      text: 'Bốn chữ là các xu hướng trên một dải — không phải nhãn cố định. Kiểu có thể đổi theo giai đoạn đời; đây là điểm khởi đầu để tự phản tư.',
                    },
                  ],
                };
              }}
            />
            <Button variant="outline" onClick={() => setResult(null)}>
              Làm lại
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
