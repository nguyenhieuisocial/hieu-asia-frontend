'use client';

import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { drawCards, cardDetailSlug, type DrawnCard } from '@/lib/tools/tarot';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { getPersonalitySummary } from '@/lib/personality-store';
import { ReadingRitual } from '@/components/tools/ReadingRitual';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { TarotSpread } from '@/components/tools/TarotSpread';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { aiReadingToSections } from '@/lib/pdf/ai-reading-sections';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

type SpreadKey = 'today' | 'context' | 'love' | 'choice';

// Mỗi trải bài = nhãn + số lá (1|3, khớp backend) + vai trò từng vị trí.
// Các trải 3 lá chỉ khác nhãn vị trí — backend đọc vị trí một cách tổng quát.
const SPREADS: Record<SpreadKey, { label: string; count: 1 | 3; positions: string[] }> = {
  today: { label: 'Một lá · hôm nay', count: 1, positions: ['Hôm nay'] },
  context: { label: 'Ba lá · quyết định', count: 3, positions: ['Bối cảnh', 'Thử thách', 'Hướng đi'] },
  love: { label: 'Ba lá · tình cảm', count: 3, positions: ['Bạn', 'Người ấy', 'Giữa hai người'] },
  choice: { label: 'Ba lá · lựa chọn', count: 3, positions: ['Tình hình', 'Nếu chọn hướng này', 'Nếu giữ nguyên'] },
};
const SPREAD_KEYS: SpreadKey[] = ['today', 'context', 'love', 'choice'];
const MAX_SEED = 2_147_483_647;

interface FeatureLockedPayload {
  ok: false;
  error: 'feature_locked';
  slug: string;
  price: number;
  message?: string;
  checkout?: { tier: string; tool_slug: string };
}

