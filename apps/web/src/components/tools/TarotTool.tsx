'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { drawCards, type DrawnCard } from '@/lib/tools/tarot';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { ReadingRitual } from '@/components/tools/ReadingRitual';
import { FeaturePaywall } from '@/components/payment/FeaturePaywall';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

const SPREADS = {
  1: { label: 'Một lá · soi hôm nay', positions: ['Hôm nay'] },
  3: { label: 'Ba lá · bối cảnh', positions: ['Bối cảnh', 'Thử thách', 'Hướng đi'] },
} as const;

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
  const [spread, setSpread] = React.useState<1 | 3>(3);
  const [drawn, setDrawn] = React.useState<DrawnCard[] | null>(null);
  const [reading, setReading] = React.useState<string | null>(null);
  const [readingLoading, setReadingLoading] = React.useState(false);
  const [paywall, setPaywall] = React.useState<FeatureLockedPayload | null>(null);

  const positions = SPREADS[spread].positions;

  const onDraw = React.useCallback(() => {
    setDrawn(drawCards(spread));
    // Lá mới → bỏ bản đọc cũ.
    setReading(null);
    setPaywall(null);
    setReadingLoading(false);
    track('tool_used', { tool: 'tarot', result: 'ok' });
  }, [spread]);

  // Bản đọc sâu cá nhân hoá (backend /tools/tarot-read). Opt-in: chỉ gọi khi
  // người dùng bấm — không tự chạy mỗi lần rút. Fallback an toàn: lỗi/endpoint
  // chưa có → ẩn mục đọc, lá + nghĩa tĩnh vẫn còn.
  const onDeepRead = React.useCallback(async () => {
    if (!drawn) return;
    setReading(null);
    setPaywall(null);
    setReadingLoading(true);
    const pos = SPREADS[spread].positions;
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
      const res = await fetch(`${API_BASE}/tools/tarot-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: question.trim(), spread, cards }),
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
  }, [drawn, spread, question]);

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
          {([1, 3] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpread(s)}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                spread === s ? 'border-gold bg-gold/10 text-gold' : 'border-foreground/15 text-muted-foreground hover:border-gold/40'
              }`}
            >
              {SPREADS[s].label}
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
            <button
              type="button"
              onClick={() => void onDeepRead()}
              className="w-full rounded-md border border-gold/40 px-6 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/10 sm:w-auto sm:px-10"
            >
              ✨ Đọc sâu cùng AI →
            </button>
          )}

          <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Tarot ở đây là <b className="text-foreground/80">gợi ý để bạn tự suy ngẫm</b> về quyết định — không phải lời tiên đoán. Quyết định cuối cùng luôn là của bạn.
          </p>
          <a href="/onboarding" className="inline-block rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10">
            Ghép với Tử Vi + Bát Tự của tôi →
          </a>
        </div>
      )}
    </div>
  );
}
