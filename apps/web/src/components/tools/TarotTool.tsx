'use client';

import * as React from 'react';
import { drawCards, type DrawnCard } from '@/lib/tools/tarot';
import { track } from '@/lib/analytics';

const SPREADS = {
  1: { label: 'Một lá · soi hôm nay', positions: ['Hôm nay'] },
  3: { label: 'Ba lá · bối cảnh', positions: ['Bối cảnh', 'Thử thách', 'Hướng đi'] },
} as const;

export function TarotTool() {
  const [question, setQuestion] = React.useState('');
  const [spread, setSpread] = React.useState<1 | 3>(3);
  const [drawn, setDrawn] = React.useState<DrawnCard[] | null>(null);

  const onDraw = React.useCallback(() => {
    setDrawn(drawCards(spread));
    track('tool_used', { tool: 'tarot', result: 'ok' });
  }, [spread]);

  const positions = SPREADS[spread].positions;

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