export function TarotTool() {
  const [question, setQuestion] = React.useState('');
  const [spreadKey, setSpreadKey] = React.useState<SpreadKey>('context');
  const [drawn, setDrawn] = React.useState<DrawnCard[] | null>(null);
  const [seed, setSeed] = React.useState<number | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [readingLoading, setReadingLoading] = React.useState(false);
  const [paywall, setPaywall] = React.useState<FeatureLockedPayload | null>(null);
  const [hasPersona, setHasPersona] = React.useState(false);

  const positions = SPREADS[spreadKey].positions;

  const clearReading = () => {
    setReading(null);
    setPaywall(null);
    setReadingLoading(false);
  };

  // Mở link chia sẻ "/tarot?k=<spread>&s=<seed>&q=<câu hỏi>" → dựng lại đúng quẻ đã rút
  // (cùng seed + cùng số lá ⇒ Fisher-Yates + chiều y hệt). Đọc localStorage tính cách.
  React.useEffect(() => {
    setHasPersona(!!getPersonalitySummary());
    const sp = new URLSearchParams(window.location.search);
    const k = sp.get('k');
    const s = sp.get('s');
    const q = sp.get('q');
    if (k && k in SPREADS && s) {
      const sd = parseInt(s, 10);
      if (Number.isFinite(sd)) {
        const key = k as SpreadKey;
        setSpreadKey(key);
        if (q) setQuestion(q.slice(0, 280));
        setSeed(sd);
        setDrawn(drawCards(SPREADS[key].count, sd));
      }
    }
  }, []);

  const selectSpread = (k: SpreadKey) => {
    setSpreadKey(k);
    // Đổi kiểu trải → bỏ quẻ cũ để không lệch nhãn vị trí.
    setDrawn(null);
    setSeed(null);
    clearReading();
  };

  const onDraw = React.useCallback(() => {
    const newSeed = Math.floor(Math.random() * MAX_SEED);
    setSeed(newSeed);
    setDrawn(drawCards(SPREADS[spreadKey].count, newSeed));
    clearReading();
    track('tool_used', { tool: 'tarot', result: 'ok' });
  }, [spreadKey]);

  // Bản đọc sâu cá nhân hoá (backend /tools/tarot-read). Opt-in: chỉ gọi khi
  // người dùng bấm — không tự chạy mỗi lần rút. Gửi kèm chân dung tính cách đã
  // lưu (nếu có) để cá nhân hoá. Fallback an toàn: lỗi/endpoint chưa có → ẩn mục
  // đọc, lá + nghĩa tĩnh vẫn còn.
  const onDeepRead = React.useCallback(async () => {
    if (!drawn) return;
    setReading(null);
    setPaywall(null);
    setReadingLoading(true);
    const pos = SPREADS[spreadKey].positions;
    const cards = drawn.map((d, i) => ({
      name_vi: d.card.name_vi,
      arcana: d.card.arcana,
      suit: d.card.suit,
      orientation: d.orientation,
      position: pos[i] ?? `Lá ${i + 1}`,
      meaning: d.orientation === 'upright' ? d.card.up : d.card.rev,
    }));
    try {
      const sb = getSupabaseAuth();
      let token: string | undefined;
      if (sb) {
        const { data } = await sb.auth.getSession();
        token = data.session?.access_token;
      }
      const personalitySummary = getPersonalitySummary() || undefined;
      const res = await fetch(`${API_BASE}/tools/tarot-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: question.trim(), spread: SPREADS[spreadKey].count, cards, personalitySummary }),
      });

      if (res.status === 402) {
        const locked = await safeJson<FeatureLockedPayload>(res);
        if (locked.ok && locked.data.error === 'feature_locked') {
          setPaywall(locked.data);
          return;
        }
      }

      const parsed = await safeJson<{ ok: true; reading: string } | { ok: false; error: string }>(res);
      if (!parsed.ok) throw new Error(`HTTP ${parsed.status}`);
      const json = parsed.data as { ok: true; reading: string } | { ok: false; error: string };
      if (!json.ok || !json.reading) throw new Error('empty reading');
      setReading(json.reading);
      track('tool_used', { tool: 'tarot_read', result: 'ok' });
    } catch {
      setReading(null);
      track('tool_used', { tool: 'tarot_read', result: 'error' });
    } finally {
      setReadingLoading(false);
    }
  }, [drawn, spreadKey, question]);

  const shareQuery =
    seed !== null
      ? `/tarot?k=${spreadKey}&s=${seed}${question.trim() ? `&q=${encodeURIComponent(question.trim().slice(0, 280))}` : ''}`
      : '/tarot';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-gold/20 bg-background/60 p-6">
        <label htmlFor="tarot-q" className="block text-sm text-muted-foreground">
          Câu hỏi / điều bạn đang phân vân (không bắt buộc)
        </label>
        <input
          id="tarot-q"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="vd: Mình có nên nhận lời mời công việc này không?"
          className="mt-2 w-full rounded-md border border-gold/25 bg-background px-4 py-3 text-foreground outline-none focus:border-gold"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {SPREAD_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => selectSpread(k)}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                spreadKey === k ? 'border-gold bg-gold/10 text-gold' : 'border-foreground/15 text-muted-foreground hover:border-gold/40'
              }`}
            >
              {SPREADS[k].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onDraw}
          className="mt-4 w-full rounded-md bg-gold px-6 py-3 font-medium text-background transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
        >
          {drawn ? '↻ Rút lại' : 'Rút bài →'}
        </button>
      </div>

      {drawn && (
        <div className="mt-8 space-y-4">
          {question.trim() && <p className="text-sm italic text-muted-foreground">“{question.trim()}”</p>}
          {/* Trải bài có hình — lật từng lá khi rút (key=seed để lật lại mỗi lần rút) */}
          <TarotSpread key={seed} drawn={drawn} positions={positions} />
          {drawn.map((d, i) => (
            <div key={i} className="rounded-xl border border-gold/15 bg-background/40 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">{positions[i] ?? ''}</p>
                <span className="font-mono text-xs capitalize text-muted-foreground">
                  {d.card.arcana === 'major' ? 'Ẩn chính' : d.card.suit}
                </span>
              </div>
              <h3 className="mt-1 font-heading text-xl font-bold text-foreground">
                {d.card.name_vi}{' '}
                <span className="text-sm font-normal text-muted-foreground">· {d.orientation === 'upright' ? 'xuôi' : 'ngược'}</span>
              </h3>
              <p className="mt-2 leading-relaxed text-foreground/85">
                {d.orientation === 'upright' ? d.card.up : d.card.rev}
              </p>
              <Link
                href={`/tarot/y-nghia/${cardDetailSlug(d.card)}`}
                className="mt-2.5 inline-block text-xs font-semibold text-gold-700 hover:text-gold"
              >
                Đọc sâu lá {d.card.name_vi} →
              </Link>
            </div>
          ))}

          {/* Lớp đọc sâu AI — phản tư gắn câu hỏi, không tiên đoán. */}
          {paywall ? (
            <FeaturePaywall
              slug={paywall.slug}
              price={paywall.price}
              label="Tarot"
              onUnlocked={() => {
                setPaywall(null);
                void onDeepRead();
              }}
            />
          ) : reading ? (
            <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Đọc sâu cùng AI
              </div>
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
            </div>
          ) : readingLoading ? (
            <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-5">
              <ReadingRitual
                messages={[
                  'Đang ngẫm về câu hỏi của bạn…',
                  'Đặt từng lá vào bối cảnh…',
                  'Nối các lá thành một góc nhìn…',
                  'Soạn vài gợi mở để bạn tự soi…',
                ]}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => void onDeepRead()}
                className="w-full rounded-md border border-gold/40 px-6 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/10 sm:w-auto sm:px-10"
              >
                ✨ Đọc sâu cùng AI →
              </button>
              {hasPersona && (
                <p className="text-xs text-muted-foreground">
                  Bản đọc sẽ tham chiếu kết quả trắc nghiệm tính cách của bạn để góc nhìn hợp hơn.
                </p>
              )}
            </div>
          )}

          <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Tarot ở đây là <b className="text-foreground/80">gợi ý để bạn tự suy ngẫm</b> về quyết định — không phải lời tiên đoán. Quyết định cuối cùng luôn là của bạn.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ShareResultButton
              path={shareQuery}
              title="Lá Tarot tôi vừa rút — hieu.asia"
              text="Mình vừa rút Tarot để soi lại điều đang phân vân. Bạn thử xem mình rút được gì?"
              trackId="tarot"
            />
            <DownloadToolPdfButton
              payload={() => {
                if (!drawn) return null;
                const pos = SPREADS[spreadKey].positions;
                return {
                  title: 'Lá Tarot tôi vừa rút — hieu.asia',
                  subtitle: question.trim()
                    ? `${SPREADS[spreadKey].label} · “${question.trim()}”`
                    : SPREADS[spreadKey].label,
                  sections: [
                    ...drawn.map((d, i) => ({
                      heading: `${pos[i] ?? `Lá ${i + 1}`} — ${d.card.name_vi} (${d.orientation === 'upright' ? 'xuôi' : 'ngược'})`,
                      rows: [
                        { label: 'Loại', value: d.card.arcana === 'major' ? 'Ẩn chính' : (d.card.suit ?? 'Ẩn phụ') },
                        { label: 'Ý nghĩa', value: d.orientation === 'upright' ? d.card.up : d.card.rev },
                      ],
                    })),
                    // Đọc sâu cùng AI (opt-in) — khi khách đã bấm "Đọc sâu", đưa vào
                    // PDF (dùng lại bản đã sinh, 0 phí AI thêm).
                    ...aiReadingToSections(reading, 'Đọc sâu cùng AI'),
                  ],
                  cta: {
                    text: 'Ghép lá Tarot với lá số Tử Vi + Bát Tự của bạn để hiểu sâu hơn',
                    url: 'hieu.asia',
                  },
                };
              }}
            />
            <a href="/onboarding" className="inline-block rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10">
              Ghép với Tử Vi + Bát Tự của tôi →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
