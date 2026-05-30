'use client';

import * as React from 'react';
import { PersonalitySurvey } from '@/components/personality-survey';
import { scoreBigFive, type BigFiveScoreWithMeta } from '@/lib/scoring/big-five';
import { scoreDisc, type DiscScoreWithMeta } from '@/lib/scoring/disc';
import type { SurveyAnswers } from '@/lib/survey-schema';
import { track } from '@/lib/analytics';

const BIG5_META = [
  { key: 'openness', label: 'Cởi mở', desc: 'tò mò, sáng tạo, thích cái mới' },
  { key: 'conscientiousness', label: 'Tận tâm', desc: 'kỷ luật, có tổ chức, đáng tin' },
  { key: 'extraversion', label: 'Hướng ngoại', desc: 'lấy năng lượng từ tương tác' },
  { key: 'agreeableness', label: 'Dễ chịu', desc: 'hợp tác, đồng cảm, vị tha' },
  { key: 'neuroticism', label: 'Nhạy cảm cảm xúc', desc: 'mức phản ứng với căng thẳng' },
] as const;

const DISC_META = [
  { key: 'dominance', label: 'D · Quyết đoán', desc: 'thẳng thắn, hướng kết quả' },
  { key: 'influence', label: 'I · Ảnh hưởng', desc: 'nhiệt tình, thuyết phục, kết nối' },
  { key: 'steadiness', label: 'S · Kiên định', desc: 'ổn định, kiên nhẫn, hỗ trợ' },
  { key: 'compliance', label: 'C · Tuân thủ', desc: 'chính xác, phân tích, chuẩn mực' },
] as const;

function Bar({ label, desc, value, highlight }: { label: string; desc: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={highlight ? 'font-semibold text-gold' : 'font-medium text-foreground'}>{label}</span>
        <span className="font-mono text-sm text-muted-foreground">{value}<span className="text-foreground/30">/100</span></span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/10">
        <div className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function BigFiveSection({ big5 }: { big5: BigFiveScoreWithMeta }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground">Big Five (OCEAN)</h2>
      <p className="mt-1 text-sm text-muted-foreground">Năm chiều tính cách nền tảng — đây là thiên hướng, không phải định mệnh.</p>
      <div className="mt-5 space-y-5">
        {BIG5_META.map((t) => <Bar key={t.key} label={t.label} desc={t.desc} value={big5.scores[t.key]} />)}
      </div>
    </section>
  );
}

function DiscSection({ disc }: { disc: DiscScoreWithMeta }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground">DISC · phong cách hành vi</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Nổi trội: <span className="font-medium text-gold">{DISC_META.find((d) => d.key === disc.primary_style)?.label}</span>
        {' '}· phụ: {DISC_META.find((d) => d.key === disc.secondary_style)?.label}
      </p>
      <div className="mt-5 space-y-5">
        {DISC_META.map((d) => (
          <Bar key={d.key} label={d.label} desc={d.desc} value={disc.scores[d.key]} highlight={d.key === disc.primary_style} />
        ))}
      </div>
    </section>
  );
}

export function PersonalityTool({ primaryFirst = 'big-five' }: { primaryFirst?: 'big-five' | 'disc' }) {
  const [big5, setBig5] = React.useState<BigFiveScoreWithMeta | null>(null);
  const [disc, setDisc] = React.useState<DiscScoreWithMeta | null>(null);

  const handleComplete = React.useCallback((answers: SurveyAnswers) => {
    const a = answers as Record<string, number>;
    setBig5(scoreBigFive(a));
    setDisc(scoreDisc(a));
    track('tool_used', { tool: primaryFirst === 'disc' ? 'disc' : 'big-five', result: 'ok' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [primaryFirst]);

  if (big5 == null || disc == null) {
    return (
      <div className="mx-auto max-w-3xl">
        <PersonalitySurvey variant="extended" onComplete={handleComplete} />
      </div>
    );
  }

  const confidence = Math.round((big5.total_answered / big5.total_items) * 100);
  const sections = primaryFirst === 'disc'
    ? [<DiscSection key="d" disc={disc} />, <BigFiveSection key="b" big5={big5} />]
    : [<BigFiveSection key="b" big5={big5} />, <DiscSection key="d" disc={disc} />];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {confidence < 80 && (
        <p className="rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm text-muted-foreground">
          Bạn mới trả lời {confidence}% số câu — kết quả chỉ mang tính tham khảo. Làm đủ để chính xác hơn.
        </p>
      )}
      {sections}
      <div className="flex flex-wrap gap-3 border-t border-foreground/10 pt-6">
        <button type="button" onClick={() => { setBig5(null); setDisc(null); }} className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10">
          ↻ Làm lại
        </button>
        <a href="/onboarding" className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
          Ghép với Tử Vi + Bát Tự của tôi →
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        Big Five &amp; DISC là khung tâm lý học để tự nhận thức — hieu.asia dùng chúng cùng Tử Vi, Bát Tự, Thần Số để cho một bức tranh, không thay bạn quyết định.
      </p>
    </div>
  );
}
