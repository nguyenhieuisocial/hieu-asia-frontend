'use client';

import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { ReadingRitual } from '@/components/tools/ReadingRitual';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { PersonalityQuiz } from '@/components/tools/PersonalityQuiz';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { aiReadingToSections } from '@/lib/pdf/ai-reading-sections';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';
import { savePersonalityResult, buildEnneagramSummary } from '@/lib/personality-store';
import { submitSelfIdentifiedPersonality } from '@/lib/scoring/submit-personality';
import {
  ENNEAGRAM_PAGES,
  ENNEAGRAM_TYPE_ORDER,
  TYPE_META,
  INTEGRATION,
  DISINTEGRATION,
  scoreEnneagram,
  scoreFromShare,
  type EnneagramScoreWithMeta,
} from '@/lib/scoring/enneagram';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

interface FeatureLockedPayload {
  ok: false;
  error: 'feature_locked';
  slug: string;
  price: number;
  message?: string;
  checkout?: { tier: string; tool_slug: string };
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Enneagram là gì?',
    a: 'Enneagram là hệ thống chia tính cách thành 9 nhóm, mỗi nhóm xoay quanh một động cơ cốt lõi và một nỗi sợ nền tảng. Khác với trắc nghiệm mô tả hành vi bên ngoài, Enneagram đào vào "vì sao bạn làm vậy" — nên thường được dùng để hiểu động lực và điểm mù của chính mình.',
  },
  {
    q: 'Enneagram có nguồn gốc từ đâu?',
    a: 'Biểu tượng 9 đỉnh có lịch sử lâu đời, nhưng hệ thống 9 nhóm tính cách như ngày nay là sản phẩm thế kỷ 20 — khởi từ Oscar Ichazo và được bác sĩ tâm thần Claudio Naranjo phát triển vào thập niên 1970, sau đó phổ biến rộng trong giới phát triển bản thân và coaching.',
  },
  {
    q: 'Cánh (wing) là gì?',
    a: 'Cánh là một trong hai nhóm nằm kề nhóm chủ đạo của bạn trên vòng tròn 9 đỉnh. Nó "pha thêm màu" cho tính cách — ví dụ Type 9 cánh 1 sẽ khác Type 9 cánh 8 ở cách thể hiện. Bài test của hieu.asia tính cả cánh từ điểm số của bạn.',
  },
  {
    q: 'Ba trung tâm (centers) nghĩa là gì?',
    a: 'Chín nhóm được xếp vào ba trung tâm theo cách phản ứng chủ đạo: trung tâm Bản năng/Bụng (8, 9, 1) thiên về hành động và ranh giới; trung tâm Cảm xúc/Tim (2, 3, 4) thiên về hình ảnh bản thân và kết nối; trung tâm Lý trí/Đầu (5, 6, 7) thiên về tư duy và an toàn.',
  },
  {
    q: 'Enneagram có phải công cụ khoa học không?',
    a: 'Nói thẳng: Enneagram phổ biến trong phát triển bản thân và coaching, nhưng nền nghiên cứu thực nghiệm của nó hạn chế hơn các mô hình như Big Five. Hãy dùng nó như một khung chiêm nghiệm về động lực — nếu bạn cần mô hình có bằng chứng nghiên cứu vững nhất, hãy làm thêm Big Five trên hieu.asia rồi đối chiếu.',
  },
  {
    q: 'Enneagram khác gì MBTI?',
    a: 'MBTI phân loại theo 4 cặp xu hướng nhận thức (hướng nội/ngoại, trực giác/giác quan…), còn Enneagram xoay quanh động cơ cốt lõi và nỗi sợ nền tảng. MBTI trả lời "bạn vận hành thế nào", Enneagram trả lời "điều gì thúc đẩy bạn" — làm cả hai rồi đối chiếu thường cho bức tranh đầy đủ hơn.',
  },
];

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function EnneagramPage() {
  const [result, setResult] = React.useState<EnneagramScoreWithMeta | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [readingLoading, setReadingLoading] = React.useState(false);
  const [paywall, setPaywall] = React.useState<FeatureLockedPayload | null>(null);

  // Bản đọc sâu cá nhân hoá từ nhóm Enneagram (backend /tools/enneagram-read).
  // Fallback an toàn: endpoint chưa có / lỗi → ẩn mục đọc, trang vẫn giữ chân
  // dung tĩnh + thanh điểm 9 nhóm.
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

      const res = await fetch(`${API_BASE}/tools/enneagram-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: result.type, wing: result.wing, label: result.label }),
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

  // Mở link chia sẻ "/enneagram?r=s1-s2-…-s9" → dựng lại kết quả để hiển thị ngay.
  React.useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('r');
    if (!r) return;
    const vals = r.split('-').map((x) => parseInt(x, 10));
    const scored = scoreFromShare(vals);
    if (scored) setResult(scored);
  }, []);

  const onComplete = (answers: Record<string, number>) => {
    setPaywall(null);
    const scored = scoreEnneagram(answers);
    setResult(scored);
    savePersonalityResult('enneagram', buildEnneagramSummary(scored.label, TYPE_META[scored.type].name));
    // Persist to the server (signed-in users) so Cẩm Nang can use it even without
    // the Big Five/DiSC quizzes. Fire-and-forget; no-ops when anonymous.
    submitSelfIdentifiedPersonality();
    track('tool_used', { tool: 'enneagram', result: 'ok' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const meta = result ? TYPE_META[result.type] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <ToolPageShell
        eyebrow="Trắc nghiệm tính cách · Enneagram"
        relatedSlug="/enneagram"
        icon={<span aria-hidden="true">🌀</span>}
        title={
          <>
            Trắc nghiệm <GoldAccent>Enneagram</GoldAccent>
          </>
        }
        description="Enneagram chia tính cách thành 9 nhóm, mỗi nhóm có một động cơ cốt lõi và nỗi sợ nền tảng riêng. Bài test giúp bạn nhận ra nhóm chủ đạo cùng cánh (wing) của mình. 36 câu, khoảng 5 phút."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Trắc nghiệm Enneagram' },
        ]}
      >
        <section className="mt-6">
          {!result && (
            <div className="mx-auto max-w-2xl">
              <PersonalityQuiz pages={ENNEAGRAM_PAGES} onComplete={onComplete} ctaLabel="Xem kết quả Enneagram →" />
            </div>
          )}

          {result && meta && (
            <div className="mx-auto max-w-2xl space-y-4">
              <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
                <CardContent className="p-6 text-center sm:p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Nhóm tính cách của bạn
                  </div>
                  <div className="my-2 bg-gold-gradient bg-clip-text font-heading text-5xl font-bold text-transparent">
                    Type {result.type}
                  </div>
                  <p className="font-heading text-lg text-foreground">{meta.name}</p>
                  <p className="mt-1 text-sm text-foreground/85">
                    Cánh {result.label} · Trung tâm {meta.center}
                  </p>
                  <p className="mt-2 text-sm italic text-muted-foreground">{meta.tagline}</p>
                  {result.total_answered < result.total_items && (
                    <p className="mt-2 text-xs text-amber-300">
                      Mới trả lời {result.total_answered}/{result.total_items} câu — kết quả có thể
                      chưa chính xác.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Button asChild variant="outline" className="w-full">
                <Link href={`/learn/enneagram/${result.type}`}>
                  Tìm hiểu sâu về Nhóm {result.type} — {meta.name} →
                </Link>
              </Button>

              <Card className="border-gold/20 bg-card/50">
                <CardContent className="space-y-4 p-6">
                  {[
                    { label: 'Mong muốn cốt lõi', text: meta.desire },
                    { label: 'Nỗi sợ nền tảng', text: meta.fear },
                    { label: 'Điểm mạnh', text: meta.strengths },
                    { label: 'Khi cân bằng', text: meta.atBest },
                    { label: 'Khi căng thẳng', text: meta.underStress },
                    { label: 'Hướng phát triển', text: meta.growth },
                  ].map((row) => (
                    <div key={row.label} className="border-t border-border/60 pt-3 first:border-0 first:pt-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700">
                        {row.label}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">{row.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gold/20 bg-card/50">
                <CardContent className="p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Đường phát triển &amp; áp lực
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        Khi phát triển →
                      </div>
                      <p className="mt-1 text-sm text-foreground/90">
                        Nghiêng về{' '}
                        <span className="font-semibold text-foreground">
                          Type {INTEGRATION[result.type]} — {TYPE_META[INTEGRATION[result.type]].name}
                        </span>
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {TYPE_META[INTEGRATION[result.type]].atBest}
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
                        Khi áp lực →
                      </div>
                      <p className="mt-1 text-sm text-foreground/90">
                        Nghiêng về{' '}
                        <span className="font-semibold text-foreground">
                          Type {DISINTEGRATION[result.type]} — {TYPE_META[DISINTEGRATION[result.type]].name}
                        </span>
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {TYPE_META[DISINTEGRATION[result.type]].underStress}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    Theo mô hình Riso-Hudson: khi lành mạnh bạn hấp thụ điểm mạnh của nhóm phát triển;
                    khi căng thẳng dễ rơi vào điểm yếu của nhóm áp lực.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50">
                <CardContent className="space-y-3 p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Điểm 9 nhóm
                  </div>
                  {ENNEAGRAM_TYPE_ORDER.map((t) => {
                    const score = result.scores[t];
                    const isPrimary = t === result.type;
                    const isWing = t === result.wing;
                    return (
                      <div key={t}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-sm text-foreground/90">
                            <span className="font-heading text-foreground">Type {t}</span> · {TYPE_META[t].name}
                            {isPrimary && <span className="ml-2 text-xs text-gold-700">Chính</span>}
                            {isWing && <span className="ml-2 text-xs text-muted-foreground">Cánh</span>}
                          </span>
                          <span className="font-heading text-sm font-semibold text-gold-700">{score}</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
                          <div
                            className={`h-full rounded-full ${isPrimary ? 'bg-gold-gradient' : 'bg-gold/40'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {paywall && (
                <FeaturePaywall
                  slug={paywall.slug}
                  price={paywall.price}
                  label="Enneagram"
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
                          'Đang đọc 36 câu trả lời của bạn…',
                          'Định vị nhóm tính cách chủ đạo…',
                          'Xác định cánh và trung tâm…',
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
                      Cơ sở: hệ thống Enneagram chín nhóm tính cách (mô hình phát triển bản thân, miền
                      công cộng). Mô tả xu hướng tâm lý, không phán định số mệnh.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <ShareResultButton
                  path={`/enneagram?r=${ENNEAGRAM_TYPE_ORDER.map((t) => result.scores[t]).join('-')}`}
                  title="Kết quả Enneagram của tôi — hieu.asia"
                  text={`Nhóm tính cách của tôi là Type ${result.type} — ${meta.name} (${result.label}). Bạn thử xem mình thuộc nhóm nào?`}
                  trackId="enneagram"
                />
                <DownloadToolPdfButton
                  payload={() => {
                    if (!result) return null;
                    const m = TYPE_META[result.type];
                    return {
                      title: 'Kết quả Enneagram của tôi — hieu.asia',
                      subtitle: `Type ${result.type} — ${m.name} · Cánh ${result.label} · Trung tâm ${m.center}`,
                      hero: { big: `Type ${result.type} — ${m.name}`, small: `Cánh ${result.label} · Trung tâm ${m.center}` },
                      sections: [
                        {
                          heading: 'Nhóm tính cách của bạn',
                          rows: [
                            { label: 'Nhóm chủ đạo', value: `Type ${result.type} — ${m.name}` },
                            { label: 'Cánh (wing)', value: result.label },
                            { label: 'Trung tâm', value: m.center },
                            { label: 'Đặc trưng', value: m.tagline },
                          ],
                        },
                        {
                          heading: 'Chân dung nhóm',
                          rows: [
                            { label: 'Mong muốn cốt lõi', value: m.desire },
                            { label: 'Nỗi sợ nền tảng', value: m.fear },
                            { label: 'Điểm mạnh', value: m.strengths },
                            { label: 'Khi cân bằng', value: m.atBest },
                            { label: 'Khi căng thẳng', value: m.underStress },
                            { label: 'Hướng phát triển', value: m.growth },
                          ],
                        },
                        {
                          heading: 'Đường phát triển & áp lực',
                          rows: [
                            {
                              label: 'Khi phát triển →',
                              value: `Type ${INTEGRATION[result.type]} — ${TYPE_META[INTEGRATION[result.type]].name}`,
                            },
                            {
                              label: 'Khi áp lực →',
                              value: `Type ${DISINTEGRATION[result.type]} — ${TYPE_META[DISINTEGRATION[result.type]].name}`,
                            },
                          ],
                        },
                        {
                          heading: 'Điểm 9 nhóm',
                          rows: ENNEAGRAM_TYPE_ORDER.map((t) => ({
                            label: `Type ${t} — ${TYPE_META[t].name}`,
                            value: String(result.scores[t]),
                            bar: result.scores[t],
                          })),
                        },
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
                Bản Enneagram rút gọn mang tính định hướng để hiểu động lực bên trong của bạn — không
                phải nhãn cố định và không thay thế tư vấn chuyên môn.
              </p>
            </div>
          )}
        </section>

        <section
          aria-labelledby="enn-about-heading"
          className="mt-12 border-t border-border pt-10"
        >
          <h2
            id="enn-about-heading"
            className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
          >
            Enneagram hoạt động thế nào?
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/80">
            <p>
              Bài test gồm 36 câu, chấm điểm song song cho cả{' '}
              <strong className="text-foreground">9 nhóm</strong>; nhóm điểm cao
              nhất là nhóm chủ đạo của bạn, nhóm kề bên điểm cao hơn trở thành{' '}
              <strong className="text-foreground">cánh (wing)</strong>. Chín nhóm
              xếp vào <strong className="text-foreground">ba trung tâm</strong> —
              Bản năng (8, 9, 1), Cảm xúc (2, 3, 4) và Lý trí (5, 6, 7) — mỗi
              trung tâm là một kiểu phản ứng chủ đạo trước cuộc sống. Khác các
              trắc nghiệm mô tả hành vi, Enneagram tập trung vào{' '}
              <strong className="text-foreground">động cơ cốt lõi và nỗi sợ nền
              tảng</strong> đứng sau hành vi.
            </p>
            <p>
              Về nguồn gốc: hệ thống 9 nhóm tính cách hiện đại được Oscar Ichazo
              khởi xướng và Claudio Naranjo phát triển trong thế kỷ 20. Minh bạch
              để bạn rõ: nền nghiên cứu thực nghiệm của Enneagram{' '}
              <strong className="text-foreground">hạn chế hơn Big Five</strong> —
              hãy đọc kết quả như một khung chiêm nghiệm về động lực của mình,
              đối chiếu với trải nghiệm thật, thay vì xem là nhãn cố định. Đúng
              tinh thần &ldquo;không bói mù&rdquo; của hieu.asia.
            </p>
          </div>
        </section>

        <section aria-labelledby="enn-faq-heading" className="mt-10">
          <h2
            id="enn-faq-heading"
            className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
          >
            Câu hỏi thường gặp
          </h2>
          <dl className="mt-4 space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border border-border bg-card/40 px-4 py-3"
              >
                <summary className="cursor-pointer list-none font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </dl>
        </section>
      </ToolPageShell>
      <StickyMobileCta trackId="enneagram" />
    </>
  );
}
